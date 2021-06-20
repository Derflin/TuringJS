## Introduction

The whole project is about implementing Turing Machine in HTML with the help of JavaScript (JS). Its goal is to let user work with simulation of Turing Machine with two-dimensional (2d) tape and to allow him to interact with it. Simulation provides to the user functionality such as:
* inputting new data to tape
* inputting new sets of rules
* displaying the current state of the Turing Machine
* iterating over the next steps of the Turing Machine
* outputting the data currently residing on the tapes

## Requirements

The implementation was done with the usage of HTML5, CSS3 and JavaScript. 

It was tested on such web browsers as Chrome, Firefox and Microsoft Edge. 

## Usage

Main file containing the implementation is the file "index.html". It lets user to work with simulation of Turing Machine with two-dimensional (2d) tape and allows him to interact with it. 

The default state of machine, after starting it up (button "Start") is state numbered "0". Field "Insert Data" lets user to write his own data on the tape (button "Insert" under the field), while the field "Program" lets him to write his own set of rules (button "Compile" under the field). While writing data on the tape, the newline character causes to change current row on tape, into which data is being written. For both of these functions, file provides default values for tape and set of rules, which provides the functionality of sorting the words available on the tape (bubble sort). 

User, while the Turing Machine is not working or is stopped, can traverse and check what is written on tape by using directional keys on keyboard or the corresponding buttons ("Up", "Down", "Left" and "Right") which causes the move of currently visible area of the tape. 

![image](https://user-images.githubusercontent.com/76527849/122673164-884b3e00-d1cf-11eb-9496-4c0cae55e8e2.png)

File "architecture.html" shows how the rules are being parsed and interpreted (step by step) by the scripts. It also contains a few examples of the rules that can be used in the main file.

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
Each rule is constructed according to the following syntax:

**([charCondition],[stateCondition])=>([charExpression],[stateExpression])[direction]**

* **[charCondition]** and **[stateCondition]** operate on the same syntax, where user can (except providing a value or identifier):

   * use identifiers to operate on actual values - (**@='A'**,**S=**300)=>(**@**,**S**+20)-y
   * use intervals - (@=**<'A','Z'>**,7)=>(@,0)
   * use unions - ('*',**{2,4,6,8}**)=>(0,3)-y

   Every usage shown above can be combined with each other - (**@={<'A','Z'>,<'a','z'>}**,7)=>(**@**,0)

* **[charExpression]** and **[stateExpression]** operate on the same syntax, where user can (except providing a value or identifier):

   * do basic mathematical nad logical operations, such as
      * addition '+' - (@=<0,10>,3)=>(**@+30**,14)+x
      * subtraction '-' - (0,S={2,5,6,20})=>(0,**S-10**)+x-y
      * multipication '*' - (@={<'A','Z'>},S=<420,449>)=>(@,**S\*5**)
      * division without rest '/' - (@={<'a','z'>},S=<20,50>)=>(@,**S/5**)
      * division with rest '%' - (@={'e','g'},S=<100,150>)=>(@,**S%3**)
      * bit negation '~' - (0,S=<101,160>)=>(**~S**,200)-y
      * bit conjunction '&' - (@=<10,60>,S=<30,160>)=>(S,**@&S**)+y
      * bit alternative '|' - (@=10,S=<2,8>)=>(@,**S|5**)-x
      * bit negative alternative '^' - (@={1,3,5,7},S=25)=>(S,**@^3**)-y+x
      * exponentiation '\*\*' - (@={'^','*'},S=<1,10>)=>(**S\*\*2**,100)-y-x
      * left-hand bit shift '<<' - (@='<',S=<8,16>)=>(@,**S<<3**)+x
      * right-hand bit shift '>>' - (@='>',S=<64,124>)=>(@,**S>>4**)-y
      * intersection '\`' - (@={5,11,13},S=**@`{1,5,8}**)=>('s',12)
      * symmetric difference '\`\`' - (@={1,2},**S=@``{9,15,32}**)=>(4,S-5)+x
      * set difference '\\' - (@={7,8,11,12,13},**S=@\\{8,12,32}**)=>('a',@/5)-2y
   * do complex operations - (@=<'a','z'>,S=<301,360>)=>(@,**S-301\*(@/4)+'a'+450**)-y

* **[direction]** can be either:
   * nothing when not changing position - (0,79)=>(0,300)
   * one way move - (@=<'A','Z'>,300)=>(@,449)**-y**
   * two way move - (0,5)=>(0,7)**+x+y**

   It is also possible to move more than 1 field by placing requested number before variable - (0,99)=>(0,100)**+5y-10x**

## Constants

Our program gives a possibility of creating constant variables. They must be declared before rules. 

Constant's syntax is simple:

**[identifier]=[value]**

Where:
* [identifier] - custom character or string starting with letter
* [value] - chosen value

After declaring constant variables they can be used in rules:

**var = 9**
&nbsp;\
(@=<'a','z'>,**S=var**)=>(@,**var+5**)-y

