setCanvasStyle();

var inputForm;
var nickname;

function initStartScreen(pForm){
    var tempTimeDelay;
	inputForm = pForm;
	nickname = pForm.name.value;
    switch(pForm.time.value){
        case "Leicht":
            setTimeVisible(4);
            setScoreMultiplier(0.75);
            break;
        case "Normal":
            setTimeVisible(3);
            setScoreMultiplier(1);
            break;
        case "Schwierig":
            setTimeVisible(2);
            setScoreMultiplier(1.25);
            break;
        default:
            setTimeVisible(3);
            setScoreMultiplier(1);
            break;
            
    }
    
    setLevel(inputForm.level.value);
    inputForm.name.disabled = true;
	inputForm.style.visibility = "hidden";
	
	
    //document.getElementById("input").removeChild(document.getElementById("input").childNodes[3]);
    startGame();
}