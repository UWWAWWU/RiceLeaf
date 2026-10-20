const translations = {
 'Downloading model...':'Mengunduh model...',
 'Preparing model...':'Menyiapkan model...',
 'Model ready':'Model siap',
 'Model download progress':'Progres unduhan model',
 'Model download failed. Check your connection and try again.':'Unduhan model gagal. Periksa koneksi dan coba lagi.',
 'Model preparation failed. Try again.':'Persiapan model gagal. Coba lagi.',
 "Analysis could not finish":"Analisis belum berhasil",
 "Try again":"Coba lagi",
 "Choose another photo":"Pilih foto lain",
 "The model could not calculate a prediction. Try again or choose another clear photo.":"Model belum berhasil menghitung prediksi. Coba lagi atau pilih foto lain yang jelas.",
 "The prediction visualizations could not be created. Try the analysis again.":"Visualisasi hasil prediksi belum berhasil dibuat. Coba jalankan analisis lagi.",
 'Upload a rice leaf photo. The image is resized and normalized before being processed by the model. U-Net++ with EfficientNetB0 generates a disease probability map and a mask of the affected areas. The classification model then combines features from the full image, the affected areas, and 18 shape features to calculate the probabilities of Bacterial Blight, Blast, Brown Spot, and Tungro. The results include the predicted disease, class probabilities, an overlay, a heatmap, and a mask.':'Unggah foto daun padi. Foto diubah ukurannya dan dinormalisasi sebelum diproses oleh model. U-Net++ dengan EfficientNetB0 menghasilkan peta probabilitas penyakit dan mask area terdampak. Model klasifikasi kemudian menggabungkan fitur foto penuh, area penyakit, dan 18 fitur bentuk untuk menghitung probabilitas Bacterial Blight, Blast, Brown Spot, dan Tungro. Hasil ditampilkan sebagai prediksi penyakit, probabilitas setiap kelas, overlay, peta panas, dan mask.',
 "The three feature groups are combined into one vector.":"Ketiga kelompok fitur digabungkan menjadi satu vektor.",
 "Scores come from the model output for your uploaded photo.":"Skor berasal dari hasil model untuk foto yang Anda unggah.",
 "Compare the original photo with the heatmap and overlay.":"Bandingkan foto asli dengan peta panas dan overlay.",
 "Review the prediction, class probabilities, overlay, heatmap and optional mask.":"Tinjau prediksi, probabilitas kelas, overlay, peta panas, dan mask tambahan.",
 "Segmentation details":"Detail segmentasi",
 "View mask":"Lihat mask",
 "Disease probability at each pixel, not disease severity.":"Probabilitas penyakit pada setiap piksel, bukan tingkat keparahan penyakit.",
 "Predicted area highlighted in red with its mask boundary":"Area prediksi ditandai merah beserta garis batas mask",
 "Waiting for model predictions\u2026":"Menunggu prediksi model\u2026",
 "Model probabilities for your photo":"Probabilitas model untuk foto Anda",
 "Classification provides the prediction and scores, segmentation provides the heatmap, mask, overlay and mask coverage.":"Klasifikasi menghasilkan prediksi dan skor, segmentasi menghasilkan peta panas, mask, overlay, dan cakupan mask.",

 "JPG, PNG or HEIC":"JPG, PNG atau HEIC",
 "Supported formats: JPG, JPEG, PNG, HEIC, HEIF":"Format yang didukung: JPG, JPEG, PNG, HEIC, HEIF",
 "The photo is resized with padding to preserve its proportions, then normalized.":"Foto diubah ukurannya dengan padding agar proporsinya terjaga, lalu dinormalisasi.",
 "U-Net++ with EfficientNetB0 produces a disease probability map and a mask.":"U-Net++ dengan EfficientNetB0 menghasilkan peta probabilitas penyakit dan mask.",
 "The classifier combines full image features, disease region features and 18 shape features to score four diseases.":"Model klasifikasi menggabungkan fitur foto penuh, area penyakit, dan 18 fitur bentuk untuk menghitung skor empat penyakit.",
 "Review the prediction, class probabilities, heatmap, mask, overlay and edges.":"Tinjau prediksi, probabilitas kelas, peta panas, mask, overlay, dan tepi.",
 "Try another photo":"Coba foto lain",
 "ANALYSIS IN PROGRESS":"ANALISIS SEDANG BERJALAN",
 "Following your photo through the model":"Menelusuri proses foto dalam model",
 "Preparing the image...":"Menyiapkan foto...",
 "Photo":"Foto",
 "Features":"Fitur",
 "Result":"Hasil",
 "Opening photo...":"Membuka foto...",
 "Converting HEIC photo...":"Mengonversi foto HEIC...",
 "Choose a valid JPG, PNG, HEIC or HEIF photo.":"Pilih foto JPG, PNG, HEIC atau HEIF yang valid.",
 "This photo could not be opened or converted. Try another photo.":"Foto ini tidak dapat dibuka atau dikonversi. Coba foto lain.",
 "Process illustration. The model runs segmentation and classification together.":"Ilustrasi proses. Model menjalankan segmentasi dan klasifikasi bersama.",
 "One RGB image is the model input.":"Satu foto RGB menjadi masukan model.",
 "Preserved proportions · black padding · ImageNet normalization":"Proporsi terjaga · padding hitam · normalisasi ImageNet",
 "Disease probabilities guide region features; the thresholded mask provides 18 shape features.":"Probabilitas penyakit membobot fitur area; mask yang diberi ambang menghasilkan 18 fitur bentuk.",
 "Full image + disease region + shape":"Foto penuh + area penyakit + bentuk",
 "Full image features + disease region features + 18 shape features → one combined vector.":"Fitur foto penuh + fitur area penyakit + 18 fitur bentuk → satu vektor gabungan.",
 "The classifier receives the combined features and predicts probabilities for four diseases.":"Model klasifikasi menerima fitur gabungan dan memprediksi probabilitas empat penyakit.",
 "Classification provides the prediction and scores, segmentation provides the heatmap, mask, overlay, edges and mask coverage.":"Klasifikasi menghasilkan prediksi dan skor, segmentasi menghasilkan peta panas, mask, overlay, tepi, dan luas mask.",
 "Full image":"Foto penuh",
 "Disease region":"Area penyakit",
 "18 shape features":"18 fitur bentuk",
 "Combined":"Gabungan",
 "Probability map":"Peta probabilitas",
 "Mask ≥ 0.5":"Mask ≥ 0,5",
 "Combined features → classifier → illustrative probabilities":"Fitur gabungan → model klasifikasi → probabilitas ilustratif",
 "Segmentation → visualizations and mask coverage":"Segmentasi → visualisasi dan luas mask",
 "Classifier → disease prediction and scores":"Model klasifikasi → prediksi penyakit dan skor",
 "Model stages":"Tahap model",
 "Illustration of the rice leaf analysis pipeline":"Ilustrasi alur analisis daun padi",

 '4 disease classes':'4 kelas penyakit','Pixel level mapping':'Pemetaan per piksel','Private browser analysis':'Analisis privat di browser','Full image · disease region · 18 shape features':'Foto penuh · area penyakit · 18 fitur bentuk','Four disease probabilities':'Empat probabilitas penyakit',
 'Input photo':'Foto masukan','RGB photo':'Foto RGB','Preprocessing':'Prapemrosesan','Resize · padding · normalize':'Resize · padding · normalisasi','Segmentation':'Segmentasi','Combined features':'Gabungan fitur','Global · region · 18 shape features':'Global · area · 18 fitur bentuk','Classification':'Klasifikasi','EfficientNetB0 · four classes':'EfficientNetB0 · empat kelas','Output':'Hasil','Prediction · scores · visualizations':'Prediksi · skor · visualisasi','Pause animation':'Jeda animasi','Play animation':'Putar animasi',

 'Photo':'Foto','Rice leaf image':'Gambar daun padi','Segmentation':'Segmentasi','Locate the affected area':'Menentukan area terdampak','Classification':'Klasifikasi','Result':'Hasil','Prediction and visualizations':'Prediksi dan visualisasi',
 'Close photo options':'Tutup pilihan foto','From input to output':'Dari input hingga output','Process illustration':'Ilustrasi proses','Leaf photo':'Foto daun','One clear image':'Satu foto yang jelas','Identify and segment':'Identifikasi dan segmentasi','Prediction and area mapping':'Prediksi dan pemetaan area','Scores and visual evidence':'Skor dan bukti visual',

 'Add photo':'Masukkan Foto','Start with one clear photo':'Mulai dengan satu foto yang jelas','Keep the rice leaf in focus and use good lighting.':'Pastikan daun padi terlihat tajam dan pencahayaan cukup.',
 'FROM PHOTO TO INSIGHT':'DARI FOTO HINGGA HASIL','What happens to your photo?':'Bagaimana foto Anda diproses?',
 'Prepare the image':'Menyiapkan foto','The photo is resized and normalized for the models.':'Ukuran dan nilai piksel foto disesuaikan untuk model.',
 'Identify the disease':'Mengidentifikasi penyakit','EfficientNetB0 combines image, disease region and shape features to score four diseases.':'EfficientNetB0 menggabungkan fitur foto, area penyakit, dan bentuk untuk menghitung skor empat penyakit.',
 'Map the affected area':'Memetakan area terdampak','U-Net++ with EfficientNetB0 predicts a mask of the affected region.':'U-Net++ dengan EfficientNetB0 memprediksi mask pada area terdampak.',
 'Explore the result':'Menjelajahi hasil','Review the prediction, heatmap, mask and overlay.':'Tinjau prediksi, peta panas, mask, dan overlay.',

 'How it works':'Cara kerja','AI POWERED LEAF ANALYSIS':'ANALISIS DAUN DENGAN AI','Understand your rice leaf.':'Kenali kondisi daun padi Anda.',
 'Upload a photo to identify a supported disease and explore the visual evidence behind the result.':'Unggah foto untuk mengidentifikasi penyakit yang didukung dan melihat bukti visual dari hasil analisis.',
 'Add a photo':'Masukkan Foto','Choose a clear photo of a rice leaf.':'Pilih foto daun padi yang jelas.','JPG or PNG':'JPG atau PNG','Upload a photo':'Upload Foto','Choose a file':'Pilih file','or drag it here':'atau seret ke sini','Supported formats: JPG, JPEG, PNG':'Format yang didukung: JPG, JPEG, PNG','Take a photo':'Ambil Foto',
 'Open site in a new tab':'Buka situs di tab baru','Use device camera':'Gunakan kamera perangkat','Flash off':'Flash mati','Flash on':'Flash menyala','Cancel':'Batal','Capture photo':'Ambil Foto','Change photo':'Ganti Foto',
 'Your image stays in your browser during analysis.':'Foto tetap berada di browser Anda selama analisis.','Analyze image':'Analisis','Analyzing...':'Menganalisis...',
 'SUPPORTED CONDITIONS':'PENYAKIT YANG DIDUKUNG','Bacterial Blight':'Hawar Daun Bakteri','Blast':'Blast','Brown Spot':'Bercak Cokelat','Tungro':'Tungro',
 'Analysis result':'Hasil analisis','Prediction':'Prediksi','Model score':'Skor model','Estimated affected area':'Perkiraan area terdampak',
 'Affected area is the proportion of the entire photo covered by the predicted mask, not the proportion of diseased leaf tissue.':'Area terdampak merupakan persentase seluruh foto yang tertutup oleh mask prediksi, bukan persentase jaringan daun yang sakit.',
 'Class probabilities':'Probabilitas kelas','How the model scored each supported disease.':'Skor model untuk setiap penyakit yang didukung.','About the predicted disease':'Tentang penyakit yang diprediksi','Sources:':'Sumber:',
 'Image insights':'Visualisasi foto','Compare the original photo with model visualizations.':'Bandingkan foto asli dengan visualisasi model.','Original':'Asli','Heatmap':'Peta panas','Mask':'Mask','Overlay':'Overlay','Edges':'Tepi',
 'Original photo':'Foto asli','Predicted disease probability at each pixel':'Probabilitas penyakit pada setiap piksel','Predicted disease mask':'Mask penyakit hasil prediksi','Predicted area highlighted in red':'Area prediksi ditandai dengan warna merah','Edges within the predicted disease region':'Tepi dalam area penyakit hasil prediksi',
 'Upload a rice leaf image. U-Net++ maps the affected region, then EfficientNetB0 combines image features, region features and 18 shape features to estimate disease probabilities. The heatmap shows predicted disease probability at each pixel. Results also include a mask, overlay and edges. The model supports four disease classes and does not identify healthy leaves or reject unrelated images.':'Unggah foto daun padi. U-Net++ memetakan area terdampak, lalu EfficientNetB0 menggabungkan fitur foto, area penyakit, dan 18 fitur bentuk untuk memperkirakan probabilitas penyakit. Peta panas menunjukkan probabilitas penyakit pada setiap piksel. Hasil juga mencakup mask, overlay, dan tepi. Model mendukung empat kelas penyakit dan belum dapat mengenali daun sehat atau menolak gambar yang tidak relevan.',
 'LEAF SCAN':'PEMINDAIAN DAUN','Illustration':'Ilustrasi','Identify':'Identifikasi','Segment':'Segmentasi','Explore':'Jelajahi',
 'Language':'Bahasa','RiceLeaf AI home':'Beranda RiceLeaf AI','Illustration of rice leaf scanning':'Ilustrasi pemindaian daun padi','Choose a rice leaf photo':'Pilih foto daun padi','Capture a rice leaf photo':'Ambil foto daun padi','Camera preview':'Pratinjau kamera','Selected rice leaf photo':'Foto daun padi yang dipilih','Image visualization':'Visualisasi foto','Analysis visualization':'Visualisasi analisis',
 'This image is small. A larger, clearer close up may give a more reliable result.':'Foto ini kecil. Foto daun yang lebih besar dan jelas dapat memberikan hasil yang lebih andal.',
 'This photo may be blurry. Try a sharper close up of the leaf for a more reliable result.':'Foto ini mungkin buram. Coba foto daun yang lebih tajam untuk hasil yang lebih andal.',
 'Choose a valid JPG, JPEG, or PNG image.':'Pilih foto JPG, JPEG, atau PNG yang valid.','Checking image clarity...':'Memeriksa kejelasan foto...','Image ready for analysis.':'Foto siap dianalisis.',
 'This image could not be opened. Choose another JPG or PNG photo.':'Foto tidak dapat dibuka. Pilih foto JPG atau PNG lainnya.',
 'Camera access is blocked in this preview. Open the site in a new tab, or use your device camera.':'Akses kamera diblokir dalam pratinjau ini. Buka situs di tab baru atau gunakan kamera perangkat.',
 'Camera access was denied. Allow it in your browser settings, or use your device camera.':'Akses kamera ditolak. Izinkan melalui pengaturan browser atau gunakan kamera perangkat.',
 'Live camera preview is unavailable here. Use your device camera or upload a photo.':'Pratinjau kamera tidak tersedia. Gunakan kamera perangkat atau unggah foto.',
 'Choose a camera option below, or upload a photo.':'Pilih opsi kamera di bawah atau unggah foto.','Flash could not be changed on this camera.':'Flash tidak dapat diubah pada kamera ini.','Opening camera...':'Membuka kamera...',
 'Position one rice leaf clearly, then capture the photo.':'Posisikan satu daun padi dengan jelas, lalu ambil foto.','Choose a photo to analyze.':'Pilih foto untuk dianalisis.','Camera is still starting. Please try again.':'Kamera masih disiapkan. Silakan coba lagi.','Could not capture the photo. Please try again.':'Foto tidak dapat diambil. Silakan coba lagi.',
 'Preparing models for the first analysis...':'Menyiapkan model untuk analisis pertama...','Starting the rice leaf model...':'Menyiapkan model daun padi...','Starting the segmentation model...':'Menyiapkan model segmentasi...',
 'Calculating disease predictions...':'Menghitung prediksi penyakit...','Creating the disease mask and visualizations...':'Membuat mask penyakit dan visualisasi...','Analysis complete.':'Analisis selesai.',
 'Model download failed or was incomplete. Check your connection and try again.':'Unduhan model gagal atau belum lengkap. Periksa koneksi dan coba lagi.',
 'The models could not start in this browser. Close other tabs and try again in an updated browser.':'Model tidak dapat dijalankan di browser ini. Tutup tab lain dan coba lagi dengan browser yang telah diperbarui.',
 'Image analysis failed. Try again or choose another clear photo.':'Analisis foto gagal. Coba lagi atau pilih foto lain yang jelas.'
};
const descriptions = [
 ['Bacterial blight is caused', 'Hawar daun bakteri disebabkan oleh Xanthomonas oryzae pv. oryzae. Penyakit ini menyerang daun dan dapat menyebabkan bibit layu. Pada daun dewasa, lesi biasanya berawal di tepi daun sebagai area yang tampak basah, kemudian memanjang dan berubah menjadi kuning hingga berwarna jerami. Serangan berat pada bibit dikenal sebagai kresek. Kerusakan jaringan daun dapat menghambat pertumbuhan dan menurunkan produksi gabah.'],
 ['Blast is caused', 'Blast disebabkan oleh jamur Magnaporthe oryzae dan dapat menyerang daun serta bagian tanaman di atas tanah. Gejala pada daun berupa lesi memanjang berbentuk gelendong dengan bagian tengah abu-abu pucat dan tepi cokelat gelap. Lesi yang menyatu dapat mengeringkan sebagian besar daun. Infeksi pada buku batang atau leher malai dapat mengganggu perkembangan tanaman dan pembentukan gabah.'],
 ['Brown spot is a fungal', 'Bercak cokelat merupakan penyakit jamur yang dapat muncul sejak fase bibit. Gejalanya tampak pada daun, pelepah, dan gabah. Bercak kecil berkembang menjadi lesi oval berwarna cokelat gelap, terkadang dikelilingi warna kuning. Bercak yang menyatu dapat mengeringkan bagian daun. Infeksi pada gabah menyebabkan perubahan warna, sementara serangan luas dapat merusak bibit serta menurunkan mutu dan bobot gabah.'],
 ['Tungro is caused', 'Tungro disebabkan oleh virus yang ditularkan oleh wereng hijau. Penyakit ini memengaruhi pertumbuhan tanaman dan warna daun. Daun berubah menjadi kuning atau jingga kekuningan dari ujung ke bagian bawah, terkadang disertai bercak. Tanaman dapat menjadi kerdil dan menghasilkan lebih sedikit anakan. Infeksi dini atau berat dapat menunda pembungaan dan menghasilkan malai kecil dengan gabah yang lebih sedikit atau kurang terisi.']
];
Object.assign(translations,{'START A CHECK':'MULAI PEMERIKSAAN','One photo.':'Satu foto.','Your first step.':'Langkah pertama Anda.','Upload photo':'Unggah foto','Take a photo':'Ambil foto','Choose from your device':'Pilih dari perangkat Anda','Use your device camera':'Gunakan kamera perangkat','Choose file →':'Pilih file →','Open camera →':'Buka kamera →','Use a clear, well lit photo':'Gunakan foto yang jelas dan terang','Change photo':'Ganti foto','The probability map is used to extract region features, the mask is used to calculate 18 shape features.':'Peta probabilitas digunakan untuk mengambil fitur area, mask digunakan untuk menghitung 18 fitur bentuk.'});
let language='en';

