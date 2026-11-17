"use client";
import { useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const ss = (t: number, a: number, b: number) => THREE.MathUtils.smoothstep(t, a, b);
export const lerp = THREE.MathUtils.lerp;
type V3 = [number, number, number];

/** Group whose transform is driven every frame by `update(group, elapsedSeconds)`. */
export function Anim({ update, children, position, rotation }: {
  update: (o: THREE.Group, t: number) => void;
  children?: ReactNode; position?: V3; rotation?: V3;
}) {
  const ref = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => update(ref.current, clock.elapsedTime));
  return <group ref={ref} position={position} rotation={rotation}>{children}</group>;
}

export function Metal({ color = "#c9ced6", glow = 0 }: { color?: string; glow?: number }) {
  return <meshStandardMaterial color={color} metalness={0.6} roughness={0.38} emissive={color} emissiveIntensity={glow} />;
}

export function Wheels({ xs, z, r = 0.32 }: { xs: number[]; z: number; r?: number }) {
  return (
    <>
      {xs.flatMap((x) => [1, -1].map((s) => (
        <mesh key={`${x}${s}`} position={[x, r, s * z]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[r, r, 0.26, 20]} />
          <meshStandardMaterial color="#1f2937" roughness={0.9} />
        </mesh>
      )))}
    </>
  );
}

/** Space Utility Vehicle base (faces +x). Tools are passed as children. */
export function Rover({ children }: { children?: ReactNode }) {
  return (
    <group>
      <mesh position={[0, 0.75, 0]} castShadow><boxGeometry args={[3, 0.4, 1.5]} /><Metal color="#d8dce3" /></mesh>
      <mesh position={[1, 1.25, 0]} castShadow><boxGeometry args={[0.9, 0.6, 1.3]} /><Metal color="#f2f4f7" /></mesh>
      <mesh position={[1.46, 1.3, 0]}><boxGeometry args={[0.02, 0.3, 1.1]} /><Metal color="#5eead4" glow={1.5} /></mesh>
      {/* nuclear battery */}
      <mesh position={[-1.25, 1.2, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.27, 0.27, 1.1, 24]} /><Metal color="#22d3ee" glow={1.2} />
      </mesh>
      <Wheels xs={[-1.1, 0, 1.1]} z={0.85} r={0.38} />
      {children}
    </group>
  );
}

export function MarsGround() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#8a3b1c" roughness={1} />
      </mesh>
      {Array.from({ length: 40 }, (_, i) => {
        const r = 9 + ((i * 7.3) % 30), a = i * 2.4, s = 0.2 + ((i * 0.37) % 0.6);
        return (
          <mesh key={i} position={[Math.cos(a) * r, s * 0.3, Math.sin(a) * r]} scale={s} castShadow>
            <dodecahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color="#6b2c14" roughness={1} />
          </mesh>
        );
      })}
    </>
  );
}

export function MarsLights() {
  return (
    <>
      <color attach="background" args={["#2a130b"]} />
      <fog attach="fog" args={["#2a130b", 25, 70]} />
      <hemisphereLight args={["#ffd9b8", "#3b1408", 0.9]} />
      <directionalLight position={[10, 14, 6]} intensity={2.4} castShadow shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-15} shadow-camera-right={15} shadow-camera-top={15} shadow-camera-bottom={-15} />
    </>
  );
}
