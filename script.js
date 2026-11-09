"use strict";

const typewriter = document.getElementById("typewriter");
const themeToggle = document.querySelector(".theme-toggle");
const body = document.body;
const navLinks = document.getElementById("nav-links");
const menuToggle = document.querySelector(".menu-toggle");
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

const phrases = [
  "Student & Aspiring Developer",
  "Learning Web Development",
  "Building with Python",
  "Passionate about Tech"
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function setTheme(theme) {
  const isLight = theme === "light";
  body.classList.toggle("theme-light", isLight);
  body.classList.toggle("theme-dark", !isLight);
  if (themeToggle) {
    themeToggle.querySelector(".toggle-thumb").textContent = isLight ? "☾" : "☀";
    themeToggle.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
  }
}

function toggleTheme() {
  const isLight = body.classList.contains("theme-light");
  setTheme(isLight ? "dark" : "light");
  localStorage.setItem("portfolio-theme", isLight ? "dark" : "light");
}

if (themeToggle) {
  const savedTheme = localStorage.getItem("portfolio-theme");
  const preferred = savedTheme || (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
  setTheme(preferred);
  themeToggle.addEventListener("click", toggleTheme);
}

function typeLoop() {
  if (!typewriter) return;
  const currentText = phrases[phraseIndex];

  if (isDeleting) {
    typewriter.textContent = currentText.substring(0, charIndex--);
  } else {
    typewriter.textContent = currentText.substring(0, charIndex++);
  }

  if (!isDeleting && charIndex > currentText.length) {
    isDeleting = true;
    setTimeout(typeLoop, 1100);
    return;
  }

  if (isDeleting && charIndex < 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    charIndex = 0;
  }

  const speed = isDeleting ? 55 : 90;
  setTimeout(typeLoop, speed);
}

typeLoop();

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
    navLinks.classList.toggle("is-open");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const year = document.getElementById("current-year");
if (year) year.textContent = new Date().getFullYear();

const revealItems = document.querySelectorAll(".skill-card, .timeline-item, .project-card, .mini-card, .contact-form, .about-copy");
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => {
    item.classList.add("reveal");
    observer.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const fields = [...contactForm.querySelectorAll("input, textarea")];
    let hasError = false;

    fields.forEach((field) => {
      field.setAttribute("aria-invalid", "false");
      if (!field.value.trim() || (field.type === "email" && !field.checkValidity())) {
        field.setAttribute("aria-invalid", "true");
        hasError = true;
      }
    });

    if (hasError) {
      formStatus.textContent = "Please complete every field with valid information before sending.";
      formStatus.style.color = "#fca5a5";
      const firstInvalid = fields.find((field) => field.getAttribute("aria-invalid") === "true");
      firstInvalid?.focus();
      return;
    }

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();
    const mailto = `mailto:abubakarirfan110@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent([`Name: ${name}`, `Email: ${email}`, "", message].join("\n"))}`;

    formStatus.textContent = "Your email app is opening with your message ready.";
    formStatus.style.color = "var(--accent)";
    window.location.href = mailto;
  });
}
