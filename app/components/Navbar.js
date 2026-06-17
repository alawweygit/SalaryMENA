'use client';
import { useLang } from './LanguageContext';

export default function Navbar() {
  const { lang, toggleLang, isAr } = useLang();

  const t = {
    en: { explore: 'Explore', submit: 'Submit Salary', coach: 'AI Coach', underpaid: 'Am I Underpaid?' },
    ar: { explore: 'استكشف', submit: 'شارك راتبك', coach: 'مساعد AI', underpaid: 'هل راتبك عادل؟' }
  };

  const text = t[lang];

  return (
    <nav style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'20px 40px',borderBottom:'1px solid #1e1e2e',position:'sticky',top:0,background:'rgba(10,10,15,0.95)',backdropFilter:'blur(10px)',zIndex:100}}>
      <a href="/" style={{fontSize:'22px',fontWeight:'800',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',textDecoration:'none'}}>SalaryMENA</a>
      <div style={{display:'flex',gap:'24px',alignItems:'center',flexWrap:'wrap'}}>
        <a href="/explore" style={{color:'#a0a0b0',textDecoration:'none',fontSize:'14px',fontWeight:'500'}}
          onMouseEnter={e=>e.target.style.color='#fff'} onMouseLeave={e=>e.target.style.color='#a0a0b0'}>{text.explore}</a>
        <a href="/coach" style={{color:'#a0a0b0',textDecoration:'none',fontSize:'14px',fontWeight:'500'}}
          onMouseEnter={e=>e.target.style.color='#fff'} onMouseLeave={e=>e.target.style.color='#a0a0b0'}>{text.coach}</a>
        <a href="/underpaid" style={{color:'#a0a0b0',textDecoration:'none',fontSize:'14px',fontWeight:'500'}}
          onMouseEnter={e=>e.target.style.color='#fff'} onMouseLeave={e=>e.target.style.color='#a0a0b0'}>{text.underpaid}</a>
        <a href="/submit" style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',textDecoration:'none',borderRadius:'8px',padding:'8px 16px',fontSize:'13px',fontWeight:'600'}}>{text.submit}</a>
        <button onClick={toggleLang} style={{background:'transparent',border:'1px solid #2a2a3e',color:'#a0a0b0',borderRadius:'8px',padding:'8px 14px',fontSize:'13px',cursor:'pointer',fontWeight:'600'}}>
          {lang === 'en' ? 'العربية' : 'English'}
        </button>
      </div>
    </nav>
  );
}
