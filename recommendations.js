// ========== CREATE REVIEW CLASS ========== //

class Review {
  
    constructor (name, rating, recommendationMessage) {
      this.name = name
      this.rating = rating
      this.recommendationMessage = recommendationMessage
      Review.numOfRecommends += 1;
      Review.countTally(rating)
    }
    
    static numOfRecommends = 0
    static ratingCount = {
      oneStar: 0,
      twoStar: 0,
      threeStar: 0,
      fourStar: 0,
      fiveStar: 0
    }
  
    static countTally(rating) {
      switch (rating) {
        case 1:
          Review.ratingCount.oneStar++;
          break;
        case 2:
          Review.ratingCount.twoStar++;
          break;
        case 3:
          Review.ratingCount.threeStar++;
          break;
        case 4:
          Review.ratingCount.fourStar++;
          break;
        case 5:
          Review.ratingCount.fiveStar++;
          break;
        default:
          break;
      }
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
  // Switch freezeStar to false if true to allow selecting a new value and return
  if (freezeStar) {
    freezeStar = !freezeStar;
    return
  } 
  else {
    // If freezeStar is false. Set hidden rating input field to value of suffix of id
    // of the star clicked
    const rating = target.id.at(-1)
    ratingInput.value = rating
    // Set freezeStar to true
    freezeStar = !freezeStar
  }
} 
  
// ========== SUBMIT FORM DATA SCRIPTS ========== //

const recommendationForm = document.getElementById("recommendation-form");
const recommendationPosts = document.getElementById("recommendations-container");
const recommendationData = getData();
updateRecommendationsList(recommendationData);
updateTally();


recommendationForm.addEventListener("submit", handleFormSubmission)


function handleFormSubmission(e) {
  e.preventDefault();
  const formData = new FormData(e.target)
  const recommendationObj = new Review(
    formData.get("name"),
    Number(formData.get("rating")),
    formData.get("recommendation"),
  )
  // const recommendationObj = {
  //   name: formData.get("name"),
  //   rating: Number(formData.get("rating")),
  //   recommendationMessage: formData.get("recommendation")
  // };
  console.log(recommendationData)
  recommendationData.push(recommendationObj)
  updateRecommendationsList(recommendationData);
  updateTally();

  if (Number(formData.get("rating")) > 3) {
      confetti({
        particleCount: 300,
        startVelocity: 30,
        spread: 1000,
        origin: {
          x: 0.5,
          // since they fall down, start a bit higher than random
          y: 0
        }
      });
    // alert("Thank you for your recommendation!🎉")
  } else {
    // alert("Thank you for your feedback. I will strive to improve!")
  }
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
    const review1 = new Review("John Doe", 5, "Awesome");
    const review2 = new Review("Brendon Luicien", 5, "Cool");
    const data = [ review1, review2 ]

    return data;
}


// ========== RECOMMENDATIONS COUNTER FUNCTIONS ========== //

function updateTally() {
  const numOfRecommendations = document.getElementById("num-recommendations");
  const ratingTally = countRatings(recommendationData);
  
  numOfRecommendations.innerHTML = recommendationData.length;
  const starContainerWidth = document.getElementsByClassName("star-overview")[0].getBoundingClientRect().width * 0.80;

  for(let i=1; i<=5; i++) {
    const ratingBar = document.getElementById(`bar-${i}`);
    switch (i) {
      case 1:
        fillBar(ratingTally.oneStar, ratingBar)
        break;
      case 2:
        fillBar(ratingTally.twoStar, ratingBar)
        break;
      case 3:
        fillBar(ratingTally.threeStar, ratingBar)
        break;
      case 4:
        fillBar(ratingTally.fourStar, ratingBar)
        break;
      case 5:
        fillBar(ratingTally.fiveStar, ratingBar)
        break;
      default:
        break;
    }

  }

  function fillBar(numStar, barElement) {
    const percentage = numStar / ratingTally.total;
    const barFillPercentage = percentage * starContainerWidth;
    barElement.style.width = `${barFillPercentage / 16}rem`
  }
}


function countRatings(recommendationArr) {
  const ratingCountObj = {
    oneStar: 0,
    twoStar: 0,
    threeStar: 0,
    fourStar: 0,
    fiveStar: 0,
    total: 0
  }

  for (const post of recommendationArr) {
    switch (post.rating) {
      case 1:
        ratingCountObj.oneStar++;
        ratingCountObj.total++;
        break;
      case 2:
        ratingCountObj.twoStar++;
        ratingCountObj.total++;
        break;
      case 3:
        ratingCountObj.threeStar++;
        ratingCountObj.total++;
        break;
      case 4:
        ratingCountObj.fourStar++;
        ratingCountObj.total++;
        break;
      case 5:
        ratingCountObj.fiveStar++;
        ratingCountObj.total++;
        break;
      default:
        break;
    }
  }
  return ratingCountObj;
}