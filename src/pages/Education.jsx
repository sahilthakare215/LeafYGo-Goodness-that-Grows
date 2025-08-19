import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

// -----------------------------------
// Global theme colors and animation
// -----------------------------------
const colors = {
  background: '#1E2A1F',
  primary: '#4CAF50',
  secondary: '#8E5C42',
  accent: '#FFD700',
  road: '#444444',
  textLight: '#F5F5DC',
  textDark: '#333333',
  letter: '#FFF8DC',
  bird: '#D9D9D9',
};

// Helper: Smooth swaying animation
function useSway(ref, speed = 1, intensity = 0.05) {
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * speed) * intensity;
    }
  });
}

// -----------------------------------
// Bird Component (flies in/out of tree)
// -----------------------------------
function Bird({ startPos, visible, onFlightComplete }) {
  const birdRef = useRef();
  const wingRef = useRef();
  const [progress, setProgress] = useState(0); // 0 = in tree, 1 = out

  useEffect(() => {
    let frame;
    const animate = () => {
      setProgress((prev) => {
        const newProgress = visible ? Math.min(prev + 0.02, 1) : Math.max(prev - 0.02, 0);
        if (visible && newProgress === 1) {
          onFlightComplete();
        }
        return newProgress;
      });
      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, [visible, onFlightComplete]);

  // Wing flapping
  useFrame((state) => {
    if (wingRef.current) {
      wingRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 10) * 0.6;
    }
  });

  // Bird flight path
  const pos = [
    THREE.MathUtils.lerp(startPos[0], 0, progress),
    THREE.MathUtils.lerp(startPos[1] + 2.5, 4, progress),
    THREE.MathUtils.lerp(startPos[2], 0, progress),
  ];

  return (
    <group ref={birdRef} position={pos} scale={[0.7, 0.7, 0.7]}>
      {/* Body */}
      <mesh>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color={colors.bird} />
      </mesh>
      {/* Wings */}
      <mesh ref={wingRef} position={[0.25, 0, 0]}>
        <boxGeometry args={[0.5, 0.05, 0.2]} />
        <meshStandardMaterial color={colors.bird} />
      </mesh>
      <mesh position={[-0.25, 0, 0]} rotation={[0, Math.PI, 0]}>
        <boxGeometry args={[0.5, 0.05, 0.2]} />
        <meshStandardMaterial color={colors.bird} />
      </mesh>
      {/* Letter */}
      {progress > 0.2 && (
        <mesh position={[0, -0.5, 0]}>
          <planeGeometry args={[0.8, 0.5]} />
          <meshStandardMaterial color={colors.letter} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}

// -----------------------------------
// Tree Component: trunk + leaf canopy
// -----------------------------------
function Tree({ position, onClick }) {
  const treeRef = useRef();
  useSway(treeRef, 1.5, 0.07);

  return (
    <group ref={treeRef} position={position} onClick={onClick} castShadow>
      {/* Trunk */}
      <mesh position={[0, 1.25, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 2.5]} />
        <meshStandardMaterial color={colors.secondary} />
      </mesh>
      {/* Leafy canopy */}
      <mesh position={[0, 3.8, 0]} castShadow>
        <coneGeometry args={[2.0, 3.0, 24]} />
        <meshStandardMaterial color={colors.primary} />
      </mesh>
    </group>
  );
}

// -----------------------------------
// Road Component: circular torus
// -----------------------------------
function Road() {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]} receiveShadow>
      <torusGeometry args={[8, 1, 16, 100]} />
      <meshStandardMaterial color={colors.road} />
    </mesh>
  );
}

// -----------------------------------
// Scene: adds lights, road, trees, bird
// -----------------------------------
function Scene({ onTreeClick, selectedIndex, onBirdFlightComplete, birdKey }) {
  const groupRef = useRef();
  const radius = 8;

  // Auto rotation
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25;
    }
  });

  const trees = Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * 2 * Math.PI;
    return [radius * Math.cos(angle), 0, radius * Math.sin(angle)];
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 15, 5]} intensity={1} castShadow />
      <pointLight position={[0, 6, 0]} intensity={0.6} color={colors.accent} />

      {/* Rotating content */}
      <group ref={groupRef}>
        <Road />
        <Text
          position={[0, 0.1, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.6}
          color={colors.accent}
          anchorX="center"
          anchorY="middle"
        >
          Click Any Tree to Learn
        </Text>

        {trees.map((pos, i) => (
          <Tree key={i} position={pos} onClick={() => onTreeClick(i)} />
        ))}

        {/* Bird */}
        {selectedIndex !== null && (
          <Bird
            key={birdKey}
            startPos={trees[selectedIndex]}
            visible={selectedIndex !== null}
            onFlightComplete={onBirdFlightComplete}
          />
        )}
      </group>
    </>
  );
}

