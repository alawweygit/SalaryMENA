'use client';
import { useLang } from './components/LanguageContext';
import { t } from './components/translations';
import Navbar from './components/Navbar';

export default function Home() {
  const { lang, isAr } = useLang();
  const txt = t[lang];

  const featureCard = (icon, title, desc) => (
    <div style={{background:'#13131f',border:'1px solid #1e1e2e',borderRadius:'16px',padding:'28px',display:'flex',flexDirection:'column',gap:'12px'}}>
      <div style={{fontSize:'32px'}}>{icon}</div>
      <div style={{fontWeight:'700',fontSize:'16px'}}>{title}</div>
      <div style={{color:'#606070',fontSize:'14px',lineHeight:1.7}}>{desc}</div>
    </div>
  );

  const sectionStyle = (reverse) => ({
    display:'flex',flexDirection:'column',gap:'20px',padding:'80px 24px',maxWidth:'900px',margin:'0 auto',
  });

  return (
    <div style={{fontFamily:'Inter,sans-serif',background:'#0a0a0f',minHeight:'100vh',color:'#fff'}}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <Navbar/>

      {/* HERO */}
      <div style={{textAlign:'center',padding:'100px 24px 80px',maxWidth:'800px',margin:'0 auto',animation:'fadeIn 0.6s ease'}}>
        <div style={{display:'inline-block',background:'rgba(99,102,241,0.15)',border:'1px solid rgba(99,102,241,0.3)',borderRadius:'50px',padding:'6px 16px',fontSize:'13px',color:'#a78bfa',marginBottom:'28px',fontWeight:'500'}}>
          ✨ {txt.hero_badge}
        </div>
        <h1 style={{fontSize:'64px',fontWeight:'900',lineHeight:1.1,marginBottom:'24px',background:'linear-gradient(135deg,#fff 0%,#a78bfa 50%,#6366f1 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
          {txt.hero_title}
        </h1>
        <p style={{fontSize:'20px',color:'#606070',lineHeight:1.7,marginBottom:'40px',maxWidth:'600px',margin:'0 auto 40px'}}>
          {txt.hero_sub}
        </p>
        <div style={{display:'flex',gap:'16px',justifyContent:'center',flexWrap:'wrap'}}>
          <a href="/submit" style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',textDecoration:'none',borderRadius:'12px',padding:'16px 32px',fontWeight:'700',fontSize:'16px'}}>
            {txt.submit_btn}
          </a>
          <a href="/explore" style={{background:'transparent',color:'#a0a0b0',textDecoration:'none',borderRadius:'12px',padding:'16px 32px',fontWeight:'600',fontSize:'16px',border:'1px solid #2a2a3e'}}>
            {txt.explore} →
          </a>
        </div>
      </div>

      {/* STATS */}
      <div style={{display:'flex',justifyContent:'center',gap:'48px',padding:'40px 24px',borderTop:'1px solid #1e1e2e',borderBottom:'1px solid #1e1e2e',flexWrap:'wrap'}}>
        {[
          {val:txt.stat_1,label:txt.stat_1_label},
          {val:txt.stat_2,label:txt.stat_2_label},
          {val:txt.stat_3,label:txt.stat_3_label},
        ].map((s,i)=>(
          <div key={i} style={{textAlign:'center'}}>
            <div style={{fontSize:'36px',fontWeight:'900',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>{s.val}</div>
            <div style={{color:'#606070',fontSize:'14px',marginTop:'4px'}}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* FEATURE SECTION — EXPLORE */}
      <div style={{borderBottom:'1px solid #1e1e2e'}}>
        <div style={{maxWidth:'900px',margin:'0 auto',padding:'80px 24px',display:'flex',gap:'60px',alignItems:'center',flexWrap:'wrap'}}>
          <div style={{flex:1,minWidth:'280px'}}>
            <div style={{display:'inline-block',background:'rgba(99,102,241,0.15)',border:'1px solid rgba(99,102,241,0.3)',borderRadius:'50px',padding:'4px 14px',fontSize:'12px',color:'#a78bfa',marginBottom:'16px',fontWeight:'600'}}>📊 EXPLORE</div>
            <h2 style={{fontSize:'36px',fontWeight:'900',marginBottom:'16px',lineHeight:1.2}}>{txt.fs_explore_title}</h2>
            <p style={{color:'#606070',fontSize:'16px',lineHeight:1.8,marginBottom:'28px'}}>{txt.fs_explore_desc}</p>
            <a href="/explore" style={{display:'inline-block',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',textDecoration:'none',borderRadius:'10px',padding:'14px 28px',fontWeight:'700',fontSize:'15px'}}>{txt.fs_explore_btn}</a>
          </div>
          <div style={{flex:1,minWidth:'280px',background:'#13131f',border:'1px solid #1e1e2e',borderRadius:'20px',padding:'28px',display:'flex',flexDirection:'column',gap:'14px'}}>
            {[
              {title:'Software Engineer',country:'UAE 🇦🇪',salary:'AED 35,000',tag:'Senior'},
              {title:'Pharmacist',country:'Oman 🇴🇲',salary:'OMR 600',tag:'Mid-Level'},
              {title:'Marketing Manager',country:'Saudi Arabia 🇸🇦',salary:'SAR 18,000',tag:'Manager'},
            ].map((item,i)=>(
              <div key={i} style={{background:'#0a0a0f',border:'1px solid #1e1e2e',borderRadius:'12px',padding:'16px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div>
                  <div style={{fontWeight:'700',fontSize:'14px',marginBottom:'4px'}}>{item.title}</div>
                  <div style={{color:'#606070',fontSize:'12px'}}>{item.country} · <span style={{color:'#a78bfa'}}>{item.tag}</span></div>
                </div>
                <div style={{fontWeight:'800',fontSize:'16px',color:'#a78bfa'}}>{item.salary}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURE SECTION — AI NEGOTIATION COACH */}
      <div style={{borderBottom:'1px solid #1e1e2e',background:'#0d0d18'}}>
        <div style={{maxWidth:'900px',margin:'0 auto',padding:'80px 24px',display:'flex',gap:'60px',alignItems:'center',flexWrap:'wrap',flexDirection:isAr?'row':'row-reverse'}}>
          <div style={{flex:1,minWidth:'280px'}}>
            <div style={{display:'inline-block',background:'rgba(139,92,246,0.15)',border:'1px solid rgba(139,92,246,0.3)',borderRadius:'50px',padding:'4px 14px',fontSize:'12px',color:'#a78bfa',marginBottom:'16px',fontWeight:'600'}}>🤖 AI-POWERED</div>
            <h2 style={{fontSize:'36px',fontWeight:'900',marginBottom:'16px',lineHeight:1.2}}>{txt.fs_coach_title}</h2>
            <p style={{color:'#606070',fontSize:'16px',lineHeight:1.8,marginBottom:'28px'}}>{txt.fs_coach_desc}</p>
            <a href="/coach" style={{display:'inline-block',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',textDecoration:'none',borderRadius:'10px',padding:'14px 28px',fontWeight:'700',fontSize:'15px'}}>{txt.fs_coach_btn}</a>
          </div>
          <div style={{flex:1,minWidth:'280px',background:'#13131f',border:'1px solid #1e1e2e',borderRadius:'20px',padding:'28px'}}>
            <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'20px',paddingBottom:'16px',borderBottom:'1px solid #1e1e2e'}}>
              <div style={{width:'36px',height:'36px',borderRadius:'50%',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'16px'}}>🤖</div>
              <div style={{fontWeight:'700',fontSize:'14px'}}>AI Negotiation Coach</div>
            </div>
            {['VERDICT','MARKET ASSESSMENT','YOUR NEGOTIATION SCRIPT'].map((section,i)=>(
              <div key={i} style={{marginBottom:'14px'}}>
                <div style={{fontSize:'10px',fontWeight:'800',color:'#6366f1',letterSpacing:'1.5px',marginBottom:'6px'}}>{section}</div>
                <div style={{height:'8px',background:'#1e1e2e',borderRadius:'4px',width:i===0?'60%':i===1?'90%':'75%'}}/>
                {i<2 && <div style={{height:'8px',background:'#1e1e2e',borderRadius:'4px',width:'50%',marginTop:'4px'}}/>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURE SECTION — AM I UNDERPAID */}
      <div style={{borderBottom:'1px solid #1e1e2e'}}>
        <div style={{maxWidth:'900px',margin:'0 auto',padding:'80px 24px',display:'flex',gap:'60px',alignItems:'center',flexWrap:'wrap'}}>
          <div style={{flex:1,minWidth:'280px'}}>
            <div style={{display:'inline-block',background:'rgba(16,185,129,0.15)',border:'1px solid rgba(16,185,129,0.3)',borderRadius:'50px',padding:'4px 14px',fontSize:'12px',color:'#10b981',marginBottom:'16px',fontWeight:'600'}}>⚡ AI-POWERED</div>
            <h2 style={{fontSize:'36px',fontWeight:'900',marginBottom:'16px',lineHeight:1.2}}>{txt.fs_underpaid_title}</h2>
            <p style={{color:'#606070',fontSize:'16px',lineHeight:1.8,marginBottom:'28px'}}>{txt.fs_underpaid_desc}</p>
            <a href="/underpaid" style={{display:'inline-block',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',textDecoration:'none',borderRadius:'10px',padding:'14px 28px',fontWeight:'700',fontSize:'15px'}}>{txt.fs_underpaid_btn}</a>
          </div>
          <div style={{flex:1,minWidth:'280px',background:'#13131f',border:'1px solid #1e1e2e',borderRadius:'20px',padding:'28px',textAlign:'center'}}>
            <div style={{fontSize:'13px',color:'#10b981',fontWeight:'700',textTransform:'uppercase',letterSpacing:'2px',marginBottom:'8px'}}>MARKET VERDICT</div>
            <div style={{fontSize:'36px',fontWeight:'900',marginBottom:'4px'}}>✅ Fair</div>
            <div style={{color:'#606070',fontSize:'14px',marginBottom:'24px'}}>Pharmacist · Oman · Arab Expat</div>
            <div style={{display:'flex',justifyContent:'space-between',gap:'8px'}}>
              {[{l:'Market Low',v:'OMR 450',c:'#ef4444'},{l:'Median',v:'OMR 600',c:'#6366f1'},{l:'Market High',v:'OMR 850',c:'#10b981'}].map((item,i)=>(
                <div key={i} style={{flex:1,background:'#0a0a0f',borderRadius:'10px',padding:'12px 8px',border:`1px solid ${item.c}30`}}>
                  <div style={{fontSize:'10px',color:'#404050',fontWeight:'700',marginBottom:'4px'}}>{item.l}</div>
                  <div style={{fontSize:'13px',fontWeight:'800',color:item.c}}>{item.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FEATURE SECTION — SUBMIT */}
      <div style={{borderBottom:'1px solid #1e1e2e',background:'#0d0d18'}}>
        <div style={{maxWidth:'900px',margin:'0 auto',padding:'80px 24px',display:'flex',gap:'60px',alignItems:'center',flexWrap:'wrap',flexDirection:isAr?'row':'row-reverse'}}>
          <div style={{flex:1,minWidth:'280px'}}>
            <div style={{display:'inline-block',background:'rgba(99,102,241,0.15)',border:'1px solid rgba(99,102,241,0.3)',borderRadius:'50px',padding:'4px 14px',fontSize:'12px',color:'#a78bfa',marginBottom:'16px',fontWeight:'600'}}>🔒 100% ANONYMOUS</div>
            <h2 style={{fontSize:'36px',fontWeight:'900',marginBottom:'16px',lineHeight:1.2}}>{txt.fs_submit_title}</h2>
            <p style={{color:'#606070',fontSize:'16px',lineHeight:1.8,marginBottom:'28px'}}>{txt.fs_submit_desc}</p>
            <a href="/submit" style={{display:'inline-block',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',textDecoration:'none',borderRadius:'10px',padding:'14px 28px',fontWeight:'700',fontSize:'15px'}}>{txt.fs_submit_btn}</a>
          </div>
          <div style={{flex:1,minWidth:'280px',background:'#13131f',border:'1px solid #1e1e2e',borderRadius:'20px',padding:'28px',display:'flex',flexDirection:'column',gap:'12px'}}>
            {['🧑‍💼 Job Title','🌍 Country','🏢 Company Type','💰 Monthly Salary','🎓 Education','📧 Email (optional)'].map((item,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:'12px',padding:'12px 16px',background:'#0a0a0f',borderRadius:'10px',border:'1px solid #1e1e2e'}}>
                <span style={{fontSize:'14px',color:'#a0a0b0'}}>{item}</span>
                {i<4 && <div style={{marginLeft:'auto',width:'8px',height:'8px',borderRadius:'50%',background:'#6366f1'}}/>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM CTA */}
      <div style={{textAlign:'center',padding:'100px 24px'}}>
        <h2 style={{fontSize:'40px',fontWeight:'900',marginBottom:'16px',background:'linear-gradient(135deg,#fff 0%,#a78bfa 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>{txt.submit_cta}</h2>
        <p style={{color:'#606070',fontSize:'16px',marginBottom:'32px'}}>{txt.submit_sub}</p>
        <a href="/submit" style={{display:'inline-block',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',textDecoration:'none',borderRadius:'12px',padding:'16px 40px',fontWeight:'700',fontSize:'16px'}}>{txt.submit_btn}</a>
      </div>

      {/* FOOTER */}
      <div style={{borderTop:'1px solid #1e1e2e',padding:'24px',textAlign:'center',color:'#404050',fontSize:'13px'}}>
        {txt.footer} · <a href="https://cvdropai.com" target="_blank" rel="noreferrer" style={{color:'#6366f1',textDecoration:'none'}}>CVDropAI</a>
      </div>
    </div>
  );
}