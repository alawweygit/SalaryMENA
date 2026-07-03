'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useLang } from '../components/LanguageContext';
import { t } from '../components/translations';
import Navbar from '../components/Navbar';

const COUNTRIES_EN = ['UAE','Saudi Arabia','Egypt','Oman','Kuwait','Qatar','Bahrain','Jordan','Lebanon','Iraq','Syria','Yemen','Libya','Tunisia','Algeria','Morocco','Sudan','Somalia','Comoros','Djibouti','Mauritania','Palestine'];
const COUNTRIES_AR = ['الإمارات','السعودية','مصر','عُمان','الكويت','قطر','البحرين','الأردن','لبنان','العراق','سوريا','اليمن','ليبيا','تونس','الجزائر','المغرب','السودان','الصومال','جزر القمر','جيبوتي','موريتانيا','فلسطين'];
const GCC_EN = ['UAE','Saudi Arabia','Kuwait','Qatar','Bahrain','Oman'];
const GCC_AR = ['الإمارات','السعودية','الكويت','قطر','البحرين','عُمان'];
const CURRENCIES_EN = ['AED','SAR','EGP','OMR','KWD','QAR','BHD','JOD','USD'];
const CURRENCY_AR = {
  'AED':'درهم إماراتي','SAR':'ريال سعودي','EGP':'جنيه مصري',
  'OMR':'ريال عماني','KWD':'دينار كويتي','QAR':'ريال قطري',
  'BHD':'دينار بحريني','JOD':'دينار أردني','USD':'دولار أمريكي'
};

const FORM_KEY = 'salarymena_form';

