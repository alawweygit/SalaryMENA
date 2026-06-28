'use client';
import Navbar from '../components/Navbar';

export default function Privacy() {
  return (
    <div style={{fontFamily:'Inter,sans-serif',background:'#0a0a0f',minHeight:'100vh',color:'#fff'}}>
      <Navbar/>
      <div style={{maxWidth:'720px',margin:'0 auto',padding:'60px 24px'}}>
        <h1 style={{fontSize:'36px',fontWeight:'900',marginBottom:'8px'}}>Privacy Policy</h1>
        <p style={{color:'#606070',fontSize:'14px',marginBottom:'48px'}}>Last updated: June 2026</p>
        {[
          {title:'1. What We Collect',body:'When you submit a salary, we collect your job title, country, company type, salary details, experience, education, nationality type, and optionally your email address, gender, city, and company name. We do not collect your full name, passport, or any government ID.'},
          {title:'2. How We Use It',body:'Salary data is used to power the Explore Salaries page, the Am I Underpaid tool, and the AI Negotiation Coach. If you provide your email, we use it to send you a salary report and notify you when new salaries are added for your role.'},
          {title:'3. Anonymity',body:'All salary submissions are displayed anonymously. Your email address is never shown publicly. We do not link your email to any displayed salary data.'},
          {title:'4. Data Sharing',body:'We do not sell your data to third parties. We use Anthropic Claude for AI analysis, Resend for email delivery, and Railway for database hosting. These services process data solely to operate SalaryMENA.'},
          {title:'5. Data Retention',body:'Salary data is retained indefinitely. If you wish to have your data removed, contact us at support@salarymena.com and we will delete it within 7 days.'},
          {title:'6. Cookies',body:'We use minimal cookies only for session management. We do not use advertising or tracking cookies.'},
          {title:'7. Contact',body:'For any privacy concerns, email us at support@salarymena.com.'},
        ].map((s,i)=>(
          <div key={i} style={{marginBottom:'36px'}}>
            <h2 style={{fontSize:'18px',fontWeight:'800',marginBottom:'10px',color:'#a78bfa'}}>{s.title}</h2>
            <p style={{color:'#a0a0b0',fontSize:'15px',lineHeight:1.8}}>{s.body}</p>
          </div>
        ))}
      </div>
      <div style={{borderTop:'1px solid #1e1e2e',padding:'24px',textAlign:'center',color:'#404050',fontSize:'13px'}}>
        2026 SalaryMENA · <a href="/" style={{color:'#606070',textDecoration:'none'}}>Home</a>
      </div>
    </div>
  );
}
