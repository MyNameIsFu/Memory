    // HTML components
    var mainCanvas = document.getElementById("mainCanvas");
    var secondCanvas = document.getElementById("secondCanvas");
    var context = mainCanvas.getContext("2d");
    var secondContext = secondCanvas.getContext("2d");
    var globalCanvasBackground = "#aa5522";

    var paragraph = document.getElementById("eventParagraph");
    var button;
    var score = document.getElementById("score");
    var canvasStyle = "position:absolute; left: 50;";
    
    // Init Game
    var wasInitialized = false;
    var gameObjects;
    var isEventListenerRunning = true;
    
    // Difficulty Settings
    var currentLevel; // in Cards
    var timeVisible; // in s
	var timePerRound = 10;
	var timeLeft = timePerRound;
    
    // Random system
    var randomInit = false;
    var numbersAssigned;
    var lastNumberAssigned;
    var randomPrimeNumbers = new Array(19, 23, 29, 31, 37, 43, 47);
    var currentPrimeNumber;
    
    // Score
    var scoreMutiplier;
    var currentScore;
    var highScoreTable = document.getElementById("highscore");
	var listOfHighscores = new Array();

/**
 * Initiate all required parameters and listeners
 * @returns {undefined}
 */
function startGame(){
    
    if(!wasInitialized){
        initEventmanager();
        wasInitialized = true;
		refreshHighscoreTable(["root", 300]);
    }
    setCanvasStyle();
    
    // new level, delete old arrays
    gameObjects = new Array();
    numbersAssigned = new Array();
    randomInit = false;
    
    currentScore = 0;
	
    createLevel();
}

/**
 * 
 * @returns {undefined}
 */
function restartGame(){
    inputForm.style.visibility = "visible";
	document.getElementById("restart").style.display = "none";
	inputForm.name.disabled = false;
	inputForm.button.disabled = false;
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
	timeLeft = timePerRound;
    
    context.fillStyle = "yellow";
    paragraph.innerHTML = "Level: " + currentLevel;
	score.innerHTML = "Time left: " + timeLeft + " Your Score: " + currentScore;
    
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
    setTimeout(function(){
	enableMouse();
	timer();
	}, timeVisible*1000);
    
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
}

/**
 * Check the result/score
 * @returns {boolean} level successfully completed
 */
function checkResult(){
    TweenMax.to(secondCanvas, 0, {opacity:1});
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
    currentScore += correctAnswers * scoreMutiplier;
	score.innerHTML = "Time left: " + timeLeft + " Your Score: " + currentScore;
    
    if(successful){
		inputForm.button.disabled = true;
		bonusPoints(timeLeft);
        setTimeout(
		function(){
			nextLevel();
			resetEventManager();
			}, 2500);
    }else{
		if(nickname.length != 0){
		refreshHighscoreTable([nickname, currentScore]);
		}
		document.getElementById("restart").style.display = "inline";
	}

	// Stop the game and proceed to the next level if all answers correct
    disableMouse();
    resetEventManager();
    delete gameObjects;
    delete numbersAssigned;
    randomInit = false;
}

/**
 * Set the fade timer for cards
 * @param {Number} pTime Time in seconds
 * @returns {undefined}
 */
function setTimeVisible(pTime){
    timeVisible = pTime;
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


function setCanvasStyle(){
    context.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
    secondContext.clearRect(0, 0, secondCanvas.width, secondCanvas.height);
    
    mainCanvas.style = canvasStyle + "background-color: " + globalCanvasBackground + ";";
    secondCanvas.style = canvasStyle + "background-color: transparent; z-index: 2;";
	
	TweenMax.to(secondCanvas, 0, {opacity:1});
}

/**
*	Refresh the Highscore by deleting all rows, adding the new score, sorting and rearranging the Highscore Table
*	@param	{Object} Object of Type {Name, Score}
**/

function refreshHighscoreTable(pNewScore){
	var lengthOfHighscores = highScoreTable.rows.length;
	// delete all Rows (except of Header)
	for(i = 1; i < lengthOfHighscores; i++){
		highScoreTable.deleteRow(1);
	}
	
	listOfHighscores.push(pNewScore);
	listOfHighscores.sort(sortScores);
	for(j = 0; j < listOfHighscores.length; j++){
		addRowToHighscore(listOfHighscores[j], listOfHighscores.length-j);
	}
}

// How should the array be sorted (First Element the lowest score)
function sortScores(a, b){
	if(a[1] < b[1]){
		return -1;
	}
	if(a[1] > b[1]){
		return 1;
	}
	return 0;
}

function addRowToHighscore(pNewRow, pPlace){
	var row = highScoreTable.insertRow(1);
	var first = row.insertCell(0);
	var second = row.insertCell(1);
	first.innerHTML = pPlace + ". " + pNewRow[0];
	second.innerHTML = pNewRow[1];
}

function timer(){
	score.innerHTML = "Time left: " + timeLeft + " Your Score: " + currentScore;
	if(timeLeft <= 0 && gameRunning){
		checkResult();
		return;
	}
	
	if(gameRunning){
		setTimeout(function(){
		if(gameRunning){
		timeLeft--;
		console.log("time remaining: " + timeLeft);
		timer();
		}}, 1000);
		return;
	}
}

function bonusPoints(pAmount){
		pAmount--;
		console.log("pAmount: " + pAmount);
		currentScore += 10;
		score.innerHTML = "Time left: " + timeLeft + " Your Score: " + currentScore;
		setTimeout(function(){
		if(pAmount > 0){
		bonusPoints(pAmount);
		}
		}, 100);
}