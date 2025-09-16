function Navigation() {
  return (
    <nav className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-6xl px-5">
      <div className="bg-white/85 backdrop-blur-lg border border-slate-200/20 rounded-2xl px-7 py-4 flex justify-between items-center shadow-lg">
        <div className="text-xl font-bold text-slate-900">
          TechStaff Pro
        </div>
        
        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
          <span className="hover:text-slate-900 cursor-pointer transition-colors">Home</span>
          <span className="hover:text-slate-900 cursor-pointer transition-colors">Staffing</span>
          <span className="hover:text-slate-900 cursor-pointer transition-colors">Services</span>
          <span className="hover:text-slate-900 cursor-pointer transition-colors">About</span>
          <span className="hover:text-slate-900 cursor-pointer transition-colors">Contact</span>
        </div>
        
        <button className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors">
          Get Started
        </button>
      </div>
    </nav>
  )
}

export default Navigation