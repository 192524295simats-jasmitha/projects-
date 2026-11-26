import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import type { BuildingId, CampusBuilding, ParkingSlot } from '../../types/campus';
import { CampusBuildings } from './CampusBuildings';
import { CampusEnvironment } from './CampusEnvironment';
import { detectSoftwareWebGL } from './proceduralTextures';

export interface CameraPresetCommand {
  id: number;
  position: [number, number, number];
  target: [number, number, number];
}

interface CampusCanvasProps {
  buildings: CampusBuilding[];
  parking: ParkingSlot[];
  selectedBuildingId: BuildingId | null;
  hoveredBuildingId: BuildingId | null;
  showEnergyOverlay: boolean;
  showParkingOverlay: boolean;
  autoRotate: boolean;
  cameraCommand: CameraPresetCommand | null;
  onSelectBuilding: (id: BuildingId) => void;
  onFocusBuilding: (id: BuildingId) => void;
  onHoverBuilding: (id: BuildingId | null) => void;
  onSelectParkingSlot?: (slotId: string) => void;
  onClearSelection?: () => void;
}

const _desiredPos = new THREE.Vector3();
const _desiredTarget = new THREE.Vector3();

function StudioEnvironmentRig({ isSoftwareGl }: { isSoftwareGl: boolean }) {
  const { gl, scene } = useThree();

  useEffect(() => {
    const pmremGenerator = new THREE.PMREMGenerator(gl);
    const roomEnv = new RoomEnvironment();
    const envTarget = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envTarget.texture;
    roomEnv.dispose();
    pmremGenerator.dispose();

    return () => {
      envTarget.dispose();
      scene.environment = null;
    };
  }, [gl, scene]);

  return (
    <>
      <color attach="background" args={['#081329']} />
      <fogExp2 attach="fog" args={['#081329', 0.0046]} />

      {/* Cool Sky / Warm Ground Hemisphere Fill */}
      <hemisphereLight args={['#93c5fd', '#1e293b', 0.72]} />

      {/* Warm Sun Key Light with tight shadow frustum */}
      <directionalLight
        position={[58, 72, 62]}
        intensity={1.75}
        color="#fff4e0"
        castShadow={!isSoftwareGl}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={10}
        shadow-camera-far={220}
        shadow-camera-left={-75}
        shadow-camera-right={75}
        shadow-camera-top={75}
        shadow-camera-bottom={-75}
        shadow-bias={-0.0005}
        shadow-normalBias={0.02}
      />

      {/* Cool Rim / Backlight separating buildings from dark navy sky */}
      <directionalLight position={[-55, 42, -55]} intensity={0.62} color="#38bdf8" />
    </>
  );
}

function CameraRig({
  cameraCommand,
  autoRotate,
  isSoftwareGl,
}: {
  cameraCommand: CameraPresetCommand | null;
  autoRotate: boolean;
  isSoftwareGl: boolean;
}) {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const transitioningRef = useRef(false);
  const lastCommandIdRef = useRef<number>(-1);

  useEffect(() => {
    if (cameraCommand && cameraCommand.id !== lastCommandIdRef.current) {
      lastCommandIdRef.current = cameraCommand.id;
      _desiredPos.set(...cameraCommand.position);
      _desiredTarget.set(...cameraCommand.target);
      transitioningRef.current = true;
    }
  }, [cameraCommand]);

  useFrame((_, delta) => {
    const controls = controlsRef.current;
    if (!controls) return;

    if (transitioningRef.current) {
      const step = Math.min(delta, 0.05);
      camera.position.x = THREE.MathUtils.damp(camera.position.x, _desiredPos.x, 5.5, step);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, _desiredPos.y, 5.5, step);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, _desiredPos.z, 5.5, step);

      controls.target.x = THREE.MathUtils.damp(controls.target.x, _desiredTarget.x, 6, step);
      controls.target.y = THREE.MathUtils.damp(controls.target.y, _desiredTarget.y, 6, step);
      controls.target.z = THREE.MathUtils.damp(controls.target.z, _desiredTarget.z, 6, step);

      if (
        camera.position.distanceTo(_desiredPos) < 0.25 &&
        controls.target.distanceTo(_desiredTarget) < 0.2
      ) {
        transitioningRef.current = false;
      }
    }
    controls.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping={!isSoftwareGl}
      dampingFactor={0.07}
      enableRotate
      enableZoom
      enablePan
      screenSpacePanning={false}
      minDistance={16}
      maxDistance={155}
      minPolarAngle={0.08}
      maxPolarAngle={Math.PI / 2.15}
      autoRotate={autoRotate && !isSoftwareGl}
      autoRotateSpeed={0.55}
      target={[2, 2, 4]}
      onStart={() => {
        transitioningRef.current = false;
      }}
    />
  );
}

export const CampusCanvas: React.FC<CampusCanvasProps> = ({
  buildings,
  parking,
  selectedBuildingId,
  hoveredBuildingId,
  showEnergyOverlay,
  showParkingOverlay,
  autoRotate,
  cameraCommand,
  onSelectBuilding,
  onFocusBuilding,
  onHoverBuilding,
  onSelectParkingSlot,
  onClearSelection,
}) => {
  const isSoftwareGl = useMemo(() => detectSoftwareWebGL(), []);
  const [contextLost, setContextLost] = useState(false);

  if (contextLost) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-[#060d1f] p-8 text-center">
        <h3 className="font-display text-lg font-semibold text-white">3D Viewport Paused</h3>
        <p className="mt-2 max-w-md text-sm text-slate-400">
          WebGL rendering context was interrupted by the browser. Click below to restore the interactive Saveetha Campus model.
        </p>
        <button
          onClick={() => setContextLost(false)}
          className="mt-4 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400 transition-colors"
        >
          Restore 3D Scene
        </button>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full select-none bg-[#081329]">
      <Canvas
        shadows={!isSoftwareGl}
        dpr={isSoftwareGl ? 1 : [1, 2]}
        camera={{ position: [0, 44, 86], fov: 44, near: 0.5, far: 420 }}
        gl={{
          antialias: !isSoftwareGl,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.08,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        onPointerMissed={() => {
          if (onClearSelection) onClearSelection();
        }}
        onCreated={({ gl }) => {
          const dom = gl.domElement;
          dom.addEventListener('webglcontextlost', (e) => {
            e.preventDefault();
            setContextLost(true);
          });
          dom.addEventListener('webglcontextrestored', () => {
            setContextLost(false);
          });
        }}
      >
        <StudioEnvironmentRig isSoftwareGl={isSoftwareGl} />
        <CameraRig
          cameraCommand={cameraCommand}
          autoRotate={autoRotate}
          isSoftwareGl={isSoftwareGl}
        />

        <CampusEnvironment
          parking={parking}
          showParkingOverlay={showParkingOverlay}
          onSelectParkingSlot={onSelectParkingSlot}
        />

        <CampusBuildings
          buildings={buildings}
          selectedBuildingId={selectedBuildingId}
          hoveredBuildingId={hoveredBuildingId}
          showEnergyOverlay={showEnergyOverlay}
          onSelectBuilding={onSelectBuilding}
          onFocusBuilding={onFocusBuilding}
          onHoverBuilding={onHoverBuilding}
        />
      </Canvas>
    </div>
  );
};
