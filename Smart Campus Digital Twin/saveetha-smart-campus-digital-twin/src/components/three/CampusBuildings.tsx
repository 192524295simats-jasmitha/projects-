import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import type { BuildingId, CampusBuilding } from '../../types/campus';
import {
  createHealthSignTexture,
  createPorticoSignTexture,
  createSolarPanelTexture,
  createTricolorFlagTexture,
} from './proceduralTextures';

interface CampusBuildingsProps {
  buildings: CampusBuilding[];
  selectedBuildingId: BuildingId | null;
  hoveredBuildingId: BuildingId | null;
  showEnergyOverlay: boolean;
  onSelectBuilding: (id: BuildingId) => void;
  onFocusBuilding: (id: BuildingId) => void;
  onHoverBuilding: (id: BuildingId | null) => void;
}

const SELECTION_CYAN = new THREE.Color('#22d3ee');

/**
 * Main Engineering Circular Lattice Building (Images 1 & 2)
 * Curved crescent/oval structure with dual courtyard cutouts, 3D diagonal white diamond lattice,
 * central portico with SEC signage, front fountain monument, flagpole, and rooftop solar panels.
 */
function MainEngineeringModel({
  isSelected,
  isHovered,
}: {
  isSelected: boolean;
  isHovered: boolean;
}) {
  const porticoSignTex = useMemo(() => createPorticoSignTexture(), []);
  const solarTex = useMemo(() => createSolarPanelTexture(), []);
  const flagTex = useMemo(() => createTricolorFlagTexture(), []);
  const flagRef = useRef<THREE.Mesh>(null);
  const latticeRef = useRef<THREE.InstancedMesh>(null);

  // Curved arc parameters: faces +Z (South entrance), wraps from -120 deg to +120 deg
  const outerR = 19.2;
  const innerR = 9.4;
  const height = 7.6;
  const arcSpan = Math.PI * 1.38; // ~248 deg sweeping C-curve
  const thetaStart = -arcSpan / 2; // centered around +Z in Three.js CylinderGeometry (0 is +Z)

  // Build curved roof deck with 2 hexagonal courtyard lightwell cutouts (Image 1)
  const roofGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    const steps = 48;
    const startA = -Math.PI * 0.69 + Math.PI / 2;
    const endA = Math.PI * 0.69 + Math.PI / 2;

    // Outer arc
    for (let i = 0; i <= steps; i++) {
      const a = THREE.MathUtils.lerp(startA, endA, i / steps);
      const x = Math.cos(a) * outerR;
      const y = Math.sin(a) * outerR;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    // Inner arc return
    for (let i = steps; i >= 0; i--) {
      const a = THREE.MathUtils.lerp(startA, endA, i / steps);
      const x = Math.cos(a) * innerR;
      const y = Math.sin(a) * innerR;
      shape.lineTo(x, y);
    }
    shape.closePath();

    // Two inner courtyard cutout wells (left and right wings)
    const addCourtyardHole = (cx: number, cy: number, r: number) => {
      const hole = new THREE.Path();
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        const hx = cx + Math.cos(a) * r;
        const hy = cy + Math.sin(a) * r;
        if (i === 0) hole.moveTo(hx, hy);
        else hole.lineTo(hx, hy);
      }
      hole.closePath();
      shape.holes.push(hole);
    };

    addCourtyardHole(-8.8, 11.4, 2.35);
    addCourtyardHole(8.8, 11.4, 2.35);

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.45,
      bevelEnabled: false,
      curveSegments: 32,
    });
    geo.rotateX(Math.PI / 2);
    return geo;
  }, [outerR, innerR]);

  // Diagonal criss-cross white diamond lattice along the entire curved outer facade
  const latticeCount = 112; // 56 bays * 2 opposing diagonals
  useEffect(() => {
    const mesh = latticeRef.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    const bays = 56;
    const latticeR = outerR + 0.16;
    let idx = 0;

    for (let i = 0; i < bays; i++) {
      const t = (i + 0.5) / bays;
      const angle = THREE.MathUtils.lerp(thetaStart + 0.03, thetaStart + arcSpan - 0.03, t);
      const x = Math.sin(angle) * latticeR;
      const z = Math.cos(angle) * latticeR;

      // Diagonal strut 1 (+42 deg tilt along tangent)
      dummy.position.set(x, height / 2 + 0.1, z);
      dummy.rotation.set(0, angle, 0);
      dummy.rotateZ(0.72);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(idx++, dummy.matrix);

      // Diagonal strut 2 (-42 deg tilt along tangent)
      dummy.position.set(x, height / 2 + 0.1, z);
      dummy.rotation.set(0, angle, 0);
      dummy.rotateZ(-0.72);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(idx++, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [arcSpan, height, outerR, thetaStart]);

  useFrame(({ clock }) => {
    if (flagRef.current) {
      const t = clock.getElapsedTime();
      flagRef.current.rotation.y = Math.sin(t * 2.4) * 0.12 + 0.15;
    }
  });

  const latticeBeamGeo = useMemo(() => new THREE.BoxGeometry(0.24, 9.6, 0.28), []);

  const highlightEmissive = isSelected ? '#0891b2' : isHovered ? '#0369a1' : '#000000';
  const highlightIntensity = isSelected ? 0.22 : isHovered ? 0.12 : 0;

  return (
    <group>
      {/* Ground plinth pad */}
      <mesh position={[0, 0.12, 0]} receiveShadow>
        <cylinderGeometry args={[outerR + 0.8, outerR + 1.0, 0.24, 48, 1, false, thetaStart, arcSpan]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.85} metalness={0.05} />
      </mesh>

      {/* Recessed dark glazed & corridor interior arc */}
      <mesh position={[0, height / 2 + 0.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[outerR - 0.35, outerR - 0.35, height - 0.2, 48, 1, true, thetaStart, arcSpan]} />
        <meshStandardMaterial
          color="#1e293b"
          roughness={0.32}
          metalness={0.55}
          side={THREE.DoubleSide}
          emissive={highlightEmissive}
          emissiveIntensity={highlightIntensity}
        />
      </mesh>

      {/* Inner courtyard facing wall */}
      <mesh position={[0, height / 2 + 0.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[innerR, innerR, height - 0.2, 36, 1, true, thetaStart, arcSpan]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.68} metalness={0.08} side={THREE.DoubleSide} />
      </mesh>

      {/* 5 Horizontal floor slab bands visible behind the diamond lattice */}
      {[1.5, 3.0, 4.5, 6.0, 7.45].map((y, idx) => (
        <mesh key={idx} position={[0, y, 0]} receiveShadow>
          <cylinderGeometry
            args={[outerR + 0.02, outerR + 0.02, idx === 4 ? 0.52 : 0.26, 48, 1, true, thetaStart, arcSpan]}
          />
          <meshStandardMaterial color="#f1f5f9" roughness={0.55} metalness={0.1} side={THREE.DoubleSide} />
        </mesh>
      ))}

      {/* End caps closing the horseshoe wings */}
      {[thetaStart, thetaStart + arcSpan].map((angle, idx) => {
        const midR = (outerR + innerR) / 2;
        const capW = outerR - innerR;
        const cx = Math.sin(angle) * midR;
        const cz = Math.cos(angle) * midR;
        return (
          <mesh
            key={idx}
            position={[cx, height / 2 + 0.2, cz]}
            rotation={[0, angle + Math.PI / 2, 0]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[capW, height, 0.5]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.6} metalness={0.1} />
          </mesh>
        );
      })}

      {/* White diagonal criss-cross diamond lattice exoskeleton */}
      <instancedMesh
        ref={latticeRef}
        args={[latticeBeamGeo, undefined, latticeCount]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color="#f8fafc"
          roughness={0.42}
          metalness={0.12}
          emissive={highlightEmissive}
          emissiveIntensity={highlightIntensity * 0.6}
        />
      </instancedMesh>

      {/* Sculpted roof deck with dual courtyard cutouts */}
      <mesh geometry={roofGeometry} position={[0, height + 0.4, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#d8dee9" roughness={0.78} metalness={0.08} />
      </mesh>

      {/* Rooftop solar panel array on the left/west arc (Image 1) */}
      {[-0.85, -0.68, -0.51].map((ang, i) => (
        <mesh
          key={i}
          position={[Math.sin(ang) * 14.5, height + 0.72, Math.cos(ang) * 14.5]}
          rotation={[0.25, ang, 0]}
          castShadow
        >
          <boxGeometry args={[3.6, 0.12, 2.2]} />
          <meshStandardMaterial map={solarTex} roughness={0.25} metalness={0.7} />
        </mesh>
      ))}

      {/* Rooftop staircase & mechanical elevator penthouses */}
      {[
        [-11.5, 6.2],
        [11.5, 6.2],
        [0, 14.2],
      ].map(([px, pz], i) => (
        <mesh key={i} position={[px, height + 1.05, pz]} castShadow>
          <boxGeometry args={[2.8, 1.3, 2.2]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.65} metalness={0.15} />
        </mesh>
      ))}

      {/* Central Entrance Portico (Images 1 & 2) */}
      <group position={[0, 0, outerR + 1.8]}>
        {/* Portico deck & red terracotta roof rim */}
        <mesh position={[0, 3.85, 0]} castShadow receiveShadow>
          <boxGeometry args={[8.8, 0.65, 4.4]} />
          <meshStandardMaterial color="#e7dcc8" roughness={0.55} metalness={0.1} />
        </mesh>
        <mesh position={[0, 4.28, 0]} castShadow>
          <boxGeometry args={[8.5, 0.25, 4.1]} />
          <meshStandardMaterial color="#b9382c" roughness={0.6} metalness={0.1} />
        </mesh>

        {/* SAVEETHA ENGINEERING COLLEGE · SEC Fascia Sign */}
        <mesh position={[0, 4.65, 2.24]}>
          <planeGeometry args={[8.4, 1.35]} />
          <meshStandardMaterial map={porticoSignTex} roughness={0.35} metalness={0.15} />
        </mesh>

        {/* 4 Supporting Portico Columns */}
        {[
          [-3.7, 1.7],
          [3.7, 1.7],
          [-3.7, -1.4],
          [3.7, -1.4],
        ].map(([cx, cz], i) => (
          <mesh key={i} position={[cx, 1.8, cz]} castShadow>
            <cylinderGeometry args={[0.28, 0.32, 3.6, 16]} />
            <meshStandardMaterial color="#e2d4bc" roughness={0.5} metalness={0.1} />
          </mesh>
        ))}

        {/* Recessed Glazed Main Lobby Entry */}
        <mesh position={[0, 1.8, -1.9]}>
          <boxGeometry args={[6.4, 3.4, 0.3]} />
          <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.8} />
        </mesh>
      </group>

      {/* Stepped Water Fountain & Tricolor Flagpole Monument (Image 2) */}
      <group position={[0, 0, outerR + 6.4]}>
        {/* Circular fountain basin */}
        <mesh position={[0, 0.18, 0]} receiveShadow>
          <cylinderGeometry args={[3.2, 3.4, 0.36, 32]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.6} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0.38, 0]}>
          <cylinderGeometry args={[2.85, 2.85, 0.08, 32]} />
          <meshStandardMaterial color="#0ea5e9" roughness={0.15} metalness={0.55} />
        </mesh>
        {/* Stepped planter stone plinth */}
        <mesh position={[0, 0.65, 0]} castShadow>
          <boxGeometry args={[2.3, 0.85, 2.0]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
        </mesh>
        {/* Ornamental green & purple shrub clusters */}
        {[-1.35, 1.35].map((sx, i) => (
          <mesh key={i} position={[sx, 0.72, 0.2]} castShadow>
            <sphereGeometry args={[0.75, 12, 10]} />
            <meshStandardMaterial color="#2e7d32" roughness={0.85} />
          </mesh>
        ))}
        {/* Chrome Flagpole & Animated Indian Tricolor Flag */}
        <mesh position={[0, 4.4, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.09, 7.6, 12]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.2} metalness={0.9} />
        </mesh>
        <mesh ref={flagRef} position={[0.92, 7.55, 0]} castShadow>
          <planeGeometry args={[1.8, 1.15]} />
          <meshStandardMaterial map={flagTex} roughness={0.6} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Central Courtyard Lawn inside the Circular Building */}
      <mesh position={[0, 0.04, 1.5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[innerR - 0.3, 36]} />
        <meshStandardMaterial color="#1f5c31" roughness={0.9} />
      </mesh>
    </group>
  );
}

/**
 * Saveetha Health Sciences Block (Image 3)
 * 10-storey chamfered octagonal tower with vibrant cerulean blue floor bands,
 * off-white piers, recessed dark glazing, corner balconies, and angled front canopy.
 */
function HealthSciencesModel({
  isSelected,
  isHovered,
}: {
  isSelected: boolean;
  isHovered: boolean;
}) {
  const signTex = useMemo(() => createHealthSignTexture(), []);
  const floors = 10;
  const floorH = 1.65;
  const totalH = floors * floorH;
  const highlightEmissive = isSelected ? '#0284c7' : isHovered ? '#0369a1' : '#000000';
  const highlightIntensity = isSelected ? 0.25 : isHovered ? 0.14 : 0;

  return (
    <group>
      {/* Podium base */}
      <mesh position={[0, 0.25, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[7.4, 7.8, 0.5, 8]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.75} />
      </mesh>

      {/* Recessed octagonal dark glass core */}
      <mesh position={[0, totalH / 2 + 0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[6.15, 6.15, totalH, 8]} />
        <meshStandardMaterial
          color="#0f2942"
          roughness={0.22}
          metalness={0.75}
          emissive={highlightEmissive}
          emissiveIntensity={highlightIntensity}
        />
      </mesh>

      {/* 10 Alternating Cerulean Blue & White Floor Bands (Image 3 signature) */}
      {Array.from({ length: floors }).map((_, idx) => {
        const y = 0.55 + idx * floorH;
        return (
          <group key={idx} position={[0, y, 0]}>
            {/* Vibrant Cerulean Blue slab edge */}
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[6.65, 6.65, 0.38, 8]} />
              <meshStandardMaterial color="#0284c7" roughness={0.38} metalness={0.25} />
            </mesh>
            {/* White/light-grey balcony fascia */}
            <mesh position={[0, 0.26, 0]}>
              <cylinderGeometry args={[6.52, 6.52, 0.16, 8]} />
              <meshStandardMaterial color="#e2e8f0" roughness={0.55} metalness={0.1} />
            </mesh>
          </group>
        );
      })}

      {/* 8 Vertical Corner Columns & Central Front Spine Rib */}
      {Array.from({ length: 8 }).map((_, i) => {
        const ang = (i / 8) * Math.PI * 2 + Math.PI / 8;
        const r = 6.42;
        return (
          <mesh
            key={i}
            position={[Math.sin(ang) * r, totalH / 2 + 0.5, Math.cos(ang) * r]}
            castShadow
          >
            <boxGeometry args={[0.55, totalH + 0.3, 0.55]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.5} metalness={0.15} />
          </mesh>
        );
      })}
      {/* Central front vertical spine pipe (visible in Image 3 center) */}
      <mesh position={[0, totalH / 2 + 0.5, 6.45]} castShadow>
        <cylinderGeometry args={[0.24, 0.24, totalH + 0.4, 12]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.4} metalness={0.25} />
      </mesh>

      {/* Rooftop parapet & mechanical crown */}
      <mesh position={[0, totalH + 0.8, 0]} castShadow>
        <cylinderGeometry args={[6.75, 6.65, 0.6, 8]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.55} />
      </mesh>
      <mesh position={[0, totalH + 1.5, 0]} castShadow>
        <boxGeometry args={[4.2, 1.1, 3.6]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.6} />
      </mesh>

      {/* Angled Cerulean-Blue & White Porte-Cochère Porch Canopy (Image 3) */}
      <group position={[0, 0, 7.6]}>
        <mesh position={[0, 2.9, 0]} castShadow>
          <boxGeometry args={[6.4, 0.38, 3.6]} />
          <meshStandardMaterial color="#0284c7" roughness={0.35} metalness={0.2} />
        </mesh>
        <mesh position={[0, 2.7, 0]}>
          <boxGeometry args={[5.8, 0.14, 3.1]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.6} />
        </mesh>
        {[-2.4, 2.4].map((px, i) => (
          <mesh key={i} position={[px, 1.4, 1.2]} castShadow>
            <cylinderGeometry args={[0.22, 0.24, 2.8, 12]} />
            <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.5} />
          </mesh>
        ))}
      </group>

      {/* Freestanding Blue Signage Board in Front */}
      <group position={[-4.8, 0, 10.2]} rotation={[0, 0.25, 0]}>
        <mesh position={[0, 1.45, 0]} castShadow>
          <boxGeometry args={[3.4, 1.25, 0.22]} />
          <meshStandardMaterial color="#0369a1" roughness={0.4} />
        </mesh>
        <mesh position={[0, 1.45, 0.12]}>
          <planeGeometry args={[3.25, 1.1]} />
          <meshStandardMaterial map={signTex} roughness={0.35} />
        </mesh>
        {[-1.3, 1.3].map((px, i) => (
          <mesh key={i} position={[px, 0.45, 0]}>
            <boxGeometry args={[0.16, 0.9, 0.16]} />
            <meshStandardMaterial color="#334155" metalness={0.6} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/**
 * Academic & Innovation Block (Image 4 center)
 * Central cylindrical rotunda flanked by symmetric blue-and-white curved/angled wings
 * with rooftop solar collector arrays.
 */
function AcademicWingedModel({
  isSelected,
  isHovered,
}: {
  isSelected: boolean;
  isHovered: boolean;
}) {
  const solarTex = useMemo(() => createSolarPanelTexture(), []);
  const highlightEmissive = isSelected ? '#0891b2' : isHovered ? '#0369a1' : '#000000';
  const highlightIntensity = isSelected ? 0.24 : isHovered ? 0.12 : 0;

  return (
    <group>
      {/* Central 6-Storey Cylindrical Rotunda */}
      <mesh position={[0, 5.2, 2.2]} castShadow receiveShadow>
        <cylinderGeometry args={[4.4, 4.5, 10.4, 32]} />
        <meshStandardMaterial
          color="#1e3a5f"
          roughness={0.3}
          metalness={0.6}
          emissive={highlightEmissive}
          emissiveIntensity={highlightIntensity}
        />
      </mesh>
      {[1.6, 3.2, 4.8, 6.4, 8.0, 9.6, 10.45].map((y, i) => (
        <mesh key={i} position={[0, y, 2.2]}>
          <cylinderGeometry args={[4.7, 4.7, 0.34, 32]} />
          <meshStandardMaterial color={i % 2 === 0 ? '#f1f5f9' : '#0284c7'} roughness={0.45} />
        </mesh>
      ))}
      {/* Skylight atrium roof */}
      <mesh position={[0, 10.85, 2.2]}>
        <cylinderGeometry args={[3.4, 4.4, 0.7, 32]} />
        <meshStandardMaterial color="#38bdf8" roughness={0.2} metalness={0.7} />
      </mesh>

      {/* Left & Right Angled 5-Storey Academic Wings */}
      {[-1, 1].map((side) => (
        <group
          key={side}
          position={[side * 8.6, 0, -0.4]}
          rotation={[0, side * -0.28, 0]}
        >
          {/* Main wing body */}
          <mesh position={[0, 4.3, 0]} castShadow receiveShadow>
            <boxGeometry args={[12.5, 8.6, 5.2]} />
            <meshStandardMaterial
              color="#163252"
              roughness={0.35}
              metalness={0.5}
              emissive={highlightEmissive}
              emissiveIntensity={highlightIntensity}
            />
          </mesh>
          {/* Blue & white horizontal floor bands */}
          {[1.4, 3.0, 4.6, 6.2, 7.8, 8.65].map((y, idx) => (
            <mesh key={idx} position={[0, y, 0]}>
              <boxGeometry args={[12.8, 0.38, 5.55]} />
              <meshStandardMaterial color={idx === 5 ? '#e2e8f0' : '#0284c7'} roughness={0.42} />
            </mesh>
          ))}
          {/* Vertical white window mullions */}
          {[-4.5, -2.2, 0, 2.2, 4.5].map((wx, j) => (
            <mesh key={j} position={[wx, 4.3, 2.7]}>
              <boxGeometry args={[0.35, 8.4, 0.25]} />
              <meshStandardMaterial color="#f1f5f9" roughness={0.5} />
            </mesh>
          ))}
          {/* Rooftop solar panels */}
          {[-3.2, 0, 3.2].map((sx, k) => (
            <mesh key={k} position={[sx, 9.0, 0]} rotation={[0.28, 0, 0]} castShadow>
              <boxGeometry args={[2.6, 0.12, 2.2]} />
              <meshStandardMaterial map={solarTex} roughness={0.25} metalness={0.7} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

/**
 * Laboratory & Computing Tower (Images 1 & 4)
 * 11-storey tall dark-teal glass & concrete-frame tower behind the Main Engineering Block
 */
function LaboratoryTowerModel({
  isSelected,
  isHovered,
}: {
  isSelected: boolean;
  isHovered: boolean;
}) {
  const floors = 11;
  const floorH = 1.75;
  const totalH = floors * floorH;
  const highlightEmissive = isSelected ? '#14b8a6' : isHovered ? '#0d9488' : '#000000';
  const highlightIntensity = isSelected ? 0.24 : isHovered ? 0.12 : 0;

  return (
    <group>
      {/* Dark teal glazed structural core */}
      <mesh position={[0, totalH / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[11.4, totalH, 9.2]} />
        <meshStandardMaterial
          color="#0f3443"
          roughness={0.2}
          metalness={0.75}
          emissive={highlightEmissive}
          emissiveIntensity={highlightIntensity}
        />
      </mesh>

      {/* Horizontal concrete spandrel bands */}
      {Array.from({ length: floors + 1 }).map((_, idx) => (
        <mesh key={idx} position={[0, idx * floorH + 0.15, 0]} castShadow>
          <boxGeometry args={[11.85, 0.34, 9.65]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.6} metalness={0.12} />
        </mesh>
      ))}

      {/* Vertical window mullions */}
      {[-4.2, -1.4, 1.4, 4.2].map((mx, i) => (
        <mesh key={i} position={[mx, totalH / 2, 0]}>
          <boxGeometry args={[0.32, totalH, 9.75]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.5} metalness={0.2} />
        </mesh>
      ))}

      {/* Contrasting vertical service & elevator core shaft (Image 1 terracotta/slate core) */}
      <mesh position={[-6.1, totalH / 2 + 0.6, -1.2]} castShadow>
        <boxGeometry args={[1.6, totalH + 1.2, 4.4]} />
        <meshStandardMaterial color="#8c443a" roughness={0.65} metalness={0.1} />
      </mesh>

      {/* Rooftop HVAC chiller farm */}
      {[
        [-2.2, -1.4],
        [2.2, -1.4],
        [0, 2.0],
      ].map(([cx, cz], i) => (
        <mesh key={i} position={[cx, totalH + 0.85, cz]} castShadow>
          <boxGeometry args={[2.8, 1.1, 2.0]} />
          <meshStandardMaterial color="#64748b" roughness={0.45} metalness={0.55} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Administrative & Auditorium Block (Image 4 right)
 * Grand colonnaded stone-grey hall with full-height vertical pillars and ribbed silver-white dome.
 */
function AdminDomeModel({
  isSelected,
  isHovered,
}: {
  isSelected: boolean;
  isHovered: boolean;
}) {
  const highlightEmissive = isSelected ? '#3b82f6' : isHovered ? '#2563eb' : '#000000';
  const highlightIntensity = isSelected ? 0.22 : isHovered ? 0.12 : 0;

  const domeGeo = useMemo(() => {
    const pts: THREE.Vector2[] = [
      new THREE.Vector2(0.01, 7.6),
      new THREE.Vector2(0.7, 7.2),
      new THREE.Vector2(1.4, 6.2),
      new THREE.Vector2(2.6, 4.5),
      new THREE.Vector2(3.6, 2.4),
      new THREE.Vector2(4.1, 0),
    ];
    return new THREE.LatheGeometry(pts, 24);
  }, []);

  return (
    <group>
      {/* Stepped stone podium */}
      <mesh position={[0, 0.35, 0]} receiveShadow castShadow>
        <boxGeometry args={[16.2, 0.7, 13.4]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.75} />
      </mesh>

      {/* Recessed dark glazed body */}
      <mesh position={[0, 5.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[14.2, 9.4, 11.4]} />
        <meshStandardMaterial
          color="#1e293b"
          roughness={0.28}
          metalness={0.65}
          emissive={highlightEmissive}
          emissiveIntensity={highlightIntensity}
        />
      </mesh>

      {/* Roof cornice entablature */}
      <mesh position={[0, 10.35, 0]} castShadow>
        <boxGeometry args={[15.8, 0.9, 13.0]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.58} metalness={0.12} />
      </mesh>

      {/* Full-height vertical colonnade pillars around front & back */}
      {[-6.8, -4.5, -2.2, 0, 2.2, 4.5, 6.8].map((px, i) => (
        <React.Fragment key={i}>
          <mesh position={[px, 5.3, 6.0]} castShadow>
            <boxGeometry args={[0.62, 9.4, 0.68]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.5} metalness={0.12} />
          </mesh>
          <mesh position={[px, 5.3, -6.0]} castShadow>
            <boxGeometry args={[0.62, 9.4, 0.68]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.5} metalness={0.12} />
          </mesh>
        </React.Fragment>
      ))}
      {/* Side colonnade pillars */}
      {[-4.0, -1.35, 1.35, 4.0].map((pz, i) => (
        <React.Fragment key={i}>
          <mesh position={[-7.55, 5.3, pz]} castShadow>
            <boxGeometry args={[0.62, 9.4, 0.62]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.5} metalness={0.12} />
          </mesh>
          <mesh position={[7.55, 5.3, pz]} castShadow>
            <boxGeometry args={[0.62, 9.4, 0.62]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.5} metalness={0.12} />
          </mesh>
        </React.Fragment>
      ))}

      {/* Iconic Monumental Ribbed Silver-White Dome (Image 4 right) */}
      <group position={[0, 10.8, 0]}>
        <mesh position={[0, 0.6, 0]} castShadow>
          <cylinderGeometry args={[4.4, 4.6, 1.2, 24]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.5} metalness={0.25} />
        </mesh>
        <mesh geometry={domeGeo} position={[0, 1.1, 0]} castShadow>
          <meshStandardMaterial color="#e2e8f0" roughness={0.28} metalness={0.62} />
        </mesh>
        {/* Vertical dome ribs */}
        {Array.from({ length: 12 }).map((_, rIdx) => {
          const a = (rIdx / 12) * Math.PI * 2;
          return (
            <mesh
              key={rIdx}
              position={[Math.sin(a) * 2.5, 4.2, Math.cos(a) * 2.5]}
              rotation={[0, a, 0]}
            >
              <boxGeometry args={[0.14, 5.8, 0.14]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.7} />
            </mesh>
          );
        })}
        {/* Finial spire */}
        <mesh position={[0, 9.3, 0]}>
          <cylinderGeometry args={[0.06, 0.16, 1.5, 12]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.85} />
        </mesh>
      </group>
    </group>
  );
}

export const CampusBuildings: React.FC<CampusBuildingsProps> = ({
  buildings,
  selectedBuildingId,
  hoveredBuildingId,
  showEnergyOverlay,
  onSelectBuilding,
  onFocusBuilding,
  onHoverBuilding,
}) => {
  const renderBuildingModel = (building: CampusBuilding) => {
    const isSelected = selectedBuildingId === building.id;
    const isHovered = hoveredBuildingId === building.id;

    switch (building.id) {
      case 'main-engineering':
        return <MainEngineeringModel isSelected={isSelected} isHovered={isHovered} />;
      case 'health-sciences':
        return <HealthSciencesModel isSelected={isSelected} isHovered={isHovered} />;
      case 'academic-block':
        return <AcademicWingedModel isSelected={isSelected} isHovered={isHovered} />;
      case 'laboratory-block':
        return <LaboratoryTowerModel isSelected={isSelected} isHovered={isHovered} />;
      case 'admin-block':
        return <AdminDomeModel isSelected={isSelected} isHovered={isHovered} />;
    }
  };

  return (
    <group>
      {buildings.map((building) => {
        const isSelected = selectedBuildingId === building.id;
        const isHovered = hoveredBuildingId === building.id;
        const energyRatio = THREE.MathUtils.clamp(building.energyConsumptionKwh / 4500, 0.25, 1);
        const energyColor =
          building.energyConsumptionKwh > 3500
            ? '#f97316'
            : building.energyConsumptionKwh > 2600
              ? '#06b6d4'
              : '#10b981';

        const handleClick = (e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          onSelectBuilding(building.id);
        };

        const handleDoubleClick = (e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          onFocusBuilding(building.id);
        };

        const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
          onHoverBuilding(building.id);
        };

        const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          document.body.style.cursor = 'auto';
          if (hoveredBuildingId === building.id) {
            onHoverBuilding(null);
          }
        };

        return (
          <group
            key={building.id}
            position={building.footprintPosition}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
          >
            {renderBuildingModel(building)}

            {/* Ground Selection / Hover Halo Ring */}
            {(isSelected || isHovered) && (
              <mesh position={[0, 0.09, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[building.selectionRadius - 0.55, building.selectionRadius, 64]} />
                <meshBasicMaterial
                  color={SELECTION_CYAN}
                  transparent
                  opacity={isSelected ? 0.92 : 0.5}
                  side={THREE.DoubleSide}
                />
              </mesh>
            )}

            {/* Energy Load Heatmap Overlay Beacon */}
            {showEnergyOverlay && (
              <group position={[0, 0.15, 0]}>
                <mesh position={[0, 9 + energyRatio * 7, 0]}>
                  <cylinderGeometry args={[1.1, 2.2, 16 * energyRatio, 24, 1, true]} />
                  <meshBasicMaterial
                    color={energyColor}
                    transparent
                    opacity={0.28}
                    depthWrite={false}
                    side={THREE.DoubleSide}
                  />
                </mesh>
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[building.selectionRadius - 1.2, building.selectionRadius - 0.2, 48]} />
                  <meshBasicMaterial color={energyColor} transparent opacity={0.45} side={THREE.DoubleSide} />
                </mesh>
                <Html
                  position={[0, 18 * energyRatio + 8, 0]}
                  center
                  style={{ pointerEvents: 'none' }}
                >
                  <div className="rounded-md border border-slate-700/80 bg-[#081226]/95 px-2.5 py-1 text-xs font-mono text-slate-100 whitespace-nowrap shadow-lg">
                    {building.shortName}: <span className="text-cyan-300 font-semibold">{building.energyConsumptionKwh} kWh</span>
                  </div>
                </Html>
              </group>
            )}

            {/* Hover Tooltip */}
            {isHovered && (
              <Html
                position={[0, building.id === 'health-sciences' || building.id === 'laboratory-block' ? 23 : 14.5, 0]}
                center
                style={{ pointerEvents: 'none' }}
              >
                <div className="min-w-[230px] rounded-lg border border-cyan-500/40 bg-[#071124]/95 px-3.5 py-2.5 text-left shadow-2xl">
                  <div className="text-sm font-semibold text-white whitespace-nowrap">
                    {building.name}
                  </div>
                  <div className="mt-0.5 text-[11px] text-slate-300 whitespace-nowrap">
                    {building.department} Dept · {building.category}
                  </div>
                  <div className="mt-2 flex items-center gap-2.5 text-[11px] font-mono text-cyan-300 border-t border-slate-700/80 pt-1.5">
                    <span>{building.availableClassrooms}/{building.classrooms} Class</span>
                    <span>·</span>
                    <span>{building.activeLaboratories}/{building.laboratories} Labs</span>
                    <span>·</span>
                    <span>{building.availableFacultyRooms}/{building.facultyRooms} Faculty</span>
                  </div>
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
};
