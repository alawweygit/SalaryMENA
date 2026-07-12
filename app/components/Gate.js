'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Gate({ children }) {
  const [hasAccess, setHasAccess] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    let access = null; try { access = localStorage.getItem("salarymena_access"); } catch(e) { access = "true"; }
    setHasAccess(!!access);
  }, []);

  const grantAccess = () => {
    localStorage.setItem('salarymena_access', 'true');
    setHasAccess(true);
  };

  const publicPages = ['/', '/submit'];
  if (publicPages.includes(pathname)) return children;
  if (hasAccess === null) return children;
  if (hasAccess) return children;

  const pageMessages = {
    '/explore': {
      icon: '🔍',
      title: 'See what others earn',
      desc: 'To browse real salaries across the MENA region, share yours first. It takes 90 seconds and is completely anonymous.',
    },
    '/coach': {
      icon: '🤖',
      title: 'Unlock your AI Negotiation Coach',
      desc: 'To get a personalized salary negotiation script, share your current salary first. It helps us give you accurate advice.',
    },
  };

  const message = pageMessages[pathname] || {
    icon: '🔒',
    title: 'Share your salary to continue',
    desc: 'SalaryMENA is built on sharing. Share your salary first to get full access. It takes 90 seconds and is completely anonymous.',
  };

  return (
    <div style={{fontFamily:'Inter,sans-serif',background:'#0a0a0f',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',padding:'20px'}}>
      <style>{`
        @media(max-width:768px){
          .gate-title{font-size:24px!important}
          .gate-desc{font-size:14px!important}
          .gate-icon{font-size:40px!important}
        }
      `}</style>
      <div style={{maxWidth:'520px',width:'100%',textAlign:'center'}}>
        <div className="gate-icon" style={{fontSize:'48px',marginBottom:'20px'}}>{message.icon}</div>
        <h1 className="gate-title" style={{fontSize:'32px',fontWeight:'800',marginBottom:'16px'}}>{message.title}</h1>
        <p className="gate-desc" style={{color:'#a0a0b0',fontSize:'16px',lineHeight:1.7,marginBottom:'32px'}}>{message.desc}</p>
        <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
          <a href="/submit" style={{display:'block',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',textDecoration:'none',borderRadius:'12px',padding:'16px',fontSize:'16px',fontWeight:'700'}}>
            Share My Salary → Get Full Access
          </a>
          <button onClick={grantAccess}
            style={{background:'transparent',border:'1px solid #2a2a3e',color:'#a0a0b0',borderRadius:'12px',padding:'16px',fontSize:'15px',cursor:'pointer',fontWeight:'500'}}>
            I have never been employed
          </button>
        </div>
        <p style={{marginTop:'20px',fontSize:'12px',color:'#404050'}}>
          Your salary is never shown individually. Always anonymous.
        </p>
      </div>
    </div>
  );
}