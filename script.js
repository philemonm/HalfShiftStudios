(() => {
  const initAnchorScroll = () => {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        const href = link.getAttribute("href");

        if (!href || href === "#") {
          return;
        }

        const target = document.querySelector(href);

        if (!target) {
          return;
        }

        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  };

  const initButtonMotion = () => {
    const buttons = document.querySelectorAll(".btn");

    buttons.forEach((button) => {
      button.addEventListener("pointermove", (event) => {
        const rect = button.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 6;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * 6;
        button.style.transform = `translateY(-2px) rotateX(${-y}deg) rotateY(${x}deg)`;
      });

      button.addEventListener("pointerleave", () => {
        button.style.transform = "";
      });

      button.addEventListener("click", (event) => {
        const rect = button.getBoundingClientRect();
        const ripple = document.createElement("span");
        const size = Math.max(rect.width, rect.height);

        ripple.className = "ripple";
        ripple.style.width = `${size}px`;
        ripple.style.height = `${size}px`;
        ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${event.clientY - rect.top - size / 2}px`;

        const existingRipple = button.querySelector(".ripple");
        if (existingRipple) {
          existingRipple.remove();
        }

        button.appendChild(ripple);

        ripple.addEventListener("animationend", () => {
          ripple.remove();
        });
      });
    });
  };

  initAnchorScroll();
  initButtonMotion();
})();
