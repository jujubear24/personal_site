/**
 * AgentScene - 3D Background Component
 * 
 * Renders a 3D sphere with custom shaders and dithering post-processing.
 * Uses React Three Fiber for Three.js integration.
 */

'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer } from '@react-three/postprocessing';
import { Effect } from 'postprocessing';
import { 
  ditherEffectFragmentShader, 
  agentFragmentShader, 
  agentVertexShader 
} from './Shaders';
import { 
  AgentState, 
  type ViewMode, 
  type Theme,
  type AgentSceneProps,
  VISUAL_CONFIG 
} from '@/types/sentient';

/**
 * Custom Dither Post-Processing Effect
 */
class DitherEffectImpl extends Effect {
  constructor({ scale = 3.0 }: { scale?: number } = {}) {
    super('DitherEffect', ditherEffectFragmentShader, {
      uniforms: new Map([
        ['uTime', { value: 0 }],
        ['uScale', { value: scale }],
        ['uInkColor', { value: new THREE.Vector3(0, 0, 0) }],
        ['uPaperColor', { value: new THREE.Vector3(1, 1, 1) }],
      ]),
    });
  }
}

/**
 * Dither Effect Component
 */
const Dither: React.FC<{ theme: Theme }> = ({ theme }) => {
  const effect = useMemo(() => new DitherEffectImpl({ scale: 1.5 }), []);

  // Calculate color vectors based on theme
  const colors = useMemo(() => {
    if (theme === 'light') {
      return {
        ink: new THREE.Vector3(0.15, 0.17, 0.2), // Charcoal
        paper: new THREE.Vector3(0.97, 0.97, 0.96), // Off-white
      };
    } else {
      return {
        ink: new THREE.Vector3(0.02, 0.03, 0.05), // Deep Black
        paper: new THREE.Vector3(0.9, 0.91, 0.93), // Cool White
      };
    }
  }, [theme]);

  useFrame((state) => {
    const timeUniform = effect.uniforms.get('uTime');
    const inkUniform = effect.uniforms.get('uInkColor');
    const paperUniform = effect.uniforms.get('uPaperColor');

    if (timeUniform) timeUniform.value = state.clock.getElapsedTime();
    if (inkUniform) inkUniform.value.lerp(colors.ink, 0.05);
    if (paperUniform) paperUniform.value.lerp(colors.paper, 0.05);
  });

  return <primitive object={effect} dispose={null} />;
};

/**
 * Agent Mesh Component
 */
const AgentMesh: React.FC<{ agentState: AgentState; viewMode: ViewMode }> = ({
  agentState,
  viewMode,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const targetPos = useRef(new THREE.Vector3(0, 0, 0));

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uActivity: { value: 0 },
    }),
    []
  );

  useFrame((state) => {
    // Update shader uniforms
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();

      const targetActivity =
        agentState === AgentState.THINKING
          ? 0.9
          : agentState === AgentState.SPEAKING
            ? 0.5
            : 0.05;

      materialRef.current.uniforms.uActivity.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uActivity.value,
        targetActivity,
        0.05
      );
    }

    // Animate position based on ViewMode
    if (meshRef.current) {
      if (viewMode === 'AGENT') {
        // Center-top position for agent view
        targetPos.current.set(0, 0.8, 0);
      } else {
        // Move to right side for content views
        targetPos.current.set(3.0, 0, -2);
      }

      // Smooth lerp to target
      meshRef.current.position.lerp(targetPos.current, 0.05);

      // Gentle idle rotation
      meshRef.current.rotation.y += 0.001;
      meshRef.current.rotation.z =
        Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1;
    }
  });

  return (
    <Sphere args={[1.5, 128, 128]} ref={meshRef}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={agentVertexShader}
        fragmentShader={agentFragmentShader}
        uniforms={uniforms}
        wireframe={false}
      />
    </Sphere>
  );
};

/**
 * Camera Controller Component
 */
const CameraController: React.FC<{ viewMode: ViewMode }> = ({ viewMode }) => {
  useFrame((state) => {
    // Subtle camera pan based on view
    const targetX = viewMode === 'AGENT' ? 0 : 1.5;
    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      targetX,
      0.05
    );
    state.camera.lookAt(0, 0, 0);
  });
  return null;
};

/**
 * Main AgentScene Component
 */
const AgentScene: React.FC<AgentSceneProps> = ({ agentState, viewMode, theme }) => {
  const bgColor =
    theme === 'light'
      ? VISUAL_CONFIG.backgroundColor
      : VISUAL_CONFIG.darkBackgroundColor;

  return (
    <div className="absolute top-0 left-0 w-full h-full -z-10 transition-opacity duration-1000">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 30 }}
        gl={{ antialias: false, pixelRatio: 1 }}
        dpr={[1, 1.5]}
      >
        <color attach="background" args={[bgColor]} />

        <CameraController viewMode={viewMode} />

        <ambientLight intensity={1.5} />
        <directionalLight position={[-5, 5, 5]} intensity={2.5} />
        <directionalLight
          position={[5, -5, 2]}
          intensity={1.0}
          color={VISUAL_CONFIG.accentColor}
        />

        <AgentMesh agentState={agentState} viewMode={viewMode} />

        <EffectComposer disableNormalPass>
          <Dither theme={theme} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default AgentScene;