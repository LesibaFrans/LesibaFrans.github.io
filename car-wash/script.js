const body = document.body;
const navToggle = document.querySelector(".nav-toggle");
const navLinks = [...document.querySelectorAll(".site-nav a")];
const sections = [...document.querySelectorAll("main section[id]")];
const revealItems = [...document.querySelectorAll(".reveal")];
const filterButtons = [...document.querySelectorAll(".filter-button")];
const serviceCards = [...document.querySelectorAll(".service-card")];
const reviewCards = [...document.querySelectorAll(".review-card")];
const dotsContainer = document.querySelector(".review-dots");
const prevButton = document.querySelector(".review-button.prev");
const nextButton = document.querySelector(".review-button.next");

if (navToggle) {
  navToggle.addEventListener("click", () => {
    const isOpen = body.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    body.classList.remove("nav-open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        navLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: "-35% 0px -55% 0px" }
  );

  sections.forEach((section) => navObserver.observe(section));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));

    serviceCards.forEach((card) => {
      const categories = card.dataset.category?.split(" ") || [];
      const shouldShow = filter === "all" || categories.includes(filter);
      card.classList.toggle("is-hidden", !shouldShow);

      if (shouldShow) {
        card.classList.remove("is-visible");
        window.requestAnimationFrame(() => card.classList.add("is-visible"));
      }
    });
  });
});

if (reviewCards.length && dotsContainer && prevButton && nextButton) {
  let currentIndex = 0;
  let autoplayId;

  const dots = reviewCards.map((_, index) => {
    const dot = document.createElement("button");
    dot.className = "review-dot";
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
    autoplayId = window.setInterval(() => moveReview(1), 5200);
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
