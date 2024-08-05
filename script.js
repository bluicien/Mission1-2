// COPY PASTA

let slider = document.querySelector(".skills-flex");
let innerSlider = document.querySelector(".skills-list");

let pressed = false;
let startx;
let x;

console.log(slider)
console.log(innerSlider)

slider.addEventListener("mousedown", (e) => {
  pressed = true;
  startx = e.offsetX - innerSlider.offsetLeft;
  console.log(
    `OffsetX: ${e.offsetX}, InnerSlider OffsetLeft: ${innerSlider.offsetLeft}`
  );
  slider.style.cursor = "grabbing";
});

slider.addEventListener("mouseenter", (e) => {
  slider.style.cursor = "grab";
});

slider.addEventListener("mouseup", () => {
  slider.style.cursor = "grab";
});

window.addEventListener("mouseup", () => {
  pressed = false;
});

slider.addEventListener("mousemove", (e) => {
  if (!pressed) return;
  e.preventDefault();
  x = e.offsetX;
  console.log(`x: ${x}, startx: ${startx}`);
  console.log(`Diff: ${x - startx}`);

  innerSlider.style.left = `${x - startx}px`;
  checkBoundary();

});

function checkBoundary(x, startx) {
  let outer = slider.getBoundingClientRect();
  let inner = innerSlider.getBoundingClientRect();

  if (parseInt(innerSlider.style.left) > 0) {
    innerSlider.style.left = "0px";
  }
  if (inner.right < outer.right) {
    innerSlider.style.left = `-${inner.width - outer.width}px`;
  }
}

// MY SCRIPTS

// Run spin icon function when mouse hovers over slider
slider.addEventListener("mousemove", (e) => {
  spinIcon(e);
});

// Function gets children of the slider and runs animation on the child
// when mouse hovers over it
function spinIcon(event) {
  let sliderChildren = innerSlider.getElementsByClassName("slide-skills")
  
  for (let i = 0; i < sliderChildren.length; i++) {
    let iconPosition = sliderChildren[i].getBoundingClientRect();
    if (checkHover(event, iconPosition)) {
      // console.log(`Your mouse is at ${e.clientX}-X and ${e.clientY}-Y`)
      sliderChildren[i].children[0].style.animation = "rotate-logo 8s ease-in-out 0s";
    }
  }
}

// Function takes 2 arguments, mouse event and element position from getBoundingClientRect()
// and de-structures them. Then checks if the mouse is hovering over the element
function checkHover ({clientX, clientY}, {x, y, width, height}) {
  let rightSideX = x + width;
  let bottomSideY = y + height;

  if (
    (clientX + 1)>= x &&
    (clientX - 1) <= rightSideX &&
    (clientY + 1)>= y &&
    (clientY - 1) <= bottomSideY
  ) {
    return true;
  } else {
    return false;
  }
}