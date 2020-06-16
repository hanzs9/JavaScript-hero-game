var divCounter = document.getElementById("counter");
var numberOfTurn = document.getElementById("numberOfTurn");
var numberOfTreasure = document.getElementById("numberOfTreasure");
var userScore = document.getElementById("userScore");
var killerRobotScore = document.getElementById("killerRobotScore");
var table = document.getElementById("t1");
var boardLength = 10;
var boardWidth = 10;
var board = new Array();
var heroPosX;
var heroPosY;
var heroExist = 0;
var turn = 0;
var treasureNumber = 0;
var heroScore = 0;
var killerScore = 0;
var stopEventListener = 0;
var end = 0;
var heroAlive = 1;
var noPutTreasureAtSetup = 0;

/* This part is to respond the Start button */
var btnstart = document.getElementById("button1");
btnstart.onclick = click1;
function click1(event){
  if(setupStageCheck() && startCheck()) { // judge whether user can start to play or not
    start(); // user can start to play. jump to start() function
  } else if(heroExist!=0) { // if not satisty start condition and not put hero
    endStageStatement(); // jump to end stage
  }
}

/* This part is to end the game when user press end button */
var btnend = document.getElementById("button2");
btnend.onclick = click2;
function click2(event){
  end = 1; // change end state
  endStageStatement(); // jump to end stage
}

/* This part is to initalize the table in the website */
function init(table) {
  divCounter.setAttribute("style","display:none;"); // hide the score board
  // create new board
  for(var y=0;y<boardWidth;y++) {
    var tr = document.createElement("tr"); // add new tr
    table.appendChild(tr); // append new tr into table
    board[y] = new Array(y); // add new array to build 2d array
    for(var x=0;x<boardLength;x++) {
      board[y][x] = 0 // 0 is default value in the board
      var td  = document.createElement("td"); // add new td
      var txt = document.createTextNode(checkSetUp(board[y][x])); // create txt
      td.appendChild(txt);// add txt
      td.addEventListener("click",setUp.bind(null,x,y),false); // bind addEventListener to table cells
      tr.appendChild(td); // add td
    }
  }
}

/* This part is to set characters in setup stage */
function setUp(x,y,event) {
  if(stopEventListener == 0){ // make sure is in setup stage
    if(end == 0){ // make sure is not end
      clearMessage(); // clear the error message
      if (board[y][x] != 0) { // if the position is not occupied
        showMessage("Grid position ["+x+","+y+"] already occupied","RedBG"); //show error message
      } else {
        characterObject = prompt("Enter a new character object, 1-9 are treasure , o is obstacle, h is hero, k is robot"); // promt a window to fill information
        event.target.innerHTML = checkSetUp(characterObject,x,y); // sign value to table cells
        if(event.target.innerHTML != " "){board[y][x]=1;} // if table cells is not empty
        console.log(event.target.innerHTML); // print what you put in the table
      }
    }
  }
}

/* This part to choose what you fill in table */
function checkSetUp(num,x,y) {
  switch (num) { // user switch funciton to choose
    case 0: return " "; // return default value
    case "o": return letterConvertPicture("o"); // put obstacle in the map
    case "h": // put hero in the map
    if(heroExist == 0){ //if hero have not been put
      heroPosX = x; // set hero position x
      heroPosY = y; // set hero position y
      heroExist = 1; // set hero exist
      return letterConvertPicture("h"); // return "h"
    } else {
      return ErrorMessage(2); // show error message
    }
    case "k": return letterConvertPicture("k");
    default:
    if(letterConvertNumber(num)>0 && letterConvertNumber(num)<=9){ // if input is treasure
      numberOfTreasure.textContent = "The number of treasure: "+(++treasureNumber); // change treasure number
      return num;
    }
    return ErrorMessage(1); // print error message
  }
}

/* This part is to check whether put hero or not before starting game */
function setupStageCheck(){
  if(heroExist==0) { // if hero is not put
    ErrorMessage(3);
    return false;
  }
  return true;
}

/* This part is to check whether can start game or not */
function startCheck(){
  if(treasureNumber==0) { // if there is not treasure
    end = 1; // end game
    noPutTreasureAtSetup = 1;
    return false;
  }
  if(allKillersCannotMove()==true && heroCannotMove(heroPosX,heroPosY)==true) { // if hero and all killers cannot move
    end = 1; // end game
    return false;
  }
  return true;
}

