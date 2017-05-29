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
// getIdeasFromStorage();

$(document).on('input', enableSaveButton);

// on page load, grab localStorage
$(document).ready(getIdeasFromStorage)

// on save button click, build a new card
$('.save-button').on('click', function() {
  buildNewCard(newIdea);
  // addToLocal(newIdea);
  reset();
});

//Up-Vote Event
$('.idea-container').on('click', '.up-vote', upvoteStorage);

//Down-Vote Event
$('.idea-container').on('click', '.down-vote', downvoteStorage);

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
function IdeaConstructor(title, body, quality){
  this.id = Date.now();
  this.title = title;
  this.body = body;
  this.quality = quality;
}

//build a Card
function buildNewCard (title, body, quality, id){
  var parseExisting = JSON.parse(localStorage.getItem('ideaArray'));
  var ideaTitle = $('.title-input').val() || title;
  var ideaBody = $('.body-input').val() || body;
  // var ideaId = id;
  var ideaQuality = quality || "swill"

  var newIdea = new IdeaConstructor(ideaTitle, ideaBody, ideaQuality);
  $('.idea-container').prepend(`
      <article class="idea-card" id="${newIdea.id}">
        <div class="card-top">
          <h2 id="to-do-title" contenteditable="true">${newIdea.title}</h2>
          <button class="delete icon"></button>
        </div>
        <p contenteditable="true" class="idea-text">${newIdea.body}</p>
        <div class="card-bottom">
          <button class="up-vote"></button>
          <button class="down-vote icon"></button>
          <p>quality: <span id="vote">${newIdea.quality}</span></p>
        </div>
        <hr>
      </article>
    `)
    ideaArray.push(newIdea);
    addToLocal(newIdea);
  };

//add object to localStorage function
function addToLocal(idea){
  var stringifiedIdea = JSON.stringify(ideaArray);
  localStorage.setItem('ideaArray', stringifiedIdea);
};

// get object back from JSON function
function getIdeasFromStorage () {
  if (localStorage.getItem('ideaArray')) {
    var retrieve = JSON.parse(localStorage.getItem('ideaArray'));
    retrieve.forEach(function(element) {
      buildNewCard(element.title, element.body, element.quality, element.id);
    });
  }
};


//upvote button function :: not functional
function upvote() {
  var qualityInput = $(event.target).closest('.idea-card').find('#vote');
    if (qualityInput.text() === 'swill') {
      qualityInput.text('plausible');
    } else if (qualityInput.text() === 'plausible'){
      qualityInput.text('genius')
    }
}

function upvoteStorage() {
  upvote();
  var qualityInput = $(event.target).closest('.idea-card').find('#vote');
  var thisId = $(this).parent().parent().prop('id');
  var parsedQuality = JSON.parse(localStorage.getItem('ideaArray'));
    parsedQuality.forEach(function(element) {
      if (thisId == element.id) {
      element.quality = qualityInput.text();
      }
    });
  ideaArray = parsedQuality;
  addToLocal();
}

//downvote button
function downvote() {
  var qualityInput = $(event.target).closest('.idea-card').find('#vote');
    if (qualityInput.text() === 'genius') {
      qualityInput.text('plausible');
    } else if (qualityInput.text() === 'plausible'){
      qualityInput.text('swill')
    }
}

function downvoteStorage() {
  downvote();
  var qualityInput = $(event.target).closest('.idea-card').find('#vote');
  var thisId = $(this).parent().parent().prop('id');
  var parsedQuality = JSON.parse(localStorage.getItem('ideaArray'));
    parsedQuality.forEach(function(element) {
      if (thisId == element.id) {
      element.quality = qualityInput.text();
      }
    });
  ideaArray = parsedQuality;
  addToLocal();
}



function prependExistingCard(filtered) {
  $('.idea-container').prepend(`
      <article class="idea-card" id="${filtered.id}">
        <div class="card-top">
          <h2 id="to-do-title" contenteditable="true">${filtered.title}</h2>
          <button class="delete icon"></button>
        </div>
        <p contenteditable="true" class="idea-text">${filtered.body}</p>
        <div class="card-bottom">
          <button class="up-vote"></button>
          <button class="down-vote icon"></button>
          <p>quality: <span id="vote">${filtered.quality}</span></p>
        </div>
        <hr>
      </article>
    `)
}

$('.search-input').on('input', function() {
  var searchResult = $(this).val().toUpperCase();
              console.log(searchResult)
              console.log(ideaArray);
  var results = ideaArray.filter(function(idea) {
   return idea.title.toUpperCase().includes(searchResult) || idea.body.toUpperCase().includes(searchResult)
  })
  console.log(results)
  $('.idea-container').empty();
 results.forEach(function(result){
   prependExistingCard(result);
 })
})


// //Search Bar Function
// function searchTitle() {
//   var inputText = $('.search-input').val();
//   console.log(inputText)
//   if (inputText) {
//     $('.idea-card').find("h2:not(:contains(" + inputText + "))").closest('.idea-card').slideUp();
//     $('.idea-card').find("h2:contains(" + inputText + ")").slideDown()
// } else {
//   $('.idea-card').slideDown();
//   }
// };
//
// function searchBody() {
//     var inputText = $('.search-input').val();
//     if (inputText) {
//     $('.idea-card').find(".idea-text:not(:contains(" + inputText + "))").closest('.idea-card').slideUp();
//     $('.idea-card').find(".idea-text:contains(" + inputText + ")").slideDown();
//   } else {
//     $('.idea-card').slideDown();
//   }
// };

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
