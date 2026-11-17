"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, Html } from "@react-three/drei";
import { Anim, Metal, ss, lerp } from "./three-utils";

const LOOP = 18;
const PTS: [number, number][] = [[-9, 0], [-6, 1.2], [-3, 2], [0, 2.3], [3, 2], [6, 1.2], [9, 0]];
const A = (k: number) => 2 + 2.4 * k; // arrival time of hop k

function Node({ i }: { i: number }) {
  const [x, y] = PTS[i + 1];
  const ext = (t: number) => ss(t % LOOP, A(i), A(i) + 1.2);
  return (
    <Anim position={[x, y, 0]} update={(o, t) => {
      o.visible = t % LOOP >= A(i) - 0.05; o.rotation.y = t * 0.3; o.scale.setScalar(lerp(0.3, 1, ext(t)));
    }}>
      <mesh><octahedronGeometry args={[0.28]} /><Metal color="#dfe5ec" /></mesh>
      {[0, 1, 2, 3].map((k) => (
        <group key={k} rotation={[0, 0, (k * Math.PI) / 2]}>
          <Anim update={(o, t) => { o.scale.x = Math.max(ext(t), 0.01); }}>
            <mesh position={[0.6, 0, 0]}><boxGeometry args={[0.9, 0.04, 0.04]} /><Metal /></mesh>
            <mesh position={[1.05, 0, 0]}><boxGeometry args={[0.3, 0.3, 0.02]} /><Metal color="#1e40af" /></mesh>
          </Anim>
        </group>
      ))}
      {/* nuclear-battery docking ring */}
      <Anim update={(o, t) => { o.scale.setScalar(Math.max(ext(t), 0.01)); o.rotation.x = t; }}>
        <mesh><torusGeometry args={[0.5, 0.03, 8, 40]} /><Metal color="#22d3ee" glow={2} /></mesh>
      </Anim>
      {/* agent drones */}
      {[0, 1].map((d) => (
        <Anim key={d} update={(o, t) => {
          const p = ext(t), a = t * 1.5 + d * Math.PI;
          o.visible = p > 0.01; o.position.set(Math.cos(a) * 1.4 * p, Math.sin(a * 1.3) * 0.3, Math.sin(a) * 1.4 * p);
        }}>
          <mesh><sphereGeometry args={[0.05, 8, 8]} /><Metal color="#fbbf24" glow={3} /></mesh>
        </Anim>
      ))}
    </Anim>
  );
}

const label = "rounded bg-black/60 px-2 py-0.5 text-xs text-white/80";

export default function FrogJumpScene() {
  return (
    <div className="relative h-[480px] w-full overflow-hidden rounded-3xl border border-white/10">
      <Canvas camera={{ position: [0, 1, 16], fov: 45 }}>
        <color attach="background" args={["#03050a"]} />
        <Stars radius={80} depth={40} count={4000} factor={3} fade />
        <ambientLight intensity={0.5} />
        <directionalLight position={[-10, 6, 10]} intensity={2.5} />
        <mesh position={[-9, 0, 0]}><sphereGeometry args={[1.6, 48, 48]} /><meshStandardMaterial color="#2563eb" emissive="#0b3a8f" emissiveIntensity={0.4} roughness={0.7} /><Html center position={[0, -2.1, 0]}><span className={label}>Earth</span></Html></mesh>
        <mesh position={[9, 0, 0]}><sphereGeometry args={[1.2, 48, 48]} /><meshStandardMaterial color="#c2410c" emissive="#7c2d12" emissiveIntensity={0.3} roughness={0.9} /><Html center position={[0, -1.7, 0]}><span className={label}>Mars</span></Html></mesh>
        {[0, 1, 2, 3, 4].map((i) => <Node key={i} i={i} />)}
        {/* network links grow behind the transport */}
        {[0, 1, 2, 3, 4, 5].map((k) => {
          const [x1, y1] = PTS[k], [x2, y2] = PTS[k + 1], len = Math.hypot(x2 - x1, y2 - y1);
          return (
            <Anim key={k} position={[x1, y1, 0]} rotation={[0, 0, Math.atan2(y2 - y1, x2 - x1)]}
              update={(o, t) => { o.scale.x = Math.max(len * ss(t % LOOP, A(k) - 1.4, A(k)), 0.001); }}>
              <mesh position={[0.5, 0, 0]}><boxGeometry args={[1, 0.025, 0.025]} /><meshBasicMaterial color="#22d3ee" /></mesh>
            </Anim>
          );
        })}
        {/* transport performing the frog jump */}
        <Anim update={(o, t) => {
          const u = t % LOOP; let [x, y] = PTS[0];
          for (let k = 0; k < 6; k++) {
            const f = ss(u, A(k) - 1.4, A(k));
            if (f > 0) { x = lerp(PTS[k][0], PTS[k + 1][0], f); y = lerp(PTS[k][1], PTS[k + 1][1], f) + Math.sin(Math.PI * f) * 0.9; }
          }
          o.position.set(x, y, 0.6);
        }}>
          <mesh rotation={[0, 0, -Math.PI / 2]}><capsuleGeometry args={[0.12, 0.4, 4, 12]} /><Metal color="#f8fafc" /></mesh>
          <mesh position={[-0.35, 0, 0]}><sphereGeometry args={[0.08, 8, 8]} /><Metal color="#fb923c" glow={4} /></mesh>
        </Anim>
        <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={1.1} maxPolarAngle={1.9} />
      </Canvas>
      <p className="pointer-events-none absolute bottom-5 left-6 right-6 text-sm text-white/70">
        The transport hops node to node. Each smart docking node extends on station, runs its own AI control, and joins the Earth–Mars relay network.
      </p>
    </div>
  );
}
