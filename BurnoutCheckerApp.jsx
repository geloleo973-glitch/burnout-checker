import { useState, useEffect, useCallback, useRef } from "react";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  body,#root{
    font-family:'Plus Jakarta Sans',sans-serif;
    background:#080507;color:#F0E6D3;
    min-height:100dvh;-webkit-font-smoothing:antialiased;overflow-x:hidden;
  }

  @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes popIn{0%{opacity:0;transform:scale(.3) rotate(-10deg)}65%{transform:scale(1.22) rotate(4deg)}100%{opacity:1;transform:scale(1) rotate(0)}}
  @keyframes slideInR{from{opacity:0;transform:translateX(60px)}to{opacity:1;transform:translateX(0)}}
  @keyframes slideOutL{from{opacity:1;transform:translateX(0)}to{opacity:0;transform:translateX(-60px)}}
  @keyframes screenIn{from{opacity:0;transform:translateY(18px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes floatBob{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-10px) rotate(4deg)}}
  @keyframes shimmer{from{background-position:200% center}to{background-position:-200% center}}
  @keyframes tickPop{0%{transform:scale(0) rotate(-20deg);opacity:0}70%{transform:scale(1.35) rotate(5deg)}100%{transform:scale(1) rotate(0);opacity:1}}
  @keyframes loadDot{0%,80%,100%{transform:scale(0);opacity:0}40%{transform:scale(1);opacity:1}}
  @keyframes confettiFall{0%{transform:translateY(-10px) rotate(0deg) scale(1);opacity:1}100%{transform:translateY(105vh) rotate(700deg) scale(.4);opacity:0}}
  @keyframes ringPulse{0%{transform:scale(1);opacity:.6}100%{transform:scale(1.6);opacity:0}}
  @keyframes revealBar{from{width:0%}}
  @keyframes btnGlow{0%,100%{box-shadow:0 0 24px 4px rgba(168,85,247,.45)}50%{box-shadow:0 0 48px 12px rgba(168,85,247,.8)}}
  @keyframes orb{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(30px,-20px) scale(1.1)}66%{transform:translate(-20px,15px) scale(.95)}}
  @keyframes gradShift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
  @keyframes countUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
  @keyframes badgePop{0%{transform:scale(0);opacity:0}70%{transform:scale(1.12)}100%{transform:scale(1);opacity:1}}
  @keyframes tipIn{from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:translateX(0)}}
  @keyframes glowPulse{0%,100%{opacity:.5}50%{opacity:1}}
  @keyframes borderGlow{0%,100%{box-shadow:0 0 0 0 transparent}50%{box-shadow:0 0 20px 3px rgba(168,85,247,.3)}}

  .bc-fadeup{animation:fadeUp .46s cubic-bezier(.22,.68,0,1.18) both}
  .bc-fadein{animation:fadeIn .38s ease both}
  .bc-popin{animation:popIn .58s cubic-bezier(.34,1.56,.64,1) both}
  .bc-slidein{animation:slideInR .34s cubic-bezier(.22,.68,0,1.08) both}
  .bc-slideout{animation:slideOutL .22s ease both}
  .bc-screenin{animation:screenIn .44s cubic-bezier(.22,.68,0,1.1) both}

  .bc-input{
    background:rgba(255,255,255,.04);border:1.5px solid rgba(255,255,255,.08);
    color:#F0E6D3;font-family:'Plus Jakarta Sans',sans-serif;
    font-size:16px;border-radius:16px;padding:15px 18px;width:100%;outline:none;
    transition:border-color .2s,box-shadow .2s,background .2s;
  }
  .bc-input:focus{border-color:rgba(168,85,247,.6);box-shadow:0 0 0 3px rgba(168,85,247,.15);background:rgba(255,255,255,.06)}
  .bc-input::placeholder{color:rgba(240,230,211,.2)}

  .bc-btn{
    background:linear-gradient(135deg,#A855F7,#7C3AED);
    color:#fff;font-size:16px;font-weight:700;
    padding:17px 36px;border-radius:100px;width:100%;
    letter-spacing:.02em;border:none;cursor:pointer;
    font-family:'Plus Jakarta Sans',sans-serif;
    transition:opacity .18s,transform .15s;
    animation:btnGlow 2.8s ease-in-out infinite;
    display:flex;align-items:center;justify-content:center;gap:8px;
  }
  .bc-btn:hover{opacity:.9;transform:scale(1.025)}
  .bc-btn:active{transform:scale(.97)}
  .bc-btn:disabled{opacity:.3;cursor:not-allowed;animation:none}

  .bc-ghost{
    background:transparent;border:none;color:rgba(240,230,211,.3);
    font-size:14px;font-weight:600;padding:8px 4px;cursor:pointer;
    font-family:'Plus Jakarta Sans',sans-serif;transition:color .15s;
  }
  .bc-ghost:hover{color:rgba(240,230,211,.8)}

  .bc-opt{
    background:rgba(255,255,255,.03);
    border:1.5px solid rgba(255,255,255,.07);
    color:rgba(240,230,211,.7);font-size:15px;font-weight:500;
    text-align:left;padding:15px 18px;border-radius:18px;
    width:100%;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;
    transition:all .2s cubic-bezier(.22,.68,0,1.18);
    display:flex;align-items:center;gap:12px;position:relative;overflow:hidden;
  }
  .bc-opt::after{
    content:'';position:absolute;inset:0;
    background:linear-gradient(135deg,rgba(168,85,247,.1),transparent);
    opacity:0;transition:opacity .2s;
  }
  .bc-opt:hover{border-color:rgba(168,85,247,.4);color:#F0E6D3;transform:translateX(4px)}
  .bc-opt:hover::after{opacity:1}
  .bc-opt.sel{
    border-color:rgba(168,85,247,.7);color:#E9D5FF;
    background:linear-gradient(135deg,rgba(168,85,247,.15),rgba(124,58,237,.08));
    box-shadow:0 0 20px rgba(168,85,247,.2),inset 0 1px 0 rgba(255,255,255,.06);
    transform:translateX(4px);
  }
  .bc-opt .chk{
    width:22px;height:22px;border-radius:50%;border:2px solid rgba(255,255,255,.12);
    flex-shrink:0;display:flex;align-items:center;justify-content:center;
    font-size:11px;font-weight:800;transition:all .2s;
  }
  .bc-opt.sel .chk{
    background:linear-gradient(135deg,#A855F7,#7C3AED);border-color:#A855F7;
    animation:tickPop .32s cubic-bezier(.34,1.56,.64,1) both;
  }

  .bc-card{
    background:linear-gradient(160deg,rgba(255,255,255,.05) 0%,rgba(255,255,255,.02) 100%);
    border:1.5px solid rgba(255,255,255,.08);
    border-radius:24px;backdrop-filter:blur(20px);
    box-shadow:0 8px 32px rgba(0,0,0,.4),inset 0 1px 0 rgba(255,255,255,.06);
  }

  .bc-tip{
    display:flex;align-items:flex-start;gap:12px;
    background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);
    border-radius:14px;padding:13px 15px;
    animation:tipIn .4s cubic-bezier(.22,.68,0,1.18) both;
    transition:background .2s,border-color .2s;
  }
  .bc-tip:hover{background:rgba(255,255,255,.05);border-color:rgba(255,255,255,.1)}

  .bc-shimmer{
    background:linear-gradient(90deg,#C084FC,#E879F9,#A855F7,#7C3AED,#C084FC);
    background-size:300% auto;
    -webkit-background-clip:text;-webkit-text-fill-color:transparent;
    animation:shimmer 4s linear infinite;
  }

  .confetti-piece{position:fixed;pointer-events:none;z-index:9999;animation:confettiFall linear both}

  ::-webkit-scrollbar{width:3px}
  ::-webkit-scrollbar-track{background:transparent}
  ::-webkit-scrollbar-thumb{background:rgba(168,85,247,.3);border-radius:4px}
`;

const QUESTIONS = [
  {emoji:"😴",q:"Gimana tidurmu semalam?",accent:"#818CF8",
   opts:["Nyenyak banget, segar pagi ini ✨","Lumayan, cukup oke","Kurang nyaman, sering kebangun","Begadang parah, hampir gak tidur 😮‍💨"]},
  {emoji:"⚡",q:"Seberapa besar energimu hari ini?",accent:"#FCD34D",
   opts:["Penuh semangat, siap tempur!","Masih cukup untuk jalan","Mulai habis, kerasa berat banget","Kosong total — hampa"]},
  {emoji:"😌",q:"Gimana perasaanmu sekarang?",accent:"#6EE7B7",
   opts:["Tenang dan bahagia","Biasa aja, flat","Gelisah atau cemas","Kosong, mati rasa"]},
  {emoji:"📅",q:"Sudah berapa lama kamu ngerasa lelah?",accent:"#FB923C",
   opts:["Gak merasa lelah kok","Beberapa hari belakangan","Beberapa minggu ini","Berbulan-bulan, udah lama banget"]},
  {emoji:"🌊",q:"Seberapa sering kamu merasa overwhelmed?",accent:"#67E8F9",
   opts:["Jarang banget, aku oke","Sesekali, masih bisa handle","Hampir tiap hari","Terus-terusan, gak ada jeda"]},
  {emoji:"🎯",q:"Gimana fokus & konsentrasimu?",accent:"#F472B6",
   opts:["Tajam banget, on fire!","Masih oke, lumayan","Gampang buyar, susah fokus","Otak kayak berkabut 🌫️"]},
  {emoji:"💛",q:"Kapan terakhir kamu beneran merasa bahagia?",accent:"#FCD34D",
   opts:["Hari ini / kemarin","Minggu lalu","Sudah lama banget","Udah lupa rasanya..."]},
];

const LOAD_MSGS = [
  {icon:"😴",text:"Membaca pola tidurmu…"},
  {icon:"⚡",text:"Mengukur cadangan energimu…"},
  {icon:"🧠",text:"Menganalisis kondisi mentalmu…"},
  {icon:"💛",text:"Merangkai hasil untukmu…"},
];

const LEVELS = [
  {range:[0,5],emoji:"🌱",label:"Segar Bugar",color:"#4ADE80",glow:"rgba(74,222,128,.25)",
   tagline:"Kamu lagi di puncak kondisi terbaikmu.",
   desc:"Mental dan fisikmu dalam keadaan prima. Tubuhmu istirahat cukup, energimu terisi, dan kamu hadir sepenuhnya. Kondisi seperti ini langka — jaga baik-baik.",
   insight:"Orang yang segar cenderung lebih kreatif, lebih sabar, dan membuat keputusan lebih baik. Kamu sedang di zona itu sekarang.",
   tips:[{icon:"🧘",t:"Pertahankan rutinitas tidur 7–8 jam yang sudah berjalan baik"},{icon:"🏃",t:"Tetap bergerak aktif — tubuh sehat menjaga mental tetap stabil"},{icon:"🌿",t:"Jaga pola makan dan hidrasi yang mendukung energimu"},{icon:"💚",t:"Luangkan waktu rutin untuk hal yang benar-benar kamu nikmati"}],
   confetti:true},
  {range:[6,10],emoji:"🍂",label:"Mulai Lelah",color:"#FCD34D",glow:"rgba(252,211,77,.2)",
   tagline:"Ada sinyal kecil yang perlu kamu perhatikan.",
   desc:"Kamu masih bisa berfungsi, tapi tubuh dan pikiranmu sudah mulai berbisik minta jeda. Kelelahan ringan ini bisa berkembang kalau terus diabaikan.",
   insight:"Banyak orang melewati fase ini tanpa sadar — dan baru sadar setelah terlanjur burnout. Kamu sudah selangkah lebih waspada.",
   tips:[{icon:"😴",t:"Prioritaskan tidur lebih awal malam ini — jangan tunda lagi"},{icon:"📵",t:"Kurangi scroll medsos minimal 1 jam sebelum tidur"},{icon:"☕",t:"Ambil micro-break setiap 90 menit saat bekerja"},{icon:"🤝",t:"Ceritakan perasaanmu ke satu orang yang kamu percaya"}]},
  {range:[11,14],emoji:"⚠️",label:"Waspada",color:"#FB923C",glow:"rgba(251,146,60,.22)",
   tagline:"Tubuhmu sudah berteriak — saatnya dengarkan.",
   desc:"Tanda-tanda burnout sedang berkembang. Energimu terkuras, fokusmu menurun, dan kamu mungkin mulai terputus dari hal-hal yang biasanya kamu nikmati.",
   insight:"Fase waspada adalah titik kritis — di sinilah banyak orang memilih untuk 'kuat-kuatan', yang justru mempercepat burnout penuh.",
   tips:[{icon:"🛑",t:"Beri dirimu izin untuk berhenti sejenak — bukan menyerah"},{icon:"📋",t:"Tulis ulang prioritasmu: apa yang bisa ditunda atau didelegasikan?"},{icon:"🌊",t:"Coba latihan pernapasan dalam 5 menit sebelum tidur"},{icon:"👩‍⚕️",t:"Pertimbangkan bicara dengan konselor atau psikolog"}]},
  {range:[15,17],emoji:"🔥",label:"Burnout",color:"#F87171",glow:"rgba(248,113,113,.22)",
   tagline:"Ini bukan drama — ini kondisi nyata yang butuh penanganan.",
   desc:"Kamu sedang mengalami burnout. Ini bukan soal lemah atau kuat — ini soal tubuh dan pikiran yang sudah melampaui batasnya dan butuh pemulihan sungguhan.",
   insight:"Burnout tidak bisa diatasi hanya dengan 'tidur lebih awal'. Dibutuhkan perubahan nyata dalam beban kerja, ekspektasi, dan cara kamu merawat diri.",
   tips:[{icon:"🚨",t:"Ambil cuti atau jeda nyata dari rutinitas — sesegera mungkin"},{icon:"💬",t:"Bicara jujur ke atasan, keluarga, atau teman dekat"},{icon:"🏥",t:"Kunjungi profesional kesehatan mental — ini keputusan terbaik"},{icon:"❤️",t:"Tempatkan pemulihan dirimu sebagai prioritas nomor satu"}]},
  {range:[18,99],emoji:"🆘",label:"Kondisi Kritis",color:"#E11D48",glow:"rgba(225,29,72,.22)",
   tagline:"Kamu tidak harus melewati ini sendirian.",
   desc:"Kondisimu sangat membutuhkan perhatian segera. Yang kamu rasakan sudah jauh melampaui kelelahan biasa. Ini bukan lebay — ini sinyal darurat dari tubuhmu.",
   insight:"Meminta bantuan di kondisi seperti ini bukan tanda kelemahan. Itu tanda bahwa kamu cukup berani untuk jujur pada diri sendiri.",
   tips:[{icon:"📞",t:"Hubungi profesional kesehatan mental sekarang"},{icon:"🏠",t:"Minta izin istirahat total — pekerjaan bisa menunggu"},{icon:"👨‍👩‍👧",t:"Jangan sendirian — ceritakan ke orang yang paling kamu percaya"},{icon:"🌅",t:"Fokus satu langkah saja: hari ini, jam ini, minta bantuan"}]},
];

const CONF_COLORS=["#C084FC","#E879F9","#FCD34D","#67E8F9","#4ADE80","#F472B6","#fff","#A855F7"];
function getLevel(s){return LEVELS.find(l=>s>=l.range[0]&&s<=l.range[1]);}

function Confetti(){
  const p=Array.from({length:56},(_,i)=>({
    id:i,left:Math.random()*100,delay:Math.random()*1.6,
    dur:2.8+Math.random()*2.4,color:CONF_COLORS[i%CONF_COLORS.length],
    size:5+Math.random()*9,rot:Math.random()*360,round:i%4===0,
  }));
  return(
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9999,overflow:"hidden"}}>
      {p.map(x=>(
        <div key={x.id} className="confetti-piece" style={{
          left:`${x.left}%`,top:"-14px",width:x.size,height:x.size,
          background:x.color,borderRadius:x.round?"50%":"3px",
          animationDelay:`${x.delay}s`,animationDuration:`${x.dur}s`,
          transform:`rotate(${x.rot}deg)`,
        }}/>
      ))}
    </div>
  );
}

/* ── Animated background orbs ── */
function BgOrbs({color1="#A855F7",color2="#7C3AED",color3="#4F46E5"}){
  return(
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden"}}>
      <div style={{position:"absolute",top:"-20%",left:"60%",width:500,height:500,borderRadius:"50%",
        background:`radial-gradient(circle,${color1}18 0%,transparent 65%)`,
        animation:"orb 12s ease-in-out infinite",filter:"blur(40px)"}}/>
      <div style={{position:"absolute",bottom:"-15%",left:"-10%",width:400,height:400,borderRadius:"50%",
        background:`radial-gradient(circle,${color2}15 0%,transparent 65%)`,
        animation:"orb 16s ease-in-out infinite 3s",filter:"blur(50px)"}}/>
      <div style={{position:"absolute",top:"40%",right:"-5%",width:300,height:300,borderRadius:"50%",
        background:`radial-gradient(circle,${color3}12 0%,transparent 65%)`,
        animation:"orb 20s ease-in-out infinite 7s",filter:"blur(45px)"}}/>
      {/* Grid overlay */}
      <div style={{position:"absolute",inset:0,
        backgroundImage:"linear-gradient(rgba(255,255,255,.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.015) 1px,transparent 1px)",
        backgroundSize:"48px 48px"}}/>
    </div>
  );
}

export default function App(){
  const [screen,setScreen]=useState("intro");
  const [name,setName]=useState("");
  const [cur,setCur]=useState(0);
  const [answers,setAnswers]=useState([]);
  const [sel,setSel]=useState(null);
  const [anim,setAnim]=useState("bc-slidein");
  const [score,setScore]=useState(0);
  const [step,setStep]=useState(0);
  const [copied,setCopied]=useState(false);
  const [loadIdx,setLoadIdx]=useState(0);
  const [showConf,setShowConf]=useState(false);
  const [displayScore,setDisplayScore]=useState(0);
  const autoRef=useRef(null);

  useEffect(()=>{
    const el=document.createElement("style");
    el.textContent=CSS;
    document.head.appendChild(el);
    return()=>{try{document.head.removeChild(el)}catch(_){}};
  },[]);

  // loading
  useEffect(()=>{
    if(screen!=="loading")return;
    const iv=setInterval(()=>setLoadIdx(i=>(i+1)%LOAD_MSGS.length),580);
    const t=setTimeout(()=>{setStep(0);setScreen("result");},2700);
    return()=>{clearInterval(iv);clearTimeout(t);};
  },[screen]);

  // result reveal
  useEffect(()=>{
    if(screen!=="result"||step>=6)return;
    const d=[180,460,460,440,440,500];
    const t=setTimeout(()=>setStep(s=>s+1),d[step]??460);
    return()=>clearTimeout(t);
  },[screen,step]);

  // animated score counter
  useEffect(()=>{
    if(screen!=="result"||step<2)return;
    setDisplayScore(0);
    let s=0;
    const iv=setInterval(()=>{
      s+=1;setDisplayScore(s);
      if(s>=score)clearInterval(iv);
    },55);
    return()=>clearInterval(iv);
  },[screen,step,score]);

  // confetti
  useEffect(()=>{
    if(screen==="result"&&step>=1){
      const lv=getLevel(score);
      if(lv?.confetti){setShowConf(true);setTimeout(()=>setShowConf(false),5000);}
    }
  },[screen,step,score]);

  function reset(){
    setCur(0);setAnswers([]);setSel(null);setAnim("bc-slidein");
    setStep(0);setLoadIdx(0);setShowConf(false);setDisplayScore(0);
    clearTimeout(autoRef.current);
  }

  const advance=useCallback((chosen)=>{
    if(chosen===null)return;
    const na=[...answers,chosen];
    if(cur<QUESTIONS.length-1){
      setAnswers(na);setAnim("bc-slideout");
      setTimeout(()=>{setCur(c=>c+1);setSel(null);setAnim("bc-slidein");},230);
    }else{
      setScore(na.reduce((s,v)=>s+v,0));
      setAnswers(na);setScreen("loading");
    }
  },[answers,cur]);

  function handleSelect(i){
    setSel(i);clearTimeout(autoRef.current);
    autoRef.current=setTimeout(()=>advance(i),400);
  }
  function handleBack(){
    clearTimeout(autoRef.current);
    if(cur===0){setScreen("intro");return;}
    setAnim("bc-slideout");
    setTimeout(()=>{
      setCur(c=>c-1);setSel(answers[cur-1]??null);
      setAnswers(a=>a.slice(0,-1));setAnim("bc-slidein");
    },230);
  }
  async function handleShare(){
    const lv=getLevel(score);
    const nm=name.trim()||"Aku";
    const maxS=(QUESTIONS.length-1)*3;
    const txt=`${nm} baru aja cek kondisi mental 🔥\n\nHasil: ${lv.emoji} ${lv.label}\n"${lv.tagline}"\n\nSkor: ${score}/${maxS}\n\n${lv.desc}\n\n👉 Cek kondisimu juga di Burnout Checker!`;
    try{
      if(navigator.share)await navigator.share({title:"Burnout Checker 🔥",text:txt});
      else{await navigator.clipboard.writeText(txt);setCopied(true);setTimeout(()=>setCopied(false),2500);}
    }catch(_){}
  }

  const maxS=(QUESTIONS.length-1)*3;

  /* ═══════════════ INTRO ═══════════════ */
  if(screen==="intro")return(
    <div className="bc-screenin" style={{minHeight:"100dvh",display:"flex",flexDirection:"column",
      alignItems:"center",justifyContent:"center",background:"#080507",position:"relative",overflow:"hidden"}}>
      <BgOrbs/>
      <div style={{width:"100%",maxWidth:420,padding:"44px 20px 52px",position:"relative",zIndex:1}}>

        {/* Logo hero */}
        <div className="bc-fadeup" style={{textAlign:"center",marginBottom:36}}>
          <div style={{position:"relative",display:"inline-block",marginBottom:18}}>
            <div style={{position:"absolute",inset:-20,borderRadius:"50%",
              background:"radial-gradient(circle,rgba(168,85,247,.3),transparent 70%)",
              animation:"glowPulse 2.5s ease-in-out infinite"}}/>
            <div style={{width:88,height:88,borderRadius:28,
              background:"linear-gradient(135deg,#A855F7,#7C3AED,#4F46E5)",
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:44,boxShadow:"0 8px 32px rgba(168,85,247,.5),inset 0 1px 0 rgba(255,255,255,.2)",
              animation:"floatBob 3.5s ease-in-out infinite",
              border:"1px solid rgba(255,255,255,.15)"}}>
              🔥
            </div>
          </div>
          <h1 style={{fontSize:34,fontWeight:800,letterSpacing:"-.05em",marginBottom:8,lineHeight:1}}>
            <span className="bc-shimmer">Burnout Checker</span>
          </h1>
          <p style={{color:"rgba(240,230,211,.3)",fontSize:12,fontWeight:700,
            letterSpacing:".12em",textTransform:"uppercase"}}>
            Catat · Sadari · Pulih
          </p>
        </div>

        {/* Card */}
        <div className="bc-card bc-fadeup" style={{padding:"26px 22px",marginBottom:14,animationDelay:".1s"}}>
          <p style={{color:"rgba(240,230,211,.8)",fontSize:15,lineHeight:1.78,marginBottom:22,fontWeight:500}}>
            Dalam <strong style={{color:"#C084FC",fontWeight:800}}>2 menit</strong>, kamu akan tahu
            seberapa lelah dirimu sebenarnya — dan apa yang perlu kamu lakukan{" "}
            <span style={{color:"#FCD34D",fontWeight:700}}>sekarang</span>.
          </p>

          {/* Trust pills */}
          <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:22}}>
            {[{i:"🔒",t:"100% privat"},{i:"⚡",t:"7 pertanyaan"},{i:"🎯",t:"Hasil personal"},{i:"💙",t:"Berdasarkan riset"}].map(({i,t})=>(
              <span key={t} style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",
                borderRadius:99,padding:"5px 12px",fontSize:12,color:"rgba(240,230,211,.4)",
                fontWeight:600,display:"flex",alignItems:"center",gap:5}}>
                <span>{i}</span>{t}
              </span>
            ))}
          </div>

          <label style={{display:"block",color:"rgba(240,230,211,.25)",fontSize:11,fontWeight:700,
            letterSpacing:".08em",textTransform:"uppercase",marginBottom:9}}>
            Panggil aku…
          </label>
          <input className="bc-input" type="text"
            placeholder="Nama atau panggilan (opsional)"
            value={name} onChange={e=>setName(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&(reset(),setScreen("quiz"))}
            maxLength={30}/>
        </div>

        <div className="bc-fadeup" style={{animationDelay:".18s"}}>
          <button className="bc-btn" onClick={()=>{reset();setScreen("quiz");}}>
            Mulai Check-in Sekarang →
          </button>
        </div>

        <p className="bc-fadeup" style={{textAlign:"center",color:"rgba(240,230,211,.15)",
          fontSize:12,marginTop:20,lineHeight:1.7,animationDelay:".26s"}}>
          Dibuat untuk kamu yang sering lupa<br/>bahwa dirimu juga butuh diperhatikan 💙
        </p>
      </div>
    </div>
  );

  /* ═══════════════ QUIZ ═══════════════ */
  if(screen==="quiz"){
    const q=QUESTIONS[cur];
    return(
      <div className="bc-screenin" style={{minHeight:"100dvh",display:"flex",flexDirection:"column",
        alignItems:"center",background:"#080507",position:"relative",overflow:"hidden"}}>
        <BgOrbs color1={q.accent} color2="#7C3AED" color3="#4F46E5"/>

        <div style={{width:"100%",maxWidth:420,padding:"28px 18px 44px",position:"relative",zIndex:1}}>
          {/* Nav */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <button className="bc-ghost" onClick={handleBack}>← Kembali</button>
            <div style={{textAlign:"center"}}>
              <div style={{color:"rgba(240,230,211,.2)",fontSize:10,fontWeight:700,
                letterSpacing:".08em",textTransform:"uppercase",marginBottom:1}}>Pertanyaan</div>
              <div style={{fontSize:18,fontWeight:800,lineHeight:1}}>
                <span style={{color:q.accent}}>{cur+1}</span>
                <span style={{color:"rgba(240,230,211,.2)"}}> / {QUESTIONS.length}</span>
              </div>
            </div>
            <div style={{width:60}}/>
          </div>

          {/* Progress */}
          <div style={{height:4,background:"rgba(255,255,255,.05)",borderRadius:99,
            overflow:"hidden",marginBottom:10}}>
            <div style={{height:"100%",borderRadius:99,
              background:`linear-gradient(90deg,#A855F7,${q.accent})`,
              width:`${(cur/QUESTIONS.length)*100}%`,
              transition:"width .55s cubic-bezier(.4,0,.2,1)",
              boxShadow:`0 0 12px ${q.accent}88`}}/>
          </div>

          {/* Dots */}
          <div style={{display:"flex",gap:5,justifyContent:"center",marginBottom:24}}>
            {QUESTIONS.map((_,i)=>(
              <div key={i} style={{
                height:3,borderRadius:99,
                width:i===cur?24:i<cur?8:4,
                background:i<cur?"#A855F7":i===cur?q.accent:"rgba(255,255,255,.1)",
                transition:"all .35s cubic-bezier(.4,0,.2,1)",
                boxShadow:i===cur?`0 0 8px 2px ${q.accent}88`:"none",
              }}/>
            ))}
          </div>

          {/* Question card */}
          <div className={`bc-card ${anim}`}
            style={{padding:"28px 20px 22px",marginBottom:14,
              border:`1.5px solid ${q.accent}20`,
              boxShadow:`0 12px 48px rgba(0,0,0,.5),0 0 0 1px rgba(255,255,255,.04)`}}>

            <div style={{textAlign:"center",marginBottom:20}}>
              <div style={{
                display:"inline-flex",alignItems:"center",justifyContent:"center",
                width:68,height:68,borderRadius:22,
                background:`linear-gradient(135deg,${q.accent}20,${q.accent}08)`,
                border:`1.5px solid ${q.accent}25`,
                fontSize:32,marginBottom:16,
                boxShadow:`0 4px 20px ${q.accent}30`}}>
                {q.emoji}
              </div>
              <h2 style={{fontSize:21,fontWeight:800,lineHeight:1.35,color:"#F0E6D3",
                letterSpacing:"-.025em"}}>{q.q}</h2>
            </div>

            <div style={{display:"flex",flexDirection:"column",gap:9}}>
              {q.opts.map((opt,i)=>(
                <button key={i} className={`bc-opt${sel===i?" sel":""}`}
                  style={{animationDelay:`${i*.05}s`}}
                  onClick={()=>handleSelect(i)}>
                  <span className="chk">{sel===i?"✓":""}</span>
                  <span style={{flex:1,lineHeight:1.45}}>{opt}</span>
                </button>
              ))}
            </div>
          </div>

          {sel===null&&(
            <p style={{textAlign:"center",color:"rgba(240,230,211,.2)",fontSize:12,fontWeight:500}}>
              Pilih salah satu untuk lanjut otomatis →
            </p>
          )}
        </div>
      </div>
    );
  }

  /* ═══════════════ LOADING ═══════════════ */
  if(screen==="loading"){
    const m=LOAD_MSGS[loadIdx];
    return(
      <div className="bc-screenin" style={{minHeight:"100dvh",display:"flex",flexDirection:"column",
        alignItems:"center",justifyContent:"center",background:"#080507",position:"relative",overflow:"hidden"}}>
        <BgOrbs/>
        <div style={{textAlign:"center",padding:"0 28px",position:"relative",zIndex:1}}>
          {/* Spinner */}
          <div style={{position:"relative",width:100,height:100,margin:"0 auto 32px"}}>
            <div style={{position:"absolute",inset:0,border:"1px solid rgba(255,255,255,.05)",borderRadius:"50%"}}/>
            <div style={{position:"absolute",inset:0,border:"3px solid transparent",
              borderTopColor:"#A855F7",borderRightColor:"rgba(168,85,247,.3)",
              borderRadius:"50%",animation:"spin .7s linear infinite"}}/>
            <div style={{position:"absolute",inset:10,border:"2px solid transparent",
              borderTopColor:"#C084FC",borderLeftColor:"rgba(192,132,252,.2)",
              borderRadius:"50%",animation:"spin 1.1s linear infinite reverse"}}/>
            <div style={{position:"absolute",inset:20,border:"1.5px solid transparent",
              borderTopColor:"#E879F9",borderRadius:"50%",
              animation:"spin 1.7s linear infinite"}}/>
            <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",
              justifyContent:"center"}}>
              <span key={loadIdx} className="bc-fadein" style={{fontSize:28}}>{m.icon}</span>
            </div>
          </div>

          <p key={loadIdx} className="bc-fadein"
            style={{color:"rgba(240,230,211,.8)",fontSize:17,fontWeight:600,marginBottom:10,minHeight:28}}>
            {m.text}
          </p>
          <p style={{color:"rgba(240,230,211,.2)",fontSize:13,marginBottom:28}}>Mohon tunggu sebentar…</p>

          <div style={{display:"flex",gap:7,justifyContent:"center"}}>
            {[0,1,2,3].map(i=>(
              <div key={i} style={{width:6,height:6,borderRadius:"50%",
                background:`linear-gradient(135deg,#A855F7,#C084FC)`,
                animation:`loadDot 1.4s ease-in-out ${i*.18}s infinite`}}/>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ═══════════════ RESULT ═══════════════ */
  if(screen==="result"){
    const lv=getLevel(score);
    const pct=Math.round((score/maxS)*100);
    const fn=name.trim().split(" ")[0]||null;

    return(
      <div className="bc-screenin" style={{minHeight:"100dvh",display:"flex",flexDirection:"column",
        alignItems:"center",background:"#080507",position:"relative",overflow:"hidden"}}>
        {showConf&&<Confetti/>}
        <BgOrbs color1={lv.color} color2="#7C3AED" color3="#4F46E5"/>

        <div style={{width:"100%",maxWidth:440,padding:"32px 18px 68px",
          position:"relative",zIndex:1,margin:"0 auto"}}>

          {/* Badge */}
          {step>=0&&(
            <div className="bc-fadeup" style={{textAlign:"center",marginBottom:22}}>
              <span style={{
                display:"inline-block",
                background:`linear-gradient(135deg,${lv.color}22,${lv.color}0E)`,
                border:`1px solid ${lv.color}35`,
                borderRadius:99,padding:"7px 20px",
                fontSize:11,fontWeight:700,color:lv.color,
                letterSpacing:".1em",textTransform:"uppercase",
                animation:"badgePop .42s cubic-bezier(.34,1.56,.64,1) both",
                boxShadow:`0 0 16px ${lv.color}20`}}>
                {fn?`✦ Hasil Check-in ${fn} ✦`:"✦ Hasil Check-inmu ✦"}
              </span>
            </div>
          )}

          {/* Main result card */}
          <div className="bc-card" style={{
            marginBottom:12,overflow:"hidden",
            border:`1.5px solid ${lv.color}25`,
            boxShadow:`0 0 60px ${lv.glow},0 24px 64px rgba(0,0,0,.7),inset 0 1px 0 rgba(255,255,255,.06)`}}>

            {/* Top strip */}
            <div style={{height:4,background:`linear-gradient(90deg,${lv.color},${lv.color}50,transparent)`,
              opacity:step>=1?1:0,transition:"opacity .5s"}}/>

            <div style={{padding:"28px 22px 26px"}}>

              {/* Emoji hero */}
              {step>=1&&(
                <div style={{textAlign:"center",marginBottom:26}}>
                  <div style={{position:"relative",display:"inline-block",marginBottom:16}}>
                    <div style={{position:"absolute",inset:-10,borderRadius:"50%",
                      border:`2px solid ${lv.color}25`,animation:"ringPulse 2s ease-out infinite"}}/>
                    <div style={{position:"absolute",inset:-22,borderRadius:"50%",
                      border:`1px solid ${lv.color}12`,animation:"ringPulse 2s ease-out infinite .5s"}}/>
                    <div style={{
                      width:100,height:100,borderRadius:32,
                      background:`linear-gradient(135deg,${lv.color}22,${lv.color}08)`,
                      border:`1.5px solid ${lv.color}30`,
                      display:"flex",alignItems:"center",justifyContent:"center",
                      fontSize:52,
                      boxShadow:`0 8px 32px ${lv.glow},inset 0 1px 0 rgba(255,255,255,.1)`}}
                      className="bc-popin">
                      {lv.emoji}
                    </div>
                  </div>
                  <div className="bc-fadeup" style={{animationDelay:".1s"}}>
                    <h2 style={{fontSize:32,fontWeight:800,color:lv.color,
                      letterSpacing:"-.04em",marginBottom:6,lineHeight:1,
                      textShadow:`0 0 30px ${lv.color}60`}}>
                      {lv.label}
                    </h2>
                    <p style={{color:"rgba(240,230,211,.35)",fontSize:14,
                      fontStyle:"italic",lineHeight:1.5}}>
                      "{lv.tagline}"
                    </p>
                  </div>
                </div>
              )}

              {/* Score meter */}
              {step>=2&&(
                <div className="bc-fadeup" style={{marginBottom:24}}>
                  <div style={{display:"flex",justifyContent:"space-between",
                    alignItems:"center",marginBottom:10}}>
                    <span style={{color:"rgba(240,230,211,.25)",fontSize:10,fontWeight:700,
                      letterSpacing:".08em",textTransform:"uppercase"}}>Burnout Level</span>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <span style={{color:lv.color,fontSize:22,fontWeight:800,
                        animation:"countUp .4s cubic-bezier(.34,1.56,.64,1) both",
                        textShadow:`0 0 16px ${lv.color}80`}}>
                        {displayScore}
                      </span>
                      <span style={{color:"rgba(240,230,211,.2)",fontSize:13,fontWeight:600}}>/ {maxS}</span>
                    </div>
                  </div>

                  <div style={{height:12,background:"rgba(0,0,0,.4)",borderRadius:99,
                    overflow:"hidden",border:"1px solid rgba(255,255,255,.06)",
                    position:"relative",marginBottom:8}}>
                    <div style={{position:"absolute",inset:0,
                      background:"linear-gradient(90deg,#4ADE80,#FCD34D 28%,#FB923C 54%,#F87171 76%,#E11D48)",
                      opacity:.1}}/>
                    <div style={{height:"100%",borderRadius:99,
                      background:"linear-gradient(90deg,#4ADE80,#FCD34D 28%,#FB923C 54%,#F87171 76%,#E11D48)",
                      width:`${pct}%`,
                      animation:"revealBar 1.4s cubic-bezier(.4,0,.2,1) .1s both",
                      boxShadow:`0 0 16px ${lv.color}aa`}}/>
                    <div style={{position:"absolute",top:"50%",transform:"translate(-50%,-50%)",
                      left:`${pct}%`,width:14,height:14,borderRadius:"50%",
                      background:lv.color,border:"2px solid #080507",
                      boxShadow:`0 0 10px ${lv.color}`,
                      animation:"revealBar 1.4s cubic-bezier(.4,0,.2,1) .1s both"}}/>
                  </div>

                  <div style={{display:"flex",justifyContent:"space-between"}}>
                    {["🌱","🍂","⚠️","🔥","🆘"].map((e,i)=>(
                      <span key={i} style={{fontSize:13,
                        opacity:pct>=(i*20)?1:.2,
                        filter:pct>=(i*20)?`drop-shadow(0 0 4px ${lv.color}88)`:"none",
                        transition:`opacity .3s ${i*.1}s`}}>{e}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Divider */}
              {step>=3&&(
                <div style={{height:1,
                  background:`linear-gradient(90deg,transparent,${lv.color}30,transparent)`,
                  margin:"4px 0 22px"}}/>
              )}

              {/* Description */}
              {step>=3&&(
                <div className="bc-fadeup" style={{marginBottom:22}}>
                  <p style={{color:"rgba(240,230,211,.75)",fontSize:15,lineHeight:1.8,
                    marginBottom:14,fontWeight:500}}>{lv.desc}</p>
                  <div style={{
                    background:`linear-gradient(135deg,${lv.color}0E,rgba(255,255,255,.02))`,
                    borderRadius:16,padding:"14px 16px",
                    border:`1px solid ${lv.color}18`}}>
                    <p style={{color:"rgba(240,230,211,.4)",fontSize:13,
                      lineHeight:1.72,fontStyle:"italic"}}>
                      💡 {lv.insight}
                    </p>
                  </div>
                </div>
              )}

              {/* Tips */}
              {step>=4&&(
                <div className="bc-fadeup">
                  <p style={{color:"rgba(240,230,211,.2)",fontSize:10,fontWeight:700,
                    letterSpacing:".1em",textTransform:"uppercase",marginBottom:12}}>
                    Yang bisa kamu lakukan sekarang
                  </p>
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    {lv.tips.map((tip,i)=>(
                      <div key={i} className="bc-tip" style={{animationDelay:`${i*.09}s`}}>
                        <span style={{fontSize:20,flexShrink:0,lineHeight:1}}>{tip.icon}</span>
                        <span style={{color:"rgba(240,230,211,.65)",fontSize:14,lineHeight:1.65}}>{tip.t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Share preview card */}
          {step>=5&&(
            <div className="bc-fadeup" style={{animationDelay:".05s",
              background:"rgba(255,255,255,.02)",
              border:`1px solid ${lv.color}18`,borderRadius:20,
              padding:"16px 18px",marginBottom:12,
              boxShadow:`0 0 20px ${lv.color}10`}}>
              <p style={{color:"rgba(240,230,211,.2)",fontSize:10,fontWeight:700,
                letterSpacing:".08em",textTransform:"uppercase",marginBottom:10}}>
                Preview kartu share
              </p>
              <div style={{display:"flex",alignItems:"center",gap:14}}>
                <div style={{width:44,height:44,borderRadius:14,
                  background:`linear-gradient(135deg,${lv.color}22,${lv.color}08)`,
                  border:`1px solid ${lv.color}25`,
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>
                  {lv.emoji}
                </div>
                <div style={{flex:1}}>
                  <div style={{color:lv.color,fontSize:14,fontWeight:800,marginBottom:2}}>{lv.label}</div>
                  <div style={{color:"rgba(240,230,211,.25)",fontSize:11,fontStyle:"italic"}}>"{lv.tagline}"</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{color:lv.color,fontSize:18,fontWeight:800}}>{score}/{maxS}</div>
                  <div style={{color:"rgba(240,230,211,.2)",fontSize:9,fontWeight:700,textTransform:"uppercase"}}>skor</div>
                </div>
              </div>
              <div style={{marginTop:12,paddingTop:12,
                borderTop:"1px solid rgba(255,255,255,.05)",
                display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{color:"rgba(240,230,211,.2)",fontSize:11,fontWeight:700}}>🔥 Burnout Checker</span>
                <span style={{color:"rgba(240,230,211,.12)",fontSize:10}}>burnoutchecker.app</span>
              </div>
            </div>
          )}

          {/* CTAs */}
          {step>=5&&(
            <div className="bc-fadeup" style={{display:"flex",flexDirection:"column",gap:10,
              animationDelay:".08s"}}>
              <button className="bc-btn" onClick={handleShare}
                style={{background:copied
                  ?"linear-gradient(135deg,#4ADE80,#16A34A)"
                  :"linear-gradient(135deg,#A855F7,#7C3AED)",
                  animation:copied?"none":"btnGlow 2.8s ease-in-out infinite"}}>
                {copied
                  ?<><span>✅</span>Tersalin! Share ke temanmu ya 💙</>
                  :<><span>📤</span>Bagikan Hasilmu</>}
              </button>

              <button
                onClick={()=>{reset();setScreen("intro");}}
                style={{background:"rgba(255,255,255,.03)",
                  border:"1.5px solid rgba(255,255,255,.08)",
                  color:"rgba(240,230,211,.35)",fontSize:15,fontWeight:700,padding:"15px",
                  borderRadius:100,cursor:"pointer",
                  fontFamily:"'Plus Jakarta Sans',sans-serif",
                  transition:"all .2s"}}
                onMouseEnter={e=>{e.currentTarget.style.color="rgba(240,230,211,.9)";e.currentTarget.style.borderColor="rgba(168,85,247,.4)";e.currentTarget.style.background="rgba(168,85,247,.08)";}}
                onMouseLeave={e=>{e.currentTarget.style.color="rgba(240,230,211,.35)";e.currentTarget.style.borderColor="rgba(255,255,255,.08)";e.currentTarget.style.background="rgba(255,255,255,.03)";}}
              >🔄 Cek Lagi</button>

              <div style={{background:"rgba(255,255,255,.02)",
                border:"1px solid rgba(255,255,255,.05)",
                borderRadius:14,padding:"14px 16px",marginTop:2}}>
                <p style={{color:"rgba(240,230,211,.18)",fontSize:11,lineHeight:1.72,textAlign:"center"}}>
                  ⚠️ <strong style={{color:"rgba(240,230,211,.25)"}}>Bukan diagnosis medis.</strong>{" "}
                  Burnout Checker adalah alat refleksi diri, bukan pengganti konsultasi profesional.
                  Jika kamu membutuhkan bantuan lebih, kamu layak mendapatkannya. 💙
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
