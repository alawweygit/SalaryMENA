'use client';
import { useState, useEffect } from 'react';
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
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [form, setForm] = useState({jobTitle:'',country:'',currency:'AED',currentSalary:'',offeredSalary:'',experience:'',companyType:'',nationalityType:'',housingProvided:false,carProvided:false});
  const update = (f,v) => setForm(p=>({...p,[f]:v}));

  const isGCC = GCC.includes(form.country);
  const nationalityOptions = isGCC
    ? (lang==='ar'?['مواطن خليجي','وافد عربي','وافد غربي','وافد آسيوي']:['GCC National','Arab Expat','Western Expat','Asian Expat'])
    : (lang==='ar'?['مواطن محلي','عربي (دولة أخرى)','وافد غربي','وافد آسيوي']:['Local National','Arab (Other)','Western Expat','Asian Expat']);

  const companyTypes = lang==='ar' ? ['خاص','حكومة'] : ['Private','Government'];
  const filteredCountries = COUNTRIES.filter(c=>c.toLowerCase().includes(countrySearch.toLowerCase()));

  useEffect(() => {
    const prefill = localStorage.getItem('coach_prefill');
    if (prefill) {
      const data = JSON.parse(prefill);
      localStorage.removeItem('coach_prefill');
      setForm(p=>({...p,...data}));
      setTimeout(() => { submitForm(data); }, 100);
    }
  }, []);

  const submitForm = async (data) => {
    setLoading(true);
    setResult(null);
    setEmailSent(false);
    try {
      const res = await fetch('/api/coach',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
      const json = await res.json();
      setProgress(100);
      setTimeout(()=>{setResult(json.text);setLoading(false);},400);
    } catch(e){setResult(lang==='ar'?'حدث خطأ. حاول مجدداً.':'Something went wrong. Please try again.');setLoading(false);}
  };

  useEffect(() => {
    if(!loading){setProgress(0);return;}
    setProgress(0);
    const timer = setInterval(()=>{
      setProgress(p => {
        if(p >= 95) return p;
        return p + 1;
      });
    }, 150);
    return ()=>clearInterval(timer);
  },[loading]);

  const inp = {width:'100%',background:'#13131f',border:'1px solid #2a2a3e',borderRadius:'10px',padding:'14px 16px',color:'#fff',fontSize:'15px',outline:'none',boxSizing:'border-box',appearance:'none',textAlign:isAr?'right':'left'};
  const lbl = {display:'block',fontSize:'13px',fontWeight:'600',color:'#a0a0b0',marginBottom:'8px',textTransform:'uppercase',letterSpacing:'0.5px'};
  const chip = (a) => ({padding:'10px 20px',borderRadius:'50px',fontSize:'14px',fontWeight:'500',cursor:'pointer',border:'none',background:a?'linear-gradient(135deg,#6366f1,#8b5cf6)':'#13131f',color:a?'#fff':'#606070',outline:a?'none':'1px solid #2a2a3e',transition:'all 0.2s'});
  const countryChip = (a) => ({padding:'8px 16px',borderRadius:'50px',fontSize:'13px',fontWeight:'500',cursor:'pointer',border:'none',background:a?'linear-gradient(135deg,#6366f1,#8b5cf6)':'#13131f',color:a?'#fff':'#606070',outline:a?'none':'1px solid #2a2a3e',whiteSpace:'nowrap'});
  const toggle = (a) => ({padding:'10px 20px',borderRadius:'50px',fontSize:'14px',fontWeight:'500',cursor:'pointer',border:'none',background:a?'linear-gradient(135deg,#10b981,#059669)':'#13131f',color:a?'#fff':'#606070',outline:a?'none':'1px solid #2a2a3e',transition:'all 0.2s'});

  const canSubmit = form.jobTitle && form.country && form.offeredSalary && form.experience && form.companyType && form.nationalityType;

  const analyze = async () => {
    setLoading(true);
    setResult(null);
    setEmailSent(false);
    try {
      const res = await fetch('/api/coach',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)});
      const data = await res.json();
      setProgress(100);
      setTimeout(()=>{setResult(data.text);setLoading(false);},400);
    } catch(e){setResult(lang==='ar'?'حدث خطأ. حاول مجدداً.':'Something went wrong. Please try again.');setLoading(false);}
  };

  const sendReport = async () => {
    if(!email) return;
    setSendingEmail(true);
    try {
      await fetch('/api/send-email',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
        email, jobTitle:form.jobTitle, country:form.country,
        monthlySalary:form.offeredSalary, currency:form.currency,
        type:'coach', result,
        nationalityType:form.nationalityType,
        housingProvided:form.housingProvided,
        carProvided:form.carProvided
      })});
      setEmailSent(true);
    } catch(e){}
    setSendingEmail(false);
  };

  const shareOnWhatsApp = () => {
    const benefits = [form.housingProvided&&'🏠 Housing',form.carProvided&&'🚗 Car'].filter(Boolean).join(' + ');
    const text = `I just got my salary negotiation script from SalaryMENA 🤖💼\n\nRole: ${form.jobTitle} in ${form.country}\nOffer: ${form.currency} ${Number(form.offeredSalary).toLocaleString()}/month${benefits?'\nBenefits: '+benefits:''}\n\nGet your FREE AI negotiation script at salarymena.com 👇`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`,'_blank');
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
      <style>{`
        input[type=number]::-webkit-outer-spin-button,input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}
        @keyframes fadeIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @media(max-width:768px){
          .coach-title{font-size:28px!important}
          .coach-salary-row{flex-direction:column!important;gap:12px!important}
        }
      `}</style>
      <Navbar/>

      <div style={{maxWidth:'700px',margin:'0 auto',padding:'40px 16px'}}>

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
            <div style={{textAlign:'center',marginBottom:'36px'}}>
              <div style={{display:'inline-block',background:'rgba(99,102,241,0.15)',border:'1px solid rgba(99,102,241,0.3)',borderRadius:'50px',padding:'6px 16px',fontSize:'13px',color:'#a78bfa',marginBottom:'16px',fontWeight:'500'}}>🤖 {txt.coach_badge}</div>
              <h1 className="coach-title" style={{fontSize:'40px',fontWeight:'900',marginBottom:'16px',background:'linear-gradient(135deg,#fff 0%,#a78bfa 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>{txt.coach_title}</h1>
              <p style={{color:'#606070',fontSize:'16px',lineHeight:1.7,maxWidth:'500px',margin:'0 auto'}}>{txt.coach_sub}</p>
            </div>

            <div style={{background:'#0d0d18',border:'1px solid #1e1e2e',borderRadius:'24px',padding:'24px',display:'flex',flexDirection:'column',gap:'20px'}}>

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

              <div>
                <label style={lbl}>{lang==='ar'?'المزايا العينية (اختياري)':'Benefits in Kind (Optional)'}</label>
                <div style={{display:'flex',gap:'12px',flexWrap:'wrap'}}>
                  <button style={toggle(form.housingProvided)} onClick={()=>update('housingProvided',!form.housingProvided)}>🏠 {lang==='ar'?'سكن مجاني':'Housing Provided'}</button>
                  <button style={toggle(form.carProvided)} onClick={()=>update('carProvided',!form.carProvided)}>🚗 {lang==='ar'?'سيارة مجانية':'Car Provided'}</button>
                </div>
              </div>

              <div className="coach-salary-row" style={{display:'flex',gap:'16px'}}>
                <div style={{flex:1}}><label style={lbl}>{txt.offered_salary}</label><input style={inp} type="number" placeholder="25000" value={form.offeredSalary} onChange={e=>update('offeredSalary',e.target.value)}/></div>
                <div style={{flex:1}}><label style={lbl}>{txt.current_salary} <span style={{color:'#404050',fontWeight:'400',textTransform:'none'}}>{txt.current_optional}</span></label><input style={inp} type="number" placeholder="18000" value={form.currentSalary} onChange={e=>update('currentSalary',e.target.value)}/></div>
              </div>

              <div><label style={lbl}>{txt.currency_label}</label>
              <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>
                {['AED','SAR','EGP','OMR','KWD','QAR','BHD','JOD','USD'].map(c=><button key={c} style={chip(form.currency===c)} onClick={()=>update('currency',c)}>{c}</button>)}
              </div></div>

              <button onClick={canSubmit?analyze:undefined}
                style={{background:canSubmit?'linear-gradient(135deg,#6366f1,#8b5cf6)':'#1e1e2e',color:canSubmit?'#fff':'#404050',border:'none',borderRadius:'12px',padding:'16px',fontSize:'16px',fontWeight:'700',cursor:canSubmit?'pointer':'not-allowed'}}>
                {txt.analyze_offer}
              </button>
            </div>
          </div>
        )}

        {!loading && result && (
          <div style={{animation:'fadeIn 0.4s ease'}}>
            <div style={{background:'#0d0d18',border:'1px solid #1e1e2e',borderRadius:'24px',padding:'24px',marginBottom:'14px'}}>
              <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'24px',paddingBottom:'20px',borderBottom:'1px solid #1e1e2e'}}>
                <div style={{width:'36px',height:'36px',borderRadius:'50%',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'16px',flexShrink:0}}>🤖</div>
                <div>
                  <p style={{margin:0,fontWeight:'700',fontSize:'15px'}}>{txt.coach_title}</p>
                  <p style={{margin:0,color:'#404050',fontSize:'12px'}}>{form.jobTitle} · {form.country} · {form.nationalityType}</p>
                </div>
              </div>
              <div>{formatResult(result)}</div>
            </div>

            {/* WhatsApp Share */}
            <button onClick={shareOnWhatsApp}
              style={{width:'100%',background:'#25D366',border:'none',borderRadius:'12px',padding:'14px',fontSize:'15px',fontWeight:'700',cursor:'pointer',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',marginBottom:'12px'}}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              {lang==='ar'?'شارك نتيجتك على واتساب':'Share My Result on WhatsApp'}
            </button>

            {/* Email report */}
            {!emailSent ? (
              <div style={{background:'#13131f',border:'1px solid #1e1e2e',borderRadius:'16px',padding:'20px',marginBottom:'12px'}}>
                <p style={{margin:'0 0 12px',fontSize:'14px',color:'#a0a0b0'}}>{lang==='ar'?'احفظ نصك التفاوضي — أرسله لبريدك':'Save your negotiation script — send it to your email'}</p>
                <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
                  <input type="email" placeholder="your@email.com" value={email} onChange={e=>setEmail(e.target.value)}
                    style={{flex:1,minWidth:'200px',background:'#0a0a0f',border:'1px solid #2a2a3e',borderRadius:'10px',padding:'12px 16px',color:'#fff',fontSize:'14px',outline:'none'}}/>
                  <button onClick={sendReport} disabled={!email||sendingEmail}
                    style={{background:email?'linear-gradient(135deg,#6366f1,#8b5cf6)':'#1e1e2e',color:email?'#fff':'#404050',border:'none',borderRadius:'10px',padding:'12px 20px',fontSize:'14px',fontWeight:'700',cursor:email?'pointer':'not-allowed',whiteSpace:'nowrap'}}>
                    {sendingEmail?'Sending...':lang==='ar'?'أرسل النص':'Send Script'}
                  </button>
                </div>
              </div>
            ) : (
              <div style={{background:'rgba(16,185,129,0.1)',border:'1px solid rgba(16,185,129,0.3)',borderRadius:'16px',padding:'16px',textAlign:'center',color:'#10b981',fontWeight:'600',marginBottom:'12px'}}>
                ✅ {lang==='ar'?'تم إرسال النص التفاوضي!':'Negotiation script sent!'}
              </div>
            )}

            <div style={{display:'flex',gap:'12px'}}>
              <button onClick={()=>{setResult(null);setForm({jobTitle:'',country:'',currency:'AED',currentSalary:'',offeredSalary:'',experience:'',companyType:'',nationalityType:'',housingProvided:false,carProvided:false});setCountrySearch('');setEmail('');setEmailSent(false);}}
                style={{flex:1,background:'transparent',border:'1px solid #2a2a3e',color:'#a0a0b0',borderRadius:'12px',padding:'14px',fontSize:'14px',cursor:'pointer',fontWeight:'500'}}>{txt.analyze_another}</button>
              <a href="/submit" style={{flex:1,display:'block',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',textDecoration:'none',borderRadius:'12px',padding:'14px',fontSize:'14px',fontWeight:'700',textAlign:'center'}}>{txt.submit_nav}</a>
            </div>
            <p style={{textAlign:'center',marginTop:'16px',fontSize:'12px',color:'#303040'}}>
              {isAr?'جرب أيضاً: ':'Also try: '}<a href="https://cvdropai.com" target="_blank" rel="noreferrer" style={{color:'#6366f1',textDecoration:'none'}}>CVDropAI</a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}