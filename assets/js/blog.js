const closeMenu = () => {
  document.querySelector("#croix").style.display = "none";
  document.querySelector("menu").style.height = "60px";
  document.querySelector(".click_menu").style.display = "none";
  document.querySelector("#menu").style.display = "block";
};

const moveTo = section => {
  document.querySelector(section).scrollIntoView({
    block: "start",
    behavior: "smooth"
  });
};

[].forEach.call(document.querySelectorAll(".click_menu li"), element => {
  element.addEventListener("click", e => {
    e.preventDefault();
    const section = element.querySelector("a").getAttribute("href");
    moveTo(section);
    closeMenu();
  });
});

[].forEach.call(document.querySelectorAll(".header li"), element => {
  element.addEventListener("click", e => {
    e.preventDefault();
    const section = element.querySelector("a").getAttribute("href");
    moveTo(section);
    closeMenu();
  });
});

const menu = document.querySelector("#menu");
menu.addEventListener("click", e => {
  e.preventDefault();
  document.querySelector("menu").style.height = "100%";
  document.querySelector(".click_menu").style.display = "block";
  document.querySelector("#menu").style.display = "none";
  document.querySelector("#croix").style.display = "block";
});
const croix = document.querySelector("#croix");
croix.addEventListener("click", e => {
  e.preventDefault();
  document.querySelector("menu").style.height = "60px";
  document.querySelector(".click_menu").style.display = "none";
  document.querySelector("#menu").style.display = "block";
  document.querySelector("#croix").style.display = "none";
});

const fleche = document.querySelector(".arrow");
fleche.addEventListener("click", e => {
  e.preventDefault();
  document
    .querySelector("body")
    .scrollIntoView({ block: "start", behavior: "smooth" });
});

const toto = document.querySelector("#menu");
const style = getComputedStyle(toto);
const display = style.display;
//console.log(getComputedStyle(toto, null).display);
if (getComputedStyle(toto, null).display === "block") {
  document.querySelector("#croix").style.display = "none";
}

window.addEventListener("scroll", () => {
  let scroll = window.scrollY; // Axe Y
  //console.log(scroll);
  if (scroll > 20) {
    document.querySelector(".arrow").classList.remove("hidden");
    // document.querySelector(".arrow").style.display = "block";
  } else {
    document.querySelector(".arrow").classList.add("hidden");
    // document.querySelector(".arrow").style.display = "none";
  }
});
window.addEventListener("resize", () => {
  document.querySelector("#croix").style.display = "none";
  document.querySelector("menu").style.height = "60px";
  document.querySelector(".click_menu").style.display = "none";
  document.querySelector("#menu").style.display = "block";
});
