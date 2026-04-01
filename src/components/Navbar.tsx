import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export function Navbar() {
  const location = useLocation();

  return (
    <motion.nav 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="absolute top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between pointer-events-auto"
    >
      {/* Brand */}
      <Link to="/" className="flex items-center gap-4 group">
        <div className="w-8 h-8 rounded border-2 border-[#00D4FF] flex items-center justify-center bg-[#00D4FF]/20 group-hover:bg-[#00D4FF]/40 transition-colors shadow-[0_0_10px_#00D4FF]">
          <span className="w-4 h-4 rounded-full border border-white" />
        </div>
        <span className="font-orbitron font-bold tracking-[0.3em] text-white">NEXUS</span>
      </Link>

      {/* Links */}
      <div className="hidden md:flex items-center gap-8 font-orbitron text-sm tracking-widest bg-black/40 px-6 py-2 rounded-full border border-white/10 backdrop-blur-md">
        <Link 
          to="/" 
          className={`transition-colors ${location.pathname === '/' ? 'text-[#00D4FF]' : 'text-white/60 hover:text-white'}`}
        >
          HOME
        </Link>
        <Link 
          to="/portal" 
          className={`transition-colors flex items-center gap-2 ${location.pathname === '/portal' ? 'text-[#00FF9C]' : 'text-white/60 hover:text-white'}`}
        >
          PORTAL
        </Link>
      </div>

      {/* CTA or Status */}
      <div>
        {location.pathname === '/' ? (
           <Link to="/portal" className="px-6 py-2 border border-[#00D4FF] text-[#00D4FF] font-orbitron text-[10px] md:text-xs tracking-[0.2em] hover:bg-[#00D4FF]/20 transition-all rounded glass-panel">LAUNCH PORTAL</Link>
        ) : (
           <div className="text-[#00FF9C] font-orbitron text-[10px] tracking-widest animate-pulse border border-[#00FF9C]/30 px-3 py-1 bg-[#00FF9C]/10 rounded">PORTAL_ONLINE</div>
        )}
      </div>
    </motion.nav>
  );
}
