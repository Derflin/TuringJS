## Introduction

The whole project is about implementing Turing Machine in HTML with the help of JavaScript (JS). Its goal is to let user to work with simulation of Turing Machine with two-dimensional (2d) tape and to allow him to interact with it. Simulation provides to the user functionality such as:
* inputting new data to tape
* inputting new sets of rules
* displaying the current state of the Turing Machine
* iterating over the next steps of the Turing Machine
* outputting the data currently residing on the tapes

## Requirements

The implementation was done with the usage of HTML5, CSS3 and JavaScript. 

It was tested on such web browsers as Chrome, Firefox and Microsoft Edge. 

## Usage

Main file containing the implementation is the file "index.html". It lets user to work with simulation of Turing Machine with two-dimensional (2d) tape and allows him to interact with it. The default state of machine, after starting it up (button "Start") is state numbered "0". Field "Insert Data" lets user to write his own data on the tape (button "Insert" under the field), while the field "Program" lets him to write his own set of rules (button "Compile" under the field). While writing data on the tape, the newline character causes to change current row on tape, into which data is being written. For both of these functions, file provieds default values for tape and set of rules, which provides the functionality of sorting the words available on the tape (bubble sort). User, while the Turing Machine is not working, can traverse and check what is written on tape by using directional keys on keyboard or the corresponding buttons ("Up", "Down", "Left" and "Right") which causes the move of currently visible area of the tape. 

TODO: coś piszemy o uruchomieniu kolejnych iteracji maszyny???

![image](https://user-images.githubusercontent.com/76527849/122673164-884b3e00-d1cf-11eb-9496-4c0cae55e8e2.png)


File "architecture.html" shows how the rules are being parsed and interpreted (step by step) by the scripts. It also contains few examples of the rules that can be used in the main file.

![image](https://user-images.githubusercontent.com/76527849/122673230-ba5ca000-d1cf-11eb-9e5c-2e8f834c50e0.png)


## Rules

During each iteration of the Turing Machine, it checks current state and character on the current position on the tape, and based on that it chooses appropriate rule from the set. The single rule (after being processed) from the set, can be represented as following:

**([char],[state])=>([newchar],[newstate])+[move]**

Where:
* [char] - character on the current position on the tape
* [state] - current state
* [newchar] - new character that will replace [char]
* [newstate] - new state that will replace [state]
* [move] - directional values in form of "[x, y]", which means how the current position on the tape must be changed, before the next iteration of the Turing Machine
   
Example:

**(A,0)=>(A,1)+[0,1]**

## Rules Syntax

TODO



