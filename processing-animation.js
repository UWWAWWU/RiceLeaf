import { drawPipeline } from './pipeline-illustration.js';
const root=document.getElementById('processing-view'),canvas=document.getElementById('processing-canvas');
const stages=[...root.querySelectorAll('.processing-stages span')];
const steps=[
 ['Original','One RGB image is the model input.'],
 ['320 × 320','Preserved proportions · black padding · ImageNet normalization'],
 ['U-Net++ + EfficientNetB0','The probability map is used to extract region features, the mask is used to calculate 18 shape features.'],
 ['Combined features','The three feature groups are combined into one vector.'],
 ['Four disease probabilities','Scores come from the model output for your uploaded photo.'],
 ['Prediction and visualizations','Compare the original photo with the heatmap and overlay.']
];
const duration=3400;
let active=false,time=0,last=0,lastStep=-1,request,probabilities=null,finished;
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
function render(){
 const step=Math.min(5,Math.floor(time/duration));
 const phase=step===4&&!probabilities?0:reduced.matches?1:Math.min(1,(time-step*duration)/duration);
 if(step!==lastStep){
  stages.forEach((el,i)=>{el.classList.toggle('active',i===step);el.classList.toggle('completed',i<step);if(i===step)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current');});
  document.getElementById('processing-output-notes').hidden=step!==5;
  document.getElementById('processing-step-title').textContent=steps[step][0];
  document.getElementById('processing-step-detail').textContent=steps[step][1];lastStep=step;
 }
 drawPipeline(canvas,step,phase,true,{probabilities,actual:true});
}
function frame(now){
 if(!active)return;
 const delta=now-last;last=now;
 time=probabilities?Math.min(6*duration,time+delta):Math.min(4*duration,time+delta);
 render();
 if(time>=6*duration&&finished){const resolve=finished;finished=null;resolve();}
 request=requestAnimationFrame(frame);
}
export function startProcessingAnimation(resumeTime=0){stopProcessingAnimation();active=true;time=Math.max(0,Math.min(5*duration,resumeTime));probabilities=null;lastStep=-1;last=performance.now();render();request=requestAnimationFrame(frame);}
export function setProcessingProbabilities(values){probabilities=Array.from(values);render();}
export function stopProcessingAnimation(){active=false;cancelAnimationFrame(request);if(finished){finished();finished=null;}}
new ResizeObserver(()=>{if(active)render();}).observe(canvas);
// Allow every stage to finish; classification waits for actual model output.
export async function completeProcessingAnimation(){
 if(time>=6*duration)return;
 await new Promise(resolve=>{finished=resolve;});
}

export function getProcessingTime(){return time;}


