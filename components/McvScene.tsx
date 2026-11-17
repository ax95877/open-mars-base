"use client";
import { useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Anim, Metal, Wheels, Rover, MarsGround, MarsLights, ss, lerp } from "./three-utils";

const LOOP = 24;
const PHASES = [
  { at: 0, label: "Landing", note: "The MCV train touches down in compact transport mode." },
  { at: 3, label: "Undock", note: "Wheeled containers roll out and hook to the core." },
  { at: 7, label: "Core transform", note: "The core extends its wings, mast and comms dish." },
  { at: 10, label: "Unfold", note: "Reactor, wind turbine, robot factory and mining rig deploy." },
  { at: 14, label: "Dispatch", note: "Humanoids and the Space Utility Vehicle roll out." },
];
const MODS = [
  { home: [-2.75, 0], out: [-5, -3.5], color: "#8fa3b8" }, // nuclear
  { home: [-5.25, 0], out: [-5, 3.5], color: "#b8c4cf" },  // wind
  { home: [2.75, 0], out: [5, -3.5], color: "#c9a26b" },   // robot factory
  { home: [5.25, 0], out: [5, 3.5], color: "#b5654a" },    // mining
];
const modPos = (i: number, t: number) => {
  const p = ss(t % LOOP, 3, 7), m = MODS[i];
  return [lerp(m.home[0], m.out[0], p), lerp(m.home[1], m.out[1], p)];
};
const unfold = (t: number) => ss(t % LOOP, 10, 14);
const coreP = (t: number) => ss(t % LOOP, 7, 10);

function Module({ i, children }: { i: number; children?: ReactNode }) {
  return (
    <>
      <Anim update={(o, t) => { const [x, z] = modPos(i, t); o.position.set(x, 0, z); }}>
        <mesh position={[0, 0.95, 0]} castShadow><boxGeometry args={[2.4, 1.1, 1.4]} /><Metal color={MODS[i].color} /></mesh>
        <Wheels xs={[-0.8, 0.8]} z={0.75} />
        {children}
      </Anim>
      {/* hook / power umbilical back to the core */}
      <Anim update={(o, t) => {
        const [x, z] = modPos(i, t);
        o.position.set(x / 2, 0.55, z / 2); o.rotation.y = Math.atan2(x, z); o.scale.z = Math.hypot(x, z);
      }}>
        <mesh><boxGeometry args={[0.1, 0.1, 1]} /><Metal color="#22d3ee" glow={0.8} /></mesh>
      </Anim>
    </>
  );
}

function Core() {
  return (
    <group>
      <mesh position={[0, 1.1, 0]} castShadow><boxGeometry args={[3, 1.6, 2.2]} /><Metal color="#eef1f5" /></mesh>
      <mesh position={[0, 1.1, 1.11]}><boxGeometry args={[1.6, 0.12, 0.02]} /><Metal color="#22d3ee" glow={2} /></mesh>
      {[1, -1].map((s) => (
        <Anim key={s} update={(o, t) => { o.position.set(s * lerp(0.75, 2.1, coreP(t)), 0.95, 0); }}>
          <mesh castShadow><boxGeometry args={[1.4, 1.2, 2]} /><Metal color="#cfd6de" /></mesh>
        </Anim>
      ))}
      <Anim update={(o, t) => { o.position.y = lerp(0.95, 2.7, coreP(t)); }}>
        <mesh castShadow><cylinderGeometry args={[0.08, 0.12, 1.6, 12]} /><Metal /></mesh>
        <Anim position={[0, 0.9, 0]} update={(o, t) => { o.scale.setScalar(Math.max(coreP(t), 0.01)); o.rotation.y = t * 0.6; }}>
          <mesh rotation={[0.9, 0, 0]}><coneGeometry args={[0.6, 0.3, 24]} /><Metal color="#f8fafc" /></mesh>
        </Anim>
      </Anim>
      <Wheels xs={[-1, 0, 1]} z={1.15} r={0.4} />
    </group>
  );
}

function Robots() {
  return (
    <>
      {[0, 1, 2, 3].map((i) => (
        <Anim key={i} update={(o, t) => {
          const p = ss(t % LOOP, 14 + i * 0.3, 17 + i * 0.3);
          o.visible = p > 0.01;
          o.position.set((i - 1.5) * lerp(0.2, 1.3, p), p < 1 ? Math.abs(Math.sin(t * 6 + i)) * 0.05 : 0, lerp(0.8, 3.4, p));
        }}>
          <mesh position={[0, 0.55, 0]} castShadow><capsuleGeometry args={[0.14, 0.5, 4, 12]} /><Metal color="#f1f5f9" /></mesh>
          <mesh position={[0, 1.05, 0]}><sphereGeometry args={[0.13, 16, 16]} /><Metal color="#0f172a" /></mesh>
          <mesh position={[0, 1.06, 0.11]}><boxGeometry args={[0.16, 0.04, 0.04]} /><Metal color="#22d3ee" glow={3} /></mesh>
        </Anim>
      ))}
    </>
  );
}

function PhaseWatcher({ onPhase }: { onPhase: (i: number) => void }) {
  const last = useRef(-1);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime % LOOP;
    let i = 0;
    PHASES.forEach((p, k) => { if (t >= p.at) i = k; });
    if (i !== last.current) { last.current = i; onPhase(i); }
  });
  return null;
}

