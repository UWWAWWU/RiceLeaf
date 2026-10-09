import { translatePage } from './i18n.js';
const $ = id => document.getElementById(id);
const labels = ['Bacterial Blight', 'Blast', 'Brown Spot', 'Tungro'];
const captions = {original:'Original photograph',gradcam:'Regions influencing the classification',mask:'Predicted disease mask',overlay:'Predicted area highlighted in red',canny:'Edges within the predicted disease region'};
const diseaseDetails = {
  'Bacterial Blight': {
    description:'Bacterial blight is caused by the bacterium Xanthomonas oryzae pv. oryzae. It affects the leaves and can also cause seedlings to wilt. On mature leaves, lesions often begin near the edges as water-soaked areas. They expand along the leaf, turn yellow to straw-colored, and may eventually dry out. At the seedling stage, a severe form known as kresek can cause rapid wilting. As more leaf tissue is damaged, the plant has less healthy area for growth. Severe infection can weaken the crop and reduce grain production.',
    irri:'https://www.knowledgebank.irri.org/decision-tools/rice-doctor/rice-doctor-fact-sheets/item/bacterial-blight',
    tnau:'https://agritech.tnau.ac.in/crop_protection/rice_diseases/rice_3.html'
  },
  'Blast': {
    description:'Blast is caused by the fungus Magnaporthe oryzae. It can affect leaves and other aboveground parts of the plant. Leaf blast commonly produces elongated, spindle-shaped lesions with pale gray centers and dark brown margins. As the lesions expand and join, larger areas of the leaf can dry out. Infection on nodes or the panicle neck can cause additional damage beyond the leaves. Severe blast can disrupt plant development and reduce grain formation, particularly when the panicle neck is affected.',
    irri:'https://www.knowledgebank.irri.org/training/fact-sheets/pest-management/diseases/item/blast-leaf-collar',
    tnau:'https://agritech.tnau.ac.in/crop_protection/rice_diseases/rice_1.html'
  },
  'Brown Spot': {
    description:'Brown spot is a fungal disease that can appear from the seedling stage onward. It is most visible on leaves but can also appear on leaf sheaths and grains. The disease begins as small spots that develop into oval, dark brown lesions, sometimes surrounded by a yellow halo. Multiple spots may merge and cause portions of the leaf to dry. Spots on grains can lead to discoloration. Extensive infection can damage seedlings and reduce grain quality and weight.',
    irri:'https://www.knowledgebank.irri.org/training/fact-sheets/pest-management/diseases/item/brown-spot',
    tnau:'https://agritech.tnau.ac.in/crop_protection/rice_diseases/rice_2.html'
  },
  'Tungro': {
    description:'Tungro is caused by viruses transmitted by leafhoppers. The disease affects plant growth as well as leaf color. Infected leaves often change from green to yellow or orange-yellow, with discoloration beginning at the tip and spreading downward. Some leaves may also show mottling or rusty spots. Affected plants can become shorter and produce fewer tillers. Early or severe infection can delay flowering and produce small panicles with fewer or poorly filled grains.',
    irri:'https://ricetoday.irri.org/wp-content/uploads/2025/05/Safeguarding-Plant-Health-for-Sustainable-Rice-V2.pdf',
    tnau:'https://agritech.tnau.ac.in/crop_protection/rice_diseases/rice_4.html'
  }
};
let file, images, modelInfo, sessions, cameraStream, torchOn=false, qualityWarning='', analyzing=false;
let stage='image';
const status = (message,error=false) => { $('status').textContent=message; $('status').classList.toggle('error',error); };
function busy(active){
  analyzing=active;
  $('loading-bar').classList.remove('determinate');
  $('loading-spinner').hidden=!active;
  $('loading-bar').hidden=!active;
  $('analyze-label').textContent=active?'Analyzing...':'Analyze image';
  $('analyze-arrow').hidden=active;
  $('change').disabled=active; $('add-photo').disabled=active;
  $('file').disabled=active;
  $('open-camera').disabled=active;
  $('camera-file').disabled=active;
  $('native-camera').disabled=active;
  document.querySelector('.upload-card').setAttribute('aria-busy',String(active));
}
const pct = n => (n*100).toFixed(2)+'%';
const canvas = (w,h) => { const c=document.createElement('canvas'); c.width=w;c.height=h;return c; };
const draw = (id) => { const c=$('output'), source=images[id]; c.width=source.width;c.height=source.height;c.getContext('2d').drawImage(source,0,0); $('caption').textContent=captions[id]; };

