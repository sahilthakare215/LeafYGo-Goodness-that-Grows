import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Box, Plane } from '@react-three/drei';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import * as THREE from 'three';

// Define a color palette for the application
const colors = {
  background: '#2A3A2C',
  primary: '#4CAF50',
  secondary: '#8E5C42',
  accent: '#FFD700',
  textLight: '#F5F5DC',
  textDark: '#333333',
};

/* ------------------------------------------------------
    FarmHubModel — 3D background model with rotation/light
-------------------------------------------------------*/
function FarmHubModel() {
  const meshRef = useRef();
  const lightRef = useRef();

  useFrame(({ clock }) => {
    // Slowly rotate the main mesh
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003;
      meshRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.3) * 0.1;
    }
    // Pulse the light intensity for subtle effect
    if (lightRef.current) {
      lightRef.current.intensity = 0.4 + Math.sin(clock.elapsedTime) * 0.2;
    }
  });

  return (
    <group>
      {/* Background Plane */}
      <Plane args={[100, 100]} position={[0, 0, -10]}>
        <meshBasicMaterial attach="material" color={colors.background} />
      </Plane>

      {/* Central Group with rotation */}
      <group ref={meshRef}>
        {/* Green sphere */}
        <Sphere args={[1.5, 32, 32]} position={[0, 0, 0]}>
          <meshStandardMaterial
            attach="material"
            color={colors.primary}
            roughness={0.6}
            metalness={0.1}
          />
        </Sphere>
        {/* Brown cube */}
        <Box args={[0.7, 0.7, 0.7]} position={[0, 2, 0]}>
          <meshStandardMaterial
            attach="material"
            color={colors.secondary}
            roughness={0.7}
            metalness={0.2}
          />
        </Box>
      </group>

      {/* Lighting */}
      <ambientLight intensity={0.5} color={colors.textLight} />
      <pointLight ref={lightRef} position={[10, 10, 10]} intensity={0.8} color={colors.accent} />
    </group>
  );
}

/* ------------------------------------------------------
    ThreeBackground — full-screen 3D canvas background
-------------------------------------------------------*/
function ThreeBackground() {
  return (
    <Canvas style={{ position: 'absolute', top: 0, left: 0, zIndex: -1 }}>
      <FarmHubModel />
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  );
}

/* ------------------------------------------------------
    ScrollTitle — title animating left-to-right by scroll
-------------------------------------------------------*/
function ScrollTitle({ text }) {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const letters = text.split('');
  const total = letters.length;

  return (
    <div ref={containerRef}>
      <h1
        style={{
          fontSize: '3.5rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          color: colors.textLight,
        }}
      >
        {letters.map((char, i) => {
          const delayStart = i / (total * 1.2);
          const delayEnd = delayStart + 0.3;

          const green = useTransform(
            scrollYProgress,
            [delayStart, delayEnd],
            [colors.textLight, colors.primary]
          );

          return (
            <motion.span key={i} style={{ color: green }}>
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          );
        })}
      </h1>
    </div>
  );
}

