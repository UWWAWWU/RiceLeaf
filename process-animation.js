import { drawPipeline } from './pipeline-illustration.js';
const root=document.querySelector('.model-animation'),canvases=[...root.querySelectorAll('canvas')];
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let time=0,last=performance.now(),inView=true;
function resizeStrip(){
 const factor=Math.max(1,root.clientWidth>720?(root.clientWidth-56)/1020:1);
 root.style.setProperty('--illustration-scale',factor);
}
function render(){canvases.forEach((canvas,i)=>drawPipeline(canvas,i,reduced.matches?.7:(time%3400)/3400));}
new ResizeObserver(()=>{resizeStrip();render();}).observe(root);
new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;}).observe(root);
reduced.addEventListener('change',render);
function frame(now){const dt=Math.min(100,now-last);last=now;if(!document.hidden&&inView&&!reduced.matches){time+=dt;render();}requestAnimationFrame(frame);}
resizeStrip();render();requestAnimationFrame(frame);
