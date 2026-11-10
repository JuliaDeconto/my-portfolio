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

// --- About photo fallback ---
// Shows a placeholder when the portrait image is missing or fails to load.
const aboutPhoto = document.getElementById("about-photo");
const aboutImg = aboutPhoto?.querySelector("img");

if (aboutImg) {
  const showPlaceholder = () => aboutPhoto.classList.add("is-placeholder");

  if (aboutImg.complete && aboutImg.naturalWidth === 0) showPlaceholder();
  aboutImg.addEventListener("error", showPlaceholder);
}
