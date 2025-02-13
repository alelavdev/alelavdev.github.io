let menuOpen = false; 
let userPrivilege = null;
let userLocale = null;
let uuid = null;


function goToPage(page) {
  window.location.href = page;
}

function initializeSupabase() {
  const SUPABASE_URL = 'https://nxdgrrympafaeomfgcnh.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54ZGdycnltcGFmYWVvbWZnY25oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAyMTU3NzgsImV4cCI6MjA0NTc5MTc3OH0.2nHqAm6XW4DVg-uW2uOfxHqtPYiz3kuyy3Rxa4C3Zpg';

  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  console.log("Supabase client creato:", supabase);
  
  return supabase;
}

const supabase = initializeSupabase();

function showNotification(message, type = "info") {
  const notification = document.getElementById("notification");
  notification.innerText = message;

  notification.classList.remove("success", "error", "info");
  notification.classList.add(type);
  notification.style.display = "block";
  notification.classList.add("show");

  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      notification.style.display = "none";
    }, 500);
  }, 5000);
}

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

function toggleSubMenu(submenuId) {
  const submenu = document.getElementById(submenuId);
  const isVisible = submenu.style.display === "block";
  submenu.style.display = isVisible ? "none" : "block";
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
    if (sectionId === 'home') {
      caricaPostit();
    }
  });
  usersCredits();
  closeMenu();
  gestisciVisibilitaLogout();
}

function showSection2(sectionId) {
  console.log(`Apertura della sezione: ${sectionId}`);

  document.querySelectorAll('.section').forEach(section => {
    section.style.display = 'none';
  });

  document.querySelectorAll('.section2').forEach(section => {
    section.style.display = 'none';
  });

  const section = document.getElementById(`${sectionId}`);
  if (section) {
    section.style.display = 'block';
  } else {
    console.error(`Sezione con ID ${sectionId}-section non trovata.`);
  }

  if (sectionId === 'malattie') {
    caricaMalattie();
  } else if (sectionId === 'formazione') {
    caricaFormazioni();
  } else if (sectionId === 'calendario') {
    caricaFeste();
  } else if (sectionId === 'item') {
    caricaOrdiniFeste();
  } else if (sectionId === 'ordini') {
    caricaOrdini(); 
  } else if (sectionId === 'annunci-importanti') {
    caricaPostit(); 
  } else if (sectionId === 'richieste') {
    aggiornaListaRichieste(); 
  }
  usersCredits();
  closeMenu();
  gestisciVisibilitaLogout();
}

function showMainSections() {
  document.querySelectorAll('.section').forEach(section => {
    section.style.display = 'block';
  });
  document.querySelectorAll('.section2').forEach(section => {
    section.style.display = 'none';
  });
}

function showTutorial(tutorialId) {
  document.getElementById(tutorialId).style.display = 'block';
}

async function loadTutorials() {
  const { data: tutorials, error } = await supabase
    .from('tutorials')
    .select('*');

  if (error) {
    console.error("Errore nel caricamento dei tutorial:", error);
    return;
  }

  const tutorialMenu = document.getElementById("tutorial-menu");
  tutorialMenu.innerHTML = ""; 

  tutorials.forEach(tutorial => {
    const button = document.createElement("button");
    button.innerText = tutorial.tutorial || "Senza titolo"; 
    button.onclick = () => loadSlides(tutorial.id, tutorial.title); 
    tutorialMenu.appendChild(button);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadTutorials();

  document.querySelector(".tutorial-prev").style.display = "none";
  document.querySelector(".tutorial-next").style.display = "none";
});

async function loadSlides(tutorialId, tutorialTitle) {
  const { data: slides, error } = await supabase
    .from('slides')
    .select('*')
    .eq('tutorial_id', tutorialId)
    .order('order', { ascending: true });

  if (error) {
    console.error("Errore nel caricamento delle slide:", error);
    return;
  }

  const slideContainer = document.getElementById('slides-container');
  slideContainer.innerHTML = ""; 

  const prevArrow = document.querySelector(".tutorial-prev");
  const nextArrow = document.querySelector(".tutorial-next");
  if (slides.length > 0) {
    prevArrow.style.display = "block";
    nextArrow.style.display = "block";
  } else {
    prevArrow.style.display = "none";
    nextArrow.style.display = "none";
  }

  slides.forEach(slide => {
    const slideElement = document.createElement("div");
    slideElement.classList.add("slide");

    slideElement.innerHTML = `
      <h2>${slide.title}</h2>
      <p>${slide.content}</p>
      ${slide.image_url ? `<img src="${slide.image_url}" alt="${slide.title}" />` : ""}
    `;

    slideContainer.appendChild(slideElement);
  });

  currentSlideIndex = 0;
  showSlide(currentSlideIndex);
}

let currentSlideIndex = 0;

function showSlide(index) {
  const slides = document.querySelectorAll('#slides-container .slide');

  if (slides.length === 0) {
    console.warn("Nessuna slide trovata nel contenitore.");
    return; 
  }

  if (index >= slides.length) {
    currentSlideIndex = 0;
  } else if (index < 0) {
    currentSlideIndex = slides.length - 1;
  } else {
    currentSlideIndex = index;
  }

  slides.forEach(slide => {
    slide.style.display = 'none';
  });

  slides[currentSlideIndex].style.display = 'block';
}

function moveSlider(n) {
  showSlide(currentSlideIndex + n); 
}

function moveTutorialSlider(n) {
  showSlide(currentSlideIndex + n); 
}

let currentImageIndex = 0;
let carouselImages = [];

const events = {};

let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();

async function generateCalendar() {
  const calendar = document.getElementById("calendar");
  calendar.innerHTML = "";

  const daysOfWeek = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
  daysOfWeek.forEach(day => {
    const dayHeader = document.createElement("div");
    dayHeader.classList.add("day-header");
    dayHeader.innerText = day;
    calendar.appendChild(dayHeader);
  });

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1; 

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const monthName = new Date(currentYear, currentMonth).toLocaleString('it-IT', { month: 'long' });
  document.getElementById("current-month").innerText = `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${currentYear}`;

  for (let i = 0; i < adjustedFirstDay; i++) {
    const emptyCell = document.createElement("div");
    calendar.appendChild(emptyCell);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayCell = document.createElement("div");
    dayCell.classList.add("calendar-day");

    if (events[dateKey] && events[dateKey].length > 0) {
      dayCell.classList.add("event-day");
    }

    dayCell.innerText = day;
    dayCell.onclick = () => openEventModal(dateKey);
    calendar.appendChild(dayCell);
  }
}

function changeMonth(offset) {
  currentMonth += offset;

  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  } else if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }

  generateCalendar();
}

async function caricaFeste() {
  const { data: feste, error } = await supabase
    .from('feste')
    .select('*')
    .eq('locale', userLocale);

  if (error) {
    console.error("Errore nel caricamento delle feste:", error);
    return;
  }

  Object.keys(events).forEach(date => delete events[date]);

  feste.forEach(festa => {
    const dateKey = festa.date;
    if (!events[dateKey]) {
      events[dateKey] = [];
    }
    events[dateKey].push({ time: festa.time, name: festa.gestione, id: festa.id });
  });

  generateCalendar();
}

function openEventModal(date) {
  const eventList = document.getElementById("event-list");
  eventList.innerHTML = "";

  const dayEvents = events[date] || [];
  if (dayEvents.length === 0) {
    eventList.innerHTML = "<li>Nessuna festa per questo giorno</li>";
  } else {
    dayEvents.forEach(event => {
      const listItem = document.createElement("li");
      listItem.innerText = `${event.time} - ${event.name} `;

      const deleteButton = document.createElement("button");
      deleteButton.innerText = "Elimina";
      deleteButton.onclick = (e) => {
        e.stopPropagation(); 
        eliminaFesta(event.id, date);
      };

      listItem.appendChild(deleteButton);
      eventList.appendChild(listItem);
    });
  }

  const modal = document.getElementById("event-modal");
  modal.style.display = "flex";

  modal.onclick = function(event) {
    const modalContent = document.querySelector(".modal-content");
    if (!modalContent.contains(event.target)) {
      closeModal();
    }
  };
}

