// main script

// --- About photo fallback ---
// Shows a placeholder when the portrait image is missing or fails to load.
const aboutPhoto = document.getElementById("about-photo");
const aboutImg = aboutPhoto?.querySelector("img");

if (aboutImg) {
  const showPlaceholder = () => aboutPhoto.classList.add("is-placeholder");

  if (aboutImg.complete && aboutImg.naturalWidth === 0) showPlaceholder();
  aboutImg.addEventListener("error", showPlaceholder);
}
