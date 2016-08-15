    var mainCanvas;
    var context;
    var paragraph;
    var button;
    
    var wasInitialized = false;
    var gameObjects;
    
    // Difficulty Settings
    var currentLevel; // in Cards
    var timeVisible; // in s
    var timeDelay; // in ms
    
    var randomInit = false;
    var numbersAssigned;
    var lastNumberAssigned;
    
    
    var randomPrimeNumbers = new Array(19, 23, 31, 37, 43, 47);
    var currentPrimeNumber;

/**
 * Initiate all required parameters and listeners
 * @returns {undefined}
 */
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

/**
 * 
 * @returns {undefined}
 */
function restartGame(){
    throw new Error("Restart Game: not yet implemented!");
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
    gameObjects = new Array();
    numbersAssigned = new Array();
    
    context.fillStyle = "yellow";
    
    
    // one card per level
    for(i = 0; i < currentLevel; i++){
        var tempGameObject;       // zuletzt erstellte Karte
 
        // Create a Card in a row
        if((currentX + width) < mainCanvas.width){
            tempGameObject = new Card(currentX, currentY, width, "test");
            gameObjects.push(tempGameObject);
            currentX += width + 10;
        } else{     // start a new row if the limit is reached
            currentY += width + 10;
            currentX = 20;
            
            // If the canvas is too small then restart with an increased height
            if(currentY + width > mainCanvas.height){
                secondCanvas.height += 100;
                mainCanvas.height += 100;
                createLevel();
                return;
            }else{
            tempGameObject = new Card(currentX, currentY, width, "N/A");
            gameObjects.push(tempGameObject);
            currentX += width + 10;
            }
        }
    }
    for(i = 0; i < gameObjects.length; i++){
        // assign a value to each card
        console.log("setting Card value of Card: " + i);
        setCardValue(gameObjects[i], getRandomNumber(currentLevel), "yellow");
    }
    TweenMax.to(secondCanvas, timeVisible, {opacity:0});
    setTimeout(function(){enableMouse()}, timeDelay);
}

/**
 * Calculate the next random number to assign to a card
 * @param {Number} pMaxNumber highest Integer to be returned
 * @returns {Number} random Number (1,...,pMaxNumber)
 */
function getRandomNumber(pMaxNumber){
    if(!randomInit){
        var tempNumbersAssigned = new Array();
        numbersAssigned = new Array();
        for(j = 0; j < currentLevel; j++){
            tempNumbersAssigned.push(j+1);
        }
        
        // Prime Number for generating the set
        currentPrimeNumber = randomPrimeNumbers[Math.floor(Math.random()*randomPrimeNumbers.length)];
        console.log("Primzahl zum Erstellen: " + currentPrimeNumber);
        createRandomSet(tempNumbersAssigned);
        
        
        lastNumberAssigned = Math.floor(Math.random()*currentLevel);
        randomInit = true;
    }
    
    var lastNumberAssigned = numbersAssigned.pop();
    
    // Prime Number for generating the set
    currentPrimeNumber = randomPrimeNumbers[Math.floor(Math.random()*randomPrimeNumbers.length)];
    console.log("Primzahl für rearrange: " + currentPrimeNumber);
    rearrangeRandomSet(numbersAssigned);
    
    return lastNumberAssigned;
}

function createRandomSet(pTempSet){
    for(k = 0; k < currentLevel; k++){
        numbersAssigned.push((k*currentPrimeNumber%currentLevel)+1);
    }
    console.log(numbersAssigned);
}

function rearrangeRandomSet(pTempSet){
    numbersAssigned = new Array();
    for(l = 0; l < pTempSet.length; l++){
        numbersAssigned.push(pTempSet[(l*currentPrimeNumber)%pTempSet.length]);
    }
    console.log(numbersAssigned);
}

/**
 * Check the result/score
 * @returns {boolean} level successfully completed
 */
function checkResult(){
    TweenMax.to(secondCanvas, 0.25, {opacity:1});
    var successful = true;
    for(i = 1; i < gameObjects.length; i++){
        if(gameObjects[i].value === gameObjects[i].numberGuessed){
            gameObjects[i].background = "green";
            reDrawCard(gameObjects[i]);
        }else{
            gameObjects[i].background = "red";
            reDrawCard(gameObjects[i]);
            successful = false;
        }
    }
    disableMouse();
    return successful;
}

function setTimeVisible(pTime){
    timeVisible = pTime;
    timeDelay = timeVisible*1000;
}

function setLevel(pLevel){
    currentLevel = pLevel;
}