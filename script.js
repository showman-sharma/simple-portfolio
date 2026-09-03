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