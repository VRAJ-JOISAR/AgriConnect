import React, { useState } from 'react';
import { Sprout, TrendingUp, CloudRain, ShoppingBag, Users, MessageSquare, BarChart3, Sun, Droplets, Wind, Bell, Search, Filter, MapPin, Phone, Mail, Menu, X, ChevronRight, Star, Calendar, Package, DollarSign, Leaf, Shield, Zap, Globe, AlertTriangle, Brain, Sparkles, CheckCircle, Wallet, Send, ArrowUpRight, ArrowDownRight, User, LogOut, ThermometerSun } from 'lucide-react';

const mockCrops = [
  { id: 1, name: 'Organic Wheat', farmer: 'Rajesh Kumar', price: 2500, quantity: '50 quintals', location: 'Punjab', distance: '12 km', image: '🌾', rating: 4.8 },
  { id: 2, name: 'Basmati Rice', farmer: 'Priya Sharma', price: 4500, quantity: '30 quintals', location: 'Haryana', distance: '25 km', image: '🍚', rating: 4.9 },
  { id: 3, name: 'Fresh Tomatoes', farmer: 'Amit Patel', price: 35, quantity: '200 kg', location: 'Gujarat', distance: '8 km', image: '🍅', rating: 4.7 },
  { id: 4, name: 'Green Chillies', farmer: 'Lakshmi Devi', price: 60, quantity: '100 kg', location: 'AP', distance: '15 km', image: '🌶', rating: 4.6 },
];

