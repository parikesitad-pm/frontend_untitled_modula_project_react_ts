import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { podiumPlaces, type PodiumPlace } from '@/data/podium';

export interface PodiumHandle {
  /** Scroll progress of the podium beat, 0..1. Written by the scroll timeline, read per frame. */
  progress: React.MutableRefObject<number>;
  /** Set by the scene once mounted; the scroll timeline calls it so the demand loop renders a frame. */
  invalidate: React.MutableRefObject<(() => void) | null>;
}

const BLOCK_W = 1.4;
const BLOCK_D = 1.2;
const RISE = 0.45; // fraction of progress each block takes to rise

const backOut = (t: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2;
};
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const damp = (from: number, to: number, k: number, dt: number) => from + (to - from) * (1 - Math.exp(-k * dt));

/** Draws text onto a canvas once and wraps it as a texture for a plane. Caller disposes. */
function textTexture(text: string, { w, h, size, color }: { w: number; h: number; size: number; color: string }) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.font = `800 ${size}px "Barlow Condensed", "Arial Narrow", sans-serif`;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, w / 2, h / 2 + size * 0.04);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

const Block: React.FC<{ place: PodiumPlace; progress: React.MutableRefObject<number> }> = ({ place, progress }) => {
  const group = useRef<THREE.Group>(null);
  const plate = useRef<THREE.Mesh>(null);

  // Geometry pivots at its base so scaling Y grows it upward from the floor.
  const geometry = useMemo(() => {
    const g = new THREE.BoxGeometry(BLOCK_W, place.height, BLOCK_D);
    g.translate(0, place.height / 2, 0);
    return g;
  }, [place.height]);

  const [textures, setTextures] = useState<{ rank: THREE.CanvasTexture; name: THREE.CanvasTexture } | null>(null);
  useEffect(() => {
    let live = true;
    let made: { rank: THREE.CanvasTexture; name: THREE.CanvasTexture } | null = null;
    // Wait for the display font so the labels don't bake in the fallback face.
    document.fonts.load('800 64px "Barlow Condensed"').finally(() => {
      if (!live) return;
      made = {
        rank: textTexture(String(place.rank), { w: 256, h: 256, size: 200, color: '#0B0D10' }),
        name: textTexture(place.name.toUpperCase(), { w: 512, h: 128, size: 96, color: '#F2F4F7' }),
      };
      setTextures(made);
    });
    return () => {
      live = false;
      made?.rank.dispose();
      made?.name.dispose();
    };
  }, [place.rank, place.name]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame(() => {
    const p = progress.current;
    const rise = backOut(clamp01((p - place.delay) / RISE));
    if (group.current) group.current.scale.y = Math.max(0.001, rise);
    // Name plate drops in after its block has risen.
    const plateIn = backOut(clamp01((p - place.delay - RISE * 0.8) / 0.25));
    if (plate.current) {
      plate.current.scale.setScalar(Math.max(0.001, plateIn));
      plate.current.position.y = place.height + 0.45 + (1 - plateIn) * 0.6;
    }
  });

  return (
    <group position={[place.x, 0, 0]}>
      <group ref={group}>
        <mesh geometry={geometry}>
          <meshStandardMaterial color={place.color} roughness={0.45} metalness={place.rank === 1 ? 0.35 : 0.15} />
        </mesh>
        {textures && (
          <mesh position={[0, place.height * 0.62, BLOCK_D / 2 + 0.01]}>
            <planeGeometry args={[0.9, 0.9]} />
            <meshBasicMaterial map={textures.rank} transparent />
          </mesh>
        )}
      </group>
      {textures && (
        <mesh ref={plate}>
          <planeGeometry args={[1.6, 0.4]} />
          <meshBasicMaterial map={textures.name} transparent />
        </mesh>
      )}
    </group>
  );
};

/** Gentle cursor tilt; keeps requesting frames only until it settles. */
const Rig: React.FC<{ handle: PodiumHandle; children: React.ReactNode }> = ({ handle, children }) => {
  const rig = useRef<THREE.Group>(null);
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    handle.invalidate.current = invalidate;
    return () => {
      handle.invalidate.current = null;
    };
  }, [handle, invalidate]);

  useFrame((state, delta) => {
    const g = rig.current;
    if (!g) return;
    const ty = state.pointer.x * 0.28;
    const tx = -state.pointer.y * 0.08;
    g.rotation.y = damp(g.rotation.y, ty, 5, delta);
    g.rotation.x = damp(g.rotation.x, tx, 5, delta);
    if (Math.abs(g.rotation.y - ty) > 0.001 || Math.abs(g.rotation.x - tx) > 0.001) invalidate();
  });

  return <group ref={rig}>{children}</group>;
};

const PodiumScene: React.FC<{ handle: PodiumHandle }> = ({ handle }) => (
  <Canvas
    frameloop="demand"
    dpr={[1, 1.5]}
    camera={{ position: [0, 2.6, 7.4], fov: 32 }}
    gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
    onCreated={({ camera }) => camera.lookAt(0, 1.1, 0)}
    onPointerMove={() => handle.invalidate.current?.()}
    aria-hidden="true"
  >
    <ambientLight intensity={0.75} />
    <directionalLight position={[3, 6, 5]} intensity={1.7} />
    <directionalLight position={[-4, 2, -3]} intensity={0.4} color="#FFB81C" />
    <Rig handle={handle}>
      {podiumPlaces.map((p) => (
        <Block key={p.rank} place={p} progress={handle.progress} />
      ))}
      <mesh rotation-x={-Math.PI / 2} raycast={() => null}>
        <circleGeometry args={[3.2, 48]} />
        <meshStandardMaterial color="#1B1F26" roughness={0.9} />
      </mesh>
    </Rig>
  </Canvas>
);

export default PodiumScene;