async function aggiungiFesta() {
  const date = document.getElementById("festaDate").value;
  const gestione = document.getElementById("festaName").value;
  const time = document.getElementById("festaTime").value;

  console.log("Data inserita:", date);
  console.log("Gestione/invitati:", gestione);
  console.log("Orario della festa:", time);
  console.log("Locale:", userLocale);

  if (!date || !gestione || !time) {
    showNotification("Compila tutti i campi.","info");
    return;
  }

  const { data, error } = await supabase
    .from('feste')
    .insert([{ date, gestione, time, locale: userLocale}]);

  if (error) {
    console.error("Errore nell'aggiunta della festa:", error);
  } else {
    console.log("Festa aggiunta con successo:", data);
    document.getElementById("festaDate").value = "";
    document.getElementById("festaName").value = "";
    document.getElementById("festaTime").value = "";
    caricaFeste();
  }
}


async function eliminaFesta(festaId, date) {

  const { error } = await supabase
    .from('feste')
    .delete()
    .eq('id', festaId);

  if (error) {
    console.error("Errore nell'eliminazione della festa:", error);
    return;
  }

  events[date] = events[date].filter(event => event.id !== festaId);
  caricaFeste();
  openEventModal(date);
}

function closeModal() {
  document.getElementById("event-modal").style.display = "none";
}

generateCalendar();

async function aggiungiOrdine() {
  const orderText = document.getElementById("newOrderText").value;
  console.log("Valore di orderText:", orderText); 

  if (!orderText || orderText.trim() === "") {
    console.error("L'ordine non può essere vuoto.");
    showNotification("Inserisci un testo per l'ordine.","info");
    return;
  }

  const { data, error } = await supabase
    .from('ordini')
    .insert([{ order_text: orderText, locale: userLocale }]);

  if (error) {
    console.error("Errore nell'aggiunta dell'ordine:", error);
  } else {
    console.log("Ordine aggiunto con successo:", data);
    caricaOrdini();
    document.getElementById("newOrderText").value = "";
  }
}

async function caricaOrdini() {
  const { data: ordini, error } = await supabase
    .from('ordini')
    .select('*')
    .eq('locale', userLocale);

  if (error) {
    console.error("Errore nel caricamento degli ordini:", error);
  } else {
    const ordiniList = document.getElementById("ordiniList");
    ordiniList.innerHTML = "";

    ordini.forEach(order => {
      const li = document.createElement("li");
      li.innerText = `${order.order_text} `;

      const deleteButton = document.createElement("button");
      deleteButton.innerText = "Elimina";
      deleteButton.onclick = () => eliminaOrdine(order.id);

      li.appendChild(deleteButton);
      ordiniList.appendChild(li);
    });
  }
}

async function eliminaOrdine(orderId) {

  const { error } = await supabase
    .from('ordini')
    .delete()
    .eq('id', orderId);

  if (error) {
    console.error("Errore nell'eliminazione dell'ordine:", error);
  } else {
    console.log("Ordine eliminato con successo");
    caricaOrdini(); 
  }
}

async function aggiungiOrdineFeste() {
  const orderText = document.getElementById("newOrderTextFest").value;
  console.log("Valore di orderText:", orderText); 

  if (!orderText || orderText.trim() === "") {
    console.error("L'ordine non può essere vuoto.");
    showNotification("Inserisci un testo per l'ordine.","info");
    return;
  }

  const { data, error } = await supabase
    .from('ordinifeste')
    .insert([{ order_text: orderText, locale: userLocale }]);

  if (error) {
    console.error("Errore nell'aggiunta dell'ordine:", error);
  } else {
    console.log("Ordine aggiunto con successo:", data);
    caricaOrdiniFeste();
    document.getElementById("newOrderTextFest").value = "";
  }
}

async function caricaOrdiniFeste() {
  const { data: ordini, error } = await supabase
    .from('ordinifeste')
    .select('*')
    .eq('locale', userLocale); 

  if (error) {
    console.error("Errore nel caricamento degli ordini:", error);
  } else {
    const ordiniList = document.getElementById("ordiniListfeste");
    ordiniList.innerHTML = "";

    ordini.forEach(order => {
      const li = document.createElement("li");
      li.innerText = `Item: ${order.order_text} `;

      const deleteButton = document.createElement("button");
      deleteButton.innerText = "Elimina";
      deleteButton.onclick = () => eliminaOrdineFeste(order.id);

      li.appendChild(deleteButton);
      ordiniList.appendChild(li);
    });
  }
}

async function eliminaOrdineFeste(orderId) {

  const { error } = await supabase
    .from('ordinifeste')
    .delete()
    .eq('id', orderId);

  if (error) {
    console.error("Errore nell'eliminazione dell'ordine:", error);
  } else {
    console.log("Ordine eliminato con successo");
    caricaOrdiniFeste(); 
  }
}

async function login() {
  const usernameInput = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const { data: users, error } = await supabase
    .from('users')
    .select('id, role, locale, username')
    .ilike('username', usernameInput)
    .eq('password', password);
  if (error) {
    console.error("Errore nel login:", error);
    showNotification("Errore nel login. Riprova.","error");
    return;
  }

  console.log("Risultato della query:", users);

    
  if (users && users.length > 0) {
    const user = users[0];
    const { id, role, locale, username } = user;

    userLocale = locale.trim().toLowerCase();
    localStorage.setItem("user", JSON.stringify({ id, role, locale: userLocale, username }));

    userPrivilege = role;
    uuid = id;

    mostraDatiAccount();

    document.getElementById("login-screen").style.display = "none";
    document.getElementById("app-content").style.display = "block";
    usersCredits();
    caricaAnnunci()
    caricaLocali()
    caricaListaLocali()
    caricaImmaginiOrario()
    caricaNews();
    showNotification(`Benvenuto ${username}`,"success")
  } else {
    showNotification("Credenziali non valide", "error");
  }
}

function mostraDatiAccount() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user) {
    const usernameElem = document.getElementById("account-username");
    usernameElem.innerText = `Utente: ${user.username}`;

    const usernamePri = document.getElementById("account-privilegi");
    usernamePri.innerText = `Privilegi: ${user.role}`;

    const localeElem = document.getElementById("account-locale");
    localeElem.innerText = `Locale: ${user.locale}`;
  } else {
    console.warn("Nessun utente trovato!");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  mostraDatiAccount();
});

document.addEventListener("DOMContentLoaded", () => {
  const savedUser = JSON.parse(localStorage.getItem("user"));

  if (savedUser && savedUser.locale) {
    userPrivilege = savedUser.role;
    userLocale = savedUser.locale.trim().toLowerCase();

    console.log("Locale caricato dal localStorage:", userLocale);

    document.getElementById("login-screen").style.display = "none";
    document.getElementById("app-content").style.display = "block";

    showNotification(`Bentornato ${savedUser.username}`, "success");
    usersCredits();
    caricaDatiUtente();
  } else {
    console.warn("⚠️ Nessun userLocale trovato nel localStorage!");
    document.getElementById("login-screen").style.display = "block";
  }
  setTimeout(() => {
    console.log("🟢 userLocale dopo delay:", userLocale);
    caricaDatiUtente();
  }, 500);
});

function caricaDatiUtente() {
  caricaFormazioni()
  caricaTaskManutenzione()
  caricaAnnunci()
  caricaLocali()
  caricaListaLocali()
  caricaImmaginiOrario()
  caricaNews();
}

function logout() {
  localStorage.removeItem("user");
  userPrivilege = null;
  userLocale = null;

  document.getElementById("login-screen").style.display = "block";
  document.getElementById("app-content").style.display = "none";

  showNotification("Logout effettuato con successo", "info");
}

async function creaAccount() {
  const username = document.getElementById("usernameAdd").value.trim();
  const password = document.getElementById("passwordAdd").value.trim();
  const role = document.getElementById("roleRequiredAccount").value;
  const locale = document.getElementById("localeSelect2").value;

  console.log("Valori recuperati:", { username, password, role, locale });

  if (!username || !password || !role || !locale) {
    showNotification("Compila tutti i campi.", "error");
    return;
  }

  const { data, error } = await supabase
    .from('users')
    .insert([{ username, password, role, locale }]);

  if (error) {
    console.error("Errore durante la creazione dell'account:", error);
    showNotification("Errore nella creazione dell'account.", "error");
    return;
  }

  document.getElementById("createAccountForm").reset();
  showNotification("Account creato con successo!", "success");
}

