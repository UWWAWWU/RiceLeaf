import { translatePage } from './i18n.js';
import { startProcessingAnimation, stopProcessingAnimation, completeProcessingAnimation, setProcessingProbabilities, getProcessingTime } from './processing-animation.js';
import { loadTabState, saveTabState, loadTabPosition, saveTabPosition } from './tab-session.js';
import { preparePhoto } from './photo-formats.js';
const $ = id => document.getElementById(id);
const labels = ['Bacterial Blight', 'Blast', 'Brown Spot', 'Tungro'];
const captions = {original:'Original photo',gradcam:'Predicted disease probability at each pixel',mask:'Predicted disease mask',overlay:'Predicted area highlighted in red with its mask boundary'};
const diseaseDetails = {
  'Bacterial Blight': {
    description:'Bacterial blight is caused by the bacterium Xanthomonas oryzae pv. oryzae. It affects the leaves and can also cause seedlings to wilt. On mature leaves, lesions often begin near the edges as areas that look wet. They expand along the leaf, turn yellow and then take on the color of straw, and may eventually dry out. At the seedling stage, a severe form known as kresek can cause rapid wilting. As more leaf tissue is damaged, the plant has less healthy area for growth. Severe infection can weaken the crop and reduce grain production.',
    irri:'https://www.knowledgebank.irri.org/decision-tools/rice-doctor/rice-doctor-fact-sheets/item/bacterial-blight',
    tnau:'https://agritech.tnau.ac.in/crop_protection/rice_diseases/rice_3.html'
  },
  'Blast': {
    description:'Blast is caused by the fungus Magnaporthe oryzae. It can affect leaves and other aboveground parts of the plant. Leaf blast commonly produces elongated lesions shaped like a spindle with pale gray centers and dark brown margins. As the lesions expand and join, larger areas of the leaf can dry out. Infection on nodes or the panicle neck can cause additional damage beyond the leaves. Severe blast can disrupt plant development and reduce grain formation, particularly when the panicle neck is affected.',
    irri:'https://www.knowledgebank.irri.org/training/fact-sheets/pest-management/diseases/item/blast-leaf-collar',
    tnau:'https://agritech.tnau.ac.in/crop_protection/rice_diseases/rice_1.html'
  },
  'Brown Spot': {
    description:'Brown spot is a fungal disease that can appear from the seedling stage onward. It is most visible on leaves but can also appear on leaf sheaths and grains. The disease begins as small spots that develop into oval, dark brown lesions, sometimes surrounded by a yellow halo. Multiple spots may merge and cause portions of the leaf to dry. Spots on grains can lead to discoloration. Extensive infection can damage seedlings and reduce grain quality and weight.',
    irri:'https://www.knowledgebank.irri.org/training/fact-sheets/pest-management/diseases/item/brown-spot',
    tnau:'https://agritech.tnau.ac.in/crop_protection/rice_diseases/rice_2.html'
  },
  'Tungro': {
    description:'Tungro is caused by viruses transmitted by leafhoppers. The disease affects plant growth as well as leaf color. Infected leaves often change from green to yellow or yellow with an orange tint, with discoloration beginning at the tip and spreading downward. Some leaves may also show mottling or rusty spots. Affected plants can become shorter and produce fewer tillers. Early or severe infection can delay flowering and produce small panicles with fewer or poorly filled grains.',
    irri:'https://ricetoday.irri.org/wp-content/uploads/2025/05/Safeguarding-Plant-Health-for-Sustainable-Rice-V2.pdf',
    tnau:'https://agritech.tnau.ac.in/crop_protection/rice_diseases/rice_4.html'
  }
};
let file, images, modelInfo, sessions, cameraStream, torchOn=false, qualityWarning='', analyzing=false;
let stage='image',currentView='home',activeVisual='overlay',resultProbabilities=null,resumeTime=0,persistRevision=0,restoring=false;
let cachedImages,cachedBlobs;
let modelPreparation,modelReady=false,preparationStage='download';
function updateAnalyzeButton(){ $('analyze').disabled=!file||!modelReady||analyzing; }
function modelStatus(message,error=false){
  $('model-status').textContent=message;$('model-status').classList.toggle('error',error);
}
async function prepareModel(){
  if(modelReady)return sessions;
  if(modelPreparation)return modelPreparation;
  modelPreparation=(async()=>{
    $('model-readiness').hidden=false;$('retry-model').hidden=true;$('model-progress').hidden=false;modelStatus('Downloading model...');
    try{
      await loadModels();modelReady=true;$('model-readiness').hidden=true;return sessions;
    }catch(error){
      console.error('Model preparation failed', {stage:preparationStage,message:error.message,stack:error.stack});
      modelStatus(preparationStage==='download'?'Model download failed. Check your connection and try again.':'Model preparation failed. Try again.',true);
      $('retry-model').hidden=false;throw error;
    }finally{
      $('model-progress').hidden=true;modelPreparation=undefined;updateAnalyzeButton();
    }
  })();
  return modelPreparation;
}
$('retry-model').onclick=()=>{void prepareModel().catch(()=>{});};
const status = (message,error=false) => { $('status').textContent=message; $('status').classList.toggle('error',error); $('processing-status').textContent=message;$('processing-status').classList.toggle('error',error); };
function showView(view){
  currentView=view;
  document.body.classList.toggle('processing-screen',view==='processing');
  $('home-view').hidden=view!=='home';$('processing-view').hidden=view!=='processing';$('results').hidden=view!=='results';
  $('about').hidden=view!=='home';document.querySelector('.header-link').hidden=view!=='home';
  window.scrollTo({top:0,behavior:'instant'});
}
let photoSelection=0;
$('try-another-photo').onclick=()=>{
  photoSelection++;stopProcessingAnimation();closeCamera();closePhotoOptions();
  file=undefined;images=undefined;resultProbabilities=null;qualityWarning='';persistRevision++;cachedImages=cachedBlobs=undefined;void saveTabState(null).catch(console.error);saveTabPosition(null);
  if($('thumb').src.startsWith('blob:'))URL.revokeObjectURL($('thumb').src);
  $('thumb').removeAttribute('src');$('filename').textContent='';$('filesize').textContent='';
  $('file').value='';$('camera-file').value='';$('selected').hidden=true;$('input-empty').hidden=false;
  $('quality-note').hidden=true;$('result-note').hidden=true;$('camera-help').hidden=true;
  $('scores').replaceChildren();for(const id of ['prediction','confidence','coverage'])$(id).textContent='—';
  $('output').width=0;$('output').height=0;busy(false);$('analyze').disabled=true;
  status('Your image stays in your browser during analysis.');showView('home');$('add-photo').focus({preventScroll:true});
};
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
const draw = (id) => { activeVisual=id; const c=$('output'), source=images[id]; c.width=source.width;c.height=source.height;c.getContext('2d').drawImage(source,0,0); $('caption').textContent=captions[id];$('caption').hidden=id==='gradcam';$('heatmap-legend').hidden=id!=='gradcam'; };