async function imageQuality(bitmap){
  if(Math.min(bitmap.width,bitmap.height)<320)return 'This image is small. A larger, clearer close-up may give a more reliable result.';
  const size=256, sample=canvas(size,size),ctx=sample.getContext('2d',{willReadFrequently:true});
  ctx.drawImage(bitmap,0,0,size,size);
  const rgba=ctx.getImageData(0,0,size,size).data,gray=new Float32Array(size*size);
  for(let i=0;i<gray.length;i++){const k=i*4;gray[i]=.299*rgba[k]+.587*rgba[k+1]+.114*rgba[k+2];}
  let sum=0,sq=0,n=0;
  for(let y=1;y<size-1;y++)for(let x=1;x<size-1;x++){
    const i=y*size+x,v=4*gray[i]-gray[i-1]-gray[i+1]-gray[i-size]-gray[i+size];sum+=v;sq+=v*v;n++;
  }
  return sq/n-(sum/n)**2<12?'This photo may be blurry. Try a sharper close-up of the leaf for a more reliable result.':'';
}

async function choose(f){
  if(!f||analyzing)return;
  if(!['image/jpeg','image/png'].includes(f.type)){status('Choose a valid JPG, JPEG, or PNG image.',true);return;}
  $('camera-help').hidden=true;
  $('file').value='';
  closeCamera(); file=f; $('input-empty').hidden=true; $('input-options').hidden=true; $('selected').hidden=false;$('filename').textContent=f.name;$('filesize').textContent=(f.size/1024/1024).toFixed(2)+' MB';
  if($('thumb').src.startsWith('blob:'))URL.revokeObjectURL($('thumb').src);
  $('thumb').src=URL.createObjectURL(f);$('analyze').disabled=true;$('results').hidden=true;$('quality-note').hidden=true;qualityWarning='';status('Checking image clarity...');
  try{
    const bitmap=await createImageBitmap(f,{imageOrientation:'from-image'});
    const warning=await imageQuality(bitmap);bitmap.close();
    if(file!==f)return;
    qualityWarning=warning;$('quality-note').textContent=warning;$('quality-note').hidden=!warning;
    $('analyze').disabled=false;status('Image ready for analysis.');
  }catch(err){if(file!==f)return;console.error(err);file=undefined;$('input-empty').hidden=false;$('input-options').hidden=true;$('selected').hidden=true;URL.revokeObjectURL($('thumb').src);$('thumb').removeAttribute('src');status('This image could not be opened. Choose another JPG or PNG photo.',true);}
}
$('file').addEventListener('change',e=>choose(e.target.files[0]));
$('camera-file').addEventListener('change',e=>{const photo=e.target.files[0];$('camera-file').value='';choose(photo);});
$('native-camera').onclick=()=>$('camera-file').click();
function togglePhotoOptions(){if(analyzing)return;const options=$('input-options');options.hidden=!options.hidden;for(const id of ['change','add-photo'])$(id).setAttribute('aria-expanded',String(!options.hidden));}
$('change').onclick=togglePhotoOptions;
$('add-photo').onclick=togglePhotoOptions;

