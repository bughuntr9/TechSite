import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Counter Hook for animated counting
const useCounter = (end, duration = 2000, shouldStart = false) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!shouldStart) {
      setCount(0)
      return
    }

    let startTime = null
    const startValue = 0
    const endValue = parseInt(end.toString().replace(/[^\d]/g, ''))

    const animate = (currentTime) => {
      if (startTime === null) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const current = startValue + (endValue - startValue) * easeOutQuart
      
      setCount(Math.floor(current))
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    requestAnimationFrame(animate)
  }, [end, duration, shouldStart])

  // Format the count back to original format
  const formatCount = (num) => {
    const original = end.toString()
    if (original.includes('+')) return `${num}+`
    if (original.includes('%')) return `${num}%`
    if (original.includes('hrs')) return `${num}hrs`
    if (original.includes('/')) return original.replace(/\d+/, num)
    return num.toString()
  }

  return formatCount(count)
}

// Animated Counter Component
const AnimatedStat = ({ number, label, shouldAnimate, delay = 0 }) => {
  const animatedNumber = useCounter(number, 1500, shouldAnimate)

  return (
    <motion.div 
      className="bg-white/60 backdrop-blur-md border border-slate-200/50 rounded-2xl px-6 py-4 text-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      whileHover={{ scale: 1.05 }}
    >
      <div className="text-2xl font-bold text-slate-900">{animatedNumber}</div>
      <div className="text-sm text-slate-600">{label}</div>
    </motion.div>
  )
}

function HeroSection() {
  const [currentService, setCurrentService] = useState(0)
  const [animateStats, setAnimateStats] = useState(false)

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

  // Handle service change and trigger animation
  const handleServiceChange = (serviceIndex) => {
    if (serviceIndex !== currentService) {
      setAnimateStats(false) // Reset animation
      setCurrentService(serviceIndex)
      
      // Trigger animation after a short delay to allow content to change
      setTimeout(() => {
        setAnimateStats(true)
      }, 300)
    }
  }

  // Trigger initial animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateStats(true)
    }, 800)
    
    return () => clearTimeout(timer)
  }, [])

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

  // Image data for the cards
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
      <div className="grid grid-cols-4 grid-rows-4 h-[450px] w-[450px] gap-2">
        {squares.map((sq) => sq)}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 w-full">
        
        {/* Service Toggle Tabs */}
        <div className="flex gap-4 justify-center mb-12">
          <button 
            onClick={() => handleServiceChange(0)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              currentService === 0 
                ? 'bg-slate-900 text-white shadow-lg' 
                : 'bg-white/70 backdrop-blur-md border border-slate-200/20 text-slate-700 hover:bg-white/90'
            }`}
          >
            IT Staffing
          </button>
          <button 
            onClick={() => handleServiceChange(1)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              currentService === 1 
                ? 'bg-indigo-600 text-white shadow-lg' 
                : 'bg-white/70 backdrop-blur-md border border-slate-200/20 text-slate-700 hover:bg-white/90'
            }`}
          >
            IT Services
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-center">
          
          {/* Left Side - Content */}
          <div className="flex-1 text-center lg:text-left lg:max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentService}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                {/* Badge */}
                <div className={`inline-block mb-6 px-4 py-2 rounded-full text-sm font-semibold ${
                  currentService === 0 
                    ? 'bg-white/70 backdrop-blur-md border border-slate-200/20 text-slate-600'
                    : 'bg-indigo-100 text-indigo-700'
                }`}>
                  {currentService === 0 ? '🎯 Elite IT Talent' : '⚡ Custom Solutions'}
                </div>
                
                {/* Title */}
                <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                  {currentData.title.split('\n').map((line, index) => (
                    <div key={index}>{line}</div>
                  ))}
                </h1>
                
                {/* Subtitle */}
                <p className="text-xl text-slate-600 mb-10 max-w-2xl leading-relaxed">
                  {currentData.subtitle}
                </p>
                
                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                  <motion.button 
                    className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all ${
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
                    className="px-8 py-4 rounded-xl font-semibold text-lg bg-white/80 backdrop-blur-md border border-slate-200/50 text-slate-700 hover:bg-white/90 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {currentData.secondaryBtn}
                  </motion.button>
                </div>
                
                {/* Stats with Animation */}
                <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                  {currentData.stats.map((stat, index) => (
                    <AnimatedStat
                      key={`${currentService}-${index}`}
                      number={stat.number}
                      label={stat.label}
                      shouldAnimate={animateStats}
                      delay={index * 0.1}
                    />
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
    </div>
  )
}

export default HeroSection