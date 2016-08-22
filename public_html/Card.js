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
		context.font="16px Arial";
        context.fillStyle="#115566";
        context.fillText(pCard.numberGuessed, (x + 1), (y+16));
		
		context.beginPath();
		context.lineWidth = "2";
		context.strokeStyle="#115566";
		context.moveTo(x+12, y);
		context.lineTo(x+12, y+20);
		context.lineTo(x, y+20);
		context.stroke();
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
    context.fillStyle=globalCanvasBackground;
    context.fillRect(pCard.x, pCard.y, pCard.width, pCard.width);
}