function showCameraHelp(reason){
  const embedded=window.self!==window.top;
  $('camera-help-text').textContent=embedded
    ? 'Camera access is blocked in this preview. Open the site in a new tab, or use your device camera.'
    : reason==='denied'
      ? 'Camera access was denied. Allow it in your browser settings, or use your device camera.'
      : 'Live camera preview is unavailable here. Use your device camera or upload a photo.';
  $('camera-new-tab').hidden=!embedded;
  $('camera-help').hidden=false;
  status('Choose a camera option below, or upload a photo.',true);
}
function closeCamera(){
  torchOn=false;$('flash-toggle').hidden=true;$('flash-toggle').setAttribute('aria-pressed','false');$('flash-toggle').textContent='Flash off';
  if(cameraStream){cameraStream.getTracks().forEach(track=>track.stop());cameraStream=undefined;}
  $('camera-video').srcObject=null;$('camera-panel').hidden=true;$('open-camera').disabled=analyzing;
}
$('flash-toggle').onclick=async()=>{
  const track=cameraStream?.getVideoTracks()[0];if(!track||track.readyState!=='live')return;
  const button=$('flash-toggle');button.disabled=true;
  try{
    const next=!torchOn;
    await track.applyConstraints({advanced:[{torch:next}]});
    if(cameraStream?.getVideoTracks()[0]!==track)return;
    torchOn=next;button.setAttribute('aria-pressed',String(next));button.textContent=next?'Flash on':'Flash off';
  }catch(err){console.error(err);status('Flash could not be changed on this camera.',true);}
  finally{button.disabled=false;}
};
$('open-camera').onclick=async()=>{
  if(analyzing)return;
  $('camera-help').hidden=true;
  if(!navigator.mediaDevices?.getUserMedia){showCameraHelp('unavailable');return;}
  $('open-camera').disabled=true;status('Opening camera...');
  try{
    const stream=await navigator.mediaDevices.getUserMedia({audio:false,video:{facingMode:{ideal:'environment'}}});
    cameraStream=stream;$('camera-video').srcObject=stream;$('camera-panel').hidden=false;
    const track=stream.getVideoTracks()[0];
    let hasFlash=false;
    try{hasFlash=track?.getCapabilities?.().torch===true;}catch(err){console.warn('Camera flash capabilities unavailable',err);}
    $('flash-toggle').hidden=!hasFlash;
    await $('camera-video').play();status('Position one rice leaf clearly, then capture the photo.');
    $('camera-panel').scrollIntoView({behavior:'smooth',block:'nearest'});
  }catch(err){closeCamera();showCameraHelp(err?.name==='NotAllowedError'?'denied':'unavailable');}
};
$('close-camera').onclick=()=>{closeCamera();status(file?'Image ready for analysis.':'Choose a photo to analyze.');};
$('capture').onclick=async()=>{
  const video=$('camera-video');if(!cameraStream||!video.videoWidth||!video.videoHeight){status('Camera is still starting. Please try again.',true);return;}
  $('capture').disabled=true;
  try{
    const photo=canvas(video.videoWidth,video.videoHeight);photo.getContext('2d').drawImage(video,0,0);
    const blob=await new Promise(resolve=>photo.toBlob(resolve,'image/jpeg',.92));
    if(!blob)throw new Error('Capture failed');
    closeCamera();await choose(new File([blob],`rice-leaf-${Date.now()}.jpg`,{type:'image/jpeg'}));
  }catch(err){console.error(err);status('Could not capture the photo. Please try again.',true);}
  finally{$('capture').disabled=false;}
};
document.addEventListener('visibilitychange',()=>{if(document.hidden&&cameraStream)closeCamera();});
const zone=$('dropzone'); zone.addEventListener('dragover',e=>{e.preventDefault();zone.classList.add('over');});zone.addEventListener('dragleave',()=>zone.classList.remove('over'));zone.addEventListener('drop',e=>{e.preventDefault();zone.classList.remove('over');choose(e.dataTransfer.files[0]);});
$('tabs').onclick=e=>{const button=e.target.closest('[data-tab]');if(!button||!images)return;document.querySelectorAll('[data-tab]').forEach(el=>el.classList.toggle('active',el===button));draw(button.dataset.tab);};

async function fetchAsset(path){
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),90000);
  try{
    const response=await fetch(path,{signal:controller.signal});
    if(!response.ok)throw new Error(`Asset request failed (${response.status}): ${path}`);
    return await response.json();
  }finally{clearTimeout(timeout);}
}

async function loadModels(){
  if(sessions)return sessions;
  stage='download';
  status('Preparing models for the first analysis...');
  ort.env.wasm.wasmPaths = new URL('./runtime/',import.meta.url).href;
  ort.env.wasm.numThreads = 1;
  const meta=await fetchAsset('./models/metadata.json');
  const manifest=await fetchAsset('./models/manifest.json');
  const total=Object.values(manifest.models).reduce((n,m)=>n+m.size_bytes,0);
  let downloaded=0;
  const progress=(name,received)=>{
    const percentage=Math.min(100,Math.round((downloaded+received)/total*100));
    status(`Downloading ${name}: ${((downloaded+received)/1e6).toFixed(1)} / ${(total/1e6).toFixed(1)} MB (${percentage}%)`);
    $('loading-bar').classList.add('determinate');
    $('loading-bar').style.setProperty('--progress',`${percentage}%`);
  };
  const classifierBytes=await modelBytes('classifier',manifest.models.classifier,n=>progress('classifier',n));
  downloaded+=classifierBytes.byteLength;
  stage='initialization';status('Starting the classification model...');
  $('loading-bar').classList.remove('determinate');
  const classifier=await ort.InferenceSession.create(classifierBytes,{executionProviders:['wasm']});
  try{
    stage='download';
    const segmenterBytes=await modelBytes('segmenter',manifest.models.segmenter,n=>progress('segmenter',n));
    stage='initialization';status('Starting the segmentation model...');
    $('loading-bar').classList.remove('determinate');
    const segmenter=await ort.InferenceSession.create(segmenterBytes,{executionProviders:['wasm']});
    modelInfo=meta;sessions={classifier,segmenter};return sessions;
  }catch(err){await classifier.release();throw err;}
}

