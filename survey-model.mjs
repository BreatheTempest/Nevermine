export const FIELD = { width: 24, depth: 19 };
export const DURATION = 45;
export const ROUTE = Array.from({length:7},(_,i)=>[{x:-9+i*3,z:i%2?7:-7},{x:-9+i*3,z:i%2?-7:7}]).flat();
export const TARGETS = [
 {x:-8.6,z:-4.8,kind:'mine'}, {x:-9.3,z:3.9,kind:'charge'},
 {x:-6.5,z:5.2,kind:'mine'}, {x:-5.6,z:-2.5,kind:'mine'},
 {x:-3.3,z:-5.8,kind:'charge'}, {x:-2.5,z:1.7,kind:'mine'},
 {x:.4,z:5.7,kind:'mine'}, {x:-.5,z:-1.5,kind:'charge'},
 {x:3.4,z:-4.1,kind:'mine'}, {x:2.5,z:3.5,kind:'mine'},
 {x:5.6,z:5.6,kind:'charge'}, {x:6.4,z:-2.4,kind:'mine'},
 {x:8.6,z:-5.4,kind:'mine'}, {x:9.4,z:3.6,kind:'charge'}
].map((t,i)=>({...t,id:`${t.kind==='mine'?'M':'E'}-${String(i+1).padStart(2,'0')}`}));
export const SEGMENTS=ROUTE.slice(1).map((b,i)=>{const a=ROUTE[i];return {a,b,length:Math.hypot(b.x-a.x,b.z-a.z)};});
export const TOTAL_LENGTH=SEGMENTS.reduce((s,v)=>s+v.length,0);
export function poseAt(progress){let remaining=Math.max(0,Math.min(1,progress))*TOTAL_LENGTH;
 for(let i=0;i<SEGMENTS.length;i++){const s=SEGMENTS[i];if(remaining<=s.length||i===SEGMENTS.length-1){const f=Math.min(1,remaining/s.length);return {x:s.a.x+(s.b.x-s.a.x)*f,z:s.a.z+(s.b.z-s.a.z)*f,yaw:Math.atan2(s.b.x-s.a.x,s.b.z-s.a.z),segment:i};}remaining-=s.length;}}
// Earliest segment/circle intersection: detection is independent of frame rate and playback speed.
export function detectionTimes(radius){return TARGETS.map(t=>{let traveled=0;
 for(const s of SEGMENTS){const dx=s.b.x-s.a.x,dz=s.b.z-s.a.z,ox=s.a.x-t.x,oz=s.a.z-t.z;
 const a=s.length*s.length,b=2*(ox*dx+oz*dz),c=ox*ox+oz*oz-radius*radius,disc=b*b-4*a*c;
 if(c<=0)return traveled/TOTAL_LENGTH*DURATION;
 if(disc>=0){const enter=(-b-Math.sqrt(disc))/(2*a),leave=(-b+Math.sqrt(disc))/(2*a);if(leave>=0&&enter<=1)return (traveled+Math.max(0,enter)*s.length)/TOTAL_LENGTH*DURATION;}
 traveled+=s.length;}return Infinity;});}
export function foundAt(time,times){return times.map(t=>time>=t);}
