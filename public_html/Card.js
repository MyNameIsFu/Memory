/*
 * Script für die Verwaltung eines Karten-Objekts
 */

var mainCanvas = document.getElementById("mainCanvas");
var secondCanvas = document.getElementById("secondCanvas");

var context = mainCanvas.getContext("2d");
var secondContext = secondCanvas.getContext("2d");
var globalCanvasBackground = "#aa5522";
/*
 * Constructor for Cards
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
    
    secondContext.font="26px Arial";
    secondContext.fillStyle="black";
    secondContext.fillText(pCard.value, (pCard.x + pCard.width/2 - 6), (pCard.y + pCard.width/2 + 6));
    context.fillStyle=pColor;
    context.fillRect(pCard.x, pCard.y, pCard.width, pCard.width);
}

/**
 * Clear(set white) the MainCanvas on cards boundings
 * @param {Card} pCard Card to clear
 * @returns {undefined} no return
 */
function clearCard(pCard){
    context.fillStyle=getGlobalCanvasBackground();
    context.fillRect(pCard.x, pCard.y, pCard.width, pCard.width);
}

function getGlobalCanvasBackground(){
    return globalCanvasBackground;
}