async function modelBytes(name,model,onProgress){
  const bytes=new Uint8Array(model.size_bytes);let offset=0;
  for(const part of model.parts){
    const controller=new AbortController();let timeout;
    const resetTimeout=()=>{clearTimeout(timeout);timeout=setTimeout(()=>controller.abort(),90000);};
    resetTimeout();
    try{
      const response=await fetch(`./models/${part.file}`,{signal:controller.signal});
      if(!response.ok)throw new Error(`Could not download ${name} (${response.status})`);
      const reader=response.body.getReader();let received=0;
      while(true){
        const {done,value}=await reader.read();if(done)break;
        resetTimeout();
        if(received+value.byteLength>part.size_bytes){await reader.cancel();throw new Error('Unexpected model size');}
        bytes.set(value,offset+received);received+=value.byteLength;onProgress(offset+received);
      }
      if(received!==part.size_bytes)throw new Error('Incomplete model download');
      const digest=await crypto.subtle.digest('SHA-256',bytes.subarray(offset,offset+received));
      const checksum=Array.from(new Uint8Array(digest),v=>v.toString(16).padStart(2,'0')).join('');
      if(checksum!==part.sha256)throw new Error('Model checksum mismatch');
      offset+=received;
    }finally{clearTimeout(timeout);}
  }
  return bytes;
}

function preprocess(bitmap){
  const size=modelInfo.image_size,w=bitmap.width,h=bitmap.height,ratio=Math.min(size/w,size/h),rw=Math.max(1,Math.round(w*ratio)),rh=Math.max(1,Math.round(h*ratio)),left=Math.floor((size-rw)/2),top=Math.floor((size-rh)/2);
  const square=canvas(size,size),ctx=square.getContext('2d',{willReadFrequently:true});const pad=modelInfo.padding_rgb;ctx.fillStyle=`rgb(${pad.join(',')})`;ctx.fillRect(0,0,size,size);ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='low';ctx.drawImage(bitmap,left,top,rw,rh);
  const raw=ctx.getImageData(0,0,size,size).data,data=new Float32Array(3*size*size);
  for(let i=0;i<size*size;i++)for(let ch=0;ch<3;ch++)data[ch*size*size+i]=(raw[i*4+ch]/255-modelInfo.mean[ch])/modelInfo.std[ch];
  return {tensor:new ort.Tensor('float32',data,[1,3,size,size]),box:{left,top,rw,rh}};
}

function restoredMap(values,mapW,mapH,box,w,h,transform=v=>v){
  const small=canvas(mapW,mapH),d=small.getContext('2d').createImageData(mapW,mapH);
  for(let i=0;i<values.length;i++){const v=Math.max(0,Math.min(255,Math.round(transform(values[i])*255)));d.data[i*4]=d.data[i*4+1]=d.data[i*4+2]=v;d.data[i*4+3]=255;}
  small.getContext('2d').putImageData(d,0,0);
  const cropped=canvas(box.rw,box.rh);cropped.getContext('2d').drawImage(small,box.left/modelInfo.image_size*mapW,box.top/modelInfo.image_size*mapH,box.rw/modelInfo.image_size*mapW,box.rh/modelInfo.image_size*mapH,0,0,box.rw,box.rh);
  const full=canvas(w,h),ctx=full.getContext('2d',{willReadFrequently:true});ctx.imageSmoothingEnabled=true;ctx.drawImage(cropped,0,0,w,h);return ctx.getImageData(0,0,w,h).data;
}

