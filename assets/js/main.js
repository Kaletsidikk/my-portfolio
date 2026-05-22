const navMenu = document.getElementById("nav-menu"),
  navToggle = document.getElementById("nav-toggle"),
  navItem = document.querySelectorAll(".nav__item"),
  header = document.getElementById("header");

// open and close menu
navToggle.addEventListener("click", () => {
  navMenu.classList.toggle("nav__menu--open");
  changeIcon();
});

// close the menu when the user clicks the nav links
navItem.forEach((item) => {
  item.addEventListener("click", () => {
    if (navMenu.classList.contains("nav__menu--open")) {
      navMenu.classList.remove("nav__menu--open");
    }
    changeIcon();
  });
});

// Change nav toggle icon
function changeIcon() {
  if (navMenu.classList.contains("nav__menu--open")) {
    navToggle.classList.replace("ri-menu-3-line", "ri-close-line");
  } else {
    navToggle.classList.replace("ri-close-line", "ri-menu-3-line");
  }
}

// Scroll Progress Bar
const scrollProgress = document.getElementById("scroll-progress");
if (scrollProgress) {
  window.addEventListener("scroll", () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const progress = (window.scrollY / totalHeight) * 100;
      scrollProgress.style.width = `${progress}%`;
    }
  });
}

// Custom Interactive Cursor with Inertia
const cursor = document.querySelector(".custom-cursor");
const cursorDot = document.querySelector(".custom-cursor-dot");

if (cursor && cursorDot) {
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  
  // Track mouse coordinates
  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Position dot instantly
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });

  // Animate outer ring with linear interpolation (inertia)
  const animateCursor = () => {
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    
    requestAnimationFrame(animateCursor);
  };
  animateCursor();

  // Scale and change cursor state when hovering interactive elements
  const updateHoverListeners = () => {
    const hoverElements = document.querySelectorAll(
      "a, button, .btn, .service__card, .project__content, .nav__toggle, .footer__social-link, .bot__card"
    );
    
    hoverElements.forEach((el) => {
      // Avoid duplicate listeners
      el.removeEventListener("mouseenter", addHoverClass);
      el.removeEventListener("mouseleave", removeHoverClass);
      el.addEventListener("mouseenter", addHoverClass);
      el.addEventListener("mouseleave", removeHoverClass);
    });
  };

  function addHoverClass() {
    cursor.classList.add("custom-cursor--hover");
  }

  function removeHoverClass() {
    cursor.classList.remove("custom-cursor--hover");
  }

  // Initial binding
  updateHoverListeners();
  
  // Re-bind when content is dynamically added/changed (if any)
  window.addEventListener("contentChanged", updateHoverListeners);
}

// Cosmic Particles Canvas Background
const canvas = document.getElementById("bg-canvas");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let particlesArray = [];
  const numberOfParticles = 80;
  
  let mouse = {
    x: null,
    y: null,
    radius: 120 // Influence radius
  };
  
  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  
  window.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
  });
  
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  window.addEventListener("resize", () => {
    resizeCanvas();
    initParticles();
  });
  
  resizeCanvas();
  
  class Particle {
    constructor(x, y, directionX, directionY, size, color) {
      this.x = x;
      this.y = y;
      this.directionX = directionX;
      this.directionY = directionY;
      this.size = size;
      this.color = color;
      this.alpha = Math.random() * 0.5 + 0.2;
      this.speedModifier = Math.random() * 0.5 + 0.2;
    }
    
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
      ctx.fillStyle = `rgba(0, 230, 118, ${this.alpha})`;
      ctx.fill();
    }
    
    update() {
      if (this.x > canvas.width || this.x < 0) {
        this.directionX = -this.directionX;
      }
      if (this.y > canvas.height || this.y < 0) {
        this.directionY = -this.directionY;
      }
      
      this.x += this.directionX * this.speedModifier;
      this.y += this.directionY * this.speedModifier;
      
      // Mouse interaction (push away gently)
      if (mouse.x !== null && mouse.y !== null) {
        let dx = this.x - mouse.x;
        let dy = this.y - mouse.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius) {
          let forceDirectionX = dx / distance;
          let forceDirectionY = dy / distance;
          let force = (mouse.radius - distance) / mouse.radius;
          
          this.x += forceDirectionX * force * 3;
          this.y += forceDirectionY * force * 3;
        }
      }
      
      this.draw();
    }
  }
  
  function initParticles() {
    particlesArray = [];
    let size = 1.5;
    for (let i = 0; i < numberOfParticles; i++) {
      let x = Math.random() * (window.innerWidth - size * 2) + size;
      let y = Math.random() * (window.innerHeight - size * 2) + size;
      let directionX = (Math.random() * 2) - 1;
      let directionY = (Math.random() * 2) - 1;
      let color = "rgba(0, 230, 118, 0.4)";
      
      particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
  }
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
    }
    
    // Connect particles
    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a; b < particlesArray.length; b++) {
        let dx = particlesArray[a].x - particlesArray[b].x;
        let dy = particlesArray[a].y - particlesArray[b].y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 90) {
          let opacity = (1 - (distance / 90)) * 0.12;
          ctx.strokeStyle = `rgba(0, 230, 118, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }
    }
    
    requestAnimationFrame(animate);
  }
  
  initParticles();
  animate();
}

// Testimonial Slide (Only initialize if element exists)
if (document.querySelector(".testimonial__wrapper")) {
  const testimonialSlide = new Swiper(".testimonial__wrapper", {
    loop: true,
    spaceBetween: 30,
    centeredSlides: true,
    effect: "coverflow",
    grabCursor: true,
    slidesPerView: 1,
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      520: {
        slidesPerView: "auto",
      },
    },
  });
}

// header scroll animation
window.addEventListener("scroll", () => {
  if (window.scrollY > 40) {
    header.classList.add("header--scroll");
  } else {
    header.classList.remove("header--scroll");
  }
});

// ScrollReveal animations
const sr = ScrollReveal({
  duration: 2000,
  distance: "100px",
  delay: 400,
  reset: false,
});

sr.reveal(".hero__content, .about__content");
sr.reveal(".hero__img", { origin: "top" });

sr.reveal(
  ".hero__info-wrapper, .skills__title, .skills__content, .qualification__name, .qualification__item, .service__card, .project__content, .testimonial__wrapper, .footer__content, .bot__card",
  {
    delay: 500,
    interval: 100,
  }
);

sr.reveal(".qualification__footer-text, .contact__content", {
  origin: "left",
});

sr.reveal(".qualification__footer .btn, .contact__btn", { origin: "right" });