async function imageQuality(bitmap){
  if(Math.min(bitmap.width,bitmap.height)<320)return 'This image is small. A larger, clearer close up may give a more reliable result.';
  const size=256, sample=canvas(size,size),ctx=sample.getContext('2d',{willReadFrequently:true});
  ctx.drawImage(bitmap,0,0,size,size);
  const rgba=ctx.getImageData(0,0,size,size).data,gray=new Float32Array(size*size);
  for(let i=0;i<gray.length;i++){const k=i*4;gray[i]=.299*rgba[k]+.587*rgba[k+1]+.114*rgba[k+2];}
  let sum=0,sq=0,n=0;
  for(let y=1;y<size-1;y++)for(let x=1;x<size-1;x++){
    const i=y*size+x,v=4*gray[i]-gray[i-1]-gray[i+1]-gray[i-size]-gray[i+size];sum+=v;sq+=v*v;n++;
  }
  return sq/n-(sum/n)**2<12?'This photo may be blurry. Try a sharper close up of the leaf for a more reliable result.':'';
}

async function choose(source){
  if(!source||analyzing)return;
  const selection=++photoSelection;images=undefined;resultProbabilities=null;file=undefined;$('analyze').disabled=true;
  closeCamera();closePhotoOptions();$('camera-help').hidden=true;$('quality-note').hidden=true;
  try{
    status('Opening photo...');
    const prepared=await preparePhoto(source,()=>status('Converting HEIC photo...'));
    if(selection!==photoSelection)return;
    const bitmap=await createImageBitmap(prepared,{imageOrientation:'from-image'});
    const warning=await imageQuality(bitmap);bitmap.close();
    if(selection!==photoSelection)return;
    file=prepared;qualityWarning=warning;
    if($('thumb').src.startsWith('blob:'))URL.revokeObjectURL($('thumb').src);
    $('thumb').src=URL.createObjectURL(prepared);$('filename').textContent=source.name;
    $('filesize').textContent=(source.size/1024/1024).toFixed(2)+' MB';
    $('input-empty').hidden=true;$('selected').hidden=false;
    $('quality-note').textContent=warning;$('quality-note').hidden=!warning;
    updateAnalyzeButton();status('Image ready for analysis.');await persistTab();
  }catch(err){
    if(selection!==photoSelection)return;
    console.error(err);file=undefined;$('input-empty').hidden=false;$('selected').hidden=true;
    if($('thumb').src.startsWith('blob:'))URL.revokeObjectURL($('thumb').src);
    $('thumb').removeAttribute('src');
    status(err.code==='unsupported'?'Choose a valid JPG, PNG, HEIC or HEIF photo.':'This photo could not be opened or converted. Try another photo.',true);
  }
}
$('file').addEventListener('change',e=>choose(e.target.files[0]));
$('camera-file').addEventListener('change',e=>{const photo=e.target.files[0];$('camera-file').value='';choose(photo);});
$('native-camera').onclick=()=>$('camera-file').click();
let photoTrigger;
function closePhotoOptions(){const dialog=$('photo-dialog');if(dialog.open)dialog.close();for(const id of ['change','add-photo'])$(id).setAttribute('aria-expanded','false');}
function openPhotoOptions(event){if(analyzing)return;photoTrigger=event?.currentTarget||$('add-photo');$('photo-dialog').showModal();photoTrigger.setAttribute('aria-expanded','true');}
$('change').onclick=openPhotoOptions;
$('add-photo').onclick=openPhotoOptions;
$('close-photo-dialog').onclick=closePhotoOptions;
$('photo-dialog').addEventListener('click',event=>{if(event.target===$('photo-dialog')){const box=event.target.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)closePhotoOptions();}});
$('photo-dialog').addEventListener('close',()=>{for(const id of ['change','add-photo'])$(id).setAttribute('aria-expanded','false');photoTrigger?.focus();});
$('file').addEventListener('click',closePhotoOptions);
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
  if(analyzing)return;closePhotoOptions();
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
$('results').addEventListener('click',e=>{const button=e.target.closest('[data-tab]');if(!button||!images)return;document.querySelectorAll('[data-tab]').forEach(el=>el.classList.toggle('active',el===button));draw(button.dataset.tab);void persistTab();});

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
  preparationStage='download';
  ort.env.wasm.wasmPaths = new URL('./runtime/',import.meta.url).href;
  ort.env.wasm.numThreads = 1;
  const config=await fetchAsset('./models/inference_config.json');
  const manifest=await fetchAsset('./models/manifest.json?v=2');
  const model=manifest.models.pipeline;
  const progress=received=>{
    const percentage=Math.min(100,Math.round(received/model.size_bytes*100));
    modelStatus(`Downloading model: ${(received/1e6).toFixed(1)} / ${(model.size_bytes/1e6).toFixed(1)} MB (${percentage}%)`);
    $('model-progress').value=percentage;

  };
  const bytes=await modelBytes('pipeline',model,progress);
  preparationStage='initialization';modelStatus('Preparing model...');
  $('model-progress').removeAttribute('value');
  const pipeline=await ort.InferenceSession.create(bytes,{executionProviders:['wasm']});
  let probe,outputs;
  try{
    if(pipeline.inputNames[0]!==config.input_name || !Object.keys(config.outputs).every(name=>pipeline.outputNames.includes(name)))throw new Error('Model configuration does not match its inputs and outputs');
    // Exercise the first inference before allowing a photo analysis.
    preparationStage='verification';
    probe=new ort.Tensor('float32',new Float32Array(3*320*320),[1,3,320,320]);
    outputs=await pipeline.run({[config.input_name]:probe});
    const probabilities=Array.from(outputs.class_probabilities.data);
    if(probabilities.length!==labels.length||probabilities.some(value=>!Number.isFinite(value)))throw new Error('Invalid model readiness probabilities');
  }catch(error){await pipeline.release();throw error;}
  finally{probe?.dispose();if(outputs)for(const output of Object.values(outputs))output.dispose();}
  modelInfo={...config,labels:config.class_names.map((name,i)=>labels[i]),mean:config.normalization.mean,std:config.normalization.std,padding_rgb:[0,0,0]};
  sessions={pipeline};return sessions;
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
  // Outline the thresholded mask, rather than unrelated texture edges.
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
    const i=y*w+x;if(!selected[i])continue;
    if(x===0||y===0||x===w-1||y===h-1||!selected[i-1]||!selected[i+1]||!selected[i-w]||!selected[i+w]){
      const k=i*4;od.data[k]=255;od.data[k+1]=225;od.data[k+2]=100;
    }
  }
  oc.putImageData(od,0,0);
  return {gradcam:heat,mask,overlay,coverage:count/n};
}