function camPlusPlus(feature,shape,weights,cls){
  const [,,height,width]=shape,area=height*width,channels=shape[1],out=new Float32Array(area),w=weights[cls];
  for(let ch=0;ch<channels;ch++){
    const offset=ch*area,g=w[ch]/area,g2=g*g,g3=g2*g; if(g<=0)continue;
    let sum=0;for(let i=0;i<area;i++)sum+=feature[offset+i];
    let score=0;for(let i=0;i<area;i++)if(feature[offset+i]>0)score+=g*g2/(2*g2+sum*g3+1e-7);
    for(let i=0;i<area;i++)out[i]+=score*feature[offset+i];
  }
  let min=Infinity,max=-Infinity;for(let i=0;i<area;i++){out[i]=Math.max(0,out[i]);min=Math.min(min,out[i]);max=Math.max(max,out[i]);}
  const diff=max-min;for(let i=0;i<area;i++)out[i]=diff? (out[i]-min)/diff:0;
  return out;
}

function makeVisuals(original,camData,maskData,threshold){
  const w=original.width,h=original.height,source=original.getContext('2d',{willReadFrequently:true}).getImageData(0,0,w,h),n=w*h;
  const heat=canvas(w,h),hc=heat.getContext('2d'),hd=hc.createImageData(w,h);
  const mask=canvas(w,h),mc=mask.getContext('2d'),md=mc.createImageData(w,h);
  const overlay=canvas(w,h),oc=overlay.getContext('2d'),od=oc.createImageData(w,h);
  const selected=new Uint8Array(n);let count=0;
  for(let i=0;i<n;i++){
    const k=i*4,t=camData[k]/255,jet=[Math.max(0,Math.min(1,1.5-Math.abs(4*t-3))),Math.max(0,Math.min(1,1.5-Math.abs(4*t-2))),Math.max(0,Math.min(1,1.5-Math.abs(4*t-1)))];
    for(let c=0;c<3;c++)hd.data[k+c]=Math.round(.5*source.data[k+c]+.5*jet[c]*255);
    selected[i]=maskData[k]/255>=threshold?1:0;count+=selected[i];
    for(let c=0;c<3;c++){md.data[k+c]=selected[i]?255:0;od.data[k+c]=selected[i]?Math.round(.6*source.data[k+c]+.4*(c===0?255:40)):source.data[k+c];}
    hd.data[k+3]=md.data[k+3]=od.data[k+3]=255;
  }
  hc.putImageData(hd,0,0);mc.putImageData(md,0,0);oc.putImageData(od,0,0);
  const edges=cannyEdges(source.data,w,h),dilated=new Uint8Array(n),canny=canvas(w,h),cc=canny.getContext('2d'),cd=cc.createImageData(w,h);
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){let on=0;for(let dy=-2;dy<=2&&!on;dy++)for(let dx=-2;dx<=2;dx++){const yy=y+dy,xx=x+dx;if(yy>=0&&yy<h&&xx>=0&&xx<w&&selected[yy*w+xx]){on=1;break;}}dilated[y*w+x]=on;}
  for(let i=0;i<n;i++){const v=dilated[i]&&edges[i]?255:0,k=i*4;cd.data[k]=cd.data[k+1]=cd.data[k+2]=v;cd.data[k+3]=255;}cc.putImageData(cd,0,0);
  return {gradcam:heat,mask,overlay,canny,coverage:count/n};
}

function cannyEdges(rgba,w,h){
  const n=w*h,gray=new Float32Array(n),blur=new Float32Array(n),mag=new Float32Array(n),dir=new Uint8Array(n),thin=new Float32Array(n),out=new Uint8Array(n);
  for(let i=0;i<n;i++){const k=i*4;gray[i]=.299*rgba[k]+.587*rgba[k+1]+.114*rgba[k+2];}
  const kernel=[1,4,6,4,1],temp=new Float32Array(n);
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){let a=0;for(let k=-2;k<=2;k++)a+=kernel[k+2]*gray[y*w+Math.max(0,Math.min(w-1,x+k))];temp[y*w+x]=a/16;}
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){let a=0;for(let k=-2;k<=2;k++)a+=kernel[k+2]*temp[Math.max(0,Math.min(h-1,y+k))*w+x];blur[y*w+x]=a/16;}
  for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){const i=y*w+x,gx=-blur[i-w-1]-2*blur[i-1]-blur[i+w-1]+blur[i-w+1]+2*blur[i+1]+blur[i+w+1],gy=-blur[i-w-1]-2*blur[i-w]-blur[i-w+1]+blur[i+w-1]+2*blur[i+w]+blur[i+w+1],a=Math.atan2(gy,gx)*180/Math.PI;mag[i]=Math.hypot(gx,gy);dir[i]=(Math.round((a+180)/45)%4);}
  for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){const i=y*w+x,d=dir[i],a=d===0?1:d===1?w+1:d===2?w:w-1;if(mag[i]>=mag[i-a]&&mag[i]>=mag[i+a])thin[i]=mag[i];}
  const stack=[];for(let i=0;i<n;i++)if(thin[i]>=150){out[i]=255;stack.push(i);}
  while(stack.length){const i=stack.pop(),y=Math.floor(i/w),x=i%w;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const yy=y+dy,xx=x+dx,j=yy*w+xx;if(xx>=0&&xx<w&&yy>=0&&yy<h&&!out[j]&&thin[j]>=50){out[j]=255;stack.push(j);}}}
  return out;
}

