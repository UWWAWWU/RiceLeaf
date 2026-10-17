// Decode photos locally. Load the HEIF decoder only when native decoding fails.
export async function preparePhoto(file,onConvert=()=>{}){
  const header=new Uint8Array(await file.slice(0,40).arrayBuffer());
  const ascii=(a,b)=>String.fromCharCode(...header.slice(a,b));
  const jpeg=header[0]===0xff&&header[1]===0xd8&&header[2]===0xff;
  const png=[137,80,78,71,13,10,26,10].every((v,i)=>header[i]===v);
  const heif=ascii(4,8)==='ftyp'&&/heic|heix|hevc|hevx|mif1|msf1/.test(ascii(8,40));
  if(!jpeg&&!png&&!heif){const error=new Error('Unsupported photo format');error.code='unsupported';throw error;}
  if(!heif)return new File([file],file.name,{type:jpeg?'image/jpeg':'image/png'});
  onConvert();
  let bitmap;
  try{bitmap=await createImageBitmap(file,{imageOrientation:'from-image'});}catch{}
  let blob;
  if(bitmap){
    try{
      const c=document.createElement('canvas');c.width=bitmap.width;c.height=bitmap.height;
      c.getContext('2d').drawImage(bitmap,0,0);
      blob=await new Promise(resolve=>c.toBlob(resolve,'image/jpeg',.95));
      c.width=c.height=1;
    }finally{bitmap.close();}
  }
  if(!blob){const {heicTo}=await import('./runtime/heic-to-1.6.5.js');blob=await heicTo({blob:file,type:'image/jpeg',quality:.95});}
  if(!blob)throw new Error('HEIC conversion failed');
  return new File([blob],file.name.replace(/\.(heic|heif)$/i,'')+'.jpg',{type:'image/jpeg'});
}
