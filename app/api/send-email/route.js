import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { email, jobTitle, country, monthlySalary, currency } = await req.json();

    await resend.emails.send({
      from: 'SalaryMENA <hello@cvdropai.com>',
      to: email,
      subject: 'Your salary has been submitted — SalaryMENA',
      html: `
        <div style="font-family:Inter,sans-serif;background:#0a0a0f;color:#ffffff;padding:40px;max-width:600px;margin:0 auto;border-radius:16px;">
          <div style="margin-bottom:32px;">
            <span style="font-size:24px;font-weight:900;color:#ffffff;">Salary</span><span style="font-size:24px;font-weight:900;background:linear-gradient(135deg,#6366f1,#8b5cf6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">MENA</span>
          </div>
          <h1 style="font-size:28px;font-weight:800;margin-bottom:8px;color:#ffffff;">Thank you! 🎉</h1>
          <p style="color:#a0a0b0;font-size:16px;line-height:1.7;margin-bottom:32px;">Your salary has been submitted anonymously and is now helping others in the MENA region know their worth.</p>
          
          <div style="background:#13131f;border:1px solid #2a2a3e;border-radius:12px;padding:24px;margin-bottom:32px;">
            <p style="color:#606070;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:16px;">What you submitted</p>
            <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
              <span style="color:#a0a0b0;">Role</span>
              <span style="color:#ffffff;font-weight:600;">${jobTitle}</span>
            </div>
            <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
              <span style="color:#a0a0b0;">Country</span>
              <span style="color:#ffffff;font-weight:600;">${country}</span>
            </div>
            <div style="display:flex;justify-content:space-between;">
              <span style="color:#a0a0b0;">Monthly Salary</span>
              <span style="color:#a78bfa;font-weight:800;">${currency} ${Number(monthlySalary).toLocaleString()}</span>
            </div>
          </div>

          <div style="margin-bottom:32px;">
            <p style="color:#a0a0b0;font-size:15px;line-height:1.7;">We will notify you when new salary data is added for your role in ${country}. In the meantime, explore what others earn:</p>
          </div>

          <a href="https://salarymena.com/explore" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#ffffff;text-decoration:none;border-radius:10px;padding:14px 28px;font-weight:700;font-size:15px;margin-bottom:32px;">Explore Salaries →</a>

          <div style="border-top:1px solid #1e1e2e;padding-top:24px;">
            <p style="color:#404050;font-size:12px;">You are receiving this because you submitted your salary on SalaryMENA. Your data is 100% anonymous.</p>
            <p style="color:#404050;font-size:12px;">© 2026 SalaryMENA · <a href="https://salarymena.com" style="color:#6366f1;text-decoration:none;">salarymena.com</a></p>
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
