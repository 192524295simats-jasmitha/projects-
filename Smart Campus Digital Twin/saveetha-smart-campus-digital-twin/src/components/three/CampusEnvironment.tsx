import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { ThreeEvent } from '@react-three/fiber';
import type { ParkingSlot } from '../../types/campus';
import {
  createAsphaltTexture,
  createGrassTexture,
  createTerracottaPaverTexture,
} from './proceduralTextures';

interface CampusEnvironmentProps {
  parking: ParkingSlot[];
  showParkingOverlay: boolean;
  onSelectParkingSlot?: (slotId: string) => void;
}

const CAR_PALETTE = ['#e2e8f0', '#94a3b8', '#1e293b', '#b91c1c', '#1d4ed8', '#0f766e', '#cbd5e1'];

function TreeGrovesInstanced() {
  const trunkRef = useRef<THREE.InstancedMesh>(null);
  const crownRef = useRef<THREE.InstancedMesh>(null);
  const palmTrunkRef = useRef<THREE.InstancedMesh>(null);
  const palmCrownRef = useRef<THREE.InstancedMesh>(null);

  const shadeTreeCoords = useMemo(() => {
    const pts: Array<[number, number, number]> = [];
    // Parking lot median shade trees (Image 1 foreground)
    [-22, -14, -6, 6, 14, 22].forEach((x) => {
      pts.push([x, 38.2, 0.9 + ((Math.abs(x) % 5) * 0.05)]);
      pts.push([x, 46.8, 0.95 + ((Math.abs(x) % 4) * 0.04)]);
    });
    // Health sciences & courtyard framing trees (Image 3)
    [
      [-26, -12, 1.25],
      [-45, -12, 1.3],
      [-48, -26, 1.2],
      [-28, -34, 1.15],
      [28, -10, 1.1],
      [34, 12, 1.2],
      [-28, 18, 1.15],
      [26, 18, 1.15],
    ].forEach(([x, z, s]) => pts.push([x, z, s]));

    // Outer perimeter campus grove
    for (let i = 0; i < 64; i++) {
      const a = (i / 64) * Math.PI * 2;
      const r = 74 + (i % 4) * 6;
      const x = Math.cos(a) * r;
      const z = Math.sin(a) * r;
      // Leave south main road entry clear
      if (Math.abs(x) < 9 && z > 45) continue;
      pts.push([x, z, 1.0 + ((i % 5) * 0.12)]);
    }
    return pts;
  }, []);

  // Rows of Ashoka/Palm trees flanking the left front lawn (Image 1)
  const palmCoords = useMemo(() => {
    const pts: Array<[number, number, number]> = [];
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 5; c++) {
        pts.push([-14 - c * 4.2, 14 + r * 3.8 + c * 0.8, 0.95 + ((r + c) % 3) * 0.08]);
      }
    }
    // Matching accent palms along east promenade
    for (let c = 0; c < 4; c++) {
      pts.push([15 + c * 4.2, 16 + c * 0.8, 1.0]);
    }
    return pts;
  }, []);

  const trunkGeo = useMemo(() => new THREE.CylinderGeometry(0.18, 0.28, 2.2, 7), []);
  const crownGeo = useMemo(() => new THREE.DodecahedronGeometry(1.45, 1), []);
  const palmTrunkGeo = useMemo(() => new THREE.CylinderGeometry(0.12, 0.2, 4.4, 7), []);
  const palmCrownGeo = useMemo(() => new THREE.ConeGeometry(1.15, 2.5, 7), []);

  useEffect(() => {
    const tMesh = trunkRef.current;
    const cMesh = crownRef.current;
    if (tMesh && cMesh) {
      const dummy = new THREE.Object3D();
      const color = new THREE.Color();
      shadeTreeCoords.forEach(([x, z, s], i) => {
        dummy.position.set(x, 1.1 * s, z);
        dummy.scale.set(s, s, s);
        dummy.rotation.set(0, (i * 0.7) % Math.PI, 0);
        dummy.updateMatrix();
        tMesh.setMatrixAt(i, dummy.matrix);

        dummy.position.set(x, 2.9 * s, z);
        dummy.scale.set(s * 1.15, s * 0.92, s * 1.15);
        dummy.updateMatrix();
        cMesh.setMatrixAt(i, dummy.matrix);

        color.setHSL(0.34 + (i % 5) * 0.012, 0.52, 0.24 + (i % 4) * 0.025);
        cMesh.setColorAt(i, color);
      });
      tMesh.instanceMatrix.needsUpdate = true;
      cMesh.instanceMatrix.needsUpdate = true;
      if (cMesh.instanceColor) cMesh.instanceColor.needsUpdate = true;
      tMesh.computeBoundingSphere();
      cMesh.computeBoundingSphere();
    }

    const ptMesh = palmTrunkRef.current;
    const pcMesh = palmCrownRef.current;
    if (ptMesh && pcMesh) {
      const dummy = new THREE.Object3D();
      const color = new THREE.Color();
      palmCoords.forEach(([x, z, s], i) => {
        dummy.position.set(x, 2.2 * s, z);
        dummy.scale.set(s, s, s);
        dummy.rotation.set(0, i * 0.5, 0);
        dummy.updateMatrix();
        ptMesh.setMatrixAt(i, dummy.matrix);

        dummy.position.set(x, 4.8 * s, z);
        dummy.scale.set(s, s, s);
        dummy.updateMatrix();
        pcMesh.setMatrixAt(i, dummy.matrix);

        color.setHSL(0.32 + (i % 3) * 0.015, 0.58, 0.28);
        pcMesh.setColorAt(i, color);
      });
      ptMesh.instanceMatrix.needsUpdate = true;
      pcMesh.instanceMatrix.needsUpdate = true;
      if (pcMesh.instanceColor) pcMesh.instanceColor.needsUpdate = true;
      ptMesh.computeBoundingSphere();
      pcMesh.computeBoundingSphere();
    }
  }, [palmCoords, shadeTreeCoords]);

  return (
    <group>
      <instancedMesh ref={trunkRef} args={[trunkGeo, undefined, shadeTreeCoords.length]} castShadow>
        <meshStandardMaterial color="#5c4033" roughness={0.9} />
      </instancedMesh>
      <instancedMesh ref={crownRef} args={[crownGeo, undefined, shadeTreeCoords.length]} castShadow receiveShadow>
        <meshStandardMaterial color="#ffffff" roughness={0.85} />
      </instancedMesh>

      <instancedMesh ref={palmTrunkRef} args={[palmTrunkGeo, undefined, palmCoords.length]} castShadow>
        <meshStandardMaterial color="#6b4f3b" roughness={0.88} />
      </instancedMesh>
      <instancedMesh ref={palmCrownRef} args={[palmCrownGeo, undefined, palmCoords.length]} castShadow>
        <meshStandardMaterial color="#ffffff" roughness={0.78} />
      </instancedMesh>
    </group>
  );
}