function usersCredits() {
  if (userPrivilege === "dev") {
    document.querySelectorAll(".dev-section, .master-section, .admin-section, .hospitality-section, .basic-section").forEach(section => {
      section.style.display = "block";
    });
  } else if (userPrivilege === "master") {
    document.querySelectorAll(".master-section, .admin-section, .hospitality-section, .basic-section").forEach(section => {
      section.style.display = "block";
    });
  }  else if (userPrivilege === "admin") {
    document.querySelectorAll(".admin-section, .hospitality-section, .basic-section").forEach(section => {
      section.style.display = "block";
    });
  } else if (userPrivilege === "hospitality") {
    document.querySelectorAll(".hospitality-section, .basic-section").forEach(section => {
      section.style.display = "block";
    });
    document.querySelectorAll(".admin-section").forEach(section => {
      section.style.display = "none";
    });
  } else if (userPrivilege === "basic") {
    document.querySelectorAll(".basic-section").forEach(section => {
      section.style.display = "block";
    });
    document.querySelectorAll(".hospitality-section, .admin-section").forEach(section => {
      section.style.display = "none";
    });
  } else if (userPrivilege === "manutenzione") {
    document.querySelectorAll('.section').forEach(section => {
      section.style.display = "none";
    });
    document.getElementById('cambioLocale').style.display = "block";
    document.getElementById('manutenzione').style.display = "block";
    document.getElementById("sidebar").style.display = "block";
    document.getElementById("menu-overlay").style.display = "none";
    
    const menuIcon = document.querySelector(".menu-icon");
    if (menuIcon) {
        menuIcon.style.display = "none"; 
    }
    gestisciVisibilitaLogout();
  } 
}

function gestisciVisibilitaLogout() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return;

  const userRole = userPrivilege;
  const logoutButton = document.getElementById("logout-button");

  if (userRole === "manutenzione" && document.getElementById("manutenzione").style.display === "block") {
      logoutButton.style.display = "block";
  } else {
      logoutButton.style.display = "none";
  }
}


async function caricaMalattie() {
  const { data: malattie, error } = await supabase
    .from('malattie')
    .select('*')
    .eq('locale', userLocale)
    .order('start_date', { ascending: true });

  if (error) {
    console.error("Errore nel caricamento delle malattie:", error);
    return;
  }

  const filteredMalattie = malattie.filter(f => canViewLocale(f.locale));

  const malattieList = document.getElementById("malattieList");
  malattieList.innerHTML = "";

  filteredMalattie.forEach(malattia => {
    const malattiaItem = document.createElement("div");
    malattiaItem.classList.add("malattia-item");

    const malattiaTitle = document.createElement("h4");
    malattiaTitle.innerText = `${malattia.first_name} ${malattia.last_name}`;
    malattiaTitle.classList.add("malattia-title");

    const malattiaDesc = document.createElement("p");
    malattiaDesc.innerText = `Dal: ${malattia.start_date} Al: ${malattia.end_date}`;

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Elimina";
    deleteButton.onclick = () => eliminaMalattia(malattia.id);

    malattiaItem.appendChild(malattiaTitle);
    malattiaItem.appendChild(malattiaDesc);
    malattiaItem.appendChild(deleteButton);

    malattieList.appendChild(malattiaItem);
  });
}

async function aggiungiMalattia() {
  const firstName = document.getElementById("malattiaNome").value;
  const lastName = document.getElementById("malattiaCognome").value;
  const startDate = document.getElementById("malattiaStart").value;
  const endDate = document.getElementById("malattiaEnd").value;

  if (!firstName || !lastName || !startDate || !endDate) {
    showNotification("Compila tutti i campi.","info");
    return;
  }

  const { data, error } = await supabase
    .from('malattie')
    .insert([{ first_name: firstName, last_name: lastName, start_date: startDate, end_date: endDate, locale: userLocale }]);

  if (error) {
    console.error("Errore nell'aggiunta della malattia:", error);
  } else {
    console.log("Malattia aggiunta con successo:", data);
    caricaMalattie(); 
  }
}

async function eliminaMalattia(malattiaId) {

  const { error } = await supabase
    .from('malattie')
    .delete()
    .eq('id', malattiaId);

  if (error) {
    console.error("Errore nell'eliminazione della malattia:", error);
  } else {
    console.log("Malattia eliminata con successo");
    caricaMalattie();
  }
}

async function caricaFormazioni() {
  console.log("🟡 userLocale attuale:", userLocale); 

  const { data: formazioni, error } = await supabase
    .from('formazioni')
    .select('*')
    .eq('locale', userLocale.trim().toLowerCase())  
    .order('date', { ascending: true });

  if (error) {
    console.error("❌ Errore nel caricamento delle formazioni:", error);
    return;
  }

  console.log("🔍 Formazioni caricate da Supabase:", formazioni); 

  const formazioneList = document.getElementById("formazioneList");
  formazioneList.innerHTML = "";

  if (!formazioni || formazioni.length === 0) {
    console.warn("⚠️ Nessuna formazione trovata per il locale:", userLocale);
    formazioneList.innerHTML = "<p>Nessuna formazione disponibile.</p>";
    return;
  }

  formazioni.forEach(formazione => {
    const formazioneItem = document.createElement("div");
    formazioneItem.classList.add("formazione-item");

    const formazioneTitle = document.createElement("h4");
    formazioneTitle.innerText = `${formazione.name} | ${formazione.date}`;
    formazioneTitle.classList.add("formazione-title");

    const formazioneDesc = document.createElement("p");
    formazioneDesc.innerText = `Tipo formazione: ${formazione.tipologia}`;

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Elimina";
    deleteButton.onclick = () => eliminaFormazione(formazione.id);

    formazioneItem.appendChild(formazioneTitle);
    formazioneItem.appendChild(formazioneDesc);
    formazioneItem.appendChild(deleteButton);

    formazioneList.appendChild(formazioneItem);
  });
}


function canViewLocale(localeRequired) {
  if (!userLocale) {
      console.warn("⚠️ userLocale non è definito!");
      return false;
  }

  return localeRequired === userLocale; 
}

async function aggiungiFormazioni() {
  const Name = document.getElementById("formazioneNome").value;
  const Date = document.getElementById("formazioneData").value;
  const Type = document.getElementById("formazioneTipo").value;

  if (!Name || !Type || !Date) {
    showNotification("Compila tutti i campi.","info");
    return;
  }

  const { data, error } = await supabase
    .from('formazioni')
    .insert([{ name: Name, date: Date, tipologia: Type, locale: userLocale }]);

  if (error) {
    console.error("Errore nell'aggiunta della formazione:", error);
  } else {
    console.log("Formazione aggiunta con successo:", data);
    caricaFormazioni(); 
  }
}

async function eliminaFormazione(formazioneId) {

  const { error } = await supabase
    .from('formazioni')
    .delete()
    .eq('id', formazioneId);

  if (error) {
    console.error("Errore nell'eliminazione della formazione:", error);
  } else {
    console.log("Formazione eliminata con successo");
    caricaFormazioni();
  }
}

async function loadContacts() {
  const { data: contacts, error } = await supabase
    .from('contacts')
    .select('id, name, role, phone, email, image_url'); 

  if (error) {
    console.error("Errore nel caricamento dei contatti:", error);
    return;
  }

  contacts.sort((a, b) => a.id - b.id);

  const contactsByRole = contacts.reduce((acc, contact) => {
    const role = contact.role || "Ruolo non specificato";
    if (!acc[role]) {
      acc[role] = [];
    }
    acc[role].push(contact);
    return acc;
  }, {});

  const contactsSection = document.querySelector('.contact-category');
  contactsSection.innerHTML = "<h2>Contatti Aurea S.r.l.</h2>"; 

  Object.keys(contactsByRole).forEach(role => {
    const contactCategory = document.createElement("div");
    contactCategory.classList.add("contact-category");

    const title = document.createElement("h3");
    title.innerText = role;
    contactCategory.appendChild(title);

    contactsByRole[role].forEach(contact => {
      const contactItem = document.createElement("div");
      contactItem.classList.add("contact-item");

      const imageUrl = contact.image_url 
        ? `${contact.image_url}`
        : 'https://nxdgrrympafaeomfgcnh.supabase.co/storage/v1/object/public/contact-image/foto-profilo-vuota.jpg?t=2024-11-02T08%3A21%3A17.331Z';

      const img = document.createElement("img");
      img.src = imageUrl;
      img.alt = contact.name || "";

      const contactInfo = document.createElement("div");
      contactInfo.innerHTML = `
        <p><strong>${contact.name || ""}</strong></p>
        <p>Cell: ${contact.phone || ""}</p>
        <p>Mail: ${contact.email || ""}</p>
      `;

      contactItem.appendChild(img);
      contactItem.appendChild(contactInfo);
      contactCategory.appendChild(contactItem);
    });

    contactsSection.appendChild(contactCategory);
  });
}

