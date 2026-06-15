'use client';
import { useState, useRef, useEffect } from 'react';

const SAMPLE_DATA = [
  {id:1,title:'Software Engineer',seniority:'Senior',company:'Multinational',country:'UAE',city:'Dubai',currency:'AED',monthlySalary:35000,basicSalary:20000,bonus:50000,experience:'5-8',education:"Bachelor's",nationalityType:'Western Expat'},
  {id:2,title:'Marketing Manager',seniority:'Mid-Level',company:'Local Company',country:'Saudi Arabia',city:'Riyadh',currency:'SAR',monthlySalary:18000,basicSalary:12000,bonus:20000,experience:'3-5',education:"Bachelor's",nationalityType:'GCC National'},
  {id:3,title:'Finance Analyst',seniority:'Junior',company:'Government',country:'UAE',city:'Abu Dhabi',currency:'AED',monthlySalary:12000,basicSalary:8000,bonus:0,experience:'1-3',education:"Bachelor's",nationalityType:'Arab (Non-GCC)'},
  {id:4,title:'Product Manager',seniority:'Senior',company:'Multinational',country:'UAE',city:'Dubai',currency:'AED',monthlySalary:42000,basicSalary:25000,bonus:80000,experience:'8-12',education:"Master's",nationalityType:'Western Expat'},
  {id:5,title:'HR Manager',seniority:'Manager',company:'Family Business',country:'Egypt',city:'Cairo',currency:'EGP',monthlySalary:45000,basicSalary:30000,bonus:60000,experience:'8-12',education:"Bachelor's",nationalityType:'Local National'},
  {id:6,title:'Software Engineer',seniority:'Mid-Level',company:'Multinational',country:'Saudi Arabia',city:'Jeddah',currency:'SAR',monthlySalary:22000,basicSalary:15000,bonus:25000,experience:'3-5',education:"Bachelor's",nationalityType:'Asian Expat'},
  {id:7,title:'Sales Executive',seniority:'Junior',company:'Local Company',country:'Oman',city:'Muscat',currency:'OMR',monthlySalary:1200,basicSalary:800,bonus:2000,experience:'1-3',education:"Bachelor's",nationalityType:'Local National'},
  {id:8,title:'Data Scientist',seniority:'Senior',company:'Multinational',country:'UAE',city:'Dubai',currency:'AED',monthlySalary:38000,basicSalary:22000,bonus:60000,experience:'5-8',education:"Master's",nationalityType:'Asian Expat'},
  {id:9,title:'Civil Engineer',seniority:'Mid-Level',company:'Government',country:'Kuwait',city:'Kuwait City',currency:'KWD',monthlySalary:1800,basicSalary:1200,bonus:1500,experience:'3-5',education:"Bachelor's",nationalityType:'GCC National'},
  {id:10,title:'Doctor',seniority:'Senior',company:'Government',country:'Saudi Arabia',city:'Riyadh',currency:'SAR',monthlySalary:32000,basicSalary:22000,bonus:40000,experience:'8-12',education:'PhD',nationalityType:'Arab (Non-GCC)'},
  {id:11,title:'Graphic Designer',seniority:'Junior',company:'Local Company',country:'Jordan',city:'Amman',currency:'JOD',monthlySalary:800,basicSalary:600,bonus:500,experience:'1-3',education:"Bachelor's",nationalityType:'Local National'},
  {id:12,title:'Operations Manager',seniority:'Manager',company:'Multinational',country:'UAE',city:'Dubai',currency:'AED',monthlySalary:28000,basicSalary:18000,bonus:35000,experience:'8-12',education:"Bachelor's",nationalityType:'Western Expat'},
];

const COUNTRIES = ['All Countries','UAE','Saudi Arabia','Egypt','Oman','Kuwait','Qatar','Bahrain','Jordan','Lebanon','Iraq','Syria','Yemen','Libya','Tunisia','Algeria','Morocco','Sudan','Somalia','Comoros','Djibouti','Mauritania','Palestine'];
const SENIORITIES = ['All Levels','Junior','Mid-Level','Senior','Lead','Manager','Director','C-Suite'];
const COMPANY_TYPES = ['All Types','Multinational','Local Company','Government','Family Business'];