/* This part is starting the game */
function start(){
  divCounter.setAttribute("style","display:block;"); // display the score board
  stopEventListener = 1; // cannot click the table to add new characters
  document.onkeydown=function(e){    // add listener to listen keyboard input
    var keyNum=window.event ? e.keyCode :e.which; // sign input value to keyNum
    if(end == 0) { // if it is not ending
      clearMessage(); // clear the error message
      if(keyNum == 87 | keyNum==83| keyNum==65| keyNum==68) { // if input value is W or A or S or D
        if(keyNum==87){ // if input value is W
          if(canMove(heroPosX,heroPosY-1)) { // if hero can move up
            table.rows[heroPosY].cells[heroPosX].innerHTML = " "; // clear hero current place
            heroPosY = heroPosY-1; // update hero position
            if(table.rows[heroPosY].cells[heroPosX].innerHTML == letterConvertPicture("k")){ // if new position is killer
              heroAlive = 0; // hero die
              end = 1; // end game
            }else {
              heroUpdateScore(heroPosX,heroPosY); // hero go to that position
            }
          }else{
          showMessage("the attempt to move fails!!!","RedBG"); // touch obstacle or touch gird
          }
        }

        if(keyNum==83){ // if input value is S
          if(canMove(heroPosX,heroPosY+1)) { // if hero can move down
            table.rows[heroPosY].cells[heroPosX].innerHTML = " "; // clear hero current place
            heroPosY = heroPosY+1; // update hero position
            if(table.rows[heroPosY].cells[heroPosX].innerHTML == letterConvertPicture("k")) { // if new position is killer
            heroAlive = 0; // hero die
            end = 1; // end game
            } else {
              heroUpdateScore(heroPosX,heroPosY); // hero go to that position
            }
          } else {
          showMessage("the attempt to move fails!!!","RedBG"); // touch obstacle or touch gird
          }
        }

        if(keyNum == 65){ // if input value is A
          if(canMove(heroPosX-1,heroPosY)){ // if hero can move left
            table.rows[heroPosY].cells[heroPosX].innerHTML = " "; // clear hero current place
            heroPosX = heroPosX-1; // update hero position
            if(table.rows[heroPosY].cells[heroPosX].innerHTML == letterConvertPicture("k")) { // if new position is killer
              heroAlive = 0; // hero die
              end = 1; // end game
            } else {
              heroUpdateScore(heroPosX,heroPosY); // hero go to that position
            }
          } else {
            showMessage("the attempt to move fails!!!","RedBG"); // touch obstacle or touch gird
          }
        }

        if (keyNum == 68){ // if input value is D
          if(canMove(heroPosX+1,heroPosY)){// if hero can move right
            table.rows[heroPosY].cells[heroPosX].innerHTML = " "; // clear hero current place
            heroPosX = heroPosX+1; // update hero position
            if(table.rows[heroPosY].cells[heroPosX].innerHTML == letterConvertPicture("k")){ // if new position is killer
              heroAlive = 0; // hero die
              end = 1; // end game
            }else {
              heroUpdateScore(heroPosX,heroPosY); // hero go to that position
            }
          } else {
            showMessage("the attempt to move fails!!!","RedBG"); // touch obstacle or touch gird
          }
        }
        // Hero move finish ! It is robot time now
        if(end == 0){ // if have not end
          killerRobotsTurn(); // jump into killer turn
        }
        numberOfTurn.textContent = "Turn: "+(++turn); // display number of turn in score board and turn add itself
        console.log(heroScore); // print hero score in console
        console.log(killerScore); // print killer score in console
      } else { // if you not input W A S D
        showMessage("please input W A S D !","RedBG"); // show error message
      }
    }
    if(end == 1){ // After a turn, check end or not
      endStageStatement(); // jump to end stage
    }
  }
}

/* This part is to judge who win the game  */
function endStageStatement(){
  if(noPutTreasureAtSetup == 1) { // if there is not treasure put in map
    showMessage("Congratulation! User win!","RedBG"); // user win
  } else if(heroAlive == 1 && heroScore>killerScore) { // if hero is still alive adn score greater than killer score
    showMessage("Congratulation! User win!","RedBG"); // user win
  } else if (heroAlive == 0) { // if hero die
    showMessage("Game over! Killer win!","RedBG"); // killer win
  } else if (killerScore>heroScore) { // killer score is greater than hero score
    showMessage("Game over! Killer win!","RedBG"); // killer win
  } else {
    showMessage("Draw!","RedBG"); // draw
  }
}

/* This part is to check whether position is beyond the grid or not */
function beyondGrid(x,y) { // pass position x and y
  if(x<0|x>=boardLength|y<0|y>=boardWidth) // if x and y is not in board
    return true;// that beyond the grid
  return false; // default return false
}

/* This part is to check whether position touchs obstacle or not */
function touchObstacle(x,y) { // pass position x and y
  if(table.rows[y].cells[x].innerHTML == letterConvertPicture("o")) // if that position is obstacle
    return true; // that positon exist a obstacle
  return false; // default return false
}

