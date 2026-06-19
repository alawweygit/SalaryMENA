'use client';
import { useState } from 'react';
import { useLang } from '../components/LanguageContext';
import { t } from '../components/translations';
import Navbar from '../components/Navbar';

const COUNTRIES = ['UAE','Saudi Arabia','Egypt','Oman','Kuwait','Qatar','Bahrain','Jordan','Lebanon','Iraq','Syria','Yemen','Libya','Tunisia','Algeria','Morocco','Sudan','Somalia','Comoros','Djibouti','Mauritania','Palestine'];
const GCC = ['UAE','Saudi Arabia','Kuwait','Qatar','Bahrain','Oman'];

export default function Submit() {
  const { lang, isAr } = useLang();
  const txt = t[lang];
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [form, setForm] = useState({jobTitle:'',seniority:'',companyType:'',companyName:'',country:'',city:'',monthlySalary:'',basicSalary:'',currency:'AED',bonus:'',experience:'',education:'',nationalityType:'',gender:'',email:'',housingProvided:false,carProvided:false});
  const update = (f,v) => setForm(p=>({...p,[f]:v}));

  const STEPS = [
    {title:txt.step_role_title,subtitle:txt.step_role_sub},
    {title:txt.step_company_title,subtitle:txt.step_company_sub},
    {title:txt.step_location_title,subtitle:txt.step_location_sub},
    {title:txt.step_salary_title,subtitle:txt.step_salary_sub},
    {title:txt.step_background_title,subtitle:txt.step_background_sub},
    {title:txt.step_done_title,subtitle:txt.step_done_sub},
  ];

  const isGCC = GCC.includes(form.country);
  const nationalityOptions = isGCC
    ? (lang==='ar'?['مواطن خليجي','وافد عربي','وافد غربي','وافد آسيوي']:['GCC National','Arab Expat','Western Expat','Asian Expat'])
    : (lang==='ar'?['مواطن محلي','عربي (دولة أخرى)','وافد غربي','وافد آسيوي']:['Local National','Arab (Other)','Western Expat','Asian Expat']);

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
      await fetch('/api/submit', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)});
    } catch(e) {}
    localStorage.setItem('salarymena_access','true');
    setSubmitted(true);
  };

  const inp = {width:'100%',background:'#13131f',border:'1px solid #2a2a3e',borderRadius:'10px',padding:'14px 16px',color:'#fff',fontSize:'15px',outline:'none',boxSizing:'border-box',appearance:'none',textAlign:isAr?'right':'left'};
  const lbl = {display:'block',fontSize:'13px',fontWeight:'600',color:'#a0a0b0',marginBottom:'8px',textTransform:'uppercase',letterSpacing:'0.5px'};
  const hint = {fontSize:'12px',color:'#505060',marginBottom:'12px',lineHeight:1.6};
  const chip = (a) => ({padding:'10px 20px',borderRadius:'50px',fontSize:'14px',fontWeight:'500',cursor:'pointer',border:'none',background:a?'linear-gradient(135deg,#6366f1,#8b5cf6)':'#13131f',color:a?'#fff':'#606070',outline:a?'none':'1px solid #2a2a3e',transition:'all 0.2s'});
  const rowChip = (a) => ({...chip(a),borderRadius:'12px',padding:'14px 20px',textAlign:isAr?'right':'left',display:'flex',justifyContent:'space-between',alignItems:'center',width:'100%'});
  const countryChip = (a) => ({padding:'8px 16px',borderRadius:'50px',fontSize:'13px',fontWeight:'500',cursor:'pointer',border:'none',background:a?'linear-gradient(135deg,#6366f1,#8b5cf6)':'#13131f',color:a?'#fff':'#606070',outline:a?'none':'1px solid #2a2a3e',whiteSpace:'nowrap'});
  const toggle = (a) => ({padding:'10px 20px',borderRadius:'50px',fontSize:'14px',fontWeight:'500',cursor:'pointer',border:'none',background:a?'linear-gradient(135deg,#10b981,#059669)':'#13131f',color:a?'#fff':'#606070',outline:a?'none':'1px solid #2a2a3e',transition:'all 0.2s'});
  const progress = ((step-1)/(STEPS.length-1))*100;
  const filteredCountries = COUNTRIES.filter(c=>c.toLowerCase().includes(countrySearch.toLowerCase()));

  const seniorities = lang==='ar'
    ? [['مبتدئ','0–2 سنة'],['متوسط','2–5 سنوات'],['متقدم','5–8 سنوات'],['قائد','يقود فريقاً'],['مدير','يدير أشخاصاً'],['مدير أول','رئيس قسم'],['الإدارة العليا','رئيس تنفيذي، مالي...']]
    : [['Junior','0–2 years'],['Mid-Level','2–5 years'],['Senior','5–8 years'],['Lead','Leading a team'],['Manager','Managing people'],['Director','Head of department'],['C-Suite','CEO, CFO, COO...']];

  const companyTypes = lang==='ar'
    ? ['شركة متعددة الجنسيات','شركة محلية','حكومة','شركة عائلية']
    : ['Multinational','Local Company','Government','Family Business'];

  const experiences = ['0-1','1-3','3-5','5-8','8-12','12+'];
  const educations = lang==='ar'
    ? ['ثانوية عامة','بكالوريوس','ماجستير','دكتوراه','شهادة مهنية']
    : ["High School","Bachelor's","Master's","PhD","Professional Cert"];
  const genders = lang==='ar' ? ['ذكر','أنثى'] : ['Male','Female'];

  if(submitted) return (
    <div style={{fontFamily:'Inter,sans-serif',background:'#0a0a0f',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff'}}>
      <div style={{textAlign:'center',maxWidth:'500px',padding:'40px'}}>
        <div style={{fontSize:'64px',marginBottom:'24px'}}>🎉</div>
        <h1 style={{fontSize:'32px',fontWeight:'800',marginBottom:'16px'}}>{txt.thank_you_title}</h1>
        <p style={{color:'#a0a0b0',fontSize:'16px',lineHeight:1.7,marginBottom:'32px'}}>
          {txt.thank_you_msg} <strong style={{color:'#a78bfa'}}>{form.email}</strong>
        </p>
        <a href="/" style={{display:'inline-block',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',textDecoration:'none',borderRadius:'12px',padding:'14px 32px',fontWeight:'700'}}>{txt.back_home}</a>
      </div>
    </div>
  );

  return (
    <div style={{fontFamily:'Inter,sans-serif',background:'#0a0a0f',minHeight:'100vh',color:'#fff'}}>
      <style>{`input[type=number]::-webkit-outer-spin-button,input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}`}</style>
      <Navbar/>
      <div style={{height:'3px',background:'#1e1e2e'}}><div style={{height:'100%',width:progress+'%',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',transition:'width 0.4s ease'}}/></div>

      <div style={{maxWidth:'580px',margin:'60px auto',padding:'0 24px'}}>
        <div style={{marginBottom:'48px'}}>
          <div style={{fontSize:'13px',color:'#6366f1',fontWeight:'600',marginBottom:'8px',textTransform:'uppercase',letterSpacing:'1px'}}>{txt.step_of} {step} {txt.of} {STEPS.length}</div>
          <h1 style={{fontSize:'36px',fontWeight:'800',marginBottom:'8px'}}>{STEPS[step-1].title}</h1>
          <p style={{color:'#606070',fontSize:'16px'}}>{STEPS[step-1].subtitle}</p>
        </div>

        {step===1 && <div style={{display:'flex',flexDirection:'column',gap:'24px'}}>
          <div><label style={lbl}>{txt.job_title_label}</label><input style={inp} placeholder={txt.job_title_placeholder} value={form.jobTitle} onChange={e=>update('jobTitle',e.target.value)}/></div>
          <div>
            <label style={lbl}>{txt.seniority_label}</label>
            <p style={hint}>{txt.seniority_hint}</p>
            <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
              {seniorities.map(([s,desc])=>(
                <button key={s} onClick={()=>update('seniority',s)} style={rowChip(form.seniority===s)}>
                  <span>{s}</span><span style={{fontSize:'12px',opacity:0.6}}>{desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>}

        {step===2 && <div style={{display:'flex',flexDirection:'column',gap:'24px'}}>
          <div><label style={lbl}>{txt.company_type_label}</label><div style={{display:'flex',flexWrap:'wrap',gap:'10px'}}>{companyTypes.map(t=><button key={t} style={chip(form.companyType===t)} onClick={()=>update('companyType',t)}>{t}</button>)}</div></div>
          <div><label style={lbl}>{txt.company_name_label} <span style={{color:'#404050',fontWeight:'400',textTransform:'none'}}>{txt.company_name_optional}</span></label><input style={inp} placeholder={txt.company_name_placeholder} value={form.companyName} onChange={e=>update('companyName',e.target.value)}/></div>
        </div>}

        {step===3 && <div style={{display:'flex',flexDirection:'column',gap:'24px'}}>
          <div>
            <label style={lbl}>{txt.country_label}</label>
            <input style={{...inp,marginBottom:'12px'}} placeholder={txt.country_search} value={countrySearch} onChange={e=>setCountrySearch(e.target.value)}/>
            <div style={{display:'flex',flexWrap:'wrap',gap:'8px',maxHeight:'220px',overflowY:'auto',padding:'4px 0'}}>
              {filteredCountries.map(c=><button key={c} style={countryChip(form.country===c)} onClick={()=>update('country',c)}>{c}</button>)}
            </div>
            {form.country && <div style={{marginTop:'12px',padding:'10px 16px',background:'rgba(99,102,241,0.1)',border:'1px solid rgba(99,102,241,0.3)',borderRadius:'10px',fontSize:'14px',color:'#a78bfa'}}>✓ {form.country}</div>}
          </div>
          <div><label style={lbl}>{txt.city_label} <span style={{color:'#404050',fontWeight:'400',textTransform:'none'}}>{txt.city_optional}</span></label><input style={inp} placeholder={txt.city_placeholder} value={form.city} onChange={e=>update('city',e.target.value)}/></div>
        </div>}

        {step===4 && <div style={{display:'flex',flexDirection:'column',gap:'24px'}}>
          <div><label style={lbl}>{txt.currency_label}</label><div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>{['AED','SAR','EGP','OMR','KWD','QAR','BHD','JOD','USD'].map(c=><button key={c} style={chip(form.currency===c)} onClick={()=>update('currency',c)}>{c}</button>)}</div></div>
          <div><label style={lbl}>{txt.monthly_salary_label}</label><p style={hint}>{txt.monthly_salary_hint}</p><input style={inp} type="number" placeholder="25000" value={form.monthlySalary} onChange={e=>update('monthlySalary',e.target.value)}/></div>
          <div><label style={lbl}>{txt.basic_salary_label} <span style={{color:'#404050',fontWeight:'400',textTransform:'none'}}>{txt.basic_salary_optional}</span></label><p style={hint}>{txt.basic_salary_hint}</p><input style={inp} type="number" placeholder="15000" value={form.basicSalary} onChange={e=>update('basicSalary',e.target.value)}/></div>
          <div><label style={lbl}>{txt.bonus_label} <span style={{color:'#404050',fontWeight:'400',textTransform:'none'}}>{txt.bonus_optional}</span></label><p style={hint}>{txt.bonus_hint}</p><input style={inp} type="number" placeholder="10000" value={form.bonus} onChange={e=>update('bonus',e.target.value)}/></div>
          <div>
            <label style={lbl}>{lang==='ar'?'المزايا العينية (اختياري)':'Benefits in Kind (Optional)'}</label>
            <p style={hint}>{lang==='ar'?'هل تشمل حزمتك الوظيفية أياً من هذه المزايا؟':'Does your package include any of these?'}</p>
            <div style={{display:'flex',gap:'12px',flexWrap:'wrap'}}>
              <button style={toggle(form.housingProvided)} onClick={()=>update('housingProvided',!form.housingProvided)}>🏠 {lang==='ar'?'سكن مجاني':'Housing Provided'}</button>
              <button style={toggle(form.carProvided)} onClick={()=>update('carProvided',!form.carProvided)}>🚗 {lang==='ar'?'سيارة مجانية':'Car Provided'}</button>
            </div>
          </div>
        </div>}

        {step===5 && <div style={{display:'flex',flexDirection:'column',gap:'24px'}}>
          <div><label style={lbl}>{txt.experience_label}</label><div style={{display:'flex',flexWrap:'wrap',gap:'10px'}}>{experiences.map(y=><button key={y} style={chip(form.experience===y)} onClick={()=>update('experience',y)}>{y} {lang==='ar'?'سنوات':'yrs'}</button>)}</div></div>
          <div><label style={lbl}>{txt.education_label}</label><div style={{display:'flex',flexWrap:'wrap',gap:'10px'}}>{educations.map(e=><button key={e} style={chip(form.education===e)} onClick={()=>update('education',e)}>{e}</button>)}</div></div>
          <div>
            <label style={lbl}>{txt.nationality_label}</label>
            <p style={hint}>{txt.nationality_hint}</p>
            <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
              {nationalityOptions.map(n=><button key={n} style={{...rowChip(form.nationalityType===n),justifyContent:'flex-start'}} onClick={()=>update('nationalityType',n)}>{n}</button>)}
            </div>
          </div>
          <div><label style={lbl}>{txt.gender_label} <span style={{color:'#404050',fontWeight:'400',textTransform:'none'}}>{txt.gender_optional}</span></label><div style={{display:'flex',gap:'10px'}}>{genders.map(g=><button key={g} style={chip(form.gender===g)} onClick={()=>update('gender',g)}>{g}</button>)}</div></div>
        </div>}

        {step===6 && <div style={{display:'flex',flexDirection:'column',gap:'24px'}}>
          <div style={{background:'rgba(99,102,241,0.1)',border:'1px solid rgba(99,102,241,0.3)',borderRadius:'12px',padding:'20px'}}>
            <p style={{margin:0,color:'#a78bfa',fontSize:'14px',lineHeight:1.7}}>{txt.email_note} {form.country||'...'}</p>
          </div>
          <div><label style={lbl}>{txt.email_label}</label><input style={inp} type="email" placeholder={txt.email_placeholder} value={form.email} onChange={e=>update('email',e.target.value)}/></div>
          <p style={{fontSize:'12px',color:'#404050',margin:0}}>{txt.email_hint}</p>
        </div>}

        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:'48px'}}>
          {step>1
            ?<button onClick={()=>setStep(s=>s-1)} style={{background:'transparent',border:'1px solid #2a2a3e',color:'#a0a0b0',borderRadius:'10px',padding:'14px 28px',fontSize:'15px',cursor:'pointer',fontWeight:'500'}}>{txt.back_btn}</button>
            :<div/>}
          {step<STEPS.length
            ?<button onClick={()=>canNext()&&setStep(s=>s+1)} style={{background:canNext()?'linear-gradient(135deg,#6366f1,#8b5cf6)':'#1e1e2e',color:canNext()?'#fff':'#404050',border:'none',borderRadius:'10px',padding:'14px 32px',fontSize:'15px',fontWeight:'700',cursor:canNext()?'pointer':'not-allowed'}}>{txt.continue_btn}</button>
            :<button onClick={handleSubmit} style={{background:canNext()?'linear-gradient(135deg,#6366f1,#8b5cf6)':'#1e1e2e',color:canNext()?'#fff':'#404050',border:'none',borderRadius:'10px',padding:'14px 32px',fontSize:'15px',fontWeight:'700',cursor:canNext()?'pointer':'not-allowed'}}>{txt.submit_btn_form}</button>}
        </div>
      </div>
    </div>
  );
}