function SubmitInner() {
  const { lang, isAr } = useLang();
  const txt = t[lang];
  const router = useRouter();
  const searchParams = useSearchParams();
  const step = Number(searchParams.get('step') || 1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [form, setForm] = useState(() => {
    if(typeof window !== 'undefined') {
      const saved = sessionStorage.getItem(FORM_KEY);
      if(saved) return JSON.parse(saved);
    }
    return {
      jobTitle:'',seniority:'',companyType:'',companyName:'',
      country:'',countryEN:'',city:'',monthlySalary:'',basicSalary:'',
      currency:'AED',bonus:'',experience:'',education:'',
      nationalityType:'',gender:'',email:'',housingProvided:false,carProvided:false
    };
  });

  const update = (f,v) => {
    const newForm = {...form,[f]:v};
    setForm(newForm);
    sessionStorage.setItem(FORM_KEY, JSON.stringify(newForm));
  };

  const STEPS = [
    {title:txt.step_role_title,subtitle:txt.step_role_sub},
    {title:txt.step_company_title,subtitle:txt.step_company_sub},
    {title:txt.step_location_title,subtitle:txt.step_location_sub},
    {title:txt.step_salary_title,subtitle:txt.step_salary_sub},
    {title:txt.step_background_title,subtitle:txt.step_background_sub},
    {title:txt.step_done_title,subtitle:txt.step_done_sub},
  ];

  const isGCC = GCC_EN.includes(form.countryEN) || GCC_AR.includes(form.country);
  const nationalityOptions = isGCC
    ? (lang==='ar'?['مواطن خليجي','وافد عربي','وافد أوروبي/أجنبي','وافد آسيوي']:['GCC National','Arab Expat','Western Expat','Asian Expat'])
    : (lang==='ar'?['مواطن محلي','عربي (دولة أخرى)','وافد أوروبي/أجنبي','وافد آسيوي']:['Local National','Arab (Other)','Western Expat','Asian Expat']);

  const selectCountry = (countryLabel) => {
    if(lang==='ar') {
      const idx = COUNTRIES_AR.indexOf(countryLabel);
      const en = idx >= 0 ? COUNTRIES_EN[idx] : countryLabel;
      const newForm = {...form,country:countryLabel,countryEN:en,nationalityType:'',currency:CURRENCY_BY_COUNTRY[en]||'USD'};
      setForm(newForm);
      sessionStorage.setItem(FORM_KEY, JSON.stringify(newForm));
    } else {
      const newForm = {...form,country:countryLabel,countryEN:countryLabel,nationalityType:'',currency:CURRENCY_BY_COUNTRY[countryLabel]||'USD'};
      setForm(newForm);
      sessionStorage.setItem(FORM_KEY, JSON.stringify(newForm));
    }
  };

  const canNext = () => {
    if(step===1) return form.jobTitle && form.seniority;
    if(step===2) return form.companyType;
    if(step===3) return form.country;
    if(step===4) return form.monthlySalary;
    if(step===5) return form.experience && form.nationalityType;
    if(step===6) return form.email;
    return true;
  };

  const goNext = () => {
    if(canNext()) router.push(`/submit?step=${step+1}`);
  };

  const goBack = () => {
    router.push(`/submit?step=${step-1}`);
  };

  const handleSubmit = async () => {
    if(submitting) return;
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        country: form.countryEN || form.country,
        companyType: form.companyType==='خاص'?'Private':form.companyType==='حكومة'?'Government':form.companyType,
      };
      await fetch('/api/submit',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      sessionStorage.removeItem(FORM_KEY);
      localStorage.setItem('salarymena_access','true');
      setSubmitted(true);
    } catch(e){
      setSubmitting(false);
    }
  };

  const inp = {width:'100%',background:'#13131f',border:'1px solid #2a2a3e',borderRadius:'10px',padding:'14px 16px',color:'#fff',fontSize:'16px',outline:'none',boxSizing:'border-box',appearance:'none',textAlign:isAr?'right':'left'};
  const lbl = {display:'block',fontSize:'13px',fontWeight:'600',color:'#a0a0b0',marginBottom:'8px',textTransform:'uppercase',letterSpacing:'0.5px'};
  const hint = {fontSize:'12px',color:'#505060',marginBottom:'12px',lineHeight:1.6};
  const chip = (a) => ({padding:'10px 16px',borderRadius:'50px',fontSize:'13px',fontWeight:'500',cursor:'pointer',border:'none',background:a?'linear-gradient(135deg,#6366f1,#8b5cf6)':'#13131f',color:a?'#fff':'#606070',outline:a?'none':'1px solid #2a2a3e',transition:'all 0.2s'});
  const rowChip = (a) => ({...chip(a),borderRadius:'12px',padding:'14px 16px',textAlign:isAr?'right':'left',display:'flex',justifyContent:'space-between',alignItems:'center',width:'100%',boxSizing:'border-box',fontSize:'14px'});
  const countryChip = (a) => ({padding:'8px 14px',borderRadius:'50px',fontSize:'13px',fontWeight:'500',cursor:'pointer',border:'none',background:a?'linear-gradient(135deg,#6366f1,#8b5cf6)':'#13131f',color:a?'#fff':'#606070',outline:a?'none':'1px solid #2a2a3e',whiteSpace:'nowrap'});
  const toggle = (a) => ({padding:'10px 16px',borderRadius:'50px',fontSize:'13px',fontWeight:'500',cursor:'pointer',border:'none',background:a?'linear-gradient(135deg,#10b981,#059669)':'#13131f',color:a?'#fff':'#606070',outline:a?'none':'1px solid #2a2a3e',transition:'all 0.2s'});
  const progress = ((step-1)/(STEPS.length-1))*100;
  const COUNTRIES = lang==='ar' ? COUNTRIES_AR : COUNTRIES_EN;
  const filteredCountries = COUNTRIES.filter(c=>c.toLowerCase().includes(countrySearch.toLowerCase()));
  const seniorities = lang==='ar'
    ? [['مبتدئ','0–1 سنة'],['متوسط','1–3 سنوات'],['متوسط+','3–5 سنوات'],['متقدم','5–8 سنوات'],['متقدم+','8+ سنوات'],['مدير','يدير أشخاصاً'],['مدير أول','رئيس قسم'],['الإدارة العليا','رئيس تنفيذي، مالي...']]
    : [['Junior','0–1 yrs'],['Mid-Level','1–3 yrs'],['Mid-Senior','3–5 yrs'],['Senior','5–8 yrs'],['Senior+','8+ yrs'],['Manager','Managing people'],['Director','Head of dept'],['C-Suite','CEO, CFO, COO...']];
  const companyTypes = lang==='ar' ? ['خاص','حكومة'] : ['Private','Government'];
  const experiences = ['0-1','1-3','3-5','5-8','8-12','12+'];
  const educations = lang==='ar'
    ? ['ثانوية عامة','بكالوريوس','ماجستير','دكتوراه']
    : ["High School","Bachelor's","Master's","PhD"];
  const genders = lang==='ar' ? ['ذكر','أنثى'] : ['Male','Female'];

  if(submitted) return (
    <div style={{fontFamily:'Inter,sans-serif',background:'#0a0a0f',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',padding:'24px'}}>
      <div style={{textAlign:'center',maxWidth:'500px',width:'100%'}}>
        <div style={{fontSize:'56px',marginBottom:'20px'}}>🎉</div>
        <h1 style={{fontSize:'28px',fontWeight:'800',marginBottom:'16px'}}>{txt.thank_you_title}</h1>
        <p style={{color:'#a0a0b0',fontSize:'15px',lineHeight:1.7,marginBottom:'28px'}}>
          {txt.thank_you_msg} <strong style={{color:'#a78bfa'}}>{form.email}</strong>
        </p>
        <a href="/" style={{display:'inline-block',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',textDecoration:'none',borderRadius:'12px',padding:'14px 32px',fontWeight:'700'}}>{txt.back_home}</a>
      </div>
    </div>
  );

  return (
    <div style={{fontFamily:'Inter,sans-serif',background:'#0a0a0f',minHeight:'100vh',color:'#fff'}}>
      <style>{`
        html,body{background:#0a0a0f!important}
        input[type=number]::-webkit-outer-spin-button,input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}
        @media(max-width:768px){
          .submit-title{font-size:26px!important}
          .submit-wrap{margin:24px auto!important;padding:0 16px!important}
          .submit-header{margin-bottom:28px!important}
          .submit-nav{margin-top:32px!important}
        }
      `}</style>
      <Navbar/>
      <div style={{height:'3px',background:'#1e1e2e'}}>
        <div style={{height:'100%',width:progress+'%',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',transition:'width 0.4s ease'}}/>
      </div>

      <div className="submit-wrap" style={{maxWidth:'580px',margin:'40px auto',padding:'0 20px'}}>
        <div className="submit-header" style={{marginBottom:'36px'}}>
          <div style={{fontSize:'13px',color:'#6366f1',fontWeight:'600',marginBottom:'8px',textTransform:'uppercase',letterSpacing:'1px'}}>{txt.step_of} {step} {txt.of} {STEPS.length}</div>
          <h1 className="submit-title" style={{fontSize:'32px',fontWeight:'800',marginBottom:'8px'}}>{STEPS[step-1]?.title}</h1>
          <p style={{color:'#606070',fontSize:'15px'}}>{STEPS[step-1]?.subtitle}</p>
        </div>

        {step===1 && <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
          <div><label style={lbl}>{txt.job_title_label}</label><input style={inp} placeholder={txt.job_title_placeholder} value={form.jobTitle} onChange={e=>update('jobTitle',e.target.value)}/></div>
          <div>
            <label style={lbl}>{txt.seniority_label}</label>
            <p style={hint}>{txt.seniority_hint}</p>
            <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
              {seniorities.map(([s,desc])=>(
                <button key={s} onClick={()=>update('seniority',s)} style={rowChip(form.seniority===s)}>
                  <span>{s}</span><span style={{fontSize:'11px',opacity:0.6,marginLeft:'8px'}}>{desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>}

        {step===2 && <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
          <div>
            <label style={lbl}>{txt.company_type_label}</label>
            <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
              {companyTypes.map(tp=><button key={tp} style={{...chip(form.companyType===tp),padding:'14px 28px',fontSize:'15px'}} onClick={()=>update('companyType',tp)}>{tp}</button>)}
            </div>
          </div>
          <div><label style={lbl}>{txt.company_name_label} <span style={{color:'#404050',fontWeight:'400',textTransform:'none'}}>{txt.company_name_optional}</span></label><input style={inp} placeholder={txt.company_name_placeholder} value={form.companyName} onChange={e=>update('companyName',e.target.value)}/></div>
        </div>}

        {step===3 && <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
          <div>
            <label style={lbl}>{txt.country_label}</label>
            <input style={{...inp,marginBottom:'12px',fontSize:'16px'}} placeholder={txt.country_search} value={countrySearch} onChange={e=>setCountrySearch(e.target.value)}/>
            <div style={{display:'flex',flexWrap:'wrap',gap:'8px',maxHeight:'200px',overflowY:'auto',padding:'4px 0'}}>
              {filteredCountries.map(c=><button key={c} style={countryChip(form.country===c)} onClick={()=>selectCountry(c)}>{c}</button>)}
            </div>
            {form.country && <div style={{marginTop:'10px',padding:'10px 14px',background:'rgba(99,102,241,0.1)',border:'1px solid rgba(99,102,241,0.3)',borderRadius:'10px',fontSize:'13px',color:'#a78bfa'}}>✓ {form.country}</div>}
          </div>
          <div><label style={lbl}>{txt.city_label} <span style={{color:'#404050',fontWeight:'400',textTransform:'none'}}>{txt.city_optional}</span></label><input style={inp} placeholder={txt.city_placeholder} value={form.city} onChange={e=>update('city',e.target.value)}/></div>
        </div>}

        {step===4 && <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
          <div>
            <label style={lbl}>{txt.currency_label}</label>
            <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>
              {CURRENCIES_EN.map(c=>(
                <button key={c} style={chip(form.currency===c)} onClick={()=>update('currency',c)}>
                  {lang==='ar' ? CURRENCY_AR[c] : c}
                </button>
              ))}
            </div>
          </div>
          <div><label style={lbl}>{txt.monthly_salary_label}</label><p style={hint}>{txt.monthly_salary_hint}</p><input style={inp} type="number" placeholder="25000" value={form.monthlySalary} onChange={e=>update('monthlySalary',e.target.value)}/></div>
          <div><label style={lbl}>{txt.basic_salary_label} <span style={{color:'#404050',fontWeight:'400',textTransform:'none'}}>{txt.basic_salary_optional}</span></label><p style={hint}>{txt.basic_salary_hint}</p><input style={inp} type="number" placeholder="15000" value={form.basicSalary} onChange={e=>update('basicSalary',e.target.value)}/></div>
          <div><label style={lbl}>{txt.bonus_label} <span style={{color:'#404050',fontWeight:'400',textTransform:'none'}}>{txt.bonus_optional}</span></label><p style={hint}>{txt.bonus_hint}</p><input style={inp} type="number" placeholder="10000" value={form.bonus} onChange={e=>update('bonus',e.target.value)}/></div>
          <div>
            <label style={lbl}>{lang==='ar'?'المزايا العينية (اختياري)':'Benefits in Kind (Optional)'}</label>
            <p style={hint}>{lang==='ar'?'هل تشمل حزمتك الوظيفية أياً من هذه المزايا؟':'Does your package include any of these?'}</p>
            <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
              <button style={toggle(form.housingProvided)} onClick={()=>update('housingProvided',!form.housingProvided)}>🏠 {lang==='ar'?'سكن مجاني':'Housing Provided'}</button>
              <button style={toggle(form.carProvided)} onClick={()=>update('carProvided',!form.carProvided)}>🚗 {lang==='ar'?'سيارة مجانية':'Car Provided'}</button>
            </div>
          </div>
        </div>}

        {step===5 && <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
          <div>
            <label style={lbl}>{txt.experience_label}</label>
            <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>
              {experiences.map(y=><button key={y} style={chip(form.experience===y)} onClick={()=>update('experience',y)}>{y} {lang==='ar'?'سنوات':'yrs'}</button>)}
            </div>
          </div>
          <div>
            <label style={lbl}>{txt.education_label} <span style={{color:'#404050',fontWeight:'400',textTransform:'none'}}>{lang==='ar'?'(اختياري)':'(optional)'}</span></label>
            <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>
              {educations.map(e=><button key={e} style={chip(form.education===e)} onClick={()=>update('education',e)}>{e}</button>)}
            </div>
          </div>
          <div>
            <label style={lbl}>{txt.nationality_label}</label>
            <p style={hint}>{txt.nationality_hint}</p>
            <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
              {nationalityOptions.map(n=><button key={n} style={{...rowChip(form.nationalityType===n),justifyContent:'flex-start'}} onClick={()=>update('nationalityType',n)}>{n}</button>)}
            </div>
          </div>
          <div>
            <label style={lbl}>{txt.gender_label} <span style={{color:'#404050',fontWeight:'400',textTransform:'none'}}>{txt.gender_optional}</span></label>
            <div style={{display:'flex',gap:'8px'}}>
              {genders.map(g=><button key={g} style={chip(form.gender===g)} onClick={()=>update('gender',g)}>{g}</button>)}
            </div>
          </div>
        </div>}

        {step===6 && <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
          <div style={{background:'rgba(99,102,241,0.1)',border:'1px solid rgba(99,102,241,0.3)',borderRadius:'12px',padding:'16px'}}>
            <p style={{margin:0,color:'#a78bfa',fontSize:'14px',lineHeight:1.7}}>{txt.email_note} {form.country||'...'}</p>
          </div>
          <div><label style={lbl}>{txt.email_label}</label><input style={inp} type="email" placeholder={txt.email_placeholder} value={form.email} onChange={e=>update('email',e.target.value)}/></div>
          <p style={{fontSize:'12px',color:'#404050',margin:0}}>{txt.email_hint}</p>
        </div>}

        <div className="submit-nav" style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:'40px',marginBottom:'60px',gap:'12px'}}>
          {step>1
            ?<button onClick={goBack} style={{background:'transparent',border:'1px solid #2a2a3e',color:'#a0a0b0',borderRadius:'10px',padding:'14px 24px',fontSize:'15px',cursor:'pointer',fontWeight:'500',flexShrink:0}}>{txt.back_btn}</button>
            :<div/>}
          {step<STEPS.length
            ?<button onClick={goNext} style={{background:canNext()?'linear-gradient(135deg,#6366f1,#8b5cf6)':'#1e1e2e',color:canNext()?'#fff':'#404050',border:'none',borderRadius:'10px',padding:'14px 28px',fontSize:'15px',fontWeight:'700',cursor:canNext()?'pointer':'not-allowed',flex:1,maxWidth:'200px'}}>{txt.continue_btn}</button>
            :<button onClick={handleSubmit} disabled={submitting} style={{background:canNext()&&!submitting?'linear-gradient(135deg,#6366f1,#8b5cf6)':'#1e1e2e',color:canNext()&&!submitting?'#fff':'#404050',border:'none',borderRadius:'10px',padding:'14px 28px',fontSize:'15px',fontWeight:'700',cursor:canNext()&&!submitting?'pointer':'not-allowed',flex:1,maxWidth:'220px'}}>
              {submitting?'Submitting...':txt.submit_btn_form}
            </button>}
        </div>
      </div>
    </div>
  );
}

const CURRENCY_BY_COUNTRY = {'UAE':'AED','Saudi Arabia':'SAR','Kuwait':'KWD','Qatar':'QAR','Bahrain':'BHD','Oman':'OMR','Jordan':'JOD','Egypt':'EGP'};

export default function Submit() {
  return (
    <Suspense fallback={<div style={{background:'#0a0a0f',minHeight:'100vh'}}/>}>
      <SubmitInner/>
    </Suspense>
  );
}