const mockPrices = [
  { crop: 'Wheat', price: 2450, change: 5.2 },
  { crop: 'Rice', price: 4200, change: 3.1 },
  { crop: 'Cotton', price: 6800, change: -1.8 },
  { crop: 'Maize', price: 1800, change: 1.5 },
];

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [userRole, setUserRole] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const GlassCard = ({ children, className = '', hover = false }) => (
    <div className={bg-white/90 backdrop-blur-xl border border-gray-100/50 shadow-xl rounded-3xl p-6 ${hover ? 'hover:-translate-y-1 hover:shadow-2xl transition-all duration-300' : ''} ${className}}>
      {children}
    </div>
  );

  const Button = ({ children, onClick, variant = 'primary', className = '' }) => {
    const variants = {
      primary: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50',
      secondary: 'bg-white text-gray-800 border-2 border-gray-200 hover:border-emerald-500 hover:bg-emerald-50',
      ghost: 'text-gray-700 hover:bg-gray-100',
    };
    return (
      <button onClick={onClick} className={px-6 py-3 rounded-full font-semibold transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 ${variants[variant]} ${className}}>
        {children}
      </button>
    );
  };

  const Badge = ({ children, color = 'emerald' }) => {
    const colors = {
      emerald: 'bg-emerald-100 text-emerald-700',
      blue: 'bg-blue-100 text-blue-700',
      amber: 'bg-amber-100 text-amber-700',
      red: 'bg-red-100 text-red-700',
    };
    return <span className={px-3 py-1.5 rounded-full text-xs font-bold ${colors[color]}}>{children}</span>;
  };

  const Navigation = () => (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentPage('landing')}>
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
              <Sprout className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Agri<span className="text-emerald-600">Connect</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            {!userRole ? (
              <>
                <button onClick={() => setCurrentPage('marketplace')} className="text-gray-600 hover:text-emerald-600 font-medium transition">Marketplace</button>
                <button onClick={() => setCurrentPage('prices')} className="text-gray-600 hover:text-emerald-600 font-medium transition">Prices</button>
                <button onClick={() => setCurrentPage('weather')} className="text-gray-600 hover:text-emerald-600 font-medium transition">Weather</button>
                <Button onClick={() => setCurrentPage('login')}>Get Started</Button>
              </>
            ) : (
              <>
                <button onClick={() => setCurrentPage(userRole === 'farmer' ? 'farmer-dashboard' : 'buyer-dashboard')} className="text-gray-600 hover:text-emerald-600 font-medium">Dashboard</button>
                <button onClick={() => setCurrentPage('marketplace')} className="text-gray-600 hover:text-emerald-600 font-medium">Marketplace</button>
                <button onClick={() => setCurrentPage('prices')} className="text-gray-600 hover:text-emerald-600 font-medium">Prices</button>
                <div className="flex items-center gap-3 cursor-pointer group" onClick={() => { setUserRole(null); setCurrentPage('landing'); }}>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-emerald-700" />
                  </div>
                </div>
              </>
            )}
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-4 space-y-3">
            <button onClick={() => { setCurrentPage('marketplace'); setMobileMenuOpen(false); }} className="block w-full text-left text-gray-700 hover:text-emerald-600 py-2">Marketplace</button>
            {!userRole && <Button onClick={() => { setCurrentPage('login'); setMobileMenuOpen(false); }} className="w-full">Get Started</Button>}
          </div>
        </div>
      )}
    </nav>
  );

  const LandingPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-emerald-200 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-sm font-bold text-emerald-700">Transforming Indian Agriculture</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-tight">
              Empowering <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">Farmers</span> Through<br/>
              Technology
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              Connect directly with buyers, get AI-powered insights, and track real-time market prices.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={() => setCurrentPage('login')} className="text-lg px-8 py-4">Get Started Now</Button>
              <Button variant="secondary" className="text-lg px-8 py-4">Watch Demo</Button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <div className="bg-emerald-100 p-2 rounded-full"><Users className="w-5 h-5 text-emerald-600" /></div>
                <span className="text-sm font-semibold text-gray-600">10k+ Farmers</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-blue-100 p-2 rounded-full"><Shield className="w-5 h-5 text-blue-600" /></div>
                <span className="text-sm font-semibold text-gray-600">Verified</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-200/40 to-teal-200/40 rounded-full blur-3xl"></div>
            <div className="relative bg-white/50 backdrop-blur-xl border border-white/50 rounded-[2.5rem] p-6 shadow-2xl rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
              <div className="bg-white rounded-[2rem] overflow-hidden shadow-inner">
                <div className="px-6 py-4 bg-gradient-to-r from-emerald-50 to-teal-50 border-b flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">R</div>
                    <div>
                      <div className="text-xs text-gray-500 font-semibold">Welcome</div>
                      <div className="text-sm font-bold text-gray-900">Ramesh Kumar</div>
                    </div>
                  </div>
                  <Bell className="w-5 h-5 text-gray-400" />
                </div>

                <div className="p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white">
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-3">
                      <Badge color="emerald">Wheat Crop</Badge>
                      <span className="text-xs font-bold text-gray-400">2 Acres</span>
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-2xl font-bold text-gray-900">Healthy</div>
                        <div className="text-xs text-gray-500">Ready in 5 days</div>
                      </div>
                      <div className="text-4xl">🌾</div>
                    </div>
                    <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full w-[85%] bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"></div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-5 rounded-2xl shadow-lg flex justify-between items-center">
                    <div>
                      <div className="text-xs text-gray-400">APMC Price</div>
                      <div className="text-xl font-bold mt-1">₹2,450<span className="text-sm text-gray-400">/qtl</span></div>
                    </div>
                    <div className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> +2.4%
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-4 rounded-xl shadow-sm text-center border border-gray-100">
                      <CloudRain className="w-6 h-6 mx-auto text-blue-500 mb-2"/>
                      <div className="text-xs font-bold text-gray-700">Rain Alert</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm text-center border border-gray-100">
                      <Sparkles className="w-6 h-6 mx-auto text-amber-500 mb-2"/>
                      <div className="text-xs font-bold text-gray-700">AI Tips</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -right-6 top-10 bg-white p-3 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div>
                  <div className="text-xs font-bold text-gray-800">Order Received</div>
                  <div className="text-[10px] text-gray-500">2 mins ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose AgriConnect?</h2>
            <p className="text-xl text-gray-600">Bridging the gap between farm and table</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: ShoppingBag, title: 'Direct Marketplace', desc: 'Sell to verified buyers. No middlemen.', gradient: 'from-emerald-500 to-teal-500' },
              { icon: BarChart3, title: 'APMC Insights', desc: 'Real-time price tracking.', gradient: 'from-blue-500 to-cyan-500' },
              { icon: Brain, title: 'AI Crop Doctor', desc: 'Smart crop recommendations.', gradient: 'from-purple-500 to-pink-500' }
            ].map((f, i) => (
              <GlassCard key={i} hover={true} className="group">
                <div className={w-16 h-16 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg}>
                  <f.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{f.title}</h3>
                <p className="text-gray-600">{f.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            {[
              { value: '10,000+', label: 'Active Farmers' },
              { value: '5,000+', label: 'Verified Buyers' },
              { value: '₹50Cr+', label: 'Trade Volume' },
              { value: '4.8★', label: 'User Rating' }
            ].map((s, i) => (
              <div key={i}>
                <div className="text-5xl font-bold mb-2">{s.value}</div>
                <div className="text-emerald-100">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sprout className="w-6 h-6 text-emerald-400" />
                <span className="text-xl font-bold">AgriConnect</span>
              </div>
              <p className="text-gray-400">Empowering farmers</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <div className="space-y-2 text-gray-400">
                <div className="cursor-pointer hover:text-white">About</div>
                <div className="cursor-pointer hover:text-white">Contact</div>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Features</h4>
              <div className="space-y-2 text-gray-400">
                <div className="cursor-pointer hover:text-white">Marketplace</div>
                <div className="cursor-pointer hover:text-white">Prices</div>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> +91 1800-123-456</div>
                <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> support@agriconnect.in</div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            © 2025 AgriConnect. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );

  const LoginPage = () => {
    const [selectedRole, setSelectedRole] = useState('farmer');
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50">
        <Navigation />
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="hidden md:block">
              <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="relative z-10">
                  <h2 className="text-4xl font-bold mb-6">Join the Future</h2>
                  <p className="text-xl mb-8 text-emerald-50">Transform your agricultural business</p>
                  <div className="space-y-4">
                    {[
                      { icon: Shield, text: 'Secure Platform' },
                      { icon: Zap, text: 'Instant Transactions' },
                      { icon: Globe, text: 'Multi-Language' }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                        <item.icon className="w-6 h-6" />
                        <span className="font-medium">{item.text}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-12 grid grid-cols-3 gap-4 text-center">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                      <div className="text-3xl font-bold">10k+</div>
                      <div className="text-sm text-emerald-100">Farmers</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                      <div className="text-3xl font-bold">5k+</div>
                      <div className="text-sm text-emerald-100">Buyers</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                      <div className="text-3xl font-bold">4.8★</div>
                      <div className="text-sm text-emerald-100">Rating</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <GlassCard className="shadow-2xl">
              <h2 className="text-3xl font-bold mb-2 text-gray-900">Welcome Back</h2>
              <p className="text-gray-600 mb-8">Access your dashboard</p>
              
              <div className="flex gap-3 mb-8 bg-gray-100 p-1.5 rounded-full">
                <button onClick={() => setSelectedRole('farmer')} className={flex-1 py-3 rounded-full font-bold transition-all ${selectedRole === 'farmer' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg' : 'text-gray-600'}}>
                  👨‍🌾 Farmer
                </button>
                <button onClick={() => setSelectedRole('buyer')} className={flex-1 py-3 rounded-full font-bold transition-all ${selectedRole === 'buyer' ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg' : 'text-gray-600'}}>
                  🏪 Buyer
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                  <input type="tel" placeholder="+91 98765 43210" className="w-full px-5 py-4 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-emerald-500 focus:bg-white transition-all outline-none font-medium" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                  <input type="password" placeholder="Enter password" className="w-full px-5 py-4 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-emerald-500 focus:bg-white transition-all outline-none font-medium" />
                </div>
                <Button onClick={() => { setUserRole(selectedRole); setCurrentPage(selectedRole === 'farmer' ? 'farmer-dashboard' : 'buyer-dashboard'); }} className="w-full py-4 text-lg">
                  Continue
                </Button>
                <Button variant="secondary" className="w-full py-4 text-lg">Login with OTP</Button>
              </div>

              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  New here? <span className="text-emerald-600 cursor-pointer font-bold hover:underline">Sign Up</span>
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                <button className="text-blue-600 font-bold hover:underline flex items-center gap-2 mx-auto">
                  <Globe className="w-4 h-4" /> Local Language
                </button>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    );
  };

  const FarmerDashboard = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="relative z-10 p-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <div className="flex items-center gap-2 text-emerald-200 mb-2"><Sun className="w-5 h-5" /> Good Morning</div>
              <h1 className="text-5xl font-bold mb-3">Welcome, Rajesh! 👋</h1>
              <p className="text-emerald-50 text-lg">Wheat at flowering. Prices up 2.5%</p>
            </div>
            <Button className="bg-white text-emerald-700 shadow-xl border-none">
              <Sparkles className="w-5 h-5 text-amber-500" /> AI Insights
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-blue-100">Raghunathpur, WB</p>
                  <div className="text-6xl font-bold mt-2">28°</div>
                  <p className="text-blue-100 mt-2">Partly Cloudy</p>
                </div>
                <Sun className="w-16 h-16 text-blue-100" />
              </div>
              <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-white/20">
                {['☀27°', '🌧26°', '☀29°'].map((d, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center text-sm font-bold">{d}</div>
                ))}
              </div>
            </div>
          </div>

          <GlassCard hover={true}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg flex items-center gap-2"><Sprout className="text-emerald-600" /> Crop Status</h3>
              <Badge color="emerald">Healthy</Badge>
            </div>
            <div className="relative pt-2 pb-6">
              <div className="flex justify-between text-sm font-bold text-gray-600 mb-3">
                <span>Sowing</span>
                <span className="text-emerald-600">Flowering</span>
                <span className="opacity-50">Harvest</span>
              </div>
              <div className="h-4 bg-gray-100 rounded-full overflow-hidden relative">
                <div className="h-full w-[65%] bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"></div>
                <div className="absolute top-1/2 left-[65%] -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-white border-4 border-emerald-500 rounded-full shadow-md"></div>
              </div>
            </div>
            <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-sm">Action Needed</h4>
                <p className="text-xs text-gray-600 mt-1">Apply irrigation in 24hrs</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard hover={true}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg flex items-center gap-2"><TrendingUp className="text-blue-600" /> Market</h3>
              <span className="text-xs font-bold text-gray-400">Live</span>
            </div>
            <div className="space-y-3">
              {mockPrices.map((item, i) => (
                <div key={i} className="flex justify-between items-center p-3 rounded-xl hover:bg-gray-50 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-2xl">
                      {['🌾','🍚','☁','🌽'][i]}
                    </div>
                    <div>
                      <p className="font-bold">{item.crop}</p>
                      <p className="text-xs text-gray-500">APMC</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">₹{item.price}</div>
                    <div className={text-xs font-bold ${item.change > 0 ? 'text-emerald-500' : 'text-red-500'}}>
                      {item.change > 0 ? '+' : ''}{item.change}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        <div>
          <h3 className="font-bold text-xl mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Sell Crop', icon: Wallet, gradient: 'from-emerald-500 to-teal-500' },
              { label: 'Soil Health', icon: Leaf, gradient: 'from-amber-500 to-orange-500' },
              { label: 'Weather', icon: CloudRain, gradient: 'from-blue-500 to-cyan-500' },
              { label: 'Support', icon: MessageSquare, gradient: 'from-purple-500 to-pink-500' },
            ].map((item, i) => (
              <button key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all group">
                <div className={w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg mx-auto}>
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <span className="font-bold text-gray-800">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const BuyerDashboard = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-12 text-center text-white shadow-2xl">
          <h1 className="text-5xl font-bold mb-4">Fresh from Farm 🌾</h1>
          <p className="text-gray-300 text-lg mb-6">Quality produce, fair prices</p>
          <div className="bg-white p-2 rounded-full shadow-2xl flex gap-2 max-w-2xl mx-auto">
            <div className="flex-1 flex items-center px-5 bg-gray-50 rounded-full">
              <Search className="text-gray-400 w-5 h-5" />
              <input type="text" placeholder="Search crops..." className="w-full bg-transparent p-4 outline-none text-gray-800 font-medium" />
            </div>
            <Button className="rounded-full px-8">Search</Button>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {[
            { icon: Package, value: '12', label: 'Orders', color: 'blue' },
            { icon: Star, value: '4.9', label: 'Rating', color: 'amber' },
            { icon: Users, value: '45', label: 'Farmers', color: 'emerald' },
            { icon: DollarSign, value: '₹5.2L', label: 'Spent', color: 'purple' },
          ].map((stat, i) => (
            <GlassCard key={i} className="text-center hover:shadow-xl transition-all">
              <stat.icon className={w-10 h-10 mx-auto mb-3 text-${stat.color}-600} />
              <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </GlassCard>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockCrops.map(crop => (
            <GlassCard key={crop.id} hover={true} className="group">
              <div className="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center text-5xl mb-4 group-hover:scale-105 transition-transform">
                {crop.image}
              </div>
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-gray-900">{crop.name}</h4>
                <Badge color="amber">★ {crop.rating}</Badge>
              </div>
              <p className="text-sm text-gray-600 flex items-center gap-1 mb-3">
                <MapPin className="w-3 h-3" /> {crop.location}
              </p>
              <div className="flex justify-between items-center pt-3 border-t">
                <div>
                  <span className="text-2xl font-bold text-emerald-600">₹{crop.price}</span>
                </div>
                <Button className="px-4 py-2 text-sm">Buy</Button>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {currentPage === 'landing' && <LandingPage />}
      {currentPage === 'login' && <LoginPage />}
      {currentPage === 'farmer-dashboard' && <FarmerDashboard />}
      {currentPage === 'buyer-dashboard' && <BuyerDashboard />}
    </div>
  );
}