/* This part is to check whether position can move to or not */
function canMove(x,y) { // pass position x and y
  if(beyondGrid(x,y)) { // if it is not beyond the grid
    return false;
  }
  if(touchObstacle(x,y)) { // if it is not a obstacle
    return false;
  }
  return true; // reutn can move
}

/* This part is to update hero score */
function heroUpdateScore(x,y){
  var score = letterConvertNumber(table.rows[y].cells[x].innerHTML); // get score
  if(score>0 && score<=9) { // if score is 1-9
    heroScore += score; // add score
    userScore.textContent = "User's score: "+heroScore; // update score board
    numberOfTreasure.textContent = "The number of treasure: "+(--treasureNumber); // minus the number of treasure
    if(treasureNumber<=0){ // if there is not treasure in the map
      end = 1; // end game
    }
  }
  table.rows[heroPosY].cells[heroPosX].innerHTML = letterConvertPicture("h");// hero go in here
}

/* This part is to update killer score */
function killerUpdateScore(c,r,nearTreasureX,nearTreasureY,TreasureValue){
  table.rows[r].cells[c].innerHTML = " "; // clear old position
  killerScore += TreasureValue; // update killer score
  killerRobotScore.textContent = "killer robots' score: "+killerScore; // update score board
  numberOfTreasure.textContent = "The number of treasure: "+(--treasureNumber); // minus the number of treasure
  if(treasureNumber<=0){ // if there is not treasure in the map
    end = 1; // end game
  }
  table.rows[nearTreasureY].cells[nearTreasureX].innerHTML = letterConvertPicture("k");// move killer
}

/* This part is to check hero can move or not */
function heroCannotMove(heroPosX,heroPosY){ //pass hero position
  // if hero canno move up down left right
  if(canMove(heroPosX+1,heroPosY)|canMove(heroPosX-1,heroPosY)|canMove(heroPosX,heroPosY+1)|canMove(heroPosX,heroPosY-1)) {
    return false;
  }
  return true; // return hero cannot move
}

/* This part is to check all killers can move or not */
function allKillersCannotMove(){
  var arrKillerPositionX = []; // save killer position x
  var arrKillerPositionY = []; // save killer position y
  for(var findRow=0,n=table.rows.length;findRow<n;findRow++) { // for each row in table
    for(var findColumn=0, m=table.rows[findRow].cells.length;findColumn<m;findColumn++){ // for each cell in table
      if(table.rows[findRow].cells[findColumn].innerHTML == letterConvertPicture("k")){ // if the cell is killer
        arrKillerPositionX.push(findColumn); //push position to array
        arrKillerPositionY.push(findRow); //push position to array
      }
    }
  }
  var numberOfKillersCannotMove = 0; // number of killer cannot move

  for(var i=0;i<arrKillerPositionX.length;i++) { // for each killer
    var killerCannotMove = 0; // the number of cells killer cannot move
    for(var killerR=arrKillerPositionY[i]-1;killerR<=arrKillerPositionY[i]+1;killerR++) { // for rows surround by killer
      for(var killerC=arrKillerPositionX[i]-1;killerC<=arrKillerPositionX[i]+1;killerC++) { // for cells surround by killer
        if(!canMove(killerC,killerR)){ // if killer cannot move
          killerCannotMove++;
        } else if(canMove(killerC,killerR)) {
          if(table.rows[killerR].cells[killerC].innerHTML == letterConvertPicture("k")){ // if the position is another killer
            killerCannotMove++;
          }
        }
      }
    }
    if(killerCannotMove==9){ // if all the cells surrounding by killer can move to
      numberOfKillersCannotMove++; // one killer cannot move
    }
  }
  if(numberOfKillersCannotMove == arrKillerPositionX.length){ //if all killer cannot move
    return true; // return all killer cannot move
  }
  return false;
}
/* This part is killer robots turn  */
function killerRobotsTurn(){
  var arrKillerPosX = []; // save killer position x
  var arrKillerPosY = []; // save killer position y
  for(var r=0,n=table.rows.length;r<n;r++) { // for each row in table
    for(var c=0, m=table.rows[r].cells.length;c<m;c++){ // for each cell in table
      if(table.rows[r].cells[c].innerHTML == letterConvertPicture("k")){ // if the cell is killer
        arrKillerPosX.push(c); //push position to array
        arrKillerPosY.push(r); //push position to array
      }
    }
  }

  for(var i=0;i<arrKillerPosX.length;i++){ // for each killer
    if(end == 0){ // if game is not end
      eachKillerRobotsMove(arrKillerPosX[i],arrKillerPosY[i]); // jump to each killer move funciton
    }
  }
}

