"use client";
import { useState, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Anim, Metal, Rover, MarsGround, MarsLights, lerp } from "./three-utils";

const MODES = [
  { id: "haul", label: "Haul", note: "Carries ore, parts and containers between sites." },
  { id: "drill", label: "Drill", note: "Front boom drill for sampling and mining." },
  { id: "crane", label: "Crane", note: "Lifts and places modules during construction." },
  { id: "scout", label: "Scout", note: "Survey mast and drone map terrain for the base blueprint." },
];

function Tool({ active, children }: { active: boolean; children: ReactNode }) {
  return (
    <Anim update={(o) => { o.scale.setScalar(lerp(o.scale.x, active ? 1 : 0.001, 0.12)); }}>{children}</Anim>
  );
}

export default function SuvScene() {
  const [mode, setMode] = useState("haul");
  const m = MODES.find((x) => x.id === mode)!;
  return (
    <div className="relative h-[480px] w-full overflow-hidden rounded-3xl border border-white/10">
      <Canvas shadows camera={{ position: [5, 3.5, 6], fov: 40 }}>
        <MarsLights />
        <MarsGround />
        <Anim update={(o, t) => { o.rotation.y = t * 0.25; }}>
          <Rover>
            <Tool active={mode === "haul"}>
              <mesh position={[-0.15, 1.3, 0]} castShadow><boxGeometry args={[1.1, 0.7, 1.3]} /><Metal color="#f59e0b" /></mesh>
            </Tool>
            <Tool active={mode === "drill"}>
              <group position={[1.5, 0.9, 0]} rotation={[0, 0, -0.45]}>
                <mesh position={[0.6, 0, 0]} castShadow><boxGeometry args={[1.2, 0.12, 0.12]} /><Metal color="#f59e0b" /></mesh>
                <Anim position={[1.4, 0, 0]} update={(o, t) => { o.rotation.x = t * 10; }}>
                  <mesh rotation={[0, 0, -Math.PI / 2]}><coneGeometry args={[0.2, 0.55, 10]} /><Metal color="#475569" /></mesh>
                </Anim>
              </group>
            </Tool>
            <Tool active={mode === "crane"}>
              <mesh position={[-0.15, 1.7, 0]} castShadow><cylinderGeometry args={[0.07, 0.09, 1.5, 12]} /><Metal /></mesh>
              <mesh position={[0.6, 2.45, 0]} castShadow><boxGeometry args={[1.8, 0.08, 0.08]} /><Metal color="#f59e0b" /></mesh>
              <mesh position={[1.4, 2.05, 0]}><cylinderGeometry args={[0.012, 0.012, 0.8, 6]} /><Metal /></mesh>
              <mesh position={[1.4, 1.6, 0]} castShadow><boxGeometry args={[0.3, 0.3, 0.3]} /><Metal color="#94a3b8" /></mesh>
            </Tool>
            <Tool active={mode === "scout"}>
              <mesh position={[-0.15, 1.55, 0]}><cylinderGeometry args={[0.04, 0.05, 1.2, 10]} /><Metal /></mesh>
              <mesh position={[-0.15, 2.2, 0]} rotation={[0.9, 0, 0]}><coneGeometry args={[0.35, 0.2, 24]} /><Metal color="#f8fafc" /></mesh>
              <Anim update={(o, t) => { o.position.set(Math.cos(t * 1.2) * 1.2, 2.9 + Math.sin(t * 2) * 0.1, Math.sin(t * 1.2) * 1.2); }}>
                <mesh><boxGeometry args={[0.3, 0.06, 0.3]} /><Metal color="#22d3ee" glow={1.5} /></mesh>
              </Anim>
            </Tool>
          </Rover>
        </Anim>
        <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={1.45} target={[0, 1.2, 0]} />
      </Canvas>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6">
        <div className="mb-3 flex flex-wrap gap-2">
          {MODES.map((x) => (
            <button key={x.id} onClick={() => setMode(x.id)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${x.id === mode ? "bg-cyan-400 text-black" : "bg-white/10 text-white/70 hover:bg-white/20"}`}>
              {x.label}
            </button>
          ))}
        </div>
        <p className="text-sm text-white/80">{m.note}</p>
      </div>
    </div>
  );
}
