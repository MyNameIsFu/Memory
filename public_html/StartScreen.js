

function initStartScreen(pForm){
    var tempTimeDelay;
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
    
    console.log(timeVisible);
    
    setLevel(3);
    document.getElementById("input").removeChild(document.getElementById("input").childNodes[3]);
    document.getElementById("input").removeChild(document.getElementById("input").childNodes[3]);
    startGame();
}