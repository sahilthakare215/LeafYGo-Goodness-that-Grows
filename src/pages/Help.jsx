import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Box, Plane } from '@react-three/drei';
import { motion, useInView } from 'framer-motion';

/* ------------------------------------------------------
    Color Palette
-------------------------------------------------------*/
const colors = {
  background: '#2A3A2C',
  primary: '#4CAF50',
  secondary: '#8E5C42',
  accent: '#00CED1',
  textLight: '#F5F5DC',
  checkmark: '#4CAF50', // unified checkmark color
};

/* ------------------------------------------------------
    3D Background Model
-------------------------------------------------------*/
function FarmHubModel() {
  const meshRef = useRef();
  const lightRef = useRef();

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003;
      meshRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.3) * 0.1;
    }
    if (lightRef.current) {
      lightRef.current.intensity = 0.4 + Math.sin(clock.elapsedTime) * 0.2;
    }
  });

  return (
    <group>
      <Plane args={[100, 100]} position={[0, 0, -10]}>
        <meshBasicMaterial attach="material" color={colors.background} />
      </Plane>
      <group ref={meshRef}>
        <Sphere args={[1.5, 32, 32]} position={[0, 0, 0]}>
          <meshStandardMaterial attach="material" color={colors.primary} roughness={0.6} metalness={0.1} />
        </Sphere>
        <Box args={[0.7, 0.7, 0.7]} position={[0, 2, 0]}>
          <meshStandardMaterial attach="material" color={colors.secondary} roughness={0.7} metalness={0.2} />
        </Box>
      </group>
      <ambientLight intensity={0.5} color={colors.textLight} />
      <pointLight ref={lightRef} position={[10, 10, 10]} intensity={0.8} color={colors.accent} />
    </group>
  );
}

function ThreeBackground() {
  return (
    <Canvas style={{ position: 'absolute', top: 0, left: 0, zIndex: -1 }}>
      <FarmHubModel />
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  );
}

/* ------------------------------------------------------
    Smooth Section Wrapper
-------------------------------------------------------*/
function AboutSection({ title, children }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1 }}
      style={{
        position: 'relative',
        zIndex: 1,
        padding: '3rem 2rem',
        margin: '2rem auto',
        maxWidth: '900px',
        backdropFilter: 'blur(6px)',
        backgroundColor: 'rgba(42, 58, 44, 0.85)',
        borderRadius: '16px',
        color: colors.textLight,
        boxShadow: '0 12px 24px rgba(0,0,0,0.4)',
      }}
    >
      <h2
        style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          marginBottom: '1.5rem',
          borderLeft: `5px solid ${colors.secondary}`,
          paddingLeft: '15px',
          color: colors.primary,
        }}
      >
        {title}
      </h2>
      {children}
    </motion.section>
  );
}

