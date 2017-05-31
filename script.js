var listArray = []
$(document).on('input', enableSaveButton);

$(document).ready(getLocalItems);

$(document).ready(hideCompleted);

function getLocalItems() {
  if (localStorage.getItem('listArray')) {
    var retrieve = JSON.parse(localStorage.getItem('listArray'));
    retrieve.forEach(function(element) {
      buildNewCard(element.title, element.body, element.quality, element.id, element.completeBckgndColor);
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

function ItemConstructor(title, body, quality, completeBckgndColor) {
  this.id = Date.now();
  this.title = title;
  this.body = body;
  this.quality = quality;
  this.completeBckgndColor = completeBckgndColor;

};

function buildNewCard (title, body, quality, id, completeBckgndColor) {
  var listTitle = $('.title-input').val() || title;
  var listBody = $('.body-input').val() || body;
  var itemQuality = quality || "Normal";
  var itemCmpltColor = completeBckgndColor || "";
  prependNewCard(listTitle, listBody, itemQuality, completeBckgndColor);
};

function prependNewCard(listTitle, listBody, itemQuality, completeBckgndColor) {
  var newItem = new ItemConstructor(listTitle, listBody, itemQuality, completeBckgndColor);
  $('.list-ctnr').prepend(`
    <article class="list-item ${newItem.completeBckgndColor}" id="${newItem.id}">
      <div aria-label="item-title" class="item-title">
        <h2 id="to-do-title" contenteditable="true">${newItem.title}</h2>
        <button class="delete icon"></button>
      </div>
      <p contenteditable="true" class="item-body">${newItem.body}</p>
      <div class="item-worth">
        <button class="up-vote"></button>
        <button class="down-vote icon"></button>
        <p>quality: <span id="vote">${newItem.quality}</span></p>
        <button class="complete-task">Complete Me</button>
      </div>
      <hr>
    </article>
    `)
  listArray.push(newItem);
  addToLocal(newItem);
};

function addToLocal() {
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

function updateLocalQuality() {
  var qualityInput = $(event.target).closest('.list-item').find('#vote');
  var thisId = $(event.target).parent().parent().prop('id');
  var parsedArray = JSON.parse(localStorage.getItem('listArray'));
    parsedArray.forEach(function(element) {
      if (thisId == element.id) {
      element.quality = qualityInput.text();
      }
    });
  listArray = parsedArray;
  addToLocal();
};

function upvote() {
  var qualityInput = $(event.target).closest('.list-item').find('#vote');
    if (qualityInput.text() === 'None') {
      qualityInput.text('Low');
    } else if (qualityInput.text() === 'Low') {
      qualityInput.text('Normal');
    } else if (qualityInput.text() === 'Normal') {
      qualityInput.text('High');
    } else if (qualityInput.text() === 'High') {
      qualityInput.text('Critical');
    }
};

function upvoteStorage() {
  upvote();
  updateLocalQuality();
};

function downvote() {
  var qualityInput = $(event.target).closest('.list-item').find('#vote');
  if (qualityInput.text() === 'Critical') {
    qualityInput.text('High');
  } else if (qualityInput.text() === 'High') {
    qualityInput.text('Normal');
  } else if (qualityInput.text() === 'Normal') {
    qualityInput.text('Low');
  } else if (qualityInput.text() === 'Low') {
    qualityInput.text('None');
  }
};

function downvoteStorage() {
  downvote();
  updateLocalQuality();
};

function completedTask() {
  cardComplete();
}

function cardComplete() {
  $(event.target).closest('.list-item').toggleClass('item-complete');
  var thisId = $(event.target).parent().parent().prop('id');
  var parsedArray = JSON.parse(localStorage.getItem('listArray'));
    parsedArray.forEach(function(element) {
      if (thisId == element.id) {
        if (element.completeBckgndColor !== '') {
          element.completeBckgndColor = 'item-complete';
        } else {
          element.completeBckgndColor = '';
        }
      }
    });
  listArray = parsedArray;
  addToLocal();
  console.log(localStorage);
}

function hideCompleted() {
  $('.item-complete').hide();
}

function showCompleted() {
  $('.item-complete').show();
}
//============would be nice but not neccessary==============
// function removeCompleted() {
//   console.log(localStorage);
//   // var cardId = parseInt($(this).closest('.list-item').attr('id'));
//   listArray.forEach(function(item, index) {
//     if (item.completeBckgndColor === 'item-complete') {
//       listArray.splice(index, 1);
//     }
//     addToLocal();
//     console.log(localStorage);
//   });
// };

//=======not working yet====
function showCritical() {
  var notCrit = $('.list-item').find('#vote').text(!'Critical');
  console.log(notCrit);
  notCrit.hide();
  // var importance = $('#vote');
  // console.log(importance.text());
  // var card = $('.list-item');
  // if (importance.text() === 'Critical'){
  //   card.show();
  // } card.hide();
}

function prependExistingCard(filtered) {
  $('.list-ctnr').prepend(`
      <article class="list-item ${filtered.completeBckgndColor}" id="${filtered.id}">
        <div aria-label="item-title" class="item-title">
          <h2 id="to-do-title" contenteditable="true">${filtered.title}</h2>
          <button class="delete icon"></button>
        </div>
        <p contenteditable="true" class="item-body">${filtered.body}</p>
        <div class="item-worth">
          <button class="up-vote"></button>
          <button class="down-vote icon"></button>
          <p>quality: <span id="vote">${filtered.quality}</span></p>
          <button class="complete-task">Complete Me</button>
        </div>
        <hr>
      </article>
    `)
};

function searchItems() {
  var searchResult = $(this).val().toUpperCase();
  var results = listArray.filter(function(list) {
   return list.title.toUpperCase().includes(searchResult) || list.body.toUpperCase().includes(searchResult)
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

$('.list-ctnr').on('click', '.complete-task', completedTask);

$('#hide').on('click', hideCompleted);

$('#show').on('click', showCompleted);

$('#critical').on('click', showCritical);

$('#high').on('click', );

$('#normal').on('click', );

$('#low').on('click', );

$('#none').on('click', );
// $('#remove').on('click', removeCompleted);
