const IS_FRENCH = document.documentElement.lang.toLowerCase().startsWith("fr");
const PROJECTS_ENDPOINT = IS_FRENCH ? "/projects/projects.fr.json?v=20260901-1" : "/projects/projects.json?v=20260901-1";
const PROJECT_INDEX_PATH = IS_FRENCH ? "/fr/projects/" : "/projects/";
const SITE_ORIGIN = "https://remymoscovitz.com";
const DEFAULT_PROJECT_OG_IMAGE = "/media/og-remy-portfolio.png";
const DEFAULT_PROJECT_DESCRIPTION = IS_FRENCH
  ? "Présentation d’un projet logiciel de Remy Moscovitz."
  : "Project details from the software engineering portfolio of Remy Moscovitz.";

const UI_TEXT = IS_FRENCH ? {
  openNavigation: "Ouvrir la navigation",
  closeNavigation: "Fermer la navigation",
  viewProject: "Voir le projet",
  preview: "Aperçu",
  projectsError: "Impossible de charger les projets pour le moment. Veuillez actualiser la page.",
  livePreview: "Aperçu du site en direct",
  openWebsite: "Ouvrir le site complet ↗",
  websiteTitle: "site web",
  projectNotFound: "Projet introuvable",
  projectMissingTitle: "Ce projet n’est pas disponible.",
  projectMissingText: "Choisissez l’un des cinq projets actuels dans l’index des projets.",
  viewProjects: "Voir les projets",
  selectedProject: "Projet sélectionné",
  projectStory: "À propos du projet",
  whatIBuilt: "Ce que j’ai réalisé.",
  backToProjects: "Retour à tous les projets",
  gallery: "Galerie du projet",
  previousImage: "Image précédente",
  nextImage: "Image suivante",
  goToImage: "Afficher l’image",
  image: "Image",
  of: "sur",
  previewUnavailable: "Aperçu indisponible",
  genericError: "Un problème est survenu",
  loadErrorTitle: "Impossible de charger ce projet.",
  loadErrorText: "Veuillez actualiser la page ou revenir à l’index des projets."
} : {
  openNavigation: "Open navigation",
  closeNavigation: "Close navigation",
  viewProject: "View project",
  preview: "preview",
  projectsError: "The projects could not be loaded just now. Please refresh the page.",
  livePreview: "Live website preview",
  openWebsite: "Open full website ↗",
  websiteTitle: "website",
  projectNotFound: "Project not found",
  projectMissingTitle: "That project isn’t here.",
  projectMissingText: "Choose one of the five current projects from the project index.",
  viewProjects: "View projects",
  selectedProject: "Selected project",
  projectStory: "Project story",
  whatIBuilt: "What I built.",
  backToProjects: "Back to all projects",
  gallery: "Project gallery",
  previousImage: "Previous image",
  nextImage: "Next image",
  goToImage: "Show image",
  image: "Image",
  of: "of",
  previewUnavailable: "Preview unavailable",
  genericError: "Something went wrong",
  loadErrorTitle: "This project could not be loaded.",
  loadErrorText: "Please refresh the page or return to the project index."
};

function setupNavigation() {
  const button = document.querySelector("[data-menu-button]");
  const navigation = document.querySelector("[data-site-nav]");

  if (!button || !navigation) return;

  const closeMenu = () => {
    button.setAttribute("aria-expanded", "false");
    navigation.dataset.open = "false";
    const label = button.querySelector(".sr-only");
    if (label) label.textContent = UI_TEXT.openNavigation;
  };

  button.addEventListener("click", () => {
    const willOpen = button.getAttribute("aria-expanded") !== "true";
    button.setAttribute("aria-expanded", String(willOpen));
    navigation.dataset.open = String(willOpen);
    const label = button.querySelector(".sr-only");
    if (label) label.textContent = willOpen ? UI_TEXT.closeNavigation : UI_TEXT.openNavigation;
  });

  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

function setCurrentYear() {
  document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });
}

function setMetaContent(attribute, key, content) {
  let meta = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute(attribute, key);
    document.head.appendChild(meta);
  }
  meta.content = content;
}

function setCanonicalUrl(url) {
  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }
  canonical.href = url;
}

