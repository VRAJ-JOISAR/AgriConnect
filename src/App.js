import React, { useState, useEffect } from 'react';
import './App.css';

// Main AgriConnect Application Component
const AgriConnect = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sample course data (in real app, this would come from backend API)
  const sampleCourses = [
    {
      id: 1,
      title: "Sustainable Farming Techniques",
      category: "Agriculture",
      difficulty: "Beginner",
      description: "Learn modern sustainable farming practices that protect the environment while maximizing crop yields.",
      instructor: "Dr. Sarah Johnson",
      duration: "6 weeks",
      enrolled: false,
      thumbnail: "/api/placeholder/300/200"
    },
    {
      id: 2,
      title: "Organic Crop Management",
      category: "Agriculture", 
      difficulty: "Intermediate",
      description: "Master organic farming methods, pest control, and soil health management.",
      instructor: "Prof. Michael Chen",
      duration: "8 weeks",
      enrolled: false,
      thumbnail: "/api/placeholder/300/200"
    },
    {
      id: 3,
      title: "Agricultural Technology & IoT",
      category: "Technology",
      difficulty: "Advanced", 
      description: "Explore how IoT sensors, drones, and AI are revolutionizing modern agriculture.",
      instructor: "Dr. Emily Rodriguez",
      duration: "10 weeks",
      enrolled: false,
      thumbnail: "/api/placeholder/300/200"
    }
  ];

  useEffect(() => {
    setCourses(sampleCourses);
    const savedUser = localStorage.getItem('agriconnect_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  // =========================
  // AUTH FUNCTIONS (FIXED)
  // =========================

  const handleLogin = async (email, password) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setCurrentUser(data.user);
        localStorage.setItem('agriconnect_user', JSON.stringify(data.user));
        localStorage.setItem('agriconnect_token', data.token);
        setCurrentPage('dashboard');
      } else {
        alert(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
    setLoading(false);
  };

  const handleRegister = async (userData) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Registration successful! Please login.');
        setCurrentPage('login');
      } else {
        alert(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('agriconnect_user');
    localStorage.removeItem('agriconnect_token');
    setCurrentPage('home');
  };

  const enrollInCourse = (courseId) => {
    setCourses(prevCourses =>
      prevCourses.map(course =>
        course.id === courseId
          ? { ...course, enrolled: true }
          : course
      )
    );
    alert('Successfully enrolled in course!');
  };

  // =========================
  // PAGE COMPONENTS (UNCHANGED)
  // =========================

  const HomePage = () => (
    <div className="home-page">
      <div className="hero-section">
        <div className="container">
          <h1>Welcome to AgriConnect</h1>
          <p>Your gateway to modern agricultural education and sustainable farming practices.</p>
          <div className="hero-buttons">
            <button 
              className="btn-primary btn-large"
              onClick={() => setCurrentPage('courses')}
            >
              Explore Courses
            </button>
            <button 
              className="btn-secondary btn-large"
              onClick={() => setCurrentPage('login')}
            >
              Login / Register
            </button>
          </div>
        </div>
      </div>
      
      <div className="features-section">
        <div className="container">
          <h2>Why Choose AgriConnect?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>🌱 Sustainable Learning</h3>
              <p>Learn eco-friendly farming techniques that protect our planet</p>
            </div>
            <div className="feature-card">
              <h3>👨‍🌾 Expert Instructors</h3>
              <p>Learn from industry professionals and experienced farmers</p>
            </div>
            <div className="feature-card">
              <h3>📊 Progress Tracking</h3>
              <p>Monitor your learning journey with detailed analytics</p>
            </div>
            <div className="feature-card">
              <h3>🤝 Community Support</h3>
              <p>Connect with fellow learners and agricultural enthusiasts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const LoginPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
      email: '',
      password: '',
      name: '',
      role: 'student'
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      if (isLogin) {
        handleLogin(formData.email, formData.password);
      } else {
        handleRegister(formData);
      }
    };

    return (
      <div className="auth-page">
        <div className="auth-container">
          <h2>{isLogin ? 'Login to AgriConnect' : 'Join AgriConnect'}</h2>
          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            )}
            <input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
            {!isLogin && (
              <select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            )}
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
            </button>
          </form>
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button"
              className="link-button"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Register' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    );
  };

  const CoursesPage = () => (
    <div className="courses-page">
      <div className="container">
        <h2>Available Courses</h2>
        <div className="courses-grid">
          {courses.map(course => (
            <div key={course.id} className="course-card">
              <div className="course-image">
                <div className="placeholder-image">📚</div>
              </div>
              <div className="course-content">
                <h3>{course.title}</h3>
                <p className="course-meta">
                  {course.category} • {course.difficulty} • {course.duration}
                </p>
                <p className="course-description">{course.description}</p>
                <p className="course-instructor">Instructor: {course.instructor}</p>
                <button
                  className={`btn-primary ${course.enrolled ? 'enrolled' : ''}`}
                  onClick={() => !course.enrolled && enrollInCourse(course.id)}
                  disabled={course.enrolled}
                >
                  {course.enrolled ? 'Enrolled ✓' : 'Enroll Now'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const DashboardPage = () => {
    const enrolledCourses = courses.filter(course => course.enrolled);
    
    return (
      <div className="dashboard-page">
        <div className="container">
          <h2>Welcome back, {currentUser?.name}!</h2>
          
          <div className="dashboard-stats">
            <div className="stat-card">
              <h3>{enrolledCourses.length}</h3>
              <p>Enrolled Courses</p>
            </div>
            <div className="stat-card">
              <h3>{Math.floor(Math.random() * 100)}%</h3>
              <p>Average Progress</p>
            </div>
            <div className="stat-card">
              <h3>{Math.floor(Math.random() * 10)}</h3>
              <p>Certificates Earned</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const Navigation = () => (
    <nav className="navigation">
      <div className="container nav-container">
        <div className="nav-brand" onClick={() => setCurrentPage('home')}>
          🌱 AgriConnect
        </div>
        <div className="nav-links">
          <button onClick={() => setCurrentPage('home')} className={currentPage === 'home' ? 'active' : ''}>
            Home
          </button>
          <button onClick={() => setCurrentPage('courses')} className={currentPage === 'courses' ? 'active' : ''}>
            Courses
          </button>
          {currentUser ? (
            <>
              <button onClick={() => setCurrentPage('dashboard')} className={currentPage === 'dashboard' ? 'active' : ''}>
                Dashboard
              </button>
              <button onClick={handleLogout} className="btn-secondary">
                Logout ({currentUser.name})
              </button>
            </>
          ) : (
            <button onClick={() => setCurrentPage('login')} className="btn-primary">
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage />;
      case 'courses':
        return <CoursesPage />;
      case 'dashboard':
        return currentUser ? <DashboardPage /> : <LoginPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="agriconnect-app">
      <Navigation />
      <main className="main-content">
        {renderCurrentPage()}
      </main>
      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 AgriConnect - Connecting Agriculture with Education</p>
        </div>
      </footer>
    </div>
  );
};

export default AgriConnect;
