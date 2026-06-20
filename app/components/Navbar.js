'use client';
import { useLang } from './LanguageContext';
import { t } from './translations';

export default function Navbar() {
  const { lang, toggleLang } = useLang();
  const txt = t[lang];

  return (
    <nav style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'20px 40px',borderBottom:'1px solid #1e1e2e',position:'sticky',top:0,background:'rgba(10,10,15,0.95)',backdropFilter:'blur(10px)',zIndex:100}}>
      <a href="/" style={{textDecoration:'none',display:'flex',alignItems:'center',gap:'12px'}}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="36" height="36">
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
          <span style={{fontSize:'16px',fontWeight:'900',color:'#ffffff'}}>Salary</span>
          <span style={{fontSize:'16px',fontWeight:'900',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>MENA</span>
        </div>
      </a>
      <div style={{display:'flex',gap:'24px',alignItems:'center',flexWrap:'wrap'}}>
        <a href="/explore" style={{color:'#a0a0b0',textDecoration:'none',fontSize:'14px',fontWeight:'500'}}
          onMouseEnter={e=>e.target.style.color='#fff'} onMouseLeave={e=>e.target.style.color='#a0a0b0'}>{txt.explore}</a>
        <a href="/coach" style={{color:'#a0a0b0',textDecoration:'none',fontSize:'14px',fontWeight:'500'}}
          onMouseEnter={e=>e.target.style.color='#fff'} onMouseLeave={e=>e.target.style.color='#a0a0b0'}>{txt.coach_nav}</a>
        <a href="/underpaid" style={{color:'#a0a0b0',textDecoration:'none',fontSize:'14px',fontWeight:'500'}}
          onMouseEnter={e=>e.target.style.color='#fff'} onMouseLeave={e=>e.target.style.color='#a0a0b0'}>{txt.underpaid_nav}</a>
        <a href="/submit" style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',textDecoration:'none',borderRadius:'8px',padding:'8px 16px',fontSize:'13px',fontWeight:'600'}}>{txt.submit_nav}</a>
        <button onClick={toggleLang} style={{background:'transparent',border:'1px solid #2a2a3e',color:'#a0a0b0',borderRadius:'8px',padding:'8px 14px',fontSize:'13px',cursor:'pointer',fontWeight:'600'}}>
          {txt.toggle}
        </button>
      </div>
    </nav>
  );
}