document.addEventListener("DOMContentLoaded", loadContacts);

async function inviaRichiesta() {
  const nome = document.getElementById("nome").value;
  const dataInizio = document.getElementById("dataInizio").value;
  const dataFine = document.getElementById("dataFine").value;
  const motivo = document.getElementById("motivo").value;

  if (!nome || !dataInizio || !dataFine) {
    showNotification("Per favore, compila tutti i campi obbligatori.","info");
    return;
  }

  const { data, error } = await supabase
    .from('permessi')
    .insert([
      { nome, data_inizio: dataInizio, data_fine: dataFine, motivo, locale: userLocale }
    ]);

  if (error) {
    console.error("Errore nell'invio della richiesta:", error);
    showNotification("Si è verificato un errore durante l'invio della richiesta.","error");
    return;
  }

  showNotification("Richiesta inviata con successo!","success");
  aggiornaListaRichieste();
  document.getElementById("permessoForm").reset();
}

async function aggiornaListaRichieste() {
  const richiesteList = document.getElementById("richiesteList");
  richiesteList.innerHTML = "<h3>Richieste Inviate</h3>";

  const { data: richieste, error } = await supabase
    .from('permessi')
    .select('*')
    .eq('locale', userLocale) 
    .order('id', { ascending: false });

  if (error) {
    console.error("Errore nel recupero delle richieste:", error);
    return;
  }

  richieste.forEach(richiesta => {
    const richiestaElem = document.createElement("div");
    richiestaElem.classList.add("richiesta-item");
    richiestaElem.innerHTML = `
      <p><strong>Nome:</strong> ${richiesta.nome}</p>
      <p><strong>Data Inizio:</strong> ${richiesta.data_inizio}</p>
      <p><strong>Data Fine:</strong> ${richiesta.data_fine}</p>
      <p><strong>Motivo:</strong> ${richiesta.motivo || "Nessun motivo specificato"}</p>
    `;

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Elimina";
    deleteButton.onclick = () => cancellaRichiesta(richiesta.id);
    richiestaElem.appendChild(deleteButton);
    richiesteList.appendChild(richiestaElem);
  });
}

async function cancellaRichiesta(id) {
  const { error } = await supabase
    .from('permessi')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Errore nella cancellazione della richiesta:", error);
    showNotification("Si è verificato un errore durante la cancellazione della richiesta.","error");
    return;
  }

  showNotification("Richiesta cancellata con successo!","success");
  aggiornaListaRichieste();
}

async function creaAnnuncio() {
  const titolo = document.getElementById("titolo").value;
  const contenuto = document.getElementById("contenuto").value;

  const { data, error } = await supabase
    .from('annunci_importanti')
    .insert([{ titolo, contenuto, data_creazione: new Date(), locale: userLocale}]);

  if (error) {
    console.error("Errore nella creazione dell'annuncio:", error);
    showNotification("Errore nella creazione dell'annuncio","error");
  } else {
    console.log("Annuncio creato con successo:", data);
    showNotification("Annuncio caricato con successo!","success");
    document.getElementById("annuncioForm").reset();
    caricaAnnunci();  
  }
}

async function caricaAnnunci() {
  const { data: annunci, error } = await supabase
    .from('annunci_importanti')
    .select('*')
    .eq('locale', userLocale) 
    .order('data_creazione', { ascending: false });

  if (error) {
    console.error("Errore nel caricamento degli annunci:", error);
    return;
  }

  const container = document.getElementById("annunciPostitContainer");
  container.innerHTML = ""; 

  annunci.forEach(annuncio => {
    const postit = document.createElement("div");
    postit.classList.add("postit");
    postit.setAttribute("data-id", annuncio.id);
    postit.innerHTML = `
      <h4>${annuncio.titolo}</h4>
    `;
    postit.onclick = () => mostraAnnuncioCompleto(annuncio);
    container.appendChild(postit);
  });
  caricaPostit()
}

function mostraAnnuncioCompleto(annuncio) {
  const expandedPostit = document.createElement("div");
  expandedPostit.classList.add("postit-expanded");
  expandedPostit.innerHTML = `
    <h2>${annuncio.titolo}</h2>
    <p>${annuncio.contenuto}</p>
    <button onclick="chiudiAnnuncioCompleto(this)">Chiudi</button>
  `;
  document.body.appendChild(expandedPostit);
}

function chiudiAnnuncioCompleto(element) {
  document.body.removeChild(element.parentNode);
}

document.addEventListener("DOMContentLoaded", () => {
  caricaAnnunci();
});

async function caricaPostit() {

  const { data: postit, error } = await supabase
    .from('annunci_importanti')
    .select('*')
    .eq('locale', userLocale);

  if (error) {
    console.error("Errore nel caricamento dei Postit:", error);
  } else {
    const postitList = document.getElementById("postitList");
    postitList.innerHTML = "";

    postit.forEach(postit => {
      const li = document.createElement("li");
      li.innerText = `Post-it: ${postit.titolo} `;

      const deleteButton = document.createElement("button");
      deleteButton.innerText = "Elimina";
      deleteButton.onclick = () => eliminaPostit(postit.id);

      li.appendChild(deleteButton);
      postitList.appendChild(li);
    });
  }
}

async function eliminaPostit(postitId) {
  const { error } = await supabase
    .from('annunci_importanti')
    .delete()
    .eq('id', postitId);

  if (error) {
    console.error("Errore nell'eliminazione del post-it:", error);
    return;
  }

  console.log("Post-it eliminato con successo");

  const postitListItem = document.querySelector(`#postitListItem-${postitId}`);
  if (postitListItem) {
    postitListItem.remove();
  }

  const postitInHome = document.querySelector(`#annunciPostitContainer .postit[data-id="${postitId}"]`);
  if (postitInHome) {
    postitInHome.remove();
  }
  
  caricaPostit();
  caricaAnnunci();
}

async function caricaLocali() {
  const { data: userLocales, error } = await supabase
    .from('user_locali')
    .select('locale'); 

  if (error) {
    console.error("Errore nel caricamento dei locali:", error);
    return;
  }

  console.log("Locali dell'utente:", userLocales); 

  const localeSelect = document.getElementById("localeSelect");
  localeSelect.innerHTML = "";

  userLocales.forEach(({ locale }) => {
    const option = document.createElement("option");
    option.value = locale;
    option.textContent = locale;
    localeSelect.appendChild(option);
  });

  if (!userLocale && userLocales.length > 0) {
    userLocale = userLocales[0].locale;
    console.log("✅ Impostato userLocale con il primo valore disponibile:", userLocale);
  } else {
    console.log("🔹 Mantengo userLocale:", userLocale);
  }

  localeSelect.value = userLocale;

  caricaDati(); 
}


function cambiaLocale(nuovoLocale) {
  userLocale = nuovoLocale.trim().toLowerCase();
  console.log("Locale selezionato:", userLocale);
  localStorage.setItem("user", JSON.stringify({ 
    ...JSON.parse(localStorage.getItem("user")), 
    locale: userLocale 
  }));
  console.log("🔄 Locale cambiato in:", userLocale);
  
  caricaDati();
}

function caricaDati() {
  caricaAnnunci();
  caricaFeste();
  caricaMalattie();
  caricaFormazioni();
  caricaTaskManutenzione();
  aggiornaListaRichieste();
  caricaImmaginiOrario();
  caricaOrdini();
  caricaOrdiniFeste();
  caricaTrasferimenti();
  caricaNews();
}