// NEW COMPONENT: The user authentication form
function AuthForm({ onClose }) {
  const [isNewUser, setIsNewUser] = useState(true);
  const [showOtp, setShowOtp] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would handle form submission here,
    // sending data to a server and then showing the OTP screen.
    setShowOtp(true);
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would verify the OTP here.
    // For this example, we just close the form.
    alert('OTP Verified! Redirecting...');
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      zIndex: 10,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          background: colors.background,
          padding: '2rem',
          borderRadius: '10px',
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)',
          color: colors.textLight,
          width: '90%',
          maxWidth: '500px',
          position: 'relative',
        }}
      >
        <button onClick={onClose} style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          background: 'none',
          border: 'none',
          color: colors.textLight,
          fontSize: '1.5rem',
          cursor: 'pointer',
        }}>&times;</button>

        <h2 style={{ marginBottom: '1rem', textAlign: 'center' }}>
          {isNewUser ? 'Create Your Account' : 'Login'}
        </h2>

        {!showOtp ? (
          <form onSubmit={handleSubmit}>
            {isNewUser ? (
              <>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
                  <input type="email" required style={formInputStyle} />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Phone Number</label>
                  <input type="tel" required style={formInputStyle} />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Aadhar Number</label>
                  <input type="text" required style={formInputStyle} />
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Create Password</label>
                  <input type="password" required style={formInputStyle} />
                </div>
              </>
            ) : (
              <>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Aadhar Number</label>
                  <input type="text" required style={formInputStyle} />
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Password</label>
                  <input type="password" required style={formInputStyle} />
                </div>
              </>
            )}
            <button type="submit" style={submitButtonStyle}>
              Get OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit}>
            <p style={{ textAlign: 'center', marginBottom: '1rem' }}>An OTP has been sent to your phone.</p>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Enter OTP</label>
              <input type="text" required style={formInputStyle} />
            </div>
            <button type="submit" style={submitButtonStyle}>
              Verify & Submit
            </button>
          </form>
        )}

        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          {isNewUser ? (
            <>
              Already have an account? <span onClick={() => setIsNewUser(false)} style={toggleLinkStyle}>Login</span>
            </>
          ) : (
            <>
              Don't have an account? <span onClick={() => setIsNewUser(true)} style={toggleLinkStyle}>Create one</span>
            </>
          )}
        </p>
      </motion.div>
    </div>
  );
}

const formInputStyle = {
  width: '100%',
  padding: '0.75rem',
  borderRadius: '5px',
  border: '1px solid #ccc',
  boxSizing: 'border-box',
  backgroundColor: '#f0f0f0',
  color: colors.textDark,
};

const submitButtonStyle = {
  width: '100%',
  padding: '1rem',
  fontSize: '1rem',
  fontWeight: 'bold',
  background: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary})`,
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  color: colors.textLight,
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
};

const toggleLinkStyle = {
  color: colors.primary,
  cursor: 'pointer',
  textDecoration: 'underline',
};


/* ------------------------------------------------------
    HeroSection — top hero with animated heading & button
-------------------------------------------------------*/
// MODIFIED COMPONENT: now accepts a prop to handle button clicks
function HeroSection({ onJoinClick }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      style={{
        position: 'relative',
        zIndex: 1,
        padding: '6rem 2rem',
        textAlign: 'center',
        backdropFilter: 'blur(4px)',
        color: colors.textLight,
      }}
    >
      <ScrollTitle text="LeafyGo — Liberating Farmers" />

      <motion.p
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          fontSize: '1.3rem',
          lineHeight: '1.8',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 1 }}
      >
        Farmers grow our food, yet middlemen pocket 60–80% of the profits.
        LeafyGo is building a hub-to-hub network that lets farmers sell
        directly to consumers — fair prices, fresh produce, no exploitation.
      </motion.p>

      <motion.p
        style={{
          maxWidth: '800px',
          margin: '1rem auto 0 auto',
          fontSize: '1.1rem',
          lineHeight: '1.7',
          opacity: 0.85,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1.2 }}
      >
        By connecting rural producers with urban consumers, we aim to
        eliminate unnecessary intermediaries, reduce wastage, and ensure
        farmers can plan crops with confidence.
      </motion.p>

      <motion.button
        onClick={onJoinClick} // ADDED: onClick handler
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{
          marginTop: '2rem',
          padding: '1rem 2rem',
          fontSize: '1rem',
          fontWeight: 'bold',
          background: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary})`,
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          color: colors.textLight,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
        }}
      >
        Join the Movement
      </motion.button>
    </motion.section>
  );
}