function StreetLights() {
  const poles: Array<[number, number]> = [
    [-18, 28.5],
    [-6, 28.5],
    [6, 28.5],
    [18, 28.5],
    [-16, 40.5],
    [0, 40.5],
    [16, 40.5],
    [-16, 49.0],
    [16, 49.0],
  ];

  return (
    <group>
      {poles.map(([x, z], idx) => (
        <group key={idx} position={[x, 0, z]}>
          <mesh position={[0, 3.2, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.11, 6.4, 8]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.75} roughness={0.3} />
          </mesh>
          <mesh position={[0, 6.35, 0]}>
            <boxGeometry args={[1.4, 0.12, 0.22]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.25} />
          </mesh>
          {[-0.55, 0.55].map((lx, j) => (
            <mesh key={j} position={[lx, 6.26, 0]}>
              <boxGeometry args={[0.35, 0.08, 0.26]} />
              <meshStandardMaterial color="#e0f2fe" emissive="#38bdf8" emissiveIntensity={1.1} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

function ParkedCarMesh({ color, isEv }: { color: string; isEv: boolean }) {
  return (
    <group>
      {/* Main car chassis */}
      <mesh position={[0, 0.36, 0]} castShadow>
        <boxGeometry args={[1.65, 0.5, 3.35]} />
        <meshStandardMaterial color={color} roughness={0.28} metalness={0.65} />
      </mesh>
      {/* Cabin glasshouse */}
      <mesh position={[0, 0.78, -0.1]} castShadow>
        <boxGeometry args={[1.38, 0.42, 1.85]} />
        <meshStandardMaterial color="#0f172a" roughness={0.15} metalness={0.85} />
      </mesh>
      {/* 4 Wheels */}
      {[
        [-0.82, 1.02],
        [0.82, 1.02],
        [-0.82, -1.02],
        [0.82, -1.02],
      ].map(([wx, wz], i) => (
        <mesh key={i} position={[wx, 0.22, wz]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.22, 0.22, 0.16, 12]} />
          <meshStandardMaterial color="#0f172a" roughness={0.85} />
        </mesh>
      ))}
      {/* Subtle EV roof accent */}
      {isEv && (
        <mesh position={[0, 1.01, -0.1]}>
          <boxGeometry args={[0.6, 0.04, 0.9]} />
          <meshStandardMaterial color="#22d3ee" emissive="#06b6d4" emissiveIntensity={0.8} />
        </mesh>
      )}
    </group>
  );
}

export const CampusEnvironment: React.FC<CampusEnvironmentProps> = ({
  parking,
  showParkingOverlay,
  onSelectParkingSlot,
}) => {
  const asphaltTex = useMemo(() => createAsphaltTexture(), []);
  const paverTex = useMemo(() => createTerracottaPaverTexture(), []);
  const grassTex = useMemo(() => createGrassTexture(), []);

  return (
    <group>
      {/* Extended Campus Horizon Terrain (280x280) blending into dark navy fog */}
      <mesh position={[0, -0.04, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[280, 280]} />
        <meshStandardMaterial color="#0c1b2a" roughness={0.95} />
      </mesh>

      {/* Main Landscaped Campus Turf */}
      <mesh position={[0, 0, -4]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[146, 126]} />
        <meshStandardMaterial map={grassTex} roughness={0.92} metalness={0.02} />
      </mesh>

      {/* Terracotta-Red Entrance Promenade & Roundabout Apron (Image 1) */}
      <mesh position={[0, 0.03, 22.8]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[36, 9.4]} />
        <meshStandardMaterial map={paverTex} roughness={0.82} />
      </mesh>
      <mesh position={[0, 0.035, 24.4]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[5.6, 36]} />
        <meshStandardMaterial map={paverTex} roughness={0.82} />
      </mesh>

      {/* Main Asphalt Avenue & Internal Road Network */}
      {/* East-West Campus Boulevard */}
      <mesh position={[4, 0.02, 28.5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[124, 5.4]} />
        <meshStandardMaterial map={asphaltTex} roughness={0.84} />
      </mesh>
      {/* South Main Gate Entrance Road */}
      <mesh position={[0, 0.02, 52]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[7.2, 44]} />
        <meshStandardMaterial map={asphaltTex} roughness={0.84} />
      </mesh>
      {/* West Road to Health Sciences Block */}
      <mesh position={[-36, 0.02, 6]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[5.2, 48]} />
        <meshStandardMaterial map={asphaltTex} roughness={0.84} />
      </mesh>
      {/* East Road to Admin Dome & Academic Rotunda */}
      <mesh position={[35, 0.02, -4]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[5.2, 64]} />
        <meshStandardMaterial map={asphaltTex} roughness={0.84} />
      </mesh>

      {/* Smart Parking Lot Asphalt Deck (Image 1 foreground) */}
      <mesh position={[0, 0.025, 42.5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[62, 24.5]} />
        <meshStandardMaterial map={asphaltTex} roughness={0.82} />
      </mesh>

      {/* Green Landscaped Parking Medians */}
      {[38.2, 46.8].map((mz, idx) => (
        <mesh key={idx} position={[0, 0.05, mz]} receiveShadow>
          <boxGeometry args={[58, 0.12, 1.8]} />
          <meshStandardMaterial color="#1f5c31" roughness={0.9} />
        </mesh>
      ))}

      {/* Main Campus Entrance Archway at South Road */}
      <group position={[0, 0, 62]}>
        {[-5.2, 5.2].map((gx, i) => (
          <mesh key={i} position={[gx, 2.8, 0]} castShadow>
            <boxGeometry args={[1.2, 5.6, 1.4]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.5} />
          </mesh>
        ))}
        <mesh position={[0, 5.4, 0]} castShadow>
          <boxGeometry args={[12.8, 1.1, 1.6]} />
          <meshStandardMaterial color="#0c4a6e" roughness={0.35} metalness={0.3} />
        </mesh>
        <mesh position={[0, 5.4, 0.85]}>
          <boxGeometry args={[9.4, 0.25, 0.08]} />
          <meshStandardMaterial color="#22d3ee" emissive="#06b6d4" emissiveIntensity={0.85} />
        </mesh>
      </group>

      {/* 48 Interactive Smart Parking Bays */}
      <group>
        {parking.map((slot, idx) => {
          const [px, py, pz] = slot.position3D;
          const statusColor = slot.occupied ? '#ef4444' : '#10b981';
          const carColor = CAR_PALETTE[idx % CAR_PALETTE.length];

          const handleSlotClick = (e: ThreeEvent<MouseEvent>) => {
            e.stopPropagation();
            if (onSelectParkingSlot) {
              onSelectParkingSlot(slot.id);
            }
          };

          return (
            <group
              key={slot.id}
              position={[px, py, pz]}
              rotation={[0, slot.rotationY, 0]}
              onClick={handleSlotClick}
              onPointerOver={(e) => {
                e.stopPropagation();
                document.body.style.cursor = 'pointer';
              }}
              onPointerOut={() => {
                document.body.style.cursor = 'auto';
              }}
            >
              {/* Bay highlight pad */}
              <mesh position={[0, -0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[2.5, 4.4]} />
                <meshBasicMaterial
                  color={statusColor}
                  transparent
                  opacity={showParkingOverlay ? 0.34 : 0.14}
                />
              </mesh>
              {/* Crisp Green / Red Front LED Indicator Strip */}
              <mesh position={[0, -0.01, -2.05]}>
                <boxGeometry args={[2.2, 0.06, 0.24]} />
                <meshStandardMaterial
                  color={statusColor}
                  emissive={statusColor}
                  emissiveIntensity={showParkingOverlay ? 1.4 : 0.75}
                />
              </mesh>
              {/* Side bay stripes */}
              {[-1.25, 1.25].map((lx, i) => (
                <mesh key={i} position={[lx, -0.02, 0]}>
                  <boxGeometry args={[0.07, 0.02, 4.3]} />
                  <meshBasicMaterial color="#cbd5e1" transparent opacity={0.55} />
                </mesh>
              ))}
              {/* EV Charger Pedestal */}
              {slot.evCharger && (
                <mesh position={[0.95, 0.45, -2.1]} castShadow>
                  <boxGeometry args={[0.24, 0.9, 0.22]} />
                  <meshStandardMaterial
                    color="#0ea5e9"
                    emissive="#0284c7"
                    emissiveIntensity={0.6}
                  />
                </mesh>
              )}
              {/* 3D Car when occupied */}
              {slot.occupied && (
                <ParkedCarMesh color={carColor} isEv={slot.vehicleType === 'EV'} />
              )}
            </group>
          );
        })}
      </group>

      <TreeGrovesInstanced />
      <StreetLights />
    </group>
  );
};
