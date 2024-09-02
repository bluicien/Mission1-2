// ========== CREATE REVIEW CLASS ========== //

class Review {
  // Review class constructor
  constructor (name, rating, recommendationMessage) {
    this.name = name // Name of user
    this.rating = rating // Rating user gave
    this.recommendationMessage = recommendationMessage // User message
    Review.numOfRecommends++; // Increment total number of recommendations for each instance created
    Review.countTally(rating) // Pass the user rating into the tally counting static method
  }
  
  // Static property for total number of recommendations
  static numOfRecommends = 0
  // Static property for counting each rating given
  static ratingCount = {
    oneStar: 0,
    twoStar: 0,
    threeStar: 0,
    fourStar: 0,
    fiveStar: 0
  }

  // Static method that takes 1 argument and increments the rating count tally for the rating that was passed in
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

// Query HTML elements for form and container for HTML posts
const recommendationForm = document.getElementById("recommendation-form");
const recommendationPosts = document.getElementById("recommendations-container");

// Retrieve dummy data
const recommendationData = getData();

// Update recommendations with dummy data
updateRecommendationsList(recommendationData);

// Update the horizontal bar graph of ratings
updateTally();

// Add form submit event to recommendation form
recommendationForm.addEventListener("submit", handleFormSubmission)

// Call back function to handle recommendation for submission
function handleFormSubmission(e) {
  e.preventDefault(); // Override default for clear

  // Create formData object by parsing form into FormData Class
  const formData = new FormData(e.target)

  // Create review object by parsing form data object into Review Class
  // e.g Review(name, rating, recommendationMessage)
  const recommendationObj = new Review(
    formData.get("name"),
    Number(formData.get("rating")),
    formData.get("recommendation"),
  )
  // OLD METHOD WITHOUT CLASS
  // const recommendationObj = {
  //   name: formData.get("name"),
  //   rating: Number(formData.get("rating")),
  //   recommendationMessage: formData.get("recommendation")
  // };
  console.log(recommendationData)

  // Push newly created review object to recommendationData array
  recommendationData.push(recommendationObj)

  // Update recommendation list with updated recommendationData array
  updateRecommendationsList(recommendationData);

  // Update horizontal bar graph with new ratings
  updateTally();

  // If user gave rating higher than 3, throw confetti with thank you alert
  // Otherwise alert with thank you for feedback.
  if (Number(formData.get("rating")) > 3) {
      confetti({
        particleCount: 300,
        startVelocity: 30,
        spread: 1000,
        origin: {
          x: 0.5,
          y: 0
        }
      });
    // alert("Thank you for your recommendation!🎉")
  } else {
    // alert("Thank you for your feedback. I will strive to improve!")
  }
}

// Re-renders the User Feedback section with data from recommendations array
function updateRecommendationsList(recommendationData) {

  // Clears current posts
  recommendationPosts.innerHTML = "";

  // Loop through recommendations data array
  for (const post of recommendationData) {

    // Create elements to fill with user recommendations data
    const article = document.createElement("article"); // Container for each user feedback
    const h4 = document.createElement("h4"); // User's name
    const div = document.createElement("div"); // Container for stars for rating
    const star = []; // Array where each element will be filled with a star icon based on user rating
    const p = document.createElement("p"); // User message
    const emoticon = document.createElement("i") // Icon to show emotion of user feedback
    
    // Add user's name to h4 innerText with space at end to concatenate with emoticon later
    h4.innerText = post.name + " ";

    // Depending on user rating, fill emoticon element with a happy, neutral or sad icon
    if (post.rating > 3) {
      emoticon.classList.add("fa-regular", "fa-face-smile")
      emoticon.style.color = "#1ba300"
      // h4.innerHTML += ' <i class="fa-regular fa-face-smile" style="color: #63E6BE;"></i>'
    } else if (post.rating === 3) {
      emoticon.classList.add("fa-regular", "fa-face-meh")
      emoticon.style.color = "#FFD43B"
      // h4.innerHTML += ' <i class="fa-regular fa-face-meh" style="color: #FFD43B;"></i>'
    } else {
      emoticon.classList.add("fa-regular", "fa-face-frown")
      emoticon.style.color = "#ff0000"
      // h4.innerHTML += ' <i class="fa-regular fa-face-frown" style="color: #ff0000;"></i>'
    }
    // Append emoticon to end of h4 for user name
    h4.appendChild(emoticon)
    
    // Loop from 1-5 for user ratings
    for (let i=1; i<=5; i++) {
      // Created an i tag and store in star array at position i
      star[i] = document.createElement("i")
      
      // If i is <= to the rating user gave, add class and styling for a filled star
      // else, add class for empty star
      if (i <= post.rating) {
        star[i].classList.add("fa-solid", "fa-star")
        star[i].style.color = "#ffd952";
      } else {
        star[i].classList.add("fa-regular", "fa-star")
      }

      // Append star at position i to div
      div.appendChild(star[i])
    }
    
    // Set innerText of p tag to the user's recommendation message
    p.innerText = post.recommendationMessage;
    
    // Append h4, div and p tags to the article element
    article.append(h4, div, p)
    // Add user-recommendation to article element
    article.classList.add("user-recommendation")
    // Append article element to the recommendationPosts, container for user feedback
    recommendationPosts.appendChild(article)
  }
}

// Created data to seed initially
function getData() {
    const review1 = new Review("John Doe", 5, "Awesome");
    const review2 = new Review("Brendon Luicien", 5, "Cool");
    const data = [ review1, review2 ]

    return data;
}


// ========== RECOMMENDATIONS COUNTER FUNCTIONS ========== //

// Update the horizontal bar graph with current data
function updateTally() {
  // Get element that displays total recommendations
  const numOfRecommendations = document.getElementById("num-recommendations");
  // Update display for total recommendation by accessing static property in Review Class
  numOfRecommendations.innerHTML = Review.numOfRecommends;

  // Retrieve object of rating count for each star by accessing the static property of rating count in Review Class
  const ratingTally = Review.ratingCount;

  // Get the actual width of horizontal bar on document
  const starContainerWidth = document.getElementsByClassName("star-overview")[0].getBoundingClientRect().width * 0.80;

  // Loop from 1-5 for each rating
  for(let i=1; i<=5; i++) {
    
    // Get each rating bar by inputting the value of i into the last character of the bar-i class
    const ratingBar = document.getElementById(`bar-${i}`);

    // Using switch statement. Fill each bar by the percentage of total recommendations it has
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

  // Calculate percentage of the total recommendations and fill the bar
  function fillBar(numStar, barElement) {
    // Percentage current rating has over total recommendations
    const percentage = numStar / Review.numOfRecommends;
    // Calculate how many pixels of the bar container should be filled with the percentage
    const barFillPercentage = percentage * starContainerWidth;
    // Fill the bar by setting the width of the bar with inline styling
    barElement.style.width = `${barFillPercentage}px`
  }
}


// REPLACED WITH STATIC PROPERTY IN Review Class

// function countRatings(recommendationArr) {
//   const ratingCountObj = {
//     oneStar: 0,
//     twoStar: 0,
//     threeStar: 0,
//     fourStar: 0,
//     fiveStar: 0,
//     total: 0
//   }

//   for (const post of recommendationArr) {
//     switch (post.rating) {
//       case 1:
//         ratingCountObj.oneStar++;
//         ratingCountObj.total++;
//         break;
//       case 2:
//         ratingCountObj.twoStar++;
//         ratingCountObj.total++;
//         break;
//       case 3:
//         ratingCountObj.threeStar++;
//         ratingCountObj.total++;
//         break;
//       case 4:
//         ratingCountObj.fourStar++;
//         ratingCountObj.total++;
//         break;
//       case 5:
//         ratingCountObj.fiveStar++;
//         ratingCountObj.total++;
//         break;
//       default:
//         break;
//     }
//   }
//   return ratingCountObj;
// }