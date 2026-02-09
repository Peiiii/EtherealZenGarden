
import React, { useMemo, useState, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { FlowerConfig, PetalShape, LeafShape } from '../types';

interface FlowerProps {
  config: FlowerConfig;
}

const Flower: React.FC<FlowerProps> = ({ config }) => {
  const { 
    petalColor, petalCount, petalSize, petalShape, 
    stemHeight, stemThickness, leafCount, leafSize, 
    leafShape, centerColor, position 
  } = config;

  const groupRef = useRef<THREE.Group>(null);
  const [growth, setGrowth] = useState(0);

  // 动画：从 0 到 1 生长
  useFrame((state, delta) => {
    if (growth < 1) {
      setGrowth((prev) => Math.min(1, prev + delta * 1.2)); 
    }
  });

  const petalGeo = useMemo(() => {
    const shape = new THREE.Shape();
    switch (petalShape) {
      case PetalShape.ROUND:
        shape.moveTo(0, 0);
        shape.bezierCurveTo(0.5, 0.5, 0.5, 1.5, 0, 2);
        shape.bezierCurveTo(-0.5, 1.5, -0.5, 0.5, 0, 0);
        break;
      case PetalShape.POINTY:
        shape.moveTo(0, 0);
        shape.lineTo(0.3, 1);
        shape.lineTo(0, 2.5);
        shape.lineTo(-0.3, 1);
        shape.closePath();
        break;
      case PetalShape.HEART:
        shape.moveTo(0, 0);
        shape.bezierCurveTo(1, 1, 1, 2.5, 0, 2);
        shape.bezierCurveTo(-1, 2.5, -1, 1, 0, 0);
        break;
      case PetalShape.SLENDER:
        shape.moveTo(0, 0);
        shape.ellipse(0, 1.5, 0.1, 1.5, 0, Math.PI * 2, false, 0);
        break;
    }
    return new THREE.ShapeGeometry(shape);
  }, [petalShape]);

  const leafGeo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.quadraticCurveTo(0.4, 0.5, 0, 1.2);
    shape.quadraticCurveTo(-0.4, 0.5, 0, 0);
    return new THREE.ShapeGeometry(shape);
  }, [leafShape]);

  return (
    <group 
      ref={groupRef} 
      position={position} 
      scale={[growth, growth, growth]}
    >
      {/* 茎 */}
      <mesh position={[0, stemHeight / 2, 0]} castShadow>
        <cylinderGeometry args={[stemThickness, stemThickness, stemHeight, 8]} />
        <meshStandardMaterial color="#2d5a27" roughness={0.7} />
      </mesh>

      {/* 花头 */}
      <group position={[0, stemHeight, 0]}>
        {/* 花芯 - 添加自发光微光让颜色更亮 */}
        <mesh castShadow>
          <sphereGeometry args={[petalSize * 0.3, 16, 16]} />
          <meshStandardMaterial 
            color={centerColor} 
            emissive={centerColor} 
            emissiveIntensity={0.2} 
          />
        </mesh>

        {/* 花瓣 */}
        {Array.from({ length: petalCount }).map((_, i) => (
          <group key={i} rotation={[0, (i * Math.PI * 2) / petalCount, Math.PI / 4]}>
            <mesh geometry={petalGeo} scale={[petalSize, petalSize, petalSize]} castShadow>
              <meshStandardMaterial 
                color={petalColor} 
                side={THREE.DoubleSide} 
                roughness={0.4}
                emissive={petalColor}
                emissiveIntensity={0.1}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* 叶片 */}
      {Array.from({ length: leafCount }).map((_, i) => (
        <group 
          key={i} 
          position={[0, (stemHeight * (i + 1)) / (leafCount + 1), 0]} 
          rotation={[0, (i * Math.PI * 2) / leafCount, Math.PI / 3]}
        >
          <mesh geometry={leafGeo} scale={[leafSize, leafSize, leafSize]} castShadow>
            <meshStandardMaterial color="#4a7c44" side={THREE.DoubleSide} roughness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

export default Flower;