/* ------------------------------------------------------
    ProblemSection — highlights broken farming system
-------------------------------------------------------*/
function ProblemSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section
      ref={ref}
      style={{
        position: 'relative',
        zIndex: 1,
        padding: '3rem 2rem',
        maxWidth: '900px',
        margin: '0 auto',
        backdropFilter: 'blur(4px)',
        textAlign: 'center',
        color: colors.textLight,
      }}
    >
      <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        The Broken Farming System
      </h2>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
        }}
      >
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{
            position: 'relative',
            width: '50vw',
            height: '50vh',
            border: `2px solid ${colors.accent}`,
            borderRadius: '1rem',
            overflow: 'hidden',
            backgroundColor: `rgba(42, 58, 44, 0.8)`,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4)',
          }}
        >
          <style>
            {`
              /* Styling the scrollbar for the problem-section-scroller */
              #problem-section-scroller::-webkit-scrollbar {
                width: 8px;
              }
              
              #problem-section-scroller::-webkit-scrollbar-track {
                background: rgba(0, 0, 0, 0.2);
                border-radius: 10px;
              }
              
              #problem-section-scroller::-webkit-scrollbar-thumb {
                background: ${colors.primary};
                border-radius: 10px;
              }
            `}
          </style>
          <motion.div
            id="problem-section-scroller"
            initial={{ y: "100%" }}
            animate={isInView ? { y: "0%" } : {}}
            transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
            style={{
              flexGrow: 1,
              overflowY: 'scroll',
              padding: '1.5rem',
              textAlign: 'left',
              color: colors.textLight,
            }}
          >
            <p style={{ fontSize: '1.05rem', lineHeight: '1.8', marginBottom: '1rem' }}>
              Agriculture supports <strong>40% of India’s workforce</strong> but contributes only
              <strong> 16–18% of GDP</strong>. Farmers earn a fraction of retail prices because produce
              passes through commission agents, traders, distributors, and retailers. Weak interstate
              logistics, lack of cold storage, and poor price discovery worsen the problem.
            </p>

            <p style={{ fontSize: '1.05rem', lineHeight: '1.8', marginBottom: '1rem' }}>
              For example: Kashmiri apple farmers earn ₹30–₹40/kg, while Mumbai consumers pay
              ₹150–₹180/kg. Tomato farmers in Maharashtra often get ₹6–₹8/kg, while the same tomatoes
              retail for ₹30–₹40/kg in Pune. Similarly, potato farmers in West Bengal earn around ₹5–₹6/kg,
              but consumers in Delhi pay ₹25–₹30/kg.
            </p>

            <p style={{ fontSize: '1.05rem', lineHeight: '1.8', marginBottom: '1rem' }}>
              The <strong>high wastage rate</strong> is alarming: over 30–35% of fruits and vegetables
              spoil before reaching the market due to poor cold storage and long transit times. Mangoes,
              bananas, and leafy vegetables are particularly vulnerable. Farmers often have to sell
              spoiled produce at drastically reduced prices, or discard it entirely.
            </p>

            <p style={{ fontSize: '1.05rem', lineHeight: '1.8', marginBottom: '1rem' }}>
              <strong>Price transparency</strong> is also missing: farmers cannot predict which crops
              will fetch good prices, leading to overproduction of some items and scarcity of others.
              Consumers face price volatility, while farmers remain financially insecure. Even government
              Minimum Support Prices (MSP) often do not reach small farmers effectively due to
              fragmented supply chains.
            </p>

            <p style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
              In addition, small and marginal farmers struggle to access credit, insurance, and modern
              farming equipment, keeping them trapped in debt cycles. The combination of low income,
              middlemen exploitation, spoilage, and lack of market knowledge creates a vicious cycle
              that limits growth and innovation in agriculture.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------
    SolutionSection — hub-to-hub cooperative solution
