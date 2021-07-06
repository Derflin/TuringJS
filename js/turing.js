/*
* tablica display.pos[y,x] wskazuje współrzędne tablicy display.dataArray, na które wskazuje środek ekranu
* tablica display.posRed[y,x] wskazuje współrzędne czerwonego kursora (ramki) względem środka planszy
* współrzędne elementu w display.dataArray to suma odpowiednich elementów tych dwóch tablic
*/

class Turing {

    constructor(){
        this.transit = []; //transit[n state][m char][newstate,newchar,move], move = [x,y]

        this.lastState = -1; //ostatni przetwarzany stan (wartość startowa nieistotna)
        this.lastChar; //ostatnia przetwarzana wartość
        this.lastPos = [-1, -1]; //ostatnia przetwarzana pozycja (wartość startowa nieistotna)

        this.processing = false; //true - przetwarzanie turinga jest uruchomione, false - program nie działa, można wporwadzać dane
        this.step = 0;
    }

    changeTransit(newTransit){
        this.transit = newTransit;
    }
    changeProcessing(){
        if(this.processing == true){
            this.processing = false;
        }
        else{
            this.processing = true;
        }
    }

    disableElements(){
        document.getElementById('animationTime').setAttribute('disabled', true);
        document.getElementById('inputButton').setAttribute('disabled', true);
        document.getElementById('animationCheckBox').setAttribute('disabled', true);
        document.getElementById('resetButton').setAttribute('disabled', true);
        document.getElementById('buttonCompile').setAttribute('disabled', true);
        document.getElementById('resultButton').setAttribute('disabled', true);
        this.disableMove();
    }

    enableElements(){
        document.getElementById('animationTime').removeAttribute('disabled');
        document.getElementById('inputButton').removeAttribute('disabled');
        document.getElementById('animationCheckBox').removeAttribute('disabled');
        document.getElementById('startButton').removeAttribute('disabled');
        document.getElementById('resetButton').removeAttribute('disabled');
        document.getElementById('buttonCompile').removeAttribute('disabled');
        document.getElementById('resultButton').removeAttribute('disabled');
        this.enableMove();
    }

    disableMove(){
        document.getElementById('moveUpButton').setAttribute('disabled', true);
        document.getElementById('moveDownButton').setAttribute('disabled', true);
        document.getElementById('moveLeftButton').setAttribute('disabled', true);
        document.getElementById('moveRightButton').setAttribute('disabled', true);
    }

    enableMove(){
        document.getElementById('moveUpButton').removeAttribute('disabled');
        document.getElementById('moveDownButton').removeAttribute('disabled');
        document.getElementById('moveLeftButton').removeAttribute('disabled');
        document.getElementById('moveRightButton').removeAttribute('disabled');
    }

    resetTuring(){
        this.enableElements();
        this.transit = [];
        this.processing = false;
        this.lastState = -1; 
        this.lastChar = undefined; 
        this.lastPos = [-1, -1]; 
        this.step = 0;

        stopCurotine(previousCorutine);

        document.getElementById('startErrorLabel').innerHTML = "Turing has been reset";
        document.getElementById('startButton').innerHTML = "Start";
        document.getElementById("outputCode").value = "";
        document.getElementById('resetButton').setAttribute('hidden', true);
        document.getElementById('resultButton').innerHTML = "Show result";
        document.getElementById('result').setAttribute('hidden', true);
		document.getElementById("loaderDiv").setAttribute("hidden", true);

        display.resetData();
        display.resetRed();
        showOutputCode(this.transit);
    }

    checkDataAndStart(){ //sprawdzenie, czy wprowadzono dane do sortowania i rozpoczęcie obliczeń
        document.getElementById('startErrorLabel').innerHTML = "Processing...";
        this.disableElements();
        this.step = 0;

        if(document.getElementById('animationCheckBox').checked == true){
            if(display.pos[0] != 0 || display.posRed[0] != 0 || display.pos[1] != 0 || display.posRed[1] != 0){
                display.resetRed(this); // powrót kursora na pozycję startową
            }
            else{
                this.startTuring();
            }
        }
        else{
            document.getElementById('animationTime').removeAttribute('disabled');
            document.getElementById('animationCheckBox').removeAttribute('disabled');
            document.getElementById('resetButton').removeAttribute('disabled');
            document.getElementById('buttonCompile').removeAttribute('disabled');
            document.getElementById('resultButton').removeAttribute('disabled');

            if(display.pos[0] != 0 || display.posRed[0] != 0 || display.pos[1] != 0 || display.posRed[1] != 0){
                display.resetRed(this); // powrót kursora na pozycję startową
            }
        }
    }

    startTuring(){
        if(display.dataArray[display.pos[0] + display.posRed[0]] == undefined){
            display.dataArray[display.pos[0] + display.posRed[0]] = [];
        }

        var curChar = (display.dataArray[display.pos[0] + display.posRed[0]][display.pos[1] + display.posRed[1]] || "\0").charCodeAt(0);
        var curState = display.state;

        
        if(typeof this.lastChar !== 'undefined'){ //warunek końcowy - ostatnio przetwarzana litera, stan i pozycja są takie same jak obecnie przetwarzane
            if(this.lastState == curState && this.lastChar == curChar && 
                this.lastPos[0] == display.pos[0] + display.posRed[0] && 
                this.lastPos[1] == display.pos[1] + display.posRed[1]){

                this.processing = false;
                this.lastChar = undefined;

                document.getElementById('startErrorLabel').innerHTML = "Program is done in " + this.step + " steps";
                document.getElementById('startButton').innerHTML = "Start";
                document.getElementById('resetButton').setAttribute('hidden', true);

                showResult();
                this.enableElements();
            }
        }
        else{
            this.processing = true;
        }

        if(this.processing){
            if(typeof this.transit[curState] !== 'undefined' && typeof this.transit[curState][curChar] !== 'undefined'){
                this.step += 1;
                document.getElementById('startErrorLabel').innerHTML = "Step " + this.step + "<br/><br/>" + printActualRule(this.transit[curState][curChar], curState, curChar,dbg);
                
                //aktualizacja ostatnio przetwarzanych danych
                this.lastChar = curChar;
                this.lastState = curState;
                this.lastPos[0] = display.pos[0] + display.posRed[0];
                this.lastPos[1] = display.pos[1] + display.posRed[1];
        
                //pobranie nowych wartości i kierunku ruchu z tablicy reguł
                var newState = this.transit[curState][curChar][0];
                var newChar = this.transit[curState][curChar][1];
                var move = this.transit[curState][curChar][2];

                //aktualizacja stanu i litery
                display.changeState(newState);
                display.changeChar(newChar);
    
                setTimeout(() => { //czekanie przed ruchem (długość zależna od ustawionej prędkości animacji)
                    if(move.length == 2){ // ruch dla pełnej tablicy ruchu
                        display.moveTuring(this, move[0], move[1]);
                    }
                    else{ // ruch poziomy (w osi X)
                        display.moveTuring(this, move[0]);
                    }
                }, nextStepTime);
            }
            else{
                this.processing = false;
                this.lastChar = undefined;
                
                document.getElementById('startErrorLabel').innerHTML = "There's no rule for current char and state! Turing stopped working.";
                document.getElementById('startButton').innerHTML = "Start";
                document.getElementById('resetButton').setAttribute('hidden', true);
                this.enableElements();
            }
        }
        else{
            continueEnableButtons();
        }
    }
}