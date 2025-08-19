import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Box, Plane } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

const colors = {
  background: '#2A3A2C',
  primary: '#4CAF50',
  secondary: '#8E5C42',
  accent: '#FFD700',
  textLight: '#F5F5DC',
  textDark: '#333333',
};

/* -----------------------------
    3D Scene Components
-----------------------------*/
function FarmHubModelMini() {
  const meshRef = useRef();
  const lightRef = useRef();
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.006;
      meshRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.5) * 0.06;
    }
    if (lightRef.current) {
      lightRef.current.intensity = 0.4 + Math.sin(clock.elapsedTime * 0.6) * 0.15;
    }
  });

  return (
    <group>
      <Plane args={[60, 60]} position={[0, -6, -10]}>
        <meshBasicMaterial attach="material" color={colors.background} />
      </Plane>

      <group ref={meshRef} position={[0, -1, 0]}>
        <Sphere args={[1.2, 32, 32]} position={[0, 0, 0]}>
          <meshStandardMaterial attach="material" color={colors.primary} roughness={0.5} metalness={0.1} />
        </Sphere>

        <Box args={[0.5, 0.5, 0.5]} position={[2, 0.8, 0]}>
          <meshStandardMaterial attach="material" color={colors.secondary} roughness={0.7} metalness={0.2} />
        </Box>
      </group>

      <ambientLight intensity={0.5} color={colors.textLight} />
      <pointLight ref={lightRef} position={[6, 6, 8]} intensity={0.8} color={colors.accent} />
    </group>
  );
}

function ThreeBackgroundSmall() {
  return (
    <Canvas style={{ position: 'absolute', inset: 0, zIndex: -1 }} camera={{ position: [0, 2, 8] }}>
      <FarmHubModelMini />
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  );
}

/* -----------------------------
    Mock product data (with working images)
-----------------------------*/
const initialProducts = [
  {
    id: 'p1',
    title: 'Cold Storage Unit - 2 Ton (Shared Hub)',
    category: 'Infrastructure',
    price: 150000,
    rentPerDay: 3000,
    img: 'https://images.unsplash.com/photo-1600180758891-4ecb9b5b76f1?auto=format&fit=crop&w=400&q=80',
    rating: 4.6,
    description: 'Modular cold storage for hub use — shared financing option for FPCs',
    tags: ['cold-storage', 'hub', 'infrastructure'],
  },
  {
    id: 'p2',
    title: 'Mini Tractor (Utility)',
    category: 'Machines',
    price: 425000,
    rentPerDay: 7000,
    img: 'https://images.unsplash.com/photo-1599999901420-8ee7ce2b8132?auto=format&fit=crop&w=400&q=80',
    rating: 4.4,
    description: 'Reliable small tractor suited for small farms and hub logistics',
    tags: ['tractor', 'mechanization'],
  },
  {
    id: 'p3',
    title: 'Packaging & Grading Line (Basic)',
    category: 'Machinery',
    price: 65000,
    rentPerDay: 1800,
    img: 'https://images.unsplash.com/photo-1602524818020-7183c4f28f8b?auto=format&fit=crop&w=400&q=80',
    rating: 4.2,
    description: 'Semi-automated grading and packaging machine for hub processing',
    tags: ['packaging', 'quality'],
  },
  {
    id: 'p4',
    title: 'Organic Seed Kit — 1 Season (5 varieties)',
    category: 'Inputs',
    price: 2500,
    rentPerDay: 0,
    img: 'https://images.unsplash.com/photo-1601758173927-3d0b382b7e0b?auto=format&fit=crop&w=400&q=80',
    rating: 4.8,
    description: 'Certified seed pack for cooperative demonstration plots',
    tags: ['seeds', 'organic'],
  },
  {
    id: 'p5',
    title: 'Cold-chain Transport (Reefer Van) — Rent',
    category: 'Transport',
    price: 0,
    rentPerDay: 12000,
    img: 'https://images.unsplash.com/photo-1601626127335-5f83d207bfb2?auto=format&fit=crop&w=400&q=80',
    rating: 4.5,
    description: 'Short-term reefer van rental to move produce between hubs',
    tags: ['transport', 'reefer', 'logistics'],
  },
  {
    id: 'p6',
    title: 'Shared Solar Drying Unit (Hub)',
    category: 'Infrastructure',
    price: 45000,
    rentPerDay: 900,
    img: 'https://images.unsplash.com/photo-1616186770050-62c1b0c90d32?auto=format&fit=crop&w=400&q=80',
    rating: 4.3,
    description: 'Solar-driven dryer for value-add products and reduced waste',
    tags: ['solar', 'drying'],
  },
];

