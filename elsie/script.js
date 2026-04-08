const navToggle = document.querySelector(".nav-toggle");
const mainNav = document.querySelector(".main-nav");
const navLinks = [...document.querySelectorAll(".main-nav a")];
const sections = [...document.querySelectorAll("main section[id]")];
const revealItems = [...document.querySelectorAll(".reveal")];
const reviewCards = [...document.querySelectorAll(".review-card")];
const dotsContainer = document.querySelector(".review-dots");
const prevButton = document.querySelector(".review-button.prev");
const nextButton = document.querySelector(".review-button.next");

if (navToggle && mainNav) {
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    mainNav.classList.toggle("is-open", !expanded);
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.setAttribute("aria-expanded", "false");
      mainNav.classList.remove("is-open");
    });
  });
}

if (revealItems.length) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

if (sections.length && navLinks.length) {
  const setActiveLink = () => {
    const currentSection = [...sections].reverse().find((section) => {
      const top = section.getBoundingClientRect().top;
      return top <= 140;
    }) || sections[0];

    navLinks.forEach((link) => {
      const isMatch = link.getAttribute("href") === `#${currentSection.id}`;
      link.classList.toggle("is-active", isMatch);
    });
  };

  setActiveLink();
  window.addEventListener("scroll", setActiveLink, { passive: true });
}

if (reviewCards.length && dotsContainer && prevButton && nextButton) {
  let currentIndex = 0;
  let autoplayId;

  const dots = reviewCards.map((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Go to review ${index + 1}`);
    dot.addEventListener("click", () => {
      currentIndex = index;
      renderReview();
      restartAutoplay();
    });
    dotsContainer.appendChild(dot);
    return dot;
  });

  const renderReview = () => {
    reviewCards.forEach((card, index) => {
      card.classList.toggle("is-active", index === currentIndex);
    });
    dots.forEach((dot, index) => {
      dot.classList.toggle("is-active", index === currentIndex);
    });
  };

  const moveReview = (direction) => {
    currentIndex = (currentIndex + direction + reviewCards.length) % reviewCards.length;
    renderReview();
  };

  const restartAutoplay = () => {
    window.clearInterval(autoplayId);
    autoplayId = window.setInterval(() => moveReview(1), 4800);
  };

  prevButton.addEventListener("click", () => {
    moveReview(-1);
    restartAutoplay();
  });

  nextButton.addEventListener("click", () => {
    moveReview(1);
    restartAutoplay();
  });

  renderReview();
  restartAutoplay();
}
