"use client";
import dynamic from "next/dynamic";
import Dashboard from "@/components/Dashboard";

const Loading = () => <div className="h-[480px] animate-pulse rounded-3xl bg-white/5" />;
const McvScene = dynamic(() => import("@/components/McvScene"), { ssr: false, loading: Loading });
const FrogJumpScene = dynamic(() => import("@/components/FrogJumpScene"), { ssr: false, loading: Loading });
const SuvScene = dynamic(() => import("@/components/SuvScene"), { ssr: false, loading: Loading });

const GITHUB = "#"; // your repository URL
const COMMUNITY = "#"; // your Discord / forum URL

const PILLARS = [
  { title: "AI control center", body: "One intelligence surveys the terrain, drafts the base blueprint, and dispatches every vehicle, robot and drone." },
  { title: "Humanoid agents", body: "General-purpose humanoids act as the hands of the system: assembly, maintenance and repair without a crew on site." },
  { title: "Self-building machines", body: "Construction units mine, melt and 3D-print metal until they can build more construction units." },
];
const MODULES = [
  ["MCV core", "Control center, initial power, charging station. Transforms from compact to extended mode."],
  ["Nuclear power unit", "Folded in transit, deploys radiators after landing for baseload energy."],
  ["Wind power unit", "Mast and rotor unfold to add renewable supply."],
  ["Robot factory", "Roof opens to a 3D metal printing and robot assembly cell."],
  ["Mining unit", "Boom drill extracts and feeds raw material into production."],
  ["Space Utility Vehicle", "Nuclear-battery rover with haul, drill, crane and scout modes."],
];

function Cta({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <a href={GITHUB} className="rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-black transition hover:bg-cyan-300">Star on GitHub</a>
      <a href={COMMUNITY} className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold transition hover:bg-white/10">Join the build</a>
    </div>
  );
}

function Section({ id, eyebrow, title, lead, children }: { id: string; eyebrow: string; title: string; lead: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-6 py-20">
      <p className="text-xs font-medium uppercase tracking-[0.25em] text-cyan-400">{eyebrow}</p>
      <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight md:text-5xl">{title}</h2>
      <p className="mt-4 max-w-2xl text-white/60">{lead}</p>
      <div className="mt-10">{children}</div>
    </section>
  );
}

export default function Page() {
  return (
    <main className="min-h-screen bg-[#07080b] text-white antialiased">
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#07080b]/80 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="font-semibold tracking-tight">Open Mars Base</span>
          <div className="hidden gap-8 text-sm text-white/60 md:flex">
            <a href="#mcv" className="hover:text-white">MCV</a>
            <a href="#frog-jump" className="hover:text-white">Frog jump</a>
            <a href="#suv" className="hover:text-white">Utility vehicle</a>
            <a href="#progress" className="hover:text-white">Progress</a>
          </div>
          <a href={GITHUB} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black">GitHub</a>
        </nav>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_70%_0%,rgba(234,88,12,0.25),transparent),radial-gradient(40%_40%_at_10%_20%,rgba(34,211,238,0.15),transparent)]" />
        <div className="relative mx-auto max-w-6xl px-6 pb-16 pt-24 md:pt-32">
          <p className="inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs text-white/70">Open source · Built in public</p>
          <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
            Land one machine.<br />
            <span className="bg-gradient-to-r from-cyan-300 to-orange-400 bg-clip-text text-transparent">It builds the base.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/60">
            An open-source Mobile Construction Vehicle that lands on Mars, unfolds into a control center, power plant and robot factory, and grows a base with minimal human involvement.
          </p>
          <Cta className="mt-8" />
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-6 md:grid-cols-3">
        {PILLARS.map((p) => (
          <div key={p.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h3 className="text-lg font-semibold">{p.title}</h3>
            <p className="mt-2 text-sm text-white/60">{p.body}</p>
          </div>
        ))}
      </section>

      <Section id="mcv" eyebrow="The MCV" title="A base that drives off the lander and unfolds."
        lead="Inspired by the MCV of real-time strategy games: one core and four wheeled dock containers travel folded, then hook together and deploy on the surface. Drag to orbit.">
        <McvScene />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {MODULES.map(([t, b]) => (
            <div key={t} className="rounded-2xl bg-white/5 p-5">
              <h4 className="font-medium">{t}</h4>
              <p className="mt-1 text-sm text-white/60">{b}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="frog-jump" eyebrow="Transport" title="Frog jump: a chain of smart docking nodes."
        lead="Cargo hops between nuclear-battery nodes that extend once positioned. Each node has its own AI control, drones and humanoids, plus mining and transport functions, and together they form a permanent network between origin and destination.">
        <FrogJumpScene />
      </Section>

      <Section id="suv" eyebrow="Space Utility Vehicle" title="One nuclear-battery chassis, many jobs."
        lead="The first vehicle out of the MCV. Switch modes to see how the same platform hauls, drills, lifts and scouts.">
        <SuvScene />
      </Section>

      <Section id="progress" eyebrow="Progress" title="Where the project stands."
        lead="Every workstream is tracked in the open. Pick one and start contributing.">
        <Dashboard />
      </Section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="rounded-3xl bg-gradient-to-br from-cyan-400/20 via-transparent to-orange-500/20 p-10 text-center md:p-16">
          <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">Help build the first autonomous base.</h2>
          <p className="mx-auto mt-4 max-w-xl text-white/60">Robotics, AI, mechanical design, simulation, docs. There is an open issue with your name on it.</p>
          <Cta className="mt-8 justify-center" />
        </div>
        <p className="mt-10 text-center text-xs text-white/30">Open Mars Base · Open source</p>
      </section>
    </main>
  );
}