/* ------------------------------------------------------
    About Page
-------------------------------------------------------*/
export default function About() {
  const headingRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const card1Ref = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth automatic scrolling for Card 1
  useEffect(() => {
    const el = card1Ref.current;
    if (!el) return;
    let scrollAmount = 0;
    const speed = 0.05; // slower scroll speed

    const scrollInterval = setInterval(() => {
      if (el.scrollHeight <= el.clientHeight) return;
      scrollAmount += speed;
      if (scrollAmount >= el.scrollHeight - el.clientHeight) scrollAmount = 0;
      el.scrollTop = scrollAmount;
    }, 16); // ~60fps

    return () => clearInterval(scrollInterval);
  }, []);

  return (
    <main style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', fontFamily: 'sans-serif', background: colors.background, color: colors.textLight }}>
      <ThreeBackground />

      {/* Animated Heading */}
      <section ref={headingRef} style={{ position: 'relative', zIndex: 1, padding: '5rem 2rem 2rem 2rem', textAlign: 'center' }}>
        <motion.h1 style={{ fontWeight: 'bold', lineHeight: 1.2, display: 'inline-block', textAlign: 'center' }}>
          <motion.span
            initial={{ x: '-100vw' }}
            animate={{ x: 0 }}
            transition={{ duration: 1 }}
            style={{ fontSize: '6rem', display: 'block', color: colors.primary }}
          >
            Empowering Farmers
          </motion.span>
          <motion.span
            initial={{ x: '100vw' }}
            animate={{ x: 0 }}
            transition={{ duration: 1 }}
            style={{
              fontSize: '3rem',
              display: 'block',
              background: 'linear-gradient(90deg, #4CAF50, #00CED1, #8E5C42)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Amidst Financial Exploitation
          </motion.span>
        </motion.h1>
      </section>

      {/* Card 1 - Paragraph style */}
      <AboutSection title="Government Schemes for Farmers">
        <div
          ref={card1Ref}
          style={{
            maxHeight: '250px',
            overflow: 'hidden',
            fontSize: '1.2rem',
            lineHeight: '1.8',
            position: 'relative',
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            background: 'rgba(0,0,0,0.2)',
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.3)',
          }}
        >
          <p>
            The Indian government has implemented a variety of initiatives to support farmers and strengthen agriculture. Programs such as the Pradhan Mantri Fasal Bima Yojana (PMFBY) provide crop insurance to protect against losses due to natural calamities, pests, and diseases, ensuring financial stability. The National Mission on Natural Farming (NMNF) promotes organic, chemical-free farming and enhances soil health, reducing input costs. The Kisan Credit Card (KCC) offers affordable short-term loans for seeds, fertilizers, and irrigation, minimizing reliance on high-interest lenders. In addition, the Agriculture Infrastructure Fund provides significant funding to develop cold storage, warehouses, and supply chains, improving access to markets. Soil Health Cards, subsidized machinery programs, and market support schemes like the Minimum Support Price (MSP) collectively empower farmers, increase productivity, and enhance sustainable practices across India.
          </p>
        </div>
      </AboutSection>

      {/* Card 2 */}
      <AboutSection title="The Debt Trap: How Private Lenders Exploit Farmers">
        <ul style={{ padding: 0, listStyle: 'none', marginTop: '1rem', fontSize: '1.2rem', lineHeight: '1.8' }}>
          <li style={{ marginBottom: '1rem' }}>
            <strong style={{ color: colors.checkmark }}>High-Interest Loans:</strong> Private lenders charge rates up to 60%, trapping farmers in perpetual debt.
          </li>
          <li style={{ marginBottom: '1rem' }}>
            <strong style={{ color: colors.checkmark }}>Forced Land Sales:</strong> Farmers may sell land at throwaway prices after defaulting on loans. Example: Chikkamagaluru coffee planter lost 7.39 acres over a ₹31.9 lakh loan.
          </li>
          <li style={{ marginBottom: '1rem' }}>
            <strong style={{ color: colors.checkmark }}>Suicides Due to Financial Stress:</strong> Mounting debts and crop failures lead to tragic outcomes. Example: Odisha farmer suicide over ₹2 lakh debt.
          </li>
        </ul>
      </AboutSection>

      {/* Card 3 */}
      <AboutSection title="Our Commitment: Supporting Farmers">
        <ul style={{ padding: 0, listStyle: 'none', marginTop: '1rem' }}>
          <li style={{ marginBottom: '15px', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '1.2rem', lineHeight: '1.6' }}>
            <strong style={{ color: colors.checkmark, minWidth: '1.5rem' }}>&#10003;</strong>
            <span>Providing Affordable Inputs: Bulk seeds and fertilizers reduce costs, helping farmers save significant capital.</span>
          </li>
          <li style={{ marginBottom: '15px', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '1.2rem', lineHeight: '1.6' }}>
            <strong style={{ color: colors.checkmark, minWidth: '1.5rem' }}>&#10003;</strong>
            <span>Connecting with Corporate Buyers: Ensuring fair prices, stable demand, and timely payments for produce.</span>
          </li>
          <li style={{ marginBottom: '15px', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '1.2rem', lineHeight: '1.6' }}>
            <strong style={{ color: colors.checkmark, minWidth: '1.5rem' }}>&#10003;</strong>
            <span>Offering Financial Guidance: Helping farmers access government schemes, loans, and insurance effectively.</span>
          </li>
          <li style={{ marginBottom: '15px', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '1.2rem', lineHeight: '1.6' }}>
            <strong style={{ color: colors.checkmark, minWidth: '1.5rem' }}>&#10003;</strong>
            <span>Providing Training and Resources: Conducting workshops on sustainable practices and modern farming techniques.</span>
          </li>
        </ul>
      </AboutSection>
    </main>
  );
}
