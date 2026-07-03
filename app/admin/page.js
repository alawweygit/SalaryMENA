'use client';

import { useState, useEffect, useCallback } from 'react';

const ADMIN_PASSWORD = '3146';

const fmt = (n) => (n ?? 0).toLocaleString();
const ago = (d) => {
  const s = Math.floor((Date.now() - new Date(d)) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

const C = {
  bg: '#0f0f13', surface: '#17171f', border: '#2a2a38', accent: '#7c5cfc',
  accentLight: '#a78bfa', danger: '#ef4444', success: '#22c55e', warn: '#f59e0b',
  text: '#e2e2ef', muted: '#6b6b8a',
};

const Card = ({ children, style = {} }) => (
  <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: '20px 24px', ...style }}>{children}</div>
);

const Stat = ({ label, value, sub, color = C.accentLight }) => (
  <Card>
    <div style={{ color: C.muted, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{label}</div>
    <div style={{ color, fontSize: 32, fontWeight: 700, lineHeight: 1 }}>{value}</div>
    {sub && <div style={{ color: C.muted, fontSize: 12, marginTop: 6 }}>{sub}</div>}
  </Card>
);

const Tab = ({ label, active, onClick, badge }) => (
  <button onClick={onClick} style={{ background: active ? C.accent : 'transparent', color: active ? '#fff' : C.muted, border: `1px solid ${active ? C.accent : C.border}`, borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
    {label}
    {badge != null && <span style={{ background: active ? 'rgba(255,255,255,0.2)' : C.border, color: active ? '#fff' : C.muted, borderRadius: 999, padding: '1px 7px', fontSize: 11 }}>{badge}</span>}
  </button>
);

const BarChart = ({ data, colorFn }) => {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {data.map((d, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 110, fontSize: 12, color: C.muted, textAlign: 'right', flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.label}</div>
          <div style={{ flex: 1, background: C.border, borderRadius: 4, height: 20, overflow: 'hidden' }}>
            <div style={{ width: `${(d.value / max) * 100}%`, height: '100%', background: colorFn ? colorFn(i) : C.accent, borderRadius: 4 }} />
          </div>
          <div style={{ width: 40, fontSize: 12, color: C.text, textAlign: 'right', flexShrink: 0 }}>{fmt(d.value)}</div>
        </div>
      ))}
    </div>
  );
};

const DonutChart = ({ data }) => {
  const total = data.reduce((s, d) => s + d.value, 0);
  const colors = [C.accent, C.accentLight, C.warn, C.success, '#06b6d4', '#ec4899'];
  let cum = 0;
  const slices = data.map((d, i) => { const pct = (d.value / total) * 360; const start = cum; cum += pct; return { ...d, start, end: cum, color: colors[i % colors.length] }; });
  const toXY = (deg) => { const r = deg * Math.PI / 180; return [50 + 40 * Math.sin(r), 50 - 40 * Math.cos(r)]; };
  const arc = (s) => { const [sx, sy] = toXY(s.start); const [ex, ey] = toXY(s.end); const large = (s.end - s.start) > 180 ? 1 : 0; return `M 50 50 L ${sx} ${sy} A 40 40 0 ${large} 1 ${ex} ${ey} Z`; };
  return (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
      <svg viewBox="0 0 100 100" style={{ width: 140, height: 140, flexShrink: 0 }}>
        {slices.map((s, i) => <path key={i} d={arc(s)} fill={s.color} />)}
        <circle cx="50" cy="50" r="24" fill={C.surface} />
        <text x="50" y="53" textAnchor="middle" fill={C.text} fontSize="10" fontWeight="700">{fmt(total)}</text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {slices.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: s.color, flexShrink: 0 }} />
            <span style={{ color: C.muted, fontSize: 12 }}>{s.label}</span>
            <span style={{ color: C.text, fontSize: 12, fontWeight: 600 }}>{((s.value / total) * 100).toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const LineChart = ({ data }) => {
  if (!data?.length) return null;
  const vals = data.map(d => d.value);
  const max = Math.max(...vals, 1);
  const W = 400, H = 80;
  const pts = data.map((d, i) => [(i / (data.length - 1)) * W, H - (d.value / max) * (H - 10) - 5]);
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ');
  const area = `${path} L${W},${H} L0,${H} Z`;
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 80 }} preserveAspectRatio="none">
        <defs><linearGradient id="lg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.accent} stopOpacity="0.3" /><stop offset="100%" stopColor={C.accent} stopOpacity="0" /></linearGradient></defs>
        <path d={area} fill="url(#lg)" />
        <path d={path} fill="none" stroke={C.accent} strokeWidth="2" />
        {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="3" fill={C.accent} />)}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        {data.map((d, i) => (
          <div key={i} style={{ fontSize: 10, color: C.muted, textAlign: 'center' }}>
            <div>{d.label}</div>
            <div style={{ color: C.text, fontWeight: 600 }}>{d.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Badge = ({ label, color = C.accent }) => (
  <span style={{ background: `${color}22`, color, border: `1px solid ${color}55`, borderRadius: 999, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{label}</span>
);

const Table = ({ cols, rows, onDelete, emptyMsg = 'No records found.' }) => (
  <div style={{ overflowX: 'auto' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
      <thead>
        <tr>
          {cols.map(c => <th key={c.key} style={{ textAlign: 'left', padding: '10px 12px', color: C.muted, fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: `1px solid ${C.border}`, whiteSpace: 'nowrap' }}>{c.label}</th>)}
          {onDelete && <th style={{ borderBottom: `1px solid ${C.border}` }} />}
        </tr>
      </thead>
      <tbody>
        {rows.length === 0
          ? <tr><td colSpan={cols.length + (onDelete ? 1 : 0)} style={{ textAlign: 'center', padding: 32, color: C.muted }}>{emptyMsg}</td></tr>
          : rows.map((row, i) => (
            <tr key={row.id ?? i} style={{ borderBottom: `1px solid ${C.border}` }}>
              {cols.map(c => <td key={c.key} style={{ padding: '10px 12px', color: C.text, whiteSpace: c.wrap ? 'normal' : 'nowrap', maxWidth: c.maxW ?? 'none', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.render ? c.render(row[c.key], row) : (row[c.key] ?? '—')}</td>)}
              {onDelete && <td style={{ padding: '10px 12px', textAlign: 'right' }}><button onClick={() => onDelete(row.id)} style={{ background: 'transparent', border: `1px solid ${C.danger}`, color: C.danger, borderRadius: 6, padding: '4px 10px', fontSize: 12, cursor: 'pointer' }}>Delete</button></td>}
            </tr>
          ))}
      </tbody>
    </table>
  </div>
);

export default function AdminDashboard() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [pwError, setPwError] = useState('');
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [seedData, setSeedData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState({});
  const [search, setSearch] = useState('');
  const [filterCountry, setFilterCountry] = useState('');
  const [filterSeniority, setFilterSeniority] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };
  const setLoad = (key, val) => setLoading(prev => ({ ...prev, [key]: val }));
  const login = () => { if (pw === ADMIN_PASSWORD) setAuthed(true); else { setPwError('Wrong password.'); setPw(''); } };

  const fetchStats = useCallback(async () => {
    setLoad('stats', true);
    try { const r = await fetch(`/api/admin/stats?pw=${ADMIN_PASSWORD}`); setStats(await r.json()); } catch { showToast('Failed to load stats', 'error'); }
    setLoad('stats', false);
  }, []);

  const fetchSubmissions = useCallback(async () => {
    setLoad('submissions', true);
    try { const r = await fetch(`/api/admin/submissions?pw=${ADMIN_PASSWORD}`); const d = await r.json(); setSubmissions(d.records ?? []); } catch { showToast('Failed', 'error'); }
    setLoad('submissions', false);
  }, []);

  const fetchSeed = useCallback(async () => {
    setLoad('seed', true);
    try { const r = await fetch(`/api/admin/seed?pw=${ADMIN_PASSWORD}`); const d = await r.json(); setSeedData(d.records ?? []); } catch { showToast('Failed', 'error'); }
    setLoad('seed', false);
  }, []);

  const fetchAlerts = useCallback(async () => {
    setLoad('alerts', true);
    try { const r = await fetch(`/api/admin/alerts?pw=${ADMIN_PASSWORD}`); const d = await r.json(); setAlerts(d.records ?? []); } catch { showToast('Failed', 'error'); }
    setLoad('alerts', false);
  }, []);

  useEffect(() => {
    if (!authed) return;
    fetchStats(); fetchSubmissions(); fetchSeed(); fetchAlerts();
  }, [authed, fetchStats, fetchSubmissions, fetchSeed, fetchAlerts]);

  const doDelete = async () => {
    if (!confirmDelete) return;
    const { id, table } = confirmDelete;
    try {
      const r = await fetch(`/api/admin/${table}?pw=${ADMIN_PASSWORD}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
      if (!r.ok) throw new Error();
      showToast('Record deleted');
      if (table === 'submissions') { setSubmissions(p => p.filter(x => x.id !== id)); fetchStats(); }
      if (table === 'seed') { setSeedData(p => p.filter(x => x.id !== id)); fetchStats(); }
      if (table === 'alerts') setAlerts(p => p.filter(x => x.id !== id));
    } catch { showToast('Delete failed', 'error'); }
    setConfirmDelete(null);
  };

  const bulkDeleteSeed = async (seniority) => {
    try {
      const r = await fetch(`/api/admin/seed?pw=${ADMIN_PASSWORD}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ bulk: true, seniority }) });
      if (!r.ok) throw new Error();
      const d = await r.json();
      showToast(`Deleted ${d.count} seed records`);
      fetchSeed(); fetchStats();
    } catch { showToast('Bulk delete failed', 'error'); }
  };

  const filteredSubs = submissions.filter(r => {
    const q = search.toLowerCase();
    return (!q || r.job_title?.toLowerCase().includes(q) || r.company_name?.toLowerCase().includes(q) || r.country?.toLowerCase().includes(q)) && (!filterCountry || r.country === filterCountry) && (!filterSeniority || r.seniority === filterSeniority);
  });

  const filteredSeed = seedData.filter(r => {
    const q = search.toLowerCase();
    return (!q || r.job_title?.toLowerCase().includes(q) || r.country?.toLowerCase().includes(q)) && (!filterCountry || r.country === filterCountry) && (!filterSeniority || r.seniority === filterSeniority);
  });

  const allCountries = [...new Set([...submissions, ...seedData].map(r => r.country).filter(Boolean))].sort();
  const seniorities = ['Junior', 'Mid-Level', 'Senior', 'Senior+', 'Manager', 'Director', 'C-Suite'];

  if (!authed) return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ width: 340 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: C.text }}>Salary<span style={{ color: C.accent }}>MENA</span></div>
          <div style={{ color: C.muted, fontSize: 14, marginTop: 4 }}>Admin Dashboard</div>
        </div>
        <Card>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', color: C.muted, fontSize: 12, marginBottom: 6, fontWeight: 600 }}>PASSWORD</label>
            <input type="password" value={pw} onChange={e => { setPw(e.target.value); setPwError(''); }} onKeyDown={e => e.key === 'Enter' && login()} placeholder="Enter admin password"
              style={{ width: '100%', background: C.bg, border: `1px solid ${pwError ? C.danger : C.border}`, borderRadius: 8, padding: '10px 12px', color: C.text, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} autoFocus />
            {pwError && <div style={{ color: C.danger, fontSize: 12, marginTop: 6 }}>{pwError}</div>}
          </div>
          <button onClick={login} style={{ width: '100%', background: C.accent, color: '#fff', border: 'none', borderRadius: 8, padding: '11px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Sign In</button>
        </Card>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: 'system-ui, -apple-system, sans-serif', color: C.text }}>
      {toast && <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, background: toast.type === 'error' ? C.danger : C.success, color: '#fff', borderRadius: 8, padding: '12px 20px', fontSize: 13, fontWeight: 600, boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>{toast.msg}</div>}

      {confirmDelete && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <Card style={{ width: 360 }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8, color: C.danger }}>Confirm Delete</div>
            <div style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>Delete <strong style={{ color: C.text }}>{confirmDelete.label}</strong>? This cannot be undone.</div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setConfirmDelete(null)} style={{ flex: 1, background: 'transparent', border: `1px solid ${C.border}`, color: C.muted, borderRadius: 8, padding: '9px', fontSize: 13, cursor: 'pointer' }}>Cancel</button>
              <button onClick={doDelete} style={{ flex: 1, background: C.danger, border: 'none', color: '#fff', borderRadius: 8, padding: '9px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Delete</button>
            </div>
          </Card>
        </div>
      )}

      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: '0 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
        <div style={{ fontWeight: 800, fontSize: 18 }}>Salary<span style={{ color: C.accent }}>MENA</span><span style={{ color: C.muted, fontWeight: 400, fontSize: 13, marginLeft: 12 }}>Admin</span></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <a href="https://salarymena.com" target="_blank" rel="noreferrer" style={{ color: C.muted, fontSize: 12, textDecoration: 'none' }}>↗ View Site</a>
          <button onClick={() => setAuthed(false)} style={{ background: 'transparent', border: `1px solid ${C.border}`, color: C.muted, borderRadius: 6, padding: '5px 12px', fontSize: 12, cursor: 'pointer' }}>Sign Out</button>
        </div>
      </div>

      <div style={{ padding: '16px 28px', borderBottom: `1px solid ${C.border}`, display: 'flex', gap: 8, flexWrap: 'wrap', background: C.surface }}>
        {[{ id: 'overview', label: 'Overview' }, { id: 'submissions', label: 'Real Submissions', badge: submissions.length }, { id: 'seed', label: 'Seed Data', badge: seedData.length }, { id: 'alerts', label: 'Alerts', badge: alerts.length }, { id: 'charts', label: 'Charts' }]
          .map(t => <Tab key={t.id} label={t.label} active={tab === t.id} onClick={() => setTab(t.id)} badge={t.badge} />)}
      </div>

      <div style={{ padding: '24px 28px', maxWidth: 1200, margin: '0 auto' }}>

        {tab === 'overview' && (
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Overview</div>
            {loading.stats ? <div style={{ color: C.muted }}>Loading…</div> : (<>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
                <Stat label="Total Records" value={fmt(stats?.total)} sub="All salaries in DB" />
                <Stat label="Real Submissions" value={fmt(stats?.real)} sub="From actual users" color={C.success} />
                <Stat label="Seed Records" value={fmt(stats?.seed)} sub="Synthetic data" color={C.muted} />
                <Stat label="Alert Subscribers" value={fmt(stats?.alert_count)} sub="Email subscribers" color={C.warn} />
                <Stat label="Countries" value={fmt(stats?.country_count)} sub="Covered" color={C.accentLight} />
                <Stat label="Today" value={fmt(stats?.today)} sub="Submissions today" color={C.success} />
                <Stat label="This Week" value={fmt(stats?.this_week)} sub="Last 7 days" color={C.accentLight} />
                <Stat label="This Month" value={fmt(stats?.this_month)} sub="Last 30 days" color={C.accentLight} />
              </div>
              <Card style={{ marginBottom: 24 }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>⚡ Pending Tasks</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {['Homepage stat "50+ Industries" → should be "20+ Professions"', 'Per-page SEO meta titles missing', 'LinkedIn / WhatsApp / Reddit marketing not executed', '@salarymena Instagram not created', 'Reddit account needs 7 days before posting', 'Pagination on explore page (currently loads all 12k+ records)']
                    .map((t, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: C.bg, borderRadius: 8 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.warn, flexShrink: 0 }} />
                        <span style={{ fontSize: 13, color: C.muted }}>{t}</span>
                      </div>
                    ))}
                </div>
              </Card>
              {stats?.recent?.length > 0 && (
                <Card>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Recent Submissions</div>
                  <Table cols={[{ key: 'job_title', label: 'Job Title' }, { key: 'country', label: 'Country' }, { key: 'monthly_salary', label: 'Salary', render: (v, r) => `${r.currency ?? ''} ${fmt(v)}` }, { key: 'seniority', label: 'Seniority', render: v => <Badge label={v} /> }, { key: 'created_at', label: 'When', render: v => ago(v) }]} rows={stats.recent} />
                </Card>
              )}
            </>)}
          </div>
        )}

        {tab === 'submissions' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
              <div style={{ fontSize: 20, fontWeight: 700 }}>Real Submissions <span style={{ color: C.muted, fontSize: 14, fontWeight: 400 }}>({filteredSubs.length} shown)</span></div>
              <button onClick={fetchSubmissions} style={{ background: 'transparent', border: `1px solid ${C.border}`, color: C.muted, borderRadius: 6, padding: '6px 14px', fontSize: 12, cursor: 'pointer' }}>↻ Refresh</button>
            </div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search job, company, country…" style={{ flex: 1, minWidth: 200, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: '8px 12px', color: C.text, fontSize: 13, outline: 'none' }} />
              <select value={filterCountry} onChange={e => setFilterCountry(e.target.value)} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: '8px 12px', color: C.text, fontSize: 13, outline: 'none' }}>
                <option value="">All countries</option>
                {allCountries.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={filterSeniority} onChange={e => setFilterSeniority(e.target.value)} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: '8px 12px', color: C.text, fontSize: 13, outline: 'none' }}>
                <option value="">All levels</option>
                {seniorities.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {(search || filterCountry || filterSeniority) && <button onClick={() => { setSearch(''); setFilterCountry(''); setFilterSeniority(''); }} style={{ background: 'transparent', border: `1px solid ${C.border}`, color: C.muted, borderRadius: 8, padding: '8px 12px', fontSize: 12, cursor: 'pointer' }}>Clear</button>}
            </div>
            {loading.submissions ? <div style={{ color: C.muted }}>Loading…</div> : (
              <Card style={{ padding: 0, overflow: 'hidden' }}>
                <Table
                  cols={[{ key: 'id', label: 'ID', render: v => <span style={{ color: C.muted, fontSize: 11 }}>#{v}</span> }, { key: 'job_title', label: 'Job Title', maxW: 180 }, { key: 'company_name', label: 'Company', maxW: 140 }, { key: 'country', label: 'Country' }, { key: 'seniority', label: 'Level', render: v => <Badge label={v} /> }, { key: 'monthly_salary', label: 'Salary', render: (v, r) => `${r.currency ?? ''} ${fmt(v)}` }, { key: 'experience', label: 'Exp', render: v => v ? `${v}yr` : '—' }, { key: 'email', label: 'Email', maxW: 160 }, { key: 'created_at', label: 'When', render: v => ago(v) }]}
                  rows={filteredSubs}
                  onDelete={(id) => { const r = submissions.find(x => x.id === id); setConfirmDelete({ id, table: 'submissions', label: `${r?.job_title ?? 'Record'} from ${r?.country ?? ''}` }); }}
                  emptyMsg="No real submissions yet."
                />
              </Card>
            )}
          </div>
        )}

        {tab === 'seed' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
              <div style={{ fontSize: 20, fontWeight: 700 }}>Seed Data <span style={{ color: C.muted, fontSize: 14, fontWeight: 400 }}>({filteredSeed.length} shown)</span></div>
              <button onClick={fetchSeed} style={{ background: 'transparent', border: `1px solid ${C.border}`, color: C.muted, borderRadius: 6, padding: '6px 14px', fontSize: 12, cursor: 'pointer' }}>↻ Refresh</button>
            </div>
            <Card style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Bulk Delete by Seniority</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['Manager', 'Director', 'C-Suite'].map(s => (
                  <button key={s} onClick={() => bulkDeleteSeed(s)} style={{ background: `${C.danger}11`, border: `1px solid ${C.danger}44`, color: C.danger, borderRadius: 8, padding: '7px 14px', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>Delete all {s} seed</button>
                ))}
              </div>
              <div style={{ color: C.muted, fontSize: 11, marginTop: 8 }}>Permanently removes matching seed records.</div>
            </Card>
            <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search job title, country…" style={{ flex: 1, minWidth: 200, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: '8px 12px', color: C.text, fontSize: 13, outline: 'none' }} />
              <select value={filterCountry} onChange={e => setFilterCountry(e.target.value)} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: '8px 12px', color: C.text, fontSize: 13, outline: 'none' }}>
                <option value="">All countries</option>
                {allCountries.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={filterSeniority} onChange={e => setFilterSeniority(e.target.value)} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: '8px 12px', color: C.text, fontSize: 13, outline: 'none' }}>
                <option value="">All levels</option>
                {seniorities.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            {loading.seed ? <div style={{ color: C.muted }}>Loading…</div> : (
              <Card style={{ padding: 0, overflow: 'hidden' }}>
                <Table
                  cols={[{ key: 'id', label: 'ID', render: v => <span style={{ color: C.muted, fontSize: 11 }}>#{v}</span> }, { key: 'job_title', label: 'Job Title', maxW: 180 }, { key: 'country', label: 'Country' }, { key: 'seniority', label: 'Level', render: v => <Badge label={v} /> }, { key: 'company_type', label: 'Type' }, { key: 'monthly_salary', label: 'Salary', render: (v, r) => `${r.currency ?? ''} ${fmt(v)}` }]}
                  rows={filteredSeed}
                  onDelete={(id) => { const r = seedData.find(x => x.id === id); setConfirmDelete({ id, table: 'seed', label: `Seed: ${r?.job_title ?? 'Record'} in ${r?.country ?? ''}` }); }}
                />
              </Card>
            )}
          </div>
        )}

        {tab === 'alerts' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ fontSize: 20, fontWeight: 700 }}>Alert Subscribers <span style={{ color: C.muted, fontSize: 14, fontWeight: 400 }}>({alerts.length})</span></div>
              <button onClick={fetchAlerts} style={{ background: 'transparent', border: `1px solid ${C.border}`, color: C.muted, borderRadius: 6, padding: '6px 14px', fontSize: 12, cursor: 'pointer' }}>↻ Refresh</button>
            </div>
            {loading.alerts ? <div style={{ color: C.muted }}>Loading…</div> : (
              <Card style={{ padding: 0, overflow: 'hidden' }}>
                <Table
                  cols={[{ key: 'id', label: 'ID', render: v => <span style={{ color: C.muted, fontSize: 11 }}>#{v}</span> }, { key: 'email', label: 'Email', maxW: 200 }, { key: 'job_title', label: 'Job Title' }, { key: 'country', label: 'Country' }, { key: 'category', label: 'Category' }, { key: 'created_at', label: 'Subscribed', render: v => ago(v) }]}
                  rows={alerts}
                  onDelete={(id) => { const r = alerts.find(x => x.id === id); setConfirmDelete({ id, table: 'alerts', label: `Alert for ${r?.email ?? ''}` }); }}
                  emptyMsg="No alert subscribers yet."
                />
              </Card>
            )}
          </div>
        )}

        {tab === 'charts' && (
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Charts & Analytics</div>
            {loading.stats ? <div style={{ color: C.muted }}>Loading…</div> : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
                <Card style={{ gridColumn: '1 / -1' }}>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Submissions Over Time (last 14 days)</div>
                  <LineChart data={stats?.daily_submissions ?? []} />
                </Card>
                <Card>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Top Countries</div>
                  <BarChart data={(stats?.country_breakdown ?? []).slice(0, 10).map(r => ({ label: r.country, value: parseInt(r.count) }))} colorFn={(i) => `hsl(${260 - i * 18}, 70%, ${60 + i * 2}%)`} />
                </Card>
                <Card>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Seniority Distribution</div>
                  <DonutChart data={(stats?.seniority_breakdown ?? []).map(r => ({ label: r.seniority, value: parseInt(r.count) }))} />
                </Card>
                <Card>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Top Job Titles</div>
                  <BarChart data={(stats?.top_jobs ?? []).slice(0, 10).map(r => ({ label: r.job_title, value: parseInt(r.count) }))} colorFn={() => C.accentLight} />
                </Card>
                <Card>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Private vs Government</div>
                  <DonutChart data={(stats?.company_type_breakdown ?? []).map(r => ({ label: r.company_type, value: parseInt(r.count) }))} />
                </Card>
              </div>
            )}
          </div>
        )}

      </div>
      <style>{`* { box-sizing: border-box; }`}</style>
    </div>
  );
}
