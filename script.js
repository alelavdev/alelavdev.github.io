window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    document.getElementById("container")?.classList.remove("fade-out");
  }
});

const entraBtn = document.getElementById("entraBtn");
if (entraBtn) {
  entraBtn.addEventListener("click", () => {
    document.getElementById("container").classList.add("fade-out");
    setTimeout(() => {
      window.location.href = "atrio.html";
    }, 1000);
  });
}

function goTo(url) {
  const container = document.getElementById('container');
  container.classList.add('fade-out');
  setTimeout(() => {
    window.location.href = url;
  }, 1000);
}

document.addEventListener("DOMContentLoaded", () => {
  const tooltip = document.getElementById("tooltip");
  let tooltipTimeout;

  document.querySelectorAll(".zone").forEach(zone => {
    zone.addEventListener("mousemove", e => {
      tooltip.textContent = zone.dataset.tooltip;
      tooltip.style.top = (e.clientY - 30) + "px";
      tooltip.style.left = (e.clientX + 10) + "px";
      tooltip.style.opacity = 1;
      tooltip.style.transform = "scale(1)";
      clearTimeout(tooltipTimeout);
    });

    zone.addEventListener("mouseleave", () => {
      tooltipTimeout = setTimeout(() => {
        tooltip.style.opacity = 0;
        tooltip.style.transform = "scale(0.95)";
      }, 100);
    });
  });
});

function openPopup(titolo, descrizione) {
  const popup = document.getElementById("popup");
  document.getElementById("popup-title").textContent = titolo;
  document.getElementById("popup-description").textContent = descrizione;
  popup.classList.remove("hidden");
  popup.classList.add("show");
}

function closePopup() {
  const popup = document.getElementById("popup");
  popup.classList.remove("show");
  popup.classList.add("hidden");
}

let imgList = [];
let imgIndex = 0;

function openImg(...items) {
  imgList = items;
  imgIndex = 0;
  showImgSlide();
  document.getElementById("img-popup").classList.add("show");
}

function closeImgPopup() {
  document.getElementById("img-popup").classList.remove("show");
}

function changeImg(dir) {
  imgIndex += dir;
  if (imgIndex < 0) imgIndex = imgList.length - 1;
  if (imgIndex >= imgList.length) imgIndex = 0;
  showImgSlide();
}

function showImgSlide() {
  const slide = document.getElementById("img-slide");
  slide.innerHTML = "";

  const item = imgList[imgIndex];

  const img = document.createElement("img");
  img.src = item.src;

  const desc = document.createElement("p");
  desc.textContent = item.description || "";

  slide.appendChild(img);
  slide.appendChild(desc);
}

