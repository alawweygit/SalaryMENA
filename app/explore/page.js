'use client';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useLang } from '../components/LanguageContext';
import { t } from '../components/translations';

const COUNTRIES_EN = ['UAE','Saudi Arabia','Egypt','Oman','Kuwait','Qatar','Bahrain','Jordan','Lebanon','Iraq','Syria','Yemen','Libya','Tunisia','Algeria','Morocco','Sudan','Somalia','Comoros','Djibouti','Mauritania','Palestine'];
const COUNTRIES_AR = ['الإمارات','السعودية','مصر','عُمان','الكويت','قطر','البحرين','الأردن','لبنان','العراق','سوريا','اليمن','ليبيا','تونس','الجزائر','المغرب','السودان','الصومال','جزر القمر','جيبوتي','موريتانيا','فلسطين'];

const COUNTRY_MAP_AR_TO_EN = {
  'الإمارات':'UAE','السعودية':'Saudi Arabia','مصر':'Egypt','عُمان':'Oman',
  'الكويت':'Kuwait','قطر':'Qatar','البحرين':'Bahrain','الأردن':'Jordan',
  'لبنان':'Lebanon','العراق':'Iraq','سوريا':'Syria','اليمن':'Yemen',
  'ليبيا':'Libya','تونس':'Tunisia','الجزائر':'Algeria','المغرب':'Morocco',
  'السودان':'Sudan','الصومال':'Somalia','جزر القمر':'Comoros','جيبوتي':'Djibouti',
  'موريتانيا':'Mauritania','فلسطين':'Palestine'
};

const LEVELS_EN = [
  {label:'Junior',years:'0–2 yrs'},
  {label:'Mid-Level',years:'2–5 yrs'},
  {label:'Senior',years:'5–8 yrs'},
  {label:'Lead',years:'8+ yrs'},
  {label:'Manager',years:'5+ yrs'},
  {label:'Director',years:'10+ yrs'},
  {label:'C-Suite',years:'15+ yrs'},
];
const LEVELS_AR = [
  {label:'مبتدئ',years:'0–2 سنة'},
  {label:'متوسط',years:'2–5 سنوات'},
  {label:'متقدم',years:'5–8 سنوات'},
  {label:'قائد',years:'8+ سنوات'},
  {label:'مدير',years:'5+ سنوات'},
  {label:'مدير أول',years:'10+ سنوات'},
  {label:'الإدارة العليا',years:'15+ سنوات'},
];

const LEVEL_MAP_AR_TO_EN = {
  'مبتدئ':'Junior','متوسط':'Mid-Level','متقدم':'Senior',
  'قائد':'Lead','مدير':'Manager','مدير أول':'Director','الإدارة العليا':'C-Suite'
};

const TYPES_EN = ['Private','Government'];
const TYPES_AR = ['خاص','حكومة'];
const TYPE_MAP_AR_TO_EN = {'خاص':'Private','حكومة':'Government'};

const CURRENCY_AR = {
  'AED':'درهم إماراتي','SAR':'ريال سعودي','EGP':'جنيه مصري',
  'OMR':'ريال عماني','KWD':'دينار كويتي','QAR':'ريال قطري',
  'BHD':'دينار بحريني','JOD':'دينار أردني','USD':'دولار أمريكي'
};

