'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import { useLang } from '../components/LanguageContext';
import { t } from '../components/translations';

const COUNTRIES_EN = ['UAE','Saudi Arabia','Egypt','Oman','Kuwait','Qatar','Bahrain','Jordan','Lebanon','Iraq','Syria','Yemen','Libya','Tunisia','Algeria','Morocco','Sudan','Somalia','Comoros','Djibouti','Mauritania','Palestine'];
const COUNTRIES_AR = ['الإمارات','السعودية','مصر','عُمان','الكويت','قطر','البحرين','الأردن','لبنان','العراق','سوريا','اليمن','ليبيا','تونس','الجزائر','المغرب','السودان','الصومال','جزر القمر','جيبوتي','موريتانيا','فلسطين'];
const GCC_EN = ['UAE','Saudi Arabia','Kuwait','Qatar','Bahrain','Oman'];
const GCC_AR = ['الإمارات','السعودية','الكويت','قطر','البحرين','عُمان'];

const CURRENCY_AR = {
  'AED':'درهم إماراتي','SAR':'ريال سعودي','EGP':'جنيه مصري',
  'OMR':'ريال عماني','KWD':'دينار كويتي','QAR':'ريال قطري',
  'BHD':'دينار بحريني','JOD':'دينار أردني','USD':'دولار أمريكي'
};

const CURRENCIES_EN = ['AED','SAR','EGP','OMR','KWD','QAR','BHD','JOD','USD'];

