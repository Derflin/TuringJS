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
        this.display = new Display(); 

        this.transit = []; //transit[n state][m char][newstate,newchar,move], move = [x,y]

        this.lastState = -1; //ostatni przetwarzany stan (wartość startowa nieistotna)
        this.lastChar = "@"; //ostatnia przetwarzana wartość z (wartośc startowa istotna, w razie zmiany dostosować kod)
        this.lastPos = [-1, -1]; //ostatnia przetwarzana pozycja (wartość startowa nieistotna)

        this.processing = false; //true - przetwarzanie turinga jest uruchomione, false - program nie działa, można wporwadzać dane

        //testowa tablica reguł
        this.transit[0] = [];
        this.transit[0][65] = [1, "B", [1, 0]];

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

    checkDataAndStart(){ //sprawdzenie, czy wprowadzono dane do sortowania i rozpoczęcie obliczeń
        if(this.display.dataArray.length != 0){
            document.getElementById('startErrorLabel').innerHTML = "Processing...";
            this.startTuring();
        }
        else{
            document.getElementById('startErrorLabel').innerHTML = "There is no data to sort! Insert data nad try again.";
        }
    }

    startTuring(){
        var curChar = (this.display.dataArray[this.display.pos[0] + this.display.posRed[0]][this.display.pos[1] + this.display.posRed[1]]).charCodeAt(0);
        var curState = this.display.state;
        
        if(this.lastChar != "@"){ //warunek końcowy - ostatnio przetwarzana litera, stan i pozycja są takie same jak obecnie przetwarzane
            if(this.lastState == curState && this.lastChar == curChar && 
                this.lastPos[0] == this.display.pos[0] + this.display.posRed[0] && 
                this.lastPos[1] == this.display.pos[1] + this.display.posRed[1]){

                this.processing = false;
                this.lastChar = "@";

                document.getElementById('startErrorLabel').innerHTML = "Sorting is done!";
            }
        }
        else{
            this.processing = true;
        }

        if(this.processing){
            //aktualizacja ostatnio przetwarzanych danych
            this.lastChar = curChar;
            this.lastState = curState;
            this.lastPos[0] = this.display.pos[0] + this.display.posRed[0];
            this.lastPos[1] = this.display.pos[1] + this.display.posRed[1];
    
            //pobranie nowych wartości i kierunku ruchu z tablisy reguł
            var newState = this.transit[curState][curChar][0];
            var newChar = this.transit[curState][curChar][1];
            var move = this.transit[curState][curChar][2];
    
            //aktualizacja stanu i litery
            this.display.changeState(newState);
            this.display.changeChar(newChar);

            setTimeout(() => { //czekanie 1s przed ruchem
                if(move[0] == 0 && move[1] == 0){ //zabezpieczenie przed zmianą stanu/litery bez poruszenia się
                    this.display.makeMove(Direction.RIGHT, 0, this);
                }
                else{
                    if(move[0] != 0){ //sprawdzenie przeunięcia w osi X
                        if(move[0] > 0){ //przesunięcie w prawo
                            this.display.makeMove(Direction.RIGHT, move[0], this);
                        } else{ //przesunięcie w lewo
                            this.display.makeMove(Direction.LEFT, -move[0], this);
                        }
                    }
                    if(move[1] != 0){ //sprawdzenie przeunięcia w osi Y
                        if(move[1] > 0){ //przesunięcie w dół
                            this.display.makeMove(Direction.DOWN, move[1], this);
                        } else{ //przesunięcie w górę
                            this.display.makeMove(Direction.UP, -move[1], this);
                        }
                    }
                }
            }, 1000);
        }
    }
}