function Dropdown({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => { if(ref.current && !ref.current.contains(e.target)) { setOpen(false); setSearch(''); } };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isActive = value !== options[0];
  const filtered = options.filter(o => o.toLowerCase().includes(search.toLowerCase()));

  return (
    <div ref={ref} style={{position:'relative',flex:1,minWidth:'160px'}}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width:'100%',
          background: isActive ? 'rgba(99,102,241,0.15)' : '#13131f',
          border: isActive ? '1px solid rgba(99,102,241,0.5)' : '1px solid #2a2a3e',
          borderRadius:'12px',padding:'12px 16px',color: isActive ? '#a78bfa' : '#a0a0b0',
          fontSize:'14px',fontWeight:'500',cursor:'pointer',
          display:'flex',justifyContent:'space-between',alignItems:'center',gap:'8px',
          transition:'all 0.2s'
        }}>
        <span style={{fontSize:'11px',fontWeight:'700',textTransform:'uppercase',letterSpacing:'0.5px',color:isActive?'#a78bfa':'#404050',whiteSpace:'nowrap'}}>{label}</span>
        <span style={{color:isActive?'#a78bfa':'#fff',fontWeight:'600',fontSize:'13px',flex:1,textAlign:'left',paddingLeft:'8px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{value}</span>
        <span style={{color:'#404050',fontSize:'10px',transform:open?'rotate(180deg)':'rotate(0)',transition:'transform 0.2s',flexShrink:0}}>▼</span>
      </button>

      {open && (
        <div style={{
          position:'absolute',top:'calc(100% + 8px)',left:0,right:0,
          background:'#13131f',border:'1px solid #2a2a3e',borderRadius:'14px',
          zIndex:200,boxShadow:'0 20px 60px rgba(0,0,0,0.7)',
          display:'flex',flexDirection:'column',overflow:'hidden'
        }}>
          {options.length > 6 && (
            <div style={{padding:'10px 12px',borderBottom:'1px solid #1e1e2e'}}>
              <input
                autoFocus
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                onClick={e => e.stopPropagation()}
                style={{width:'100%',background:'#0a0a0f',border:'1px solid #2a2a3e',borderRadius:'8px',padding:'8px 12px',color:'#fff',fontSize:'13px',outline:'none',boxSizing:'border-box'}}
              />
            </div>
          )}
          <div style={{maxHeight:'220px',overflowY:'auto',overscrollBehavior:'contain'}}>
            {filtered.map(opt => (
              <button key={opt}
                onClick={() => { onChange(opt); setOpen(false); setSearch(''); }}
                style={{
                  width:'100%',
                  background: value===opt ? 'rgba(99,102,241,0.15)' : 'transparent',
                  border:'none',padding:'11px 16px',
                  color: value===opt ? '#a78bfa' : '#a0a0b0',
                  fontSize:'14px',fontWeight: value===opt ? '600' : '400',
                  cursor:'pointer',textAlign:'left',
                  display:'flex',justifyContent:'space-between',alignItems:'center',
                  transition:'background 0.1s'
                }}
                onMouseEnter={e => { if(value!==opt) e.currentTarget.style.background='rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { if(value!==opt) e.currentTarget.style.background='transparent'; }}>
                {opt}
                {value===opt && <span style={{fontSize:'12px',color:'#6366f1'}}>✓</span>}
              </button>
            ))}
            {filtered.length===0 && <p style={{color:'#404050',fontSize:'13px',padding:'12px 16px',margin:0}}>No results</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Explore() {
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('All Countries');
  const [seniority, setSeniority] = useState('All Levels');
  const [companyType, setCompanyType] = useState('All Types');

  const filtered = SAMPLE_DATA.filter(d => {
    const q = search.toLowerCase();
    const matchSearch = !q || d.title.toLowerCase().includes(q) || d.city.toLowerCase().includes(q) || d.country.toLowerCase().includes(q);
    const matchCountry = country==='All Countries' || d.country===country;
    const matchSeniority = seniority==='All Levels' || d.seniority===seniority;
    const matchCompany = companyType==='All Types' || d.company===companyType;
    return matchSearch && matchCountry && matchSeniority && matchCompany;
  });

  return (
    <div style={{fontFamily:'Inter,sans-serif',background:'#0a0a0f',minHeight:'100vh',color:'#fff'}}>

      <nav style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'20px 40px',borderBottom:'1px solid #1e1e2e',position:'sticky',top:0,background:'rgba(10,10,15,0.95)',backdropFilter:'blur(10px)',zIndex:100}}>
        <a href="/" style={{fontSize:'22px',fontWeight:'800',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',textDecoration:'none'}}>SalaryMENA</a>
        <div style={{display:'flex',gap:'16px',alignItems:'center'}}>
          <a href="/explore" style={{color:'#fff',textDecoration:'none',fontSize:'14px',fontWeight:'600'}}>Explore</a>
          <a href="/submit" style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',textDecoration:'none',borderRadius:'8px',padding:'8px 16px',fontSize:'13px',fontWeight:'600'}}>Submit Salary</a>
        </div>
      </nav>

      <div style={{maxWidth:'1100px',margin:'0 auto',padding:'40px 24px'}}>

        <div style={{marginBottom:'32px'}}>
          <h1 style={{fontSize:'36px',fontWeight:'800',marginBottom:'8px'}}>Explore Salaries</h1>
          <p style={{color:'#606070',fontSize:'16px',margin:0}}>Real salaries submitted anonymously across the MENA region.</p>
        </div>

        <div style={{background:'#0d0d18',border:'1px solid #1e1e2e',borderRadius:'20px',padding:'24px',marginBottom:'32px',display:'flex',flexDirection:'column',gap:'16px'}}>
          <input
            style={{width:'100%',background:'#13131f',border:'1px solid #2a2a3e',borderRadius:'12px',padding:'14px 18px',color:'#fff',fontSize:'15px',outline:'none',boxSizing:'border-box'}}
            placeholder="🔍  Search by job title, city or country..."
            value={search} onChange={e=>setSearch(e.target.value)}
          />
          <div style={{display:'flex',gap:'12px',flexWrap:'wrap'}}>
            <Dropdown label="Country" options={COUNTRIES} value={country} onChange={setCountry}/>
            <Dropdown label="Level" options={SENIORITIES} value={seniority} onChange={setSeniority}/>
            <Dropdown label="Company" options={COMPANY_TYPES} value={companyType} onChange={setCompanyType}/>
          </div>
          {(country!=='All Countries'||seniority!=='All Levels'||companyType!=='All Types') && (
            <button onClick={()=>{setCountry('All Countries');setSeniority('All Levels');setCompanyType('All Types');}}
              style={{background:'transparent',border:'none',color:'#6366f1',fontSize:'13px',cursor:'pointer',textAlign:'left',padding:0,fontWeight:'500'}}>
              ✕ Clear all filters
            </button>
          )}
        </div>

        <p style={{color:'#404050',fontSize:'13px',marginBottom:'16px',fontWeight:'500'}}>{filtered.length} result{filtered.length!==1?'s':''} found</p>

        <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
          {filtered.length===0?(
            <div style={{textAlign:'center',padding:'80px 20px',color:'#404050'}}>
              <div style={{fontSize:'48px',marginBottom:'16px'}}>🔍</div>
              <p style={{fontSize:'16px'}}>No results found. Try different filters.</p>
            </div>
          ):filtered.map(d=>(
            <div key={d.id}
              style={{background:'#13131f',border:'1px solid #1e1e2e',borderRadius:'16px',padding:'24px',display:'flex',justifyContent:'space-between',alignItems:'center',gap:'20px',transition:'border-color 0.2s,background 0.2s',cursor:'pointer'}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor='#6366f1';e.currentTarget.style.background='#15151f'}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor='#1e1e2e';e.currentTarget.style.background='#13131f'}}>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'10px',flexWrap:'wrap'}}>
                  <h3 style={{margin:0,fontSize:'17px',fontWeight:'700'}}>{d.title}</h3>
                  <span style={{background:'rgba(99,102,241,0.15)',color:'#a78bfa',borderRadius:'50px',padding:'3px 12px',fontSize:'12px',fontWeight:'600',whiteSpace:'nowrap'}}>{d.seniority}</span>
                </div>
                <div style={{display:'flex',gap:'20px',flexWrap:'wrap'}}>
                  <span style={{color:'#505060',fontSize:'13px'}}>📍 {d.city}, {d.country}</span>
                  <span style={{color:'#505060',fontSize:'13px'}}>🏢 {d.company}</span>
                  <span style={{color:'#505060',fontSize:'13px'}}>⏱ {d.experience} yrs exp</span>
                  <span style={{color:'#505060',fontSize:'13px'}}>🎓 {d.education}</span>
                </div>
              </div>
              <div style={{textAlign:'right',flexShrink:0}}>
                <div style={{fontSize:'22px',fontWeight:'800',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',whiteSpace:'nowrap'}}>
                  {d.currency} {d.monthlySalary.toLocaleString()}
                </div>
                <div style={{color:'#404050',fontSize:'12px',marginTop:'2px'}}>per month</div>
                {d.bonus>0&&<div style={{color:'#505060',fontSize:'12px',marginTop:'2px'}}>+ {d.currency} {d.bonus.toLocaleString()} / yr bonus</div>}
              </div>
            </div>
          ))}
        </div>

        <div style={{marginTop:'48px',background:'linear-gradient(135deg,rgba(99,102,241,0.12),rgba(139,92,246,0.12))',border:'1px solid rgba(99,102,241,0.25)',borderRadius:'20px',padding:'40px',textAlign:'center'}}>
          <h3 style={{fontSize:'22px',fontWeight:'800',marginBottom:'10px'}}>Know your salary? Share it anonymously.</h3>
          <p style={{color:'#606070',fontSize:'15px',marginBottom:'24px',maxWidth:'500px',margin:'0 auto 24px'}}>Every submission helps someone in MENA negotiate a better offer. Takes 90 seconds.</p>
          <a href="/submit" style={{display:'inline-block',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',textDecoration:'none',borderRadius:'12px',padding:'14px 32px',fontWeight:'700',fontSize:'15px'}}>Submit Your Salary →</a>
        </div>
      </div>
    </div>
  );
}