-------------------------------------------------------*/
function SolutionSection() {
  return (
    <motion.section
      style={{
        position: 'relative',
        zIndex: 1,
        padding: '3rem 2rem',
        maxWidth: '900px',
        margin: '0 auto',
        backdropFilter: 'blur(4px)',
        color: colors.textLight,
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
    >
      <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        Our Hub-to-Hub Solution
      </h2>

      <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
        LeafyGo is creating <b>physical centres (hubs)</b> across India where farmers can
        directly meet consumers — cutting out unnecessary intermediaries. Farmers sell
        collectively, reducing costs and gaining bargaining power.
      </p>

      <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginTop: '1rem' }}>
        But what if local farmers can’t grow everything their city needs? For example,
        <b> Mumbai cannot grow apples at scale</b>. Through LeafyGo, a <b>Kashmir hub</b>
        supplies apples to the <b>Mumbai hub</b>. Mumbai farmers still earn by distributing
        these apples directly to local buyers — no distributors, no inflated prices.
      </p>

      <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginTop: '1rem' }}>
        This hub-to-hub network mirrors the <b>Netherlands’ cooperative system</b> — where
        farmer-owned hubs trade regionally — and adapts <b>America’s direct-to-consumer
        model</b> of community-supported agriculture. By combining both, LeafyGo creates
        an <b>organization-driven supply web</b> that works nationally.
      </p>

      <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginTop: '1rem' }}>
        <b>Real finance impact:</b> Suppose a Kashmiri farmer sells apples worth ₹1,00,000.
        Traditionally, middlemen take 50–60%, leaving ₹40,000 for the farmer. Through LeafyGo
        hubs, farmers retain <b>₹70,000–₹80,000</b>. Urban farmers distributing through hubs
        can earn <b>30–50% more</b> because consumers pay less while farmers get more.
      </p>

      <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginTop: '1rem' }}>
        Each LeafyGo hub is a <b>farmer-owned cooperative</b>. Profits are shared equally,
        cold storage is shared, and transport is coordinated. This is not theory —
        <b> Farmer Producer Companies (FPCs)</b> in Gujarat and Madhya Pradesh using
        similar systems have already reported <b>30–50% income growth</b>. LeafyGo is
        scaling this nationwide with a digitally connected, physical hub-to-hub network.
      </p>

      <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginTop: '1rem' }}>
        With data analytics and AI-powered demand prediction, hubs can forecast pricing,
        reduce wastage, and guide farmers on which crops to plant. This combination of
        physical infrastructure and digital intelligence maximizes farmer profits and
        minimized food loss.
      </p>
    </motion.section>
  );
}

/* ------------------------------------------------------
    CTASection — call to action for participation
-------------------------------------------------------*/
function CTASection() {
  return (
    <motion.section
      style={{
        position: 'relative',
        zIndex: 1,
        padding: '3rem 2rem',
        textAlign: 'center',
        backdropFilter: 'blur(4px)',
        color: colors.textLight,
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
    >
      <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        Be Part of the Change
      </h2>
      <p
        style={{
          fontSize: '1.1rem',
          lineHeight: '1.8',
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        Whether you’re a farmer tired of low profits or a consumer demanding fair
        prices, LeafyGo is your platform. We’re starting with hubs in
        <b> Kashmir, Mumbai, Punjab, and Bengaluru</b> — expanding nationwide in
        2025. Join us and become part of India’s agricultural revolution.
      </p>
    </motion.section>
  );
}

/* ------------------------------------------------------
    Main Home Page
-------------------------------------------------------*/
export default function Home() {
  // NEW STATE: to control the visibility of the form
  const [showForm, setShowForm] = useState(false);

  return (
    <main
      style={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100vh',
        color: colors.textLight,
        fontFamily: 'sans-serif',
        background: colors.background,
      }}
    >
      <ThreeBackground />
      {/* MODIFIED: passing a handler to HeroSection */}
      <HeroSection onJoinClick={() => setShowForm(true)} />
      <ProblemSection />
      <SolutionSection />
      <CTASection />

      {/* NEW: Conditionally render the AuthForm component */}
      {showForm && <AuthForm onClose={() => setShowForm(false)} />}
    </main>
  );
}