import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Users, BookOpen, TrendingUp, Menu, X } from 'lucide-react';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const stats = [
    { label: 'Students', value: '12K+', icon: Users },
    { label: 'Courses', value: '150+', icon: BookOpen },
    { label: 'Success Rate', value: '94%', icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Minimal Navigation */}
      <nav className="nav">
        <div className="container">
          <div className="nav-content">
            <div className="nav-brand">
              <GraduationCap size={24} color="black" />
              <span>EduConnect</span>
            </div>

            {/* Desktop Navigation */}
            <div className="nav-links">
              <a href="#features" className="nav-link">Features</a>
              <a href="#courses" className="nav-link">Courses</a>
              <a href="#about" className="nav-link">About</a>
              <button className="btn-primary">
                Get Started
              </button>
            </div>

            {/* Mobile menu button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="mobile-menu-btn"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mobile-nav"
            >
              <a href="#features">Features</a>
              <a href="#courses">Courses</a>
              <a href="#about">About</a>
              <button className="btn-primary">
                Get Started
              </button>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="fade-in"
            >
              Learn smarter,
              <br />
              <span className="font-medium">not harder</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="fade-in-delayed"
            >
              A modern learning platform designed for the way you think.
              Simple, effective, and built for results.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="hero-buttons"
            >
              <button className="btn-primary btn-large">
                Start Learning
              </button>
              <button className="btn-secondary btn-large">
                View Demo
              </button>
            </motion.div>
          </div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="stats fade-in-stats"
          >
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <div className="stat-icon">
                  <stat.icon size={20} color="#666" />
                </div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Simple Features Section */}
      <section className="features">
        <div className="container">
          <div className="features-header">
            <h2>
              Everything you need to succeed
            </h2>
            <p>
              Focused on what matters most for your learning journey.
            </p>
          </div>

          <div className="features-grid">
            {[
              {
                title: 'Interactive Lessons',
                description: 'Engaging content that adapts to your learning style'
              },
              {
                title: 'Progress Tracking',
                description: 'Clear insights into your learning progress'
              },
              {
                title: 'Expert Instructors',
                description: 'Learn from industry professionals'
              },
              {
                title: 'Flexible Schedule',
                description: 'Learn at your own pace, anytime'
              },
              {
                title: 'Community Support',
                description: 'Connect with fellow learners'
              },
              {
                title: 'Certificates',
                description: 'Earn recognized credentials'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="feature-item"
              >
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Simple CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>
              Ready to start learning?
            </h2>
            <p>
              Join thousands of students already learning on our platform.
            </p>
            <button className="btn-primary btn-large">
              Get Started Today
            </button>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <GraduationCap size={20} color="#999" />
              <span>© 2025 EduConnect</span>
            </div>
            <div className="footer-links">
              <a href="#privacy">Privacy</a>
              <a href="#terms">Terms</a>
              <a href="#support">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;