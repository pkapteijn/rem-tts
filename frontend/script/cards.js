const sen = [{"id":56,"sentence":"ciao","language":"it","times_used":14,"last_used":"2024-09-22T17:52:46.066Z"},{"id":31,"sentence":"Ciaone","language":"it","times_used":9,"last_used":"2024-09-22T17:33:53.608Z"},{"id":33,"sentence":"He hallo","language":"nl","times_used":8,"last_used":"2024-09-22T17:05:12.916Z"},{"id":46,"sentence":"ciao bella, ti va di guardare il sito delle tasse automobilistiche adesso?  ","language":"it","times_used":5,"last_used":"2024-09-21T18:24:58.160Z"},{"id":38,"sentence":"e andiamo ","language":"it","times_used":5,"last_used":"2024-09-21T18:21:08.756Z"},{"id":58,"sentence":"ciao ","language":"it","times_used":4,"last_used":"2024-09-22T17:32:20.545Z"},{"id":47,"sentence":"fra zio","language":"it","times_used":3,"last_used":"2024-09-21T18:48:52.792Z"},{"id":39,"sentence":"un altro frase","language":"it","times_used":3,"last_used":"2024-09-21T18:50:53.930Z"},{"id":51,"sentence":"there we go again","language":"en","times_used":2,"last_used":"2024-09-21T18:25:41.454Z"},{"id":43,"sentence":"ciao bello ","language":"it","times_used":2,"last_used":"2024-09-21T15:26:16.929Z"},{"id":25,"sentence":"ciaone mitico ","language":"it","times_used":2,"last_used":"2024-09-21T17:58:36.530Z"},{"id":50,"sentence":"het gaat lekker zo!","language":"nl","times_used":2,"last_used":"2024-09-21T18:25:24.200Z"},{"id":57,"sentence":"sasa","language":"it","times_used":1,"last_used":"2024-09-22T16:38:11.293Z"},{"id":48,"sentence":"fra zio ","language":"it","times_used":1,"last_used":"2024-09-21T17:36:05.221Z"},{"id":49,"sentence":"dammi un pacco sulle spalle ","language":"it","times_used":1,"last_used":"2024-09-21T17:48:06.199Z"},{"id":55,"sentence":"nuova frase ","language":"it","times_used":1,"last_used":"2024-09-22T12:01:11.195Z"},{"id":52,"sentence":"ehi bella ","language":"en","times_used":1,"last_used":"2024-09-21T17:59:07.623Z"},{"id":54,"sentence":"che buono, le medicine !","language":"it","times_used":1,"last_used":"2024-09-21T18:00:17.801Z"},{"id":59,"sentence":"hela","language":"it","times_used":1,"last_used":"2024-09-22T17:53:30.647Z"},{"id":26,"sentence":"fra","language":"it","times_used":1,"last_used":"2024-09-17T20:05:35.558Z"},{"id":30,"sentence":"we hebben lol","language":"nl","times_used":1,"last_used":"2024-09-18T16:15:25.927Z"},{"id":42,"sentence":"ciao  bello, oggi è una bella giornata ","language":"it","times_used":1,"last_used":"2024-09-21T14:52:19.805Z"}]
const cardIndexPrefix = "card-most-"; 
const delIndexPrefix = 'card-del-'; 
const rowIndexPrefix = 'card-row-most-'; 

function addCardRows(nrCards, nrCardsPerRow, id) {
    let nrRows = Math.floor(nrCards/nrCardsPerRow) +1; 
    let draft = document.getElementById(id); 

    for(let i=1; i<=nrRows; i++) {
        let newRow = document.createElement('div'); 
        newRow.setAttribute("class", "row p-2"); 
        newRow.setAttribute('id', rowIndexPrefix + i.toString());  
        draft.appendChild(newRow); 
    }
}

function removeCardRows(nrCards, nrCardsPerRow, id) {
    let nrRows = Math.floor(nrCards/nrCardsPerRow) +1; 
    let container = document.getElementById(id); 

    for(let i=1; i<=nrRows; i++) {
        let row = document.getElementById(rowIndexPrefix + i.toString()); 
        if(row) {
            container.removeChild(row); 
        }
    }
}


function getNewColumn(colId) {
    const column = document.createElement('div'); 
    column.setAttribute("class", "col-lg-2  d-'flex"); 
    column.setAttribute("id", "card-col-" + colId); 
    
    return column; 
}

function getNewCard(sentenceItem,  index) {
    const maxTextLength = 50; 
    const cardIndex = cardIndexPrefix + index.toString(); 
    const delIndex = delIndexPrefix + index.toString(); 

    const card = document.createElement('div')
    card.setAttribute("class", "card text-white bg-primary  flex-fil h-100"); 
    card.setAttribute("style", "max-width: 20rem;"); 
    card.setAttribute("id", cardIndex); 
    card.phrase = sentenceItem;   // pass object for eventlistener

    const cardBody = document.createElement('div');
    cardBody.setAttribute("class", "card-body"); 

    const badge = document.createElement("span"); 
    badge.setAttribute("class", "badge rounded-pill bg-warning badge-pill-close"); 
    badge.setAttribute("id", delIndex); 
    badge.innerHTML = '×'; 
    badge.phrase = sentenceItem;  // object for eventlistener 

    const cardText = document.createElement('p'); 
    cardText.setAttribute("class", "card-text"); 
    cardText.innerHTML = (sentenceItem.sentence.length > maxTextLength) ? 
        sentenceItem.sentence.substring(0, maxTextLength)+'...' : 
        sentenceItem.sentence; 

    cardBody.appendChild(badge); 
    cardBody.appendChild(cardText); 
    card.appendChild(cardBody); 

    return card; 
}

function addCardsToRows(elements, nrCardsPerRow, rowIdPrefix) {
    const nrElements = elements.length; 
    let rowId = 1; 
    let colId = 1; 


    for (let i=0;  i< nrElements; i++)    {
        rowId = Math.floor(i/nrCardsPerRow) + 1; 
        colId = (i % nrCardsPerRow) + 1; 
        let row = document.getElementById(rowIdPrefix + rowId.toString());
        let newColumn = getNewColumn(colId);  
        let newCard = getNewCard(elements[i], i); 
        newColumn.appendChild(newCard);
        row.appendChild(newColumn); 

    }
}

function addEventListeners(length) {
    for (let i=0; i < length; i++) {
    // set eventlisteners for click actions
    document.getElementById(cardIndexPrefix + i.toString()).addEventListener('click', speak); 
    document.getElementById(delIndexPrefix + i.toString()).addEventListener('click', deleteSentence); 

    }
}

