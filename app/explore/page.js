'use client';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useLang } from '../components/LanguageContext';
import { t } from '../components/translations';

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
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/explore')
      .then(r => r.json())
      .then(res => { setData(res.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const LEVELS = lang==='ar' ? LEVELS_AR : LEVELS_EN;
  const TYPES = lang==='ar' ? TYPES_AR : TYPES_EN;

  const filtered = data.filter(d => {
    const q = search.toLowerCase();
    const matchSearch = !q || (d.title||'').toLowerCase().includes(q) || (d.country||'').toLowerCase().includes(q) || (d.city||'').toLowerCase().includes(q);
    const matchCountry = !countryFilter || d.country === countryFilter;
    const matchLevel = !levelFilter || d.seniority === levelFilter || d.seniority_ar === levelFilter;
    const matchCompany = !companyFilter || d.company === companyFilter || d.company_ar === companyFilter;
    return matchSearch && matchCountry && matchLevel && matchCompany;
  });

  const hasFilters = countryFilter || levelFilter || companyFilter;

  const dropdown = (id, label, value, options, onSelect, searchable) => (
    <div style={{position:'relative',flex:1,minWidth:'0'}}>
      <div onClick={()=>setOpenDropdown(openDropdown===id?null:id)}
        style={{background:'#13131f',border:'1px solid #2a2a3e',borderRadius:'10px',padding:'10px 12px',cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center',userSelect:'none'}}>
        <span style={{fontSize:'11px',fontWeight:'700',color:'#606070',textTransform:'uppercase',letterSpacing:'0.5px',whiteSpace:'nowrap'}}>{label}</span>
        <span style={{fontSize:'13px',color:'#fff',fontWeight:'600',marginLeft:'8px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{value || (id==='country'?txt.all_countries:id==='level'?txt.all_levels:txt.all_types)} ▾</span>
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
        <div style={{marginBottom:'32px'}}>
          <h1 className="explore-title" style={{fontSize:'40px',fontWeight:'900',marginBottom:'12px',background:'linear-gradient(135deg,#fff 0%,#a78bfa 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>{txt.explore_title}</h1>
          <p style={{color:'#606070',fontSize:'15px'}}>{txt.explore_sub}</p>
        </div>

        <div style={{background:'#13131f',border:'1px solid #1e1e2e',borderRadius:'16px',padding:'16px',marginBottom:'24px'}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={txt.search_explore}
            style={{width:'100%',background:'transparent',border:'none',outline:'none',color:'#fff',fontSize:'15px',marginBottom:'12px',boxSizing:'border-box',textAlign:isAr?'right':'left'}}/>
          <div className="explore-filters" style={{display:'flex',gap:'8px'}} onClick={e=>e.stopPropagation()}>
            {dropdown('country',txt.country_filter,countryFilter,COUNTRIES,setCountryFilter,true)}
            {dropdown('level',txt.level_filter,levelFilter,LEVELS,setLevelFilter,false)}
            {dropdown('company',txt.company_filter,companyFilter,TYPES,setCompanyFilter,false)}
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
                    {(d.city||d.country) && <span style={{color:'#606070',fontSize:'12px'}}>📍 {[d.city,d.country].filter(Boolean).join(', ')}</span>}
                    {d.company && <span style={{color:'#606070',fontSize:'12px'}}>🏢 {d.company}</span>}
                    {d.experience && <span style={{color:'#606070',fontSize:'12px'}}>⏱ {d.experience}</span>}
                    {d.education && <span style={{color:'#606070',fontSize:'12px'}}>🎓 {d.education}</span>}
                  </div>
                </div>
                <div className="explore-salary" style={{textAlign:isAr?'left':'right',flexShrink:0,marginLeft:isAr?0:'16px',marginRight:isAr?'16px':0}}>
                  <div style={{fontSize:'20px',fontWeight:'800',color:'#a78bfa'}}>{d.currency} {Number(d.monthlySalary).toLocaleString()}</div>
                  <div style={{color:'#606070',fontSize:'12px'}}>{txt.per_month}</div>
                  {d.bonus>0 && <div style={{color:'#404050',fontSize:'11px'}}>+ {d.currency} {Number(d.bonus).toLocaleString()} {txt.yr_bonus}</div>}
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