// Smart search — job title synonyms
const JOB_SYNONYMS = [
  ['pharmacist','صيدلاني','pharmacy'],
  ['medical representative','medical rep','مندوب طبي','مندوب مبيعات طبية','product specialist','sales representative medical'],
  ['software engineer','software developer','مهندس برمجيات','مطور برمجيات','developer','programmer','مبرمج'],
  ['teacher','معلم','مدرس','instructor','educator'],
  ['nurse','ممرض','ممرضة','nursing'],
  ['doctor','physician','طبيب','دكتور'],
  ['accountant','محاسب','accounting','finance'],
  ['marketing manager','مدير تسويق','marketing'],
  ['civil engineer','مهندس مدني','civil engineering'],
  ['hr manager','human resources','مدير موارد بشرية','موارد بشرية'],
  ['financial analyst','محلل مالي','finance analyst'],
  ['data scientist','عالم بيانات','data analyst','محلل بيانات'],
  ['project manager','مدير مشروع','pm'],
  ['sales executive','مدير مبيعات','sales manager','مبيعات'],
  ['graphic designer','مصمم جرافيك','designer','مصمم'],
  ['lawyer','محامي','attorney','legal'],
  ['chef','طباخ','cook','طهاة'],
  ['driver','سائق','chauffeur'],
  ['security guard','حارس أمن','security'],
  ['receptionist','موظف استقبال','front desk'],
];

function expandSearch(query) {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  for (const group of JOB_SYNONYMS) {
    if (group.some(term => term.toLowerCase().includes(q) || q.includes(term.toLowerCase()))) {
      return group;
    }
  }
  return [q];
}

