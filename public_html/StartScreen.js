

function initStartScreen(pForm){
    setTimeVisible(pForm.time.value);
    setLevel(pForm.level.value);
    document.getElementById("input").removeChild(document.getElementById("input").childNodes[3]);
    document.getElementById("input").removeChild(document.getElementById("input").childNodes[3]);
    startGame();
}