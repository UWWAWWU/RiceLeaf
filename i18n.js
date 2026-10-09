const translations = {
 'Close photo options':'Tutup pilihan foto','From input to output':'Dari input hingga output','Process illustration':'Ilustrasi proses','Leaf photo':'Foto daun','One clear image':'Satu foto yang jelas','Identify and segment':'Identifikasi dan segmentasi','Prediction and area mapping':'Prediksi dan pemetaan area','Scores and visual evidence':'Skor dan bukti visual',

 'Add photo':'Masukkan Foto','Start with one clear photo':'Mulai dengan satu foto yang jelas','Keep the rice leaf in focus and use good lighting.':'Pastikan daun padi terlihat tajam dan pencahayaan cukup.',
 'FROM PHOTO TO INSIGHT':'DARI FOTO HINGGA HASIL','What happens to your photo?':'Bagaimana foto Anda diproses?',
 'Prepare the image':'Menyiapkan foto','The photo is resized and normalized for the models.':'Ukuran dan nilai piksel foto disesuaikan untuk model.',
 'Identify the disease':'Mengidentifikasi penyakit','DenseNet121 scores each of the four supported diseases.':'DenseNet121 menghitung skor untuk empat penyakit yang didukung.',
 'Map the affected area':'Memetakan area terdampak','U-Net++ predicts a mask of the affected region.':'U-Net++ memprediksi mask pada area terdampak.',
 'Explore the result':'Menjelajahi hasil','Review the prediction, heatmap, mask and overlay.':'Tinjau prediksi, peta panas, mask, dan overlay.',
 'Processed in your browser. Your photo is not uploaded to a server.':'Diproses di browser Anda. Foto tidak diunggah ke server.',

 'How it works':'Cara kerja','AI POWERED LEAF ANALYSIS':'ANALISIS DAUN DENGAN AI','Understand your rice leaf.':'Kenali kondisi daun padi Anda.',
 'Upload a photo to identify a supported disease and explore the visual evidence behind the result.':'Unggah foto untuk mengidentifikasi penyakit yang didukung dan melihat bukti visual dari hasil analisis.',
 'Add a photo':'Masukkan Foto','Choose a clear photograph of a rice leaf.':'Pilih foto daun padi yang jelas.','JPG or PNG':'JPG atau PNG','Upload a photo':'Upload Foto','Choose a file':'Pilih file','or drag it here':'atau seret ke sini','Supported formats: JPG, JPEG, PNG':'Format yang didukung: JPG, JPEG, PNG','Take a photo':'Ambil Foto',
 'Open site in a new tab':'Buka situs di tab baru','Use device camera':'Gunakan kamera perangkat','Flash off':'Flash mati','Flash on':'Flash menyala','Cancel':'Batal','Capture photo':'Ambil Foto','Change photo':'Ganti Foto',
 'Your image stays in your browser during analysis.':'Foto tetap berada di browser Anda selama analisis.','Analyze image':'Analisis','Analyzing...':'Menganalisis...',
 'SUPPORTED CONDITIONS':'PENYAKIT YANG DIDUKUNG','Bacterial Blight':'Hawar Daun Bakteri','Blast':'Blas','Brown Spot':'Bercak Cokelat','Tungro':'Tungro',
 'Analysis result':'Hasil analisis','Prediction':'Prediksi','Model score':'Skor model','Estimated affected area':'Perkiraan area terdampak',
 'Affected area is the proportion of the entire photo covered by the predicted mask, not the proportion of diseased leaf tissue.':'Area terdampak merupakan persentase seluruh foto yang tertutup oleh mask prediksi, bukan persentase jaringan daun yang sakit.',
 'Class probabilities':'Probabilitas kelas','How the model scored each supported disease.':'Skor model untuk setiap penyakit yang didukung.','About the predicted disease':'Tentang penyakit yang diprediksi','Sources:':'Sumber:',
 'Image insights':'Visualisasi foto','Compare the original photo with model visualizations.':'Bandingkan foto asli dengan visualisasi model.','Original':'Asli','Heatmap':'Peta panas','Mask':'Mask','Overlay':'Overlay','Edges':'Tepi',
 'Original photograph':'Foto asli','Regions influencing the classification':'Area yang memengaruhi klasifikasi','Predicted disease mask':'Mask penyakit hasil prediksi','Predicted area highlighted in red':'Area prediksi ditandai dengan warna merah','Edges within the predicted disease region':'Tepi dalam area penyakit hasil prediksi',
 'Upload a rice leaf image. DenseNet121 estimates the probability of each disease class, while U-Net++ maps the predicted affected area. The results include a class activation heatmap, a segmentation mask, an overlay, and edge visualization. The model supports four disease classes and does not identify healthy leaves or reject unrelated images.':'Unggah foto daun padi. DenseNet121 memperkirakan probabilitas setiap kelas penyakit, sedangkan U-Net++ memetakan area terdampak. Hasilnya mencakup peta panas aktivasi kelas, mask segmentasi, overlay, dan visualisasi tepi. Model mendukung empat kelas penyakit dan belum dapat mengenali daun sehat atau menolak gambar yang tidak relevan.',
 'LEAF SCAN':'PEMINDAIAN DAUN','Illustration':'Ilustrasi','Identify':'Identifikasi','Segment':'Segmentasi','Explore':'Jelajahi',
 'Language':'Bahasa','RiceLeaf AI home':'Beranda RiceLeaf AI','Illustration of rice leaf scanning':'Ilustrasi pemindaian daun padi','Choose a rice leaf photograph':'Pilih foto daun padi','Capture a rice leaf photo':'Ambil foto daun padi','Camera preview':'Pratinjau kamera','Selected rice leaf photograph':'Foto daun padi yang dipilih','Image visualization':'Visualisasi foto','Analysis visualization':'Visualisasi analisis',
 'This image is small. A larger, clearer close-up may give a more reliable result.':'Foto ini kecil. Foto daun yang lebih besar dan jelas dapat memberikan hasil yang lebih andal.',
 'This photo may be blurry. Try a sharper close-up of the leaf for a more reliable result.':'Foto ini mungkin buram. Coba foto daun yang lebih tajam untuk hasil yang lebih andal.',
 'Choose a valid JPG, JPEG, or PNG image.':'Pilih foto JPG, JPEG, atau PNG yang valid.','Checking image clarity...':'Memeriksa kejelasan foto...','Image ready for analysis.':'Foto siap dianalisis.',
 'This image could not be opened. Choose another JPG or PNG photo.':'Foto tidak dapat dibuka. Pilih foto JPG atau PNG lainnya.',
 'Camera access is blocked in this preview. Open the site in a new tab, or use your device camera.':'Akses kamera diblokir dalam pratinjau ini. Buka situs di tab baru atau gunakan kamera perangkat.',
 'Camera access was denied. Allow it in your browser settings, or use your device camera.':'Akses kamera ditolak. Izinkan melalui pengaturan browser atau gunakan kamera perangkat.',
 'Live camera preview is unavailable here. Use your device camera or upload a photo.':'Pratinjau kamera tidak tersedia. Gunakan kamera perangkat atau unggah foto.',
 'Choose a camera option below, or upload a photo.':'Pilih opsi kamera di bawah atau unggah foto.','Flash could not be changed on this camera.':'Flash tidak dapat diubah pada kamera ini.','Opening camera...':'Membuka kamera...',
 'Position one rice leaf clearly, then capture the photo.':'Posisikan satu daun padi dengan jelas, lalu ambil foto.','Choose a photo to analyze.':'Pilih foto untuk dianalisis.','Camera is still starting. Please try again.':'Kamera masih disiapkan. Silakan coba lagi.','Could not capture the photo. Please try again.':'Foto tidak dapat diambil. Silakan coba lagi.',
 'Preparing models for the first analysis...':'Menyiapkan model untuk analisis pertama...','Starting the classification model...':'Menyiapkan model klasifikasi...','Starting the segmentation model...':'Menyiapkan model segmentasi...',
 'Calculating disease predictions...':'Menghitung prediksi penyakit...','Creating the disease mask and visualizations...':'Membuat mask penyakit dan visualisasi...','Analysis complete.':'Analisis selesai.',
 'Model download failed or was incomplete. Check your connection and try again.':'Unduhan model gagal atau belum lengkap. Periksa koneksi dan coba lagi.',
 'The models could not start in this browser. Close other tabs and try again in an updated browser.':'Model tidak dapat dijalankan di browser ini. Tutup tab lain dan coba lagi dengan browser yang telah diperbarui.',
 'Image analysis failed. Try again or choose another clear photo.':'Analisis foto gagal. Coba lagi atau pilih foto lain yang jelas.'
};
const descriptions = [
 ['Bacterial blight is caused', 'Hawar daun bakteri disebabkan oleh Xanthomonas oryzae pv. oryzae. Penyakit ini menyerang daun dan dapat menyebabkan bibit layu. Pada daun dewasa, lesi biasanya berawal di tepi daun sebagai area yang tampak basah, kemudian memanjang dan berubah menjadi kuning hingga berwarna jerami. Serangan berat pada bibit dikenal sebagai kresek. Kerusakan jaringan daun dapat menghambat pertumbuhan dan menurunkan produksi gabah.'],
 ['Blast is caused', 'Blas disebabkan oleh jamur Magnaporthe oryzae dan dapat menyerang daun serta bagian tanaman di atas tanah. Gejala pada daun berupa lesi memanjang berbentuk gelendong dengan bagian tengah abu-abu pucat dan tepi cokelat gelap. Lesi yang menyatu dapat mengeringkan sebagian besar daun. Infeksi pada buku batang atau leher malai dapat mengganggu perkembangan tanaman dan pembentukan gabah.'],
 ['Brown spot is a fungal', 'Bercak cokelat merupakan penyakit jamur yang dapat muncul sejak fase bibit. Gejalanya tampak pada daun, pelepah, dan gabah. Bercak kecil berkembang menjadi lesi oval berwarna cokelat gelap, terkadang dikelilingi warna kuning. Bercak yang menyatu dapat mengeringkan bagian daun. Infeksi pada gabah menyebabkan perubahan warna, sementara serangan luas dapat merusak bibit serta menurunkan mutu dan bobot gabah.'],
 ['Tungro is caused', 'Tungro disebabkan oleh virus yang ditularkan oleh wereng hijau. Penyakit ini memengaruhi pertumbuhan tanaman dan warna daun. Daun berubah menjadi kuning atau jingga kekuningan dari ujung ke bagian bawah, terkadang disertai bercak. Tanaman dapat menjadi kerdil dan menghasilkan lebih sedikit anakan. Infeksi dini atau berat dapat menunda pembungaan dan menghasilkan malai kecil dengan gabah yang lebih sedikit atau kurang terisi.']
];
let language='en';
try { if(localStorage.getItem('riceleaf-language')==='id') language='id'; } catch {}
const originals=new WeakMap();
const reverse=new Map(Object.entries(translations).map(([en,id])=>[id,en]));
export function translate(text) {
 if(language==='en')return text;
 if(translations[text])return translations[text];
 const description=descriptions.find(([prefix])=>text.startsWith(prefix));
 if(description)return description[1];
 if(text.startsWith('Downloading '))return text.replace('Downloading classifier:','Mengunduh model klasifikasi:').replace('Downloading segmenter:','Mengunduh model segmentasi:');
 if(text.startsWith('Low confidence prediction:')){
  let result=text.replace(/Low confidence prediction: the score is below the model's ([\d.]+)% review threshold. Try a clearer close-up and review the result carefully./,'Prediksi kurang meyakinkan: skor di bawah ambang peninjauan model sebesar $1%. Coba foto yang lebih jelas dan tinjau hasil dengan cermat.');
  for(const [en,id] of Object.entries(translations))result=result.replace(en,id);
  return result;
 }
 return text;
}
function translateText(node) {
 const current=node.nodeValue, saved=originals.get(node);
 let source=saved && current===saved.display ? saved.source : reverse.get(current.trim()) || current;
 const trimmed=source.trim(), display=source.replace(trimmed,translate(trimmed));
 originals.set(node,{source,display});
 if(current!==display)node.nodeValue=display;
}
export function translatePage() {
 document.documentElement.lang=language;
 const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
 while(walker.nextNode()) {const n=walker.currentNode;if(!n.parentElement.closest('script,style,select,#filename,#filesize'))translateText(n);}
 document.querySelectorAll('[aria-label],[alt]').forEach(el=>{
  for(const attr of ['aria-label','alt'])if(el.hasAttribute(attr)){
   const key='original'+attr.replace('-','');
   const source=el.dataset[key] || el.getAttribute(attr);el.dataset[key]=source;el.setAttribute(attr,translate(source));
  }
 });
}
function updateLanguageButtons(){document.querySelectorAll('[data-language]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.language===language)));}
document.querySelectorAll('[data-language]').forEach(button=>button.addEventListener('click',()=>{
 language=button.dataset.language;try{localStorage.setItem('riceleaf-language',language);}catch{}
 translatePage();updateLanguageButtons();
}));
updateLanguageButtons();
translatePage();
const observer=new MutationObserver(()=>{observer.disconnect();translatePage();observer.observe(document.body,{subtree:true,childList:true,characterData:true});});
observer.observe(document.body,{subtree:true,childList:true,characterData:true});