$('analyze').onclick=async()=>{
  if(!file||!modelReady||analyzing)return;$('analyze').disabled=true;$('results').hidden=true;closePhotoOptions();$('processing-error-actions').hidden=true;busy(true);showView('processing');startProcessingAnimation(resumeTime);resumeTime=0;await persistTab();
  try{
    stage='image';
    const bitmap=await createImageBitmap(file,{imageOrientation:'from-image'});
    const scale=Math.min(1,1400/Math.max(bitmap.width,bitmap.height));
    const visualWidth=Math.max(1,Math.round(bitmap.width*scale)),visualHeight=Math.max(1,Math.round(bitmap.height*scale));
    const original=canvas(visualWidth,visualHeight);original.getContext('2d').drawImage(bitmap,0,0,visualWidth,visualHeight);
    const {tensor,box}=preprocess(bitmap);
    bitmap.close();stage='classification';status('Calculating disease predictions...');
    const result=await sessions.pipeline.run({[modelInfo.input_name]:tensor});
    const probs=Array.from(result.class_probabilities.data),cls=probs.indexOf(Math.max(...probs));
    if(probs.length!==labels.length || probs.some(v=>!Number.isFinite(v)))throw new Error('Invalid class probabilities');
    setProcessingProbabilities(probs);resultProbabilities=probs;
    $('result-note').textContent=qualityWarning;$('result-note').hidden=!qualityWarning;
    stage='segmentation';status('Creating the disease mask and visualizations...');
    const map=result.disease_probabilities;
    const maskPixels=restoredMap(map.data,map.dims[3],map.dims[2],box,visualWidth,visualHeight);
    const visuals=makeVisuals(original,maskPixels,maskPixels,modelInfo.mask_threshold);
    images={original,...visuals};$('prediction').textContent=modelInfo.labels[cls];$('confidence').textContent=pct(probs[cls]);$('coverage').textContent=pct(visuals.coverage);
    const detail=diseaseDetails[modelInfo.labels[cls]];
    $('disease-description').textContent=detail.description;
    $('disease-irri').href=detail.irri;
    $('disease-tnau').href=detail.tnau;
    $('scores').replaceChildren(...probs.map((score,i)=>{const row=document.createElement('div');row.className='score';const label=document.createElement('div');label.className='score-label';const name=document.createElement('span');name.textContent=modelInfo.labels[i];const value=document.createElement('b');value.textContent=pct(score);label.append(name,value);const bar=document.createElement('div');bar.className='bar';const fill=document.createElement('span');fill.style.width=`${score*100}%`;bar.append(fill);row.append(label,bar);return row;}));
    document.querySelectorAll('[data-tab]').forEach(el=>el.classList.toggle('active',el.dataset.tab==='overlay'));draw('overlay');await persistTab();await completeProcessingAnimation();stopProcessingAnimation();showView('results');$('results-title').focus({preventScroll:true});status('Analysis complete.');await persistTab();
  }catch(err){console.error('Photo analysis failed',{stage,message:err.message,stack:err.stack});stopProcessingAnimation();showView('processing');$('processing-error-actions').hidden=false;$('processing-step-title').textContent='Analysis could not finish';$('processing-step-detail').textContent='';const message=stage==='image'?'This photo could not be opened or converted. Try another photo.':stage==='download'?'Model download failed or was incomplete. Check your connection and try again.':stage==='initialization'?'The models could not start in this browser. Close other tabs and try again in an updated browser.':stage==='segmentation'?'The prediction visualizations could not be created. Try the analysis again.':'The model could not calculate a prediction. Try again or choose another clear photo.';status(message,true);$('retry-analysis').focus({preventScroll:true});await persistTab();}
  finally{busy(false);updateAnalyzeButton();}
};

