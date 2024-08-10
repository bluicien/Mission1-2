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

  let rightSideX = x + width; // X coord for right side of the element
  let bottomSideY = y + height; // Y coord for bottom side of the element

  // Check if mouse is within the coords of the element and return true if it is
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

// Background music mute on/off
function soundChange() {
  const soundBtn = document.getElementById("sound-control"); // Mute/Unmute button
  const audioPlayer = document.getElementById("audio-player"); // audio html for background music

  const mute = '<i class="fa-solid fa-volume-xmark fa-xl"></i>' // Muted icon
  const soundOn = '<i class="fa-solid fa-volume-high fa-xl"></i>' // Sound icon

  // Switch mute on/off based on current state
  audioPlayer.muted = !audioPlayer.muted;

  // If muted, unmute and change style
  if (audioPlayer.muted) {
    soundBtn.innerHTML = mute;
    soundBtn.style.backgroundColor = "white"
    soundBtn.style.color = "#333"
  } 
  // If unmuted, mute and change style
  else {
    soundBtn.innerHTML = soundOn
    soundBtn.style.backgroundColor = "#333"
    soundBtn.style.color = "white"
  }
  return;
}
