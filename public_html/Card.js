/*
 * Script für die Verwaltung eines Karten-Objekts
 */

var mainCanvas = document.getElementById("mainCanvas");
var secondCanvas = document.getElementById("secondCanvas");

var context = mainCanvas.getContext("2d");
var secondContext = secondCanvas.getContext("2d");

/*
 * Construktor for Cards
 * @param {number} x position in pixel
 * @param {number} y position in pixel
 * @param {number} width width of the card (square)
 * @returns {Card}
 */
function Card(x, y, width){
    // parameters for Drawing
    this.x = x;
    this.y = y;
    this.width = width;
    this.background = "yellow";
    
    // parameters for gamelogic
    this.value = 0;
    this.numberGuessed = 0;
    this.wasClicked = false;
    
    return this;
}

/**
 * method to map the object to the screen
 * @param {Card} pCard object to be mapped
 * @returns {undefined} no return
 */
function reDrawCard(pCard){
    var width = pCard.width;
    var x = pCard.x;
    var y = pCard.y;
    
    console.log("reDrawCard: boolean wasClicked = " + pCard.wasClicked.toString());
    
    context.fillStyle=pCard.background;
    context.fillRect(x, y, width, width);
    
    if(pCard.wasClicked){
        context.fillStyle="black";
        context.fillText(pCard.numberGuessed, x, (y+10));
    }
}

/**
 * Method to refresh the Cards properties
 * @param {Card} pCard Card to be changed
 * @param {Number/String} pValue Value of Card to be shown and 
 * @param {String} pColor new background color
 * @returns {undefined} no return
 */
function setCardValue(pCard, pValue, pColor){
    pCard.value = pValue;
    pCard.background = pColor;
    
    secondContext.fillStyle="black";
    secondContext.fillText(pCard.value, (pCard.x+pCard.width/2), (pCard.y+pCard.width/2));
    context.fillStyle=pColor;
    context.fillRect(pCard.x, pCard.y, pCard.width, pCard.width);
}

function clearCard(pCard){
    context.fillStyle="white";
    context.fillRect(pCard.x, pCard.y, pCard.width, pCard.width);
}
