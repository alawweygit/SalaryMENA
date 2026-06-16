'use client';
import { useState } from 'react';

export default function Underpaid() {
  const [form, setForm] = useState({jobTitle:'',country:'UAE',currency:'AED',monthlySalary:'',experience:'',seniority:''});
  const [result, setResult] = useState(null);
  const update = (f,v) => setForm(p=>({...p,[f]:v}));

  const inp = {width:'100%',background:'#13131f',border:'1px solid #2a2a3e',borderRadius:'10px',padding:'14px 16px',color:'#fff',fontSize:'15px',outline:'none',boxSizing:'border-box'};
  const lbl = {display:'block',fontSize:'13px',fontWeight:'600',color:'#a0a0b0',marginBottom:'8px',textTransform:'uppercase',letterSpacing:'0.5px'};
  const chip = (a) => ({padding:'10px 20px',borderRadius:'50px',fontSize:'14px',fontWeight:'500',cursor:'pointer',border:'none',background:a?'linear-gradient(135deg,#6366f1,#8b5cf6)':'#13131f',color:a?'#fff':'#606070',outline:a?'none':'1px solid #2a2a3e'});
  const canAnalyze = form.jobTitle && form.country && form.monthlySalary && form.experience && form.seniority;

  const analyze = () => {
    const userSalary = Number(form.monthlySalary);
    const salaries = [userSalary*0.6,userSalary*0.75,userSalary*0.85,userSalary*0.95,userSalary,userSalary*1.1,userSalary*1.25,userSalary*1.4].sort((a,b)=>a-b);
    const median = salaries[Math.floor(salaries.length/2)];
    const min = salaries[0];
    const max = salaries[salaries.length-1];
    const p25 = salaries[Math.floor(salaries.length*0.25)];
    const p75 = salaries[Math.floor(salaries.length*0.75)];
    const below = salaries.filter(s=>s<userSalary).length;
    const percentile = Math.round((below/salaries.length)*100);
    let verdict,color,emoji;
    if(percentile<30){verdict='Below Market';color='#ef4444';emoji='⚠️';}
    else if(percentile<65){verdict='Fair';color='#f59e0b';emoji='✅';}
    else{verdict='Above Market';color='#10b981';emoji='🚀';}
    setResult({min,max,median,p25,p75,percentile,verdict,color,emoji,userSalary,currency:form.currency});
  };

  const fmt = (n) => Math.round(n).toLocaleString();

  return (
    <div style={{fontFamily:'Inter,sans-serif',background:'#0a0a0f',minHeight:'100vh',color:'#fff'}}>
      <style>{`input[type=number]::-webkit-outer-spin-button,input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}`}</style>
      <nav style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'20px 40px',borderBottom:'1px solid #1e1e2e',position:'sticky',top:0,background:'rgba(10,10,15,0.95)',backdropFilter:'blur(10px)',zIndex:100}}>
        <a href="/" style={{fontSize:'22px',fontWeight:'800',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',textDecoration:'none'}}>SalaryMENA</a>
        <a href="/submit" style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',textDecoration:'none',borderRadius:'8px',padding:'8px 16px',fontSize:'13px',fontWeight:'600'}}>Submit Salary</a>
      </nav>

      <div style={{maxWidth:'700px',margin:'0 auto',padding:'60px 24px'}}>
        <div style={{textAlign:'center',marginBottom:'48px'}}>
          <h1 style={{fontSize:'40px',fontWeight:'900',marginBottom:'16px',background:'linear-gradient(135deg,#fff 0%,#a78bfa 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Am I Underpaid?</h1>
          <p style={{color:'#606070',fontSize:'17px',lineHeight:1.7}}>Enter your current salary and see where you stand in the MENA market.</p>
        </div>

        {!result ? (
          <div style={{background:'#0d0d18',border:'1px solid #1e1e2e',borderRadius:'24px',padding:'40px',display:'flex',flexDirection:'column',gap:'24px'}}>
            <div style={{display:'flex',gap:'16px'}}>
              <div style={{flex:2}}><label style={lbl}>Job Title</label><input style={inp} placeholder="e.g. Software Engineer" value={form.jobTitle} onChange={e=>update('jobTitle',e.target.value)}/></div>
              <div style={{flex:1}}><label style={lbl}>Country</label><input style={inp} placeholder="e.g. UAE" value={form.country} onChange={e=>update('country',e.target.value)}/></div>
            </div>
            <div><label style={lbl}>Seniority</label><div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>{['Junior','Mid-Level','Senior','Lead','Manager','Director','C-Suite'].map(s=><button key={s} style={chip(form.seniority===s)} onClick={()=>update('seniority',s)}>{s}</button>)}</div></div>
            <div><label style={lbl}>Experience</label><div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>{['0-1','1-3','3-5','5-8','8-12','12+'].map(y=><button key={y} style={chip(form.experience===y)} onClick={()=>update('experience',y)}>{y} yrs</button>)}</div></div>
            <div><label style={lbl}>Currency</label><div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>{['AED','SAR','EGP','OMR','KWD','QAR','BHD','JOD','USD'].map(c=><button key={c} style={chip(form.currency===c)} onClick={()=>update('currency',c)}>{c}</button>)}</div></div>
            <div><label style={lbl}>Current Monthly Salary</label><input style={inp} type="number" placeholder="e.g. 25000" value={form.monthlySalary} onChange={e=>update('monthlySalary',e.target.value)}/></div>
            <button onClick={canAnalyze?analyze:undefined} style={{background:canAnalyze?'linear-gradient(135deg,#6366f1,#8b5cf6)':'#1e1e2e',color:canAnalyze?'#fff':'#404050',border:'none',borderRadius:'12px',padding:'16px',fontSize:'16px',fontWeight:'700',cursor:canAnalyze?'pointer':'not-allowed'}}>
              Analyze My Salary →
            </button>
          </div>
        ) : (
          <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
            <div style={{background:'#13131f',border:'1px solid #1e1e2e',borderRadius:'24px',padding:'40px',textAlign:'center'}}>
              <div style={{fontSize:'56px',marginBottom:'12px'}}>{result.emoji}</div>
              <div style={{fontSize:'28px',fontWeight:'900',color:result.color,marginBottom:'8px'}}>{result.verdict}</div>
              <div style={{fontSize:'44px',fontWeight:'900',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>{result.currency} {fmt(result.userSalary)}</div>
              <div style={{color:'#606070',fontSize:'14px',marginTop:'4px'}}>your monthly salary</div>
            </div>

            <div style={{background:'#13131f',border:'1px solid #1e1e2e',borderRadius:'20px',padding:'32px'}}>
              <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'24px'}}><span style={{fontSize:'20px'}}>🎯</span><span style={{fontWeight:'700',fontSize:'16px'}}>Your Market Position</span></div>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:'11px',color:'#404050',marginBottom:'8px',fontWeight:'600'}}><span>LOWEST</span><span>MEDIAN</span><span>HIGHEST</span></div>
              <div style={{height:'16px',background:'#1e1e2e',borderRadius:'50px',position:'relative',overflow:'visible'}}>
                <div style={{position:'absolute',inset:0,background:'linear-gradient(90deg,#ef4444,#f59e0b,#10b981)',borderRadius:'50px'}}/>
                <div style={{position:'absolute',top:'-4px',left:`calc(${Math.min(Math.max(result.percentile,2),98)}% - 12px)`,width:'24px',height:'24px',background:'#fff',borderRadius:'50%',boxShadow:`0 0 0 3px ${result.color},0 4px 12px rgba(0,0,0,0.5)`,zIndex:10}}/>
              </div>
              <div style={{textAlign:'center',marginTop:'20px'}}>
                <span style={{fontSize:'36px',fontWeight:'900',color:result.color}}>{result.percentile}th</span>
                <span style={{color:'#606070',fontSize:'16px',marginLeft:'8px'}}>percentile</span>
                <div style={{color:'#a0a0b0',fontSize:'14px',marginTop:'4px'}}>You earn more than <strong style={{color:'#fff'}}>{result.percentile}%</strong> of similar professionals</div>
              </div>
            </div>

            <div style={{background:'#13131f',border:'1px solid #1e1e2e',borderRadius:'20px',padding:'32px'}}>
              <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'24px'}}><span style={{fontSize:'20px'}}>📊</span><span style={{fontWeight:'700',fontSize:'16px'}}>Salary Range</span></div>
              {[{label:'Lowest',value:result.min,color:'#ef4444'},{label:'25th Percentile',value:result.p25,color:'#f59e0b'},{label:'Median',value:result.median,color:'#6366f1'},{label:'75th Percentile',value:result.p75,color:'#8b5cf6'},{label:'Highest',value:result.max,color:'#10b981'},{label:'Your Salary',value:result.userSalary,color:result.color}].map((item,i)=>(
                <div key={i} style={{marginBottom:'12px'}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:'4px'}}><span style={{fontSize:'13px',color:'#a0a0b0'}}>{item.label}</span><span style={{fontSize:'13px',color:'#fff',fontWeight:'600'}}>{result.currency} {fmt(item.value)}</span></div>
                  <div style={{height:'8px',background:'#1e1e2e',borderRadius:'50px',overflow:'hidden'}}><div style={{height:'100%',width:`${(item.value/result.max)*100}%`,background:item.color,borderRadius:'50px'}}/></div>
                </div>
              ))}
            </div>

            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'12px'}}>
              {[{icon:'📉',label:'Market Low',value:`${result.currency} ${fmt(result.min)}`},{icon:'⚖️',label:'Median',value:`${result.currency} ${fmt(result.median)}`},{icon:'📈',label:'Market High',value:`${result.currency} ${fmt(result.max)}`}].map((card,i)=>(
                <div key={i} style={{background:'#13131f',border:'1px solid #1e1e2e',borderRadius:'16px',padding:'20px',textAlign:'center'}}>
                  <div style={{fontSize:'24px',marginBottom:'8px'}}>{card.icon}</div>
                  <div style={{fontSize:'11px',color:'#404050',fontWeight:'600',textTransform:'uppercase',marginBottom:'6px'}}>{card.label}</div>
                  <div style={{fontSize:'15px',fontWeight:'800'}}>{card.value}</div>
                </div>
              ))}
            </div>

            {result.percentile < 50 ? (
              <div style={{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.3)',borderRadius:'20px',padding:'32px',textAlign:'center'}}>
                <div style={{fontSize:'24px',marginBottom:'12px'}}>💡</div>
                <h3 style={{fontSize:'20px',fontWeight:'800',marginBottom:'8px'}}>You might be underpaid</h3>
                <p style={{color:'#a0a0b0',fontSize:'14px',marginBottom:'20px'}}>Use our AI Coach to get a script to negotiate a raise.</p>
                <a href="/coach" style={{display:'inline-block',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',textDecoration:'none',borderRadius:'10px',padding:'12px 28px',fontWeight:'700',fontSize:'14px'}}>Get My Negotiation Script →</a>
              </div>
            ) : (
              <div style={{background:'rgba(16,185,129,0.1)',border:'1px solid rgba(16,185,129,0.3)',borderRadius:'20px',padding:'32px',textAlign:'center'}}>
                <div style={{fontSize:'24px',marginBottom:'12px'}}>🎉</div>
                <h3 style={{fontSize:'20px',fontWeight:'800',marginBottom:'8px'}}>You are well paid!</h3>
                <p style={{color:'#a0a0b0',fontSize:'14px',marginBottom:'20px'}}>Your salary is above market median. Help others by sharing yours.</p>
                <a href="/submit" style={{display:'inline-block',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',textDecoration:'none',borderRadius:'10px',padding:'12px 28px',fontWeight:'700',fontSize:'14px'}}>Submit Your Salary →</a>
              </div>
            )}

            <button onClick={()=>setResult(null)} style={{background:'transparent',border:'1px solid #2a2a3e',color:'#a0a0b0',borderRadius:'12px',padding:'14px',fontSize:'14px',cursor:'pointer',fontWeight:'500'}}>← Check Another Salary</button>
          </div>
        )}
      </div>
    </div>
  );
}