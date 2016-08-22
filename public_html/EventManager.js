/*
 * EventManager für Mausklicks
 */

var nextNumberToAssign;
var lastCardsClicked;

var mouseOnCard;
var isMouseOnCard = false;

var gameRunning = false;

function initEventmanager(){
    nextNumberToAssign = 1;
    lastCardsClicked = new Array();
    
    secondCanvas.addEventListener("click", function(evt){
        if(gameRunning){
            checkBoundings(evt);
			}
    });
    secondCanvas.addEventListener("mousemove", function(evt){
            mouseOverCard(evt);
    });
}

function checkBoundings(pEvent){
	var x = pEvent.clientX - mainCanvas.offsetLeft;
	var y = pEvent.clientY - mainCanvas.offsetTop;
	var width = gameObjects[0].width;

	for (i = 0; i < gameObjects.length; i++){
		var tempObj = gameObjects[i];
		if(tempObj.x < x && x < (tempObj.x + width)){
			if(tempObj.y < y && y < (tempObj.y + width)){
				cardClicked(tempObj);
			}
		}
	}
}

/**
 * Check the mouseposition for animated mouse-on-card effect
 * @param {OnMousemove-Event} pEvent MouseMove Event
 * @returns {undefined}
 */
function mouseOverCard(pEvent){
	var x = pEvent.clientX - mainCanvas.offsetLeft;
	var y = pEvent.clientY - mainCanvas.offsetTop;
	var width = gameObjects[1].width;

	if(!isMouseOnCard){
		for (i = 0; i < gameObjects.length; i++){
			var tempObj = gameObjects[i];
			if(tempObj.x < x && x < (tempObj.x + width)){
				if(tempObj.y < y && y < (tempObj.y + width)){
					isMouseOnCard = true;
					mouseOnCard = gameObjects[i];
					if(gameRunning){
						highlightCard(true);
					}
					break;
				}
			}
		}
	}else{
		if(mouseOnCard.x > x || x > (mouseOnCard.x + width) || mouseOnCard.y > y || y > (mouseOnCard.y + width)){
			isMouseOnCard = false;
			if(gameRunning){
			highlightCard(false);
			}
		}
	}
}

/**
 * 
 * @param {boolean} highlight want to highlight lastCard?
 * @returns {undefined}
 */
function highlightCard(highlight){
	if(mouseOnCard != undefined){
		if(highlight){
			mouseOnCard.width += 6;
			mouseOnCard.x -= 3;
			mouseOnCard.y -= 3;
			reDrawCard(mouseOnCard);
		}else{
			clearCard(mouseOnCard);
			mouseOnCard.width -= 6;
			mouseOnCard.x += 3;
			mouseOnCard.y += 3;
			reDrawCard(mouseOnCard);
			mouseOnCard = null;
		}
	}
}

function cardClicked(pCard){
    if(!pCard.wasClicked){
        
        pCard.numberGuessed = nextNumberToAssign;
        lastCardsClicked.push(pCard);
        
        nextNumberToAssign++;        
        pCard.wasClicked = true;
        reDrawCard(pCard);
        
        if(nextNumberToAssign > currentLevel){
            checkResult();
        }
    }else{
        if(pCard.value == lastCardsClicked[lastCardsClicked.length-1].value){
            pCard.wasClicked = false;
            lastCardsClicked.pop();
            nextNumberToAssign--;
            reDrawCard(pCard);
        }
    }
}

function disableMouse(){
    gameRunning = false;
    if(mouseOnCard != null){
        highlightCard(false);
    }
}

function enableMouse(){
    gameRunning = true;
	highlightCard(true);
}

function resetEventManager(){
    mouseOnCard = undefined;
    isMouseOnCard = false;
    nextNumberToAssign = 1;
}