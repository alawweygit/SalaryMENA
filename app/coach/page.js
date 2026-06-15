'use client';
import { useState } from 'react';

export default function Coach() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [form, setForm] = useState({
    jobTitle:'', country:'', currency:'AED',
    currentSalary:'', offeredSalary:'', experience:'', seniority:'', companyType:''
  });

  const update = (f,v) => setForm(p=>({...p,[f]:v}));

  const inp = {width:'100%',background:'#13131f',border:'1px solid #2a2a3e',borderRadius:'10px',padding:'14px 16px',color:'#fff',fontSize:'15px',outline:'none',boxSizing:'border-box'};
  const lbl = {display:'block',fontSize:'13px',fontWeight:'600',color:'#a0a0b0',marginBottom:'8px',textTransform:'uppercase',letterSpacing:'0.5px'};
  const chip = (a) => ({padding:'10px 20px',borderRadius:'50px',fontSize:'14px',fontWeight:'500',cursor:'pointer',border:'none',background:a?'linear-gradient(135deg,#6366f1,#8b5cf6)':'#13131f',color:a?'#fff':'#606070',outline:a?'none':'1px solid #2a2a3e',transition:'all 0.2s'});

  const canSubmit = form.jobTitle && form.country && form.offeredSalary && form.experience && form.seniority;

  const analyze = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/coach', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(form)
      });
      const data = await res.json();
      setResult(data);
    } catch(e) {
      setResult({ error: true });
    }
    setLoading(false);
  };

  const getVerdict = () => {
    if(!result) return null;
    const t = result.text?.toLowerCase() || '';
    if(t.includes('below market') || t.includes('underpaid')) return 'below';
    if(t.includes('above market') || t.includes('excellent') || t.includes('strong offer')) return 'above';
    return 'fair';
  };

  const verdict = getVerdict();

  const verdictConfig = {
    below: { label:'Below Market', emoji:'⚠️', color:'#ef4444', bg:'rgba(239,68,68,0.1)', border:'rgba(239,68,68,0.3)', meter:20, tip:'You should negotiate.' },
    fair:  { label:'Fair Offer',   emoji:'✅', color:'#10b981', bg:'rgba(16,185,129,0.1)', border:'rgba(16,185,129,0.3)', meter:55, tip:'Room to push slightly higher.' },
    above: { label:'Above Market', emoji:'🚀', color:'#6366f1', bg:'rgba(99,102,241,0.1)', border:'rgba(99,102,241,0.3)', meter:90, tip:'Great offer. Consider accepting.' },
  };

  const extractSection = (text, header, nextHeader) => {
    if(!text) return '';
    const start = text.indexOf(header);
    if(start === -1) return '';
    const content = text.slice(start + header.length);
    const end = nextHeader ? content.indexOf(nextHeader) : content.length;
    return content.slice(0, end === -1 ? content.length : end).trim();
  };

  const sections = result?.text ? {
    market: extractSection(result.text, 'MARKET ASSESSMENT', 'YOUR NEGOTIATION SCRIPT'),
    script: extractSection(result.text, 'YOUR NEGOTIATION SCRIPT', '3 TALKING POINTS'),
    points: extractSection(result.text, '3 TALKING POINTS', 'RECOMMENDED COUNTER OFFER'),
    counter: extractSection(result.text, 'RECOMMENDED COUNTER OFFER', null),
  } : {};

  const talkingPoints = sections.points ? sections.points.split('\n').filter(l => l.trim() && l.trim().length > 5) : [];

  return (
    <div style={{fontFamily:'Inter,sans-serif',background:'#0a0a0f',minHeight:'100vh',color:'#fff'}}>
      <style>{`input[type=number]::-webkit-outer-spin-button,input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}`}</style>

      <nav style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'20px 40px',borderBottom:'1px solid #1e1e2e',position:'sticky',top:0,background:'rgba(10,10,15,0.95)',backdropFilter:'blur(10px)',zIndex:100}}>
        <a href="/" style={{fontSize:'22px',fontWeight:'800',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',textDecoration:'none'}}>SalaryMENA</a>
        <div style={{display:'flex',gap:'16px',alignItems:'center'}}>
          <a href="/explore" style={{color:'#a0a0b0',textDecoration:'none',fontSize:'14px'}}>Explore</a>
          <a href="/submit" style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',textDecoration:'none',borderRadius:'8px',padding:'8px 16px',fontSize:'13px',fontWeight:'600'}}>Submit Salary</a>
        </div>
      </nav>

      <div style={{maxWidth:'700px',margin:'0 auto',padding:'60px 24px'}}>

        <div style={{textAlign:'center',marginBottom:'48px'}}>
          <div style={{display:'inline-block',background:'rgba(99,102,241,0.15)',border:'1px solid rgba(99,102,241,0.3)',borderRadius:'50px',padding:'6px 16px',fontSize:'13px',color:'#a78bfa',marginBottom:'20px',fontWeight:'500'}}>
            🤖 Powered by AI
          </div>
          <h1 style={{fontSize:'40px',fontWeight:'900',marginBottom:'16px',background:'linear-gradient(135deg,#fff 0%,#a78bfa 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
            AI Negotiation Coach
          </h1>
          <p style={{color:'#606070',fontSize:'17px',lineHeight:1.7,maxWidth:'500px',margin:'0 auto'}}>
            Is your offer fair? Get an instant verdict and a negotiation script.
          </p>
        </div>

        {!result ? (
          <div style={{background:'#0d0d18',border:'1px solid #1e1e2e',borderRadius:'24px',padding:'40px',display:'flex',flexDirection:'column',gap:'24px'}}>
            <div style={{display:'flex',gap:'16px'}}>
              <div style={{flex:2}}>
                <label style={lbl}>Job Title</label>
                <input style={inp} placeholder="e.g. Software Engineer" value={form.jobTitle} onChange={e=>update('jobTitle',e.target.value)}/>
              </div>
              <div style={{flex:1}}>
                <label style={lbl}>Country</label>
                <input style={inp} placeholder="e.g. UAE" value={form.country} onChange={e=>update('country',e.target.value)}/>
              </div>
            </div>

            <div>
              <label style={lbl}>Seniority Level</label>
              <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>
                {['Junior','Mid-Level','Senior','Lead','Manager','Director','C-Suite'].map(s=>(
                  <button key={s} style={chip(form.seniority===s)} onClick={()=>update('seniority',s)}>{s}</button>
                ))}
              </div>
            </div>

            <div>
              <label style={lbl}>Years of Experience</label>
              <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>
                {['0-1','1-3','3-5','5-8','8-12','12+'].map(y=>(
                  <button key={y} style={chip(form.experience===y)} onClick={()=>update('experience',y)}>{y} yrs</button>
                ))}
              </div>
            </div>

            <div>
              <label style={lbl}>Company Type <span style={{color:'#404050',fontWeight:'400',textTransform:'none'}}>(optional)</span></label>
              <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>
                {['Multinational','Local Company','Government','Family Business'].map(t=>(
                  <button key={t} style={chip(form.companyType===t)} onClick={()=>update('companyType',t)}>{t}</button>
                ))}
              </div>
            </div>

            <div>
              <label style={lbl}>Currency</label>
              <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>
                {['AED','SAR','EGP','OMR','KWD','QAR','BHD','JOD','USD'].map(c=>(
                  <button key={c} style={chip(form.currency===c)} onClick={()=>update('currency',c)}>{c}</button>
                ))}
              </div>
            </div>

            <div style={{display:'flex',gap:'16px'}}>
              <div style={{flex:1}}>
                <label style={lbl}>Offered Salary / month</label>
                <input style={inp} type="number" placeholder="e.g. 25000" value={form.offeredSalary} onChange={e=>update('offeredSalary',e.target.value)}/>
              </div>
              <div style={{flex:1}}>
                <label style={lbl}>Current Salary <span style={{color:'#404050',fontWeight:'400',textTransform:'none'}}>(optional)</span></label>
                <input style={inp} type="number" placeholder="e.g. 18000" value={form.currentSalary} onChange={e=>update('currentSalary',e.target.value)}/>
              </div>
            </div>

            <button onClick={canSubmit ? analyze : undefined}
              style={{background:canSubmit?'linear-gradient(135deg,#6366f1,#8b5cf6)':'#1e1e2e',color:canSubmit?'#fff':'#404050',border:'none',borderRadius:'12px',padding:'16px',fontSize:'16px',fontWeight:'700',cursor:canSubmit?'pointer':'not-allowed',marginTop:'8px'}}>
              {loading ? '🤖 Analyzing...' : 'Analyze My Offer →'}
            </button>
          </div>

        ) : (
          <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>

            {/* VERDICT CARD */}
            {verdict && (
              <div style={{background:verdictConfig[verdict].bg,border:`1px solid ${verdictConfig[verdict].border}`,borderRadius:'24px',padding:'32px',textAlign:'center'}}>
                <div style={{fontSize:'56px',marginBottom:'12px'}}>{verdictConfig[verdict].emoji}</div>
                <div style={{fontSize:'28px',fontWeight:'900',color:verdictConfig[verdict].color,marginBottom:'8px'}}>{verdictConfig[verdict].label}</div>
                <div style={{fontSize:'15px',color:'#a0a0b0',marginBottom:'28px'}}>{verdictConfig[verdict].tip}</div>

                {/* METER */}
                <div style={{maxWidth:'400px',margin:'0 auto'}}>
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:'11px',color:'#404050',marginBottom:'6px',fontWeight:'600'}}>
                    <span>UNDERPAID</span>
                    <span>FAIR</span>
                    <span>ABOVE MARKET</span>
                  </div>
                  <div style={{height:'12px',background:'#1e1e2e',borderRadius:'50px',overflow:'hidden',position:'relative'}}>
                    <div style={{position:'absolute',inset:0,background:'linear-gradient(90deg,#ef4444,#10b981,#6366f1)',borderRadius:'50px'}}/>
                    <div style={{position:'absolute',top:'-2px',left:`calc(${verdictConfig[verdict].meter}% - 8px)`,width:'16px',height:'16px',background:'#fff',borderRadius:'50%',boxShadow:'0 0 8px rgba(0,0,0,0.5)',transition:'left 0.5s ease'}}/>
                  </div>
                  <div style={{marginTop:'12px',fontSize:'22px',fontWeight:'800',color:verdictConfig[verdict].color}}>
                    {form.currency} {Number(form.offeredSalary).toLocaleString()} / month
                  </div>
                </div>
              </div>
            )}

            {/* MARKET ASSESSMENT */}
            {sections.market && (
              <div style={{background:'#13131f',border:'1px solid #1e1e2e',borderRadius:'16px',padding:'24px'}}>
                <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'12px'}}>
                  <span style={{fontSize:'20px'}}>📊</span>
                  <span style={{fontWeight:'700',fontSize:'15px'}}>Market Assessment</span>
                </div>
                <p style={{color:'#a0a0b0',fontSize:'14px',lineHeight:1.7,margin:0}}>{sections.market}</p>
              </div>
            )}

            {/* TALKING POINTS */}
            {talkingPoints.length > 0 && (
              <div style={{background:'#13131f',border:'1px solid #1e1e2e',borderRadius:'16px',padding:'24px'}}>
                <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'16px'}}>
                  <span style={{fontSize:'20px'}}>💡</span>
                  <span style={{fontWeight:'700',fontSize:'15px'}}>Your Talking Points</span>
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
                  {talkingPoints.slice(0,3).map((point,i)=>(
                    <div key={i} style={{display:'flex',gap:'12px',alignItems:'flex-start'}}>
                      <div style={{width:'24px',height:'24px',borderRadius:'50%',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',fontWeight:'700',flexShrink:0,marginTop:'1px'}}>{i+1}</div>
                      <p style={{color:'#a0a0b0',fontSize:'14px',lineHeight:1.6,margin:0}}>{point.replace(/^[\d\.\-\*]+\s*/,'')}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* COUNTER OFFER */}
            {sections.counter && (
              <div style={{background:'linear-gradient(135deg,rgba(99,102,241,0.15),rgba(139,92,246,0.15))',border:'1px solid rgba(99,102,241,0.3)',borderRadius:'16px',padding:'24px'}}>
                <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'12px'}}>
                  <span style={{fontSize:'20px'}}>🎯</span>
                  <span style={{fontWeight:'700',fontSize:'15px'}}>Recommended Counter Offer</span>
                </div>
                <p style={{color:'#c0c0d0',fontSize:'14px',lineHeight:1.7,margin:0}}>{sections.counter}</p>
              </div>
            )}

            {/* NEGOTIATION SCRIPT */}
            {sections.script && (
              <div style={{background:'#13131f',border:'1px solid #2a2a3e',borderRadius:'16px',padding:'24px'}}>
                <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'12px'}}>
                  <span style={{fontSize:'20px'}}>🗣️</span>
                  <span style={{fontWeight:'700',fontSize:'15px'}}>Your Negotiation Script</span>
                  <span style={{fontSize:'11px',color:'#404050',fontWeight:'500'}}>— say this word for word</span>
                </div>
                <div style={{background:'#0a0a0f',borderRadius:'10px',padding:'16px',borderLeft:'3px solid #6366f1'}}>
                  <p style={{color:'#a78bfa',fontSize:'14px',lineHeight:1.8,margin:0,fontStyle:'italic'}}>{sections.script}</p>
                </div>
              </div>
            )}

            {/* ACTIONS */}
            <div style={{display:'flex',gap:'12px',marginTop:'8px'}}>
              <button onClick={()=>{setResult(null);setForm({jobTitle:'',country:'',currency:'AED',currentSalary:'',offeredSalary:'',experience:'',seniority:'',companyType:''}); }}
                style={{flex:1,background:'transparent',border:'1px solid #2a2a3e',color:'#a0a0b0',borderRadius:'12px',padding:'14px',fontSize:'14px',cursor:'pointer',fontWeight:'500'}}>
                ← Analyze Another
              </button>
              <a href="/submit" style={{flex:1,display:'block',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',textDecoration:'none',borderRadius:'12px',padding:'14px',fontSize:'14px',fontWeight:'700',textAlign:'center'}}>
                Submit Your Salary →
              </a>
            </div>

            <p style={{textAlign:'center',fontSize:'12px',color:'#303040',margin:0}}>
              Also try: <a href="https://cvdropai.com" target="_blank" rel="noreferrer" style={{color:'#6366f1',textDecoration:'none'}}>CVDropAI</a> — Polish your CV before you apply
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