// -----------------------------------
// Main Education Section Component
// -----------------------------------
export default function EducationSection() {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showCard, setShowCard] = useState(false);
  const [birdKey, setBirdKey] = useState(0);

  const handleTreeClick = (index) => {
    setSelectedIndex(index);
    setShowCard(false);
    setBirdKey((prev) => prev + 1); // force Bird remount
  };

  const handleBirdFlightComplete = () => {
    setShowCard(true);
  };

  const technologies = [
    { title: "Precision Agriculture", points: ["GPS and drones monitor crop health and soil.", "IoT sensors give real-time soil data.", "Automated irrigation saves water.", "Satellite imagery predicts pests.", "Reduces fertilizer waste.", "Increases yield.", "Example: Israeli farms use precision farming."] },
    { title: "Genetic and DNA Technologies", points: ["CRISPR creates disease-resistant crops.", "DNA sequencing finds best traits.", "Reduces pesticide need.", "Seeds adapted to climate.", "Boosted yield.", "Protects rare species.", "Example: Israeli & Dutch labs lead DNA crops."] },
    { title: "Organic & Sustainable Farming", points: ["Composting enriches soil.", "Rotation prevents depletion.", "Less chemical pest control.", "Biofertilizers improve microbes.", "Promotes biodiversity.", "Cleaner ecosystems.", "Example: EU farms mix organic & precision."] },
    { title: "Fertilizer Management", points: ["Overuse harms soil.", "Balanced fertilizers aid growth.", "Slow-release cuts impact.", "Soil tests guide fertilizer use.", "Organic methods last long.", "Sensors reduce costs.", "Example: Israeli farms balance fertilizers."] },
    { title: "Hydroponics & Vertical Farming", points: ["Plants grow in water, not soil.", "Vertical farms save space.", "Few pests indoors.", "Water use 70–90% lower.", "Year-round harvest.", "Automation optimizes growth.", "Example: Tel Aviv farms grow greens all year."] },
    { title: "Smart Irrigation & Water Management", points: ["Drip irrigation roots water.", "Moisture sensors optimize.", "AI timing saves water.", "Lower costs.", "Steady crops.", "Remote control apps.", "Example: AI irrigation in Israel deserts."] },
    { title: "Drones & Robotics", points: ["Drones survey and spray.", "Robots harvest efficiently.", "Soil maps from robots.", "Weed control automated.", "AI detects diseases.", "Fewer repetitive tasks.", "Example: US & Israel farms use drones."] },
    { title: "AI, IoT & Big Data", points: ["AI predicts planting & harvest.", "IoT monitors soil live.", "Big data forecasts weather.", "Farm apps plan crops.", "Smart alerts save crops.", "ML improves yield prediction.", "Example: Israeli AI farming startups."] },
  ];

  return (
    <section style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '100vh',
      background: colors.background,
      overflow: 'hidden'
    }}>
      {/* Animated Title */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          zIndex: 20,
          letterSpacing: '2px',
          textAlign: 'center',
          marginTop: '20px',
          animation: 'colorChange 4s infinite alternate',
        }}
      >
        Sharing Knowledge
      </motion.h1>

      {/* 3D Canvas */}
      <div style={{ flex: 1, position: 'relative' }}>
        <Canvas shadows camera={{ position: [0, 10, 15], fov: 55 }}>
          <Suspense fallback={null}>
            <OrbitControls enableZoom={false} />
            <Scene
              onTreeClick={handleTreeClick}
              selectedIndex={selectedIndex}
              birdKey={birdKey}
              onBirdFlightComplete={handleBirdFlightComplete}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Overlay card */}
      <AnimatePresence>
        {showCard && selectedIndex !== null && (
          <motion.div
            key="card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backdropFilter: 'blur(10px)',
              backgroundColor: 'rgba(0,0,0,0.45)',
              zIndex: 15,
              padding: '2rem',
              cursor: 'pointer'
            }}
            onClick={() => setSelectedIndex(null)}
          >
            <motion.div
              initial={{ rotateX: 90, scaleY: 0, opacity: 0 }}
              animate={{ rotateX: 0, scaleY: 1, opacity: 1 }}
              exit={{ rotateX: 90, scaleY: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{
                maxWidth: '500px',
                background: 'rgba(42,58,44,0.95)',
                borderRadius: '14px',
                padding: '1.5rem',
                color: colors.textLight,
                boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
                transformOrigin: 'top'
              }}
            >
              <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: colors.accent }}>
                {technologies[selectedIndex].title}
              </h2>
              <ul style={{ lineHeight: '1.6', fontSize: '1.05rem', paddingLeft: '1rem' }}>
                {technologies[selectedIndex].points.map((point, i) => (
                  <li key={i} style={{ marginBottom: '0.5rem' }}>{point}</li>
                ))}
              </ul>
              <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#ccc' }}>
                (Click anywhere to close)
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes colorChange {
          0% {
            color: white;
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
          }
          50% {
            color: ${colors.primary};
            text-shadow: 0 0 25px rgba(76, 175, 80, 1);
          }
          100% {
            color: white;
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
          }
        }
      `}</style>
    </section>
  );
}
