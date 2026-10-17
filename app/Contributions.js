const LEVELS = ["#1f1f1f", "#3d3d3d", "#6e6e6e", "#a8a8a8", "#f2f2f2"];

// Server component: pulls the last year of public GitHub contributions.
export default async function Contributions({ user, href }) {
  let data;
  try {
    const res = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${user}?y=last`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) throw new Error(`contributions API ${res.status}`);
    data = await res.json();
  } catch {
    return null; // hide the section instead of showing wrong numbers
  }

  const days = data.contributions || [];
  if (!days.length) return null;
  const total = Object.values(data.total || {}).reduce((a, b) => a + b, 0);
  const lead = new Date(`${days[0].date}T00:00:00Z`).getUTCDay(); // pad first week

  return (
    <>
      <h2>GitHub</h2>
      <div className="contrib" role="img" aria-label={`${total} contributions in the last year`}>
        {Array.from({ length: lead }, (_, k) => <i key={`b${k}`} className="blank" />)}
        {days.map((d) => (
          <i
            key={d.date}
            title={`${d.count} contributions on ${d.date}`}
            style={{ background: LEVELS[d.level] }}
          />
        ))}
      </div>
      <div className="contrib-meta">
        <span>{total.toLocaleString("en-US")} contributions in the last year</span>
        <a href={href}>@{user}</a>
      </div>
    </>
  );
}
