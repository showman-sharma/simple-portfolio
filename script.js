const grid = document.getElementById("project-grid");
let projects = [];

function safeText(value, maxLength) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > maxLength) return null;
  return trimmed;
}

function safePublicUrl(value) {
  if (typeof value !== "string" || value.length > 500) return null;
  try {
    const url = new URL(value, window.location.href);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return url.href;
  } catch (_) {
    return null;
  }
}

function projectCard(project, index) {
  const title = safeText(project.title, 120);
  const category = safeText(project.category, 24);
  const description = safeText(project.description, 320);
  const github = safePublicUrl(project.github);
  if (!title || !category || !description || !github) return null;

  const card = document.createElement("article");
  card.className = "project-card reveal visible";
  card.dataset.category = category;

  const idx = document.createElement("span");
  idx.className = "project-index";
  idx.textContent = `${String(index + 1).padStart(2, "0")} / ${category.toUpperCase()}`;

  const links = document.createElement("div");
  links.className = "project-links";
  const link = document.createElement("a");
  link.href = github;
  link.target = "_blank";
  link.rel = "noreferrer";
  link.textContent = "GitHub ↗";
  links.appendChild(link);

  const heading = document.createElement("h3");
  heading.textContent = title;
  const body = document.createElement("p");
  body.textContent = description;

  const tags = document.createElement("div");
  tags.className = "tags";
  if (Array.isArray(project.tags)) {
    project.tags.slice(0, 5).forEach(tag => {
      const clean = safeText(tag, 32);
      if (!clean) return;
      const el = document.createElement("span");
      el.className = "tag";
      el.textContent = clean;
      tags.appendChild(el);
    });
  }

  card.append(idx, links, heading, body, tags);
  return card;
}

function renderProjects(filter = "all") {
  if (!grid) return;
  const visible = filter === "all" ? projects : projects.filter(p => p.category === filter);
  const cards = visible.map(projectCard).filter(Boolean);
  if (cards.length) grid.replaceChildren(...cards);
}

async function loadProjects() {
  if (!grid) return;
  try {
    const response = await fetch("data/projects.json", { cache: "no-store" });
    if (!response.ok) return;
    const data = await response.json();
    if (data.schema_version !== 1 || !Array.isArray(data.projects)) return;
    projects = data.projects.filter(Boolean);
    renderProjects();
  } catch (_) {
    grid.textContent = "Selected work is temporarily unavailable.";
  }
}

document.querySelectorAll(".filter").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderProjects(btn.dataset.filter);
  });
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add("visible"); });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

const themeToggle = document.getElementById("theme-toggle");
const savedTheme = localStorage.getItem("portfolio-theme");
if (savedTheme) document.documentElement.dataset.theme = savedTheme;
if (themeToggle) themeToggle.addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
  document.documentElement.dataset.theme = next;
  localStorage.setItem("portfolio-theme", next);
});

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

const glow = document.getElementById("cursor-glow");
window.addEventListener("pointermove", e => {
  if (!glow) return;
  glow.style.left = `${e.clientX}px`;
  glow.style.top = `${e.clientY}px`;
});

const tilt = document.querySelector(".tilt-card");
if (tilt && window.matchMedia("(min-width: 851px)").matches) {
  tilt.addEventListener("pointermove", e => {
    const r = tilt.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    tilt.style.transform = `perspective(1000px) rotateY(${x * 10 - 5}deg) rotateX(${-y * 8 + 3}deg) translateY(-4px)`;
  });
  tilt.addEventListener("pointerleave", () => {
    tilt.style.transform = "perspective(1000px) rotateY(-5deg) rotateX(3deg)";
  });
}

const FIELD_LIMITS = { focus: 90, question: 180, milestone: 160 };

async function loadPortfolioState() {
  try {
    const response = await fetch("data/portfolio-state.json", { cache: "no-store" });
    if (!response.ok) return;
    const data = await response.json();
    if (data.schema_version !== 1 || !data.current) return;
    [["focus", "current-focus"], ["question", "current-question"], ["milestone", "current-milestone"]].forEach(([field, id]) => {
      const value = safeText(data.current[field], FIELD_LIMITS[field]);
      const el = document.getElementById(id);
      if (value && el) el.textContent = value;
    });
    const updated = safeText(data.last_updated, 10);
    const updatedEl = document.getElementById("state-updated");
    if (updated && /^\d{4}-\d{2}-\d{2}$/.test(updated) && updatedEl) updatedEl.textContent = `Public focus updated ${updated}`;
  } catch (_) {}
}

