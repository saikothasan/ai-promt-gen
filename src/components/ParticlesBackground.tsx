import { useCallback } from 'react';
import Particles from 'react-particles';
import { loadSlim } from 'tsparticles-slim';
import type { Engine } from 'tsparticles-engine';
import { useThemeStore } from '../store/useStore';

const ParticlesBackground = () => {
  const { isDark } = useThemeStore();
  
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        background: {
          color: {
            value: isDark ? '#1a1a1a' : '#ffffff',
          },
        },
        particles: {
          color: {
            value: isDark ? '#6B46C1' : '#4299E1',
          },
          links: {
            color: isDark ? '#38B2AC' : '#6B46C1',
            distance: 150,
            enable: true,
            opacity: 0.2,
            width: 1,
          },
          move: {
            enable: true,
            speed: 1,
          },
          number: {
            value: 50,
          },
          opacity: {
            value: 0.3,
          },
          size: {
            value: { min: 1, max: 3 },
          },
        },
      }}
    />
  );
};

export default ParticlesBackground;