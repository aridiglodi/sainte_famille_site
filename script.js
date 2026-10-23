/*
 * CONFIGURATION RAPIDE
 * 1) Remplacez les champs ci-dessous par les informations officielles.
 * 2) Pour recevoir les inscriptions automatiquement, configurez GOOGLE_FORM_ACTION
 *    et les champs d'entrée Google Forms (voir README.md).
 * 3) Sans configuration Google Forms, le formulaire prépare un message WhatsApp
 *    et ne prétend pas avoir enregistré la réponse.
 */
const CONFIG = {
  eventDateTime: "", // Exemple : "2026-12-20T10:00:00+03:00" (format ISO avec fuseau)
  displayDate: "À compléter",
  displayTime: "À compléter",
  venue: "À compléter",
  address: "",
  organizer: "À compléter",
  contact: "",
  whatsappNumber: "", // Indicatif international, chiffres seulement. Exemple Uganda : 2567XXXXXXXX
  googleFormAction: "", // URL d'envoi Google Forms, se terminant généralement par /formResponse
  googleFormFields: {
    name: "", category: "", participation: "", companions: "", contact: ""
  }
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function setEventText(key, value) {
  $$(`[data-event="${key}"]`).forEach(el => { el.textContent = value || "À compléter"; });
}
function configureEventInfo() {
  setEventText("date", CONFIG.displayDate);
  setEventText("time", CONFIG.displayTime);
  setEventText("venue", CONFIG.venue);
  $("#organizer-display").textContent = CONFIG.organizer || "À compléter";
  $("#contact-display").textContent = CONFIG.contact || "Facultatif — à compléter";
  $("#address-display").textContent = CONFIG.address || "Adresse à compléter";

  const mapLink = $("#maps-link");
  if (CONFIG.address.trim()) {
    mapLink.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(CONFIG.address);
    mapLink.setAttribute("aria-disabled", "false");
  } else {
    mapLink.href = "#";
    mapLink.setAttribute("aria-disabled", "true");
  }
}

function updateCountdown() {
  const status = $("#countdown-status");
  const target = CONFIG.eventDateTime ? new Date(CONFIG.eventDateTime).getTime() : NaN;
  if (!Number.isFinite(target)) {
    ["days", "hours", "minutes", "seconds"].forEach(id => $("#" + id).textContent = "--");
    status.textContent = "Date de l’événement à configurer.";
    return;
  }
  const difference = target - Date.now();
  if (difference <= 0) {
    ["days", "hours", "minutes", "seconds"].forEach(id => $("#" + id).textContent = "00");
    status.textContent = "Le grand jour est arrivé — vive Sainte-Famille !";
    return;
  }
  const totalSeconds = Math.floor(difference / 1000);
  $("#days").textContent = String(Math.floor(totalSeconds / 86400)).padStart(2, "0");
  $("#hours").textContent = String(Math.floor((totalSeconds % 86400) / 3600)).padStart(2, "0");
  $("#minutes").textContent = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  $("#seconds").textContent = String(totalSeconds % 60).padStart(2, "0");
  status.textContent = "Chaque seconde nous rapproche des retrouvailles !";
}

function shareMessage() {
  return `⚽ ${CONFIG.venue && CONFIG.venue !== "À compléter" ? CONFIG.venue + " — " : ""}La Grande Rencontre des Générations du Collège Sainte-Famille !\n\n« Une seule école, plusieurs générations, une même famille ! »\nDate : ${CONFIG.displayDate}\nHeure : ${CONFIG.displayTime}\nLieu : ${CONFIG.venue}\n\nRetrouvailles, football amical, joie et fraternité. Venez partager cette invitation !`;
}
function shareWhatsApp() {
  const url = "https://wa.me/?text=" + encodeURIComponent(shareMessage());
  window.open(url, "_blank", "noopener,noreferrer");
}
$("#whatsapp-share").addEventListener("click", shareWhatsApp);
$("#footer-whatsapp").addEventListener("click", shareWhatsApp);

$("#copy-link").addEventListener("click", async () => {
  const status = $("#copy-link");
  try {
    await navigator.clipboard.writeText(window.location.href);
    status.textContent = "Lien copié ✓";
  } catch {
    const field = document.createElement("textarea");
    field.value = window.location.href;
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    const copied = document.execCommand("copy");
    field.remove();
    status.textContent = copied ? "Lien copié ✓" : "Copiez le lien depuis la barre d’adresse";
  }
  window.setTimeout(() => status.textContent = "Copier le lien", 2600);
});

const intro = $("#intro");
const site = $("#site");
$("#enter-button").addEventListener("click", () => {
  site.hidden = false;
  document.body.classList.remove("no-scroll");
  intro.classList.add("exit");
  window.setTimeout(() => intro.remove(), 750);
  window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
});
document.body.classList.add("no-scroll");

const menuToggle = $("#menu-toggle");
const nav = $("#nav");
menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Fermer le menu" : "Ouvrir le menu");
  menuToggle.textContent = isOpen ? "✕" : "☰";
});
$$(".nav a").forEach(link => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Ouvrir le menu");
  menuToggle.textContent = "☰";
}));

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if ("IntersectionObserver" in window && !reduceMotion) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  $$(".reveal").forEach(el => observer.observe(el));
} else {
  $$(".reveal").forEach(el => el.classList.add("visible"));
}

function encodeGoogleEntry(value) { return value; }
$("#registration-form").addEventListener("submit", async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const status = $("#form-status");
  const data = Object.fromEntries(new FormData(form).entries());
  const companions = Math.max(0, Number(data.companions || 0));
  data.companions = String(companions);
  status.textContent = "";
  const formConfigured = CONFIG.googleFormAction &&
    ["name", "category", "participation", "companions", "contact"].every(key => CONFIG.googleFormFields[key]);

  if (formConfigured) {
    const payload = new URLSearchParams();
    Object.entries(CONFIG.googleFormFields).forEach(([key, entry]) => payload.set(entry, encodeGoogleEntry(data[key] || "")));
    try {
      await fetch(CONFIG.googleFormAction, { method: "POST", mode: "no-cors", body: payload });
      status.textContent = "L’envoi a été lancé, mais le navigateur ne permet pas de vérifier ici si Google Forms l’a bien reçu. Vérifiez les réponses dans Google Forms avant de considérer l’inscription comme confirmée.";
      form.reset();
    } catch {
      status.textContent = "L’envoi automatique a échoué. Vous pouvez envoyer les informations via WhatsApp.";
      openRegistrationWhatsApp(data);
    }
  } else {
    status.textContent = "Le formulaire n’est pas encore connecté. Votre inscription n’a pas été enregistrée : ouvrez WhatsApp pour transmettre vos informations.";
    openRegistrationWhatsApp(data);
  }
});

function openRegistrationWhatsApp(data) {
  const message = `Bonjour, je souhaite participer à la Grande Rencontre des Générations du Collège Sainte-Famille.\nNom : ${data.name}\nCatégorie : ${data.category}\nParticipation : ${data.participation}\nAccompagnants : ${data.companions || "0"}\nContact : ${data.contact || "Non renseigné"}`;
  const number = CONFIG.whatsappNumber.replace(/\D/g, "");
  const url = number ? `https://wa.me/${number}?text=${encodeURIComponent(message)}` : `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

$("#year").textContent = new Date().getFullYear();
configureEventInfo();
updateCountdown();
window.setInterval(updateCountdown, 1000);
