"use client";

import { useEffect, useState } from "react";

// Each set is one full sentence: [thinks in, builds with, cares about].
const SETS = [
  [{ icon: "workflow", text: "pipelines" }, { icon: "docker", text: "Docker" }, { icon: "shield-check", text: "reliability" }],
  [{ icon: "layers", text: "systems" }, { icon: "github-actions", text: "GitHub Actions" }, { icon: "timer", text: "zero downtime" }],
  [{ icon: "bot", text: "automation" }, { icon: "aws", text: "AWS" }, { icon: "package", text: "boring releases" }],
  [{ icon: "server", text: "infrastructure" }, { icon: "linux", text: "Linux" }, { icon: "lock", text: "security" }],
];

export default function Headline() {
  const [i, setI] = useState(0);

  // Start on a random sentence after load, like the reference site.
  useEffect(() => {
    setI(Math.floor(Math.random() * SETS.length));
  }, []);

  // Auto-change every 3 seconds. The timer restarts whenever the sentence
  // changes (including after a click), so a click never double-advances.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setI((n) => (n + 1) % SETS.length), 5000);
    return () => clearTimeout(t);
  }, [i]);

  const next = () => setI((n) => (n + 1) % SETS.length);
  const [a, b, c] = SETS[i];

  const pill = (item) => (
    <button type="button" className="pill" onClick={next} title="Click to change">
      <span key={i + item.text} className="pill-in">
        <img className="pill-icon" src={`/icons/${item.icon}.svg`} alt="" width="24" height="24" />
        {item.text}
      </span>
    </button>
  );

  return (
    <h1>
      I think in {pill(a)}, build with {pill(b)}, and care about {pill(c)}.
    </h1>
  );
}