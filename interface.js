//hidding animation speed slider
var animCheckBox = document.getElementById('animationCheckBox');

animCheckBox.onclick = function(){
	if(this.checked == false){
		document.getElementById('sliderLabel').style.visibility="hidden";
		document.getElementById('animationTime').style.visibility="hidden";
		document.getElementById('animationTimeLabel').style.visibility="hidden";

		display.changeNextStepTime(0);
		display.changeAnimationFrames(1);
	}else{
		document.getElementById('sliderLabel').style.visibility="";
		document.getElementById('animationTime').style.visibility="";
		document.getElementById('animationTimeLabel').style.visibility="";
		
		var animationSpeed = document.getElementById('animationTime').value / 50;

		display.changeNextStepTime((nextStepTimeDefault * (2 - animationSpeed)).toFixed(0));
		display.changeAnimationFrames((animationFramesDefault * (2 - animationSpeed)).toFixed(0));
	}
}

//actualize animaton speed
var animationSlider = document.getElementById('animationTime');
var outputLabel = document.getElementById('animationTimeLabel');

animationSlider.oninput = function() {
	var newValue = this.value / 50;
	outputLabel.innerHTML = "" + (newValue * 100).toFixed(0) + "%";
	display.changeNextStepTime((nextStepTimeDefault * (2 - newValue)).toFixed(0));
	display.changeAnimationFrames((animationFramesDefault * (2 - newValue)).toFixed(0));
}

//-----------------------------
var button = document.getElementById('startButton');
var tmpPos;

button.onclick = function() {
	var buttonText = this.innerHTML;
	var animationOn = document.getElementById('animationCheckBox').checked;

	switch(buttonText){
		case "Start":
			if(animationOn == true){
				this.innerHTML = "Stop";
			}
			else{
				this.innerHTML = "Next Step";
			}
			step = 0;
			document.getElementById('resetButton').removeAttribute('hidden');
			turing.checkDataAndStart();
			turing.enableMove();
			break;
		case "Stop":
			this.innerHTML = "Continue";
			turing.changeProcessing();
			turing.enableMove();
			document.getElementById('animationTime').removeAttribute('disabled');
			document.getElementById('animationCheckBox').removeAttribute('disabled');
			document.getElementById('resetButton').removeAttribute('disabled');
			document.getElementById('buttonCompile').removeAttribute('disabled');
			break;
		case "Continue":
			if(animationOn == true){
				this.innerHTML = "Stop";
				turing.disableElements();
			}
			else{
				this.innerHTML = "Next Step";
			}
			turing.changeProcessing();
			if(display.stopNextPos[0] != 0 || display.stopNextPos[1] != 0){
				display.resetPosition(turing);
			}
			else{
				turing.startTuring();
			}
			break;
		case "Next Step":
			if(animationOn == true){
				this.innerHTML = "Stop";
				turing.disableElements();
			}
			else{
				button.setAttribute('disabled', true);
				document.getElementById('startErrorLabel').innerHTML = "Step " + turing.step;
			}

			if(display.stopNextPos[0] != 0 || display.stopNextPos[1] != 0){
				display.resetPosition(turing);
			}
			else{
				turing.startTuring();
			}
			break;
	}
}
//-----------------------

var interface = document.getElementById('mainContainer');

document.addEventListener('click', (event)=>display.canvasFocus(event), false);
document.addEventListener("keydown", function(e) {
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1 && !interface.contains(e.target)) {
        e.preventDefault();

		var animationOn = document.getElementById('animationCheckBox').checked;

		if(display.canvasClicked == true && display.animationStarted == false && (turing.processing == false || animationOn == false)){
			switch(e.code){
				case "ArrowUp":
					display.makeBoardMove(Direction.UP, 1);
					break;
				case "ArrowDown":
					display.makeBoardMove(Direction.DOWN, 1);
					break;
				case "ArrowLeft":
					display.makeBoardMove(Direction.LEFT, 1);
					break;
				case "ArrowRight":
					display.makeBoardMove(Direction.RIGHT, 1);
					break;
			}
		}
    }
}, false);
//--------------------------

var canvas = document.getElementById('canvas');
canvas.addEventListener('click', (event)=>display.canvasOnMouseClick(event), false);
document.addEventListener('keypress', (event)=>display.canvasOnKeyDown(event), false);

//compiling code
function compile(){
	let program=document.getElementById("inputProgram").value;
	try{
		let [code,dbg] = new Compiler(lexer,parser,assembler).compile(program);
		turing.changeTransit(code);
		showOutputCode(code);
	}catch(e){
		document.getElementById("outputCode").textContent=e;
	}
}

//--------------------------
//show code existing rules
function showOutputCode(code){
	let outputArea = document.getElementById("outputCode");
	outputArea.textContent = "";
	for(i = 0; i < code.length; i++){
		if(code[i]!=undefined){
			for(j = 0; j< code[i].length; j++){
				if(code[i][j] != undefined){
					var startLetter = String.fromCharCode(j); // zamiana int na char dla aktualnej litery
					var endLetter = code[i][j][1];  // odczytanie litery docelowej
					var endCharCode = endLetter.charCodeAt(0); // odczytanie kodu litery docelowej
					var move = code[i][j][2]; // odczytanie tablicy ruchu

					if(j < 65 || j > 122){ // w przypadku, gdy j nie jest literą, wyświetl int
						startLetter = j;
					}
					if(endCharCode < 65 || endCharCode > 122){ // w przypadku, gdy code[i][j][1] nie jest literą, wyświetl int
						endLetter = endCharCode;
					}
					if(move.length == 1){ // w przypadku, gdy tablica ruchu jest jednoelementowa, dodaj element (estetyczne)
						move[1] = 0;
					}

					outputArea.textContent += '(' + startLetter + ',' + i + " => " + endLetter + ',' + code[i][j][0] + ",[" + move + '])' + '\r\n';
				}
			}
		}
	}
}