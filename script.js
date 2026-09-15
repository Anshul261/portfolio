const root = document.documentElement;
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const themeToggle = document.querySelector("[data-theme-toggle]");
const themeLabel = document.querySelector("[data-theme-label]");
const filters = document.querySelectorAll("[data-filter]");
const projects = document.querySelectorAll("[data-category]");
const filterStatus = document.querySelector("[data-filter-status]");
const sectionLinks = document.querySelectorAll(".nav-links a[href^='#']");
const stepItems = document.querySelectorAll(".stepin");
const yearSlot = document.querySelector("[data-year]");
const preview = document.querySelector(".project-preview");
const previewNumber = document.querySelector("[data-preview-number]:not(.project-row)");
const previewType = document.querySelector("[data-preview-type]:not(.project-row)");
const previewTitle = document.querySelector("[data-preview-title]:not(.project-row)");
const previewNote = document.querySelector("[data-preview-note]:not(.project-row)");

const storage = {
  get(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* storage unavailable; theme still applies for this page view */
    }
  },
};

/* ---------- theme ---------- */
// The initial theme is set inline in <head> so there is no flash on load;
// here we only keep the toggle's wording in sync and handle clicks.

function paintToggle(theme) {
  if (themeLabel) themeLabel.textContent = theme === "dark" ? "Light" : "Dark";
  themeToggle?.setAttribute(
    "aria-label",
    theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
  );
}

paintToggle(root.dataset.theme || "light");

themeToggle?.addEventListener("click", () => {
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  storage.set("theme", next);
  paintToggle(next);
});

/* ---------- navigation ---------- */

function closeNav() {
  navLinks?.classList.remove("is-open");
  document.body.classList.remove("nav-open");
  navToggle?.setAttribute("aria-expanded", "false");
}

navToggle?.addEventListener("click", () => {
  const isOpen = navLinks?.classList.toggle("is-open");
  document.body.classList.toggle("nav-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

sectionLinks.forEach((link) => link.addEventListener("click", closeNav));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navLinks?.classList.contains("is-open")) {
    closeNav();
    navToggle?.focus();
  }
});

document.addEventListener("click", (event) => {
  if (!navLinks?.classList.contains("is-open")) return;
  if (navLinks.contains(event.target) || navToggle?.contains(event.target)) return;
  closeNav();
});

/* ---------- project filters ---------- */

filters.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    let shown = 0;

    filters.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });

    projects.forEach((project) => {
      const shouldShow = filter === "all" || project.dataset.category === filter;
      project.classList.toggle("is-hidden", !shouldShow);
      if (shouldShow) shown += 1;
    });

    const firstVisible = [...projects].find((project) => !project.classList.contains("is-hidden"));
    if (firstVisible) setProjectPreview(firstVisible);

    if (filterStatus) {
      filterStatus.textContent = `Showing ${shown} ${shown === 1 ? "project" : "projects"}.`;
    }
  });
});

/* ---------- responsive project preview ---------- */

let previewTimer;

function setProjectPreview(project) {
  projects.forEach((item) => item.classList.toggle("is-current", item === project));
  if (!preview) return;

  preview.classList.add("is-changing");
  clearTimeout(previewTimer);
  previewTimer = setTimeout(() => preview.classList.remove("is-changing"), 420);

  if (previewNumber) previewNumber.textContent = project.dataset.previewNumber;
  if (previewType) previewType.textContent = project.dataset.previewType;
  if (previewTitle) previewTitle.textContent = project.dataset.previewTitle;
  if (previewNote) previewNote.textContent = project.dataset.previewNote;
}

projects.forEach((project) => {
  project.addEventListener("pointerenter", () => setProjectPreview(project));
  project.addEventListener("focus", () => setProjectPreview(project));
});

/* ---------- copy to clipboard ---------- */
// The address is a real, verifiable action rather than a mailto: link, which
// silently does nothing when the browser has no mail handler registered.

const copyButtons = document.querySelectorAll("[data-copy]");
const copyStatus = document.querySelector("[data-copy-status]");
const copyStatusIdle = copyStatus?.textContent.trim() || "";
let copyResetTimer;

function legacyCopy(text) {
  const field = document.createElement("textarea");
  field.value = text;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.opacity = "0";
  document.body.appendChild(field);
  field.select();

  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }

  field.remove();
  return ok;
}

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      /* fall through to the legacy path below */
    }
  }
  return legacyCopy(text);
}

function reportCopy(button, ok, text) {
  const verb = button.querySelector("[data-copy-verb]");
  if (verb) verb.textContent = ok ? "Copied" : "Select";

  button.classList.toggle("is-copied", ok);

  if (copyStatus) {
    copyStatus.textContent = ok
      ? `Copied ${text} to your clipboard.`
      : `Could not reach the clipboard. Select and copy ${text} manually.`;
  }

  clearTimeout(copyResetTimer);
  copyResetTimer = setTimeout(() => {
    if (verb) verb.textContent = "Copy";
    button.classList.remove("is-copied");
    if (copyStatus) copyStatus.textContent = copyStatusIdle;
  }, 2600);
}

copyButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const text = button.dataset.copy;
    reportCopy(button, await copyText(text), text);
  });
});

/* ---------- footer year ---------- */

if (yearSlot) yearSlot.textContent = String(new Date().getFullYear());

/* ---------- staggered row arrival, active section ---------- */

if ("IntersectionObserver" in window) {
  const stepObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const index = Number(entry.target.dataset.step || 0);
        entry.target.style.animationDelay = `${index * 60}ms`;
        entry.target.classList.add("is-visible");
        stepObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.1 }
  );

  stepItems.forEach((item, index) => {
    item.dataset.step = String(index);
    stepObserver.observe(item);
  });

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        sectionLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: "-30% 0px -60% 0px" }
  );

  document.querySelectorAll("main section[id]").forEach((section) => {
    sectionObserver.observe(section);
  });
} else {
  stepItems.forEach((item) => item.classList.add("is-visible"));
}