document.addEventListener("DOMContentLoaded", caricaLocali);
document.addEventListener("DOMContentLoaded", caricaListaLocali);

function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result.replace(/^data:image\/[a-z]+;base64,/, '');
      resolve(base64String);
    };
    reader.onerror = error => reject(error);
  });
}

async function salvaImmagineOrario(sezione) {
  const fileInput = document.getElementById(sezione === 'manager' ? "orarioManagerFile" : "orarioCrewFile").files[0];
  const titleInput = document.getElementById(sezione === 'manager' ? "orarioManagerTitle" : "orarioCrewTitle").value;

  if (!fileInput || !titleInput) {
    showNotification("Inserisci sia un titolo che un file per l'immagine.", "info");
    return;
  }

  if (fileInput.type === "application/pdf") {
    await convertiPDFinJPGeSalva(fileInput, titleInput, sezione);
  } else if (fileInput.type.startsWith("image/")) {
    const base64String = await convertToBase64(fileInput);
    await salvaImmagineBase64(base64String, titleInput, sezione);
  } else {
    showNotification("Tipo di file non supportato. Seleziona un'immagine JPG o un PDF.", "error");
  }
}

async function salvaImmagineBase64(base64String, titolo, sezione) {
  const { error } = await supabase
    .from('orari_immagini')
    .insert([
      {
        locale: userLocale,
        sezione,
        titolo,
        immagine_base64: base64String,
        data_caricamento: new Date()
      }
    ]);

  if (error) {
    console.error("Errore nel salvataggio dell'immagine:", error);
    showNotification("Errore nel salvataggio dell'immagine.", "error");
  } else {
    showNotification(`Immagine ${sezione} salvata con successo!`, "success");
    caricaImmaginiOrario();
  }
}

async function convertiPDFinJPGeSalva(file, titolo, sezione) {
  const pdfData = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 2 });

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({ canvasContext: context, viewport }).promise;

    const base64String = canvas.toDataURL("image/jpeg").split(",")[1];
    await salvaImmagineBase64(base64String, `${titolo} - Pagina ${pageNumber}`, sezione);
  }

  showNotification("PDF convertito!", "success");
}

async function caricaImmaginiOrario() {
  const { data: immagini, error } = await supabase
    .from('orari_immagini')
    .select('*')
    .eq('locale', userLocale)
    .order('data_caricamento', { ascending: false });

  if (error) {
    console.error("Errore nel caricamento delle immagini:", error);
    return;
  }

  const managerContainer = document.getElementById("orariManagerContainer");
  const crewContainer = document.getElementById("orariCrewContainer");

  managerContainer.innerHTML = "<h3>Orari Manager</h3>";
  crewContainer.innerHTML = "<h3>Orari Crew</h3>";

  immagini.forEach(img => {
    const imgElem = document.createElement("div");
    imgElem.classList.add("orario-item");
  
    imgElem.innerHTML = `
      <h4>${img.titolo}</h4>
      <img src="data:image/jpeg;base64,${img.immagine_base64}" alt="${img.titolo}" style="max-width: 100%; max-height: 300px; cursor: pointer;">
    `;
  
    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Elimina";
    deleteButton.onclick = () => eliminaImmagineOrario(img.id);

    imgElem.appendChild(deleteButton);

    if (img.sezione === 'manager') {
      managerContainer.appendChild(imgElem);
    } else if (img.sezione === 'crew') {
      crewContainer.appendChild(imgElem);
    }
  });
}

async function eliminaImmagineOrario(id) {
  const { error } = await supabase
    .from('orari_immagini')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Errore nell'eliminazione dell'immagine:", error);
    showNotification("Errore durante l'eliminazione dell'immagine.","error");
  } else {
    showNotification("Immagine eliminata con successo!","success");
    caricaImmaginiOrario(); 
  }
}

function handleFileChangeOrario(event) {
  const fileInput = event.target;
  const fileNameDisplay = document.getElementById("fileName");

  if (fileInput.files.length > 0) {
    fileNameDisplay.textContent = fileInput.files[0].name;
  } else {
    fileNameDisplay.textContent = "Nessun file selezionato";
  }
}

async function convertToBase64Orario(file) { 
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = error => reject(error);
  });
}

async function salvaImmagineInSupabase(base64Image, titolo) {
  const { data, error } = await supabase
    .from('fast_news')
    .insert([{ titolo, immagine_base64: base64Image }]);

  if (error) {
    console.error("Errore nel salvataggio dell'immagine:", error);
  } else {
    console.log("Immagine salvata con successo:", data);
  }
}

async function caricaEPDFinJPG() {
  const fileInput = document.getElementById("pdfFileInput");
  const file = fileInput.files[0];

  if (!file || file.type !== "application/pdf") {
    showNotification("Per favore, seleziona un file PDF.", "info");
    return;
  }

  const pdfData = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: pdfData });
  
  const pdf = await loadingTask.promise;
  const totalPages = pdf.numPages;

  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 1.5 });

    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const context = canvas.getContext("2d");
    await page.render({ canvasContext: context, viewport }).promise;

    const imgBase64 = canvas.toDataURL("image/jpeg");

    await salvaImmagineInSupabase(imgBase64, `Pagina ${pageNum}`);
  }
  
  showNotification("PDF caricato.","success");
  caricaImmaginiFastNews();
}

document.addEventListener("DOMContentLoaded", caricaImmaginiFastNews);

async function caricaImmaginiFastNews() {
  const { data: immagini, error } = await supabase
      .from('fast_news')
      .select('immagine_base64') 
      .order('data_caricamento', { ascending: false });

  if (error) {
      console.error("Errore nel caricamento delle immagini della FastNews:", error);
      return;
  }

  const fastNewsContainer = document.getElementById("zoom-container");
  fastNewsContainer.innerHTML = ""; 

  immagini.forEach(img => {
      const imgElem = document.createElement("img");
      imgElem.src = img.immagine_base64; 
      imgElem.alt = "FastNews Image";
      imgElem.style.width = "100%";
      fastNewsContainer.appendChild(imgElem);
  });
}

async function eliminaTuttaTabella() {
  const { data: rows, error: fetchError } = await supabase
      .from('fast_news') 
      .select('id');

  if (fetchError) {
      console.error("Errore nel caricamento degli ID:", fetchError);
      showNotification("Si è verificato un errore durante il caricamento degli ID.","error");
      return;
  }

  if (!rows || rows.length === 0) {
    showNotification("Nessuna riga trovata nella tabella.","info");
      return;
  }

  const idsToDelete = rows.map(row => row.id);
  const { error: deleteError } = await supabase
      .from('fast_news') 
      .delete()
      .in('id', idsToDelete);

  if (deleteError) {
      console.error("Errore nell'eliminazione delle righe:", deleteError);
      showNotification("Si è verificato un errore durante l'eliminazione delle righe.","error");
  } else {
    showNotification("Tutte le righe sono state eliminate con successo!","success");
      caricaImmaginiFastNews(); 
  }
}

async function caricaTrasferimenti() {
  const { data: trasferimenti, error } = await supabase
    .from('trasferimenti')
    .select('*')
    .eq('locale', userLocale)
    .order('data_trasferimento', { ascending: false });

  if (error) {
    console.error("Errore nel caricamento dei trasferimenti:", error);
    return;
  }

  const listaContainer = document.getElementById("listaTrasferimentiContainer");
  listaContainer.innerHTML = "";

  trasferimenti.forEach(trasferimento => {
    const trasferimentoElem = document.createElement("div");
    trasferimentoElem.classList.add("trasferimento-item");
    trasferimentoElem.innerHTML = `
      <p><strong>Locale:</strong> ${trasferimento.locale_trasferimento}</p>
      <p><strong>Tipo:</strong> ${trasferimento.tipo_trasferimento}</p>
      <p><strong>Data:</strong> ${new Date(trasferimento.data_trasferimento).toLocaleDateString()}</p>
      <div><strong>Items:</strong></div>
      <ul>
        ${trasferimento.items.map(item => `
          <li>${item.prodotto}: ${item.quantita} ${item.unitaMisura}</li>
        `).join('')}
      </ul>
    `;

    const modificaButton = document.createElement("button");
    modificaButton.innerText = "Modifica";
    modificaButton.onclick = () => modificaTrasferimento(trasferimento.id);
    trasferimentoElem.appendChild(modificaButton);

    const eliminaButton = document.createElement("button");
    eliminaButton.innerText = "Elimina";
    eliminaButton.onclick = () => eliminaTrasferimento(trasferimento.id);
    trasferimentoElem.appendChild(eliminaButton);

    listaContainer.appendChild(trasferimentoElem);
  });
}


