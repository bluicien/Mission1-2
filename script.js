// ========== CAROUSEL SLIDE ANIMATION SCRIPTS ========== //
// Scripts from from https://codesandbox.io/p/sandbox/draggable-carousel-l3f9g

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

// ========== CAROUSEL SPIN ANIMATION SCRIPTS ========== //

// Run spin icon function when mouse hovers over slider
slider.addEventListener("mousemove", spinIcon);

// Function gets children of the slider and runs animation on the child
// when mouse hovers over it
function spinIcon(e) {
  let sliderChildren = innerSlider.getElementsByClassName("slide-skills")
  
  for (let i = 0; i < sliderChildren.length; i++) {
    let iconPosition = sliderChildren[i].getBoundingClientRect();
    if (checkHover(e, iconPosition)) {
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

const soundBtn = document.getElementById("sound-control"); // Mute/Unmute button

// Add event listeners for mouse events
soundBtn.addEventListener("click", soundChange)
soundBtn.addEventListener("mouseover", () => soundBtn.classList.add("hover-sound-btn"))
soundBtn.addEventListener("mouseleave", () => soundBtn.classList.remove("hover-sound-btn"))

// Background music mute on/off
function soundChange() {
  const audioPlayer = document.getElementById("audio-player"); // audio html for background music
  console.log(soundBtn)

  const mute = '<i class="fa-solid fa-volume-xmark fa-xl" style="backgroundColor: white"></i>' // Muted icon
  const soundOn = '<i class="fa-solid fa-volume-high fa-xl"></i>' // Sound icon

  // Switch mute on/off based on current state
  audioPlayer.muted = !audioPlayer.muted;

  // If muted, unmute and change style
  if (audioPlayer.muted) {
    soundBtn.innerHTML = mute;
    soundBtn.style.backgroundColor = "white"
    soundBtn.style.color = "black"
  } 
  // If unmuted, mute and change style
  else {
    soundBtn.innerHTML = soundOn
    soundBtn.style.backgroundColor = ""
    soundBtn.style.color = ""
  }
}


// ========== RATING SCRIPTS ========== //

// Query Nodelist of star elements and rating input
const starArray = document.getElementById("star-group").children;
const ratingInput = document.getElementById("rating-input")

let freezeStar = false; // Boolean to stop filling stars on hover

// Loop over array of star and add event listeners
for (const star of starArray) {
  star.addEventListener("mousemove", fillStar)
  star.addEventListener("mouseleave", unFillStar)
  star.addEventListener("click", setStar)
}

// If freezeStar is not false, loop over the star nodelist and add
// fill star classes while removing empty star classes. Break after 
// after changing the star that triggered event
function fillStar({target}) {

  if (!freezeStar) {
    for (const starNode of starArray) {
      starNode.classList.add("fa-solid")
      starNode.classList.remove("fa-regular")
      starNode.style.color = "#ffd952"
      
      if (target.id === starNode.id ) {
        break
      }
    }
  }
}

// Add and remove classes to return star to unfilled star.
function unFillStar() {
  if (!freezeStar) {
    for (const starNode of starArray) {
      starNode.classList.add("fa-regular")
      starNode.classList.remove("fa-solid")
      starNode.style.color = ""
    }
  }
}

// When a star is clicked, set the boolean freezeStar to opposite of current value 
// (e.g. if true, set to false) so stop any more changes. And set the value of 
//the hidden rating input field to the rating of star that was clicked by selecting 
// the last digit on the id If star is clicked again while froze it will unfreeze it. 
function setStar({target}) {
  if (freezeStar) {
    freezeStar = !freezeStar
    return
  } 
  else {
    const rating = target.id.at(-1)
    ratingInput.value = rating
    freezeStar = !freezeStar
  }
} 

// ========== SWITCH FORMS SCRIPTS ========== //

// Get elements for 2 form fields
const recommendationFormField = document.getElementById("recommendation-form-field");
const contactFormField = document.getElementById("contact-form-field");

// Get elements for 2 form select buttons
const selectContactBtn = document.getElementById("select-contact");
const selectRecommendBtn = document.getElementById("select-recommend");

// Store which button is currently selected using id. Default recommendation form
let selectedBtnId = selectRecommendBtn.id;

// Add mouse event listeners for recommendation form select button
selectRecommendBtn.addEventListener("mousemove", hoverFormSelectBtn)
selectRecommendBtn.addEventListener("mouseleave", leaveFormSelectBtn)
selectRecommendBtn.addEventListener("click", selectForm)

// Add mouse event listeners for contact form select button 
selectContactBtn.addEventListener("mousemove", hoverFormSelectBtn)
selectContactBtn.addEventListener("mouseleave", leaveFormSelectBtn)
selectContactBtn.addEventListener("click", selectForm)

// Adds the hoveredBtn class to the button that triggers the event
function hoverFormSelectBtn({target}) {
  if (target.id !== selectedBtnId) {
    target.classList.add("hoveredBtn")
  }
}

// Removes the hoveredBtn class from the button that triggers the event
function leaveFormSelectBtn({target}) {
  target.classList.remove("hoveredBtn")
  
}

// When the event is triggered, queries the element using the id stored in
// selectedBtnId global variable. Removes the pressedBtn class from that element.
// Then assigns the id of the button that triggered the event to the selectedBtnId
// and adds the pressedBtn class to it. If the currentlySelected element is not
// the same as the button that triggered the event. Invert the hidden boolean of both forms
function selectForm({target}) {
  const currentSelected = document.getElementById(selectedBtnId);
  currentSelected.classList.remove("pressedBtn")
  
  selectedBtnId = target.id;
  target.classList.add("pressedBtn")

  if (currentSelected !== target) {
    recommendationFormField.hidden = !recommendationFormField.hidden
    contactFormField.hidden = !contactFormField.hidden
  }
}

// ========== SUBMIT FORM DATA SCRIPTS ========== //

const recommendationForm = document.getElementById("recommendation-form");
const recommendationPosts = document.getElementById("recommendations-container")

const recommendationData = getData();
updateRecommendationsList(recommendationData);


recommendationForm.addEventListener("submit", handleFormSubmission)


function handleFormSubmission(e) {
  e.preventDefault();
  const formData = new FormData(e.target)
  const recommendationObj = {
    rating: formData.get("rating"),
    name: formData.get("name"),
    recommendationMessage: formData.get("recommendation")
  };
  recommendationData.push(recommendationObj)
  updateRecommendationsList(recommendationData);
}

function updateRecommendationsList(recommendationData) {
  recommendationPosts.innerHTML = null;
  for (const post of recommendationData) {

    const article = document.createElement("article");
    const h4 = document.createElement("h4");
    const div = document.createElement("div");
    const star = [];
    const p = document.createElement("p");
    
    h4.innerText = post.name;
    
    for (let i=1; i<=5; i++) {
      star[i] = document.createElement("i")
      
      if (i <= post.rating) {
        star[i].classList.add("fa-solid", "fa-star")
        star[i].style.color = "#ffd952";
      } else {
        star[i].classList.add("fa-regular", "fa-star")
      }
      div.appendChild(star[i])
    }
    
    p.innerText = post.recommendationMessage;
    
    article.append(h4, div, p)
    article.classList.add("user-recommendation")
    
    recommendationPosts.appendChild(article)
  }
}

function getData() {
  const data = [
    {
      name: "Brendon Luicien",
      rating: 5,
      recommendationMessage: "Awesome"
    },
    {
      name: "John Doe",
      rating: 5,
      recommendationMessage: "Cool"
    }
  ]

  return data;
}