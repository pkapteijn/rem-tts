function saveSentence() {
    const text = document.getElementById('inputText').value;
    const lang = document.querySelector('#lang-select1').value.toLowerCase(); // || "it";
    console.log("lang:  " + lang)  
    fetch('http://localhost:3000/sentences', {
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
        getSentencesInTable()
    })
    .catch(error => console.error('Error:', error));
}

document.addEventListener('DOMContentLoaded', getSentencesInTable()); 
function getSentencesInTable() {
    // Replace 'your-api-url' with the actual API URL
    fetch('http://localhost:3000/sentences')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('data-table');
            tableBody.innerHTML = ''; 
            data.forEach(item => {
                const row = document.createElement('tr');
                let phraseId = 'phrase-' + item.id;
                let delId = 'del' + item.id;  
                row.innerHTML = `
                    <td>${item.id}</td>
                    <td><div id="${phraseId}"><a href="#">${item.sentence}</a></div></td>
                    <td>${item.language}</td>
                    <td><div id="${delId}"><button class="btn btn-secondary btn-sm" onclick="deleteSentence()">Delete</button></div></td>
                `;
                tableBody.appendChild(row);
                document.getElementById(phraseId).phrase = item; 
                document.getElementById(delId).phrase = item;
                document.getElementById(phraseId).removeEventListener('click', speak); 
                document.getElementById(delId).removeEventListener('click', deleteSentence); 
                document.getElementById(phraseId).addEventListener('click', speak); 
                document.getElementById(delId).addEventListener('click', deleteSentence); 
 
                
            });
        })
        .catch(error => console.error('Error fetching data:', error));
};

function speak(event) {
    //const item = (event && event.hasOwnProperty('currentTarget') && event.currentTarget.hasOwnProperty('phrase')) ? 
    //    event.currentTarget.phrase :  undefined ; 
    //console.log("item", event.currentTarget.phrase)
    const text = (event && event.currentTarget) ? event.currentTarget.phrase.sentence : document.getElementById('inputText').value;
    const lang = (event && event.currentTarget) ? event.currentTarget.phrase.language : document.querySelector('#lang-select1').value.toLowerCase(); // || "it";
    const player = document.getElementById('player'); 
    const input = document.getElementById('inputText'); 
    console.log("lang:  " + lang)
    const url = 'http://localhost:3000/sentences/tts' +
        '?sentence=' +
        encodeURIComponent(text) +
        '&language=' +
        encodeURIComponent(lang); 
    player.src = url; 
    player.play(); 
        
    // update the sentences table
    getSentencesInTable(); 
    input.value = ""; 
    input.focus(); 
};

function deleteSentence(event) {
    console.log("item", event.currentTarget.phrase)
    const itemId = event.currentTarget.phrase.id; 
    fetch('http://localhost:3000/sentences/' + itemId, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(() => {
        getSentencesInTable()
    })
    .catch(error => console.error('Error:', error));
}
