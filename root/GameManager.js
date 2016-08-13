    var mainCanvas;
    var context;
    var paragraph;
    var button;
    
    var wasInitialized = false;
    var gameObjects;
    var currentLevel = 10;
    
    var randomInit = false;
    var numbersAssigned;
    var lastNumberAssigned;
    
    var randomPrimNumber = 23;

function startGame(){
    mainCanvas = document.getElementById("mainCanvas");
    context = mainCanvas.getContext("2d");
    paragraph = document.getElementById("eventParagraph");
    
    if(!wasInitialized){
        createLevel();
        initEventmanager(gameObjects);
        wasInitialized = true;
    }
}

function restartGame(){
    console.log("restart game called");
}

/**
 * Method to generate a new Level
 * @returns {undefined}
 */
function createLevel(){
    
    // First Cards position
    var currentX = 20;
    var currentY = 20;
    var width = 75;
    
    // new level, delete old array
    gameObjects = new Array(Card);
    numbersAssigned = new Array(Number);
    
    context.fillStyle = "yellow";
    
    enableMouse();
    
    // 1 card per level
    for(i = 0; i < currentLevel; i++){
        var tempGameObject;       // zuletzt erstellte Karte
        
        // Erzeuge die Karten in einer Reihe
        if((currentX + width) < mainCanvas.width){
            tempGameObject = new Card(currentX, currentY, width, "test");
            gameObjects.push(tempGameObject);
            currentX += width + 10;
        } else{     // start a new row if the limit is reached
            currentY += width + 10;
            currentX = 20;
            
            // If the canvas is too small then restart with an increased height
            if(currentY + width > mainCanvas.height){
                console.log("Canvas Limit erreicht!");
                secondCanvas.height += 100;
                mainCanvas.height += 100;
                createLevel();
            }else{
            tempGameObject = new Card(currentX, currentY, width, "N/A");
            gameObjects.push(tempGameObject);
            currentX += width + 10;
            }
        }
    }
    for(i = 1; i < gameObjects.length; i++){
        // assign a value to each card
        // random-algorithm := linear probing
        console.log(i); 
        setCardValue(gameObjects[i], getRandomNumber(currentLevel), "yellow");
    }
    TweenMax.to(secondCanvas, 5, {opacity:0});
}

function getRandomNumber(pMaxNumber){
    if(!randomInit){
        numbersAssigned = new Array(Number);
        for(j = 0; j < currentLevel; j++){
            numbersAssigned.push(j+1);
        }
        lastNumberAssigned = Math.floor(Math.random()*currentLevel);
        randomInit = true;
    }
    
    lastNumberAssigned += randomPrimNumber;
    lastNumberAssigned %= pMaxNumber;
    
    return numbersAssigned[lastNumberAssigned+1];
}

function checkResult(){
    TweenMax.to(secondCanvas, 0.25, {opacity:1});
    for(i = 1; i < gameObjects.length; i++){
        if(gameObjects[i].value === gameObjects[i].numberGuessed){
            gameObjects[i].background = "green";
            reDrawCard(gameObjects[i]);
        }else{
            gameObjects[i].background = "red";
            reDrawCard(gameObjects[i]);
        }
    }
    disableMouse();
}