const seasonalThemes = {
  warm: { yellow: "#ffcf4a", pink: "#ff7f87", orange: "#ff934d" },
  harvest: { yellow: "#ffd166", pink: "#f28482", orange: "#f6a545" },
  midnight: { yellow: "#ffe08a", pink: "#d7a6ff", orange: "#8bc6ff" }
};

function localIsoDate() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

async function loadSeasonalLayer() {
  try {
    const response = await fetch("data/seasonal.json", { cache: "no-store" });
    if (!response.ok) return;
    const data = await response.json();
    if (data.schema_version !== 1 || !Array.isArray(data.occasions)) return;
    const today = localIsoDate();
    const active = data.occasions.find(o => o && o.enabled === true && /^\d{4}-\d{2}-\d{2}$/.test(o.start || "") && /^\d{4}-\d{2}-\d{2}$/.test(o.end || "") && today >= o.start && today <= o.end && seasonalThemes[o.theme]);
    if (!active) return;
    const label = safeText(active.label, 60);
    const greeting = document.getElementById("seasonal-greeting");
    if (label && greeting) { greeting.textContent = `${label} · `; greeting.hidden = false; }
    const palette = seasonalThemes[active.theme];
    document.documentElement.style.setProperty("--yellow", palette.yellow);
    document.documentElement.style.setProperty("--pink", palette.pink);
    document.documentElement.style.setProperty("--orange", palette.orange);
  } catch (_) {}
}

const ARTICLE_LIMITS = { title: 140, source: 30, summary: 240, tag: 32 };

function formatArticleDate(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || "")) return "";
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en", { year: "numeric", month: "short", day: "numeric" });
}

function makeArticleCard(article) {
  const title = safeText(article.title, ARTICLE_LIMITS.title);
  const source = safeText(article.source, ARTICLE_LIMITS.source);
  const summary = safeText(article.summary, ARTICLE_LIMITS.summary);
  const url = safePublicUrl(article.url);
  const date = formatArticleDate(article.date);
  if (!title || !source || !summary || !url || !date) return null;

  const card = document.createElement("article");
  card.className = `writing-card${article.featured === true ? " featured" : ""}`;
  const meta = document.createElement("div");
  meta.className = "writing-meta";
  const sourceEl = document.createElement("span"); sourceEl.textContent = source;
  const dateEl = document.createElement("span"); dateEl.textContent = date;
  meta.append(sourceEl, dateEl);
  const heading = document.createElement("h3"); heading.textContent = title;
  const description = document.createElement("p"); description.textContent = summary;
  const tags = document.createElement("div"); tags.className = "tags";
  if (Array.isArray(article.tags)) article.tags.slice(0, 4).forEach(tag => {
    const clean = safeText(tag, ARTICLE_LIMITS.tag);
    if (!clean) return;
    const el = document.createElement("span"); el.className = "tag"; el.textContent = clean; tags.appendChild(el);
  });
  const link = document.createElement("a");
  link.href = url; link.target = "_blank"; link.rel = "noreferrer"; link.className = "writing-link"; link.textContent = `Read on ${source} ↗`;
  card.append(meta, heading, description, tags, link);
  return card;
}

async function loadWriting() {
  const writingGrid = document.getElementById("writing-grid");
  if (!writingGrid) return;
  try {
    const response = await fetch("data/articles.json", { cache: "no-store" });
    if (!response.ok) return;
    const data = await response.json();
    if (data.schema_version !== 1 || !Array.isArray(data.articles)) return;
    const valid = data.articles.filter(a => a && a.published !== false).sort((a, b) => String(b.date).localeCompare(String(a.date))).slice(0, 6).map(makeArticleCard).filter(Boolean);
    if (valid.length) writingGrid.replaceChildren(...valid);
  } catch (_) {}
}

loadProjects();
loadPortfolioState();
loadSeasonalLayer();
loadWriting();