$('analyze').onclick=async()=>{
  if(!file)return;$('analyze').disabled=true;$('results').hidden=true;$('input-options').hidden=true;busy(true);
  try{
    stage='image';
    const bitmap=await createImageBitmap(file,{imageOrientation:'from-image'});
    const scale=Math.min(1,1400/Math.max(bitmap.width,bitmap.height));
    const visualWidth=Math.max(1,Math.round(bitmap.width*scale)),visualHeight=Math.max(1,Math.round(bitmap.height*scale));
    const original=canvas(visualWidth,visualHeight);original.getContext('2d').drawImage(bitmap,0,0,visualWidth,visualHeight);
    await loadModels();const {tensor,box}=preprocess(bitmap);
    bitmap.close();stage='classification';status('Calculating disease predictions...');
    const result=await sessions.classifier.run({input:tensor});
    const logits=Array.from(result.logits.data),temp=modelInfo.temperature,max=Math.max(...logits),exp=logits.map(v=>Math.exp((v-max)/temp)),sum=exp.reduce((a,b)=>a+b,0),probs=exp.map(v=>v/sum),cls=probs.indexOf(Math.max(...probs));
    const uncertain=probs[cls]<modelInfo.confidence_threshold;
    const resultWarning=[uncertain?`Low confidence prediction: the score is below the model's ${(modelInfo.confidence_threshold*100).toFixed(1)}% review threshold. Try a clearer close-up and review the result carefully.`:'',qualityWarning].filter(Boolean).join(' ');
    $('result-note').textContent=resultWarning;$('result-note').hidden=!resultWarning;
    const feat=result.features,cam=camPlusPlus(feat.data,feat.dims,modelInfo.cam_class_weights,cls),camPixels=restoredMap(cam,feat.dims[3],feat.dims[2],box,visualWidth,visualHeight);
    stage='segmentation';status('Creating the disease mask and visualizations...');
    const seg=await sessions.segmenter.run({input:tensor}),logit=seg.mask_logits,maskPixels=restoredMap(logit.data,logit.dims[3],logit.dims[2],box,visualWidth,visualHeight,v=>1/(1+Math.exp(-v)));
    const visuals=makeVisuals(original,camPixels,maskPixels,modelInfo.segmentation_threshold);
    images={original,...visuals};$('prediction').textContent=modelInfo.labels[cls];$('confidence').textContent=pct(probs[cls]);$('coverage').textContent=pct(visuals.coverage);
    const detail=diseaseDetails[modelInfo.labels[cls]];
    $('disease-description').textContent=detail.description;
    $('disease-irri').href=detail.irri;
    $('disease-tnau').href=detail.tnau;
    $('scores').replaceChildren(...probs.map((score,i)=>{const row=document.createElement('div');row.className='score';const label=document.createElement('div');label.className='score-label';const name=document.createElement('span');name.textContent=modelInfo.labels[i];const value=document.createElement('b');value.textContent=pct(score);label.append(name,value);const bar=document.createElement('div');bar.className='bar';const fill=document.createElement('span');fill.style.width=`${score*100}%`;bar.append(fill);row.append(label,bar);return row;}));
    document.querySelectorAll('[data-tab]').forEach(el=>el.classList.toggle('active',el.dataset.tab==='original'));draw('original');$('results').hidden=false;$('results').scrollIntoView({behavior:'smooth'});status('Analysis complete.');
  }catch(err){console.error(err);$('selected').hidden=false;const message=stage==='image'?'This image could not be opened. Choose another JPG or PNG photo.':stage==='download'?'Model download failed or was incomplete. Check your connection and try again.':stage==='initialization'?'The models could not start in this browser. Close other tabs and try again in an updated browser.':'Image analysis failed. Try again or choose another clear photo.';status(message,true);}
  finally{busy(false);$('analyze').disabled=false;}
};
