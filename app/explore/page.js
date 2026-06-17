'use client';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import { useLang } from '../components/LanguageContext';
import { t } from '../components/translations';

const SAMPLE_DATA = [
  {id:1,title:'Software Engineer',seniority:'Senior',seniority_ar:'متقدم',company:'Multinational',company_ar:'متعددة الجنسيات',country:'UAE',city:'Dubai',currency:'AED',monthlySalary:35000,bonus:50000,experience:'5-8 yrs',education:"Bachelor's"},
  {id:2,title:'Marketing Manager',seniority:'Mid-Level',seniority_ar:'متوسط',company:'Local Company',company_ar:'شركة محلية',country:'Saudi Arabia',city:'Riyadh',currency:'SAR',monthlySalary:18000,bonus:20000,experience:'3-5 yrs',education:"Bachelor's"},
  {id:3,title:'Product Manager',seniority:'Senior',seniority_ar:'متقدم',company:'Multinational',company_ar:'متعددة الجنسيات',country:'UAE',city:'Abu Dhabi',currency:'AED',monthlySalary:42000,bonus:60000,experience:'8-12 yrs',education:"Master's"},
  {id:4,title:'Financial Analyst',seniority:'Junior',seniority_ar:'مبتدئ',company:'Government',company_ar:'حكومة',country:'Kuwait',city:'Kuwait City',currency:'KWD',monthlySalary:1200,bonus:0,experience:'0-1 yrs',education:"Bachelor's"},
  {id:5,title:'HR Manager',seniority:'Manager',seniority_ar:'مدير',company:'Multinational',company_ar:'متعددة الجنسيات',country:'Egypt',city:'Cairo',currency:'EGP',monthlySalary:45000,bonus:30000,experience:'8-12 yrs',education:"Bachelor's"},
  {id:6,title:'Sales Executive',seniority:'Mid-Level',seniority_ar:'متوسط',company:'Local Company',company_ar:'شركة محلية',country:'Oman',city:'Muscat',currency:'OMR',monthlySalary:1800,bonus:5000,experience:'3-5 yrs',education:"Bachelor's"},
  {id:7,title:'Data Scientist',seniority:'Senior',seniority_ar:'متقدم',company:'Multinational',company_ar:'متعددة الجنسيات',country:'UAE',city:'Dubai',currency:'AED',monthlySalary:38000,bonus:45000,experience:'5-8 yrs',education:"Master's"},
  {id:8,title:'Civil Engineer',seniority:'Mid-Level',seniority_ar:'متوسط',company:'Government',company_ar:'حكومة',country:'Saudi Arabia',city:'Jeddah',currency:'SAR',monthlySalary:15000,bonus:10000,experience:'3-5 yrs',education:"Bachelor's"},
  {id:9,title:'Nurse',seniority:'Mid-Level',seniority_ar:'متوسط',company:'Government',company_ar:'حكومة',country:'Qatar',city:'Doha',currency:'QAR',monthlySalary:12000,bonus:8000,experience:'3-5 yrs',education:"Bachelor's"},
  {id:10,title:'Pharmacist',seniority:'Senior',seniority_ar:'متقدم',company:'Multinational',company_ar:'متعددة الجنسيات',country:'UAE',city:'Dubai',currency:'AED',monthlySalary:22000,bonus:15000,experience:'5-8 yrs',education:"Bachelor's"},
  {id:11,title:'Teacher',seniority:'Mid-Level',seniority_ar:'متوسط',company:'Government',company_ar:'حكومة',country:'Jordan',city:'Amman',currency:'JOD',monthlySalary:800,bonus:0,experience:'3-5 yrs',education:"Bachelor's"},
  {id:12,title:'Accountant',seniority:'Junior',seniority_ar:'مبتدئ',company:'Local Company',company_ar:'شركة محلية',country:'Bahrain',city:'Manama',currency:'BHD',monthlySalary:600,bonus:2000,experience:'1-3 yrs',education:"Bachelor's"},
];

const COUNTRIES = ['UAE','Saudi Arabia','Egypt','Oman','Kuwait','Qatar','Bahrain','Jordan','Lebanon','Iraq'];
const LEVELS_EN = ['Junior','Mid-Level','Senior','Lead','Manager','Director','C-Suite'];
const LEVELS_AR = ['مبتدئ','متوسط','متقدم','قائد','مدير','مدير أول','الإدارة العليا'];
const TYPES_EN = ['Multinational','Local Company','Government','Family Business'];
const TYPES_AR = ['متعددة الجنسيات','شركة محلية','حكومة','شركة عائلية'];

