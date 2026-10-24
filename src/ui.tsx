import type { ReactNode } from 'react';
export function Icon({name,size=20}:{name:string;size?:number}) {
 const paths:Record<string,ReactNode>={
  arrow:<><path d="M4 12h15m-6-6 6 6-6 6"/></>,
  play:<path d="m9 5 11 7-11 7Z"/>,pause:<><path d="M9 5v14M16 5v14"/></>,
  leaf:<><path d="M5 20c0-10 7-13 14-16 2 11-3 16-12 13M5 20l9-10"/></>,
  sun:<><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></>,
  heart:<path d="M12 20S2 14 2 8a5 5 0 0 1 10-1A5 5 0 0 1 22 8c0 6-10 12-10 12Z"/>,
  shield:<><path d="m12 3 8 3v6c0 5-8 9-8 9S4 17 4 12V6Z"/><path d="m8 12 3 3 5-6"/></>,
  book:<><path d="M12 5v15M3 4c4-1 7 0 9 2 3-2 6-3 9-2v14c-4-1-7 0-9 2-2-2-5-3-9-2Z"/></>,
  sound:<><path d="m4 9 5 0 5-4v14l-5-4H4Z"/><path d="M18 8q5 4 0 8"/></>,
  download:<><path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4"/></>,
  check:<path d="m5 12 5 5 10-11"/>,close:<path d="m6 6 12 12M6 18 18 6"/>,
  back:<path d="M20 12H4m6-6-6 6 6 6"/>,clock:<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  user:<><circle cx="12" cy="8" r="4"/><path d="M4 22v-3a8 8 0 0 1 16 0v3"/></>,
  wind:<><path d="M3 8h13c5 0 5-6 1-6M3 12h17c4 0 4 6 0 6M3 16h8c4 0 4 6 0 6"/></>,
  repeat:<><path d="M5 7h12l3 3M20 4v6h-6M19 17H7l-3-3M4 20v-6h6"/></>,
  headphones:<><path d="M3 14v-3a9 9 0 0 1 18 0v3"/><rect x="3" y="12" width="4" height="8" rx="2"/><rect x="17" y="12" width="4" height="8" rx="2"/></>,
  mountain:<path d="m2 20 7-13 4 6 3-4 6 11ZM6 12l3 2 3-2"/>,
  home:<><path d="m3 10 9-8 9 8v12H3Z"/><path d="M9 22v-8h6v8"/></>,
  more:<><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>
 };
 return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]||paths.leaf}</svg>;
}
export function Logo(){return <span className="brand"><span className="brand-mark"><svg viewBox="0 0 40 48" aria-hidden="true"><path d="M20 43V18M20 31C4 31 0 20 3 11c12 1 19 8 17 20Zm0-7C19 11 26 4 38 3c2 12-5 22-18 21Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg></span><span>aqui e agora<small>UM MOMENTO PARA VOCÊ</small></span></span>}
export function Garden(){return <svg className="garden-svg" viewBox="0 0 800 500" role="img" aria-label="Animação vetorial original de uma pessoa sentada confortavelmente em um jardim"><defs><linearGradient id="sky" x2="0" y2="1"><stop stopColor="#dbe3d3"/><stop offset="1" stopColor="#f1dfb9"/></linearGradient><linearGradient id="land" x2="0" y2="1"><stop stopColor="#789589"/><stop offset="1" stopColor="#1f4c3f"/></linearGradient></defs><rect width="800" height="500" fill="url(#sky)"/><circle cx="570" cy="140" r="62" fill="#fff6d6" opacity=".8"/><path d="M0 320Q160 130 360 300T800 240V500H0Z" fill="#95ac9e"/><path d="M0 350Q240 210 420 340T800 285V500H0Z" fill="url(#land)"/><path d="M0 410Q200 380 400 415T800 400" stroke="#b1c6b3" fill="none" opacity=".6"/><g className="tree"><path d="M115 390Q90 210 130 60M110 240 45 155m67 15 90-65" fill="none" stroke="#315643" strokeWidth="14"/><g fill="#688d72"><ellipse cx="65" cy="105" rx="110" ry="80"/><ellipse cx="190" cy="80" rx="90" ry="70"/><ellipse cx="20" cy="200" rx="80" ry="70"/></g></g><g className="tree second" fill="#41694f"><path d="M710 400V150" stroke="#315643" strokeWidth="13"/><ellipse cx="730" cy="100" rx="100" ry="130"/></g><ellipse cx="410" cy="446" rx="130" ry="22" fill="#173f35" opacity=".4"/><g className="sitting-person"><path d="M385 337q-20 13-23 58l-41 31q-17 18 17 20h139q27-5 10-18l-43-32q-2-48-26-59Z" fill="#d7c6a4"/><circle cx="401" cy="310" r="26" fill="#b68262"/><path d="M375 309q-3-40 29-36 31 4 24 38l-9-19q-20 5-37 0Z" fill="#333d30"/><path d="m377 365-22 41-25 8m97-49 24 41 28 8" fill="none" stroke="#b68262" strokeWidth="12" strokeLinecap="round"/><path d="M356 431q41-25 91 1" stroke="#b5a480" strokeWidth="5" fill="none"/></g><g fill="#acb88f" opacity=".8"><ellipse cx="60" cy="470" rx="55" ry="12"/><ellipse cx="750" cy="460" rx="70" ry="13"/></g></svg>}