let trasferimentoInModifica = null;

async function modificaTrasferimento(id) {
  trasferimentoInModifica = id;

  const { data: trasferimento, error } = await supabase
    .from('trasferimenti')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error("Errore nel recupero del trasferimento per la modifica:", error);
    return;
  }

  document.getElementById("localeSelectTrasferimenti").value = trasferimento.locale_trasferimento;
  document.getElementById("tipoTrasferimento").value = trasferimento.tipo_trasferimento;
  document.getElementById("itemsContainer").innerHTML = "";

  trasferimento.items.forEach(item => {
    const newItem = document.createElement("div");
    newItem.classList.add("item");
    newItem.innerHTML = `
      <label for="prodotto">Prodotto:</label>
      <input type="text" name="prodotto" value="${item.prodotto}" required>

      <label for="quantita">Quantità:</label>
      <input type="number" name="quantita" value="${item.quantita}" required>

      <label for="unitaMisura">Unità di Misura:</label>
      <select name="unitaMisura">
        <option value="pezzi" ${item.unitaMisura === 'pezzi' ? 'selected' : ''}>Pezzi</option>
        <option value="buste" ${item.unitaMisura === 'buste' ? 'selected' : ''}>Buste</option>
        <option value="kg" ${item.unitaMisura === 'kg' ? 'selected' : ''}>Kg</option>
        <option value="cartoni" ${item.unitaMisura === 'cartoni' ? 'selected' : ''}>Cartoni</option>
      </select>
    `;
    document.getElementById("itemsContainer").appendChild(newItem);
  });

  document.getElementById("salvaTrasferimentoButton").style.display = "none";
  document.getElementById("aggiornaTrasferimentoButton").style.display = "block";
}

async function aggiornaTrasferimento() {
  if (!trasferimentoInModifica) {
    alert("Nessun trasferimento selezionato per la modifica.");
    return;
  }

  const locale = document.getElementById("localeSelectTrasferimenti").value;
  const tipoTrasferimento = document.getElementById("tipoTrasferimento").value;

  const items = Array.from(document.querySelectorAll("#itemsContainer .item")).map(item => {
    return {
      prodotto: item.querySelector("input[name='prodotto']").value,
      quantita: item.querySelector("input[name='quantita']").value,
      unitaMisura: item.querySelector("select[name='unitaMisura']").value
    };
  });

  const { error } = await supabase
    .from('trasferimenti')
    .update({
      locale_trasferimento: locale,
      tipo_trasferimento: tipoTrasferimento,
      items,
      data_trasferimento: new Date()
    })
    .eq('id', trasferimentoInModifica);

  if (error) {
    console.error("Errore durante l'aggiornamento del trasferimento:", error);
    alert("Errore durante l'aggiornamento del trasferimento.");
  } else {
    alert("Trasferimento aggiornato con successo!");
    trasferimentoInModifica = null;
    document.getElementById("trasferimentoForm").reset();
    document.getElementById("itemsContainer").innerHTML = ""; // Svuota i campi aggiunti
    caricaTrasferimenti();

    document.getElementById("salvaTrasferimentoButton").style.display = "block";
    document.getElementById("aggiornaTrasferimentoButton").style.display = "none";
  }
}


async function eliminaTrasferimento(trasferimentoId) {
  const { error } = await supabase
    .from('trasferimenti')
    .delete()
    .eq('id', trasferimentoId);

  if (error) {
    console.error("Errore nell'eliminazione del trasferimento:", error);
    return;
  }

  console.log("Trasferimento eliminato con successo");

  caricaTrasferimenti()
}

async function caricaListaLocali() {
  const { data: locali, error } = await supabase
    .from('user_locali')
    .select('locale'); 

  if (error) {
    console.error("Errore nel caricamento dei locali:", error);
    return;
  }

  console.log("Locali recuperati:", locali);

  const localeSelect2 = document.getElementById("localeSelect2");
  localeSelect2.innerHTML = "<option value='' disabled selected>Seleziona un locale</option>"; 

  locali.forEach(item => {
    const option = document.createElement("option");
    option.value = item.locale;  
    option.textContent = item.locale; 
    localeSelect2.appendChild(option);
  });

  const localeSelectTrasferimenti = document.getElementById("localeSelectTrasferimenti");
  localeSelectTrasferimenti.innerHTML = "<option value='' disabled selected>Seleziona un locale</option>"; 

  locali.forEach(item => {
    const option = document.createElement("option");
    option.value = item.locale;  
    option.textContent = item.locale; 
    localeSelectTrasferimenti.appendChild(option);
  });
}

function aggiungiItem() {
  const itemsContainer = document.getElementById("itemsContainer");

  const newItem = document.createElement("div");
  newItem.classList.add("item");
  newItem.innerHTML = `
    <label for="prodotto">Prodotto:</label>
    <input type="text" name="prodotto" required>

    <label for="quantita">Quantità:</label>
    <input type="number" name="quantita" required>

    <label for="unitaMisura">Unità di Misura:</label>
    <select name="unitaMisura">
      <option value="pezzi">Pezzi</option>
      <option value="buste">Buste</option>
      <option value="kg">Kg</option>
      <option value="cartoni">Cartoni</option>
    </select>
  `;

  itemsContainer.appendChild(newItem);
}

async function salvaTrasferimento() {
  const locale = document.getElementById("localeSelectTrasferimenti").value;
  const tipoTrasferimento = document.getElementById("tipoTrasferimento").value;

  const items = Array.from(document.querySelectorAll("#itemsContainer .item")).map(item => {
    return {
      prodotto: item.querySelector("input[name='prodotto']").value,
      quantita: item.querySelector("input[name='quantita']").value,
      unitaMisura: item.querySelector("select[name='unitaMisura']").value
    };
  });

  if (!locale || !tipoTrasferimento || items.some(item => !item.prodotto || !item.quantita)) {
    showNotification("Per favore, compila tutti i campi obbligatori.","info");
    return;
  }

  const trasferimento = {
    locale_trasferimento: locale,
    tipo_trasferimento: tipoTrasferimento,
    items,
    data_trasferimento: new Date(),
    locale: userLocale
  };

  const { error } = await supabase
    .from('trasferimenti')
    .insert([trasferimento]);

  if (error) {
    console.error("Errore nel salvataggio del trasferimento:", error);
    alert("Errore durante il salvataggio del trasferimento.");
  } else {
    alert("Trasferimento salvato con successo!");
    document.getElementById("trasferimentoForm").reset();
    document.getElementById("itemsContainer").innerHTML = "";
    caricaTrasferimenti();
  }
}

function showCustomConfirm(message, callback) {
  const confirmBox = document.getElementById("customConfirm");
  document.getElementById("customConfirmMessage").innerText = message;
  confirmBox.style.display = "block";

  window.handleConfirm = function(result) {
    confirmBox.style.display = "none";
    callback(result);
  };
}

async function salvaNews() {
  const title = document.getElementById("newsTitle").value;
  const date = document.getElementById("newsDate").value;
  const description = document.getElementById("newsDescription").value;
  const roleRequired = document.getElementById("roleRequired").value;
  const fileInput = document.getElementById("newsFileInput");

  if (!title || !date || !description || !fileInput.files.length || !roleRequired) {
    showNotification("Compila tutti i campi e carica un file.", "error");
    return;
  }

  const file = fileInput.files[0];
  let coverImage;

  if (file.type === "application/pdf") {
    const images = await convertPDFToImages(file);
    coverImage = images[0]; 
  } else if (file.type.startsWith("image/")) {
    coverImage = await convertToBase64(file);
  } else {
    showNotification("Tipo di file non supportato.", "error");
    return;
  }

  const { data, error } = await supabase.from('new_news').insert([
    { title, date, description, cover_image: coverImage, role_required: roleRequired }
  ]);

  if (error) {
    console.error("Errore nel salvataggio della news:", error);
    showNotification("Errore nel salvataggio della news.", "error");
    return;
  }

  showNotification("News salvata con successo!", "success");
  title.value = "";
  date.value = "";
  description.value = "";
  roleRequired.value = "";
  fileInput.value = "";
  salvaImmaginiCarosello(file, title, date); 
  caricaNews();
}