function publicAssetUrl(path) {
  if (typeof path !== "string" || !path.trim()) {
    return new URL(DEFAULT_PROJECT_OG_IMAGE, SITE_ORIGIN).href;
  }

  try {
    const url = new URL(path.trim(), SITE_ORIGIN);
    return ["http:", "https:"].includes(url.protocol)
      ? url.href
      : new URL(DEFAULT_PROJECT_OG_IMAGE, SITE_ORIGIN).href;
  } catch (error) {
    return new URL(DEFAULT_PROJECT_OG_IMAGE, SITE_ORIGIN).href;
  }
}

function projectPublicUrl(project) {
  const languagePrefix = IS_FRENCH ? "/fr" : "";
  return new URL(`${languagePrefix}/projects/${encodeURIComponent(project.id)}/`, SITE_ORIGIN).href;
}

function syncProjectMetadata(project) {
  const title = `${project.title || UI_TEXT.projectNotFound} — Remy Moscovitz`;
  const description = typeof project.summary === "string" && project.summary.trim()
    ? project.summary.trim()
    : DEFAULT_PROJECT_DESCRIPTION;
  const image = publicAssetUrl(project.ogImage || DEFAULT_PROJECT_OG_IMAGE);
  const imageAlt = project.ogImageAlt || project.imageAlt || `${project.title || "Project"} social preview`;
  const url = projectPublicUrl(project);

  document.title = title;
  setCanonicalUrl(url);
  setMetaContent("name", "description", description);
  setMetaContent("property", "og:type", "website");
  setMetaContent("property", "og:title", title);
  setMetaContent("property", "og:description", description);
  setMetaContent("property", "og:image", image);
  setMetaContent("property", "og:image:secure_url", image);
  setMetaContent("property", "og:image:alt", imageAlt);
  setMetaContent("property", "og:url", url);
  setMetaContent("property", "og:site_name", "Remy Moscovitz");
  setMetaContent("property", "og:locale", IS_FRENCH ? "fr_FR" : "en_US");
  setMetaContent("name", "twitter:card", "summary_large_image");
  setMetaContent("name", "twitter:title", title);
  setMetaContent("name", "twitter:description", description);
  setMetaContent("name", "twitter:image", image);
  setMetaContent("name", "twitter:image:alt", imageAlt);
}

async function fetchProjects() {
  const response = await fetch(PROJECTS_ENDPOINT, { cache: "no-cache" });
  if (!response.ok) throw new Error("Could not load project data");
  return response.json();
}

function applyImageFallback(image, container, label) {
  image.addEventListener("error", () => {
    image.remove();
    container.classList.add("project-card__media--fallback");
    container.textContent = label;
  }, { once: true });
}

function createProjectCard(project) {
  const card = document.createElement("a");
  card.className = "project-card";
  card.href = `${PROJECT_INDEX_PATH}${encodeURIComponent(project.id)}/`;
  card.setAttribute("aria-label", `${UI_TEXT.viewProject} ${project.title}`);

  const media = document.createElement("div");
  media.className = "project-card__media";
  if (Number.isFinite(project.cardImageScale)) {
    media.style.setProperty("--card-image-scale", String(project.cardImageScale));
    media.style.setProperty("--card-image-hover-scale", String(project.cardImageScale * 1.035));
  }
  if (project.imageFit === "contain") {
    media.classList.add("project-card__media--contain");
    if (project.image) media.style.setProperty("--project-image", `url("${project.image}")`);
  }

  if (project.image) {
    const image = document.createElement("img");
    image.src = project.image;
    image.alt = project.imageAlt || "";
    image.loading = "lazy";
    image.decoding = "async";
    applyImageFallback(image, media, `${UI_TEXT.preview} ${project.title}`);
    media.appendChild(image);
  } else {
    media.classList.add("project-card__media--fallback");
    media.textContent = `${UI_TEXT.preview} ${project.title}`;
  }

  const body = document.createElement("div");
  body.className = "project-card__body";

  const eyebrow = document.createElement("p");
  eyebrow.className = "project-card__eyebrow";
  eyebrow.textContent = project.eyebrow;

  const title = document.createElement("h3");
  title.textContent = project.title;

  const summary = document.createElement("p");
  summary.className = "project-card__summary";
  summary.textContent = project.summary;

  const footer = document.createElement("div");
  footer.className = "project-card__footer";
  footer.innerHTML = `<span>${project.tags.slice(0, 2).join(" · ")}</span><span class="project-card__arrow" aria-hidden="true">→</span>`;

  body.append(eyebrow, title, summary, footer);
  card.append(media, body);
  return card;
}

