// Sample data: replace with your GitHub / project-tracker API.
const KPIS = [
  { label: "Contributors", value: "128" }, { label: "Repositories", value: "9" },
  { label: "Simulations run", value: "2,410" }, { label: "Open issues", value: "73" },
];
const STREAMS = [
  { name: "AI control center", pct: 42, status: "Prototype" },
  { name: "MCV core & transform mechanics", pct: 28, status: "Design" },
  { name: "Dock containers (nuclear, wind, factory, mining)", pct: 22, status: "Design" },
  { name: "Humanoid agents", pct: 35, status: "Simulation" },
  { name: "Space Utility Vehicle", pct: 30, status: "Simulation" },
  { name: "Frog-jump docking nodes", pct: 15, status: "Concept" },
  { name: "3D metal printing & self-replication", pct: 10, status: "Research" },
];
const ROADMAP = [
  { phase: "Phase 0", title: "Open spec & digital twin", state: "active" },
  { phase: "Phase 1", title: "Earth analog MCV prototype", state: "next" },
  { phase: "Phase 2", title: "Orbital docking node demo", state: "later" },
  { phase: "Phase 3", title: "Earth–Mars node network", state: "later" },
  { phase: "Phase 4", title: "MCV landing & autonomous base", state: "later" },
];

export default function Dashboard() {
  const overall = Math.round(STREAMS.reduce((a, s) => a + s.pct, 0) / STREAMS.length);
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <div className="col-span-2 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-orange-500/10 p-5 md:col-span-1">
          <p className="text-xs uppercase tracking-widest text-white/50">Overall</p>
          <p className="mt-1 text-4xl font-semibold">{overall}%</p>
        </div>
        {KPIS.map((k) => (
          <div key={k.label} className="rounded-2xl bg-white/5 p-5">
            <p className="text-xs uppercase tracking-widest text-white/50">{k.label}</p>
            <p className="mt-1 text-2xl font-semibold">{k.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 grid gap-8 md:grid-cols-3">
        <div className="space-y-4 md:col-span-2">
          <h3 className="text-sm font-medium text-white/60">Workstreams</h3>
          {STREAMS.map((s) => (
            <div key={s.name}>
              <div className="mb-1 flex justify-between text-sm">
                <span>{s.name}</span>
                <span className="text-white/50">{s.status} · {s.pct}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/10">
                <div className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-orange-400" style={{ width: `${s.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div>
          <h3 className="mb-4 text-sm font-medium text-white/60">Roadmap</h3>
          <ol className="space-y-4 border-l border-white/10 pl-5">
            {ROADMAP.map((r) => (
              <li key={r.phase} className="relative">
                <span className={`absolute -left-[26px] top-1.5 h-2.5 w-2.5 rounded-full ${r.state === "active" ? "bg-cyan-400 shadow-[0_0_12px_#22d3ee]" : r.state === "next" ? "bg-orange-400" : "bg-white/20"}`} />
                <p className="text-xs text-white/40">{r.phase}</p>
                <p className="text-sm">{r.title}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <p className="mt-6 text-xs text-white/30">Figures shown are sample data.</p>
    </div>
  );
}