async function salvaImmaginiCarosello(file, title, date) {
  if (file.type === "application/pdf") {
    const images = await convertPDFToImages(file); 
    for (let i = 0; i < images.length; i++) {
      await inserisciImmagine(title, images[i], i + 1, date);
    }
  } else {
    const base64Image = await convertNewsToBase64(file);
    await inserisciImmagine(title, base64Image, 1, date);
  }
  showNotification("Immagini salvate con successo!", "success");
}

async function inserisciImmagine(title, base64Image, pageNumber, date) {
  const { data, error } = await supabase.from('carousel_images').insert([
    { news_title: title, image_base64: base64Image, page_number: pageNumber, date_uploaded: date }
  ]);

  if (error) {
    console.error("Errore nel salvataggio dell'immagine:", error);
  }
}

function convertNewsToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}

async function convertPDFToImages(pdfFile) {
  const pdf = await pdfjsLib.getDocument(URL.createObjectURL(pdfFile)).promise;
  const images = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const viewport = page.getViewport({ scale: 2 });
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({ canvasContext: context, viewport }).promise;
    images.push(canvas.toDataURL("image/jpeg").split(",")[1]); 
  }

  return images;
}

async function caricaNews() {
  const { data: newsList, error } = await supabase
    .from('new_news')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error("Errore nel caricamento delle news:", error);
    showNotification("Errore nel caricamento delle news.", "error");
    return;
  }

  const container = document.getElementById("listaNewsContainer");
  container.innerHTML = "";

  newsList.forEach(news => {
    if (canViewContent(news.role_required)) {
      const newsCard = document.createElement("div");
      newsCard.classList.add("card");

      newsCard.innerHTML = `
        <img src="data:image/jpeg;base64,${news.cover_image}" alt="${news.title}" class="news-cover">
        <h3>${news.title}</h3>
        <p>${new Date(news.date).toLocaleDateString()}</p>
        <button onclick="apriModalNews('${news.title}')">Dettagli</button>
        <button onclick="eliminaNews('${news.title}')">Elimina</button>
      `;

      container.appendChild(newsCard);
    }
  });
}

function canViewContent(requiredRole) {
  const rolesHierarchy = {
    "basic": 1,
    "hospitality": 2,
    "admin": 3,
    "master": 4,
    "dev": 5,
  };

  return rolesHierarchy[userPrivilege] >= rolesHierarchy[requiredRole];
}

async function apriModalNews(title) {
  const { data: newsData, error: newsError } = await supabase
    .from('new_news')
    .select('*')
    .eq('title', title)
    .single();

  if (newsError) {
    console.error("Errore nel caricamento della news:", newsError);
    return;
  }

  document.getElementById("modalTitle").innerText = newsData.title;
  document.getElementById("modalDescription").innerText = newsData.description;

  const imagesData = await caricaImmagini(title);

  const carouselContainer = document.getElementById("carouselContainerNews");
  carouselContainer.innerHTML = "";

  imagesData.forEach((img, index) => {
    const imgElement = document.createElement("img");
    imgElement.src = `data:image/jpeg;base64,${img.image_base64}`;
    imgElement.alt = `Pagina ${index + 1}`;
    carouselContainer.appendChild(imgElement);
  });

  document.getElementById("carouselNewsModal").style.display = "block";
}


async function caricaImmagini(title) {
  const { data: imagesData, error } = await supabase
    .from('carousel_images')
    .select('image_base64')
    .eq('news_title', title)
    .order('page_number', { ascending: true });

  if (error) {
    console.error("Errore nel caricamento delle immagini:", error);
    return [];
  }

  return imagesData;
}

function chiudiCarosello() {
  const modal = document.getElementById("carouselNewsModal");
  if (modal) {
    modal.style.display = "none"; 
  }
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    chiudiCarosello();
  }
});

document.getElementById('newsFileInput').addEventListener('change', function () {
  const fileName = this.files.length ? this.files[0].name : 'Nessun file selezionato';
  document.getElementById('fileName').innerText = fileName;
});

let currentCarouselIndex = 0;

async function caricaImmaginiCarosello(title) {
  const { data: imagesData, error } = await supabase
    .from('carousel_images')
    .select('image_base64')
    .eq('news_title', title)
    .order('page_number', { ascending: true });

  if (error) {
    console.error("Errore nel caricamento delle immagini del carosello:", error);
    return;
  }

  const carouselContainer = document.getElementById("carouselContainerNews");
  if (!carouselContainer) {
    console.error("Contenitore del carosello non trovato.");
    return;
  }

  carouselContainer.innerHTML = ""; 
  currentCarouselIndex = 0; 

  imagesData.forEach((img, index) => {
    const imgElement = document.createElement("img");
    imgElement.src = `data:image/jpeg;base64,${img.image_base64}`;
    imgElement.alt = `Pagina ${index + 1}`;
    imgElement.classList.add(index === 0 ? "active" : ""); 
    carouselContainer.appendChild(imgElement);
  });
}

function cambiaPaginaCarosello(direzione) {
  const images = document.querySelectorAll("#carouselContainerNews img");
  if (images.length === 0) return;

  images[currentCarouselIndex].classList.remove("active");

  currentCarouselIndex = (currentCarouselIndex + direzione + images.length) % images.length;

  images[currentCarouselIndex].classList.add("active");
}

async function eliminaNews(title) {
  if (userPrivilege !== "dev") {
    showNotification("Non hai i permessi per eliminare questa news.", "error");
    return;
  }

  showCustomConfirm(
    `Sei sicuro di voler eliminare la news "${title}" e tutte le immagini correlate?`,
    async (confirmed) => {
      if (!confirmed) return;

      try {
        const { error: imagesError } = await supabase
          .from('carousel_images')
          .delete()
          .eq('news_title', title);

        if (imagesError) {
          console.error("Errore nell'eliminazione delle immagini:", imagesError);
          showNotification("Errore durante l'eliminazione delle immagini.", "error");
          return;
        }

        const { error: newsError } = await supabase
          .from('new_news')
          .delete()
          .eq('title', title);

        if (newsError) {
          console.error("Errore nell'eliminazione della notizia:", newsError);
          showNotification("Errore durante l'eliminazione della notizia.", "error");
          return;
        }

        showNotification(`La news "${title}" e le immagini correlate sono state eliminate con successo.`, "success");

        caricaNews();
      } catch (error) {
        console.error("Errore durante l'eliminazione:", error);
        showNotification("Si è verificato un errore durante l'eliminazione.", "error");
      }
    }
  );
}

async function aggiungiTaskManutenzione() {
  const titoloInput = document.getElementById("taskTitolo");
  const descrizioneInput = document.getElementById("taskDescrizione");
  const immaginiInput = document.getElementById("taskImmagini");

  if (!titoloInput.value.trim()) {
      alert("⚠️ Inserisci un titolo per la task!");
      return;
  }

  const immaginiBase64 = [];
  for (const file of immaginiInput.files) {
      const base64String = await getResizedBase64(file, 800);
      immaginiBase64.push(base64String);
  }

  console.log("✅ Immagini ridimensionate e convertite in Base64:", immaginiBase64);

  const { data, error } = await supabase
      .from('manutenzione_task')
      .insert([{ 
          locale: userLocale, 
          titolo: titoloInput.value, 
          descrizione: descrizioneInput.value, 
          stato: "aperta",
          foto: immaginiBase64
      }]);

  if (error) {
      console.error("❌ Errore nell'inserimento della task:", error);
      return;
  }

  console.log("✅ Task aggiunta con successo:", data);

  titoloInput.value = "";
  descrizioneInput.value = "";
  immaginiInput.value = ""; 

  caricaTaskManutenzione();
}


