import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, BookOpen, Menu, X, Award, GraduationCap, TrendingUp, Users } from 'lucide-react';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-amber-50/20 to-white overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-1/4 w-96 h-96 bg-yellow-200/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-40 right-1/4 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl"
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 bg-slate-50/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5">
          <div className="flex justify-between items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <GraduationCap className="w-8 h-8 text-yellow-500" />
              <span className="text-2xl font-bold text-foreground">EduConnect</span>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="hidden md:flex items-center bg-slate-100/80 rounded-full px-2 py-1.5"
            >
              {['Products', 'Resources', 'Pricing', 'Use Cases'].map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '')}`} 
                  className="px-5 py-2 text-muted-foreground hover:text-foreground font-medium text-sm rounded-full hover:bg-white transition-all duration-300"
                >
                  {item}
                </a>
              ))}
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden md:flex items-center space-x-3"
            >
              <button className="px-6 py-2.5 text-foreground font-medium text-sm rounded-full border border-slate-200 hover:border-slate-300 hover:bg-white transition-all duration-300">
                Log in
              </button>
              <button className="px-6 py-2.5 bg-gray-900 text-yellow-400 font-medium text-sm rounded-full hover:bg-gray-800 transition-all duration-300 shadow-lg shadow-slate-900/10">
                Sign up
              </button>
            </motion.div>

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="md:hidden mt-4 pt-4 border-t border-slate-200 space-y-3"
            >
              {['Products', 'Resources', 'Pricing', 'Use Cases'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="block py-2 text-muted-foreground">{item}</a>
              ))}
              <div className="pt-3 space-y-2">
                <button className="w-full px-6 py-2.5 text-foreground font-medium rounded-full border border-slate-300">Log in</button>
                <button className="w-full px-6 py-2.5 bg-gray-900 text-yellow-400 font-medium rounded-full">Sign up</button>
              </div>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-8 leading-[1.1] tracking-tight"
          >
            Welcome to a smarter
            <br />
            <span className="bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 bg-clip-text text-transparent">
              learning world
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Use the EduConnect platform to build educational experiences
            <br className="hidden sm:block" />
            that are quick, secure, and intelligent.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20"
          >
            <motion.button 
              whileHover={{ scale: 1.02, boxShadow: "0 20px 40px -15px rgba(0,0,0,0.3)" }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-gray-900 text-yellow-400 font-semibold text-base rounded-full transition-all duration-300 shadow-xl shadow-slate-900/20"
            >
              Begin building
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02, backgroundColor: "white" }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-white/80 text-foreground font-semibold text-base rounded-full border border-slate-200 transition-all duration-300"
            >
              Contact a team
            </motion.button>
          </motion.div>

          {/* Globe with Orbiting Cards */}
          <div className="relative max-w-6xl mx-auto h-[600px] flex items-center justify-center">
            {/* Globe Background */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
              className="w-[400px] h-[400px] md:w-[480px] md:h-[480px] rounded-full bg-gradient-to-br from-yellow-100/60 via-slate-100/50 to-amber-100/60 relative shadow-2xl shadow-yellow-500/10"
            >
              {/* Globe Lines */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 500">
                <motion.ellipse 
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.25 }}
                  transition={{ duration: 2, delay: 0.8 }}
                  cx="250" cy="250" rx="230" ry="230" fill="none" stroke="#1f2937" strokeWidth="1.5"
                />
                <motion.ellipse 
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.2 }}
                  transition={{ duration: 2, delay: 1 }}
                  cx="250" cy="250" rx="230" ry="110" fill="none" stroke="#1f2937" strokeWidth="1.5"
                />
                <motion.ellipse 
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.15 }}
                  transition={{ duration: 2, delay: 1.2 }}
                  cx="250" cy="250" rx="230" ry="60" fill="none" stroke="#1f2937" strokeWidth="1.5"
                />
                <motion.line 
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.15 }}
                  transition={{ duration: 1.5, delay: 1.4 }}
                  x1="250" y1="20" x2="250" y2="480" stroke="#1f2937" strokeWidth="1.5"
                />
                <motion.line 
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.15 }}
                  transition={{ duration: 1.5, delay: 1.5 }}
                  x1="20" y1="250" x2="480" y2="250" stroke="#1f2937" strokeWidth="1.5"
                />
                <motion.path 
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.4 }}
                  transition={{ duration: 2.5, delay: 1.6 }}
                  d="M 50 350 Q 250 150 450 350" fill="none" stroke="url(#goldGradient)" strokeWidth="2"
                />
                <defs>
                  <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#eab308" stopOpacity="0" />
                    <stop offset="50%" stopColor="#f59e0b" stopOpacity="1" />
                    <stop offset="100%" stopColor="#eab308" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Glowing Connection Points */}
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute top-1/4 left-1/3 w-3 h-3 bg-yellow-500 rounded-full shadow-lg shadow-yellow-500/50"
              />
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                className="absolute top-1/2 right-1/4 w-3 h-3 bg-amber-500 rounded-full shadow-lg shadow-amber-500/50"
              />
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50"
              />
            </motion.div>

            {/* Orbiting Cards Container */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: 'center center' }}
            >
              {/* Card 1 - Learning Progress (Top) */}
              <motion.div
                className="absolute"
                style={{ top: '-30px', left: '50%', transform: 'translateX(-50%)' }}
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              >
                <motion.div 
                  whileHover={{ scale: 1.08, y: -5 }}
                  className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl shadow-gray-900/40 p-5 w-64 border border-yellow-500/30"
                >
                  <div className="space-y-3">
                    {[
                      { icon: CheckCircle, title: 'Quiz completed', sub: 'Mathematics', color: 'text-green-400', bg: 'bg-green-500/20' },
                      { icon: BookOpen, title: 'Lesson unlocked', sub: 'Advanced Physics', color: 'text-blue-400', bg: 'bg-blue-500/20' },
                      { icon: Award, title: 'Badge earned', sub: 'Top performer', color: 'text-purple-400', bg: 'bg-purple-500/20' }
                    ].map((item, i) => (
                      <motion.div 
                        key={i} 
                        className="flex items-center space-x-3"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.8 + i * 0.1 }}
                      >
                        <div className={`w-9 h-9 ${item.bg} rounded-xl flex items-center justify-center`}>
                          <item.icon className={`w-4 h-4 ${item.color}`} />
                        </div>
                        <div className="text-xs">
                          <div className="font-semibold text-white">{item.title}</div>
                          <div className="text-gray-400">{item.sub}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>

              {/* Card 2 - Student Performance (Bottom Left) */}
              <motion.div
                className="absolute"
                style={{ bottom: '30px', left: '8%' }}
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              >
                <motion.div 
                  whileHover={{ scale: 1.08, y: -5 }}
                  className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl shadow-gray-900/40 p-5 border border-yellow-500/30"
                >
                  <div className="text-xs text-gray-400 mb-3 font-medium flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-yellow-400" />
                    <span>Student Performance</span>
                  </div>
                  <div className="flex items-end justify-between gap-3 h-20">
                    {[
                      { h: 'h-10', label: 'Math', color: 'from-yellow-600 to-yellow-400' },
                      { h: 'h-14', label: 'Sci', color: 'from-amber-600 to-amber-400' },
                      { h: 'h-8', label: 'Eng', color: 'from-yellow-600 to-yellow-500' },
                      { h: 'h-20', label: 'Hist', color: 'from-amber-600 to-yellow-400' }
                    ].map((bar, i) => (
                      <motion.div 
                        key={i} 
                        className="flex flex-col items-center"
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ delay: 2 + i * 0.1, duration: 0.5, ease: "easeOut" }}
                        style={{ transformOrigin: 'bottom' }}
                      >
                        <div className={`w-8 ${bar.h} bg-gradient-to-t ${bar.color} rounded-t-lg shadow-lg`} />
                        <span className="text-[10px] text-gray-400 mt-1.5 font-medium">{bar.label}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>

              {/* Card 3 - Active Students (Bottom Right) */}
              <motion.div
                className="absolute"
                style={{ bottom: '30px', right: '8%' }}
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              >
                <motion.div 
                  whileHover={{ scale: 1.08, y: -5 }}
                  className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl shadow-gray-900/40 px-6 py-5 border border-yellow-500/30"
                >
                  <div className="text-xs text-gray-400 mb-2 font-medium flex items-center space-x-2">
                    <Users className="w-4 h-4 text-yellow-400" />
                    <span>Active Students</span>
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-bold text-white">56K</span>
                    <div className="flex items-center space-x-1.5">
                      <motion.div 
                        animate={{ scale: [1, 1.4, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-2 h-2 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50"
                      />
                      <span className="text-sm text-yellow-400 font-semibold">+14K</span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;