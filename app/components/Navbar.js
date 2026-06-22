'use client';
import { useState } from 'react';
import { useLang } from './LanguageContext';
import { t } from './translations';

export default function Navbar() {
  const { lang, toggleLang } = useLang();
  const txt = t[lang];
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav style={{borderBottom:'1px solid #1e1e2e',position:'sticky',top:0,background:'rgba(10,10,15,0.95)',backdropFilter:'blur(10px)',zIndex:100}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'16px 20px'}}>
        <a href="/" style={{textDecoration:'none',display:'flex',alignItems:'center',gap:'10px'}}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="32" height="32">
            <defs>
              <linearGradient id="pu" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1"/>
                <stop offset="100%" stopColor="#8b5cf6"/>
              </linearGradient>
            </defs>
            <polygon points="4,12 20,3 36,12 36,28 20,37 4,28" fill="#6366f1" fillOpacity="0.15"/>
            <polygon points="4,12 20,3 36,12 36,28 20,37 4,28" fill="none" stroke="url(#pu)" strokeWidth="2"/>
            <polyline points="8,30 14,20 20,25 30,10" fill="none" stroke="url(#pu)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="30" cy="10" r="3.5" fill="#6366f1"/>
          </svg>
          <div style={{display:'flex',flexDirection:'column',lineHeight:1.1}}>
            <span style={{fontSize:'15px',fontWeight:'900',color:'#ffffff'}}>Salary</span>
            <span style={{fontSize:'15px',fontWeight:'900',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>MENA</span>
          </div>
        </a>

        {/* Desktop nav */}
        <div style={{display:'flex',gap:'24px',alignItems:'center'}} className="desktop-nav">
          <a href="/explore" style={{color:'#a0a0b0',textDecoration:'none',fontSize:'14px',fontWeight:'500'}}
            onMouseEnter={e=>e.target.style.color='#fff'} onMouseLeave={e=>e.target.style.color='#a0a0b0'}>{txt.explore}</a>
          <a href="/coach" style={{color:'#a0a0b0',textDecoration:'none',fontSize:'14px',fontWeight:'500'}}
            onMouseEnter={e=>e.target.style.color='#fff'} onMouseLeave={e=>e.target.style.color='#a0a0b0'}>{txt.coach_nav}</a>
          <a href="/underpaid" style={{color:'#a0a0b0',textDecoration:'none',fontSize:'14px',fontWeight:'500'}}
            onMouseEnter={e=>e.target.style.color='#fff'} onMouseLeave={e=>e.target.style.color='#a0a0b0'}>{txt.underpaid_nav}</a>
          <a href="/submit" style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',textDecoration:'none',borderRadius:'8px',padding:'8px 16px',fontSize:'13px',fontWeight:'600'}}>{txt.submit_nav}</a>
          <button onClick={toggleLang} style={{background:'transparent',border:'1px solid #2a2a3e',color:'#a0a0b0',borderRadius:'8px',padding:'8px 14px',fontSize:'13px',cursor:'pointer',fontWeight:'600'}}>{txt.toggle}</button>
        </div>

        {/* Mobile right side */}
        <div style={{display:'none',gap:'8px',alignItems:'center'}} className="mobile-nav">
          <button onClick={toggleLang} style={{background:'transparent',border:'1px solid #2a2a3e',color:'#a0a0b0',borderRadius:'8px',padding:'6px 12px',fontSize:'12px',cursor:'pointer',fontWeight:'600'}}>{txt.toggle}</button>
          <button onClick={()=>setMenuOpen(!menuOpen)} style={{background:'transparent',border:'1px solid #2a2a3e',color:'#fff',borderRadius:'8px',padding:'6px 12px',fontSize:'18px',cursor:'pointer',lineHeight:1}}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={{borderTop:'1px solid #1e1e2e',padding:'16px 20px',display:'flex',flexDirection:'column',gap:'4px'}}>
          {[
            {href:'/explore',label:txt.explore},
            {href:'/coach',label:txt.coach_nav},
            {href:'/underpaid',label:txt.underpaid_nav},
          ].map(item=>(
            <a key={item.href} href={item.href} onClick={()=>setMenuOpen(false)}
              style={{color:'#a0a0b0',textDecoration:'none',fontSize:'15px',fontWeight:'500',padding:'12px 0',borderBottom:'1px solid #1e1e2e'}}>
              {item.label}
            </a>
          ))}
          <a href="/submit" onClick={()=>setMenuOpen(false)}
            style={{display:'block',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',textDecoration:'none',borderRadius:'10px',padding:'14px',fontSize:'15px',fontWeight:'700',textAlign:'center',marginTop:'12px'}}>
            {txt.submit_nav}
          </a>
        </div>
      )}

      <style>{`
        .desktop-nav { display: flex; }
        .mobile-nav { display: none; }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-nav { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}