    // HTML components
    var mainCanvas = document.getElementById("mainCanvas");
    var secondCanvas = document.getElementById("secondCanvas");
    var context = mainCanvas.getContext("2d");
    var secondContext = secondCanvas.getContext("2d");
    var globalCanvasBackground = "#aa5522";

    var paragraph;
    var button;
    var score;
    var canvasStyle = "left: 0;";
    
    // Init Game
    var wasInitialized = false;
    var gameObjects;
    var isEventListenerRunning = true;
    
    // Difficulty Settings
    var currentLevel; // in Cards
    var timeVisible; // in s
    var timeDelay; // in ms
    
    // Random system
    var randomInit = false;
    var numbersAssigned;
    var lastNumberAssigned;
    var randomPrimeNumbers = new Array(19, 23, 29, 31, 37, 43, 47);
    var currentPrimeNumber;
    
    // Score
    var scoreMutiplier;
    var lastScore;
    var highScore;

/**
 * Initiate all required parameters and listeners
 * @returns {undefined}
 */
function startGame(){
    
    if(!wasInitialized){
        mainCanvas = document.getElementById("mainCanvas");
        context = mainCanvas.getContext("2d");
        paragraph = document.getElementById("eventParagraph");
        score = document.getElementById("score");
        
        highScore = new Array();
        initEventmanager();
        wasInitialized = true;
    }else{
        setCanvasStyle();
    }
    
    // new level, delete old arrays
    gameObjects = new Array();
    numbersAssigned = new Array();
    randomInit = false;
    
    createLevel();
    lastScore = 0;
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
    
    context.fillStyle = "yellow";
    paragraph.innerHTML = "Level: " + currentLevel;
    
    //secondContext.clearRect(0, 0, secondCanvas.width, secondCanvas.height);
    setCanvasStyle();
    
    // one card per level
    for(i = 0; i < currentLevel; i++){
        var tempGameObject;       // zuletzt erstellte Karte
 
        // Create a Card in a row
        if((currentX + width) < mainCanvas.width){
            tempGameObject = new Card(currentX, currentY, width);
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
        setCardValue(gameObjects[i], getRandomNumber(currentLevel), "yellow");
    }
    TweenMax.to(secondCanvas, timeVisible, {opacity:0});
    setTimeout(function(){enableMouse()}, timeDelay);
    
    isEventListenerRunning = true;
}

/**
 * Calculate the next random number to assign to a card
 * @param {Number} pMaxNumber highest Integer to be returned
 * @returns {Number} random Number (1,...,pMaxNumber)
 */
function getRandomNumber(pMaxNumber){
    if(!randomInit){
        numbersAssigned = new Array();
        
        // Prime Number for generating the set
        currentPrimeNumber = randomPrimeNumbers[Math.floor(Math.random()*randomPrimeNumbers.length)];
        createRandomSet();
        
        lastNumberAssigned = Math.floor(Math.random()*currentLevel);
        randomInit = true;
    }
    
    var lastNumberAssigned = numbersAssigned.pop();
    
    // Prime Number for generating the set
    currentPrimeNumber = randomPrimeNumbers[Math.floor(Math.random()*randomPrimeNumbers.length)];
    rearrangeRandomSet(numbersAssigned);
    
    return lastNumberAssigned;
}

/**
 * Create a random set
 * @returns {undefined}
 */
function createRandomSet(){
    var tempRandom = Math.floor(Math.random()*currentLevel + 1);
    for(k = 0; k < currentLevel; k++){
        numbersAssigned.push((tempRandom*currentPrimeNumber%currentLevel)+1);
        tempRandom++;
    }
}

/**
 * 
 * @param {Array} pTempSet Set of Numbers(Elements) to be rearranged
 * @returns {undefined}
 */
function rearrangeRandomSet(pTempSet){
    numbersAssigned = new Array();
    for(l = 0; l < pTempSet.length; l++){
        numbersAssigned.push(pTempSet[(l*currentPrimeNumber)%pTempSet.length]);
    }
    console.log("Rearranged numbersAssigned to: " + numbersAssigned);
}

/**
 * Check the result/score
 * @returns {boolean} level successfully completed
 */
function checkResult(){
    TweenMax.to(secondCanvas, 0.25, {opacity:1});
    var successful = true;
    var correctAnswers = 0;
    
    for(i = 0; i < gameObjects.length; i++){
        if(gameObjects[i].value === gameObjects[i].numberGuessed){
            gameObjects[i].background = "green";
            reDrawCard(gameObjects[i]);
            correctAnswers++;
        }else{
            gameObjects[i].background = "red";
            reDrawCard(gameObjects[i]);
            successful = false;
        }
    }
    // Refresh the score
    lastScore += correctAnswers * scoreMutiplier;
    score.innerHTML = "Your Score: " + lastScore;
    
    // Stop the game and proceed to the next level if all answers correct
    disableMouse();
    resetEventManager();
    delete gameObjects;
    delete numbersAssigned;
    randomInit = false;
    
    if(correctAnswers == currentLevel){
        setTimeout(function(){nextLevel();}, 2500);
    }
    
    return successful;
}

/**
 * Set the fade timer for cards
 * @param {Number} pTime Time in seconds
 * @returns {undefined}
 */
function setTimeVisible(pTime){
    timeVisible = pTime;
    timeDelay = timeVisible*1000;
}

/**
 * Set the level for the next launch
 * @param {Number} pLevel The next level to start with
 * @returns {undefined}
 */
function setLevel(pLevel){
    currentLevel = pLevel;
}

/**
 * Set the score multiplier for different difficulties
 * @param {Number} pValue Scoremultiplier = pValue * 10
 * @returns {undefined}
 */
function setScoreMultiplier(pValue){
    scoreMutiplier = pValue * 10;
}

/**
 * Start the next Level
 */
function nextLevel(){
    currentLevel++;
    gameObjects = new Array();
    
    createLevel();
}

/**
 * Add the current player to a list of highscores
 * @param {type} pScore Score achieved
 * @param {type} pName Playername
 */
function addHighscore(pScore, pName){
    var nextScore = new Object(pName, pScore);
    highScore.push(nextScore);
    
}

function setCanvasStyle(){
    context.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
    secondContext.clearRect(0, 0, secondCanvas.width, secondCanvas.height);
    
    mainCanvas.style = canvasStyle + "background-color: " + globalCanvasBackground + ";";
    secondCanvas.style = canvasStyle + "background-color: transparent; z-index: 2;";
}