$('retry-analysis').onclick=()=>{if(!analyzing)void $('analyze').onclick();};
$('choose-another-photo').onclick=()=>{if(!analyzing)$('try-another-photo').click();};

async function persistTab(){
 if(restoring)return;
 const revision=++persistRevision;
 try{
  const snapshot={file,filename:$('filename').textContent,filesize:$('filesize').textContent,qualityWarning,view:currentView,visual:activeVisual,probabilities:resultProbabilities,coverage:images?.coverage,maskDetails:document.querySelector('.mask-details').open};
  if(images&&resultProbabilities){
   if(cachedImages!==images){
    const entries=await Promise.all(['original','gradcam','overlay','mask'].map(async key=>[key,await new Promise(resolve=>images[key].toBlob(resolve,'image/png'))]));
    if(entries.some(([,blob])=>!blob))throw new Error('Could not preserve analysis visuals');
    cachedImages=images;cachedBlobs=Object.fromEntries(entries);
   }
   snapshot.visuals=cachedBlobs;
  }
  if(revision===persistRevision)await saveTabState(snapshot);
 }catch(error){console.error('Could not preserve this tab',error);}
}
function restoreScores(probs){
 $('scores').replaceChildren(...probs.map((score,i)=>{
  const row=document.createElement('div');row.className='score';
  const label=document.createElement('div');label.className='score-label';const name=document.createElement('span');name.textContent=labels[i];const value=document.createElement('b');value.textContent=pct(score);label.append(name,value);
  const bar=document.createElement('div');bar.className='bar';const fill=document.createElement('span');fill.style.width=`${score*100}%`;bar.append(fill);row.append(label,bar);return row;
 }));
}
window.addEventListener('pagehide',()=>saveTabPosition({scroll:window.scrollY,view:currentView,time:getProcessingTime()}));
async function restoreTab(){
 restoring=true;$('add-photo').disabled=true;
 try{
  const saved=await loadTabState();if(!saved?.file)return;
  file=saved.file;qualityWarning=saved.qualityWarning||'';
  $('thumb').src=URL.createObjectURL(file);$('filename').textContent=saved.filename;$('filesize').textContent=saved.filesize;
  $('selected').hidden=false;$('input-empty').hidden=true;$('quality-note').textContent=qualityWarning;$('quality-note').hidden=!qualityWarning;updateAnalyzeButton();
  const position=loadTabPosition();
  if(saved.visuals&&saved.probabilities){
   const entries=await Promise.all(Object.entries(saved.visuals).map(async([key,blob])=>{const bitmap=await createImageBitmap(blob);const c=canvas(bitmap.width,bitmap.height);c.getContext('2d').drawImage(bitmap,0,0);bitmap.close();return[key,c];}));
   images={...Object.fromEntries(entries),coverage:saved.coverage};cachedImages=images;cachedBlobs=saved.visuals;resultProbabilities=saved.probabilities;
   const cls=resultProbabilities.indexOf(Math.max(...resultProbabilities)),detail=diseaseDetails[labels[cls]];
   $('prediction').textContent=labels[cls];$('confidence').textContent=pct(resultProbabilities[cls]);$('coverage').textContent=pct(saved.coverage);
   $('disease-description').textContent=detail.description;$('disease-irri').href=detail.irri;$('disease-tnau').href=detail.tnau;restoreScores(resultProbabilities);
   $('result-note').textContent=qualityWarning;$('result-note').hidden=!qualityWarning;
   activeVisual=captions[saved.visual]?saved.visual:'overlay';document.querySelectorAll('[data-tab]').forEach(el=>el.classList.toggle('active',el.dataset.tab===activeVisual));document.querySelector('.mask-details').open=saved.maskDetails;draw(activeVisual);
   if(saved.view==='processing'){
    showView('processing');busy(true);startProcessingAnimation(position?.time||0);setProcessingProbabilities(resultProbabilities);status('Creating the disease mask and visualizations...');
    await completeProcessingAnimation();stopProcessingAnimation();busy(false);
   }
   showView('results');status('Analysis complete.');
  }else if(saved.view==='processing'){
   restoring=false;resumeTime=position?.time||0;await prepareModel();await $('analyze').onclick();return;
  }else{showView('home');status('Image ready for analysis.');}
  translatePage();if(position?.view===currentView)window.scrollTo({top:position.scroll||0,behavior:'instant'});
 }catch(error){console.error('Could not restore this tab',error);}
 finally{restoring=false;$('add-photo').disabled=false;await persistTab();}
}
void prepareModel().catch(()=>{});
void restoreTab();
