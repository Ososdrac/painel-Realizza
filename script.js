const adForm = document.getElementById('adForm');
const adsContainer = document.getElementById('adsContainer');

// 🔼 Substitua pelos seus dados do Cloudinary
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dyphufnoi/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "Painel-realizza";

async function uploadImageToCloudinary(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  const response = await fetch(CLOUDINARY_URL, {
    method: "POST",
    body: formData
  });

  const data = await response.json();
  return data.secure_url;
}

async function loadAds() {
  const { db, getDocs, collection } = window.firebase;
  const querySnapshot = await getDocs(collection(db, "anuncios"));

  adsContainer.innerHTML = "";

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const adHTML = `
      <div class="ad-card">
        <img src="${data.imageUrl}" alt="${data.title}" />
        <h3>${data.title}</h3>
        <p><strong>Valor:</strong> R$ ${data.price}</p>
        <p><strong>Contato:</strong> ${data.contact}</p>
      </div>
    `;
    adsContainer.innerHTML += adHTML;
  });
}

adForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = document.getElementById('title').value;
  const price = document.getElementById('price').value;
  const contact = document.getElementById('contact').value;
  const imageFile = document.getElementById('image').files[0];

  if (!imageFile) return;

  const imageUrl = await uploadImageToCloudinary(imageFile);

  const { db, addDoc, collection } = window.firebase;

  await addDoc(collection(db, "anuncios"), {
    title,
    price,
    contact,
    imageUrl
  });

  adForm.reset();
  loadAds();
});

window.onload = loadAds;
