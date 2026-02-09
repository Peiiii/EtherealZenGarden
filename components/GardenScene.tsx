
import React, { useMemo } from 'react';
import { Canvas, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Sky, Stars, ContactShadows, Float, Environment } from '@react-three/drei';
import * as THREE from 'three';
import Flower from './Flower';
import { FlowerConfig } from '../types';

interface GardenSceneProps {
  timeOfDay: number;
  flowers: FlowerConfig[];
  onGroundClick: (pos: [number, number, number]) => void;
}

const GardenScene: React.FC<GardenSceneProps> = ({ timeOfDay, flowers, onGroundClick }) => {
  // 计算太阳位置
  const sunPosition = useMemo(() => {
    const angle = (timeOfDay / 24) * Math.PI * 2 - Math.PI / 2;
    const dist = 100;
    return [Math.cos(angle) * dist, Math.sin(angle) * dist, Math.sin(angle) * dist * 0.5] as [number, number, number];
  }, [timeOfDay]);

  // 亮度动态计算 - 进一步提升白天的基础亮度
  const ambientIntensity = useMemo(() => {
    if (timeOfDay > 6 && timeOfDay < 18) return 1.5; // 提高环境光
    if (timeOfDay > 5 && timeOfDay <= 6) return 0.4 + (timeOfDay - 5) * 1.1;
    if (timeOfDay >= 18 && timeOfDay < 19) return 1.5 - (timeOfDay - 18) * 1.1;
    return 0.35;
  }, [timeOfDay]);

  const directIntensity = useMemo(() => {
    if (timeOfDay > 6 && timeOfDay < 18) return 3.0; // 增强直射光
    return 0.5;
  }, [timeOfDay]);

  const handleGroundClick = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    // 只有点击地面时才触发播种
    if (e.object.name === 'ground') {
      onGroundClick([e.point.x, 0, e.point.z]);
    }
  };

  return (
    <div className="w-full h-full bg-slate-900">
      <Canvas shadows dpr={[1, 2]}>
        {/* 设置 near 和 far 提高深度缓冲精度，减少闪烁 */}
        <PerspectiveCamera makeDefault position={[25, 20, 25]} fov={45} near={0.1} far={500} />
        <OrbitControls 
          maxPolarAngle={Math.PI / 2.1} 
          minDistance={2} 
          maxDistance={100}
          enableDamping
          dampingFactor={0.05}
        />

        {/* 提升环境贴图贡献度，让植株更有质感 */}
        <Environment preset="park" environmentIntensity={timeOfDay > 6 && timeOfDay < 18 ? 1 : 0.2} />

        <Sky 
          sunPosition={sunPosition} 
          turbidity={0.01} 
          rayleigh={3} 
          mieCoefficient={0.005} 
          mieDirectionalG={0.8} 
        />
        {(timeOfDay < 5 || timeOfDay > 19) && (
          <Stars radius={100} depth={50} count={7000} factor={4} saturation={0} fade speed={1} />
        )}

        <ambientLight intensity={ambientIntensity} />
        <directionalLight 
          position={sunPosition} 
          intensity={directIntensity} 
          castShadow 
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0001} // 减少阴影失真
        />
        
        {/* 地面：添加 polygonOffset 彻底解决 Z-fighting */}
        <mesh 
          name="ground"
          rotation={[-Math.PI / 2, 0, 0]} 
          receiveShadow 
          onPointerDown={handleGroundClick}
        >
          <planeGeometry args={[500, 500]} />
          <meshStandardMaterial 
            color="#24451f" 
            roughness={1}
            polygonOffset
            polygonOffsetFactor={1}
            polygonOffsetUnits={1}
          />
        </mesh>

        {/* 网格稍微抬高一点点 */}
        <gridHelper args={[500, 100, "#3d6d36", "#2d5a27"]} position={[0, 0.05, 0]} />

        {/* 场景装饰：简单的远景山丘感 */}
        <mesh position={[0, -2, 0]}>
          <cylinderGeometry args={[60, 70, 4, 32]} />
          <meshStandardMaterial color="#1a3316" />
        </mesh>

        {/* 花卉渲染 */}
        {flowers.map((f) => (
          <Float key={f.id} speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
            <Flower config={f} />
          </Float>
        ))}

        {/* 阴影平面也稍微抬高 */}
        <ContactShadows 
          position={[0, 0.02, 0]}
          opacity={0.4} 
          scale={100} 
          blur={2.5} 
          far={10} 
        />
      </Canvas>
    </div>
  );
};

export default GardenScene;
