/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Info, 
  ChevronRight, 
  ChevronLeft,
  Maximize2,
  Minimize2,
  Orbit,
  Zap
} from 'lucide-react';

// Planet Data
const PLANETS = [
  {
    id: 'mercury',
    name: 'Mercury',
    color: '#A5A5A5',
    size: 6,
    distance: 60,
    speed: 4.1, // Relative to earth speed (shorter duration = faster)
    description: 'The smallest and innermost planet in the Solar System. It orbits the Sun every 88 Earth days.',
    details: {
      type: 'Terrestrial',
      radius: '2,439 km',
      dayLength: '58d 15h 30m',
      moons: 0
    }
  },
  {
    id: 'venus',
    name: 'Venus',
    color: '#E3BB76',
    size: 10,
    distance: 90,
    speed: 1.6,
    description: 'Often called Earth\'s sister planet, Venus is the hottest planet in our solar system because of its thick atmosphere.',
    details: {
      type: 'Terrestrial',
      radius: '6,051 km',
      dayLength: '116d 18h',
      moons: 0
    }
  },
  {
    id: 'earth',
    name: 'Earth',
    color: '#2271B3',
    size: 11,
    distance: 125,
    speed: 1,
    description: 'Our home planet and the only planet known to host life. It has huge oceans and a protective atmosphere.',
    details: {
      type: 'Terrestrial',
      radius: '6,371 km',
      dayLength: '24h',
      moons: 1
    }
  },
  {
    id: 'mars',
    name: 'Mars',
    color: '#E27B58',
    size: 8,
    distance: 160,
    speed: 0.53,
    description: 'Known as the Red Planet, it is home to Olympus Mons, the largest volcano in our solar system.',
    details: {
      type: 'Terrestrial',
      radius: '3,389 km',
      dayLength: '1d 0h 37m',
      moons: 2
    }
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    color: '#D39C7E',
    size: 24,
    distance: 220,
    speed: 0.08,
    description: 'The largest planet in our solar system, Jupiter is a gas giant with a Great Red Spot that is a centuries-old storm.',
    details: {
      type: 'Gas Giant',
      radius: '69,911 km',
      dayLength: '9h 56m',
      moons: 95
    }
  },
  {
    id: 'saturn',
    name: 'Saturn',
    color: '#C5AB6E',
    size: 20,
    distance: 280,
    speed: 0.03,
    description: 'Famous for its spectacular ring system, Saturn is the second-largest planet and another gas giant.',
    details: {
      type: 'Gas Giant',
      radius: '58,232 km',
      dayLength: '10h 42m',
      moons: 146
    },
    hasRings: true
  },
  {
    id: 'uranus',
    name: 'Uranus',
    color: '#BBE1E4',
    size: 14,
    distance: 340,
    speed: 0.012,
    description: 'An ice giant that orbits the Sun on its side, Uranus has a beautiful cyan color due to methane in its atmosphere.',
    details: {
      type: 'Ice Giant',
      radius: '25,362 km',
      dayLength: '17h 14m',
      moons: 28
    }
  },
  {
    id: 'neptune',
    name: 'Neptune',
    color: '#6081FF',
    size: 14,
    distance: 400,
    speed: 0.006,
    description: 'The most distant planet from the Sun, Neptune is a cold, dark, and windy ice giant.',
    details: {
      type: 'Ice Giant',
      radius: '24,622 km',
      dayLength: '16d 6h',
      moons: 16
    }
  }
];

interface PlanetProps {
  planet: any;
  isSelected: boolean;
  onClick: () => void;
  timeScale: number;
}

