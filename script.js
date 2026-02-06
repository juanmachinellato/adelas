// ===== Menu mobile =====
const burger = document.getElementById("burger");
const nav = document.getElementById("nav");
const header = document.getElementById("header");

if (burger && nav) {
  burger.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", open ? "true" : "false");
  });

  nav.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      nav.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
    });
  });
}

// ===== Header solid on scroll =====
window.addEventListener("scroll", () => {
  const y = window.scrollY || 0;
  if (y > 18) header.classList.add("header--solid");
  else header.classList.remove("header--solid");
}, { passive: true });

// ===== Reveal (stagger) =====
const revealEls = document.querySelectorAll(".reveal");
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;

    // Stagger: demora por orden visual
    const delay = Math.min(240, Array.from(revealEls).indexOf(e.target) * 18);
    e.target.style.transitionDelay = `${delay}ms`;
    e.target.classList.add("is-visible");
    io.unobserve(e.target);
  });
}, { threshold: 0.12 });

revealEls.forEach(el => io.observe(el));

// ===== Parallax suave para HERO =====
const parallaxEls = document.querySelectorAll("[data-parallax]");
function onScrollParallax() {
  const y = window.scrollY || 0;
  parallaxEls.forEach(el => {
    const strength = Number(el.getAttribute("data-parallax")) || 0.2;
    el.style.transform = `translateY(${y * strength}px) scale(1.06)`;
  });
}
window.addEventListener("scroll", onScrollParallax, { passive: true });
onScrollParallax();

// ===== Menu filtering + search =====
const tabs = document.getElementById("tabs");
const menuGrid = document.getElementById("menuGrid");
const searchInput = document.getElementById("searchInput");

let activeFilter = "all";
let searchTerm = "";

function normalize(s){
  return (s || "")
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function applyFilters(){
  const blocks = menuGrid.querySelectorAll(".menuBlock");

  blocks.forEach(block => {
    const cat = block.getAttribute("data-cat");
    const text = normalize(block.innerText);

    const catOk = (activeFilter === "all") || (cat === activeFilter);
    const searchOk = !searchTerm || text.includes(searchTerm);

    block.style.display = (catOk && searchOk) ? "" : "none";
  });
}

if (tabs) {
  tabs.addEventListener("click", (e) => {
    const btn = e.target.closest(".tab");
    if (!btn) return;

    tabs.querySelectorAll(".tab").forEach(t => t.classList.remove("is-active"));
    btn.classList.add("is-active");

    activeFilter = btn.dataset.filter || "all";
    applyFilters();
  });
}

if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    searchTerm = normalize(e.target.value);
    applyFilters();
  });
}

// ===== Smooth scroll #top (evita saltos) =====
document.addEventListener("click", (e) => {
  const a = e.target.closest('a[href="#top"]');
  if (!a) return;
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
  history.replaceState(null, "", "#top");
});