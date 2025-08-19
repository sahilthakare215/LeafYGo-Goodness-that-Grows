import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const logoVariants = {
  hidden: { y: -50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
      duration: 2
    }
  },
};

const lettersVariants = {
  hidden: { x: 0 },
  broken: {
    x: [0, 5, -5, 0],
    y: [0, -3, 3, 0],
    scale: [1, 1.1, 0.9, 1],
    transition: {
      duration: 1.5,
      ease: "easeInOut"
    }
  }
};

function Navbar() {
  const tabs = ['Home', 'Help', 'Education', 'Products'];
  const [hoveredTab, setHoveredTab] = useState(null);
  const location = useLocation();
  const [showLogo, setShowLogo] = useState(false);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Montserrat:wght@700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    const initialTimer = setTimeout(() => setShowLogo(true), 100);

    let animationLoop;
    const startAnimationLoop = () => {
      animationLoop = setInterval(() => {
        setShowLogo(false);
        setTimeout(() => setShowLogo(true), 1000);
      }, 5000);
    };

    setTimeout(startAnimationLoop, 2000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(animationLoop);
    };
  }, []);

  const navStyle = {
    backgroundColor: '#2A3A2C',
    padding: '10px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontFamily: "'Inter', sans-serif",
  };

  const logoStyle = {
    fontWeight: '700',
    fontSize: '26px',
    textDecoration: 'none',
    fontFamily: "'Montserrat', sans-serif",
    backgroundImage: 'linear-gradient(45deg, #4CAF50, #8E5C42)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    color: 'transparent',
    cursor: 'pointer',
    display: 'flex',
    gap: '0.2rem'
  };

  const linksContainer = {
    display: 'flex',
    gap: '2rem',
  };

  const baseLinkStyle = {
    textDecoration: 'none',
    fontSize: '16px',
    padding: '0.5rem 1rem',
    transition: 'color 0.3s ease, font-weight 0.3s ease',
  };

  const words = "LeafyGo".split('');

  const normalizePath = (path) => path.replace(/\/$/, ""); // remove trailing slash

  return (
    <nav style={navStyle}>
      <div style={{ minWidth: '150px' }}>
        <AnimatePresence>
          {showLogo && (
            <motion.div
              key="logo"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={logoVariants}
            >
              <Link to="/" style={logoStyle}>
                {words.map((word, idx) => (
                  <motion.span
                    key={idx}
                    variants={lettersVariants}
                    style={{ display: 'inline-block' }}
                  >
                    {word === ' ' ? '\u00A0' : word}
                  </motion.span>
                ))}
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div style={linksContainer}>
        {tabs.map((tab) => {
          const path = tab === 'Home' ? '/' : `/${tab.toLowerCase()}`;
          const isActive = normalizePath(location.pathname) === normalizePath(path);

          return (
            <Link
              key={tab}
              to={path}
              style={{
                ...baseLinkStyle,
                color: isActive ? '#4CAF50' : 'white',
                fontWeight: isActive ? '700' : '400',
              }}
              onMouseEnter={() => setHoveredTab(tab)}
              onMouseLeave={() => setHoveredTab(null)}
            >
              {tab}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default Navbar;
