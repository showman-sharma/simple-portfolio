const projects = [
  {
    title: "Drug–Adverse Event Reasoner",
    category: "research",
    description: "A multi-source biomedical reasoning system combining RxNorm normalization, CADEC, the Ontology of Adverse Events, SapBERT, FAISS and interpretable graph-path evidence.",
    tags: ["Knowledge Graphs", "Biomedical NLP", "SapBERT", "FAISS"],
    github: "https://github.com/showman-sharma/drug_ae_reasoner"
  },
  {
    title: "Code Generation Research",
    category: "research",
    description: "HumanEval experimentation across structured reasoning, self-consistency, planning, self-refinement, recursive criticism and test-based enhancement.",
    tags: ["LLM Evaluation", "HumanEval", "Inference-time", "Reasoning"],
    github: "https://github.com/showman-sharma/codegen-ui-research"
  },
  {
    title: "Agentic RAG",
    category: "systems",
    description: "A modular retrieval system with document loading, chunking, embeddings, FAISS retrieval, provider abstraction and a LangGraph-based agentic workflow.",
    tags: ["RAG", "LangGraph", "FAISS", "LLM Systems"],
    github: "https://github.com/showman-sharma/agentic_rag"
  },
  {
    title: "Bio-inspired Similarity Search & Clustering",
    category: "ml",
    description: "Experiments extending bio-inspired learning into similarity search and mean-shifted clustering, including an application to fake-news classification.",
    tags: ["Unsupervised Learning", "BioHash", "Clustering", "NLP"],
    github: "https://github.com/showman-sharma/Bio-inspired-clustering"
  },
  {
    title: "Gradient Ascent Syndicate",
    category: "community",
    description: "An open-source effort to build a comprehensive, implementation-first AI/ML curriculum spanning mathematical foundations, classical ML, deep learning, LLMs and agents.",
    tags: ["Open Source", "Education", "AI/ML", "Community"],
    github: "https://github.com/gradient-ascent-syndicate/machine-learning-curriculum"
  },
  {
    title: "AI/ML Newsletter Automation",
    category: "systems",
    description: "An end-to-end agentic content workflow that collects AI news and research, synthesizes with LLMs, formats output and automates publishing through GitHub Actions.",
    tags: ["Automation", "LLMs", "GitHub Actions", "Publishing"],
    github: "https://github.com/showman-sharma/ai_blog_workflow"
  },
  {
    title: "Whitepapers on Enterprise AI",
    category: "research",
    description: "Long-form, reference-backed analysis on agents, banking AI, revenue management, responsible AI and the architecture of enterprise intelligence systems.",
    tags: ["Enterprise AI", "Agents", "Writing", "Architecture"],
    github: "https://github.com/showman-sharma/whitepapers"
  },
  {
    title: "GPT from Scratch — Learning Artifact",
    category: "ml",
    description: "A transparent educational implementation journey from neural-network primitives through attention, transformers, tokenization, KV cache and a working GPT.",
    tags: ["Transformers", "PyTorch", "Attention", "Education"],
    github: "https://github.com/showman-sharma/neetcode-gpt"
  }
];

const grid = document.getElementById("project-grid");

function renderProjects(filter = "all") {
  const visible = filter === "all" ? projects : projects.filter(p => p.category === filter);
  grid.innerHTML = visible.map((p, i) => `
    <article class="project-card reveal visible" data-category="${p.category}">
      <span class="project-index">${String(i + 1).padStart(2, "0")} / ${p.category.toUpperCase()}</span>
      <div class="project-links"><a href="${p.github}" target="_blank" rel="noreferrer">GitHub ↗</a></div>
      <h3>${p.title}</h3>
      <p>${p.description}</p>
      <div class="tags">${p.tags.map(tag => `<span class="tag">${tag}</span>`).join("")}</div>
    </article>`).join("");
}
renderProjects();

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
themeToggle.addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
  document.documentElement.dataset.theme = next;
  localStorage.setItem("portfolio-theme", next);
});

document.getElementById("year").textContent = new Date().getFullYear();

const glow = document.getElementById("cursor-glow");
window.addEventListener("pointermove", e => {
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

// --- Guardrailed dynamic portfolio layer ---------------------------------
// Only explicitly allowlisted public-facing fields are rendered.
// All values are inserted with textContent, never innerHTML.
const FIELD_LIMITS = {
  focus: 90,
  question: 180,
  milestone: 160
};

function safeText(value, maxLength) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > maxLength) return null;
  return trimmed;
}

async function loadPortfolioState() {
  try {
    const response = await fetch("data/portfolio-state.json", { cache: "no-store" });
    if (!response.ok) return;
    const data = await response.json();
    if (data.schema_version !== 1 || !data.current) return;

    const mappings = [
      ["focus", "current-focus"],
      ["question", "current-question"],
      ["milestone", "current-milestone"]
    ];

    mappings.forEach(([field, id]) => {
      const value = safeText(data.current[field], FIELD_LIMITS[field]);
      const el = document.getElementById(id);
      if (value && el) el.textContent = value;
    });

    const updated = safeText(data.last_updated, 10);
    const updatedEl = document.getElementById("state-updated");
    if (updated && /^\d{4}-\d{2}-\d{2}$/.test(updated) && updatedEl) {
      updatedEl.textContent = `Public focus updated ${updated}`;
    }
  } catch (_) {
    // Static HTML fallbacks remain visible if the data file is unavailable.
  }
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
    const active = data.occasions.find(o =>
      o && o.enabled === true &&
      /^\d{4}-\d{2}-\d{2}$/.test(o.start || "") &&
      /^\d{4}-\d{2}-\d{2}$/.test(o.end || "") &&
      today >= o.start && today <= o.end &&
      seasonalThemes[o.theme]
    );
    if (!active) return;

    const label = safeText(active.label, 60);
    const greeting = document.getElementById("seasonal-greeting");
    const regular = document.getElementById("hero-eyebrow");
    if (label && greeting) {
      greeting.textContent = `${label} · `;
      greeting.hidden = false;
    }
    if (regular) regular.textContent = "Hyderabad · AI systems · research · engineering";

    const palette = seasonalThemes[active.theme];
    document.documentElement.style.setProperty("--yellow", palette.yellow);
    document.documentElement.style.setProperty("--pink", palette.pink);
    document.documentElement.style.setProperty("--orange", palette.orange);
  } catch (_) {
    // Seasonal treatment is optional; the base portfolio is always the fallback.
  }
}

// --- Writing index -------------------------------------------------------
// Writing may link to LinkedIn, Substack/other public blogs, or portfolio-native
// articles. The renderer rejects malformed records and unsafe URLs.
const ARTICLE_LIMITS = {
  title: 140,
  source: 30,
  summary: 240,
  tag: 32
};

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

function formatArticleDate(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || "")) return "";
  const [y, m, d] = date.split("-").map(Number);
  const parsed = new Date(y, m - 1, d);
  return parsed.toLocaleDateString("en", { year: "numeric", month: "short", day: "numeric" });
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
      const tagEl = document.createElement("span");
      tagEl.className = "tag";
      tagEl.textContent = clean;
      tags.appendChild(tagEl);
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
  const grid = document.getElementById("writing-grid");
  if (!grid) return;
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

    if (!valid.length) return;
    grid.replaceChildren(...valid);
  } catch (_) {
    // Keep the static fallback card if the index cannot be loaded.
  }
}

loadPortfolioState();
loadSeasonalLayer();
loadWriting();