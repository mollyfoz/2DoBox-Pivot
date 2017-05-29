var listArray = []
$(document).on('input', enableSaveButton);

$(document).ready(getLocalItems);

function getLocalItems() {
  if (localStorage.getItem('listArray')) {
    var retrieve = JSON.parse(localStorage.getItem('listArray'));
    retrieve.forEach(function(element) {
      buildNewCard(element.title, element.body, element.quality, element.id);
    });
  }
};

function enableSaveButton() {
var listTitle = $('.title-input').val();
var listBody = $('.body-input').val();
  if (listTitle === "" || listBody === "") {
    $('.save-btn').prop('disabled', true)
  } else {$('.save-btn').prop('disabled', false)
  }
};

function ItemConstructor(title, body, quality) {
  this.id = Date.now();
  this.title = title;
  this.body = body;
  this.quality = quality;
};

function buildNewCard (title, body, quality, id) {
  var listTitle = $('.title-input').val() || title;
  var listBody = $('.body-input').val() || body;
  var itemQuality = quality || "swill";
  prependNewCard(listTitle, listBody, itemQuality);
};

function prependNewCard(listTitle, listBody, itemQuality) {
  var newItem = new ItemConstructor(listTitle, listBody, itemQuality);
  $('.list-ctnr').prepend(`
      <article class="list-item" id="${newItem.id}">
        <div aria-label="item-title" class="item-title">
          <h2 id="to-do-title" contenteditable="true">${newItem.title}</h2>
          <button class="delete icon"></button>
        </div>
        <p contenteditable="true" class="item-body">${newItem.body}</p>
        <div class="item-worth">
          <button class="up-vote"></button>
          <button class="down-vote icon"></button>
          <p>quality: <span id="vote">${newItem.quality}</span></p>
        </div>
        <hr>
      </article>
    `)
  listArray.push(newItem);
  addToLocal(newItem);
};

function addToLocal(idea) {
  localStorage.setItem('listArray', JSON.stringify(listArray));
};

function saveCard() {
  var listTitle = $('.title-input').val();
  var listBody = $('.body-input').val();
  var newItem = {title: listTitle, body: listBody};
  buildNewCard(newItem);
  reset();
};

function reset(){
  $('.title-input').val('');
  $('.body-input').val('');
  $('.save-btn').prop('disabled', true);
};

function removeCard() {
  var cardId = parseInt($(this).closest('.list-item').attr('id'));
  listArray.forEach(function(item, index) {
    if (item.id === cardId) {
      listArray.splice(index, 1);
    }
    addToLocal();
  });
  var indivdualCard = document.getElementById(cardId);
  indivdualCard.remove();
};

function editTitle() {
  var id = $(event.target).closest('.list-item')[0].id;
  var newTitle = $(event.target).text();
  listArray.forEach(function(card) {
    if (card.id == id) {
      card.title = newTitle;
    }
  })
  addToLocal();
};

function editBody() {
  var id = $(this).parents('.list-item')[0].id;
  var newBody = $(this).text();
  listArray.forEach(function(card) {
    if (card.id == id) {
      card.body = newBody;
    }
  })
  addToLocal();
};

function upvote() {
  var qualityInput = $(event.target).closest('.list-item').find('#vote');
    if (qualityInput.text() === 'swill') {
      qualityInput.text('plausible');
    } else if (qualityInput.text() === 'plausible') {
      qualityInput.text('genius')
    }
};

function upvoteStorage() {
  upvote();
  updateLocalQuality();
};

function downvote() {
  var qualityInput = $(event.target).closest('.list-item').find('#vote');
    if (qualityInput.text() === 'genius') {
      qualityInput.text('plausible');
    } else if (qualityInput.text() === 'plausible') {
      qualityInput.text('swill')
    }
};

function downvoteStorage() {
  downvote();
  updateLocalQuality();
};

function updateLocalQuality() {
  var qualityInput = $(event.target).closest('.list-item').find('#vote');
  var thisId = $(event.target).parent().parent().prop('id');
  var parsedQuality = JSON.parse(localStorage.getItem('listArray'));
    parsedQuality.forEach(function(element) {
      if (thisId == element.id) {
      element.quality = qualityInput.text();
      }
    });
  listArray = parsedQuality;
  addToLocal();
};

function prependExistingCard(filtered) {
  $('.list-ctnr').prepend(`
      <article class="list-item" id="${filtered.id}">
        <div aria-label="item-title" class="item-title">
          <h2 id="to-do-title" contenteditable="true">${filtered.title}</h2>
          <button class="delete icon"></button>
        </div>
        <p contenteditable="true" class="item-body">${filtered.body}</p>
        <div class="item-worth">
          <button class="up-vote"></button>
          <button class="down-vote icon"></button>
          <p>quality: <span id="vote">${filtered.quality}</span></p>
        </div>
        <hr>
      </article>
    `)
};

function searchItems() {
  var searchResult = $(this).val().toUpperCase();
  var results = listArray.filter(function(idea) {
   return idea.title.toUpperCase().includes(searchResult) || idea.body.toUpperCase().includes(searchResult)
  })
  $('.list-ctnr').empty();
  results.forEach(function(result) {
  prependExistingCard(result);
 })
};

$('.save-btn').on('click', saveCard);

$('.search-input').on('input', searchItems);

$('.list-ctnr').on('input', '#to-do-title', editTitle);

$('.list-ctnr').on('input', '.item-body', editBody);

$('.list-ctnr').on('click', '.up-vote', upvoteStorage);

$('.list-ctnr').on('click', '.down-vote', downvoteStorage);

$('.list-ctnr').on('click', '.delete', removeCard);
