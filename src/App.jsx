import Navigation from './components/Navigation'
import HeroSection from './components/HeroSection'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
      <Navigation />
      <HeroSection />
      
      {/* Placeholder content below hero */}
      <div className="h-screen bg-white/80 backdrop-blur-lg rounded-t-[32px] -mt-5 relative z-10 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Features Section</h2>
          <p className="text-slate-600">This is where your feature cards will go</p>
        </div>
      </div>
    </div>
  )
}

export default App