export default function Explore() {
  const { lang, isAr } = useLang();
  const txt = t[lang];
  const [search, setSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [openDropdown, setOpenDropdown] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/explore')
      .then(r => r.json())
      .then(res => { setData(res.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const COUNTRIES = lang==='ar' ? COUNTRIES_AR : COUNTRIES_EN;
  const LEVELS = lang==='ar' ? LEVELS_AR : LEVELS_EN;
  const TYPES = lang==='ar' ? TYPES_AR : TYPES_EN;

  const filtered = data.filter(d => {
    const searchTerms = expandSearch(search);
    const matchSearch = !search || searchTerms.some(term =>
      (d.title||'').toLowerCase().includes(term.toLowerCase()) ||
      (d.country||'').toLowerCase().includes(term.toLowerCase()) ||
      (d.city||'').toLowerCase().includes(term.toLowerCase())
    );

    // Convert AR filter to EN for matching
    const countryEN = COUNTRY_MAP_AR_TO_EN[countryFilter] || countryFilter;
    const levelEN = LEVEL_MAP_AR_TO_EN[levelFilter] || levelFilter;
    const companyEN = TYPE_MAP_AR_TO_EN[companyFilter] || companyFilter;

    const matchCountry = !countryFilter || d.country === countryEN || d.country === countryFilter;
    const matchLevel = !levelFilter || d.seniority === levelEN || d.seniority === levelFilter;
    const matchCompany = !companyFilter || d.company === companyEN || d.company === companyFilter;
    return matchSearch && matchCountry && matchLevel && matchCompany;
  });

  const hasFilters = countryFilter || levelFilter || companyFilter;

  const shareOnWhatsApp = (d) => {
    const text = `💰 ${d.title} in ${d.country}\nSalary: ${d.currency} ${Number(d.monthlySalary).toLocaleString()}/month${d.seniority?' · '+d.seniority:''}\n\nSee more real salaries at salarymena.com 👇`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`,'_blank');
  };

  const dropdown = (id, label, value, options, onSelect) => (
    <div style={{position:'relative',flex:1,minWidth:'0'}}>
      <div onClick={()=>setOpenDropdown(openDropdown===id?null:id)}
        style={{background:'#13131f',border:'1px solid #2a2a3e',borderRadius:'10px',padding:'10px 12px',cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center',userSelect:'none'}}>
        <span style={{fontSize:'11px',fontWeight:'700',color:'#606070',textTransform:'uppercase',letterSpacing:'0.5px',whiteSpace:'nowrap'}}>{label}</span>
        <span style={{fontSize:'13px',color:'#fff',fontWeight:'600',marginLeft:'8px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
          {value || (id==='country'?txt.all_countries:id==='level'?txt.all_levels:txt.all_types)} ▾
        </span>
      </div>
      {openDropdown===id && (
        <div style={{position:'absolute',top:'100%',left:0,right:0,background:'#13131f',border:'1px solid #2a2a3e',borderRadius:'10px',zIndex:50,marginTop:'4px',maxHeight:'260px',overflowY:'auto'}}>
          <div onClick={()=>{onSelect('');setOpenDropdown(null);}}
            style={{padding:'10px 16px',cursor:'pointer',color:'#606070',fontSize:'14px'}}
            onMouseEnter={e=>e.target.style.background='#1e1e2e'} onMouseLeave={e=>e.target.style.background='transparent'}>
            {id==='country'?txt.all_countries:id==='level'?txt.all_levels:txt.all_types}
          </div>
          {options.map((o,i)=>{
            const optLabel = typeof o === 'object' ? o.label : o;
            const optYears = typeof o === 'object' ? o.years : null;
            return (
              <div key={i} onClick={()=>{onSelect(optLabel);setOpenDropdown(null);}}
                style={{padding:'10px 16px',cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center',color:value===optLabel?'#a78bfa':'#fff',fontSize:'14px',background:value===optLabel?'rgba(99,102,241,0.1)':'transparent'}}
                onMouseEnter={e=>e.currentTarget.style.background='#1e1e2e'} onMouseLeave={e=>e.currentTarget.style.background=value===optLabel?'rgba(99,102,241,0.1)':'transparent'}>
                <span>{optLabel}</span>
                {optYears && <span style={{fontSize:'11px',color:'#404050'}}>{optYears}</span>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const displayCurrency = (code) => lang==='ar' && CURRENCY_AR[code] ? CURRENCY_AR[code] : code;
  const displayCountry = (country) => {
    if (lang==='ar') {
      const idx = COUNTRIES_EN.indexOf(country);
      return idx >= 0 ? COUNTRIES_AR[idx] : country;
    }
    return country;
  };

  return (
    <div style={{fontFamily:'Inter,sans-serif',background:'#0a0a0f',minHeight:'100vh',color:'#fff'}} onClick={()=>setOpenDropdown(null)}>
      <style>{`
        @media(max-width:768px){
          .explore-title{font-size:28px!important}
          .explore-filters{flex-direction:column!important}
          .explore-card{flex-direction:column!important;align-items:flex-start!important;gap:12px!important}
          .explore-salary{text-align:left!important;margin-left:0!important}
        }
      `}</style>
      <Navbar/>

      <div style={{maxWidth:'900px',margin:'0 auto',padding:'40px 16px'}}>
        <div style={{marginBottom:'28px'}}>
          <h1 className="explore-title" style={{fontSize:'36px',fontWeight:'900',marginBottom:'8px',background:'linear-gradient(135deg,#fff 0%,#a78bfa 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>{txt.explore_title}</h1>
          <p style={{color:'#606070',fontSize:'14px'}}>{txt.explore_sub}</p>
        </div>

        <div style={{background:'#13131f',border:'1px solid #1e1e2e',borderRadius:'16px',padding:'16px',marginBottom:'20px'}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={txt.search_explore}
            style={{width:'100%',background:'transparent',border:'none',outline:'none',color:'#fff',fontSize:'16px',marginBottom:'12px',boxSizing:'border-box',textAlign:isAr?'right':'left'}}/>
          <div className="explore-filters" style={{display:'flex',gap:'8px'}} onClick={e=>e.stopPropagation()}>
            {dropdown('country',txt.country_filter,countryFilter,COUNTRIES,setCountryFilter)}
            {dropdown('level',txt.level_filter,levelFilter,LEVELS,setLevelFilter)}
            {dropdown('company',txt.company_filter,companyFilter,TYPES,setCompanyFilter)}
          </div>
        </div>

        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px'}}>
          <span style={{color:'#606070',fontSize:'14px'}}>{loading ? '...' : `${filtered.length} ${txt.results_found}`}</span>
          {hasFilters && (
            <button onClick={()=>{setCountryFilter('');setLevelFilter('');setCompanyFilter('');}}
              style={{background:'transparent',border:'1px solid #2a2a3e',color:'#a0a0b0',borderRadius:'8px',padding:'6px 14px',fontSize:'13px',cursor:'pointer'}}>
              {txt.clear_filters}
            </button>
          )}
        </div>

        {loading ? (
          <div style={{textAlign:'center',padding:'60px',color:'#404050'}}>
            <div style={{fontSize:'32px',marginBottom:'16px'}}>⏳</div>
            <p>Loading salary data...</p>
          </div>
        ) : filtered.length===0 ? (
          <div style={{textAlign:'center',padding:'60px',color:'#404050'}}>
            <div style={{fontSize:'48px',marginBottom:'16px'}}>🔍</div>
            <p>{txt.no_results}</p>
          </div>
        ) : (
          <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
            {filtered.map(d=>(
              <div key={d.id} className="explore-card" style={{background:'#13131f',border:'1px solid #1e1e2e',borderRadius:'16px',padding:'20px',display:'flex',justifyContent:'space-between',alignItems:'center',transition:'border-color 0.2s'}}
                onMouseEnter={e=>e.currentTarget.style.borderColor='#6366f1'}
                onMouseLeave={e=>e.currentTarget.style.borderColor='#1e1e2e'}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'8px',flexWrap:'wrap'}}>
                    <h3 style={{margin:0,fontSize:'16px',fontWeight:'700'}}>{d.title}</h3>
                    {d.seniority && (
                      <span style={{background:'rgba(99,102,241,0.2)',color:'#a78bfa',padding:'3px 10px',borderRadius:'50px',fontSize:'11px',fontWeight:'600',whiteSpace:'nowrap'}}>
                        {d.seniority}
                      </span>
                    )}
                  </div>
                  <div style={{display:'flex',gap:'12px',flexWrap:'wrap'}}>
                    {(d.city||d.country) && <span style={{color:'#606070',fontSize:'12px'}}>📍 {[d.city,displayCountry(d.country)].filter(Boolean).join(', ')}</span>}
                    {d.company && <span style={{color:'#606070',fontSize:'12px'}}>🏢 {lang==='ar'&&d.company==='Private'?'خاص':lang==='ar'&&d.company==='Government'?'حكومة':d.company}</span>}
                    {d.experience && <span style={{color:'#606070',fontSize:'12px'}}>⏱ {d.experience}</span>}
                  </div>
                </div>
                <div className="explore-salary" style={{textAlign:isAr?'left':'right',flexShrink:0,marginLeft:isAr?0:'16px',marginRight:isAr?'16px':0}}>
                  <div style={{fontSize:'20px',fontWeight:'800',color:'#a78bfa'}}>{displayCurrency(d.currency)} {Number(d.monthlySalary).toLocaleString()}</div>
                  <div style={{color:'#606070',fontSize:'12px',marginBottom:'8px'}}>{txt.per_month}</div>
                  <button onClick={()=>shareOnWhatsApp(d)}
                    style={{background:'#25D366',border:'none',borderRadius:'8px',padding:'5px 10px',fontSize:'11px',fontWeight:'700',cursor:'pointer',color:'#fff',display:'flex',alignItems:'center',gap:'4px'}}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    {lang==='ar'?'شارك':'Share'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{marginTop:'48px',background:'linear-gradient(135deg,rgba(99,102,241,0.15),rgba(139,92,246,0.1))',border:'1px solid rgba(99,102,241,0.3)',borderRadius:'20px',padding:'32px',textAlign:'center'}}>
          <h2 style={{fontSize:'22px',fontWeight:'800',marginBottom:'12px'}}>{txt.explore_cta_title}</h2>
          <p style={{color:'#a0a0b0',fontSize:'14px',marginBottom:'24px'}}>{txt.explore_cta_sub}</p>
          <a href="/submit" style={{display:'inline-block',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',textDecoration:'none',borderRadius:'12px',padding:'12px 28px',fontWeight:'700',fontSize:'14px'}}>{txt.explore_cta_btn}</a>
        </div>
      </div>
    </div>
  );
}