export default function McvScene() {
  const [phase, setPhase] = useState(0);
  return (
    <div className="relative h-[560px] w-full overflow-hidden rounded-3xl border border-white/10">
      <Canvas shadows camera={{ position: [11, 7, 13], fov: 40 }}>
        <MarsLights />
        <MarsGround />
        <PhaseWatcher onPhase={setPhase} />
        {/* whole train descends during landing */}
        <Anim update={(o, t) => { o.position.y = lerp(9, 0, ss(t % LOOP, 0, 3)); }}>
          <Anim position={[0, -0.6, 0]} rotation={[Math.PI, 0, 0]} update={(o, t) => {
            const p = ss(t % LOOP, 0, 3); o.visible = p < 0.98; o.scale.setScalar(1 + Math.sin(t * 40) * 0.15);
          }}>
            <mesh><coneGeometry args={[0.7, 2.4, 16]} /><meshBasicMaterial color="#fdba74" transparent opacity={0.8} /></mesh>
          </Anim>
          <Core />
          <Module i={0}>
            <mesh position={[0, 1.6, 0]}><cylinderGeometry args={[0.2, 0.2, 0.3, 24]} /><Metal color="#22d3ee" glow={1.5} /></mesh>
            {[1, -1].map((s) => (
              <Anim key={s} position={[0, 1.52, s * 0.7]} update={(o, t) => { o.rotation.x = -s * unfold(t) * Math.PI; }}>
                <mesh position={[0, 0, -s * 0.35]} castShadow><boxGeometry args={[2.2, 0.04, 0.65]} /><Metal color="#e5e7eb" /></mesh>
              </Anim>
            ))}
          </Module>
          <Module i={1}>
            <Anim position={[0, 1.5, 0]} update={(o, t) => { o.scale.y = Math.max(unfold(t), 0.01); }}>
              <mesh position={[0, 1.5, 0]} castShadow><cylinderGeometry args={[0.06, 0.1, 3, 12]} /><Metal /></mesh>
            </Anim>
            <Anim update={(o, t) => {
              const p = unfold(t);
              o.position.set(0, 1.5 + 3 * p, 0.14); o.scale.setScalar(Math.max(p, 0.01)); o.rotation.z = t * 4 * p;
            }}>
              {[0, 1, 2].map((k) => (
                <group key={k} rotation={[0, 0, k * 2.094]}>
                  <mesh position={[0, 0.75, 0]}><boxGeometry args={[0.14, 1.5, 0.03]} /><Metal color="#f8fafc" /></mesh>
                </group>
              ))}
            </Anim>
          </Module>
          <Module i={2}>
            {[1, -1].map((s) => (
              <Anim key={s} update={(o, t) => { o.position.set(s * (0.6 + 1.1 * unfold(t)), 1.54, 0); }}>
                <mesh castShadow><boxGeometry args={[1.2, 0.06, 1.4]} /><Metal color="#e5e7eb" /></mesh>
              </Anim>
            ))}
            <Anim position={[0, 1.5, 0]} update={(o, t) => { o.scale.setScalar(Math.max(unfold(t), 0.01)); o.rotation.y = Math.sin(t) * 1.2; }}>
              <mesh position={[0, 0.4, 0]}><cylinderGeometry args={[0.08, 0.08, 0.8, 12]} /><Metal /></mesh>
              <mesh position={[0.35, 0.8, 0]}><boxGeometry args={[0.8, 0.08, 0.08]} /><Metal /></mesh>
              <mesh position={[0.72, 0.68, 0]}><sphereGeometry args={[0.07, 12, 12]} /><Metal color="#fb923c" glow={3} /></mesh>
            </Anim>
          </Module>
          <Module i={3}>
            <Anim position={[1.1, 1.62, 0]} update={(o, t) => { o.rotation.z = lerp(Math.PI, -0.5, unfold(t)); }}>
              <mesh position={[1, 0, 0]} castShadow><boxGeometry args={[2, 0.16, 0.16]} /><Metal color="#f59e0b" /></mesh>
              <Anim position={[2.1, 0, 0]} update={(o, t) => { o.rotation.x = t * 8 * unfold(t); }}>
                <mesh rotation={[0, 0, -Math.PI / 2]}><coneGeometry args={[0.22, 0.6, 10]} /><Metal color="#475569" /></mesh>
              </Anim>
            </Anim>
          </Module>
          <Robots />
          <Anim update={(o, t) => { const p = ss(t % LOOP, 15.5, 19.5); o.visible = p > 0.01; o.position.set(0, 0, lerp(0, 7, p)); }}>
            <group rotation={[0, -Math.PI / 2, 0]} scale={0.6}><Rover /></group>
          </Anim>
        </Anim>
        <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={1.45} autoRotate autoRotateSpeed={0.4} target={[0, 1, 0]} />
      </Canvas>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6">
        <div className="mb-3 flex flex-wrap gap-2">
          {PHASES.map((p, i) => (
            <span key={p.label} className={`rounded-full px-3 py-1 text-xs font-medium ${i === phase ? "bg-cyan-400 text-black" : "bg-white/10 text-white/60"}`}>
              {i + 1}. {p.label}
            </span>
          ))}
        </div>
        <p className="text-sm text-white/80">{PHASES[phase].note}</p>
      </div>
    </div>
  );
}
