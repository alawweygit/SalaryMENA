'use client';
import { useState } from 'react';
import { useLang } from './components/LanguageContext';
import { t } from './components/translations';
import Navbar from './components/Navbar';

export default function Home() {
  const { lang, isAr } = useLang();
  const txt = t[lang];
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div style={{fontFamily:'Inter,sans-serif',background:'#0a0a0f',minHeight:'100vh',color:'#fff'}}>
      <Navbar/>

      <section style={{textAlign:'center',padding:'120px 40px 80px',maxWidth:'800px',margin:'0 auto'}}>
        <div style={{display:'inline-block',background:'rgba(99,102,241,0.15)',border:'1px solid rgba(99,102,241,0.3)',borderRadius:'50px',padding:'6px 16px',fontSize:'13px',color:'#a78bfa',marginBottom:'24px',fontWeight:'500'}}>
          🚀 {txt.hero_badge}
        </div>
        <h1 style={{fontSize:'72px',fontWeight:'900',lineHeight:1.1,marginBottom:'24px',background:'linear-gradient(135deg,#fff 0%,#a78bfa 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
          {txt.hero_title}
        </h1>
        <p style={{fontSize:'20px',color:'#a0a0b0',lineHeight:1.7,marginBottom:'48px',maxWidth:'600px',margin:'0 auto 48px'}}>
          {txt.hero_sub}
        </p>

        <div style={{display:'flex',gap:'12px',maxWidth:'600px',margin:'0 auto 64px',background:'#13131f',border:'1px solid #2a2a3e',borderRadius:'14px',padding:'8px 8px 8px 20px',alignItems:'center'}}>
          <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder={txt.search_placeholder}
            style={{flex:1,background:'transparent',border:'none',outline:'none',color:'#fff',fontSize:'15px',textAlign:isAr?'right':'left'}}/>
          <button style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',border:'none',borderRadius:'10px',padding:'12px 24px',fontSize:'14px',fontWeight:'600',cursor:'pointer',whiteSpace:'nowrap'}}>
            {txt.search_btn}
          </button>
        </div>

        <div style={{display:'flex',justifyContent:'center',gap:'60px'}}>
          {[[txt.stat_1,txt.stat_1_label],[txt.stat_2,txt.stat_2_label],[txt.stat_3,txt.stat_3_label]].map(([num,label],i)=>(
            <div key={i} style={{textAlign:'center'}}>
              <div style={{fontSize:'36px',fontWeight:'800',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>{num}</div>
              <div style={{fontSize:'13px',color:'#606070',marginTop:'4px',fontWeight:'500'}}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{padding:'80px 40px',maxWidth:'1100px',margin:'0 auto'}}>
        <h2 style={{textAlign:'center',fontSize:'36px',fontWeight:'800',marginBottom:'60px',color:'#fff'}}>{txt.features_title}</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'24px'}}>
          {[['💰',txt.f1_title,txt.f1_desc],['🤖',txt.f2_title,txt.f2_desc],['🌐',txt.f3_title,txt.f3_desc],['🔒',txt.f4_title,txt.f4_desc]].map(([icon,title,desc],i)=>(
            <div key={i} style={{background:'#13131f',border:'1px solid #1e1e2e',borderRadius:'16px',padding:'32px',transition:'border-color 0.2s'}}
              onMouseEnter={e=>e.currentTarget.style.borderColor='#6366f1'}
              onMouseLeave={e=>e.currentTarget.style.borderColor='#1e1e2e'}>
              <div style={{fontSize:'32px',marginBottom:'16px'}}>{icon}</div>
              <h3 style={{fontSize:'18px',fontWeight:'700',marginBottom:'10px',color:'#fff'}}>{title}</h3>
              <p style={{fontSize:'14px',color:'#606070',lineHeight:1.7,margin:0}}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{margin:'40px auto 80px',maxWidth:'700px',padding:'0 40px',textAlign:'center'}}>
        <div style={{background:'linear-gradient(135deg,rgba(99,102,241,0.2),rgba(139,92,246,0.2))',border:'1px solid rgba(99,102,241,0.4)',borderRadius:'24px',padding:'60px 40px'}}>
          <h2 style={{fontSize:'32px',fontWeight:'800',marginBottom:'16px'}}>{txt.submit_cta}</h2>
          <p style={{color:'#a0a0b0',fontSize:'16px',marginBottom:'32px'}}>{txt.submit_sub}</p>
          <a href="/submit" style={{display:'inline-block',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',textDecoration:'none',border:'none',borderRadius:'12px',padding:'16px 36px',fontSize:'16px',fontWeight:'700',cursor:'pointer'}}>
            {txt.submit_btn}
          </a>
          <p style={{marginTop:'20px',fontSize:'12px',color:'#404050'}}>
            {isAr?'جرب أيضاً: ':'Also try: '}<a href="https://cvdropai.com" target="_blank" rel="noreferrer" style={{color:'#6366f1',textDecoration:'none'}}>CVDropAI</a> — {isAr?'حسّن سيرتك الذاتية قبل التقديم':'Polish your CV before you apply'}
          </p>
        </div>
      </section>

      <footer style={{borderTop:'1px solid #1e1e2e',padding:'32px 40px',textAlign:'center',color:'#404050',fontSize:'13px'}}>
        {txt.footer}
      </footer>
    </div>
  );
}