const originals=new WeakMap();
const reverse=new Map(Object.entries(translations).map(([en,id])=>[id,en]));
export function translate(text) {
 if(language==='en')return text;
 if(translations[text])return translations[text];
 const description=descriptions.find(([prefix])=>text.startsWith(prefix));
 if(description)return description[1];
 if(text.startsWith('Downloading '))return text.replace('Downloading model:','Mengunduh model:').replace('Downloading classifier:','Mengunduh model klasifikasi:').replace('Downloading segmenter:','Mengunduh model segmentasi:');
 if(text.startsWith('Low confidence prediction:')){
  let result=text.replace(/Low confidence prediction: the score is below the model's ([\d.]+)% review threshold. Try a clearer close up and review the result carefully./,'Prediksi kurang meyakinkan: skor di bawah ambang peninjauan model sebesar $1%. Coba foto yang lebih jelas dan tinjau hasil dengan cermat.');
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
 const walker=document.createTreeWalker(document.getElementById('check-dialog'),NodeFilter.SHOW_TEXT);
 while(walker.nextNode()) {const n=walker.currentNode;if(!n.parentElement.closest('script,style,select,#filename,#filesize'))translateText(n);}
 document.getElementById('check-dialog').querySelectorAll('[aria-label],[alt]').forEach(el=>{
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
const observer=new MutationObserver(()=>{observer.disconnect();translatePage();observer.observe(document.getElementById('check-dialog'),{subtree:true,childList:true,characterData:true});});
observer.observe(document.getElementById('check-dialog'),{subtree:true,childList:true,characterData:true});

document.addEventListener('riceleaf:language',event=>{language=event.detail;translatePage();updateLanguageButtons();});
