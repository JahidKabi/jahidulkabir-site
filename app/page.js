import Headline from "./Headline";
import Contributions from "./Contributions";
import { links, work, certs, education, fallbackProjects } from "./data";

// Re-generate this page at most once an hour (incremental static regeneration).
export const revalidate = 3600;

const CAREER_START = new Date("2020-04-01");

async function gh(path) {
  const res = await fetch(`https://api.github.com${path}`, {
    next: { revalidate: 3600 },
    headers: { Accept: "application/vnd.github+json" },
  });
  if (!res.ok) throw new Error(`GitHub API ${res.status}`);
  return res.json();
}

async function getGithub() {
  try {
    const [user, repos] = await Promise.all([
      gh("/users/JahidKabi"),
      gh("/users/JahidKabi/repos?per_page=100&sort=pushed"),
    ]);
    const own = repos.filter((r) => !r.fork && r.name !== "JahidKabi");
    return {
      projects: own.length
        ? own.slice(0, 6).map((r) => ({ name: r.name, url: r.html_url, meta: r.language || "" }))
        : fallbackProjects,
      publicRepos: user.public_repos,
      lastPush: own[0]?.pushed_at ? new Date(own[0].pushed_at) : new Date(),
    };
  } catch {
    return { projects: fallbackProjects, publicRepos: null, lastPush: new Date() };
  }
}

const fmt = (d) =>
  d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

export default async function Home() {
  const { projects, lastPush } = await getGithub();
  const years = Math.floor((Date.now() - CAREER_START) / (365.25 * 24 * 3600 * 1000));

  return (
    <main>
      <p className="updated">Updated {fmt(lastPush)}</p>

      <p className="hello">Hi, I'm Jahid.</p>
      <Headline />

      <p>
        Cloud DevOps engineer at <span className="chip">Integromix</span>, and remote SME Lead
        supporting <span className="chip">Microsoft</span> on Azure DevOps, Azure Identity, and other Microsoft 365 cloud products.{" "}
        <span className="num">{years}+</span> years in tech and{" "}
        <span className="num">{certs.length}</span> cloud certifications.
      </p>
        I design CI/CD pipelines, containerize applications with Docker, and automate
  infrastructure across AWS and Azure. I also guide Microsoft engineers in mitigating
  complex Azure DevOps issues. Earlier, I spent five years at{" "}
  <span className="chip">Wicresoft</span>, a Microsoft joint-venture company, where I solved
  complex technical issues for large enterprises, worked with Microsoft engineering to get
  product bugs fixed, and helped customers scale with minimal impact on production. My work
  covered Microsoft 365, Exchange, Active Directory, Intune, Copilot and Graph API, Power BI,
  and security and compliance. I led two teams and handled high-severity incidents.
      <p>
        Find me on <a href={links.linkedin} rel="me">LinkedIn</a>,{" "}
        <a href={links.github} rel="me">GitHub</a>, or <a href={links.email}>email me</a>.
      </p>

      <h2>Work</h2>
      <ul>
        {work.map((w) => (
          <li key={w.role + w.dates}>
            <span>{w.company}<span className="role">{w.role}</span></span>
            <span>{w.dates}</span>
          </li>
        ))}
      </ul>

      <h2>Projects</h2>
      <ul>
        {projects.map((p) => (
          <li key={p.name}>
            <a href={p.url}>{p.name}</a>
            <span>{p.meta}</span>
          </li>
        ))}
      </ul>

      <Contributions user="JahidKabi" href={links.github} />

      <h2>Certifications</h2>
      <ul>
        {certs.map((c) => (
          <li key={c.name}><span>{c.name}</span><span>{c.year}</span></li>
        ))}
      </ul>

      <h2>Education</h2>
      <ul>
        {education.map((e) => (
          <li key={e.name}>
            <span>{e.name}<span className="role">{e.school}</span></span>
            <span>{e.dates}</span>
          </li>
        ))}
      </ul>

      <footer>Dhaka, Bangladesh</footer>
    </main>
  );
}