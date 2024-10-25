let menuOpen = false; 

function toggleMenu() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('menu-overlay');
  if (menuOpen) {
    sidebar.style.width = "0";
    overlay.style.display = "none";
  } else {
    sidebar.style.width = "250px";
    overlay.style.display = "block";
  }
  menuOpen = !menuOpen; 
}

function closeMenu() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('menu-overlay');
  sidebar.style.width = "0";
  overlay.style.display = "none";
  menuOpen = false; 
}

let slideIndex = 0;
const carouselSlide = document.querySelector('.carousel-slide');
const slides = document.querySelectorAll('.carousel-item');
const totalSlides = slides.length;

function moveSlide(n) {
  const slideWidth = document.querySelector('.carousel-container').clientWidth; 
  slideIndex += n;

  if (slideIndex >= totalSlides) {
    slideIndex = 0; 
  } else if (slideIndex < 0) {
    slideIndex = totalSlides - 1; 
  }
  carouselSlide.style.transform = `translateX(${-slideIndex * slideWidth}px)`;
}

setInterval(() => moveSlide(1), 10000);

window.addEventListener('resize', () => {
  const slideWidth = document.querySelector('.carousel-container').clientWidth;
  carouselSlide.style.transform = `translateX(${-slideIndex * slideWidth}px)`;
  const carouselImages = document.querySelectorAll('.carousel img');
  carouselImages.forEach((img) => {
    img.style.height = window.innerWidth > 768 ? 'auto' : '300px';
  });
});

function showSection(sectionId) {
  const sections = document.querySelectorAll('.section');

  sections.forEach(section => {
    if (section.id === sectionId) {
      section.style.display = 'block'; 
    } else {
      section.style.display = 'none'; 
    }
  });

  closeMenu();
}

let currentSlideIndex = 0; 

function showSlide(index) {
    const slides = document.querySelectorAll('.slide'); 
    if (index >= slides.length) {
        currentSlideIndex = 0; 
    }
    if (index < 0) {
        currentSlideIndex = slides.length - 1; 
    }

    slides.forEach(slide => {
        slide.style.display = 'none'; 
    });

    slides[currentSlideIndex].style.display = 'block'; 
}

function moveSlider(n) {
    showSlide(currentSlideIndex += n); 
}

document.addEventListener('DOMContentLoaded', () => {
    showSlide(currentSlideIndex); 
});

let currentImageIndex = 0;
let carouselImages = [];

function openNewsModal(newsId) {
  const newsData = {
    news1: {
      title: "Big Tasty Days Novembre 2024",
      date: "25/10/2024",
      carousel: true, 
      //carousel: false,
      //image: "immagini/BigTasty_Bacon.jpg", nel caso di singola immagine(eliminare folder sotto)
      folder: "Big-Tasty-Days_dal-4-al-7-Novembre_24", 
      imageCount: 3,
      content: "Potete visionare le offerte con le relative CRM che rimangono attive durate il periodo che va dal 4/11/24 al 7/11/24"
    },
    news2: {
      title: "Guida alla campagna Happy Meal di Mario Kart ",
      date: "25/10/2024",
      carousel: true, 
      folder: "Guida-campagna-Mario-Kart", 
      imageCount: 15,
      content: "Tutto ciò che dovete sapere sulla campagna in entrata Mario Kart!."
    },
    news3: {
      title: "Guida alle bevande McCaffè ",
      date: "25/10/2024",
      carousel: true, 
      folder: "Guida_mcCaffè", 
      imageCount: 15,
      content: "Guida per le bevande invernali del McCaffè."
    },
    news3: {
      title: "Offerte CRM Novembre 2024 ",
      date: "25/10/2024",
      carousel: true, 
      folder: "211024_Offerte-App_CRM-Novembre-2024", 
      imageCount: 15,
      content: "Lista delle ooferte CRM di novembre."
    },
  };

  const newsItem = newsData[newsId];
  if (newsItem) {
    document.getElementById("modalTitle").innerText = newsItem.title;
    document.getElementById("modalDate").innerText = newsItem.date;
    document.getElementById("modalContent").innerText = newsItem.content;

    const modal = document.getElementById("newsModal");
    modal.style.display = "block";

    if (newsItem.carousel) {
      loadCarouselImages(newsItem.folder, newsItem.imageCount);
      document.getElementById("carouselContainer").style.display = "flex";
    } else {
      document.getElementById("carouselContainer").style.display = "none";
      document.getElementById("modalImage").src = newsItem.image;
      document.getElementById("modalImage").style.display = "block";
    }
    
    modal.addEventListener("click", outsideClickListener);
  }
}

function loadCarouselImages(folder, imageCount) {
  carouselImages = Array.from({ length: imageCount }, (_, i) => `${folder}/image (${i + 1}).jpg`);
  currentImageIndex = 0;
  displayCarouselImage();
}

function displayCarouselImage() {
  const carouselContainer = document.getElementById("carouselImages");
  carouselContainer.innerHTML = `<img src="${carouselImages[currentImageIndex]}" style="width: 100%; border-radius: 8px;">`;
}

function prevImage() {
  currentImageIndex = (currentImageIndex - 1 + carouselImages.length) % carouselImages.length;
  displayCarouselImage();
}

function nextImage() {
  currentImageIndex = (currentImageIndex + 1) % carouselImages.length;
  displayCarouselImage();
}

function closeNewsModal() {
  const modal = document.getElementById("newsModal");
  modal.style.display = "none";
  document.getElementById("carouselContainer").style.display = "none";
  document.getElementById("modalImage").style.display = "none"; 
}

function outsideClickListener(event) {
  const modalContent = document.querySelector(".modal-content");
  if (!modalContent.contains(event.target)) {
    closeNewsModal();
  }
}

function displayCarouselImage() {
  const carouselContainer = document.getElementById("carouselImages");
  carouselContainer.innerHTML = `<img src="${carouselImages[currentImageIndex]}" style="width: 100%; border-radius: 8px;" onclick="openImageModal('${carouselImages[currentImageIndex]}')">`;
}

function openImageModal(imageSrc) {
  const imageModal = document.getElementById("imageModal");
  document.getElementById("modalImageLarge").src = imageSrc;
  imageModal.style.display = "block";
  imageModal.addEventListener("click", outsideImageModalClick);
}

function closeImageModal() {
  const imageModal = document.getElementById("imageModal");
  imageModal.style.display = "none";
  imageModal.removeEventListener("click", outsideImageModalClick);
}

function outsideImageModalClick(event) {
  const modalContent = document.querySelector("#imageModal .modal-content");
  if (!modalContent.contains(event.target)) {
    closeImageModal();
  }
}

