## Introduction

The whole project is about implementing Turing Machine in HTML with the help of JavaScript (JS). Its goal is to allow user to simulate the work of Turing Machine with two-dimensional (2d) tape and to allow him to interact with it. Simulation provides to the user functionality such as:
* inputting new data to tape
* inputting new sets of rules
* displaying the current state of the Turing Machine
* iterating over the next steps of the Turing Machine
* outputting the data currently residing on the tapes

## Requirements

The implementation was done with the usage of HTML5, CSS3 and JavaScript. 

It was tested on such web browsers as Chrome, Firefox and Microsoft Edge. 

## Usage



## Rules

During each iteration of the Turing Machine, it checks current state and character on the current position on the tape, and based on that it chooses appropriate rule from the set. The single rule (after being processed) from the set, can be represented as following:

**([char],[state])=>([newchar],[newstate])+[move]**

Where: TODO
* [char]
* [state]
* [newchar]
* [newstate]
* [move]
   
Example:

**(A,0)=>(A,1)+[0,1]**

Which means: TODO

## Rules Syntax

TODO



