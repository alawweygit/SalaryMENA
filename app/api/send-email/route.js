import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { email, jobTitle, country, monthlySalary, currency, type, result, nationalityType, housingProvided, carProvided } = await req.json();

    const benefits = [housingProvided && '🏠 Housing', carProvided && '🚗 Car'].filter(Boolean).join(' + ');
    const fmt = (n) => Math.round(n).toLocaleString();

    let subject = 'Your salary has been submitted — SalaryMENA';
    let content = '';

    if (type === 'underpaid' && result) {
      subject = `Your Salary Analysis: ${result.verdict} — SalaryMENA`;
      content = `
        <div style="background:#13131f;border:1px solid #2a2a3e;border-radius:12px;padding:24px;margin-bottom:24px;">
          <div style="text-align:center;margin-bottom:20px;">
            <div style="font-size:13px;color:${result.verdictColor};font-weight:700;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px;">MARKET VERDICT</div>
            <div style="font-size:32px;font-weight:900;color:#ffffff;">${result.verdict === 'Below Market' ? '⚠️' : result.verdict === 'Above Market' ? '🚀' : '✅'} ${result.verdict}</div>
            <div style="color:#606070;font-size:14px;margin-top:8px;">${jobTitle} · ${country} · ${nationalityType}</div>
            ${benefits ? `<div style="color:#10b981;font-size:13px;margin-top:6px;">${benefits} included</div>` : ''}
          </div>
          <div style="display:flex;justify-content:space-between;gap:8px;margin-bottom:20px;">
            <div style="flex:1;background:#0a0a0f;border-radius:10px;padding:14px;text-align:center;border:1px solid #ef444430;">
              <div style="font-size:10px;color:#606070;font-weight:700;margin-bottom:4px;">MARKET LOW</div>
              <div style="font-size:16px;font-weight:800;color:#ef4444;">${currency} ${fmt(result.marketLow)}</div>
            </div>
            <div style="flex:1;background:#0a0a0f;border-radius:10px;padding:14px;text-align:center;border:1px solid #6366f130;">
              <div style="font-size:10px;color:#606070;font-weight:700;margin-bottom:4px;">MEDIAN</div>
              <div style="font-size:16px;font-weight:800;color:#6366f1;">${currency} ${fmt(result.marketMedian)}</div>
            </div>
            <div style="flex:1;background:#0a0a0f;border-radius:10px;padding:14px;text-align:center;border:1px solid #10b98130;">
              <div style="font-size:10px;color:#606070;font-weight:700;margin-bottom:4px;">MARKET HIGH</div>
              <div style="font-size:16px;font-weight:800;color:#10b981;">${currency} ${fmt(result.marketHigh)}</div>
            </div>
          </div>
          <div style="background:#0a0a0f;border-radius:10px;padding:16px;margin-bottom:12px;">
            <div style="font-size:11px;color:#606070;font-weight:700;margin-bottom:8px;">YOUR SALARY</div>
            <div style="font-size:24px;font-weight:900;color:${result.verdictColor};">${currency} ${fmt(monthlySalary)}/month</div>
          </div>
        </div>
        <div style="background:#13131f;border:1px solid #2a2a3e;border-radius:12px;padding:24px;margin-bottom:24px;">
          <div style="font-size:11px;color:#6366f1;font-weight:700;letter-spacing:1.5px;margin-bottom:12px;">🤖 AI MARKET ANALYSIS</div>
          <p style="color:#c0c0d0;font-size:15px;line-height:1.8;margin:0 0 10px;">${result.summary}</p>
          <p style="color:#a78bfa;font-size:14px;line-height:1.7;margin:0;font-style:italic;">${result.advice}</p>
        </div>
      `;
    } else if (type === 'coach' && result) {
      subject = `Your Negotiation Script for ${jobTitle} — SalaryMENA`;
      const sections = ['VERDICT','MARKET ASSESSMENT','YOUR NEGOTIATION SCRIPT','3 TALKING POINTS','RECOMMENDED COUNTER OFFER'];
      const formattedScript = result.split('\n').map(line => {
        if (sections.includes(line.trim())) {
          return `<div style="font-size:11px;font-weight:800;color:#6366f1;text-transform:uppercase;letter-spacing:1.5px;margin-top:24px;margin-bottom:8px;">${line.trim()}</div>`;
        }
        if (!line.trim()) return '<div style="height:8px;"></div>';
        return `<p style="color:#c0c0d0;font-size:15px;line-height:1.8;margin:0 0 4px;">${line}</p>`;
      }).join('');

      content = `
        <div style="background:#13131f;border:1px solid #2a2a3e;border-radius:12px;padding:24px;margin-bottom:24px;">
          <div style="margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid #1e1e2e;">
            <div style="font-size:13px;color:#606070;">Role: <strong style="color:#fff;">${jobTitle}</strong> · ${country}</div>
            <div style="font-size:13px;color:#606070;margin-top:4px;">Offered: <strong style="color:#a78bfa;">${currency} ${fmt(monthlySalary)}/month</strong>${benefits ? ` + ${benefits}` : ''}</div>
          </div>
          ${formattedScript}
        </div>
      `;
    } else {
      content = `
        <div style="background:#13131f;border:1px solid #2a2a3e;border-radius:12px;padding:24px;margin-bottom:24px;">
          <p style="color:#606070;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:16px;">What you submitted</p>
          <div style="margin-bottom:8px;display:flex;justify-content:space-between;">
            <span style="color:#a0a0b0;">Role</span>
            <span style="color:#ffffff;font-weight:600;">${jobTitle}</span>
          </div>
          <div style="margin-bottom:8px;display:flex;justify-content:space-between;">
            <span style="color:#a0a0b0;">Country</span>
            <span style="color:#ffffff;font-weight:600;">${country}</span>
          </div>
          <div style="display:flex;justify-content:space-between;">
            <span style="color:#a0a0b0;">Monthly Salary</span>
            <span style="color:#a78bfa;font-weight:800;">${currency} ${Number(monthlySalary).toLocaleString()}</span>
          </div>
          ${benefits ? `<div style="margin-top:8px;display:flex;justify-content:space-between;"><span style="color:#a0a0b0;">Benefits</span><span style="color:#10b981;font-weight:600;">${benefits}</span></div>` : ''}
        </div>
        <p style="color:#a0a0b0;font-size:15px;line-height:1.7;">We will notify you when new salary data is added for your role in ${country}.</p>
      `;
    }

    await resend.emails.send({
      from: 'SalaryMENA <support@cvdropai.com>',
      to: email,
      subject,
      html: `
        <div style="font-family:Inter,sans-serif;background:#0a0a0f;color:#ffffff;padding:32px;max-width:600px;margin:0 auto;border-radius:16px;">
          <div style="margin-bottom:24px;display:flex;align-items:center;gap:12px;">
            <img src="https://salarymena.com/logo-email.png" width="44" height="44" alt="SalaryMENA logo" style="border-radius:8px;"/>
            <div>
              <span style="font-size:20px;font-weight:900;color:#ffffff;">Salary</span><span style="font-size:20px;font-weight:900;color:#8b5cf6;">MENA</span>
            </div>
          </div>
          <h1 style="font-size:24px;font-weight:800;margin-bottom:8px;color:#ffffff;">
            ${type==='underpaid'?'Your Salary Analysis 📊':type==='coach'?'Your Negotiation Script 🤖':'Thank you! 🎉'}
          </h1>
          <p style="color:#a0a0b0;font-size:15px;line-height:1.7;margin-bottom:24px;">
            ${type==='underpaid'?'Here is your full salary market analysis.':type==='coach'?'Here is your word-for-word negotiation script.':'Your salary has been submitted anonymously and is now helping others in the MENA region know their worth.'}
          </p>
          ${content}
          <a href="https://salarymena.com/explore" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#ffffff;text-decoration:none;border-radius:10px;padding:12px 24px;font-weight:700;font-size:14px;margin-bottom:24px;">Explore Salaries →</a>
          <div style="border-top:1px solid #1e1e2e;padding-top:20px;">
            <p style="color:#404050;font-size:12px;margin:0;">© 2026 SalaryMENA · <a href="https://salarymena.com" style="color:#6366f1;text-decoration:none;">salarymena.com</a></p>
          </div>
        </div>
      `
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}