function createProjectCarousel(project, options = {}) {
  const images = options.images || project.preview.images;
  const carousel = document.createElement("section");
  carousel.className = "project-carousel";
  if (options.layout) carousel.classList.add(`project-carousel--${options.layout}`);
  carousel.setAttribute("aria-label", options.label || `${project.title} — ${UI_TEXT.gallery}`);

  const stage = document.createElement("div");
  stage.className = "project-carousel__stage";
  stage.dataset.errorLabel = UI_TEXT.previewUnavailable;

  const track = document.createElement("div");
  track.className = "project-carousel__track";
  track.tabIndex = 0;

  const previous = document.createElement("button");
  previous.className = "project-carousel__button project-carousel__button--previous";
  previous.type = "button";
  previous.setAttribute("aria-label", UI_TEXT.previousImage);
  previous.innerHTML = '<span aria-hidden="true">←</span>';

  const next = document.createElement("button");
  next.className = "project-carousel__button project-carousel__button--next";
  next.type = "button";
  next.setAttribute("aria-label", UI_TEXT.nextImage);
  next.innerHTML = '<span aria-hidden="true">→</span>';

  const footer = document.createElement("div");
  footer.className = "project-carousel__footer";

  const counter = document.createElement("p");
  counter.className = "project-carousel__counter";
  counter.setAttribute("aria-live", "polite");

  const dots = document.createElement("div");
  dots.className = "project-carousel__dots";
  dots.setAttribute("aria-label", UI_TEXT.gallery);

  let activeIndex = 0;
  let scrollFrame = null;

  const slides = images.map((item, index) => {
    const slide = document.createElement("figure");
    slide.className = "project-carousel__slide";
    slide.dataset.index = String(index);

    const image = document.createElement("img");
    image.src = item.src;
    image.alt = item.alt || "";
    image.decoding = "async";
    image.loading = index === 0 ? "eager" : "lazy";
    image.addEventListener("error", () => {
      slide.classList.add("project-carousel__slide--error");
      slide.dataset.errorLabel = UI_TEXT.previewUnavailable;
      image.remove();
    }, { once: true });

    slide.appendChild(image);
    track.appendChild(slide);
    return slide;
  });

  const dotButtons = images.map((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `${UI_TEXT.goToImage} ${index + 1}`);
    dot.addEventListener("click", () => showImage(index));
    dots.appendChild(dot);
    return dot;
  });

  function updateStatus() {
    counter.textContent = `${UI_TEXT.image} ${activeIndex + 1} ${UI_TEXT.of} ${images.length}`;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("project-carousel__slide--active", slideIndex === activeIndex);
    });
    dotButtons.forEach((dot, dotIndex) => {
      dot.setAttribute("aria-current", dotIndex === activeIndex ? "true" : "false");
    });
  }

  function showImage(index, shouldScroll = true) {
    activeIndex = (index + images.length) % images.length;
    updateStatus();

    if (!shouldScroll) return;
    const slide = slides[activeIndex];
    const left = slide.offsetLeft - (track.clientWidth - slide.clientWidth) / 2;
    track.scrollTo({
      left,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
    });
  }

  previous.addEventListener("click", () => showImage(activeIndex - 1));
  next.addEventListener("click", () => showImage(activeIndex + 1));

  track.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showImage(activeIndex - 1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      showImage(activeIndex + 1);
    }
  });

  track.addEventListener("scroll", () => {
    if (scrollFrame) cancelAnimationFrame(scrollFrame);
    scrollFrame = requestAnimationFrame(() => {
      const trackCentre = track.scrollLeft + track.clientWidth / 2;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      slides.forEach((slide, index) => {
        const slideCentre = slide.offsetLeft + slide.clientWidth / 2;
        const distance = Math.abs(slideCentre - trackCentre);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      if (closestIndex !== activeIndex) {
        activeIndex = closestIndex;
        updateStatus();
      }
    });
  });

  stage.append(track, previous, next);
  footer.append(counter, dots);
  carousel.append(stage, footer);
  showImage(0, false);
  requestAnimationFrame(() => showImage(0));
  return carousel;
}

function createRemHighlightIcon(name) {
  const icons = {
    shield: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3 19 6v5c0 4.6-2.8 8-7 10-4.2-2-7-5.4-7-10V6l7-3Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>`,
    processor: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="6" y="6" width="12" height="12" rx="3" />
        <path d="M9 2v4m6-4v4M9 18v4m6-4v4M2 9h4m-4 6h4m12-6h4m-4 6h4" />
        <path d="m12 9 .7 2.3L15 12l-2.3.7L12 15l-.7-2.3L9 12l2.3-.7L12 9Z" />
      </svg>`,
    remote: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="5" width="13" height="10" rx="2" />
        <path d="M7 19h5m-2.5-4v4" />
        <rect x="16" y="11" width="5" height="9" rx="1.5" />
        <path d="M17.5 8.5c1.2 0 2.2.6 2.8 1.5M16.5 6c2.6 0 4.7 1.2 5.8 3" />
      </svg>`
  };

  const icon = document.createElement("span");
  icon.className = "rem-showcase__highlight-icon";
  icon.setAttribute("aria-hidden", "true");
  icon.innerHTML = icons[name] || icons.processor;
  return icon;
}

function createRemShowcase(project) {
  const preview = project.preview;
  const showcase = document.createElement("div");
  showcase.className = "rem-showcase";

  const banner = document.createElement("figure");
  banner.className = "rem-showcase__banner";

  const bannerImage = document.createElement("img");
  bannerImage.src = preview.banner?.src || project.image;
  bannerImage.alt = preview.banner?.alt || project.imageAlt || "";
  bannerImage.decoding = "async";
  bannerImage.addEventListener("error", () => {
    bannerImage.remove();
    banner.classList.add("project-visual--fallback");
    banner.textContent = project.title;
  }, { once: true });

  banner.appendChild(bannerImage);
  showcase.appendChild(banner);

  if (Array.isArray(preview.highlights) && preview.highlights.length) {
    const highlights = document.createElement("ul");
    highlights.className = "rem-showcase__highlights";
    preview.highlights.forEach((highlight) => {
      const item = document.createElement("li");
      const label = document.createElement("span");
      const highlightLabel = typeof highlight === "string" ? highlight : highlight.label;
      label.className = "rem-showcase__highlight-label";
      label.textContent = highlightLabel || "";
      item.append(createRemHighlightIcon(highlight.icon), label);
      highlights.appendChild(item);
    });
    showcase.appendChild(highlights);
  }

  (preview.sections || []).forEach((section) => {
    if (!Array.isArray(section.images) || !section.images.length) return;

    const feature = document.createElement("section");
    feature.className = "rem-showcase__section";
    if (section.id) feature.id = `rem-${section.id}`;

    const heading = document.createElement("div");
    heading.className = "rem-showcase__heading";
    heading.innerHTML = `
      <div>
        <p class="eyebrow">${section.eyebrow || UI_TEXT.gallery}</p>
        <h2>${section.title || project.title}</h2>
      </div>
      ${section.description ? `<p>${section.description}</p>` : ""}`;

    const carousel = createProjectCarousel(project, {
      images: section.images,
      layout: section.layout,
      label: `${project.title} — ${section.eyebrow || UI_TEXT.gallery}`
    });

    feature.append(heading, carousel);
    showcase.appendChild(feature);
  });

  return showcase;
}

async function renderProjectGrids() {
  const grids = document.querySelectorAll("[data-project-grid]");
  if (!grids.length) return;

  try {
    const projects = await fetchProjects();
    grids.forEach((grid) => {
      const limit = Number(grid.dataset.projectLimit) || projects.length;
      grid.replaceChildren(...projects.slice(0, limit).map(createProjectCard));
    });
  } catch (error) {
    grids.forEach((grid) => {
      const message = document.createElement("p");
      message.className = "error-message";
      message.textContent = UI_TEXT.projectsError;
      grid.replaceChildren(message);
    });
  }
}

function createProjectVisual(project) {
  if (project.preview?.type === "showcase" && Array.isArray(project.preview.sections)) {
    return createRemShowcase(project);
  }

  if (project.preview?.type === "carousel" && Array.isArray(project.preview.images) && project.preview.images.length) {
    return createProjectCarousel(project);
  }

  if (project.preview?.type === "iframe" && project.preview.url) {
    const preview = document.createElement("section");
    preview.className = "live-preview";
    preview.setAttribute("aria-label", `${project.title} live website preview`);

    const bar = document.createElement("div");
    bar.className = "live-preview__bar";
    bar.innerHTML = `<span>${UI_TEXT.livePreview}</span><a href="${project.preview.url}" target="_blank" rel="noopener noreferrer">${UI_TEXT.openWebsite}</a>`;

    const frame = document.createElement("iframe");
    frame.src = project.preview.url;
    frame.title = `${project.title} ${UI_TEXT.websiteTitle}`;
    frame.loading = "lazy";
    frame.referrerPolicy = "strict-origin-when-cross-origin";
    frame.setAttribute("sandbox", "allow-forms allow-popups allow-same-origin allow-scripts");

    preview.append(bar, frame);
    return preview;
  }

  const visual = document.createElement("div");
  visual.className = "project-visual";

  if (project.image) {
    const image = document.createElement("img");
    image.src = project.image;
    image.alt = project.imageAlt || "";
    image.decoding = "async";
    image.addEventListener("error", () => {
      image.remove();
      visual.classList.add("project-visual--fallback");
      visual.textContent = project.title;
    }, { once: true });
    visual.appendChild(image);
  } else {
    visual.classList.add("project-visual--fallback");
    visual.textContent = project.title;
  }

  return visual;
}

function createProjectLink(link) {
  const anchor = document.createElement(link.disabled ? "span" : "a");
  anchor.className = `button ${link.primary ? "button--primary" : "button--secondary"}`;
  anchor.textContent = link.label;

  if (link.disabled) {
    anchor.classList.add("button--disabled");
    anchor.setAttribute("aria-disabled", "true");
    return anchor;
  }

  anchor.href = link.url;

  if (/^https?:\/\//.test(link.url)) {
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
  }

  return anchor;
}

function pathProjectId() {
  const segments = window.location.pathname.split("/").filter(Boolean);
  const projectsIndex = segments.indexOf("projects");
  if (projectsIndex === -1) return null;
  const next = segments[projectsIndex + 1];
  if (!next || next.toLowerCase() === "projectinfo.html") return null;
  return decodeURIComponent(next);
}

async function renderProjectDetail() {
  const root = document.querySelector("[data-project-detail]");
  if (!root) return;

  const id = new URLSearchParams(window.location.search).get("id") || pathProjectId();

  try {
    const projects = await fetchProjects();
    const project = projects.find((item) => item.id === id);

    if (!project) {
      root.innerHTML = `<p class="eyebrow">${UI_TEXT.projectNotFound}</p><h1>${UI_TEXT.projectMissingTitle}</h1><p class="project-page-intro">${UI_TEXT.projectMissingText}</p><div class="button-row"><a class="button button--primary" href="${PROJECT_INDEX_PATH}">${UI_TEXT.viewProjects}</a></div>`;
      document.title = `${UI_TEXT.projectNotFound} — Remy Moscovitz`;
      return;
    }

    syncProjectMetadata(project);

    const facts = Array.isArray(project.facts) && project.facts.length
      ? `<dl class="project-facts">${project.facts.map((fact) => `<div><dt>${fact.label}</dt><dd>${fact.value}</dd></div>`).join("")}</dl>`
      : "";

    const header = document.createElement("header");
    header.className = "project-detail__header";
    header.innerHTML = `
      <div>
        <p class="eyebrow">${project.eyebrow}</p>
        <h1>${project.title}</h1>
        <p class="project-page-intro">${project.summary}</p>
      </div>
      <aside class="project-detail__meta">
        <ul class="tag-list">${project.tags.map((tag) => `<li>${tag}</li>`).join("")}</ul>
        <p>${project.year} · ${UI_TEXT.selectedProject}</p>
        ${facts}
      </aside>`;

    const copy = document.createElement("section");
    copy.className = "project-copy-grid";
    copy.innerHTML = `<div><p class="eyebrow">${UI_TEXT.projectStory}</p><h2>${UI_TEXT.whatIBuilt}</h2><p class="project-description">${project.description}</p></div>`;

    const actions = document.createElement("div");
    actions.className = "project-actions";
    (project.links || []).forEach((link) => actions.appendChild(createProjectLink(link)));
    actions.appendChild(createProjectLink({ label: UI_TEXT.backToProjects, url: PROJECT_INDEX_PATH, primary: false }));
    copy.appendChild(actions);

    root.dataset.projectId = project.id;
    root.replaceChildren(header, createProjectVisual(project), copy);
  } catch (error) {
    root.innerHTML = `<p class="eyebrow">${UI_TEXT.genericError}</p><h1>${UI_TEXT.loadErrorTitle}</h1><p class="project-page-intro">${UI_TEXT.loadErrorText}</p><div class="button-row"><a class="button button--primary" href="${PROJECT_INDEX_PATH}">${UI_TEXT.viewProjects}</a></div>`;
  }
}

setupNavigation();
setCurrentYear();
renderProjectGrids();
renderProjectDetail();
