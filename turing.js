/*
* Notatki dla siebie:
* tablica display.pos[y,x] wskazuje współrzędne tablicy display.dataArray, na które wskazuje środek ekranu
* tablica display.posRed[y,x] wskazuje współrzędne czerwonego kursora (ramki) względem środka planszy
* współrzędne elementu w display.dataArray to suma odpowiednich elementów tych dwóch tablic
*
* TODO: cofnięcie do pozycji startowej po kliknięciu "Start"
*       ruch na ukos (może się przydać)
*/

class Turing {

    constructor(){
        this.transit = []; //transit[n state][m char][newstate,newchar,move], move = [x,y]

        this.lastState = -1; //ostatni przetwarzany stan (wartość startowa nieistotna)
        this.lastChar; //ostatnia przetwarzana wartość z (wartośc startowa istotna, w razie zmiany dostosować kod)
        this.lastPos = [-1, -1]; //ostatnia przetwarzana pozycja (wartość startowa nieistotna)

        this.processing = false; //true - przetwarzanie turinga jest uruchomione, false - program nie działa, można wporwadzać dane
        this.step = 0;

        //testowa tablica reguł
        this.transit[0] = [];
        this.transit[0][65] = [1, "B", [1, 0]];
        this.transit[0][0] = [0, "\0", [0, 0]];

        this.transit[1] = [];
        this.transit[1][114] = [2, "y", [0, 1]];
        
        this.transit[2] = [];
        this.transit[2][101] = [2, "p", [0, 0]];
        this.transit[2][112] = [4, "t", [0, -1]];

        this.transit[3] = [];
        this.transit[3][101] = [4, "u", [0, -1]];
  
        this.transit[4] = [];
        this.transit[4][121] = [4, "y", [0, 0]];
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
        this.disableMove();
    }

    enableElements(){
        document.getElementById('animationTime').removeAttribute('disabled');
        document.getElementById('inputButton').removeAttribute('disabled');
        document.getElementById('animationCheckBox').removeAttribute('disabled');
        document.getElementById('startButton').removeAttribute('disabled');
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

    checkDataAndStart(){ //sprawdzenie, czy wprowadzono dane do sortowania i rozpoczęcie obliczeń
        document.getElementById('startErrorLabel').innerHTML = "Processing...";
        this.disableElements();
        this.step = 0;

        if(document.getElementById('animationCheckBox').checked == true){
            if(display.pos[0] != 0 || display.posRed[0] != 0 || display.pos[1] != 0 || display.posRed[1] != 0){
                display.resetRed(this);
            }
            else{
                this.startTuring();
            }
        }
        else{
            document.getElementById('animationTime').removeAttribute('disabled');
            document.getElementById('animationCheckBox').removeAttribute('disabled');

            if(display.pos[0] != 0 || display.posRed[0] != 0 || display.pos[1] != 0 || display.posRed[1] != 0){
                display.resetRed(this);
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

                document.getElementById('startErrorLabel').innerHTML = "Sorting is done!";
                document.getElementById('startButton').innerHTML = "Start";
                this.enableElements();
            }
        }
        else{
            this.processing = true;
        }

        if(this.processing){
            if(typeof this.transit[curState][curChar] !== 'undefined'){
                this.step += 1;
                document.getElementById('startErrorLabel').innerHTML = "Step " + turing.step;
                
                //aktualizacja ostatnio przetwarzanych danych
                this.lastChar = curChar;
                this.lastState = curState;
                this.lastPos[0] = display.pos[0] + display.posRed[0];
                this.lastPos[1] = display.pos[1] + display.posRed[1];
        
                //pobranie nowych wartości i kierunku ruchu z tablisy reguł
                var newState = this.transit[curState][curChar][0];
                var newChar = this.transit[curState][curChar][1];
                var move = this.transit[curState][curChar][2];

                //aktualizacja stanu i litery
                display.changeState(newState);
                display.changeChar(newChar);
    
                setTimeout(() => { //czekanie 1s przed ruchem
                    if((move.length == 2 && move[0] == 0 && move[1] == 0) || (move.length == 1 && move[0] == 0)){ //zabezpieczenie przed zmianą stanu/litery bez poruszenia się
                        display.makeMove(Direction.RIGHT, 0, this);
                    }
                    else{
                        if(move[0] != 0){ //sprawdzenie przeunięcia w osi X
                            if(move[0] > 0){ //przesunięcie w prawo
                                display.makeMove(Direction.RIGHT, move[0], this);
                            } else{ //przesunięcie w lewo
                                display.makeMove(Direction.LEFT, -move[0], this);
                            }
                        }
                        if(move[1] != 0){ //sprawdzenie przeunięcia w osi Y
                            if(move[1] > 0){ //przesunięcie w dół
                                display.makeMove(Direction.DOWN, move[1], this);
                            } else{ //przesunięcie w górę
                                display.makeMove(Direction.UP, -move[1], this);
                            }
                        }
                    }
                }, nextStepTime);
            }
            else{
                this.processing = false;
                this.lastChar = undefined;
                
                document.getElementById('startErrorLabel').innerHTML = "There's no rule for current char nad state! Turing stopped working.";
                document.getElementById('startButton').innerHTML = "Start";
                this.enableElements();
            }
           
        }
    }
}