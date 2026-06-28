'use client';
import Navbar from '../components/Navbar';

export default function Contact() {
  return (
    <div style={{fontFamily:'Inter,sans-serif',background:'#0a0a0f',minHeight:'100vh',color:'#fff'}}>
      <Navbar/>
      <div style={{maxWidth:'600px',margin:'0 auto',padding:'80px 24px',textAlign:'center'}}>
        <div style={{fontSize:'48px',marginBottom:'20px'}}>✉️</div>
        <h1 style={{fontSize:'36px',fontWeight:'900',marginBottom:'12px'}}>Contact Us</h1>
        <p style={{color:'#a0a0b0',fontSize:'16px',lineHeight:1.8,marginBottom:'40px'}}>Have a question or feedback? We would love to hear from you.</p>
        <a href="mailto:support@salarymena.com" style={{display:'inline-block',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',textDecoration:'none',borderRadius:'12px',padding:'16px 36px',fontWeight:'700',fontSize:'16px',marginBottom:'40px'}}>support@salarymena.com</a>
        <div style={{display:'flex',flexDirection:'column',gap:'16px',textAlign:'left',background:'#13131f',border:'1px solid #1e1e2e',borderRadius:'16px',padding:'24px',marginTop:'20px'}}>
          {[
            {icon:'🐛',title:'Bug Reports',desc:'Found something broken? Let us know and we will fix it fast.'},
            {icon:'💡',title:'Feature Requests',desc:'Have an idea to make SalaryMENA better? We are all ears.'},
            {icon:'🔒',title:'Privacy Requests',desc:'Want your data removed? Email us and we will handle it within 7 days.'},
            {icon:'🤝',title:'Partnerships',desc:'Interested in working with us? Reach out and lets talk.'},
          ].map((item,i)=>(
            <div key={i} style={{display:'flex',gap:'16px',alignItems:'flex-start',paddingBottom:i<3?'16px':'0',borderBottom:i<3?'1px solid #1e1e2e':'none'}}>
              <div style={{fontSize:'20px'}}>{item.icon}</div>
              <div>
                <div style={{fontWeight:'700',fontSize:'14px',marginBottom:'4px'}}>{item.title}</div>
                <div style={{color:'#606070',fontSize:'13px'}}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{borderTop:'1px solid #1e1e2e',padding:'24px',textAlign:'center',color:'#404050',fontSize:'13px'}}>
        2026 SalaryMENA · <a href="/" style={{color:'#606070',textDecoration:'none'}}>Home</a>
      </div>
    </div>
  );
}
