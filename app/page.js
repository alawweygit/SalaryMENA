'use client';
import { useLang } from './components/LanguageContext';
import { t } from './components/translations';
import Navbar from './components/Navbar';

export default function Home() {
  const { lang, isAr } = useLang();
  const txt = t[lang];

  return (
    <div style={{fontFamily:'Inter,sans-serif',background:'#0a0a0f',minHeight:'100vh',color:'#fff'}}>
      <style>{`
        @keyframes fadeIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .hero-title{font-size:64px}
        .section-row{display:flex;gap:60px;align-items:center}
        .section-row-rev{display:flex;gap:60px;align-items:center;flex-direction:row-reverse}
        .section-text{flex:1;min-width:280px}
        .section-preview{flex:1;min-width:280px}
        .stat-row{display:flex;justify-content:center;gap:48px;padding:40px 24px}
        @media(max-width:768px){
          .hero-title{font-size:36px!important}
          .section-row{flex-direction:column!important;gap:32px!important;text-align:center!important}
          .section-row-rev{flex-direction:column!important;gap:32px!important;text-align:center!important}
          .section-text{display:flex!important;flex-direction:column!important;align-items:center!important}
          .section-preview{width:100%!important;min-width:unset!important}
          .stat-row{gap:20px!important;padding:24px 16px!important}
          .hero-btns{flex-direction:column!important;align-items:stretch!important}
        }
      `}</style>
      <Navbar/>

      {/* HERO */}
      <div style={{textAlign:'center',padding:'80px 24px 60px',maxWidth:'800px',margin:'0 auto',animation:'fadeIn 0.6s ease'}}>
        <div style={{display:'inline-block',background:'rgba(99,102,241,0.15)',border:'1px solid rgba(99,102,241,0.3)',borderRadius:'50px',padding:'6px 16px',fontSize:'13px',color:'#a78bfa',marginBottom:'24px',fontWeight:'500'}}>
          ✨ {txt.hero_badge}
        </div>
        <h1 className="hero-title" style={{fontWeight:'900',lineHeight:1.1,marginBottom:'20px',background:'linear-gradient(135deg,#fff 0%,#a78bfa 50%,#6366f1 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
          {txt.hero_title}
        </h1>
        <p style={{color:'#a0a0b0',lineHeight:1.7,marginBottom:'36px',maxWidth:'560px',margin:'0 auto 36px',fontSize:'18px'}}>
          {txt.hero_sub}
        </p>
        <div className="hero-btns" style={{display:'flex',gap:'12px',justifyContent:'center',flexWrap:'wrap'}}>
          <a href="/submit" style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',textDecoration:'none',borderRadius:'12px',padding:'14px 28px',fontWeight:'700',fontSize:'15px'}}>
            {txt.submit_btn}
          </a>
          <a href="/explore" style={{background:'transparent',color:'#a0a0b0',textDecoration:'none',borderRadius:'12px',padding:'14px 28px',fontWeight:'600',fontSize:'15px',border:'1px solid #2a2a3e'}}>
            {txt.fs_explore_btn}
          </a>
        </div>
      </div>

      {/* STATS */}
      <div className="stat-row" style={{borderTop:'1px solid #1e1e2e',borderBottom:'1px solid #1e1e2e'}}>
        {[
          {val:txt.stat_1,label:txt.stat_1_label},
          {val:txt.stat_2,label:txt.stat_2_label},
          {val:txt.stat_3,label:txt.stat_3_label},
        ].map((s,i)=>(
          <div key={i} style={{textAlign:'center'}}>
            <div style={{fontSize:'32px',fontWeight:'900',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>{s.val}</div>
            <div style={{color:'#606070',fontSize:'14px',marginTop:'4px'}}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* 1 — EXPLORE */}
      <div style={{borderBottom:'1px solid #1e1e2e'}}>
        <div className="section-row" style={{maxWidth:'900px',margin:'0 auto',padding:'60px 24px'}}>
          <div className="section-text">
            <div style={{display:'inline-block',background:'rgba(99,102,241,0.15)',border:'1px solid rgba(99,102,241,0.3)',borderRadius:'50px',padding:'4px 14px',fontSize:'12px',color:'#a78bfa',marginBottom:'16px',fontWeight:'600'}}>📊 EXPLORE</div>
            <h2 style={{fontSize:'28px',fontWeight:'900',marginBottom:'14px',lineHeight:1.2}}>{txt.fs_explore_title}</h2>
            <p style={{color:'#606070',fontSize:'15px',lineHeight:1.8,marginBottom:'24px'}}>{txt.fs_explore_desc}</p>
            <a href="/explore" style={{display:'inline-block',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',textDecoration:'none',borderRadius:'10px',padding:'12px 24px',fontWeight:'700',fontSize:'14px'}}>{txt.fs_explore_btn}</a>
          </div>
          <div className="section-preview" style={{background:'#13131f',border:'1px solid #1e1e2e',borderRadius:'20px',padding:'20px',display:'flex',flexDirection:'column',gap:'10px'}}>
            {[
              {title:'Software Engineer',country:'UAE 🇦🇪',salary:'AED 35,000',tag:'Senior'},
              {title:'Pharmacist',country:'Oman 🇴🇲',salary:'OMR 600',tag:'Mid-Level'},
              {title:'Marketing Manager',country:'Saudi Arabia 🇸🇦',salary:'SAR 18,000',tag:'Private'},
            ].map((item,i)=>(
              <div key={i} style={{background:'#0a0a0f',border:'1px solid #1e1e2e',borderRadius:'12px',padding:'14px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div>
                  <div style={{fontWeight:'700',fontSize:'13px',marginBottom:'4px'}}>{item.title}</div>
                  <div style={{color:'#606070',fontSize:'11px'}}>{item.country} · <span style={{color:'#a78bfa'}}>{item.tag}</span></div>
                </div>
                <div style={{fontWeight:'800',fontSize:'14px',color:'#a78bfa'}}>{item.salary}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2 — SUBMIT */}
      <div style={{borderBottom:'1px solid #1e1e2e',background:'#0d0d18'}}>
        <div className="section-row-rev" style={{maxWidth:'900px',margin:'0 auto',padding:'60px 24px'}}>
          <div className="section-text">
            <div style={{display:'inline-block',background:'rgba(99,102,241,0.15)',border:'1px solid rgba(99,102,241,0.3)',borderRadius:'50px',padding:'4px 14px',fontSize:'12px',color:'#a78bfa',marginBottom:'16px',fontWeight:'600'}}>🔒 ANONYMOUS</div>
            <h2 style={{fontSize:'28px',fontWeight:'900',marginBottom:'14px',lineHeight:1.2}}>{txt.fs_submit_title}</h2>
            <p style={{color:'#606070',fontSize:'15px',lineHeight:1.8,marginBottom:'24px'}}>{txt.fs_submit_desc}</p>
            <a href="/submit" style={{display:'inline-block',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',textDecoration:'none',borderRadius:'10px',padding:'12px 24px',fontWeight:'700',fontSize:'14px'}}>{txt.fs_submit_btn}</a>
          </div>
          <div className="section-preview" style={{background:'#13131f',border:'1px solid #1e1e2e',borderRadius:'20px',padding:'20px',display:'flex',flexDirection:'column',gap:'10px'}}>
            {['🧑‍💼 Job Title','🌍 Country','🏢 Company Type','💰 Monthly Salary','🎓 Education','📧 Email'].map((item,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:'12px',padding:'10px 14px',background:'#0a0a0f',borderRadius:'10px',border:'1px solid #1e1e2e'}}>
                <span style={{fontSize:'13px',color:'#a0a0b0'}}>{item}</span>
                {i<4 && <div style={{marginLeft:'auto',width:'7px',height:'7px',borderRadius:'50%',background:'#6366f1'}}/>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3 — AM I UNDERPAID */}
      <div style={{borderBottom:'1px solid #1e1e2e'}}>
        <div className="section-row" style={{maxWidth:'900px',margin:'0 auto',padding:'60px 24px'}}>
          <div className="section-text">
            <div style={{display:'inline-block',background:'rgba(16,185,129,0.15)',border:'1px solid rgba(16,185,129,0.3)',borderRadius:'50px',padding:'4px 14px',fontSize:'12px',color:'#10b981',marginBottom:'16px',fontWeight:'600'}}>⚡ AI-POWERED</div>
            <h2 style={{fontSize:'28px',fontWeight:'900',marginBottom:'14px',lineHeight:1.2}}>{txt.fs_underpaid_title}</h2>
            <p style={{color:'#606070',fontSize:'15px',lineHeight:1.8,marginBottom:'24px'}}>{txt.fs_underpaid_desc}</p>
            <a href="/underpaid" style={{display:'inline-block',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',textDecoration:'none',borderRadius:'10px',padding:'12px 24px',fontWeight:'700',fontSize:'14px'}}>{txt.fs_underpaid_btn}</a>
          </div>
          <div className="section-preview" style={{background:'#13131f',border:'1px solid #1e1e2e',borderRadius:'20px',padding:'20px',textAlign:'center'}}>
            <div style={{fontSize:'12px',color:'#10b981',fontWeight:'700',textTransform:'uppercase',letterSpacing:'2px',marginBottom:'8px'}}>MARKET VERDICT</div>
            <div style={{fontSize:'28px',fontWeight:'900',marginBottom:'4px'}}>✅ Fair</div>
            <div style={{color:'#606070',fontSize:'13px',marginBottom:'20px'}}>Pharmacist · Oman · Arab Expat</div>
            <div style={{display:'flex',justifyContent:'space-between',gap:'8px'}}>
              {[{l:'Market Low',v:'OMR 450',c:'#ef4444'},{l:'Median',v:'OMR 600',c:'#6366f1'},{l:'Market High',v:'OMR 850',c:'#10b981'}].map((item,i)=>(
                <div key={i} style={{flex:1,background:'#0a0a0f',borderRadius:'10px',padding:'10px 6px',border:`1px solid ${item.c}30`}}>
                  <div style={{fontSize:'9px',color:'#404050',fontWeight:'700',marginBottom:'4px'}}>{item.l}</div>
                  <div style={{fontSize:'12px',fontWeight:'800',color:item.c}}>{item.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4 — AI NEGOTIATION COACH */}
      <div style={{borderBottom:'1px solid #1e1e2e',background:'#0d0d18'}}>
        <div className="section-row-rev" style={{maxWidth:'900px',margin:'0 auto',padding:'60px 24px'}}>
          <div className="section-text">
            <div style={{display:'inline-block',background:'rgba(139,92,246,0.15)',border:'1px solid rgba(139,92,246,0.3)',borderRadius:'50px',padding:'4px 14px',fontSize:'12px',color:'#a78bfa',marginBottom:'16px',fontWeight:'600'}}>🤖 AI-POWERED</div>
            <h2 style={{fontSize:'28px',fontWeight:'900',marginBottom:'14px',lineHeight:1.2}}>{txt.fs_coach_title}</h2>
            <p style={{color:'#606070',fontSize:'15px',lineHeight:1.8,marginBottom:'24px'}}>{txt.fs_coach_desc}</p>
            <a href="/coach" style={{display:'inline-block',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',textDecoration:'none',borderRadius:'10px',padding:'12px 24px',fontWeight:'700',fontSize:'14px'}}>{txt.fs_coach_btn}</a>
          </div>
          <div className="section-preview" style={{background:'#13131f',border:'1px solid #1e1e2e',borderRadius:'20px',padding:'20px'}}>
            <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'14px',paddingBottom:'12px',borderBottom:'1px solid #1e1e2e'}}>
              <div style={{width:'28px',height:'28px',borderRadius:'50%',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px'}}>🤖</div>
              <div style={{fontWeight:'700',fontSize:'12px'}}>AI Negotiation Coach</div>
            </div>
            <div style={{marginBottom:'10px'}}>
              <div style={{fontSize:'9px',fontWeight:'800',color:'#6366f1',letterSpacing:'1.5px',marginBottom:'4px'}}>VERDICT</div>
              <div style={{background:'#0a0a0f',borderRadius:'8px',padding:'8px 12px',fontSize:'12px',color:'#10b981',fontWeight:'700'}}>✅ Above Market — You can negotiate higher</div>
            </div>
            <div style={{marginBottom:'10px'}}>
              <div style={{fontSize:'9px',fontWeight:'800',color:'#6366f1',letterSpacing:'1.5px',marginBottom:'4px'}}>MARKET ASSESSMENT</div>
              <div style={{background:'#0a0a0f',borderRadius:'8px',padding:'8px 12px',fontSize:'11px',color:'#a0a0b0',lineHeight:1.6}}>Senior engineers in UAE earn AED 28,000–42,000/month. Your offer is within range.</div>
            </div>
            <div>
              <div style={{fontSize:'9px',fontWeight:'800',color:'#6366f1',letterSpacing:'1.5px',marginBottom:'4px'}}>YOUR SCRIPT</div>
              <div style={{background:'#0a0a0f',borderRadius:'8px',padding:'8px 12px',fontSize:'11px',color:'#a0a0b0',lineHeight:1.6,fontStyle:'italic'}}>"Based on my research, the market range for this role is AED 35–42K..."</div>
            </div>
          </div>
        </div>
      </div>

      {/* 5 — CVDROPAI */}
      <div style={{borderBottom:'1px solid #1e1e2e'}}>
        <div className="section-row" style={{maxWidth:'900px',margin:'0 auto',padding:'60px 24px'}}>
          <div className="section-text">
            <div style={{display:'inline-block',background:'rgba(251,191,36,0.15)',border:'1px solid rgba(251,191,36,0.3)',borderRadius:'50px',padding:'4px 14px',fontSize:'12px',color:'#fbbf24',marginBottom:'16px',fontWeight:'600'}}>💼 CV TOOL</div>
            <h2 style={{fontSize:'28px',fontWeight:'900',marginBottom:'14px',lineHeight:1.2}}>{txt.fs_cvdrop_title}</h2>
            <p style={{color:'#606070',fontSize:'15px',lineHeight:1.8,marginBottom:'24px'}}>{txt.fs_cvdrop_desc}</p>
            <a href="https://cvdropai.com" target="_blank" rel="noreferrer" style={{display:'inline-block',background:'linear-gradient(135deg,#fbbf24,#f59e0b)',color:'#000',textDecoration:'none',borderRadius:'10px',padding:'12px 24px',fontWeight:'700',fontSize:'14px'}}>{txt.fs_cvdrop_btn}</a>
          </div>
          <div className="section-preview" style={{background:'#13131f',border:'1px solid #1e1e2e',borderRadius:'20px',padding:'20px'}}>
            <div style={{marginBottom:'14px',paddingBottom:'12px',borderBottom:'1px solid #1e1e2e',display:'flex',alignItems:'center',gap:'10px'}}>
              <div style={{width:'28px',height:'28px',borderRadius:'8px',background:'linear-gradient(135deg,#fbbf24,#f59e0b)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'14px'}}>💧</div>
              <div style={{fontWeight:'700',fontSize:'12px'}}>CVDropAI</div>
            </div>
            <div style={{marginBottom:'10px'}}>
              <div style={{fontSize:'9px',fontWeight:'800',color:'#fbbf24',letterSpacing:'1.5px',marginBottom:'4px'}}>JOB DESCRIPTION</div>
              <div style={{background:'#0a0a0f',borderRadius:'8px',padding:'8px 12px',fontSize:'11px',color:'#a0a0b0',lineHeight:1.6}}>Senior Software Engineer at Noon — 5+ years React, Node.js...</div>
            </div>
            <div style={{display:'flex',alignItems:'center',justifyContent:'center',padding:'6px',color:'#fbbf24',fontSize:'16px'}}>↓ AI rewrites your CV</div>
            <div>
              <div style={{fontSize:'9px',fontWeight:'800',color:'#fbbf24',letterSpacing:'1.5px',marginBottom:'4px'}}>YOUR TAILORED CV</div>
              <div style={{background:'#0a0a0f',borderRadius:'8px',padding:'8px 12px',fontSize:'11px',color:'#10b981',lineHeight:1.6,fontWeight:'600'}}>✅ CV matched and ready to send</div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{borderTop:'1px solid #1e1e2e',padding:'24px',textAlign:'center',color:'#404050',fontSize:'13px'}}>
        {txt.footer} · <a href="mailto:support@salarymena.com" style={{color:'#606070',textDecoration:'none'}}>support@salarymena.com</a>
      </div>
    </div>
  );
}