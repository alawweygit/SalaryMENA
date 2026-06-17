'use client';
import { useState } from 'react';

const COUNTRIES = ['UAE','Saudi Arabia','Egypt','Oman','Kuwait','Qatar','Bahrain','Jordan','Lebanon','Iraq','Syria','Yemen','Libya','Tunisia','Algeria','Morocco','Sudan','Somalia','Comoros','Djibouti','Mauritania','Palestine'];

export default function Underpaid() {
  const [form, setForm] = useState({jobTitle:'',country:'',currency:'AED',monthlySalary:'',experience:'',seniority:''});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const update = (f,v) => setForm(p=>({...p,[f]:v}));

  const inp = {width:'100%',background:'#13131f',border:'1px solid #2a2a3e',borderRadius:'10px',padding:'14px 16px',color:'#fff',fontSize:'15px',outline:'none',boxSizing:'border-box'};
  const lbl = {display:'block',fontSize:'13px',fontWeight:'600',color:'#a0a0b0',marginBottom:'8px',textTransform:'uppercase',letterSpacing:'0.5px'};
  const chip = (a) => ({padding:'10px 20px',borderRadius:'50px',fontSize:'14px',fontWeight:'500',cursor:'pointer',border:'none',background:a?'linear-gradient(135deg,#6366f1,#8b5cf6)':'#13131f',color:a?'#fff':'#606070',outline:a?'none':'1px solid #2a2a3e'});
  const countryChip = (a) => ({padding:'8px 16px',borderRadius:'50px',fontSize:'13px',fontWeight:'500',cursor:'pointer',border:'none',background:a?'linear-gradient(135deg,#6366f1,#8b5cf6)':'#13131f',color:a?'#fff':'#606070',outline:a?'none':'1px solid #2a2a3e',whiteSpace:'nowrap'});
  const canAnalyze = form.jobTitle && form.country && form.monthlySalary && form.experience && form.seniority;
  const filteredCountries = COUNTRIES.filter(c=>c.toLowerCase().includes(countrySearch.toLowerCase()));
  const fmt = (n) => Math.round(n).toLocaleString();

  const analyze = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/underpaid', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({...form, save: true})
      });
      const json = await res.json();
      if(json.success) setResult(json.data);
      else setResult({error: true});
    } catch(e) {
      setResult({error: true});
    }
    setLoading(false);
  };

  return (
    <div style={{fontFamily:'Inter,sans-serif',background:'#0a0a0f',minHeight:'100vh',color:'#fff'}}>
      <style>{`input[type=number]::-webkit-outer-spin-button,input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}`}</style>
      <nav style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'20px 40px',borderBottom:'1px solid #1e1e2e',position:'sticky',top:0,background:'rgba(10,10,15,0.95)',backdropFilter:'blur(10px)',zIndex:100}}>
        <a href="/" style={{fontSize:'22px',fontWeight:'800',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',textDecoration:'none'}}>SalaryMENA</a>
        <a href="/submit" style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',textDecoration:'none',borderRadius:'8px',padding:'8px 16px',fontSize:'13px',fontWeight:'600'}}>Submit Salary</a>
      </nav>

      <div style={{maxWidth:'700px',margin:'0 auto',padding:'60px 24px'}}>
        <div style={{textAlign:'center',marginBottom:'48px'}}>
          <div style={{display:'inline-block',background:'rgba(99,102,241,0.15)',border:'1px solid rgba(99,102,241,0.3)',borderRadius:'50px',padding:'6px 16px',fontSize:'13px',color:'#a78bfa',marginBottom:'20px',fontWeight:'500'}}>🤖 AI-Powered · Searches Reddit & Glassdoor</div>
          <h1 style={{fontSize:'40px',fontWeight:'900',marginBottom:'16px',background:'linear-gradient(135deg,#fff 0%,#a78bfa 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Am I Underpaid?</h1>
          <p style={{color:'#606070',fontSize:'17px',lineHeight:1.7}}>Our AI searches real salary data across the web to tell you exactly where you stand.</p>
        </div>

        {!result ? (
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
                  <button key={c} style={countryChip(form.country===c)} onClick={()=>update('country',c)}>{c}</button>
                ))}
              </div>
              {form.country && <div style={{marginTop:'10px',padding:'8px 14px',background:'rgba(99,102,241,0.1)',border:'1px solid rgba(99,102,241,0.3)',borderRadius:'8px',fontSize:'13px',color:'#a78bfa'}}>Selected: {form.country}</div>}
            </div>

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

            <button onClick={canAnalyze?analyze:undefined} style={{background:canAnalyze?'linear-gradient(135deg,#6366f1,#8b5cf6)':'#1e1e2e',color:canAnalyze?'#fff':'#404050',border:'none',borderRadius:'12px',padding:'16px',fontSize:'16px',fontWeight:'700',cursor:canAnalyze?'pointer':'not-allowed'}}>
              {loading ? '🤖 Searching the web for salary data...' : 'Analyze My Salary →'}
            </button>
            {loading && <p style={{textAlign:'center',color:'#404050',fontSize:'13px',margin:0}}>Checking Reddit, Glassdoor, and salary sites — this takes 5-10 seconds</p>}
          </div>

        ) : result.error ? (
          <div style={{textAlign:'center',padding:'60px',background:'#13131f',borderRadius:'24px'}}>
            <div style={{fontSize:'48px',marginBottom:'16px'}}>❌</div>
            <h3 style={{marginBottom:'8px'}}>Something went wrong</h3>
            <p style={{color:'#606070',marginBottom:'24px'}}>Please try again</p>
            <button onClick={()=>setResult(null)} style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',border:'none',borderRadius:'10px',padding:'12px 28px',cursor:'pointer',fontWeight:'600'}}>Try Again</button>
          </div>

        ) : (
          <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>

            {/* VERDICT */}
            <div style={{background:`linear-gradient(135deg,${result.verdictColor}20,${result.verdictColor}05)`,border:`1px solid ${result.verdictColor}40`,borderRadius:'24px',padding:'48px',textAlign:'center'}}>
              <div style={{fontSize:'64px',marginBottom:'16px'}}>
                {result.verdict==='Below Market'?'⚠️':result.verdict==='Above Market'?'🚀':'✅'}
              </div>
              <div style={{fontSize:'13px',color:result.verdictColor,fontWeight:'700',textTransform:'uppercase',letterSpacing:'2px',marginBottom:'8px'}}>AI Market Analysis</div>
              <div style={{fontSize:'36px',fontWeight:'900',color:result.verdictColor,marginBottom:'16px'}}>{result.verdict}</div>
              <div style={{fontSize:'52px',fontWeight:'900',color:'#fff',marginBottom:'4px'}}>{form.currency} {fmt(form.monthlySalary)}</div>
              <div style={{color:'#606070',fontSize:'14px'}}>your monthly salary</div>
            </div>

            {/* GAUGE */}
            <div style={{background:'#13131f',border:'1px solid #1e1e2e',borderRadius:'20px',padding:'32px'}}>
              <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'28px'}}>
                <span style={{fontSize:'22px'}}>🎯</span>
                <div>
                  <div style={{fontWeight:'700',fontSize:'16px'}}>Market Position</div>
                  <div style={{color:'#606070',fontSize:'13px'}}>Based on real data from across the web</div>
                </div>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:'11px',color:'#404050',marginBottom:'10px',fontWeight:'700',textTransform:'uppercase',letterSpacing:'0.5px'}}>
                <span>Low</span><span>Average</span><span>High</span>
              </div>
              <div style={{height:'20px',background:'#0a0a0f',borderRadius:'50px',position:'relative',overflow:'visible',border:'1px solid #1e1e2e'}}>
                <div style={{position:'absolute',inset:0,background:'linear-gradient(90deg,#ef4444 0%,#f59e0b 40%,#10b981 100%)',borderRadius:'50px',opacity:0.8}}/>
                <div style={{
                  position:'absolute',top:'-6px',
                  left:`calc(${Math.min(Math.max(result.userPercentile,3),97)}% - 14px)`,
                  width:'32px',height:'32px',
                  background:'#fff',borderRadius:'50%',
                  boxShadow:`0 0 0 4px ${result.verdictColor},0 4px 20px rgba(0,0,0,0.6)`,
                  zIndex:10,
                  display:'flex',alignItems:'center',justifyContent:'center',
                  fontSize:'12px',fontWeight:'800',color:result.verdictColor
                }}>
                  {result.userPercentile}
                </div>
              </div>
              <div style={{textAlign:'center',marginTop:'28px'}}>
                <div style={{fontSize:'14px',color:'#a0a0b0'}}>
                  You are in the <strong style={{color:result.verdictColor,fontSize:'18px'}}>{result.userPercentile}th percentile</strong> for your role in {form.country}
                </div>
              </div>
            </div>

            {/* SALARY BARS */}
            <div style={{background:'#13131f',border:'1px solid #1e1e2e',borderRadius:'20px',padding:'32px'}}>
              <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'28px'}}>
                <span style={{fontSize:'22px'}}>📊</span>
                <div>
                  <div style={{fontWeight:'700',fontSize:'16px'}}>Salary Range — {form.jobTitle} in {form.country}</div>
                  <div style={{color:'#606070',fontSize:'13px'}}>AI-researched from Reddit, Glassdoor & salary sites</div>
                </div>
              </div>
              {[
                {label:'Market Low',value:result.marketLow,color:'#ef4444'},
                {label:'Market Median',value:result.marketMedian,color:'#6366f1'},
                {label:'Market High',value:result.marketHigh,color:'#10b981'},
                {label:'Your Salary',value:Number(form.monthlySalary),color:result.verdictColor,isUser:true},
              ].sort((a,b)=>a.value-b.value).map((item,i)=>(
                <div key={i} style={{marginBottom:'16px'}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:'6px'}}>
                    <span style={{fontSize:'13px',color:item.isUser?result.verdictColor:'#a0a0b0',fontWeight:item.isUser?'700':'400'}}>{item.label} {item.isUser?'★':''}</span>
                    <span style={{fontSize:'14px',color:item.isUser?result.verdictColor:'#fff',fontWeight:'700'}}>{form.currency} {fmt(item.value)}</span>
                  </div>
                  <div style={{height:'10px',background:'#0a0a0f',borderRadius:'50px',overflow:'hidden',border:'1px solid #1e1e2e'}}>
                    <div style={{height:'100%',width:`${(item.value/result.marketHigh)*100}%`,background:item.color,borderRadius:'50px',transition:'width 0.8s ease'}}/>
                  </div>
                </div>
              ))}
            </div>

            {/* 3 CARDS */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'12px'}}>
              {[
                {icon:'📉',label:'Market Low',value:`${form.currency} ${fmt(result.marketLow)}`,color:'#ef4444'},
                {icon:'⚖️',label:'Median',value:`${form.currency} ${fmt(result.marketMedian)}`,color:'#6366f1'},
                {icon:'📈',label:'Market High',value:`${form.currency} ${fmt(result.marketHigh)}`,color:'#10b981'},
              ].map((card,i)=>(
                <div key={i} style={{background:'#13131f',border:'1px solid #1e1e2e',borderRadius:'16px',padding:'24px',textAlign:'center'}}>
                  <div style={{fontSize:'28px',marginBottom:'10px'}}>{card.icon}</div>
                  <div style={{fontSize:'11px',color:'#404050',fontWeight:'700',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:'8px'}}>{card.label}</div>
                  <div style={{fontSize:'16px',fontWeight:'800',color:card.color}}>{card.value}</div>
                </div>
              ))}
            </div>

            {/* AI SUMMARY */}
            <div style={{background:'linear-gradient(135deg,rgba(99,102,241,0.1),rgba(139,92,246,0.05))',border:'1px solid rgba(99,102,241,0.2)',borderRadius:'20px',padding:'32px'}}>
              <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'16px'}}>
                <div style={{width:'36px',height:'36px',borderRadius:'50%',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'16px'}}>🤖</div>
                <div style={{fontWeight:'700',fontSize:'15px'}}>AI Market Summary</div>
              </div>
              <p style={{color:'#c0c0d0',fontSize:'15px',lineHeight:1.8,margin:'0 0 12px'}}>{result.summary}</p>
              <p style={{color:'#a78bfa',fontSize:'14px',lineHeight:1.7,margin:0,fontStyle:'italic'}}>{result.advice}</p>
            </div>

            {/* CTA */}
            {result.userPercentile < 50 && (
              <div style={{background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.25)',borderRadius:'20px',padding:'32px',textAlign:'center'}}>
                <h3 style={{fontSize:'20px',fontWeight:'800',marginBottom:'8px'}}>Ready to negotiate a raise?</h3>
                <p style={{color:'#a0a0b0',fontSize:'14px',marginBottom:'20px'}}>Get a word-for-word script from our AI Coach.</p>
                <a href="/coach" style={{display:'inline-block',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',textDecoration:'none',borderRadius:'10px',padding:'12px 28px',fontWeight:'700',fontSize:'14px'}}>Get My Negotiation Script →</a>
              </div>
            )}

            <button onClick={()=>{setResult(null);setCountrySearch('');}} style={{background:'transparent',border:'1px solid #2a2a3e',color:'#a0a0b0',borderRadius:'12px',padding:'14px',fontSize:'14px',cursor:'pointer',fontWeight:'500'}}>← Check Another Salary</button>
          </div>
        )}
      </div>
    </div>
  );
}