/* -----------------------------
    Card preview mesh for each product
-----------------------------*/
function CardPreviewMesh({ index = 0 }) {
  const ref = useRef();
  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.02 + (index % 3) * 0.002;
  });

  const shape = index % 3;
  if (shape === 0) {
    return (
      <mesh ref={ref} position={[0, -0.5, 0]}>
        <sphereGeometry args={[0.6, 24, 24]} />
        <meshStandardMaterial color={colors.primary} roughness={0.4} metalness={0.1} />
      </mesh>
    );
  }
  if (shape === 1) {
    return (
      <mesh ref={ref} position={[0, -0.5, 0]}>
        <boxGeometry args={[0.9, 0.6, 0.5]} />
        <meshStandardMaterial color={colors.secondary} roughness={0.6} />
      </mesh>
    );
  }
  return (
    <mesh ref={ref} position={[0, -0.5, 0]}>
      <coneGeometry args={[0.6, 1.2, 20]} />
      <meshStandardMaterial color={colors.accent} roughness={0.5} />
    </mesh>
  );
}

/* -----------------------------
    Main ShopRentPage Component
-----------------------------*/
export default function ShopRentPage() {
  const [products] = useState(initialProducts);
  const [mode, setMode] = useState('buy');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [rentDays, setRentDays] = useState(1);
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem('leafygo_cart');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('leafygo_cart', JSON.stringify(cart));
  }, [cart]);

  const categories = ['All', 'Infrastructure', 'Machines', 'Machinery', 'Inputs', 'Transport'];

  const filtered = products
    .filter(p => (category === 'All' ? true : p.category === category))
    .filter(p => {
      const q = query.trim().toLowerCase();
      if (!q) return true;
      return (p.title + ' ' + p.tags.join(' ') + ' ' + (p.description || '')).toLowerCase().includes(q);
    });

  function currency(n) {
    return n === 0 ? '—' : `₹${n.toLocaleString('en-IN')}`;
  }

  function addToCart(prod, qty = 1) {
    setCart(prev => {
      const key = `${prod.id}-${mode}`;
      const exists = prev.find(i => i.key === key);
      if (exists) return prev.map(i => (i.key === key ? { ...i, qty: i.qty + qty } : i));
      return [
        { key, id: prod.id, title: prod.title, price: mode === 'buy' ? prod.price : prod.rentPerDay, qty, mode, rentDays: mode === 'rent' ? rentDays : null },
        ...prev,
      ];
    });
  }

  function removeFromCart(key) {
    setCart(prev => prev.filter(i => i.key !== key));
  }

  function updateQty(key, qty) {
    setCart(prev => prev.map(i => (i.key === key ? { ...i, qty: Math.max(1, qty) } : i)));
  }

  function clearCart() {
    setCart([]);
  }

  const subtotal = cart.reduce((s, it) => {
    const base = (it.price || 0) * it.qty;
    return it.mode === 'rent' && it.rentDays ? s + base * it.rentDays : s + base;
  }, 0);

  return (
    <main style={{ position: 'relative', minHeight: '100vh', background: colors.background, color: colors.textLight, fontFamily: 'sans-serif', overflow: 'hidden' }}>
      <ThreeBackgroundSmall />
      <section style={{ position: 'relative', zIndex: 1, padding: '3.5rem 1.5rem' }}>
        {/* Page header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '2.6rem', margin: 0, fontWeight: '700' }}>LeafyGo Shop — Buy or Rent for Hubs</h1>
          <p style={{ maxWidth: 900, margin: '0.6rem auto 0 auto', opacity: 0.9 }}>
            Purchase or rent equipment, cold storage, transport and inputs suited for farmer cooperatives and hub operations.
          </p>
        </motion.div>

        {/* Main layout */}
        <div style={{ maxWidth: 1200, margin: '2rem auto 0 auto', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.4rem' }}>
          <div>
            {/* Filters */}
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search products, hubs, tags..." style={{ padding: '10px 12px', borderRadius: 8, border: `1px solid ${colors.secondary}`, background: 'rgba(0,0,0,0.12)', color: colors.textLight, minWidth: 220 }} />
              <select value={category} onChange={e => setCategory(e.target.value)} style={{ padding: '10px', borderRadius: 8, border: `1px solid ${colors.secondary}`, background: 'transparent', color: colors.textLight }}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <label style={{ fontSize: 13 }}>Mode</label>
                  <button onClick={() => setMode('buy')} style={{ padding: '8px 12px', borderRadius: 8, border: `1px solid ${mode === 'buy' ? 'transparent' : colors.secondary}`, cursor: 'pointer', background: mode === 'buy' ? colors.primary : 'transparent', color: colors.textLight }}>Buy</button>
                  <button onClick={() => setMode('rent')} style={{ padding: '8px 12px', borderRadius: 8, border: `1px solid ${mode === 'rent' ? 'transparent' : colors.secondary}`, cursor: 'pointer', background: mode === 'rent' ? colors.secondary : 'transparent', color: colors.textLight }}>Rent</button>
                </div>
                {mode === 'rent' && (
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <label style={{ fontSize: 13 }}>Days</label>
                    <input type="number" min={1} value={rentDays} onChange={e => setRentDays(Math.max(1, Number(e.target.value)))} style={{ width: 80, padding: '8px', borderRadius: 8, border: `1px solid ${colors.secondary}` }} />
                  </div>
                )}
              </div>
            </div>

            {/* Products grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
              {filtered.map((p, i) => (
                <motion.article key={p.id} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.05 }} style={{ background: 'rgba(255,255,255,0.03)', padding: 14, borderRadius: 12, border: `2px solid ${colors.primary}`, display: 'flex', flexDirection: 'column', minHeight: 220 }}>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ width: 110, height: 90, borderRadius: 10, overflow: 'hidden', background: 'rgba(255,255,255,0.02)', position: 'relative' }}>
                      <img src={p.img} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>

                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{p.title}</h3>
                      <div style={{ fontSize: 12, opacity: 0.9, marginTop: 6 }}>{p.description}</div>
                      <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
                        <div style={{ fontSize: 14, fontWeight: 700 }}>{mode === 'buy' ? currency(p.price) : (p.rentPerDay ? `${currency(p.rentPerDay)}/day` : '—')}</div>
                        <div style={{ fontSize: 12, color: colors.accent }}>⭐ {p.rating}</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: 'auto', display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => addToCart(p, 1)} style={{ padding: '8px 12px', borderRadius: 10, background: colors.primary, border: 'none', cursor: 'pointer', color: colors.textLight }}>{mode === 'buy' ? 'Add to Cart' : 'Rent'}</button>
                      <button onClick={() => alert('Quick checkout — integrate payments')} style={{ padding: '8px 12px', borderRadius: 10, background: 'transparent', border: `1px solid rgba(255,255,255,0.06)`, color: colors.textLight }}>Buy Now</button>
                    </div>

                    <div style={{ fontSize: 12, textAlign: 'right', color: 'rgba(255,255,255,0.8)' }}>
                      <div style={{ fontWeight: 700 }}>{p.category}</div>
                      <div style={{ fontSize: 11, opacity: 0.85 }}>{p.tags.join(', ')}</div>
                    </div>
                  </div>
                </motion.article>
              ))}

              {filtered.length === 0 && <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 30, color: 'rgba(255,255,255,0.7)' }}>No matching products</div>}
            </div>
          </div>

          {/* Cart */}
          <aside style={{ background: 'rgba(255,255,255,0.03)', padding: 16, borderRadius: 12, border: `2px solid ${colors.secondary}`, height: 'fit-content' }}>
            <h4 style={{ margin: 0, fontSize: 18 }}>Cart</h4>
            <div style={{ marginTop: 12, minWidth: 260, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {cart.length === 0 && <div style={{ color: 'rgba(255,255,255,0.7)' }}>Cart is empty</div>}
              {cart.map(it => (
                <div key={it.key} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center', borderRadius: 8, padding: 8, background: 'rgba(0,0,0,0.18)' }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ fontWeight: 600 }}>{it.title}</span>
                    <span style={{ fontSize: 12, opacity: 0.7 }}>
                      {it.mode === 'rent' && it.rentDays ? `${it.rentDays} day(s)` : 'Buy'}
                    </span>
                    <span style={{ fontSize: 12, opacity: 0.8 }}>
                      {currency(it.price)} × {it.qty} = {currency(it.price * it.qty * (it.mode === 'rent' && it.rentDays ? it.rentDays : 1))}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <button onClick={() => updateQty(it.key, it.qty + 1)} style={{ padding: '2px 6px', fontSize: 12, cursor: 'pointer' }}>+</button>
                    <button onClick={() => updateQty(it.key, it.qty - 1)} style={{ padding: '2px 6px', fontSize: 12, cursor: 'pointer' }}>−</button>
                    <button onClick={() => removeFromCart(it.key)} style={{ padding: '2px 6px', fontSize: 12, cursor: 'pointer', color: 'red' }}>×</button>
                  </div>
                </div>
              ))}
            </div>

            {cart.length > 0 && (
              <div style={{ marginTop: 12, borderTop: `1px solid rgba(255,255,255,0.1)`, paddingTop: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 14 }}>
                  <span>Subtotal:</span>
                  <span>{currency(subtotal)}</span>
                </div>
                <button onClick={clearCart} style={{ marginTop: 8, width: '100%', padding: 8, borderRadius: 8, background: 'red', color: '#fff', border: 'none', cursor: 'pointer' }}>
                  Clear Cart
                </button>
              </div>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}