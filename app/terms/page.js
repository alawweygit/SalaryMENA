'use client';
import Navbar from '../components/Navbar';

export default function Terms() {
  return (
    <div style={{fontFamily:'Inter,sans-serif',background:'#0a0a0f',minHeight:'100vh',color:'#fff'}}>
      <Navbar/>
      <div style={{maxWidth:'720px',margin:'0 auto',padding:'60px 24px'}}>
        <h1 style={{fontSize:'36px',fontWeight:'900',marginBottom:'8px'}}>Terms of Service</h1>
        <p style={{color:'#606070',fontSize:'14px',marginBottom:'48px'}}>Last updated: June 2026</p>
        {[
          {title:'1. Acceptance',body:'By using SalaryMENA, you agree to these terms. If you do not agree, please do not use the platform.'},
          {title:'2. What SalaryMENA Is',body:'SalaryMENA is a free, anonymous salary transparency platform for the MENA region.'},
          {title:'3. Accuracy of Data',body:'All salary data is self-reported by users. SalaryMENA does not verify the accuracy of submitted salaries. The AI tools provide estimates only and should not be treated as professional advice.'},
          {title:'4. Your Submissions',body:'By submitting a salary, you confirm the information is accurate. You agree not to submit false or misleading data.'},
          {title:'5. Prohibited Use',body:'You may not scrape data, submit fake salaries, attempt to identify individual users, or use the platform for any unlawful purpose.'},
          {title:'6. AI Tools',body:'The Am I Underpaid and AI Negotiation Coach tools generate market estimates for informational purposes only. Always consult a qualified professional before making career or financial decisions.'},
          {title:'7. Intellectual Property',body:'All content, design, and code on SalaryMENA is owned by Lunave LLC. You may not copy or redistribute any part without written permission.'},
          {title:'8. Limitation of Liability',body:'SalaryMENA is provided as-is. We are not liable for any decisions made based on information from this platform.'},
          {title:'9. Changes',body:'We may update these terms at any time. Continued use constitutes acceptance of the new terms.'},
          {title:'10. Contact',body:'For questions about these terms, email support@salarymena.com.'},
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