/* This part is to check each killer can move or not */
function eachKillerRobotsMove(c,r){
  var nearHero = 0; // if near hero
  var nearHeroX; // near hero position x
  var nearHeroY; // near hero position y
  var nearTreasure = 0; // if near treasure
  var nearTreasureX; // near treasure position x
  var nearTreasureY; // near treasure position y
  var TreasureValue = 0; // treasure value
  for(var killerR=r-1;killerR<=r+1;killerR++) { // for rows surround by killer
    for(var killerC=c-1;killerC<=c+1;killerC++) { // for cells surround by killer
      if(!beyondGrid(killerC,killerR) && table.rows[killerR].cells[killerC].innerHTML == letterConvertPicture("h")) { // if cell is hero
        nearHero = 1; // find hero
        nearHeroX = killerC; // sign hero position x
        nearHeroY = killerR; // sign hero position y
      }
    }
  }

  for(var killerR=r-1;killerR<=r+1;killerR++) { // for rows surround by killer
    for(var killerC=c-1;killerC<=c+1;killerC++) { // for cells surround by killer
      if(!beyondGrid(killerC,killerR) && letterConvertNumber(table.rows[killerR].cells[killerC].innerHTML)>0){ //find treasure
        nearTreasure = 1; // find treasure
        if(letterConvertNumber(table.rows[killerR].cells[killerC].innerHTML)>TreasureValue){ //which treasure is biggest
          TreasureValue = letterConvertNumber(table.rows[killerR].cells[killerC].innerHTML); // update treasure
          nearTreasureX = killerC; // sign treasure positon x
          nearTreasureY = killerR; // sign treasure positon y
        }
      }
    }
  }
  if(nearHero == 1){ // if find hero
    table.rows[r].cells[c].innerHTML = " ";
    table.rows[nearHeroY].cells[nearHeroX].innerHTML = letterConvertPicture("k"); // eat hero
    heroAlive = 0; // hero die
    end = 1; // win!!!!!!!!!!!!!!!
  } else if (nearTreasure == 1 && TreasureValue>0) { // find treasure
    killerUpdateScore(c,r,nearTreasureX,nearTreasureY,TreasureValue); // update treasue
  } else { // otherwise go to find hero
    var availableX = []; //available positon X
    var availableY = [];//available positon Y
    var distance=boardWidth*boardLength; // longest distance
    var robotMoveX; // killer move x
    var robotMoveY; // killer move y

    for(var killerR=r-1;killerR<=r+1;killerR++) { // for rows surround by killer
      for(var killerC=c-1;killerC<=c+1;killerC++) { // for cells surround by killer
        // if killer can move
        if(!beyondGrid(killerC,killerR) && table.rows[killerR].cells[killerC].innerHTML != letterConvertPicture("k") && table.rows[killerR].cells[killerC].innerHTML != letterConvertPicture("o")){
          availableX.push(killerC); //push position to array
          availableY.push(killerR); //push position to array
        }
      }
    }

    for(var i=0;i<availableX.length;i++){ // for all available position
      var tempDistance = Math.abs(availableX[i]-heroPosX)+Math.abs(availableY[i]-heroPosY) // calculate the minimum distance
      if(tempDistance<distance){ // if find minimum distance
        distance = tempDistance; // update distance
        robotMoveX = availableX[i]; // update killer move x
        robotMoveY = availableY[i]; // update killer move y
      }
    }
    if(robotMoveX != undefined){ //if killer can move
      table.rows[r].cells[c].innerHTML = " "; // clear old plcae
      table.rows[robotMoveY].cells[robotMoveX].innerHTML = letterConvertPicture("k"); // update new position
    }
  }
}

/* This part is to alert error message */
function ErrorMessage(number) {
  switch (number) {
    case 1:
    alert ("Invaild input! Please reinput");
    return " ";
    case 2:
    alert ("Invaild input! You can only put a hero!");
    return " ";
    case 3:
    alert ("Cannot start the game! Please put a hero!");
    break;
  }
}

/* This part is to clear error message */
function clearMessage() {
  m1 = document.getElementById("m1");
  m1.style.display = "none";
}

/* This part is to clear error message */
function showMessage(message,style) {
  m1 = document.getElementById("m1");
  m1.innerHTML = message;
  m1.style.display = "block";
  m1.className = style;
}

/* This part is to convert letter to number */
function letterConvertNumber(letter) {
 switch (letter) {
  case "1": return 1;
  case "2": return 2;
  case "3": return 3;
  case "4": return 4;
  case "5": return 5;
  case "6": return 6;
  case "7": return 7;
  case "8": return 8;
  case "9": return 9;
  default: return 0;
  }
}

/* This part is to convert letter to picture */
function letterConvertPicture(letter) {
 switch (letter) {
  case "k": return "<img src=\"killer.png\">";
  case "h": return "<img src=\"hero.png\">";
  case "o": return "<img src=\"obstacle.png\">";
  }
}

//start game!
init(table);
