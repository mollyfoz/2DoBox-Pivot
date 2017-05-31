var listArray = []
$(document).on('input', enableSaveButton);

$(document).ready(getLocalItems);

$(document).ready(hideCompleted);

$(document).ready(hideTenPlus);

function getLocalItems() {
  if (localStorage.getItem('listArray')) {
    var retrieve = JSON.parse(localStorage.getItem('listArray'));
    retrieve.forEach(function(element) {
      buildNewCard(element.title, element.body, element.quality, element.id, element.completedTask);
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

function ItemConstructor(title, body, quality, completedTask) {
  this.id = Date.now();
  this.title = title;
  this.body = body;
  this.quality = quality;
  this.completedTask = completedTask;

};

function buildNewCard (title, body, quality, id, completedTask) {
  var listTitle = $('.title-input').val() || title;
  var listBody = $('.body-input').val() || body;
  var itemQuality = quality || "Normal";
  var itemCompletedTask = completedTask || "";
  prependNewCard(listTitle, listBody, itemQuality, itemCompletedTask);
};

function prependNewCard(listTitle, listBody, itemQuality, itemCompletedTask) {
  var newItem = new ItemConstructor(listTitle, listBody, itemQuality, itemCompletedTask);
  $('.list-ctnr').prepend(`
    <article class="list-item ${newItem.completedTask}" id="${newItem.id}">
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
        <button class="complete-task">Completed Task</button>
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
  hideTenPlus();
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
  $(this).closest('.list-item').remove();
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
  var qualityArray = ['None', 'Low', 'Normal', 'High', 'Critical']
  var currentIndex = qualityArray.indexOf(qualityInput.text())
  var newQuality = qualityArray[currentIndex + 1];
  console.log(newQuality);
  qualityInput.text(newQuality);
}

function upvoteStorage() {
  upvote();
  updateLocalQuality();
};

function downvote() {
  var qualityInput = $(event.target).closest('.list-item').find('#vote');
  var qualityArray = ['None', 'Low', 'Normal', 'High', 'Critical']
  var currentIndex = qualityArray.indexOf(qualityInput.text())
  var newQuality = qualityArray[currentIndex - 1];
  qualityInput.text(newQuality);
};

function downvoteStorage() {
  downvote();
  updateLocalQuality();
};

function makeTaskComplete() {
  cardComplete();
}

function updateTaskStatus() {
  var thisId = $(event.target).closest('.list-item').prop('id');
  var parsedArray = JSON.parse(localStorage.getItem('listArray'));
  parsedArray.forEach(function(element) {
    if (thisId == element.id) {
      if (element.completedTask !== '') {
        element.completedTask = '';
      } else {
        element.completedTask = 'item-complete';
      }
    }
    listArray = parsedArray;
  })
}

function cardComplete() {
  $(event.target).closest('.list-item').toggleClass('item-complete');
  updateTaskStatus();
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
function removeCompleted() {
console.log(this);
  $(this).closest('.test').find('.item-complete').remove();
  addToLocal();
  listArray.forEach(function(item, index) {
    if (item.completedTask === 'item-complete') {
      listArray.splice(index, 1);
    }
    // addToLocal();
  });
  $(this).closest('.list-item').remove();
};



function filterBtns(btnQuality) {
  $('.list-ctnr').empty();
  btnQuality.forEach(function(result) {
    prependExistingCard(result);
  })
};

function showCritical() {
  var btnResults = listArray.filter(function(list) {
   return list.quality.includes('Critical');
  })
  filterBtns(btnResults)
};

function showHigh() {
  var btnResults = listArray.filter(function(list) {
   return list.quality.includes('High');
  })
  filterBtns(btnResults)
};

function showNormal() {
  var btnResults = listArray.filter(function(list) {
   return list.quality.includes('Normal');
  })
  filterBtns(btnResults)
};

function showLow() {
  var btnResults = listArray.filter(function(list) {
   return list.quality.includes('Low');
  })
  filterBtns(btnResults)
};

function showNone() {
  var btnResults = listArray.filter(function(list) {
   return list.quality.includes('None');
  })
  filterBtns(btnResults)
};

function showAll() {
  var btnResults = listArray;
  filterBtns(btnResults);
  }

function hideTenPlus() {
  $('.list-item').slice(10).hide();
}

function prependExistingCard(filtered) {
  $('.list-ctnr').prepend(`
      <article class="list-item ${filtered.completedTask}" id="${filtered.id}">
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
          <button class="complete-task">Completed Task</button>
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

$('.list-ctnr').on('click', '.complete-task', makeTaskComplete);

$('#hide').on('click', hideCompleted);

$('#show').on('click', showCompleted);

$('#critical').on('click', showCritical);

$('#high').on('click', showHigh);

$('#normal').on('click', showNormal);

$('#low').on('click', showLow);

$('#none').on('click', showNone);

$('#all').on('click', showAll);

$('#remove').on('click', removeCompleted);
