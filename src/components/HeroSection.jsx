import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function HeroSection() {
  const [currentService, setCurrentService] = useState(0)

  // Auto-rotate every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentService(prev => prev === 0 ? 1 : 0)
    }, 6000)
    
    return () => clearInterval(interval)
  }, [])

  const services = [
    {
      title: 'Premium IT Staffing\nSolutions',
      subtitle: 'Connect with pre-vetted senior developers, architects, and technical specialists. Scale your team with nearshore and onshore talent that delivers enterprise-grade results.',
      primaryBtn: 'Find Talent',
      secondaryBtn: 'View Portfolio',
      stats: [
        { number: '500+', label: 'Expert Developers' },
        { number: '48hrs', label: 'Average Match Time' },
        { number: '95%', label: 'Client Retention' }
      ]
    },
    {
      title: 'End-to-End IT\nDevelopment',
      subtitle: 'From concept to deployment, we build scalable web applications, enterprise software, and provide comprehensive managed IT services tailored to your business needs.',
      primaryBtn: 'Start Project',
      secondaryBtn: 'View Case Studies',
      stats: [
        { number: '200+', label: 'Projects Delivered' },
        { number: '24/7', label: 'Support & Monitoring' },
        { number: '100%', label: 'On-Time Delivery' }
      ]
    }
  ]

  const currentData = services[currentService]

  // Shuffle function
  const shuffle = (array) => {
    let currentIndex = array.length,
      randomIndex;

    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  };

  // Emoji data for the cards
  // Replace the emojiData array with this:
const imageData = [
  { id: 1, src: '/images/1.png', bg: '#e2e8f0' },
  { id: 2, src: '/images/2.png', bg: '#ddd6fe' },
  { id: 3, src: '/images/3.png', bg: '#fce7f3' },
  { id: 4, src: '/images/4.png', bg: '#dcfce7' },
  { id: 5, src: '/images/5.png', bg: '#fef3c7' },
  { id: 6, src: '/images/6.png', bg: '#e0f2fe' },
  { id: 7, src: '/images/7.png', bg: '#fee2e2' },
  { id: 8, src: '/images/8.png', bg: '#f3e8ff' },
  { id: 9, src: '/images/9.png', bg: '#ecfdf5' },
  { id: 10, src: '/images/10.png', bg: '#fff7ed' },
  { id: 11, src: '/images/11.png', bg: '#eff6ff' },
  { id: 12, src: '/images/12.png', bg: '#fdf4ff' },
  { id: 13, src: '/images/13.png', bg: '#f0fdf4' },
  { id: 14, src: '/images/14.png', bg: '#fffbeb' },
  { id: 15, src: '/images/15.png', bg: '#fef2f2' },
  { id: 16, src: '/images/16.png', bg: '#f8fafc' }
];

  const generateSquares = () => {
  return shuffle(imageData).map((sq) => (
    <motion.div
      key={sq.id}
      layout
      transition={{ duration: 1.5, type: "spring" }}
      className="w-full h-full rounded-xl overflow-hidden border border-slate-200/50 shadow-sm"
      style={{ backgroundColor: sq.bg }}
    >
      <img 
        src={sq.src} 
        alt={`Person ${sq.id}`}
        className="w-full h-full object-cover"
      />
    </motion.div>
  ));
};

  // Shuffling Grid Component
  const ShuffleGrid = () => {
    const timeoutRef = useRef(null);
    const [squares, setSquares] = useState(generateSquares());

    useEffect(() => {
      shuffleSquares();

      return () => clearTimeout(timeoutRef.current);
    }, []);

    const shuffleSquares = () => {
      setSquares(generateSquares());

      timeoutRef.current = setTimeout(shuffleSquares, 3000);
    };

    return (
      <div className="grid grid-cols-4 grid-rows-4 h-[400px] gap-2">
        {squares.map((sq) => sq)}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side - Content */}
        <div className="text-center lg:text-left">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentService}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                {currentData.title.split('\n').map((line, index) => (
                  <div key={index}>{line}</div>
                ))}
              </h1>
              
              <p className="text-xl text-slate-600 mb-10 max-w-2xl leading-relaxed">
                {currentData.subtitle}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                <motion.button 
                  className={`px-8 py-4 rounded-xl font-semibold text-lg ${
                    currentService === 0 
                      ? 'bg-slate-900 text-white hover:bg-slate-800' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {currentData.primaryBtn}
                </motion.button>
                <motion.button 
                  className="px-8 py-4 rounded-xl font-semibold text-lg bg-white/80 backdrop-blur-md border border-slate-200/50 text-slate-700 hover:bg-white/90"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {currentData.secondaryBtn}
                </motion.button>
              </div>
              
              {/* Stats */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                {currentData.stats.map((stat, index) => (
                  <motion.div 
                    key={index}
                    className="bg-white/70 backdrop-blur-md border border-slate-200/50 rounded-2xl px-6 py-4 text-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <motion.div 
                      className="text-2xl font-bold text-slate-900"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    >
                      {stat.number}
                    </motion.div>
                    <div className="text-sm text-slate-600">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Side - Shuffling Grid */}
        <div className="flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <ShuffleGrid />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default HeroSection