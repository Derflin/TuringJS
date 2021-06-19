const numOfColCode = 4;

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
	
	document.getElementById('resultButton').innerHTML = "Show result";
	document.getElementById('result').setAttribute('hidden', true);

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
			this.setAttribute("disabled", true);
			turing.changeProcessing();
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

function continueEnableButtons(){
	var button = document.getElementById('startButton');
	switch(button.innerHTML){
		case "Continue":
			turing.enableMove();
			document.getElementById('animationTime').removeAttribute('disabled');
			document.getElementById('animationCheckBox').removeAttribute('disabled');
			document.getElementById('resetButton').removeAttribute('disabled');
			document.getElementById('buttonCompile').removeAttribute('disabled');
			document.getElementById('startButton').removeAttribute('disabled');
			document.getElementById('resultButton').removeAttribute('disabled');
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
let dbg=[];
function compile(){
	var compileCheck = document.getElementById("compileCheckBox");
	document.getElementById("loaderDiv").removeAttribute("hidden");
	turing.disableElements();
	
	let program=document.getElementById("inputProgram").value;

	try{
		console.time("Compilation");
		let [code] = new Compiler(lexer,parser,assembler).compile(program);
		if(document.getElementById("rangeStatesCheckBox").checked){
			dbg=rangeStates(code);
		}else{
			dbg=[];
		}
		console.timeEnd("Compilation");
		turing.changeTransit(code);

		if(compileCheck.checked == true){
			setTimeout(() => {
				showOutputCode(code);
				document.getElementById("loaderDiv").setAttribute("hidden", true);
			},0);
		}
		else{
			document.getElementById("outputCode").value = "Compilation done!";
			document.getElementById("loaderDiv").setAttribute("hidden", true);
		}
		
	}catch(e){
		document.getElementById("loaderDiv").setAttribute("hidden", true);
		document.getElementById("outputCode").textContent=e;
		if(e instanceof compilingError){
			selectInputTextArea(document.getElementById("inputProgram"),e.start[2],e.end[2]);
			throw e;
		}else{
			throw e;//for debugging
		}
	}finally{
		setTimeout(() => {
			turing.enableElements();
		},0);
		setTimeout(() => {
			document.getElementById("loaderDiv").setAttribute("hidden", true);
		},0);
	}
		
}

//--------------------------
//show code existing rules
function showOutputCode(code){
	let outputArea = document.getElementById("outputCode");
	let buffor = [];

	code.forEach((chars, state) => {
		chars.forEach((body, char) => {
			buffor.push( printActualRule(body, state, char));
		});
	});
	outputArea.textContent=buffor.join('\t')
}

function printActualRule(ruleSet, curState, curChar,dbg){
	var startLetter = String.fromCharCode(curChar); // zamiana int na char dla aktualnej litery
	var endLetter = ruleSet[1];  // odczytanie litery docelowej
	var endCharCode = endLetter.charCodeAt(0); // odczytanie kodu litery docelowej
	var move = ruleSet[2]; // odczytanie tablicy ruchu

	if(curChar < 65 || curChar > 122){ // w przypadku, gdy j nie jest literą, wyświetl int
		startLetter = curChar;
	}
	if(endCharCode < 65 || endCharCode > 122){ // w przypadku, gdy code[i][j][1] nie jest literą, wyświetl int
		endLetter = endCharCode;
	}
	if(move.length == 1){ // w przypadku, gdy tablica ruchu jest jednoelementowa, dodaj element (estetyczne)
		move[1] = 0;
	}
	
	let dbginf1=(dbg && dbg[curState] && dbg[curState]!=curState)?'🠔'+dbg[curState]:"";
	let dbginf2=(dbg && dbg[ruleSet[0]] && dbg[ruleSet[0]]!=ruleSet[0])?'🠔'+dbg[ruleSet[0]]:"";
	
	return '(' + startLetter + ',' + curState + dbginf1 + ")=>(" + endLetter + ',' + ruleSet[0] + dbginf1 + ")+[" + move + ']';
}
//go to error in input code
function selectInputTextArea(element,start,end){
	if(element.setSelectionRange){
		element.focus();
		element.setSelectionRange(start,end);
	}else if(element.createTextRange){
		let range=element.createTextRange();
		element.collapse(true);
		element.moveEnd('character',start);
		element.moveStart('character',end);
		element.select();
	}else{
		throw "Unable to select text.";
	}
}
//----------------------------------------------------------
var resultButton = document.getElementById('resultButton');

resultButton.onclick = function() {
	var resultDiv = document.getElementById('result');

	if(this.innerHTML == "Show result"){
		this.innerHTML = "Hide result";
		resultDiv.removeAttribute('hidden');

		showResult();
	}
	else{
		this.innerHTML = "Show result";
		resultDiv.setAttribute("hidden", true);
	}

}

function showResult(){
	var outDataArray = display.outputData();
	var outResult = document.getElementById("outputResult");

	outResult.value = "";

	outDataArray.forEach(row => {
		outResult.value += row + '\r\n';
	});

}

//-----------------------------------------

function runCurotine(generator,priority=0){
	let reference={
			priority:priority,
			id:0,
			generator:generator,
			corutine:() => {			
				let {done:done}=generator.next();
				if(done){
					reference.id=clearInterval(reference.id);
				}
			}
	}
	reference.id = setInterval(reference.corutine, priority);
	return reference;
}
function stopCurotine(reference){
	clearInterval(reference.id);
}
function continueCurotine(reference){
	setInterval(reference.corutine,reference.priority);
}
function stepCurotine(reference){
	setTimeout(reference.corutine,reference.priority);
}
function stepNowCurotine(reference){//do one step without of setTimeout paralellizm
	return reference.generator.next(...arguments);
}