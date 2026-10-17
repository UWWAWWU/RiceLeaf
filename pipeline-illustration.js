import { translate } from './i18n.js';
const C={fg:'#304238',muted:'#718569',border:'#cbd8c2',green:'#78964f',orange:'#b8854e',red:'#d87956',series:'#62814e',bg:'#f6f8f0'};
export function drawPipeline(canvas,step,p,showText=false,options={}){
 const rect=canvas.getBoundingClientRect();if(!rect.width||!rect.height)return;
 const d=devicePixelRatio||1,logicalHeight=showText?300:step===5?145:step===4?240:step===1?255:step===3?255:step===2?250:300,scale=rect.height/logicalHeight,W=rect.width/scale,H=logicalHeight;
 if(canvas.width!==Math.round(rect.width*d)||canvas.height!==Math.round(rect.height*d)){
  canvas.width=Math.round(rect.width*d);canvas.height=Math.round(rect.height*d);
 }
 const ctx=canvas.getContext('2d');ctx.setTransform(d*scale,0,0,d*scale,0,0);
function line(x1,y1,x2,y2,color=C.border){ctx.strokeStyle=color;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke()}
function text(s,x,y,align='center'){ctx.fillStyle=C.fg;ctx.textAlign=align;ctx.font='14px DM Sans, Arial, sans-serif';if(showText)ctx.fillText(translate(s),x,y)}
function leaf(cx,cy,scale,mask=0,heat=false){ctx.save();ctx.translate(cx,cy);ctx.scale(scale,scale);ctx.beginPath();ctx.moveTo(-18,95);ctx.bezierCurveTo(-70,15,-5,-92,42,-110);ctx.bezierCurveTo(78,-10,24,80,-18,95);ctx.fillStyle=C.green;ctx.globalAlpha=.8;ctx.fill();ctx.globalAlpha=1;line(-23,105,42,-110,C.bg);for(let i=0;i<6;i++){const y=65-i*28,x=-12+i*8;line(x,y,x-24,y-25,C.bg);line(x,y,x+28,y-18,C.bg)}
const spots=[[-14,38,8,18],[21,-25,7,13],[4,3,6,10]];for(let i=0;i<spots.length;i++){let [x,y,rx,ry]=spots[i];ctx.beginPath();ctx.ellipse(x,y,rx,ry,.35,0,Math.PI*2);ctx.fillStyle=mask>i/3?C.red:C.orange;ctx.globalAlpha=heat?.35+.5*mask:1;ctx.fill();if(mask>i/3){ctx.strokeStyle=C.fg;ctx.lineWidth=1;ctx.stroke()}}ctx.restore();ctx.globalAlpha=1}
function packet(x,y){ctx.beginPath();ctx.arc(x,y,4,0,Math.PI*2);ctx.fillStyle=C.series;ctx.fill()}
function draw(step,p){ctx.clearRect(0,0,W,H);const center=W/2;
if(step===0){leaf(center,H/2, (showText?.8:1.2)+Math.sin(p*Math.PI)*.03);text('RGB',center,H-12)}
if(step===1){let side=220,x=center-side/2,y=22;ctx.fillStyle=C.muted;ctx.globalAlpha=.13;ctx.fillRect(x,y,side,side);ctx.globalAlpha=1;leaf(center,137,.8);ctx.strokeStyle=C.border;ctx.strokeRect(x,y,side,side);const sy=y+side*p;line(x,sy,x+side,sy,C.series);for(let i=1;i<8;i++){ctx.globalAlpha=.18;line(x+i*side/8,y,x+i*side/8,y+side);line(x,y+i*side/8,x+side,y+i*side/8)}ctx.globalAlpha=1}
if(step===2){leaf(center,showText?145:130,.88,p,true);const scanY=(showText?40:25)+p*195;line(center-85,scanY,center+85,scanY,C.series);text(p<.5?'Probability map':'Mask ≥ 0.5',center,H-12)}
if(step===3){const span=showText?Math.min(W,600):W,origin=(W-span)/2;const left=origin+span*.11,featureX=origin+span*.49,mergeX=origin+span*.92;leaf(left,145,.65,1);const names=['Full image','Disease region','18 shape features'];names.forEach((label,i)=>{const y=58+i*78;line(left+42,145,featureX-45,y);line(featureX+48,y,mergeX,145);for(let k=0;k<3;k++){const t=(p+k/3)%1;packet(featureX+48+(mergeX-featureX-48)*t,y+(145-y)*t)}text(label,featureX,y-14);for(let j=0;j<8;j++){ctx.fillStyle=C.series;ctx.globalAlpha=.25+((j+i)%3)*.25;ctx.fillRect(featureX-40+j*11,y,6,12+((j*7+i)%4)*4)}ctx.globalAlpha=1});for(let j=0;j<12;j++){ctx.fillStyle=C.series;ctx.globalAlpha=.3+(j%3)*.3;ctx.fillRect(mergeX-15+(j%3)*10,105+Math.floor(j/3)*20,6,14)}ctx.globalAlpha=1;text('Combined',mergeX,218)}
if(step===4){
 const names=['Bacterial Blight','Blast','Brown Spot','Tungro'];
 const vals=options.actual?options.probabilities:[.12,.68,.08,.12];
 if(!vals){text('Waiting for model predictions…',center,H/2);return;}
 const winner=vals.indexOf(Math.max(...vals)),left=showText?Math.min(210,W*.43):12,available=W-left-(showText?85:12);
 names.forEach((n,i)=>{const y=45+i*54;text(n,left-10,y+13,'right');ctx.fillStyle=C.border;ctx.globalAlpha=.35;ctx.fillRect(left,y,available,18);ctx.globalAlpha=1;ctx.fillStyle=C.series;ctx.globalAlpha=i===winner?1:.35;ctx.fillRect(left,y,available*vals[i]*Math.min(1,p*1.4),18);ctx.globalAlpha=1;text((vals[i]*100).toFixed(2)+'%',left+available+10,y+13,'left');});

}
if(step===5){const positions=[W*.2,W*.5,W*.8];['Original','Heatmap','Overlay'].forEach((n,i)=>{leaf(positions[i],showText?110:76,.56,i===0?0:1,i===1);text(n,positions[i],190)})}
}

draw(step,p);
}
