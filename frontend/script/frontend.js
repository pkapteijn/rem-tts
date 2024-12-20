let getUrl = window.location;
let baseUrl = getUrl.protocol + "//" + getUrl.host;
let port =  getUrl.host === 'localhost'? 3000: 80

const baseURL = baseUrl + ':' + port

function saveSentence() {
    const text = document.getElementById('inputText').value;
    const lang = document.querySelector('#lang-select1').value.toLowerCase(); // || "it";
    console.log("lang:  " + lang)  
    fetch(baseURL + '/sentences', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sentence: text, 
            language: lang
         })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        getMostUsedSentences()
    })
    .catch(error => console.error('Error:', error));
}

document.addEventListener('DOMContentLoaded', getMostUsedSentences());

function getMostUsedSentences() {
    fetch(baseURL + '/sentences')
        .then(response => response.json())
        .then(data => {
            removeCardRows(data.length, 6, 'card-container-most-used'); 
            addCardRows(data.length, 6, 'card-container-most-used'); 

            addCardsToRows(data, 6, 'card-row-most-'); 
            addEventListeners(data.length); 
        })
        .catch(error => console.error('Error fetching data:', error));
};


function speak(event) {
    // if event present, triggered from existing sentences,  else from input button
    let text = (event && event.currentTarget) ? event.currentTarget.phrase.sentence : document.getElementById('inputText').value;
    text = text.trim(); //  strip trailing and leading whitespaces
    const lang = (event && event.currentTarget) ? event.currentTarget.phrase.language : document.querySelector('#lang-select1').value.toLowerCase(); // || "it";
    const player = document.getElementById('player'); 
    const input = document.getElementById('inputText'); 

    const url = baseURL + '/sentences/tts' +
        '?sentence=' +
        encodeURIComponent(text) +
        '&language=' +
        encodeURIComponent(lang); 
    player.src = url; 
    player.play(); 
        
    // update the sentences table
    getMostUsedSentences(); 
    input.value = ""; 
    input.focus(); 
};

function deleteSentence(event) {
    console.log("item", event.currentTarget.phrase)
    event.stopPropagation(); 
    const itemId = event.currentTarget.phrase.id; 
    fetch(baseURL + '/sentences/' + itemId, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(() => {
        getMostUsedSentences(); 
    })
    .catch(error => console.error('Error:', error));
}
