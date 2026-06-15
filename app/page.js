'use client';
import { useState } from 'react';

export default function Home() {
  const [lang, setLang] = useState('en');
  const [searchQuery, setSearchQuery] = useState('');

  const t = {
    en: {
      nav_explore: 'Explore Salaries',
      nav_submit: 'Submit Your Salary',
      nav_coach: 'AI Coach',
      nav_companies: 'Companies',
      toggle: 'العربية',
      hero_title: 'Know Your Worth.',
      hero_sub: 'The first anonymous salary platform built for the MENA region. Real salaries. Real packages. No fluff.',
      search_placeholder: 'Search by job title, company, or country...',
      search_btn: 'Search',
      stats_1: '0',
      stats_1_label: 'Salary Entries',
      stats_2: '12',
      stats_2_label: 'Countries',
      stats_3: '50+',
      stats_3_label: 'Industries',
      submit_cta: 'Submit Your Salary Anonymously',
      submit_sub: 'No account needed. Takes 90 seconds. Help others know their worth.',
      submit_btn: 'Get Started →',
      features_title: 'Everything Glassdoor missed about MENA',
      f1_title: 'Full Package Breakdown',
      f1_desc: 'Base salary, housing, transport, bonus, flight tickets — the complete picture.',
      f2_title: 'AI Negotiation Coach',
      f2_desc: 'Get a personalized script to negotiate your next offer based on real market data.',
      f3_title: 'Arabic & English',
      f3_desc: 'Built for the region. Switch between Arabic and English anytime.',
      f4_title: '100% Anonymous',
      f4_desc: 'No account required to submit. Your company is always optional.',
      footer_copy: '© 2026 SalaryMENA. Built for the region.',
    },
    ar: {
      nav_explore: 'استكشف الرواتب',
      nav_submit: 'شارك راتبك',
      nav_coach: 'مساعد AI',
      nav_companies: 'الشركات',
      toggle: 'English',
      hero_title: 'اعرف قيمتك.',
      hero_sub: 'أول منصة مجهولة الهوية للرواتب في منطقة الشرق الأوسط وشمال أفريقيا. رواتب حقيقية. باقات حقيقية.',
      search_placeholder: 'ابحث بالمسمى الوظيفي أو الشركة أو الدولة...',
      search_btn: 'بحث',
      stats_1: '0',
      stats_1_label: 'راتب مسجل',
      stats_2: '12',
      stats_2_label: 'دولة',
      stats_3: '+50',
      stats_3_label: 'قطاع',
      submit_cta: 'شارك راتبك بشكل مجهول',
      submit_sub: 'لا حساب مطلوب. يستغرق 90 ثانية. ساعد الآخرين على معرفة قيمتهم.',
      submit_btn: 'ابدأ الآن ←',
      features_title: 'كل ما فاتته Glassdoor عن منطقتنا',
      f1_title: 'تفاصيل الباقة الكاملة',
      f1_desc: 'الراتب الأساسي، السكن، المواصلات، المكافآت، تذاكر السفر — الصورة الكاملة.',
      f2_title: 'مساعد التفاوض بالذكاء الاصطناعي',
      f2_desc: 'احصل على نص شخصي للتفاوض على عرضك القادم بناءً على بيانات السوق الحقيقية.',
      f3_title: 'عربي وإنجليزي',
      f3_desc: 'مبني للمنطقة. تبديل بين العربية والإنجليزية في أي وقت.',
      f4_title: 'مجهول الهوية 100%',
      f4_desc: 'لا حساب مطلوب للمشاركة. اسم شركتك دائماً اختياري.',
      footer_copy: '© 2026 SalaryMENA. مبني للمنطقة.',
    }
  };

  const text = t[lang];
  const isAr = lang === 'ar';

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} style={{ fontFamily: 'Inter, sans-serif', background: '#0a0a0f', minHeight: '100vh', color: '#fff' }}>

      {/* NAVBAR */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', borderBottom: '1px solid #1e1e2e', position: 'sticky', top: 0, background: 'rgba(10,10,15,0.95)', backdropFilter: 'blur(10px)', zIndex: 100 }}>
        <div style={{ fontSize: '22px', fontWeight: '800', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          SalaryMENA
        </div>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          {[text.nav_explore, text.nav_submit, text.nav_coach, text.nav_companies].map((item, i) => (
            <a key={i} href="#" style={{ color: '#a0a0b0', textDecoration: 'none', fontSize: '14px', fontWeight: '500', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = '#fff'}
              onMouseLeave={e => e.target.style.color = '#a0a0b0'}>
              {item}
            </a>
          ))}
          <button onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
            {text.toggle}
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ textAlign: 'center', padding: '120px 40px 80px', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'inline-block', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '50px', padding: '6px 16px', fontSize: '13px', color: '#a78bfa', marginBottom: '24px', fontWeight: '500' }}>
          🚀 Now live — MENA&apos;s first salary transparency platform
        </div>
        <h1 style={{ fontSize: '72px', fontWeight: '900', lineHeight: 1.1, marginBottom: '24px', background: 'linear-gradient(135deg, #fff 0%, #a78bfa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {text.hero_title}
        </h1>
        <p style={{ fontSize: '20px', color: '#a0a0b0', lineHeight: 1.7, marginBottom: '48px', maxWidth: '600px', margin: '0 auto 48px' }}>
          {text.hero_sub}
        </p>

        {/* SEARCH BAR */}
        <div style={{ display: 'flex', gap: '12px', maxWidth: '600px', margin: '0 auto 64px', background: '#13131f', border: '1px solid #2a2a3e', borderRadius: '14px', padding: '8px 8px 8px 20px', alignItems: 'center' }}>
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={text.search_placeholder}
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '15px', textAlign: isAr ? 'right' : 'left' }}
          />
          <button style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 24px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {text.search_btn}
          </button>
        </div>

        {/* STATS */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '60px' }}>
          {[
            [text.stats_1, text.stats_1_label],
            [text.stats_2, text.stats_2_label],
            [text.stats_3, text.stats_3_label],
          ].map(([num, label], i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '36px', fontWeight: '800', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{num}</div>
              <div style={{ fontSize: '13px', color: '#606070', marginTop: '4px', fontWeight: '500' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '80px 40px', maxWidth: '1100px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: '36px', fontWeight: '800', marginBottom: '60px', color: '#fff' }}>
          {text.features_title}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
          {[
            ['💰', text.f1_title, text.f1_desc],
            ['🤖', text.f2_title, text.f2_desc],
            ['🌐', text.f3_title, text.f3_desc],
            ['🔒', text.f4_title, text.f4_desc],
          ].map(([icon, title, desc], i) => (
            <div key={i} style={{ background: '#13131f', border: '1px solid #1e1e2e', borderRadius: '16px', padding: '32px', transition: 'border-color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#6366f1'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#1e1e2e'}>
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>{icon}</div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px', color: '#fff' }}>{title}</h3>
              <p style={{ fontSize: '14px', color: '#606070', lineHeight: 1.7, margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SUBMIT CTA */}
      <section style={{ margin: '40px auto 80px', maxWidth: '700px', padding: '0 40px', textAlign: 'center' }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))', border: '1px solid rgba(99,102,241,0.4)', borderRadius: '24px', padding: '60px 40px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '16px' }}>{text.submit_cta}</h2>
          <p style={{ color: '#a0a0b0', fontSize: '16px', marginBottom: '32px' }}>{text.submit_sub}</p>
          <button style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', border: 'none', borderRadius: '12px', padding: '16px 36px', fontSize: '16px', fontWeight: '700', cursor: 'pointer' }}>
            {text.submit_btn}
          </button>
          <p style={{ marginTop: '20px', fontSize: '12px', color: '#404050' }}>
            Also try: <a href="https://cvdropai.com" target="_blank" rel="noreferrer" style={{ color: '#6366f1', textDecoration: 'none' }}>CVDropAI</a> — Polish your CV before you apply
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid #1e1e2e', padding: '32px 40px', textAlign: 'center', color: '#404050', fontSize: '13px' }}>
        {text.footer_copy}
      </footer>
    </div>
  );
}