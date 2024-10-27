import React from 'react';

const ParticleBackground = () => {
  // Generate random particle configurations
  const particles = [...Array(80)].map((_, i) => ({
    id: i,
    size: Math.random() * 0.3 + 0.1, // Size between 0.1 and 0.4
    speed: Math.random() * 15 + 10,  // Speed between 10 and 25 seconds
    startX: Math.random() * 100,
    startY: Math.random() * 100,
    endX: Math.random() * 100,
    endY: Math.random() * 100,
    delay: Math.random() * -15, // Random start time
  }));

  return (
    <div className="fixed inset-0 -z-10 bg-black overflow-hidden">
      <svg
        className="w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Glow filter for particles */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="0.3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Particle shape definition */}
          <circle id="particle" cx="0" cy="0" r="1" fill="white" filter="url(#glow)" />
        </defs>

        {/* Background */}
        <rect width="100" height="100" fill="black" />

        {/* Particles */}
        {particles.map((particle) => (
          <g key={particle.id}>
            <use
              href="#particle"
              transform={`translate(${particle.startX}, ${particle.startY}) scale(${particle.size})`}
            >
              {/* Main movement animation */}
              <animateMotion
                dur={`${particle.speed}s`}
                begin={`${particle.delay}s`}
                repeatCount="indefinite"
                path={`M 0 0 
                      C ${Math.random() * 50 - 25} ${Math.random() * 50 - 25}, 
                        ${Math.random() * 50 - 25} ${Math.random() * 50 - 25}, 
                        ${particle.endX - particle.startX} ${particle.endY - particle.startY}`}
              />

              {/* Opacity pulsing */}
              <animate
                attributeName="opacity"
                values="0;0.8;0.2;0.8;0"
                dur={`${particle.speed * 0.8}s`}
                begin={`${particle.delay}s`}
                repeatCount="indefinite"
              />

              {/* Size pulsing */}
              <animate
                attributeName="r"
                values={`${1};${1.2};${1};${0.8};${1}`}
                dur={`${particle.speed * 0.5}s`}
                begin={`${particle.delay}s`}
                repeatCount="indefinite"
              />
            </use>
          </g>
        ))}

        {/* Additional ambient particles */}
        {[...Array(20)].map((_, i) => (
          <circle
            key={`ambient-${i}`}
            r="0.1"
            fill="white"
            opacity="0.3"
            filter="url(#glow)"
          >
            <animate
              attributeName="cx"
              values={`${Math.random() * 100};${Math.random() * 100}`}
              dur={`${20 + Math.random() * 10}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="cy"
              values={`${Math.random() * 100};${Math.random() * 100}`}
              dur={`${20 + Math.random() * 10}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.1;0.4;0.1"
              dur={`${5 + Math.random() * 5}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </svg>
    </div>
  );
};

export default ParticleBackground;