const Planet: React.FC<PlanetProps> = ({ planet, isSelected, onClick, timeScale }) => {
  // Speed is inverse to duration. Base duration for Earth is 20s.
  const duration = (20 / (planet.speed * timeScale));

  return (
    <div 
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{ zIndex: isSelected ? 50 : 10 }}
    >
      {/* Orbit Line */}
      <div 
        className="absolute border border-white/5 rounded-full pointer-events-none"
        style={{ 
          width: planet.distance * 2, 
          height: planet.distance * 2,
        }}
      />

      {/* Orbit Container */}
      <motion.div
        className="absolute flex items-center justify-center pointer-events-none"
        style={{ width: planet.distance * 2, height: planet.distance * 2 }}
        animate={{ rotate: 360 }}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        {/* Planet Itself */}
        <motion.div
          id={`planet-${planet.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className={`cursor-pointer pointer-events-auto relative group`}
          style={{ 
            width: planet.size, 
            height: planet.size,
            left: planet.distance,
            backgroundColor: planet.color,
            borderRadius: '50%',
            boxShadow: `0 0 ${planet.size}px ${planet.color}44`
          }}
          whileHover={{ scale: 1.2 }}
        >
          {/* Label on Hover */}
          {!isSelected && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black/80 text-white text-[10px] px-2 py-0.5 rounded border border-white/10 backdrop-blur-sm pointer-events-none">
              {planet.name}
            </div>
          )}

          {/* Saturn's Rings */}
          {planet.hasRings && (
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-[3px] border-[#C5AB6E]/30 rounded-full rotate-[25deg]"
              style={{ width: planet.size * 2.2, height: planet.size * 0.8 }}
            />
          )}

          {/* Selection Highlight */}
          {isSelected && (
            <motion.div 
              layoutId="select-ring"
              className="absolute -inset-2 border-2 border-white/40 rounded-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

const Stars = () => {
  const starsRef = useRef<HTMLDivElement>(null);
  
  return (
    <div ref={starsRef} className="absolute inset-0 overflow-hidden pointer-events-none bg-[#050505]">
      {[...Array(200)].map((_, i) => (
        <div
          key={i}
          className="absolute bg-white rounded-full"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: Math.random() * 2,
            height: Math.random() * 2,
            opacity: Math.random() * 0.7,
            animation: `twinkle ${2 + Math.random() * 3}s infinite linear`
          }}
        />
      ))}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
};

export default function App() {
  const [selectedPlanet, setSelectedPlanet] = useState<any>(null);
  const [timeScale, setTimeScale] = useState(1);
  const [showPaths, setShowPaths] = useState(true);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-white font-sans flex items-center justify-center">
      <Stars />

      {/* Main Solar System Stage */}
      <div className="relative flex items-center justify-center transition-transform duration-700 ease-in-out" 
           style={{ transform: selectedPlanet ? 'scale(1.2)' : 'scale(1)' }}>
        
        {/* Sun */}
        <div 
          id="sun"
          className="relative z-20 w-16 h-16 rounded-full bg-[#FFD700] shadow-[0_0_80px_#FFA500] flex items-center justify-center"
        >
          <div className="absolute inset-0 rounded-full animate-pulse blur-xl opacity-50 bg-[#FFD700]" />
        </div>

        {/* Planets */}
        {PLANETS.map((planet) => (
          <Planet 
            key={planet.id} 
            planet={planet} 
            isSelected={selectedPlanet?.id === planet.id}
            onClick={() => setSelectedPlanet(planet)}
            timeScale={timeScale}
          />
        ))}
      </div>

      {/* Controls Overlay */}
      <div className="absolute top-8 left-8 z-50 flex flex-col gap-4 pointer-events-auto">
        <div className="flex flex-col">
          <h1 className="text-3xl font-black tracking-tighter uppercase leading-none">Solar System</h1>
          <p className="text-white/40 text-[10px] uppercase font-mono tracking-widest mt-1">Stellar Explorer v1.0</p>
        </div>

        <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md p-2 rounded-xl border border-white/10 shadow-2xl">
          <div className="flex flex-col px-2">
            <span className="text-[10px] text-white/40 uppercase tracking-wider font-bold">Orbital Speed</span>
            <div className="flex items-center gap-3">
              <input 
                type="range" 
                min="0.1" 
                max="5" 
                step="0.1" 
                value={timeScale} 
                onChange={(e) => setTimeScale(parseFloat(e.target.value))}
                className="w-24 accent-white/80"
              />
              <span className="font-mono text-xs w-8">{timeScale}x</span>
            </div>
          </div>
          
          <div className="w-px h-8 bg-white/10 mx-2" />
          
          <button 
            onClick={() => setSelectedPlanet(null)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="Reset View"
          >
            <Maximize2 size={16} />
          </button>
        </div>
      </div>

      {/* Planet Details Panel */}
      <AnimatePresence>
        {selectedPlanet && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute top-0 right-0 h-full w-full max-w-sm bg-[#0A0A0A]/95 backdrop-blur-xl border-l border-white/10 z-[100] p-8 flex flex-col gap-6 shadow-[20px_0_50px_rgba(0,0,0,0.5)]"
          >
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <span className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold">Deep Space Object</span>
                <h2 className="text-5xl font-black uppercase tracking-tighter leading-none mt-1">{selectedPlanet.name}</h2>
              </div>
              <button 
                onClick={() => setSelectedPlanet(null)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <Minimize2 size={24} />
              </button>
            </div>

            <div 
              className="w-full aspect-square rounded-full flex items-center justify-center relative overflow-hidden group"
              style={{ backgroundColor: `${selectedPlanet.color}22` }}
            >
              <motion.div 
                className="w-48 h-48 rounded-full shadow-2xl relative"
                style={{ 
                  backgroundColor: selectedPlanet.color,
                  boxShadow: `inset -20px -20px 50px rgba(0,0,0,0.6), 0 0 30px ${selectedPlanet.color}44`
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              >
                {/* Surface detail representation */}
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), transparent)' }} />
              </motion.div>
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-white/70 leading-relaxed text-sm">
                {selectedPlanet.description}
              </p>

              <div className="grid grid-cols-2 gap-px bg-white/10 rounded-lg overflow-hidden border border-white/5">
                {Object.entries(selectedPlanet.details).map(([key, value]) => (
                  <div key={key} className="bg-white/5 p-4 flex flex-col gap-1">
                    <span className="text-[9px] uppercase tracking-widest text-white/40 font-bold">{key}</span>
                    <span className="text-xs font-mono">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto flex flex-col gap-3">
               <button 
                className="w-full py-4 bg-white text-black font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-white/90 transition-all flex items-center justify-center gap-2 group"
                onClick={() => setSelectedPlanet(null)}
              >
                Return to Observation
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Helpful Hint */}
      {!selectedPlanet && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50"
        >
          <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-[0.3em]">
            <Info size={12} />
            Click a planet for details
          </div>
          <div className="w-px h-12 bg-gradient-to-t from-white/20 to-transparent" />
        </motion.div>
      )}

      {/* Footer Meta */}
      <div className="absolute bottom-8 right-8 flex gap-8 pointer-events-none opacity-20">
        <div className="flex flex-col text-right">
          <span className="text-[8px] uppercase tracking-widest font-bold">Orbit Accuracy</span>
          <span className="text-[10px] font-mono leading-tight">Visual Proxy (Approx)</span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-[8px] uppercase tracking-widest font-bold">Coordinates</span>
          <span className="text-[10px] font-mono leading-tight">00:00:00.00</span>
        </div>
      </div>
    </div>
  );
}
