/* ===== PUUSEPP 369 — script.js ===== */

document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".nav");
  const hamburger = document.querySelector(".hamburger");
  const mobileMenu = document.querySelector(".mobile-menu");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      nav?.classList.add("scrolled");
    } else {
      nav?.classList.remove("scrolled");
    }
  });

  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("open");
      mobileMenu.classList.toggle("open");
    });

    mobileMenu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("open");
        mobileMenu.classList.remove("open");
      });
    });
  }

  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll(".nav-links a, .mobile-menu a").forEach(link => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    }
  });

  const fadeEls = document.querySelectorAll(".fade-in");

  if (fadeEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12
    });

    fadeEls.forEach(el => observer.observe(el));
  }

  const form = document.getElementById("contactForm");
  const successMsg = document.querySelector(".form-success");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const required = form.querySelectorAll("[required]");
      let valid = true;

      required.forEach(field => {
        if (!field.value.trim()) {
          valid = false;
          field.style.borderColor = "#c0392b";
        }
      });

      if (!valid) return;

      form.reset();

      if (successMsg) {
        successMsg.style.display = "flex";

        setTimeout(() => {
          successMsg.style.display = "none";
        }, 5000);
      }
    });
  }

  const galleryItems = document.querySelectorAll(".gallery-item");

  galleryItems.forEach(item => {
    item.addEventListener("click", () => {
      const img = item.querySelector("img");

      if (!img) return;

      const overlay = document.createElement("div");
      overlay.className = "image-lightbox";

      const bigImg = document.createElement("img");
      bigImg.src = img.src;
      bigImg.alt = img.alt || "Galerii pilt";

      const closeBtn = document.createElement("button");
      closeBtn.className = "lightbox-close";
      closeBtn.type = "button";
      closeBtn.innerHTML = "×";

      overlay.appendChild(bigImg);
      overlay.appendChild(closeBtn);
      document.body.appendChild(overlay);

      document.body.style.overflow = "hidden";

      function closeLightbox() {
        overlay.remove();
        document.body.style.overflow = "";
      }

      closeBtn.addEventListener("click", closeLightbox);

      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
          closeLightbox();
        }
      });

      document.addEventListener("keydown", function escClose(e) {
        if (e.key === "Escape") {
          closeLightbox();
          document.removeEventListener("keydown", escClose);
        }
      });
    });
  });
});