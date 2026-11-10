// main script

// --- Active nav link ---
// Highlights the nav link whose section is currently in view.
const navLinks = document.querySelectorAll(".nav a");
const trackedSections = document.querySelectorAll("#home, section[id]");

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) =>
        link.classList.toggle(
          "is-active",
          link.getAttribute("href") === `#${entry.target.id}`,
        ),
      );
    });
  },
  { rootMargin: "-40% 0px -55% 0px" },
);

trackedSections.forEach((section) => navObserver.observe(section));

// --- Projects ---
const projects = [
  {
    id: "currency-api",
    title: "Currency Converter API",
    description:
      "Integration API that converts amounts between currencies using exchange rates from an external API.",
    summary:
      "A backend API that converts values between currencies. It fetches exchange rates from AwesomeAPI and returns the converted amount through a single endpoint.",
    features: [
      "The controller receives the request with the currencies and amount",
      "The service calls AwesomeAPI to fetch the current exchange rate",
      "Invalid requests or unknown currency pairs return a JSON error with the appropriate HTTP status",
    ],
    category: "backend",
    status: "completed",
    tags: ["Java", "Spring Boot", "Maven", "Lombok", "AwesomeAPI"],
    cover: "assets/images/projects/currency-converter-api.jpg",
    repo: "https://github.com/JuliaDeconto/currency-converter-api",
    live: null,
    demo: {
      type: "terminal",
      steps: [
        {
          cmd: 'curl "http://localhost:8080/convert?from=USD&to=BRL&amount=100"',
          out: `{
                "from": "USD",
                "to": "BRL",
                "rate": 5.505,
                "amount": 100,
                "result": 550.5
                }`,
        },
        {
          cmd: 'curl "http://localhost:8080/convert?from=USD&to=XXX&amount=100"',
          out: `{
                "status": 404,
                "message": "Currency pair not found"
                }`,
        },
      ],
    },
  },
  {
    id: "portfolio",
    title: "This Portfolio",
    description:
      "The site you are on: plain HTML, CSS and JavaScript with a terminal-inspired look.",
    summary:
      "A responsive portfolio built without frameworks, focused on accessibility and a terminal-inspired look.",
    features: [
      "Semantic HTML and keyboard-friendly navigation",
      "Design tokens and CSS Grid layouts",
      "Vanilla JavaScript for filters, modal and effects",
    ],
    category: "frontend",
    status: "completed",
    tags: ["HTML", "CSS", "JavaScript"],
    cover: "assets/images/projects/my-portfolio.jpg",
    repo: "https://github.com/JuliaDeconto/my-portfolio",
    live: null,
    demo: { type: "iframe", src: "index.html" },
  },
];

const grid = document.getElementById("projects-grid");
const count = document.getElementById("projects-count");

const cardTemplate = (project, index) => `
  <article class="project" style="--i:${index}">
    <div class="project__cover">
      <img src="${project.cover}" alt="${project.title} cover" loading="lazy">
      <span class="project_status project__status--${project.status === "completed" ? "done" : "wip"}">${project.status}</span>
    </div>
    <div class="project__content">
      <h3 class="project__name">${project.title}</h3>
      <p class="project__desc">${project.description}</p>
      <ul class="project__tags">${project.tags.map((tag) => `<li>${tag}</li>`).join("")}</ul>
      <div class="project__actions">
        <button class="btn btn--primary" type="button" data-view="${project.id}">view project</button>
        <a class="btn" href="${project.repo}" target="_blank" rel="noopener">code ↗️</a>
      </div>
    </div>
  </article>`;

const renderProjects = (list) => {
  grid.innerHTML = list.map(cardTemplate).join("");
  count.textContent = `${list.length} result${list.length === 1 ? "" : "s"}`;
};

// Show a placeholder when a cover image is missing.
grid.addEventListener(
  "error",
  (event) => {
    if (event.target.tagName === "IMG")
      event.target.parentElement.classList.add("is-empty");
  },
  true,
);

renderProjects(projects);

// --- Projects: filters ---
const filterButtons = document.querySelectorAll(".filters__btn");
const filterFlag = document.getElementById("projects-flag");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((other) => {
      const isActive = other === button;
      other.classList.toggle("is-active", isActive);
      other.setAttribute("aria-pressed", String(isActive));
    });

    filterFlag.textContent = `--filter=${filter}`;
    renderProjects(
      filter === "all"
        ? projects
        : projects.filter((p) => p.category === filter),
    );
  });
});

// --- Projects: tilt and spotlight ---
// Only on devices with a real pointer and when motion is allowed.
const canTilt = window.matchMedia(
  "(hover: hover) and (prefers-reduced-motion: no-preference)",
).matches;

if (canTilt) {
  grid.addEventListener("pointermove", (event) => {
    const card = event.target.closest(".project");
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    card.style.setProperty("--mx", `${x * 100}%`);
    card.style.setProperty("--my", `${y * 100}%`);
    card.style.setProperty("--ry", `${(x - 0.5) * 10}deg`);
    card.style.setProperty("--rx", `${(0.5 - y) * 10}deg`);
  });

  grid.addEventListener("pointerout", (event) => {
    const card = event.target.closest(".project");
    if (!card || card.contains(event.relatedTarget)) return;

    card.style.setProperty("--rx", "0deg");
    card.style.setProperty("--ry", "0deg");
  });
}

// --- About photo fallback ---
// Shows a placeholder when the portrait image is missing or fails to load.
const aboutPhoto = document.getElementById("about-photo");
const aboutImg = aboutPhoto?.querySelector("img");

if (aboutImg) {
  const showPlaceholder = () => aboutPhoto.classList.add("is-placeholder");

  if (aboutImg.complete && aboutImg.naturalWidth === 0) showPlaceholder();
  aboutImg.addEventListener("error", showPlaceholder);
}
