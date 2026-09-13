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
  card.className = "project-card";
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
    if (updated && /^\d{4}-\d{2}-\d{2}$/.test(updated) && updatedEl) {
      updatedEl.textContent = `Public focus updated ${updated}`;
    }
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
  const sourceEl = document.createElement("span");
  sourceEl.textContent = source;
  const dateEl = document.createElement("span");
  dateEl.textContent = date;
  meta.append(sourceEl, dateEl);

  const heading = document.createElement("h3");
  heading.textContent = title;
  const description = document.createElement("p");
  description.textContent = summary;

  const tags = document.createElement("div");
  tags.className = "tags";
  if (Array.isArray(article.tags)) {
    article.tags.slice(0, 4).forEach(tag => {
      const clean = safeText(tag, ARTICLE_LIMITS.tag);
      if (!clean) return;
      const el = document.createElement("span");
      el.className = "tag";
      el.textContent = clean;
      tags.appendChild(el);
    });
  }

  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.rel = "noreferrer";
  link.className = "writing-link";
  link.textContent = `Read on ${source} ↗`;
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
    const valid = data.articles
      .filter(a => a && a.published !== false)
      .sort((a, b) => String(b.date).localeCompare(String(a.date)))
      .slice(0, 6)
      .map(makeArticleCard)
      .filter(Boolean);
    if (valid.length) writingGrid.replaceChildren(...valid);
  } catch (_) {}
}

// Light / night mode --------------------------------------------------------
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = themeToggle?.querySelector("span");
const themeMeta = document.querySelector('meta[name="theme-color"]');

function preferredTheme() {
  const saved = localStorage.getItem("portfolio-theme");
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme, persist = false) {
  document.documentElement.dataset.theme = theme;
  if (persist) localStorage.setItem("portfolio-theme", theme);
  if (themeIcon) themeIcon.textContent = theme === "dark" ? "☀" : "☾";
  if (themeToggle) {
    const next = theme === "dark" ? "light" : "night";
    themeToggle.setAttribute("aria-label", `Switch to ${next} mode`);
    themeToggle.title = `Switch to ${next} mode`;
  }
  if (themeMeta) themeMeta.setAttribute("content", theme === "dark" ? "#0f0e0d" : "#efe8dc");
}

applyTheme(preferredTheme());
themeToggle?.addEventListener("click", () => {
  const current = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  applyTheme(current === "dark" ? "light" : "dark", true);
});

// Chapter navigation --------------------------------------------------------
const chapterPages = Array.from(document.querySelectorAll(".book-page"));
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function pageForHash(hash) {
  if (!hash || !hash.startsWith("#")) return null;
  return document.querySelector(hash);
}

function turnTo(target) {
  if (!target) return;
  const current = chapterPages.find(page => {
    const rect = page.getBoundingClientRect();
    return rect.top <= window.innerHeight * .35 && rect.bottom >= window.innerHeight * .35;
  });

  if (reducedMotion.matches) {
    target.scrollIntoView({ behavior: "auto", block: "start" });
    return;
  }

  current?.classList.add("page-exit");
  window.setTimeout(() => {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    target.classList.add("page-enter");
    window.setTimeout(() => {
      current?.classList.remove("page-exit");
      target.classList.remove("page-enter");
    }, 620);
  }, 110);
}

document.querySelectorAll("[data-chapter-link]").forEach(link => {
  link.addEventListener("click", event => {
    const hash = link.getAttribute("href");
    const target = pageForHash(hash);
    if (!target) return;
    event.preventDefault();
    history.pushState(null, "", hash);
    turnTo(target);
  });
});

function nearestPageIndex() {
  const center = window.innerHeight * .42;
  let best = 0;
  let distance = Infinity;
  chapterPages.forEach((page, i) => {
    const rect = page.getBoundingClientRect();
    const d = Math.abs(rect.top - center);
    if (d < distance) { distance = d; best = i; }
  });
  return best;
}

document.addEventListener("keydown", event => {
  if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
  const tag = document.activeElement?.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || tag === "BUTTON") return;
  if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
  const index = nearestPageIndex();
  const next = event.key === "ArrowRight" ? index + 1 : index - 1;
  if (next < 0 || next >= chapterPages.length) return;
  event.preventDefault();
  const target = chapterPages[next];
  history.pushState(null, "", `#${target.id}`);
  turnTo(target);
});

window.addEventListener("popstate", () => {
  const target = pageForHash(location.hash);
  if (target) target.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "start" });
});

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

loadProjects();
loadPortfolioState();
loadWriting();
