'use client';
import { useState } from 'react';

const COUNTRIES = ['UAE','Saudi Arabia','Egypt','Oman','Kuwait','Qatar','Bahrain','Jordan','Lebanon','Iraq','Syria','Yemen','Libya','Tunisia','Algeria','Morocco','Sudan','Somalia','Comoros','Djibouti','Mauritania','Palestine'];
const STEPS = [{id:1,title:'Your Role',subtitle:'What do you do?'},{id:2,title:'Your Company',subtitle:'Where do you work?'},{id:3,title:'Your Location',subtitle:'Where are you based?'},{id:4,title:'Your Salary',subtitle:'What does your offer letter say?'},{id:5,title:'Your Background',subtitle:'A bit about you'},{id:6,title:'Almost Done',subtitle:'Where should we send your salary report?'}];

export default function Submit() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [form, setForm] = useState({jobTitle:'',seniority:'',companyType:'',companyName:'',country:'',city:'',monthlySalary:'',basicSalary:'',currency:'AED',bonus:'',experience:'',education:'',nationalityType:'',gender:'',email:''});
  const update = (f,v) => setForm(p=>({...p,[f]:v}));

  const canNext = () => {
    if(step===1) return form.jobTitle && form.seniority;
    if(step===2) return form.companyType;
    if(step===3) return form.country;
    if(step===4) return form.monthlySalary;
    if(step===5) return form.experience && form.nationalityType;
    if(step===6) return form.email;
    return true;
  };

  const handleSubmit = async () => {
    try {
      await fetch('/api/submit', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(form)
      });
    } catch(e) {}
    setSubmitted(true);
  };

  const inp = {width:'100%',background:'#13131f',border:'1px solid #2a2a3e',borderRadius:'10px',padding:'14px 16px',color:'#fff',fontSize:'15px',outline:'none',boxSizing:'border-box',appearance:'none'};
  const lbl = {display:'block',fontSize:'13px',fontWeight:'600',color:'#a0a0b0',marginBottom:'8px',textTransform:'uppercase',letterSpacing:'0.5px'};
  const hint = {fontSize:'12px',color:'#505060',marginBottom:'12px',lineHeight:1.6};
  const chip = (a) => ({padding:'10px 20px',borderRadius:'50px',fontSize:'14px',fontWeight:'500',cursor:'pointer',border:'none',background:a?'linear-gradient(135deg,#6366f1,#8b5cf6)':'#13131f',color:a?'#fff':'#606070',outline:a?'none':'1px solid #2a2a3e',transition:'all 0.2s'});
  const rowChip = (a) => ({...chip(a),borderRadius:'12px',padding:'14px 20px',textAlign:'left',display:'flex',justifyContent:'space-between',alignItems:'center',width:'100%'});
  const countryChip = (a) => ({padding:'8px 16px',borderRadius:'50px',fontSize:'13px',fontWeight:'500',cursor:'pointer',border:'none',background:a?'linear-gradient(135deg,#6366f1,#8b5cf6)':'#13131f',color:a?'#fff':'#606070',outline:a?'none':'1px solid #2a2a3e',whiteSpace:'nowrap'});
  const progress = ((step-1)/(STEPS.length-1))*100;
  const filteredCountries = COUNTRIES.filter(c=>c.toLowerCase().includes(countrySearch.toLowerCase()));
  const isGCC = ['UAE','Saudi Arabia','Kuwait','Qatar','Bahrain','Oman'].includes(form.country);
  const nationalityOptions = isGCC ? ['GCC National','Arab (Non-GCC)','Western Expat','Asian Expat','Other'] : ['Local National','Arab (Other Country)','Western Expat','Asian Expat','Other'];

  if(submitted) return (
    <div style={{fontFamily:'Inter,sans-serif',background:'#0a0a0f',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff'}}>
      <div style={{textAlign:'center',maxWidth:'500px',padding:'40px'}}>
        <div style={{fontSize:'64px',marginBottom:'24px'}}>🎉</div>
        <h1 style={{fontSize:'32px',fontWeight:'800',marginBottom:'16px'}}>Thank you!</h1>
        <p style={{color:'#a0a0b0',fontSize:'16px',lineHeight:1.7,marginBottom:'32px'}}>Your salary has been submitted anonymously. We will send your report to <strong style={{color:'#a78bfa'}}>{form.email}</strong></p>
        <a href="/" style={{display:'inline-block',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',textDecoration:'none',borderRadius:'12px',padding:'14px 32px',fontWeight:'700'}}>Back to Home</a>
      </div>
    </div>
  );

  return (
    <div style={{fontFamily:'Inter,sans-serif',background:'#0a0a0f',minHeight:'100vh',color:'#fff'}}>
      <style>{`input[type=number]::-webkit-outer-spin-button,input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}`}</style>
      <nav style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'20px 40px',borderBottom:'1px solid #1e1e2e'}}>
        <a href="/" style={{fontSize:'22px',fontWeight:'800',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',textDecoration:'none'}}>SalaryMENA</a>
        <span style={{color:'#606070',fontSize:'14px'}}>Step {step} of {STEPS.length}</span>
      </nav>
      <div style={{height:'3px',background:'#1e1e2e'}}><div style={{height:'100%',width:progress+'%',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',transition:'width 0.4s ease'}}/></div>

      <div style={{maxWidth:'580px',margin:'60px auto',padding:'0 24px'}}>
        <div style={{marginBottom:'48px'}}>
          <div style={{fontSize:'13px',color:'#6366f1',fontWeight:'600',marginBottom:'8px',textTransform:'uppercase',letterSpacing:'1px'}}>Step {step} of {STEPS.length}</div>
          <h1 style={{fontSize:'36px',fontWeight:'800',marginBottom:'8px'}}>{STEPS[step-1].title}</h1>
          <p style={{color:'#606070',fontSize:'16px'}}>{STEPS[step-1].subtitle}</p>
        </div>

        {step===1 && <div style={{display:'flex',flexDirection:'column',gap:'24px'}}>
          <div><label style={lbl}>Job Title</label><input style={inp} placeholder="e.g. Software Engineer..." value={form.jobTitle} onChange={e=>update('jobTitle',e.target.value)}/></div>
          <div>
            <label style={lbl}>Seniority Level</label>
            <p style={hint}>Not sure? Pick based on your years in this field.</p>
            <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
              {[['Junior','0-2 years'],['Mid-Level','2-5 years'],['Senior','5-8 years'],['Lead','Leading a team'],['Manager','Managing people'],['Director','Head of department'],['C-Suite','CEO, CFO, COO...']].map(([s,desc])=>(
                <button key={s} onClick={()=>update('seniority',s)} style={rowChip(form.seniority===s)}>
                  <span>{s}</span><span style={{fontSize:'12px',opacity:0.6}}>{desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>}

        {step===2 && <div style={{display:'flex',flexDirection:'column',gap:'24px'}}>
          <div>
            <label style={lbl}>Company Type</label>
            <div style={{display:'flex',flexWrap:'wrap',gap:'10px'}}>
              {['Multinational','Local Company','Government','Family Business'].map(t=>(
                <button key={t} style={chip(form.companyType===t)} onClick={()=>update('companyType',t)}>{t}</button>
              ))}
            </div>
          </div>
          <div>
            <label style={lbl}>Company Name <span style={{color:'#404050',fontWeight:'400',textTransform:'none'}}>(optional)</span></label>
            <input style={inp} placeholder="e.g. Aramco, HSBC, Careem..." value={form.companyName} onChange={e=>update('companyName',e.target.value)}/>
          </div>
        </div>}

        {step===3 && <div style={{display:'flex',flexDirection:'column',gap:'24px'}}>
          <div>
            <label style={lbl}>Country</label>
            <input style={{...inp,marginBottom:'12px'}} placeholder="Search country..." value={countrySearch} onChange={e=>setCountrySearch(e.target.value)}/>
            <div style={{display:'flex',flexWrap:'wrap',gap:'8px',maxHeight:'220px',overflowY:'auto',padding:'4px 0'}}>
              {filteredCountries.map(c=>(
                <button key={c} style={countryChip(form.country===c)} onClick={()=>update('country',c)}>{c}</button>
              ))}
            </div>
            {form.country && <div style={{marginTop:'12px',padding:'10px 16px',background:'rgba(99,102,241,0.1)',border:'1px solid rgba(99,102,241,0.3)',borderRadius:'10px',fontSize:'14px',color:'#a78bfa'}}>Selected: {form.country}</div>}
          </div>
          <div>
            <label style={lbl}>City <span style={{color:'#404050',fontWeight:'400',textTransform:'none'}}>(optional)</span></label>
            <input style={inp} placeholder="e.g. Dubai, Riyadh, Cairo..." value={form.city} onChange={e=>update('city',e.target.value)}/>
          </div>
        </div>}

        {step===4 && <div style={{display:'flex',flexDirection:'column',gap:'24px'}}>
          <div>
            <label style={lbl}>Currency</label>
            <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>
              {['AED','SAR','EGP','OMR','KWD','QAR','BHD','JOD','USD'].map(c=>(
                <button key={c} style={chip(form.currency===c)} onClick={()=>update('currency',c)}>{c}</button>
              ))}
            </div>
          </div>
          <div>
            <label style={lbl}>Monthly Salary</label>
            <p style={hint}>The total amount you receive every month on your payslip.</p>
            <input style={inp} type="number" placeholder="e.g. 25000" value={form.monthlySalary} onChange={e=>update('monthlySalary',e.target.value)}/>
          </div>
          <div>
            <label style={lbl}>Basic Salary <span style={{color:'#404050',fontWeight:'400',textTransform:'none'}}>(optional)</span></label>
            <p style={hint}>If your offer letter shows a separate basic salary, enter it here.</p>
            <input style={inp} type="number" placeholder="e.g. 15000" value={form.basicSalary} onChange={e=>update('basicSalary',e.target.value)}/>
          </div>
          <div>
            <label style={lbl}>Annual Bonus <span style={{color:'#404050',fontWeight:'400',textTransform:'none'}}>(optional)</span></label>
            <p style={hint}>Any bonus you receive at the end of the year.</p>
            <input style={inp} type="number" placeholder="e.g. 10000" value={form.bonus} onChange={e=>update('bonus',e.target.value)}/>
          </div>
        </div>}

        {step===5 && <div style={{display:'flex',flexDirection:'column',gap:'24px'}}>
          <div>
            <label style={lbl}>Years of Total Experience</label>
            <div style={{display:'flex',flexWrap:'wrap',gap:'10px'}}>
              {['0-1','1-3','3-5','5-8','8-12','12+'].map(y=>(
                <button key={y} style={chip(form.experience===y)} onClick={()=>update('experience',y)}>{y} years</button>
              ))}
            </div>
          </div>
          <div>
            <label style={lbl}>Education</label>
            <div style={{display:'flex',flexWrap:'wrap',gap:'10px'}}>
              {["High School","Bachelor's","Master's","PhD","Professional Cert"].map(e=>(
                <button key={e} style={chip(form.education===e)} onClick={()=>update('education',e)}>{e}</button>
              ))}
            </div>
          </div>
          <div>
            <label style={lbl}>Nationality Type</label>
            <p style={hint}>Helps us show accurate comparisons. Your exact nationality is never stored.</p>
            <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
              {nationalityOptions.map(n=>(
                <button key={n} style={{...rowChip(form.nationalityType===n),justifyContent:'flex-start'}} onClick={()=>update('nationalityType',n)}>{n}</button>
              ))}
            </div>
          </div>
          <div>
            <label style={lbl}>Gender <span style={{color:'#404050',fontWeight:'400',textTransform:'none'}}>(optional)</span></label>
            <div style={{display:'flex',gap:'10px'}}>
              {['Male','Female'].map(g=>(
                <button key={g} style={chip(form.gender===g)} onClick={()=>update('gender',g)}>{g}</button>
              ))}
            </div>
          </div>
        </div>}

        {step===6 && <div style={{display:'flex',flexDirection:'column',gap:'24px'}}>
          <div style={{background:'rgba(99,102,241,0.1)',border:'1px solid rgba(99,102,241,0.3)',borderRadius:'12px',padding:'20px'}}>
            <p style={{margin:0,color:'#a78bfa',fontSize:'14px',lineHeight:1.7}}>We will send you a personalized salary report and notify you when salaries change for your role in {form.country||'your country'}.</p>
          </div>
          <div>
            <label style={lbl}>Your Email</label>
            <input style={inp} type="email" placeholder="you@example.com" value={form.email} onChange={e=>update('email',e.target.value)}/>
          </div>
          <p style={{fontSize:'12px',color:'#404050',margin:0}}>No spam. No password. Just useful salary insights.</p>
        </div>}

        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:'48px'}}>
          {step>1?<button onClick={()=>setStep(s=>s-1)} style={{background:'transparent',border:'1px solid #2a2a3e',color:'#a0a0b0',borderRadius:'10px',padding:'14px 28px',fontSize:'15px',cursor:'pointer',fontWeight:'500'}}>Back</button>:<div/>}
          {step<STEPS.length
            ?<button onClick={()=>canNext()&&setStep(s=>s+1)} style={{background:canNext()?'linear-gradient(135deg,#6366f1,#8b5cf6)':'#1e1e2e',color:canNext()?'#fff':'#404050',border:'none',borderRadius:'10px',padding:'14px 32px',fontSize:'15px',fontWeight:'700',cursor:canNext()?'pointer':'not-allowed'}}>Continue</button>
            :<button onClick={handleSubmit} style={{background:canNext()?'linear-gradient(135deg,#6366f1,#8b5cf6)':'#1e1e2e',color:canNext()?'#fff':'#404050',border:'none',borderRadius:'10px',padding:'14px 32px',fontSize:'15px',fontWeight:'700',cursor:canNext()?'pointer':'not-allowed'}}>Submit My Salary</button>}
        </div>
      </div>
    </div>
  );
}