export default function Underpaid() {
  const { lang, isAr } = useLang();
  const txt = t[lang];
  const router = useRouter();
  const [form, setForm] = useState({jobTitle:'',country:'',countryEN:'',currency:'AED',monthlySalary:'',experience:'',companyType:'',nationalityType:'',housingProvided:false,carProvided:false});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [countrySearch, setCountrySearch] = useState('');
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const update = (f,v) => setForm(p=>({...p,[f]:v}));

  const COUNTRIES = lang==='ar' ? COUNTRIES_AR : COUNTRIES_EN;
  const isGCC = GCC_EN.includes(form.countryEN) || GCC_AR.includes(form.country);

  const nationalityOptions = isGCC
    ? (lang==='ar'?['مواطن خليجي','وافد عربي','وافد غربي','وافد آسيوي']:['GCC National','Arab Expat','Western Expat','Asian Expat'])
    : (lang==='ar'?['مواطن محلي','عربي (دولة أخرى)','وافد غربي','وافد آسيوي']:['Local National','Arab (Other)','Western Expat','Asian Expat']);

  const companyTypes = lang==='ar' ? ['خاص','حكومة'] : ['Private','Government'];

  const selectCountry = (countryLabel) => {
    if (lang==='ar') {
      const idx = COUNTRIES_AR.indexOf(countryLabel);
      const en = idx >= 0 ? COUNTRIES_EN[idx] : countryLabel;
      update('country', countryLabel);
      update('countryEN', en);
    } else {
      update('country', countryLabel);
      update('countryEN', countryLabel);
    }
    update('nationalityType','');
  };

  useEffect(() => {
    if(!loading){setProgress(0);return;}
    setProgress(0);
    const timer = setInterval(()=>{
      setProgress(p => { if(p >= 95) return p; return p + 1; });
    }, 150);
    return ()=>clearInterval(timer);
  },[loading]);

  const inp = {width:'100%',background:'#13131f',border:'1px solid #2a2a3e',borderRadius:'10px',padding:'14px 16px',color:'#fff',fontSize:'16px',outline:'none',boxSizing:'border-box',textAlign:isAr?'right':'left'};
  const lbl = {display:'block',fontSize:'13px',fontWeight:'600',color:'#a0a0b0',marginBottom:'8px',textTransform:'uppercase',letterSpacing:'0.5px'};
  const chip = (a) => ({padding:'10px 20px',borderRadius:'50px',fontSize:'14px',fontWeight:'500',cursor:'pointer',border:'none',background:a?'linear-gradient(135deg,#6366f1,#8b5cf6)':'#13131f',color:a?'#fff':'#606070',outline:a?'none':'1px solid #2a2a3e',transition:'all 0.2s'});
  const countryChip = (a) => ({padding:'8px 16px',borderRadius:'50px',fontSize:'13px',fontWeight:'500',cursor:'pointer',border:'none',background:a?'linear-gradient(135deg,#6366f1,#8b5cf6)':'#13131f',color:a?'#fff':'#606070',outline:a?'none':'1px solid #2a2a3e',whiteSpace:'nowrap'});
  const toggle = (a) => ({padding:'10px 20px',borderRadius:'50px',fontSize:'14px',fontWeight:'500',cursor:'pointer',border:'none',background:a?'linear-gradient(135deg,#10b981,#059669)':'#13131f',color:a?'#fff':'#606070',outline:a?'none':'1px solid #2a2a3e',transition:'all 0.2s'});

  const canAnalyze = form.jobTitle && form.country && form.monthlySalary && form.experience && form.companyType && form.nationalityType;
  const filteredCountries = COUNTRIES.filter(c=>c.toLowerCase().includes(countrySearch.toLowerCase()));
  const fmt = (n) => Math.round(n).toLocaleString();
  const experiences = ['0-1','1-3','3-5','5-8','8-12','12+'];

  const getAPICountry = () => form.countryEN || form.country;
  const getAPICompany = () => {
    if (form.companyType === 'خاص') return 'Private';
    if (form.companyType === 'حكومة') return 'Government';
    return form.companyType;
  };

  const analyze = async () => {
    setLoading(true);
    setResult(null);
    setEmailSent(false);
    try {
      const payload = {
        ...form,
        country: getAPICountry(),
        companyType: getAPICompany(),
        lang,
      };
      const res = await fetch('/api/underpaid',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      const json = await res.json();
      setProgress(100);
      setTimeout(()=>{
        if(json.success) setResult(json.data);
        else setResult({error:true});
        setLoading(false);
      },400);
    } catch(e){setResult({error:true});setLoading(false);}
  };

  const sendReport = async () => {
    if(!email) return;
    setSendingEmail(true);
    try {
      await fetch('/api/send-email',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
        email, jobTitle:form.jobTitle, country:getAPICountry(),
        monthlySalary:form.monthlySalary, currency:form.currency,
        type:'underpaid', result,
        nationalityType:form.nationalityType,
        housingProvided:form.housingProvided,
        carProvided:form.carProvided
      })});
      setEmailSent(true);
    } catch(e){}
    setSendingEmail(false);
  };

  const goToCoach = () => {
    localStorage.setItem('coach_prefill', JSON.stringify({
      jobTitle:form.jobTitle, country:getAPICountry(), nationalityType:form.nationalityType,
      companyType:getAPICompany(), experience:form.experience, currency:form.currency,
      offeredSalary:form.monthlySalary, housingProvided:form.housingProvided, carProvided:form.carProvided
    }));
    router.push('/coach');
  };

  const getGaugeRotation = (low,high,userSalary) => {
    if(high===low) return 0;
    const pct = Math.min(Math.max((Number(userSalary)-Number(low))/(Number(high)-Number(low)),0),1);
    return -120+(pct*240);
  };

  const shareOnWhatsApp = () => {
    const verdict = result.verdict==='Below Market'?'أقل من السوق 📉':result.verdict==='Above Market'?'أعلى من السوق 🚀':'عادل ✅';
    const benefits = [form.housingProvided&&'🏠',form.carProvided&&'🚗'].filter(Boolean).join(' ');
    const text = `فحصت راتبي على SalaryMENA 📊\n\nالوظيفة: ${form.jobTitle} في ${form.country}\nراتبي: ${displayCurrency(form.currency)} ${Number(form.monthlySalary).toLocaleString()} شهرياً${benefits?' '+benefits:''}\nالنتيجة: ${verdict}\n\nتحقق من راتبك على salarymena.com 👇`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`,'_blank');
  };

  const displayCurrency = (code) => lang==='ar' && CURRENCY_AR[code] ? CURRENCY_AR[code] : code;

  const verdictLabel = result ? (
    result.verdict==='Below Market' ? txt.below_market :
    result.verdict==='Above Market' ? txt.above_market : txt.fair
  ) : '';

  return (
    <div style={{fontFamily:'Inter,sans-serif',background:'#0a0a0f',minHeight:'100vh',color:'#fff'}}>
      <style>{`
        input[type=number]::-webkit-outer-spin-button,input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}
        @keyframes fadeIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @media(max-width:768px){
          .underpaid-title{font-size:28px!important}
          .verdict-title{font-size:28px!important}
          .cards-grid{grid-template-columns:repeat(3,1fr)!important}
          .result-salary{font-size:24px!important}
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
                  strokeLinecap="round" style={{transition:'stroke-dashoffset 0.3s ease'}}/>
                <defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#6366f1"/><stop offset="100%" stopColor="#8b5cf6"/></linearGradient></defs>
              </svg>
              <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
                <div style={{fontSize:'28px',fontWeight:'900'}}>{progress}%</div>
              </div>
            </div>
            <h3 style={{fontSize:'22px',fontWeight:'700',marginBottom:'12px'}}>{txt.loading_underpaid}</h3>
            <p style={{color:'#606070',fontSize:'15px'}}>
              {progress<30?txt.loading_1:progress<60?txt.loading_2:progress<85?txt.loading_3:txt.loading_4}
            </p>
          </div>
        )}

        {!loading && !result && (
          <div style={{animation:'fadeIn 0.3s ease'}}>
            <div style={{textAlign:'center',marginBottom:'36px'}}>
              <div style={{display:'inline-block',background:'rgba(99,102,241,0.15)',border:'1px solid rgba(99,102,241,0.3)',borderRadius:'50px',padding:'6px 16px',fontSize:'13px',color:'#a78bfa',marginBottom:'16px',fontWeight:'500'}}>📊 {txt.underpaid_badge}</div>
              <h1 className="underpaid-title" style={{fontSize:'40px',fontWeight:'900',marginBottom:'16px',background:'linear-gradient(135deg,#fff 0%,#a78bfa 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>{txt.underpaid_title}</h1>
              <p style={{color:'#606070',fontSize:'16px',lineHeight:1.7}}>{txt.underpaid_sub}</p>
            </div>

            <div style={{background:'#0d0d18',border:'1px solid #1e1e2e',borderRadius:'24px',padding:'24px',display:'flex',flexDirection:'column',gap:'20px'}}>
              <div><label style={lbl}>{txt.job_title_label}</label><input style={inp} placeholder={txt.job_title_placeholder} value={form.jobTitle} onChange={e=>update('jobTitle',e.target.value)}/></div>

              <div>
                <label style={lbl}>{txt.country_work}</label>
                <input style={{...inp,marginBottom:'12px',fontSize:'16px'}} placeholder={txt.country_search} value={countrySearch} onChange={e=>setCountrySearch(e.target.value)}/>
                <div style={{display:'flex',flexWrap:'wrap',gap:'8px',maxHeight:'160px',overflowY:'auto',padding:'4px 0'}}>
                  {filteredCountries.map(c=><button key={c} style={countryChip(form.country===c)} onClick={()=>selectCountry(c)}>{c}</button>)}
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
                {experiences.map(y=><button key={y} style={chip(form.experience===y)} onClick={()=>update('experience',y)}>{y} {lang==='ar'?'سنوات':'yrs'}</button>)}
              </div></div>

              <div><label style={lbl}>{txt.currency_label}</label>
              <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>
                {CURRENCIES_EN.map(c=>(
                  <button key={c} style={chip(form.currency===c)} onClick={()=>update('currency',c)}>
                    {lang==='ar' ? CURRENCY_AR[c] : c}
                  </button>
                ))}
              </div></div>

              <div><label style={lbl}>{txt.current_monthly}</label><input style={inp} type="number" placeholder="25000" value={form.monthlySalary} onChange={e=>update('monthlySalary',e.target.value)}/></div>

              <div>
                <label style={lbl}>{lang==='ar'?'المزايا العينية (اختياري)':'Benefits in Kind (Optional)'}</label>
                <div style={{display:'flex',gap:'12px',flexWrap:'wrap'}}>
                  <button style={toggle(form.housingProvided)} onClick={()=>update('housingProvided',!form.housingProvided)}>🏠 {lang==='ar'?'سكن مجاني':'Housing Provided'}</button>
                  <button style={toggle(form.carProvided)} onClick={()=>update('carProvided',!form.carProvided)}>🚗 {lang==='ar'?'سيارة مجانية':'Car Provided'}</button>
                </div>
              </div>

              <button onClick={canAnalyze?analyze:undefined}
                style={{background:canAnalyze?'linear-gradient(135deg,#6366f1,#8b5cf6)':'#1e1e2e',color:canAnalyze?'#fff':'#404050',border:'none',borderRadius:'12px',padding:'16px',fontSize:'16px',fontWeight:'700',cursor:canAnalyze?'pointer':'not-allowed'}}>
                {txt.analyze_salary}
              </button>
            </div>
          </div>
        )}

        {!loading && result && !result.error && (
          <div style={{display:'flex',flexDirection:'column',gap:'14px',animation:'fadeIn 0.4s ease'}}>

            <div style={{background:`linear-gradient(135deg,${result.verdictColor}25,${result.verdictColor}08)`,border:`1px solid ${result.verdictColor}50`,borderRadius:'24px',padding:'36px',textAlign:'center'}}>
              <div style={{fontSize:'13px',color:result.verdictColor,fontWeight:'700',textTransform:'uppercase',letterSpacing:'2px',marginBottom:'12px'}}>{txt.market_verdict}</div>
              <div className="verdict-title" style={{fontSize:'36px',fontWeight:'900',color:'#fff',marginBottom:'4px'}}>
                {result.verdict==='Below Market'?'⚠️ ':result.verdict==='Above Market'?'🚀 ':'✅ '}{verdictLabel}
              </div>
              <div style={{fontSize:'15px',color:'#606070',marginTop:'8px'}}>{form.jobTitle} · {form.country} · {form.nationalityType}</div>
              {(form.housingProvided||form.carProvided) && (
                <div style={{marginTop:'10px',fontSize:'13px',color:'#10b981'}}>
                  {[form.housingProvided&&'🏠',form.carProvided&&'🚗'].filter(Boolean).join(' ')} {lang==='ar'?'مشمول':'included'}
                </div>
              )}
            </div>

            <div style={{background:'#13131f',border:'1px solid #1e1e2e',borderRadius:'20px',padding:'32px',textAlign:'center'}}>
              <div style={{fontWeight:'700',fontSize:'15px',marginBottom:'24px'}}>{txt.salary_gauge}</div>
              <div style={{position:'relative',width:'240px',height:'140px',margin:'0 auto'}}>
                <svg width="240" height="140" viewBox="0 0 240 140">
                  <defs><linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#ef4444"/><stop offset="50%" stopColor="#f59e0b"/><stop offset="100%" stopColor="#10b981"/></linearGradient></defs>
                  <path d="M 20 130 A 100 100 0 0 1 220 130" fill="none" stroke="#1e1e2e" strokeWidth="20" strokeLinecap="round"/>
                  <path d="M 20 130 A 100 100 0 0 1 220 130" fill="none" stroke="url(#gaugeGrad)" strokeWidth="20" strokeLinecap="round"/>
                  {(()=>{
                    const rot = getGaugeRotation(result.marketLow,result.marketHigh,Number(form.monthlySalary));
                    const rad=(rot*Math.PI)/180;
                    const x=120+85*Math.cos(rad);
                    const y=130+85*Math.sin(rad);
                    return(<><line x1="120" y1="130" x2={x} y2={y} stroke="#fff" strokeWidth="3" strokeLinecap="round"/><circle cx="120" cy="130" r="8" fill={result.verdictColor}/><circle cx={x} cy={y} r="6" fill="#fff" stroke={result.verdictColor} strokeWidth="3"/></>);
                  })()}
                  <text x="8" y="155" fill="#606070" fontSize="11" fontWeight="600">{lang==='ar'?'أدنى':'LOW'}</text>
                  <text x="105" y="108" fill="#606070" fontSize="11" fontWeight="600">{lang==='ar'?'وسط':'MID'}</text>
                  <text x="200" y="155" fill="#606070" fontSize="11" fontWeight="600">{lang==='ar'?'أعلى':'HIGH'}</text>
                </svg>
                <div style={{marginTop:'12px'}}>
                  <div className="result-salary" style={{fontSize:'28px',fontWeight:'900',color:result.verdictColor}}>{displayCurrency(form.currency)} {fmt(form.monthlySalary)}</div>
                  <div style={{color:'#606070',fontSize:'12px',marginTop:'4px'}}>{txt.per_month}</div>
                </div>
              </div>
            </div>

            <div className="cards-grid" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'10px'}}>
              {[
                {label:txt.market_low,value:result.marketLow,color:'#ef4444',icon:'📉'},
                {label:txt.median,value:result.marketMedian,color:'#6366f1',icon:'⚖️'},
                {label:txt.market_high,value:result.marketHigh,color:'#10b981',icon:'📈'},
              ].map((card,i)=>{
                const diff=Number(form.monthlySalary)-card.value;
                return(
                  <div key={i} style={{background:'#13131f',border:`1px solid ${card.color}30`,borderRadius:'16px',padding:'16px',textAlign:'center'}}>
                    <div style={{fontSize:'20px',marginBottom:'6px'}}>{card.icon}</div>
                    <div style={{fontSize:'10px',color:'#404050',fontWeight:'700',textTransform:'uppercase',marginBottom:'4px'}}>{card.label}</div>
                    <div style={{fontSize:'14px',fontWeight:'800',color:card.color}}>{displayCurrency(form.currency)} {fmt(card.value)}</div>
                    <div style={{fontSize:'11px',marginTop:'4px',color:diff>=0?'#10b981':'#ef4444',fontWeight:'600'}}>{diff>=0?'+':''}{displayCurrency(form.currency)} {fmt(Math.abs(diff))}</div>
                  </div>
                );
              })}
            </div>

            <div style={{background:'#13131f',border:'1px solid #1e1e2e',borderRadius:'20px',padding:'24px'}}>
              <div style={{fontWeight:'700',fontSize:'15px',marginBottom:'20px'}}>{txt.monthly_comparison}</div>
              {[
                {label:txt.your_salary,value:Number(form.monthlySalary),color:result.verdictColor,isUser:true},
                {label:txt.market_low,value:result.marketLow,color:'#ef4444'},
                {label:txt.median,value:result.marketMedian,color:'#6366f1'},
                {label:txt.market_high,value:result.marketHigh,color:'#10b981'},
              ].map((item,i)=>(
                <div key={i} style={{marginBottom:'14px'}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:'6px'}}>
                    <span style={{fontSize:'13px',color:item.isUser?result.verdictColor:'#a0a0b0',fontWeight:item.isUser?'700':'400'}}>{item.label}{item.isUser?' ★':''}</span>
                    <span style={{fontSize:'13px',color:item.isUser?result.verdictColor:'#fff',fontWeight:'700'}}>{displayCurrency(form.currency)} {fmt(item.value)}</span>
                  </div>
                  <div style={{height:'10px',background:'#0a0a0f',borderRadius:'50px',overflow:'hidden',border:'1px solid #1e1e2e'}}>
                    <div style={{height:'100%',width:`${(item.value/result.marketHigh)*100}%`,background:item.color,borderRadius:'50px',transition:'width 1s ease'}}/>
                  </div>
                </div>
              ))}
            </div>

            <div style={{background:'linear-gradient(135deg,rgba(99,102,241,0.12),rgba(139,92,246,0.06))',border:'1px solid rgba(99,102,241,0.25)',borderRadius:'20px',padding:'24px'}}>
              <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'12px'}}>
                <div style={{width:'36px',height:'36px',borderRadius:'50%',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'16px',flexShrink:0}}>🤖</div>
                <div style={{fontWeight:'700',fontSize:'15px'}}>{txt.ai_analysis}</div>
              </div>
              <p style={{color:'#c0c0d0',fontSize:'15px',lineHeight:1.8,margin:'0 0 10px'}}>{result.summary}</p>
              <p style={{color:'#a78bfa',fontSize:'14px',lineHeight:1.7,margin:0,fontStyle:'italic'}}>{result.advice}</p>
            </div>

            <button onClick={shareOnWhatsApp}
              style={{background:'#25D366',border:'none',borderRadius:'12px',padding:'14px',fontSize:'15px',fontWeight:'700',cursor:'pointer',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px'}}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              {lang==='ar'?'شارك نتيجتك على واتساب':'Share My Result on WhatsApp'}
            </button>

            {!emailSent ? (
              <div style={{background:'#13131f',border:'1px solid #1e1e2e',borderRadius:'16px',padding:'20px'}}>
                <p style={{margin:'0 0 12px',fontSize:'14px',color:'#a0a0b0'}}>{lang==='ar'?'احفظ تقريرك — أرسله لبريدك الإلكتروني':'Save this report — send it to your email'}</p>
                <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
                  <input type="email" placeholder="your@email.com" value={email} onChange={e=>setEmail(e.target.value)}
                    style={{flex:1,minWidth:'200px',background:'#0a0a0f',border:'1px solid #2a2a3e',borderRadius:'10px',padding:'12px 16px',color:'#fff',fontSize:'14px',outline:'none'}}/>
                  <button onClick={sendReport} disabled={!email||sendingEmail}
                    style={{background:email?'linear-gradient(135deg,#6366f1,#8b5cf6)':'#1e1e2e',color:email?'#fff':'#404050',border:'none',borderRadius:'10px',padding:'12px 20px',fontSize:'14px',fontWeight:'700',cursor:email?'pointer':'not-allowed',whiteSpace:'nowrap'}}>
                    {sendingEmail?'...':lang==='ar'?'أرسل التقرير':'Send Report'}
                  </button>
                </div>
              </div>
            ) : (
              <div style={{background:'rgba(16,185,129,0.1)',border:'1px solid rgba(16,185,129,0.3)',borderRadius:'16px',padding:'16px',textAlign:'center',color:'#10b981',fontWeight:'600'}}>
                ✅ {lang==='ar'?'تم إرسال التقرير!':'Report sent!'}
              </div>
            )}

            {result.verdict==='Below Market' && (
              <div style={{background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.25)',borderRadius:'20px',padding:'24px',textAlign:'center'}}>
                <h3 style={{fontSize:'18px',fontWeight:'800',marginBottom:'8px'}}>{txt.negotiate_title}</h3>
                <p style={{color:'#a0a0b0',fontSize:'14px',marginBottom:'16px'}}>{txt.negotiate_sub}</p>
                <button onClick={goToCoach} style={{display:'inline-block',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',textDecoration:'none',borderRadius:'10px',padding:'12px 24px',fontWeight:'700',fontSize:'14px',border:'none',cursor:'pointer'}}>{txt.negotiate_btn}</button>
              </div>
            )}

            {result.verdict!=='Below Market' && (
              <div style={{background:'rgba(16,185,129,0.08)',border:'1px solid rgba(16,185,129,0.25)',borderRadius:'20px',padding:'24px',textAlign:'center'}}>
                <h3 style={{fontSize:'18px',fontWeight:'800',marginBottom:'8px'}}>{txt.well_paid_title}</h3>
                <p style={{color:'#a0a0b0',fontSize:'14px',marginBottom:'16px'}}>{txt.well_paid_sub}</p>
                <a href="/submit" style={{display:'inline-block',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',textDecoration:'none',borderRadius:'10px',padding:'12px 24px',fontWeight:'700',fontSize:'14px'}}>{txt.submit_nav}</a>
              </div>
            )}

            <button onClick={()=>{setResult(null);setCountrySearch('');setEmail('');setEmailSent(false);}}
              style={{background:'transparent',border:'1px solid #2a2a3e',color:'#a0a0b0',borderRadius:'12px',padding:'14px',fontSize:'14px',cursor:'pointer',fontWeight:'500'}}>
              {txt.check_another}
            </button>
          </div>
        )}

        {!loading && result && result.error && (
          <div style={{textAlign:'center',padding:'60px',background:'#13131f',borderRadius:'24px'}}>
            <div style={{fontSize:'48px',marginBottom:'16px'}}>❌</div>
            <h3 style={{marginBottom:'8px'}}>{lang==='ar'?'حدث خطأ':'Something went wrong'}</h3>
            <button onClick={()=>setResult(null)} style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',border:'none',borderRadius:'10px',padding:'12px 28px',cursor:'pointer',fontWeight:'600',marginTop:'16px'}}>{lang==='ar'?'حاول مجدداً':'Try Again'}</button>
          </div>
        )}
      </div>
    </div>
  );
}