async function caricaTaskManutenzione() {
  console.log("🟡 Caricamento task di manutenzione per locale:", userLocale);

  const { data: tasks, error } = await supabase
      .from('manutenzione_task')
      .select('*')
      .eq('locale', userLocale)
      .order('data_creazione', { ascending: false });

  if (error) {
      console.error("❌ Errore nel caricamento delle task:", error);
      return;
  }

  console.log("🔍 Task caricate:", tasks);

  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  tasks.forEach(task => {
      const taskItem = document.createElement("div");
      taskItem.classList.add("task-item");

      const taskTitle = document.createElement("h3");
      taskTitle.innerText = `${task.titolo} (${task.stato})`;

      const taskDesc = document.createElement("p");
      taskDesc.innerText = task.descrizione;

      const imgContainer = document.createElement("div");
      imgContainer.classList.add("task-images");
      task.foto.forEach(base64Img => {
          const img = document.createElement("img");
          img.src = base64Img;
          img.classList.add("task-img");
          imgContainer.appendChild(img);
      });

      const completeBtn = document.createElement("button");
      completeBtn.innerText = "Completa";
      completeBtn.onclick = () => completaTask(task.id);

      if (userPrivilege !== "manutenzione") {
        const deleteBtn = document.createElement("button");
        deleteBtn.innerText = "Elimina";
        deleteBtn.onclick = () => eliminaTask(task.id);
        taskItem.appendChild(deleteBtn);
      }

      taskItem.appendChild(taskTitle);
      taskItem.appendChild(taskDesc);
      taskItem.appendChild(imgContainer);
      taskItem.appendChild(completeBtn);

      taskList.appendChild(taskItem);
  });
}

async function completaTask(taskId) {
  const { error } = await supabase
      .from('manutenzione_task')
      .update({ stato: "completata" })
      .eq('id', taskId);

  if (error) {
      console.error("❌ Errore nel completamento della task:", error);
      return;
  }

  console.log("✅ Task completata con successo!");
  caricaTaskManutenzione();
}

async function eliminaTask(taskId) {
  const { error } = await supabase
      .from('manutenzione_task')
      .delete()
      .eq('id', taskId);

  if (error) {
      console.error("❌ Errore nell'eliminazione della task:", error);
      return;
  }

  console.log("✅ Task eliminata con successo!");
  caricaTaskManutenzione();
}

async function getResizedBase64(file, maxWidth = 800) {
  return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = function (event) {
          const img = new Image();
          img.src = event.target.result;

          img.onload = function () {
              const canvas = document.createElement("canvas");
              const ctx = canvas.getContext("2d");

              let width = img.width;
              let height = img.height;

              if (width > maxWidth) {
                  height = (maxWidth / width) * height;
                  width = maxWidth;
              }

              canvas.width = width;
              canvas.height = height;

              ctx.drawImage(img, 0, 0, width, height);

              const resizedBase64 = canvas.toDataURL("image/jpeg", 0.8);
              resolve(resizedBase64);
          };

          img.onerror = reject;
      };

      reader.onerror = reject;
  });
}

// Elementi del DOM
const container = document.getElementById('lineari-table');
const daySelector = document.getElementById('day-selector');
const saveButton = document.getElementById('save-button');

// Funzione per caricare i dati di un giorno specifico
async function loadDayData(day) {
    let { data, error } = await supabase.from('lineari').select('*').eq('giorno', day);
    if (error) {
        console.error('Errore nel caricamento:', error);
        return;
    }
    
    if (!data || data.length === 0) {
        data = Array.from({ length: 10 }, () => ({ nome: '', orario_inizio: '', orario_fine: '', reparto: '', note: '' }));
    }

    hot.loadData(data);
}

// Inizializza Handsontable per ciascuna fascia oraria
document.addEventListener('DOMContentLoaded', async () => {
  const fasce = ['mattina', 'pranzo', 'pomeriggio', 'cena', 'notte'];
  const containers = {};
  const tables = {};

  for (const fascia of fasce) {
      containers[fascia] = document.getElementById(`lineari-table-${fascia}`);
      tables[fascia] = new Handsontable(containers[fascia], {
          data: [],
          colHeaders: ['Nome', 'Orario Inizio', 'Orario Fine', 'Reparto', 'Note'],
          columns: [
              { data: 'nome', type: 'text' },
              { data: 'orario_inizio', type: 'time', timeFormat: 'HH:mm' },
              { data: 'orario_fine', type: 'time', timeFormat: 'HH:mm' },
              { data: 'reparto', type: 'text' },
              { data: 'note', type: 'text' }
          ],
          rowHeaders: true,
          filters: true,
          dropdownMenu: true,
          contextMenu: true,
          minSpareRows: 1,
          stretchH: 'all',
          height: 'auto',
          width: '100%', 
          licenseKey: 'non-commercial-and-evaluation',
      });
  }

  // Funzione per caricare i dati di un giorno specifico
  async function loadDayData(giornoSelezionato) {
      for (const fascia of fasce) {
          let { data, error } = await supabase.from('lineari').select('*').eq('giorno', giornoSelezionato).eq('fascia', fascia);
          if (error) {
              console.error(`Errore nel caricamento per ${fascia}:`, error);
              continue;
          }
          tables[fascia].loadData(data || []);
      }
  }

  // Carica i dati quando cambia il giorno selezionato
  document.getElementById('day-selector').addEventListener('change', async (event) => {
      const giornoSelezionato = event.target.value;
      await loadDayData(giornoSelezionato);
  });

  // Pulsante Salva su Supabase
  document.getElementById('save-button').addEventListener('click', async () => {
      const giornoSelezionato = document.getElementById('day-selector').value;
      if (!giornoSelezionato) {
          alert("Seleziona un giorno prima di salvare!");
          return;
      }

      for (const fascia of fasce) {
          const newData = tables[fascia].getSourceData()
              .filter(row => row.nome) // Evita di salvare righe vuote
              .map(row => ({ ...row, giorno: giornoSelezionato, fascia }));

          if (newData.length === 0) continue; // Se non ci sono dati validi, passa alla fascia successiva

          // Cancella solo i dati della fascia e giorno selezionato
          await supabase.from('lineari').delete().eq('giorno', giornoSelezionato).eq('fascia', fascia);
          const { error } = await supabase.from('lineari').insert(newData);

          if (error) {
              console.error(`Errore nel salvataggio per ${fascia}:`, error);
              alert(`Errore nel salvataggio per ${fascia}: ${error.message}`);
          }
      }

      alert("Dati salvati con successo!");
  });

  // Caricare i dati del giorno iniziale
  const giornoIniziale = document.getElementById('day-selector').value;
  await loadDayData(giornoIniziale);
});

// Carica i dati quando cambia il giorno selezionato
daySelector.addEventListener('change', (event) => {
    loadDayData(event.target.value);
});

// Salvataggio su Supabase
saveButton.addEventListener('click', async () => {
  let newData = hot.getSourceData()
      .filter(row => row.nome && row.orario_inizio && row.orario_fine && row.reparto); // Filtra righe incomplete

  if (newData.length === 0) {
      alert("Nessun dato valido da salvare. Controlla che tutte le righe siano compilate!");
      return;
  }

  // Aggiunge il giorno alla riga prima di salvare
  newData = newData.map(row => ({ ...row, giorno: daySelector.value }));

  // Cancella e aggiorna i dati in Supabase
  await supabase.from('lineari').delete().eq('giorno', daySelector.value);
  const { error } = await supabase.from('lineari').insert(newData);

  if (error) {
      console.error('Errore nel salvataggio:', error);
      alert("Errore nel salvataggio: " + error.message);
  } else {
      alert("Dati salvati con successo!");
  }
});

// Pulsante per cancellare tutti i dati del giorno selezionato
document.getElementById('delete-button').addEventListener('click', async () => {
  const giornoSelezionato = document.getElementById('day-selector').value;
  if (!giornoSelezionato) {
      alert("Seleziona un giorno prima di cancellare!");
      return;
  }

  const confirmDelete = confirm(`Sei sicuro di voler cancellare tutti i dati di ${giornoSelezionato}?`);
  if (!confirmDelete) return;

  await supabase.from('lineari').delete().eq('giorno', giornoSelezionato);
  alert(`Tutti i dati di ${giornoSelezionato} sono stati cancellati.`);
  await loadDayData(giornoSelezionato);
});

// Carica i dati del primo giorno all'avvio
document.addEventListener('DOMContentLoaded', () => {
    loadDayData(daySelector.value);
});







