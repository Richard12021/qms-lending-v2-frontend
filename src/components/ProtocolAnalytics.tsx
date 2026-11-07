import { useState } from "react";
import { Activity, RefreshCw, TrendingUp, Users } from "lucide-react";
import { useProtocolAnalytics } from "../hooks/useProtocolAnalytics";

export default function ProtocolAnalytics() {
  const { data, loading, error, refresh } = useProtocolAnalytics();
  const [range, setRange] = useState<7|30|90>(30);
  const points = data?.growth.slice(-range) ?? [];
  const max = Math.max(1, ...points.map(p => Math.max(p.total,p.daily)));
  const x = (i:number) => 24 + i * 752 / Math.max(1, points.length - 1);
  const y = (n:number) => 200 - n * 174 / max;
  const path = (field: "total" | "daily") => points.map((p,i) => `${i===0?"M":"L"}${x(i).toFixed(1)},${y(p[field]).toFixed(1)}`).join(" ");
  return <section style={{marginTop:28,marginBottom:32}}>
    <div className="section-heading"><h2>Protocol User Analytics</h2><button className="text-button" onClick={refresh} disabled={loading}><RefreshCw size={15}/> {loading?"Indexing…":"Refresh analytics"}</button></div>
    <div className="stats-grid">
      <div className="stat-card"><div style={{display:"flex",gap:8,alignItems:"center"}}><Users size={17}/> Total Users</div><h2>{data?.totalUsers ?? "—"}</h2><small>Unique wallets ever participating</small></div>
      <div className="stat-card"><div style={{display:"flex",gap:8,alignItems:"center"}}><Activity size={17}/> Active Positions</div><h2>{data?.activePositions ?? "—"}</h2><small>Wallets with non-zero supply, collateral or debt</small></div>
      <div className="stat-card"><div style={{display:"flex",gap:8,alignItems:"center"}}><TrendingUp size={17}/> New Users Today</div><h2>{data?.newToday ?? "—"}</h2><small>First-time wallets (UTC)</small></div>
    </div>
    <div style={{marginTop:18,padding:22,border:"1px solid var(--border, #343044)",borderRadius:14,background:"var(--card-bg, rgba(120,100,180,.06))"}}>
      <div style={{display:"flex",justifyContent:"space-between",gap:12,flexWrap:"wrap",alignItems:"center"}}><strong>User Growth</strong><div style={{display:"flex",gap:8}}>{([7,30,90] as const).map(n=><button key={n} onClick={()=>setRange(n)} style={{padding:"7px 12px",borderRadius:8,border:"1px solid #6d57a5",background:range===n?"#6e4fc6":"transparent",color:"inherit",cursor:"pointer"}}>{n}D</button>)}</div></div>
      {error ? <p role="alert">Analytics temporarily unavailable. The QMS RPC may limit historical log queries. No partial counts are shown.</p> : !data ? <p>{loading?"Reading historical on-chain activity…":"No analytics data available"}</p> : <>
        <svg viewBox="0 0 800 230" role="img" aria-label="Daily total users and daily transaction-active wallets" style={{width:"100%",height:"auto",marginTop:14}}>
          {[0,0.25,0.5,0.75,1].map(t=><g key={t}><line x1="24" x2="776" y1={y(max*t)} y2={y(max*t)} stroke="currentColor" opacity=".12"/><text x="0" y={y(max*t)+4} fontSize="11" fill="currentColor" opacity=".6">{Math.round(max*t)}</text></g>)}
          <path d={path("total")} stroke="#9876ff" strokeWidth="3" fill="none" strokeLinejoin="round" strokeLinecap="round"/>
          <path d={path("daily")} stroke="#37c9a4" strokeWidth="2.5" fill="none" strokeLinejoin="round" strokeLinecap="round"/>
        </svg>
        <div style={{display:"flex",justifyContent:"space-between",gap:12,fontSize:12,opacity:.8}}><span>{points[0]?.date}</span><span>{points[points.length-1]?.date}</span></div>
        <div style={{display:"flex",gap:20,flexWrap:"wrap",marginTop:12,fontSize:13}}><span style={{color:"#9876ff"}}>● Total Users (cumulative)</span><span style={{color:"#37c9a4"}}>● Daily Active Users (transactions)</span></div>
        <p style={{fontSize:12,opacity:.7,marginTop:10}}>UTC days · On-chain events since block 266707 · Indexed through block {data.indexedBlock}. Daily Active Users means wallets that transacted that day; Active Positions means wallets with a current open position.</p>
      </>}
    </div>
  </section>;
}
