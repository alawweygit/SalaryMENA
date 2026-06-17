'use client';
import { useState, useEffect } from 'react';

const COUNTRIES = ['UAE','Saudi Arabia','Egypt','Oman','Kuwait','Qatar','Bahrain','Jordan','Lebanon','Iraq','Syria','Yemen','Libya','Tunisia','Algeria','Morocco','Sudan','Somalia','Comoros','Djibouti','Mauritania','Palestine'];
const GCC = ['UAE','Saudi Arabia','Kuwait','Qatar','Bahrain','Oman'];

export default function Underpaid() {
  const [form, setForm] = useState({jobTitle:'',country:'',currency:'AED',monthlySalary:'',experience:'',seniority:'',nationalityType:''});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [countrySearch, setCountrySearch] = useState('');
  const update = (f,v) => setForm(p=>({...p,[f]:v}));

  const isGCC = GCC.includes(form.country);
  const nationalityOptions = isGCC ? ['GCC National','Arab Expat','Western Expat','Asian Expat'] : ['Local National','Arab (Other)','Western Expat','Asian Expat'];

  useEffect(() => {
    if(!loading) { setProgress(0); return; }
    setProgress(5);
    const intervals = [
      setTimeout(()=>setProgress(20),500),
      setTimeout(()=>setProgress(40),2000),
      setTimeout(()=>setProgress(60),4000),
      setTimeout(()=>setProgress(75),6000),
      setTimeout(()=>setProgress(88),8000),
    ];
    return () => intervals.forEach(clearTimeout);
  }, [loading]);

  const inp = {width:'100%',background:'#13131f',border:'1px solid #2a2a3e',borderRadius:'10px',padding:'14px 16px',color:'#fff',fontSize:'15px',outline:'none',boxSizing:'border-box'};
  const lbl = {display:'block',fontSize:'13px',fontWeight:'600',color:'#a0a0b0',marginBottom:'8px',textTransform:'uppercase',letterSpacing:'0.5px'};
  const chip = (a) => ({padding:'10px 20px',borderRadius:'50px',fontSize:'14px',fontWeight:'500',cursor:'pointer',border:'none',background:a?'linear-gradient(135deg,#6366f1,#8b5cf6)':'#13131f',color:a?'#fff':'#606070',outline:a?'none':'1px solid #2a2a3e',transition:'all 0.2s'});
  const countryChip = (a) => ({padding:'8px 16px',borderRadius:'50px',fontSize:'13px',fontWeight:'500',cursor:'pointer',border:'none',background:a?'linear-gradient(135deg,#6366f1,#8b5cf6)':'#13131f',color:a?'#fff':'#606070',outline:a?'none':'1px solid #2a2a3e',whiteSpace:'nowrap'});
  const canAnalyze = form.jobTitle && form.country && form.monthlySalary && form.experience && form.seniority && form.nationalityType;
  const filteredCountries = COUNTRIES.filter(c=>c.toLowerCase().includes(countrySearch.toLowerCase()));
  const fmt = (n) => Math.round(n).toLocaleString();

  const analyze = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/underpaid', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(form)
      });
      const json = await res.json();
      setProgress(100);
      setTimeout(() => {
        if(json.success) setResult(json.data);
        else setResult({error: true});
        setLoading(false);
      }, 400);
    } catch(e) {
      setResult({error: true});
      setLoading(false);
    }
  };

  const getGaugeRotation = (low, median, high, userSalary) => {
    const pct = Math.min(Math.max((userSalary - low) / (high - low), 0), 1);
    return -120 + (pct * 240);
  };

  return (
    <div style={{fontFamily:'Inter,sans-serif',background:'#0a0a0f',minHeight:'100vh',color:'#fff'}}>
      <style>{`
        input[type=number]::-webkit-outer-spin-button,input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      <nav style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'20px 40px',borderBottom:'1px solid #1e1e2e',position:'sticky',top:0,background:'rgba(10,10,15,0.95)',backdropFilter:'blur(10px)',zIndex:100}}>
        <a href="/" style={{fontSize:'22px',fontWeight:'800',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',textDecoration:'none'}}>SalaryMENA</a>
        <a href="/submit" style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',textDecoration:'none',borderRadius:'8px',padding:'8px 16px',fontSize:'13px',fontWeight:'600'}}>Submit Salary</a>
      </nav>

      <div style={{maxWidth:'700px',margin:'0 auto',padding:'60px 24px'}}>

        {/* LOADING */}
        {loading && (
          <div style={{textAlign:'center',padding:'80px 24px',animation:'fadeIn 0.3s ease'}}>
            <div style={{position:'relative',width:'140px',height:'140px',margin:'0 auto 32px'}}>
              <svg width="140" height="140" style={{transform:'rotate(-90deg)'}}>
                <circle cx="70" cy="70" r="60" fill="none" stroke="#1e1e2e" strokeWidth="10"/>
                <circle cx="70" cy="70" r="60" fill="none" stroke="url(#grad)" strokeWidth="10"
                  strokeDasharray={`${2*Math.PI*60}`}
                  strokeDashoffset={`${2*Math.PI*60*(1-progress/100)}`}
                  strokeLinecap="round"
                  style={{transition:'stroke-dashoffset 0.5s ease'}}/>
                <defs>
                  <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6366f1"/>
                    <stop offset="100%" stopColor="#8b5cf6"/>
                  </linearGradient>
                </defs>
              </svg>
              <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                <div style={{fontSize:'28px',fontWeight:'900',color:'#fff'}}>{progress}%</div>
              </div>
            </div>
            <h3 style={{fontSize:'22px',fontWeight:'700',marginBottom:'12px'}}>Analyzing your salary...</h3>
            <p style={{color:'#606070',fontSize:'15px'}}>
              {progress < 30 ? 'Searching market data...' :
               progress < 60 ? 'Comparing with similar roles...' :
               progress < 85 ? 'Building your report...' : 'Almost done...'}
            </p>
          </div>
        )}

        {/* FORM */}
        {!loading && !result && (
          <div style={{animation:'fadeIn 0.3s ease'}}>
            <div style={{textAlign:'center',marginBottom:'48px'}}>
              <div style={{display:'inline-block',background:'rgba(99,102,241,0.15)',border:'1px solid rgba(99,102,241,0.3)',borderRadius:'50px',padding:'6px 16px',fontSize:'13px',color:'#a78bfa',marginBottom:'20px',fontWeight:'500'}}>📊 AI-Powered Market Analysis</div>
              <h1 style={{fontSize:'40px',fontWeight:'900',marginBottom:'16px',background:'linear-gradient(135deg,#fff 0%,#a78bfa 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Am I Underpaid?</h1>
              <p style={{color:'#606070',fontSize:'17px',lineHeight:1.7}}>Get an instant AI market analysis of your salary against real data.</p>
            </div>

            <div style={{background:'#0d0d18',border:'1px solid #1e1e2e',borderRadius:'24px',padding:'40px',display:'flex',flexDirection:'column',gap:'24px'}}>
              <div>
                <label style={lbl}>Job Title</label>
                <input style={inp} placeholder="e.g. Software Engineer, Marketing Manager..." value={form.jobTitle} onChange={e=>update('jobTitle',e.target.value)}/>
              </div>

              <div>
                <label style={lbl}>Country You Work In</label>
                <input style={{...inp,marginBottom:'12px'}} placeholder="Search country..." value={countrySearch} onChange={e=>setCountrySearch(e.target.value)}/>
                <div style={{display:'flex',flexWrap:'wrap',gap:'8px',maxHeight:'160px',overflowY:'auto',padding:'4px 0'}}>
                  {filteredCountries.map(c=>(
                    <button key={c} style={countryChip(form.country===c)} onClick={()=>{update('country',c);update('nationalityType','');}}>{c}</button>
                  ))}
                </div>
                {form.country && <div style={{marginTop:'10px',padding:'8px 14px',background:'rgba(99,102,241,0.1)',border:'1px solid rgba(99,102,241,0.3)',borderRadius:'8px',fontSize:'13px',color:'#a78bfa'}}>✓ {form.country}</div>}
              </div>

              {form.country && (
                <div>
                  <label style={lbl}>Are you a local or expat?</label>
                  <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>
                    {nationalityOptions.map(n=><button key={n} style={chip(form.nationalityType===n)} onClick={()=>update('nationalityType',n)}>{n}</button>)}
                  </div>
                </div>
              )}

              <div>
                <label style={lbl}>Seniority Level</label>
                <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>
                  {['Junior','Mid-Level','Senior','Lead','Manager','Director','C-Suite'].map(s=><button key={s} style={chip(form.seniority===s)} onClick={()=>update('seniority',s)}>{s}</button>)}
                </div>
              </div>

              <div>
                <label style={lbl}>Years of Experience</label>
                <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>
                  {['0-1','1-3','3-5','5-8','8-12','12+'].map(y=><button key={y} style={chip(form.experience===y)} onClick={()=>update('experience',y)}>{y} yrs</button>)}
                </div>
              </div>

              <div>
                <label style={lbl}>Currency</label>
                <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>
                  {['AED','SAR','EGP','OMR','KWD','QAR','BHD','JOD','USD'].map(c=><button key={c} style={chip(form.currency===c)} onClick={()=>update('currency',c)}>{c}</button>)}
                </div>
              </div>

              <div>
                <label style={lbl}>Your Current Monthly Salary</label>
                <input style={inp} type="number" placeholder="e.g. 25000" value={form.monthlySalary} onChange={e=>update('monthlySalary',e.target.value)}/>
              </div>

              <button onClick={canAnalyze?analyze:undefined}
                style={{background:canAnalyze?'linear-gradient(135deg,#6366f1,#8b5cf6)':'#1e1e2e',color:canAnalyze?'#fff':'#404050',border:'none',borderRadius:'12px',padding:'16px',fontSize:'16px',fontWeight:'700',cursor:canAnalyze?'pointer':'not-allowed'}}>
                Analyze My Salary →
              </button>
            </div>
          </div>
        )}

        {/* RESULT */}
        {!loading && result && !result.error && (
          <div style={{display:'flex',flexDirection:'column',gap:'16px',animation:'fadeIn 0.4s ease'}}>

            {/* VERDICT CARD */}
            <div style={{background:`linear-gradient(135deg,${result.verdictColor}25,${result.verdictColor}08)`,border:`1px solid ${result.verdictColor}50`,borderRadius:'24px',padding:'48px',textAlign:'center'}}>
              <div style={{fontSize:'13px',color:result.verdictColor,fontWeight:'700',textTransform:'uppercase',letterSpacing:'2px',marginBottom:'12px'}}>Market Verdict</div>
              <div style={{fontSize:'42px',fontWeight:'900',color:'#fff',marginBottom:'4px'}}>{result.verdict==='Below Market'?'⚠️ ':result.verdict==='Above Market'?'🚀 ':'✅ '}{result.verdict}</div>
              <div style={{fontSize:'18px',color:'#606070',marginTop:'8px'}}>{form.jobTitle} · {form.country} · {form.nationalityType}</div>
            </div>

            {/* SPEEDOMETER */}
            <div style={{background:'#13131f',border:'1px solid #1e1e2e',borderRadius:'20px',padding:'40px',textAlign:'center'}}>
              <div style={{fontWeight:'700',fontSize:'16px',marginBottom:'32px'}}>📊 Salary Gauge</div>
              <div style={{position:'relative',width:'240px',height:'140px',margin:'0 auto'}}>
                <svg width="240" height="140" viewBox="0 0 240 140">
                  <defs>
                    <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ef4444"/>
                      <stop offset="50%" stopColor="#f59e0b"/>
                      <stop offset="100%" stopColor="#10b981"/>
                    </linearGradient>
                  </defs>
                  <path d="M 20 130 A 100 100 0 0 1 220 130" fill="none" stroke="#1e1e2e" strokeWidth="20" strokeLinecap="round"/>
                  <path d="M 20 130 A 100 100 0 0 1 220 130" fill="none" stroke="url(#gaugeGrad)" strokeWidth="20" strokeLinecap="round"/>
                  {(() => {
                    const rot = getGaugeRotation(result.marketLow, result.marketMedian, result.marketHigh, Number(form.monthlySalary));
                    const rad = (rot * Math.PI) / 180;
                    const x = 120 + 85 * Math.cos(rad);
                    const y = 130 + 85 * Math.sin(rad);
                    return (
                      <>
                        <line x1="120" y1="130" x2={x} y2={y} stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
                        <circle cx="120" cy="130" r="8" fill={result.verdictColor}/>
                        <circle cx={x} cy={y} r="6" fill="#fff" stroke={result.verdictColor} strokeWidth="3"/>
                      </>
                    );
                  })()}
                  <text x="20" y="138" fill="#606070" fontSize="11" fontWeight="600">LOW</text>
                  <text x="102" y="115" fill="#606070" fontSize="11" fontWeight="600">MID</text>
                  <text x="195" y="138" fill="#606070" fontSize="11" fontWeight="600">HIGH</text>
                </svg>
                <div style={{marginTop:'16px'}}>
                  <div style={{fontSize:'32px',fontWeight:'900',color:result.verdictColor}}>{form.currency} {fmt(form.monthlySalary)}</div>
                  <div style={{color:'#606070',fontSize:'13px',marginTop:'4px'}}>your monthly salary</div>
                </div>
              </div>
            </div>

            {/* COMPARISON CARDS */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'12px'}}>
              {[
                {label:'Market Low',value:result.marketLow,color:'#ef4444',icon:'📉'},
                {label:'Market Median',value:result.marketMedian,color:'#6366f1',icon:'⚖️'},
                {label:'Market High',value:result.marketHigh,color:'#10b981',icon:'📈'},
              ].map((card,i)=>{
                const diff = Number(form.monthlySalary) - card.value;
                return (
                  <div key={i} style={{background:'#13131f',border:`1px solid ${card.color}30`,borderRadius:'16px',padding:'20px',textAlign:'center'}}>
                    <div style={{fontSize:'24px',marginBottom:'8px'}}>{card.icon}</div>
                    <div style={{fontSize:'11px',color:'#404050',fontWeight:'700',textTransform:'uppercase',marginBottom:'6px'}}>{card.label}</div>
                    <div style={{fontSize:'15px',fontWeight:'800',color:card.color}}>{form.currency} {fmt(card.value)}</div>
                    <div style={{fontSize:'12px',marginTop:'6px',color:diff>=0?'#10b981':'#ef4444',fontWeight:'600'}}>
                      {diff>=0?'+':''}{form.currency} {fmt(Math.abs(diff))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* SALARY BAR CHART */}
            <div style={{background:'#13131f',border:'1px solid #1e1e2e',borderRadius:'20px',padding:'32px'}}>
              <div style={{fontWeight:'700',fontSize:'16px',marginBottom:'24px'}}>📊 Monthly Salary Comparison</div>
              {[
                {label:'Your Salary',value:Number(form.monthlySalary),color:result.verdictColor,isUser:true},
                {label:'Market Low',value:result.marketLow,color:'#ef4444'},
                {label:'Market Median',value:result.marketMedian,color:'#6366f1'},
                {label:'Market High',value:result.marketHigh,color:'#10b981'},
              ].map((item,i)=>(
                <div key={i} style={{marginBottom:'16px'}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:'6px'}}>
                    <span style={{fontSize:'13px',color:item.isUser?result.verdictColor:'#a0a0b0',fontWeight:item.isUser?'700':'400'}}>{item.label}{item.isUser?' ★':''}</span>
                    <span style={{fontSize:'14px',color:item.isUser?result.verdictColor:'#fff',fontWeight:'700'}}>{form.currency} {fmt(item.value)}/mo</span>
                  </div>
                  <div style={{height:'12px',background:'#0a0a0f',borderRadius:'50px',overflow:'hidden',border:'1px solid #1e1e2e'}}>
                    <div style={{height:'100%',width:`${(item.value/result.marketHigh)*100}%`,background:item.color,borderRadius:'50px',transition:'width 1s ease'}}/>
                  </div>
                </div>
              ))}
            </div>

            {/* AI SUMMARY */}
            <div style={{background:'linear-gradient(135deg,rgba(99,102,241,0.12),rgba(139,92,246,0.06))',border:'1px solid rgba(99,102,241,0.25)',borderRadius:'20px',padding:'32px'}}>
              <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'16px'}}>
                <div style={{width:'40px',height:'40px',borderRadius:'50%',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'18px',flexShrink:0}}>🤖</div>
                <div style={{fontWeight:'700',fontSize:'15px'}}>AI Market Analysis</div>
              </div>
              <p style={{color:'#c0c0d0',fontSize:'15px',lineHeight:1.8,margin:'0 0 12px'}}>{result.summary}</p>
              <p style={{color:'#a78bfa',fontSize:'14px',lineHeight:1.7,margin:0,fontStyle:'italic'}}>{result.advice}</p>
            </div>

            {/* CTA */}
            {result.verdict === 'Below Market' && (
              <div style={{background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.25)',borderRadius:'20px',padding:'32px',textAlign:'center'}}>
                <h3 style={{fontSize:'20px',fontWeight:'800',marginBottom:'8px'}}>Ready to negotiate a raise?</h3>
                <p style={{color:'#a0a0b0',fontSize:'14px',marginBottom:'20px'}}>Get a word-for-word negotiation script from our AI Coach.</p>
                <a href="/coach" style={{display:'inline-block',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',textDecoration:'none',borderRadius:'10px',padding:'12px 28px',fontWeight:'700',fontSize:'14px'}}>Get My Negotiation Script →</a>
              </div>
            )}

            <button onClick={()=>{setResult(null);setCountrySearch('');}}
              style={{background:'transparent',border:'1px solid #2a2a3e',color:'#a0a0b0',borderRadius:'12px',padding:'14px',fontSize:'14px',cursor:'pointer',fontWeight:'500'}}>
              ← Check Another Salary
            </button>
          </div>
        )}

        {!loading && result && result.error && (
          <div style={{textAlign:'center',padding:'60px',background:'#13131f',borderRadius:'24px'}}>
            <div style={{fontSize:'48px',marginBottom:'16px'}}>❌</div>
            <h3 style={{marginBottom:'8px'}}>Something went wrong</h3>
            <button onClick={()=>setResult(null)} style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',border:'none',borderRadius:'10px',padding:'12px 28px',cursor:'pointer',fontWeight:'600',marginTop:'16px'}}>Try Again</button>
          </div>
        )}
      </div>
    </div>
  );
}