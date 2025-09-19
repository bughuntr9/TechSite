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
  const [isScrollLocked, setIsScrollLocked] = useState(false)
  const heroRef = useRef(null)
  const lastScrollTimeRef = useRef(0)
  const scrollCooldownRef = useRef(false)
  const scrollAttemptCountRef = useRef(0)
  const lastTransitionTimeRef = useRef(0)

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
    if (serviceIndex !== currentService && serviceIndex >= 0 && serviceIndex < services.length) {
      setAnimateStats(false) // Reset animation
      setCurrentService(serviceIndex)
      
      // Trigger animation after a short delay to allow content to change
      setTimeout(() => {
        setAnimateStats(true)
      }, 300)

      // Set cooldown period and track transition time
      scrollCooldownRef.current = true
      lastTransitionTimeRef.current = Date.now()
      scrollAttemptCountRef.current = 0 // Reset scroll attempt counter
      
      setTimeout(() => {
        scrollCooldownRef.current = false
      }, 3000)
    }
  }

  // Check if hero section is fully visible
  const isHeroFullyVisible = () => {
    if (!heroRef.current) return false
    
    const rect = heroRef.current.getBoundingClientRect()
    const windowHeight = window.innerHeight
    
    // Hero is fully visible if its top is at or above 0 and bottom is at or below window height
    return rect.top <= 0 && rect.bottom >= windowHeight
  }

  // Handle scroll events
  useEffect(() => {
    const handleScroll = (e) => {
      if (!isHeroFullyVisible()) return
      
      const now = Date.now()
      const timeSinceLastTransition = now - lastTransitionTimeRef.current
      const deltaY = e.deltaY || e.detail || e.wheelDelta
      
      // Check if we should allow normal scrolling ONLY for scroll-down on second service
      const shouldAllowNormalScrollDown = (
        deltaY > 0 && // Only for scroll-down
        currentService === 1 && (
          // 2 seconds have passed since last transition
          timeSinceLastTransition > 2000 ||
          // OR user has made 2+ consecutive scroll down attempts
          scrollAttemptCountRef.current >= 2
        )
      )
      
      // If escape conditions are met for scroll-down, allow normal scrolling
      if (shouldAllowNormalScrollDown) {
        return // Let the browser handle normal scrolling
      }
      
      // Otherwise, prevent default scroll behavior when hero is fully visible
      e.preventDefault()
      
      // Check if we're in general cooldown period (for service transitions)
      if (scrollCooldownRef.current) return
      
      const timeSinceLastScroll = now - lastScrollTimeRef.current
      
      // Throttle scroll events (minimum 500ms between transitions)
      if (timeSinceLastScroll < 500) return
      
      lastScrollTimeRef.current = now
      
      if (deltaY > 0) {
        // Scrolling down
        if (currentService === 0) {
          // Move from IT Staffing to IT Services
          handleServiceChange(1)
        } else {
          // Already on IT Services - count scroll attempts for escape mechanism
          scrollAttemptCountRef.current += 1
        }
      } else if (deltaY < 0) {
        // Scrolling up - ALWAYS allow transitions back to previous service
        if (currentService === 1) {
          handleServiceChange(0)
          // Reset scroll attempts when going back
          scrollAttemptCountRef.current = 0
        }
      }
    }

    // Add scroll event listeners
    window.addEventListener('wheel', handleScroll, { passive: false })
    window.addEventListener('DOMMouseScroll', handleScroll, { passive: false }) // Firefox

    return () => {
      window.removeEventListener('wheel', handleScroll)
      window.removeEventListener('DOMMouseScroll', handleScroll)
    }
  }, [currentService])

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

  // Image data for the cards - switches based on current service
  const getImageData = (serviceIndex) => {
    const folder = serviceIndex === 0 ? 'staffing' : 'services';
    return [
      { id: 1, src: `/images/${folder}/1.png`, bg: '#e2e8f0' },
      { id: 2, src: `/images/${folder}/2.png`, bg: '#ddd6fe' },
      { id: 3, src: `/images/${folder}/3.png`, bg: '#fce7f3' },
      { id: 4, src: `/images/${folder}/4.png`, bg: '#dcfce7' },
      { id: 5, src: `/images/${folder}/5.png`, bg: '#fef3c7' },
      { id: 6, src: `/images/${folder}/6.png`, bg: '#e0f2fe' },
      { id: 7, src: `/images/${folder}/7.png`, bg: '#fee2e2' },
      { id: 8, src: `/images/${folder}/8.png`, bg: '#f3e8ff' },
      { id: 9, src: `/images/${folder}/9.png`, bg: '#ecfdf5' },
      { id: 10, src: `/images/${folder}/10.png`, bg: '#fff7ed' },
      { id: 11, src: `/images/${folder}/11.png`, bg: '#eff6ff' },
      { id: 12, src: `/images/${folder}/12.png`, bg: '#fdf4ff' },
      { id: 13, src: `/images/${folder}/13.png`, bg: '#f0fdf4' },
      { id: 14, src: `/images/${folder}/14.png`, bg: '#fffbeb' },
      { id: 15, src: `/images/${folder}/15.png`, bg: '#fef2f2' },
      { id: 16, src: `/images/${folder}/16.png`, bg: '#f8fafc' }
    ];
  };

  const generateSquares = () => {
    const currentImageData = getImageData(currentService);
    return shuffle(currentImageData).map((sq) => (
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

    // Regenerate squares when service changes
    useEffect(() => {
      setSquares(generateSquares());
    }, [currentService]);

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
    <div ref={heroRef} className="min-h-screen flex items-center justify-center pt-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 w-full">
        
        {/* Slide Indicators */}
        <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-20 flex flex-col gap-4">
          {services.map((_, index) => (
            <button
              key={index}
              onClick={() => handleServiceChange(index)}
              className={`transition-all duration-300 rounded-full border-2 hover:scale-110 ${
                currentService === index
                  ? 'w-4 h-4 bg-gradient-to-r from-teal-500 to-green-500 border-white shadow-lg'
                  : 'w-3 h-3 bg-white/30 border-white/50 hover:bg-white/50'
              }`}
              aria-label={`Go to ${services[index].title.split('\n')[0]}`}
            />
          ))}
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