export default function Explore() {
  const { lang, isAr } = useLang();
  const txt = t[lang];
  const [search, setSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [openDropdown, setOpenDropdown] = useState(null);
  const [countrySearch, setCountrySearch] = useState('');

  const LEVELS = lang==='ar' ? LEVELS_AR : LEVELS_EN;
  const TYPES = lang==='ar' ? TYPES_AR : TYPES_EN;

  const filtered = SAMPLE_DATA.filter(d => {
    const q = search.toLowerCase();
    const matchSearch = !q || d.title.toLowerCase().includes(q) || d.country.toLowerCase().includes(q) || d.city.toLowerCase().includes(q);
    const matchCountry = !countryFilter || d.country === countryFilter;
    const matchLevel = !levelFilter || d.seniority === levelFilter || d.seniority_ar === levelFilter;
    const matchCompany = !companyFilter || d.company === companyFilter || d.company_ar === companyFilter;
    return matchSearch && matchCountry && matchLevel && matchCompany;
  });

  const hasFilters = countryFilter || levelFilter || companyFilter;

  const dropdown = (id, label, value, options, onSelect, searchable) => (
    <div style={{position:'relative',flex:1}}>
      <div onClick={()=>setOpenDropdown(openDropdown===id?null:id)}
        style={{background:'#13131f',border:'1px solid #2a2a3e',borderRadius:'10px',padding:'12px 16px',cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center',userSelect:'none'}}>
        <span style={{fontSize:'12px',fontWeight:'700',color:'#606070',textTransform:'uppercase',letterSpacing:'0.5px'}}>{label}</span>
        <span style={{fontSize:'14px',color:'#fff',fontWeight:'600'}}>{value || (id==='country'?txt.all_countries:id==='level'?txt.all_levels:txt.all_types)} ▾</span>
      </div>
      {openDropdown===id && (
        <div style={{position:'absolute',top:'100%',left:0,right:0,background:'#13131f',border:'1px solid #2a2a3e',borderRadius:'10px',zIndex:50,marginTop:'4px',maxHeight:'220px',overflowY:'auto'}}>
          {searchable && (
            <div style={{padding:'8px'}}>
              <input autoFocus placeholder={txt.country_search} value={countrySearch} onChange={e=>setCountrySearch(e.target.value)}
                style={{width:'100%',background:'#0a0a0f',border:'1px solid #2a2a3e',borderRadius:'8px',padding:'8px 12px',color:'#fff',fontSize:'13px',outline:'none',boxSizing:'border-box'}}/>
            </div>
          )}
          <div onClick={()=>{onSelect('');setOpenDropdown(null);setCountrySearch('');}}
            style={{padding:'10px 16px',cursor:'pointer',color:'#606070',fontSize:'14px'}}
            onMouseEnter={e=>e.target.style.background='#1e1e2e'} onMouseLeave={e=>e.target.style.background='transparent'}>
            {id==='country'?txt.all_countries:id==='level'?txt.all_levels:txt.all_types}
          </div>
          {options.filter(o=>!countrySearch||o.toLowerCase().includes(countrySearch.toLowerCase())).map(o=>(
            <div key={o} onClick={()=>{onSelect(o);setOpenDropdown(null);setCountrySearch('');}}
              style={{padding:'10px 16px',cursor:'pointer',color:value===o?'#a78bfa':'#fff',fontSize:'14px',background:value===o?'rgba(99,102,241,0.1)':'transparent'}}
              onMouseEnter={e=>e.currentTarget.style.background='#1e1e2e'} onMouseLeave={e=>e.currentTarget.style.background=value===o?'rgba(99,102,241,0.1)':'transparent'}>
              {o}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div style={{fontFamily:'Inter,sans-serif',background:'#0a0a0f',minHeight:'100vh',color:'#fff'}} onClick={()=>setOpenDropdown(null)}>
      <Navbar/>

      <div style={{maxWidth:'900px',margin:'0 auto',padding:'60px 24px'}}>
        <div style={{marginBottom:'48px'}}>
          <h1 style={{fontSize:'40px',fontWeight:'900',marginBottom:'12px',background:'linear-gradient(135deg,#fff 0%,#a78bfa 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>{txt.explore_title}</h1>
          <p style={{color:'#606070',fontSize:'16px'}}>{txt.explore_sub}</p>
        </div>

        <div style={{background:'#13131f',border:'1px solid #1e1e2e',borderRadius:'16px',padding:'20px',marginBottom:'32px'}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={txt.search_explore}
            style={{width:'100%',background:'transparent',border:'none',outline:'none',color:'#fff',fontSize:'16px',marginBottom:'16px',boxSizing:'border-box',textAlign:isAr?'right':'left'}}/>
          <div style={{display:'flex',gap:'12px'}} onClick={e=>e.stopPropagation()}>
            {dropdown('country',txt.country_filter,countryFilter,COUNTRIES,setCountryFilter,true)}
            {dropdown('level',txt.level_filter,levelFilter,LEVELS,setLevelFilter,false)}
            {dropdown('company',txt.company_filter,companyFilter,TYPES,setCompanyFilter,false)}
          </div>
        </div>

        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
          <span style={{color:'#606070',fontSize:'14px'}}>{filtered.length} {txt.results_found}</span>
          {hasFilters && (
            <button onClick={()=>{setCountryFilter('');setLevelFilter('');setCompanyFilter('');}}
              style={{background:'transparent',border:'1px solid #2a2a3e',color:'#a0a0b0',borderRadius:'8px',padding:'6px 14px',fontSize:'13px',cursor:'pointer'}}>
              {txt.clear_filters}
            </button>
          )}
        </div>

        {filtered.length===0 ? (
          <div style={{textAlign:'center',padding:'80px',color:'#404050'}}>
            <div style={{fontSize:'48px',marginBottom:'16px'}}>🔍</div>
            <p>{txt.no_results}</p>
          </div>
        ) : (
          <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
            {filtered.map(d=>(
              <div key={d.id} style={{background:'#13131f',border:'1px solid #1e1e2e',borderRadius:'16px',padding:'24px',display:'flex',justifyContent:'space-between',alignItems:'center',transition:'border-color 0.2s'}}
                onMouseEnter={e=>e.currentTarget.style.borderColor='#6366f1'}
                onMouseLeave={e=>e.currentTarget.style.borderColor='#1e1e2e'}>
                <div>
                  <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'8px'}}>
                    <h3 style={{margin:0,fontSize:'17px',fontWeight:'700'}}>{d.title}</h3>
                    <span style={{background:'rgba(99,102,241,0.2)',color:'#a78bfa',padding:'3px 10px',borderRadius:'50px',fontSize:'12px',fontWeight:'600'}}>
                      {lang==='ar'?d.seniority_ar:d.seniority}
                    </span>
                  </div>
                  <div style={{display:'flex',gap:'16px',flexWrap:'wrap'}}>
                    <span style={{color:'#606070',fontSize:'13px'}}>📍 {d.city}, {d.country}</span>
                    <span style={{color:'#606070',fontSize:'13px'}}>🏢 {lang==='ar'?d.company_ar:d.company}</span>
                    <span style={{color:'#606070',fontSize:'13px'}}>⏱ {d.experience}</span>
                    <span style={{color:'#606070',fontSize:'13px'}}>🎓 {d.education}</span>
                  </div>
                </div>
                <div style={{textAlign:isAr?'left':'right',flexShrink:0,marginLeft:isAr?0:'24px',marginRight:isAr?'24px':0}}>
                  <div style={{fontSize:'22px',fontWeight:'800',color:'#a78bfa'}}>{d.currency} {d.monthlySalary.toLocaleString()}</div>
                  <div style={{color:'#606070',fontSize:'12px'}}>{txt.per_month}</div>
                  {d.bonus>0 && <div style={{color:'#404050',fontSize:'12px'}}>+ {d.currency} {d.bonus.toLocaleString()} {txt.yr_bonus}</div>}
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{marginTop:'60px',background:'linear-gradient(135deg,rgba(99,102,241,0.15),rgba(139,92,246,0.1))',border:'1px solid rgba(99,102,241,0.3)',borderRadius:'20px',padding:'48px',textAlign:'center'}}>
          <h2 style={{fontSize:'28px',fontWeight:'800',marginBottom:'12px'}}>{txt.explore_cta_title}</h2>
          <p style={{color:'#a0a0b0',fontSize:'16px',marginBottom:'28px'}}>{txt.explore_cta_sub}</p>
          <a href="/submit" style={{display:'inline-block',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',textDecoration:'none',borderRadius:'12px',padding:'14px 32px',fontWeight:'700',fontSize:'15px'}}>{txt.explore_cta_btn}</a>
        </div>
      </div>
    </div>
  );
}