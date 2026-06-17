'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import { useLang } from '../components/LanguageContext';
import { t } from '../components/translations';

const COUNTRIES = ['UAE','Saudi Arabia','Egypt','Oman','Kuwait','Qatar','Bahrain','Jordan','Lebanon','Iraq','Syria','Yemen','Libya','Tunisia','Algeria','Morocco','Sudan','Somalia','Comoros','Djibouti','Mauritania','Palestine'];
const GCC = ['UAE','Saudi Arabia','Kuwait','Qatar','Bahrain','Oman'];

export default function Coach() {
  const { lang, isAr } = useLang();
  const txt = t[lang];
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [countrySearch, setCountrySearch] = useState('');
  const [form, setForm] = useState({jobTitle:'',country:'',currency:'AED',currentSalary:'',offeredSalary:'',experience:'',companyType:'',nationalityType:''});
  const update = (f,v) => setForm(p=>({...p,[f]:v}));

  const isGCC = GCC.includes(form.country);
  const nationalityOptions = isGCC
    ? (lang==='ar'?['مواطن خليجي','وافد عربي','وافد غربي','وافد آسيوي']:['GCC National','Arab Expat','Western Expat','Asian Expat'])
    : (lang==='ar'?['مواطن محلي','عربي (دولة أخرى)','وافد غربي','وافد آسيوي']:['Local National','Arab (Other)','Western Expat','Asian Expat']);

  const companyTypes = lang==='ar'
    ? ['خاص','حكومة']
    : ['Private','Government'];

  const filteredCountries = COUNTRIES.filter(c=>c.toLowerCase().includes(countrySearch.toLowerCase()));

  // Auto-fill and auto-submit if coming from underpaid page
  useEffect(() => {
    const prefill = localStorage.getItem('coach_prefill');
    if (prefill) {
      const data = JSON.parse(prefill);
      localStorage.removeItem('coach_prefill');
      setForm(p=>({...p,...data}));
      // Auto-submit after form is set
      setTimeout(() => {
        submitForm(data);
      }, 100);
    }
  }, []);

  const submitForm = async (data) => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/coach',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
      const json = await res.json();
      setProgress(100);
      setTimeout(()=>{setResult(json.text);setLoading(false);},400);
    } catch(e){setResult(lang==='ar'?'حدث خطأ. حاول مجدداً.':'Something went wrong. Please try again.');setLoading(false);}
  };

  useEffect(() => {
    if(!loading){setProgress(0);return;}
    setProgress(5);
    const intervals = [
      setTimeout(()=>setProgress(25),800),
      setTimeout(()=>setProgress(50),2500),
      setTimeout(()=>setProgress(70),4500),
      setTimeout(()=>setProgress(85),6500),
      setTimeout(()=>setProgress(93),8500),
    ];
    return ()=>intervals.forEach(clearTimeout);
  },[loading]);

  const inp = {width:'100%',background:'#13131f',border:'1px solid #2a2a3e',borderRadius:'10px',padding:'14px 16px',color:'#fff',fontSize:'15px',outline:'none',boxSizing:'border-box',appearance:'none',textAlign:isAr?'right':'left'};
  const lbl = {display:'block',fontSize:'13px',fontWeight:'600',color:'#a0a0b0',marginBottom:'8px',textTransform:'uppercase',letterSpacing:'0.5px'};
  const chip = (a) => ({padding:'10px 20px',borderRadius:'50px',fontSize:'14px',fontWeight:'500',cursor:'pointer',border:'none',background:a?'linear-gradient(135deg,#6366f1,#8b5cf6)':'#13131f',color:a?'#fff':'#606070',outline:a?'none':'1px solid #2a2a3e',transition:'all 0.2s'});
  const countryChip = (a) => ({padding:'8px 16px',borderRadius:'50px',fontSize:'13px',fontWeight:'500',cursor:'pointer',border:'none',background:a?'linear-gradient(135deg,#6366f1,#8b5cf6)':'#13131f',color:a?'#fff':'#606070',outline:a?'none':'1px solid #2a2a3e',whiteSpace:'nowrap'});

  const canSubmit = form.jobTitle && form.country && form.offeredSalary && form.experience && form.companyType && form.nationalityType;

  const analyze = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/coach',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)});
      const data = await res.json();
      setProgress(100);
      setTimeout(()=>{setResult(data.text);setLoading(false);},400);
    } catch(e){setResult(lang==='ar'?'حدث خطأ. حاول مجدداً.':'Something went wrong. Please try again.');setLoading(false);}
  };

  const formatResult = (text) => {
    const sections = ['VERDICT','MARKET ASSESSMENT','YOUR NEGOTIATION SCRIPT','3 TALKING POINTS','RECOMMENDED COUNTER OFFER'];
    const lines = text.split('\n');
    return lines.map((line,i)=>{
      if(sections.includes(line.trim())) return <div key={i} style={{fontSize:'11px',fontWeight:'800',color:'#6366f1',textTransform:'uppercase',letterSpacing:'1.5px',marginTop:'28px',marginBottom:'8px'}}>{line.trim()}</div>;
      if(!line.trim()) return <div key={i} style={{height:'8px'}}/>;
      return <p key={i} style={{color:'#c0c0d0',fontSize:'15px',lineHeight:1.8,margin:'0 0 4px'}}>{line}</p>;
    });
  };

  return (
    <div style={{fontFamily:'Inter,sans-serif',background:'#0a0a0f',minHeight:'100vh',color:'#fff'}}>
      <style>{`input[type=number]::-webkit-outer-spin-button,input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}@keyframes fadeIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <Navbar/>

      <div style={{maxWidth:'700px',margin:'0 auto',padding:'60px 24px'}}>

        {loading && (
          <div style={{textAlign:'center',padding:'80px 24px',animation:'fadeIn 0.3s ease'}}>
            <div style={{position:'relative',width:'140px',height:'140px',margin:'0 auto 32px'}}>
              <svg width="140" height="140" style={{transform:'rotate(-90deg)'}}>
                <circle cx="70" cy="70" r="60" fill="none" stroke="#1e1e2e" strokeWidth="10"/>
                <circle cx="70" cy="70" r="60" fill="none" stroke="url(#grad)" strokeWidth="10"
                  strokeDasharray={`${2*Math.PI*60}`}
                  strokeDashoffset={`${2*Math.PI*60*(1-progress/100)}`}
                  strokeLinecap="round" style={{transition:'stroke-dashoffset 0.5s ease'}}/>
                <defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#6366f1"/><stop offset="100%" stopColor="#8b5cf6"/></linearGradient></defs>
              </svg>
              <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
                <div style={{fontSize:'28px',fontWeight:'900'}}>{progress}%</div>
              </div>
            </div>
            <h3 style={{fontSize:'22px',fontWeight:'700',marginBottom:'12px'}}>{txt.building_script}</h3>
            <p style={{color:'#606070',fontSize:'15px'}}>
              {progress<30?txt.loading_coach_1:progress<60?txt.loading_coach_2:progress<85?txt.loading_coach_3:txt.loading_coach_4}
            </p>
          </div>
        )}

        {!loading && !result && (
          <div style={{animation:'fadeIn 0.3s ease'}}>
            <div style={{textAlign:'center',marginBottom:'48px'}}>
              <div style={{display:'inline-block',background:'rgba(99,102,241,0.15)',border:'1px solid rgba(99,102,241,0.3)',borderRadius:'50px',padding:'6px 16px',fontSize:'13px',color:'#a78bfa',marginBottom:'20px',fontWeight:'500'}}>🤖 {txt.coach_badge}</div>
              <h1 style={{fontSize:'40px',fontWeight:'900',marginBottom:'16px',background:'linear-gradient(135deg,#fff 0%,#a78bfa 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>{txt.coach_title}</h1>
              <p style={{color:'#606070',fontSize:'17px',lineHeight:1.7,maxWidth:'500px',margin:'0 auto'}}>{txt.coach_sub}</p>
            </div>

            <div style={{background:'#0d0d18',border:'1px solid #1e1e2e',borderRadius:'24px',padding:'40px',display:'flex',flexDirection:'column',gap:'24px'}}>

              <div><label style={lbl}>{txt.job_title_label}</label><input style={inp} placeholder={txt.job_title_placeholder} value={form.jobTitle} onChange={e=>update('jobTitle',e.target.value)}/></div>

              <div>
                <label style={lbl}>{txt.country_work}</label>
                <input style={{...inp,marginBottom:'12px'}} placeholder={txt.country_search} value={countrySearch} onChange={e=>setCountrySearch(e.target.value)}/>
                <div style={{display:'flex',flexWrap:'wrap',gap:'8px',maxHeight:'160px',overflowY:'auto',padding:'4px 0'}}>
                  {filteredCountries.map(c=><button key={c} style={countryChip(form.country===c)} onClick={()=>{update('country',c);update('nationalityType','');}}>{c}</button>)}
                </div>
                {form.country && <div style={{marginTop:'10px',padding:'8px 14px',background:'rgba(99,102,241,0.1)',border:'1px solid rgba(99,102,241,0.3)',borderRadius:'8px',fontSize:'13px',color:'#a78bfa'}}>✓ {form.country}</div>}
              </div>

              {form.country && (
                <div><label style={lbl}>{txt.local_or_expat}</label>
                <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>
                  {nationalityOptions.map(n=><button key={n} style={chip(form.nationalityType===n)} onClick={()=>update('nationalityType',n)}>{n}</button>)}
                </div></div>
              )}

              <div><label style={lbl}>{txt.company_type_label}</label>
              <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>
                {companyTypes.map(tp=><button key={tp} style={chip(form.companyType===tp)} onClick={()=>update('companyType',tp)}>{tp}</button>)}
              </div></div>

              <div><label style={lbl}>{txt.experience_label}</label>
              <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>
                {['0-1','1-3','3-5','5-8','8-12','12+'].map(y=><button key={y} style={chip(form.experience===y)} onClick={()=>update('experience',y)}>{y} {lang==='ar'?'سنوات':'yrs'}</button>)}
              </div></div>

              <div style={{display:'flex',gap:'16px'}}>
                <div style={{flex:1}}><label style={lbl}>{txt.offered_salary}</label><input style={inp} type="number" placeholder="25000" value={form.offeredSalary} onChange={e=>update('offeredSalary',e.target.value)}/></div>
                <div style={{flex:1}}><label style={lbl}>{txt.current_salary} <span style={{color:'#404050',fontWeight:'400',textTransform:'none'}}>{txt.current_optional}</span></label><input style={inp} type="number" placeholder="18000" value={form.currentSalary} onChange={e=>update('currentSalary',e.target.value)}/></div>
              </div>

              <button onClick={canSubmit?analyze:undefined}
                style={{background:canSubmit?'linear-gradient(135deg,#6366f1,#8b5cf6)':'#1e1e2e',color:canSubmit?'#fff':'#404050',border:'none',borderRadius:'12px',padding:'16px',fontSize:'16px',fontWeight:'700',cursor:canSubmit?'pointer':'not-allowed'}}>
                {txt.analyze_offer}
              </button>
            </div>
          </div>
        )}

        {!loading && result && (
          <div style={{animation:'fadeIn 0.4s ease'}}>
            <div style={{background:'#0d0d18',border:'1px solid #1e1e2e',borderRadius:'24px',padding:'40px',marginBottom:'16px'}}>
              <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'24px',paddingBottom:'24px',borderBottom:'1px solid #1e1e2e'}}>
                <div style={{width:'40px',height:'40px',borderRadius:'50%',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'18px',flexShrink:0}}>🤖</div>
                <div>
                  <p style={{margin:0,fontWeight:'700',fontSize:'15px'}}>{txt.coach_title}</p>
                  <p style={{margin:0,color:'#404050',fontSize:'13px'}}>{form.jobTitle} · {form.country} · {form.nationalityType}</p>
                </div>
              </div>
              <div>{formatResult(result)}</div>
            </div>
            <div style={{display:'flex',gap:'12px'}}>
              <button onClick={()=>{setResult(null);setForm({jobTitle:'',country:'',currency:'AED',currentSalary:'',offeredSalary:'',experience:'',companyType:'',nationalityType:''});setCountrySearch('');}}
                style={{flex:1,background:'transparent',border:'1px solid #2a2a3e',color:'#a0a0b0',borderRadius:'12px',padding:'14px',fontSize:'14px',cursor:'pointer',fontWeight:'500'}}>{txt.analyze_another}</button>
              <a href="/submit" style={{flex:1,display:'block',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',textDecoration:'none',borderRadius:'12px',padding:'14px',fontSize:'14px',fontWeight:'700',textAlign:'center'}}>{txt.submit_nav}</a>
            </div>
            <p style={{textAlign:'center',marginTop:'20px',fontSize:'12px',color:'#303040'}}>
              {isAr?'جرب أيضاً: ':'Also try: '}<a href="https://cvdropai.com" target="_blank" rel="noreferrer" style={{color:'#6366f1',textDecoration:'none'}}>CVDropAI</a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}