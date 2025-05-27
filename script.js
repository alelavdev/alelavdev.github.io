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