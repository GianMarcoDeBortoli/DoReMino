# DòReMino

## Links

Game link: https://giemme13.github.io/DoReMino/openingTitle.html

Demo video: https://youtu.be/DPyeD5LiCds

## Introduction 
The project consists in the development of a melodic game loosely based on the rules of traditional Domino. 

At first the player must select the mode in which to play: the tiles will only contain notes that belong to that musical mode.  
The modes available are:  
  * Ionian 
  * Dorian
  * Phrygian 
  * Lydian 
  * Myxolydian 
  * Aeolian 
  * Locrian 

All the modes are built upon the note C. During the game it is always possible to listen to the tonic, as reference.

The player can also select the difficulty of the game. 
In "difficulty: normal", the player is provided with a set of tiles that have two colored sides: each color is associated with a note.  
In "difficulty: expert", the tiles provided do not show different colors anymore, so the player can only rely on sound. 

The tiles must then be placed on the board by matching notes, creating a sequence. It is possible to duplicate, one at a time, any tile already placed on the board, in order to use it again and create repetitions. During the game, the player may listen to the melody created by the sequence at any time. The game ends when the time limits expires or when the player decides to. 

The scoring system evaluates the melody that was created, in order to make the game more creatively challenging. Tips will appear during the game; these are based on player’s choices. At the end of the game a feedback is given to player with comments both on what he did correctly and on what he can improve. 

## Technologies used 

The languages used to develop our web applications are JavaScript, HTML and CSS. 
The pattern used in all the project is the model view controller. 

The game is divided into the following HTML pages: 

  * openingTitle.html: title animation; 
  * modeSelection.html: page to select the mode and the difficulty; 
  * rules.html: rules of the game; 
  * demo.html: demo of the game; 
  * game.html: page where the game actually takes place; 
  * score.html: final page with scoring. 

Information from one page to the other are passed by parameters using the GET method of the HTML form. 
Each page is associated with a stylesheet and a corresponding JS file. 

In our project we decided to use Parcel, a web application bundler, in particular to modulate the code. We created 4 modules (melodyEvaluator.js, table.js, sound.js, timer.js). In each module there are functions related to each other, but used in different pages. For example, functions in melodyEvaluator.js are used during the game and also in the scoring page. 

In order to implement audio features, we used an external JS framework named Tone.js. It can be defined as a Web Audio framework aimed at creating and dynamically manipulating sounds and music in a web page. 
We used this framework to create ambient sounds during the game and to create a sound for each note of the tile. The latter are also used to play the melody during the game and inside the ending page with the obtained score. 

## In-depth description  

The core of the project is represented by two Javascript files: “game.js” and “score.js”, that handle the main part of the game itself and the scoring respectively.

### Game

The array of grades in game.js is filled accordingly to the mode received by the select input of the previous page (modeSelection.html). Therefore, the set of notes (and colours) of the tiles available in the game changes. 

<img width="333" alt="ex1" src="https://user-images.githubusercontent.com/74858242/121670817-26435800-caae-11eb-8962-0b1cb1fb6712.png">

The set of tiles is created by associating randomly two grades to each tile; colours are taken accordingly to the grade from an array called “colours”. The created set appears in the dedicated space on the top of the page.

When the set is created, all the tiles are also added to a dictionary called “setPieces” that contains all the information we need to work with: the two grades and the orientation. 

<img width="984" alt="ex2" src="https://user-images.githubusercontent.com/74858242/121670862-30fded00-caae-11eb-8c1d-6be76b0f6215.png">

This is because all the tiles present in the set can rotate and therefore the angle in the dictionary “setPieces” changes accordingly. 

Two important event listeners added to the tile are the drag one and the drop one, that allow the user to place the tile in the board.In particular, the drop is allowed only when the tile is rotated in the right way and the colour of the last tile matches with the new one. Feedbacks are given if the player makes a mistake. 
If the drop is allowed, then the tile is removed from the “setPieces” dictionary, and the correct grade is added to the “result” array. This array contains the sequence of grades of the tiles placed on the board. It represents the melody that is being created. It is interesting to note that it contains a subset of the integer numbers of the mode that was selected. 

After the tile has been added to the “result” array, a function that evaluates the melody is called. It is different from the one called at the end of the game because it takes into account only a part of all the functions used at the end to calculate the score. 

It is used, in particular, to give tips and help the user to not make the same mistakes. 

At any time during the game the player can listen to the notes on the tiles, both the ones in the set and the ones already on the board. If needed, the entire melody created can be listened to as well thanks to designated button. 
To play the melody during the game we used a function created using Tone.js, that can be found inside the module “sound.js”. It can be called anytime during the game or at the end of the game, in the scoring page. 
 
<img width="544" alt="ex3" src="https://user-images.githubusercontent.com/74858242/121671057-660a3f80-caae-11eb-8610-75f14fa51463.png">

This function uses a constant dictionary “searchForNote” that contains all the possible grades and the corresponding note, needed to associate the grade present in the “result” array with the name of the note. 
  
<img width="1053" alt="ex4" src="https://user-images.githubusercontent.com/74858242/121671104-74585b80-caae-11eb-9efb-af701db1dd8b.png">
 
The array "result” is then passed to the scoring page score.js. 
 
### Scoring

In score.js  is placed the evaluation system using the functions from module “melodyEvaluator.js”. 

Firstly, the “result” array is retrieved from the game page. 
We created a button that, starting from “result” and with the help of the arrays “colors” and “searchForNote” we previously talked about, gives the start to an animation of falling tiles and simultaneously plays the melody created in the game. The tiles bring the same colours and notes of the ones in the game, and, after the fall, the name of the note appear. 

Below the animation, a score bar appears. The number displayed is the one calculated by the evaluation system and with the number some comments are written. The comments are divided between compliments, if the player created a melody with particularly good features, and suggestions, if some mistakes are detected. 

The evaluation system is built as follows: 

 1) Calls the functions from the module “melodyEvaluator.js” and stores the returned values in some variables to take track of the results.
 <img width="552" alt="ex5" src="https://user-images.githubusercontent.com/74858242/121671143-80441d80-caae-11eb-8901-374620d18ce3.png">
 
 2) Based on those results, the comments are then chosen and inserted inside the correct boxes of the page. 
 <img width="628" alt="ex6" src="https://user-images.githubusercontent.com/74858242/121671295-a8338100-caae-11eb-98eb-43b54bd574f3.png">

3) The total score is a percentage and is given by a weighted mean of four main features: image 
    * Length of the melody 
    * The use of different notes throughout the melody and the fact that player has started and/or ended on the         tonic
    * The contour of the melody
    * The length of the leaps used to pass from note to note.

<img width="633" alt="ex7" src="https://user-images.githubusercontent.com/74858242/121671384-c4cfb900-caae-11eb-84e8-9a27f378510b.png">  

Note that there is a further mechanisms that changes the weigths of each feature change depending on the situation: i.e., if the player has created a long melody using only one note, then the system recognizes the case and gives a high weight to the parameters that punishes more the fact that most of the notes are untouched.  

