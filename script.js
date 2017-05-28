//***************************** Variables *****************************
//*********************************************************************
var ideaTitle = $('.title-input').val();
var ideaBody = $('.body-input').val();
var newIdea = {title: ideaTitle, body: ideaBody};
var ideaList = $('.idea-container');
var ideaArray = [];

//*********************************************************************
//*************************  EVENT LISTENERS  *************************
//*********************************************************************

$(document).on('input', function() {
  enableSaveButton();
  })

// on page load, grab localStorage
$(document).ready(function() {
  getIdeasFromStorage();
});

// on save button click, build a new card
$('.save-button').on('click', function() {
  buildNewCard(newIdea);
  addToLocal(newIdea);
  reset();
});

//Up-Vote Event
$('.idea-container').on('click', '.up-vote', function() {
  console.log('button works')
  upvote();
  addToLocal();
});

//Down-Vote Event
$('.idea-container').on('click', '.down-vote', function() {
  console.log('this button works')
  downvote();
  addToLocal();
});

//Delete idea cards from DOM and localStorage
$('.idea-container').on('click', '.delete', function() {
  var cardID = parseInt($(this).closest('.idea-card').attr('id'));
  console.log(cardID)
  ideaArray.forEach(function(idea, index){
    if (idea.id === cardID) {
      ideaArray.splice(index, 1);
      console.log(ideaArray);
    }
    localStorage.setItem('ideaArray', JSON.stringify(ideaArray));
  });
  var indivdualCard = document.getElementById(cardID);
  indivdualCard.remove();
});

//*********************************************************************
//***************************  Functions  *****************************
//*********************************************************************

//constructor function for creating new objects to save in localStorage
function IdeaConstructor(title, body){
  this.id = Date.now();
  this.title = title;
  this.body = body;
  this.quality = "swill";
}

//build a Card
function buildNewCard (title, body){
  var ideaTitle = $('.title-input').val() || title;
  var ideaBody = $('.body-input').val() || body;
  var ideaID = Date.now();
  var quality = "swill";
  var newIdea = new IdeaConstructor(ideaTitle, ideaBody);
  $('.idea-container').prepend(`
      <article class="idea-card" id="${ideaID}">
        <div class="card-top">
          <h2 id="to-do-title" contenteditable="true">${ideaTitle}</h2>
          <button class="delete icon"></button>
        </div>
        <p contenteditable="true" class="idea-text">${ideaBody}</p>
        <div class="card-bottom">
          <button class="up-vote"></button>
          <button class="down-vote icon"></button>
          <p>quality: <span id="vote">${quality}</span></p>
        </div>
        <hr>
      </article>
    `)
    ideaArray.push(newIdea);
  };

//add object to localStorage function
function addToLocal(idea){
  var stringifiedIdea = JSON.stringify(ideaArray);
  // console.log(stringifiedIdea)
  localStorage.setItem('ideaArray', stringifiedIdea);
};

// get object back from JSON function
  function getIdeasFromStorage () {
    console.log(localStorage.getItem('ideaArray'))
    if (localStorage.getItem('ideaArray')){
      var retrieve = JSON.parse(localStorage.getItem('ideaArray'));
          console.log("loading ideas ", retrieve)
      retrieve.forEach(function(element){
      var ideaNode = buildNewCard(element.title, element.body);
      ideaList.prepend(ideaNode);
      })
  } else {console.log('nothing here bitch')}
};

//upvote button function :: not functional
function upvote() {
  var qualityInput = $(this).closest().find('#vote';
  console.log(qualityInput);
  if (qualityInput.text() === 'swill') {
    $(this).siblings('p').children().text('plausible');
  } else if (qualityInput.text() === 'plausible'){
    qualityInput.text('genius')
  }
}

//downvote button function :: not functional
function downvote(){
  var qualityInput = $(this).closest('.quality')
  if (qualityInput.quality === 'genius'){
    qualityInput.text('plausible')
  }else if (qualityInput.text() === 'plausible'){
    qualityInput.text('swill')
  }
}

$('.search-input').on('input', search)

function search() {
  searchTitle();
  searchBody();
}
//Search Bar Function
function searchTitle() {
  var inputText = $('.search-input').val();
  console.log(inputText)
  if (inputText) {
    $('.idea-card').find("h2:not(:contains(" + inputText + "))").closest('.idea-card').slideUp();
    $('.idea-card').find("h2:contains(" + inputText + ")").slideDown()
} else {
  $('.idea-card').slideDown();
  }
};

function searchBody() {
    var inputText = $('.search-input').val();
    if (inputText) {
    $('.idea-card').find(".idea-text:not(:contains(" + inputText + "))").closest('.idea-card').slideUp();
    $('.idea-card').find(".idea-text:contains(" + inputText + ")").slideDown();
  } else {
    $('.idea-card').slideDown();
  }
};

//enable the save button function
function enableSaveButton()  {
var ideaTitle = $('.title-input').val();
var ideaBody = $('.body-input').val();
  if (ideaTitle === "" || ideaBody === "") {
    $('.save-button').prop('disabled', true)
  } else {$('.save-button').prop('disabled', false)
}
}

//reset input fields function
function reset(){
  $('.title-input').val('');
  $('.body-input').val('');
  $('.save-button').prop('disabled', true);
}

//contenteditable :: does not work :: is buggy
$('.idea-container').on('input', '#to-do-title', editTitle)

function editTitle() {
  var id = $(this).closest('.idea-card')[0].id;
  var newTitle = $(this).text();
  console.log(id)
  ideaArray.forEach(function(card){
    if (card.id == id) {
      card.title = newTitle;
    }
  })
  addToLocal();
}

$('.idea-container').on('input', '.idea-text', editBody)

function editBody() {
  var id = $(this).parents('.idea-card')[0].id;
  var newBody = $(this).text();
  console.log(id)
  ideaArray.forEach(function(card){
    if (card.id == id) {
      card.body = newBody;
    }
  })
  addToLocal();
}
//*********************************************************************
//******************  The Graveyard of Failed Ideas *******************
//*********************************************************************


//failed down-vote click
// $('.idea-container').on('click', '.down-vote', function() {
//   counter --;
//   if(counter <= 0) {
//     $('.down-vote').prop("disabled", true);
//   }
//   else if (counter > 0) {
//     $('.down-vote').prop("disabled", false)
//   }
//   console.log(counter)
// });

//failed attempt to save upvote
// function saveUpvote(){
//   var uniqueQuality = document.querySelector('.quality');
//   var uniqueTitle = document.querySelector('h2')
//   var uniqueBody = document.querySelector('.idea-tet')
//   console.log($(uniqueQuality).text());

  // ideaArray.forEach(function(idea, index){
  //   if (idea.quality === "swill"){
  //     $(uniqueQuality).text('plausible');
  //   }if (idea.quality === 'plausible'){
  //     $(uniqueQuality).text('genius');
  //   }
  // })
// };

// // failed idea to check Storage on page load
// function checkStorage () {
//   var stringifiedArr = localStorage.getItem(ideaArray);
//   ideaArray = JSON.parse(stringifiedArr) || [];
//   console.log('check storage function: ' + ideaArray);
// }
