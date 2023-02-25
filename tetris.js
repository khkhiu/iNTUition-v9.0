class Tetris {
    constructor(imageX, imageY, template){
        this.imageX=imageX;
        this.imageY=imageY;
        this.template=template;
        this.x = squareCountX / 2;
        this.y = 0;
    }
/*
The getTruncedPosition method returns the current position of the shape rounded down to the nearest integer values for the x and y coordinates. It is used in other methods of 
the Shape class to get the position of the shape on the gameMap array, which requires integer values for the array indices. 
By using the Math.trunc() method, the function ensures that the position is always rounded down, which is important for the proper functioning of the game logic.
*/
    getTruncedPosition(){
        return { x: Math.trunc(this.x), y: Math.trunc(this.y)};
    }
/*
This is a method for the Shape class that checks whether the shape can move down one square.
It loops through all squares in the shape's template and for each non-empty square, it calculates its real position on the game map by adding the current shape's x and y position to its position in the template. It then checks if moving the square one square down would make it fall off the game map 
(i.e. its real y position + 1 >= squareCountY), or if there is already another square at the new position on the game map (i.e. gameMap[realY + 1][realX].imageX != -1).
If any of these conditions is met, it returns false, indicating that the shape cannot move down any further. If none of these conditions is met for any square in the template, it returns true, indicating that the shape can move down one square.
*/
    checkBottom(){
        for (let i = 0; i < this.template.length; i++){
            for (let j = 0; j < this.template.length; j++){
                if (this.template[i][j] == 0) continue;
                let realX = i + this.getTruncedPosition().x;
                let realY = j + this.getTruncedPosition().y;
                if (realY +1 >= squareCountY){
                    return false;
                }
                if (gameMap[realY + 1][realX].imageX != -1){
                    return false;
                }
            }
        }
        return true;
    }
/*
This method checkLeft() checks if the current shape can move left by checking each block of the shape against the gameMap. 
It iterates over the template of the shape and calculates the real position of each block on the gameMap by adding the shape's position to the block's position in the template. It then checks if moving the shape one block to the left will result in any collision with existing blocks on the gameMap or if the shape is out of bounds. 
If there is no collision and the shape is still within the bounds of the gameMap, it returns true, indicating that the shape can move left. Otherwise, it returns false.
*/
    checkLeft(){
        for (let i = 0; i < this.template.length; i++) {
            for (let j = 0; j < this.template.length; j++) {
              if (this.template[i][j] == 0) continue;
              let realX = i + this.getTruncedPosition().x;
              let realY = j + this.getTruncedPosition().y;
              if (realX - 1 < 0) {
                return false;
              }
              if (gameMap[realY][realX - 1].imageX != -1) 
              return false;
            }
          }
          return true;
    }
/*
These methods are used to check if the current shape can move left or right respectively without colliding with any other shapes on the game map. They iterate over the shape's template and check the corresponding cells on the game map to see if they are empty or not. 
If any cell to the left or right of the shape is already occupied, the method returns false, indicating that the shape cannot move in that direction. Otherwise, it returns true.
*/
    checkRight(){
        for (let i = 0; i < this.template.length; i++) {
            for (let j = 0; j < this.template.length; j++) {
              if (this.template[i][j] == 0) continue;
              let realX = i + this.getTruncedPosition().x;
              let realY = j + this.getTruncedPosition().y;
              if (realX + 1 >= squareCountX) {
                return false;
              }
              if (gameMap[realY][realX + 1].imageX != -1) 
              return false;
            }
          }
          return true;
    }
/*
These are methods that move the current shape to the left, right, and bottom. They use the checkLeft(), checkRight(), and checkBottom() methods to ensure that the shape can be moved in the desired direction without colliding with other shapes or going out of bounds.
If the movement is allowed, the moveLeft(), moveRight(), and moveBottom() methods update the position of the shape accordingly, and in the case of moveBottom(), also increase the player's score.
*/
    moveBottom(){
        if (this.checkBottom()){
            this.y += 1;
            score += 1;
        }
    }

    moveLeft() {
        if (this.checkLeft()) {
          this.x -= 1;
        }
    }

    moveRight() {
        if (this.checkRight()) {
          this.x += 1;
        }
    }

    changeRotation() {
        let tempTemplate = [];
        for (let i = 0; i < this.template.length; i++)
            tempTemplate[i] = this.template[i].slice();
        let n = this.template.lengthl
        for (let layer = 0; layer < n/2; layer ++){
            let first = layer;
            let last = n - 1 - layer;
            for (let i = first; i < last; i++){
                let offset = i - first;
                let top = this.template[first][i];
                this.template[first][i] = this.template[i][last]; // top == right
                this.template[i][last] = this.template[last][last - offset]; //right = bottom
                this.template[last][last - offset] = this.template[last - offset][first]; //bottom = left
                this.template[last - offset][first] = top; // left = top
            }
        }
    }
}

const imageSquareSize = 24;
const size = 40;
const framePerSecond = 24;
const gameSpeed = 5;
const canvas = document.getElementById("canvas");
const nextShapeCanvas = document.getElementById("nextShapeCanvas");
const scoreCanvas = document.getElementById("scoreCanvas");
const image = document.getElementById("image");
const ctx = canvas.getContext("2d");
const nctx = nextShapeCanvas.getContext("2d");
const sctx = scoreCanvas.getContext("2d");
const squareCountX = canvas.width / size;
const squareCountY = canvas.height / size;

//Setting tetris shapes
const shapes = [
    new Tetris(0, 120, [
      [0, 1, 0],
      [0, 1, 0],
      [1, 1, 0],
    ]),
    new Tetris(0, 96, [
      [0, 0, 0],
      [1, 1, 1],
      [0, 1, 0],
    ]),
    new Tetris(0, 72, [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 1],
    ]),
    new Tetris(0, 48, [
      [0, 0, 0],
      [0, 1, 1],
      [1, 1, 0],
    ]),
    new Tetris(0, 24, [
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
    ]),
    new Tetris(0, 0, [
      [1, 1],
      [1, 1],
    ]),
  
    new Tetris(0, 48, [
      [0, 0, 0],
      [1, 1, 0],
      [0, 1, 1],
    ]),
  ];

let gameMap;
let gameOver;
let currentShape;
let nextShape;
let score;
let initialTwoDArr;
let whiteLineThickness = 4

//Setting game speed
let gameLoop = () => {
    setInterval(update, 1000 / gameSpeed);
    setInterval(draw, 1000 / framePerSecond);
};

/* 
This is a JavaScript function called "deleteCompleteRows" that is used in a Tetris game to remove any complete rows from the game map and update the player's score.
The function uses a nested for loop to iterate over each row and column of the game map. For each row, it checks whether every square in that row has an imageX value of -1. If so, it marks that row as complete and adds 1000 to the player's score.
The function then shifts all of the rows above the completed row down by one index to fill the gap left by the completed row. Finally, it creates a new empty row at the top of the game map by pushing a new array of objects with imageX and imageY values of -1 to the gameMap array.
By removing any complete rows from the game map, this function helps to prevent the game from becoming too cluttered and makes it easier for the player to continue playing. By updating the player's score, the function also provides a feedback mechanism to reward the player for clearing rows and progressing in the game.
Overall, this function is an important part of the Tetris game logic, and it helps to ensure that the game remains fun and challenging for the player.
*/
let deleteCompleteRows = () => {
    for (let i = 0; i < gameMap.length; i++) {
        let t = gameMap[i];
        let isComplete = true;
        for (let j = 0; j < t.length; j++){
            if (t[j].imageX == -1) isComplete = false;
        }
        if (isComplete) {
            console.log("complete row");
            score += 1000;
            for (let k = i; k > 0; k--){
                gameMap[k] = gameMap[k-1];
            }
            let temp = [];
            for (let j = 0; j < squareCountX; j++){
                temp.push({ imageX: -1, imageY: -1 });
            }
            gameMap[0] = temp;
        }
    }
};
/*
This JavaScript code defines an update function that is called continuously to update the game state. The function first checks if the game is over, and if it is, it returns immediately. 
If the current tetris shape can move down, its y position is incremented by one. Otherwise, the function loops through each square in the tetris shape's template and adds it to the game map at its current position, using the getTruncedPosition method to round the position to the nearest integer values. 
Then, it calls the deleteCompleteRows function to remove any completed rows from the game map and update the score. Finally, it sets the current shape to be the next shape and generates a new next shape. If the new current shape cannot move down, the game is over. The function adds 100 points to the score after each move.
*/
let update = () => {
    if (gameOver) return;
    if (currentShape.checkBottom()){
        currentShape.y += 1;
    } else {
        for (let k = 0; k < currentShape.template.length;k++){
            for (let l = 0; l < currentShape.template.length;l++){
                if (currentShape.template[k][l]==0) continue;
                gameMap[currentShape.getTruncedPosition().y + l][
                    currentShape.getTruncedPosition().x + l
                ] = {imageX: currentShape.imageX, imageY: currentShape.imageY};
            }
        }

        deleteCompleteRows();
        currentShape = nextShape;
        nextShape = getRandomShape();
        if (!currentShape.checkBottom()) {
            gameOver =true;
        }
        score += 100;
    }
};

/*
These are two JavaScript functions called "drawRect" and "drawBackground" that are used in a Tetris game to draw rectangles and the background of the game on the canvas.
The drawRect function takes in four parameters - the x and y coordinates of the top-left corner of the rectangle, the width and height of the rectangle, and a color. The function then sets the fillStyle property of the canvas context to the specified color and calls the fillRect() method of the canvas API to draw the rectangle onto the canvas.
The drawBackground function first calls the drawRect function to draw a large rectangle that fills the entire canvas with a purple color. It then uses two for loops to draw a grid of white lines on the canvas, representing the boundaries of each square on the game board.
The first for loop draws vertical lines by calling drawRect for each line, with the x-coordinate set to the square size multiplied by the loop index minus the thickness of the white lines, and the y-coordinate set to 0. The width of each line is set to the thickness of the white lines, and the height is set to the height of the canvas.
The second for loop draws horizontal lines in the same way, but with the x-coordinate set to 0, and the y-coordinate set to the square size multiplied by the loop index minus the thickness of the white lines.
Overall, these functions are used to draw the background of the game, including the grid of white lines that represent the boundaries of each square on the game board. By separating this logic into separate functions, the code is made more modular and easier to maintain.
*/
let drawRect = (x, y, width, height, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
  };
let drawBackground = () => {
   drawRect(0, 0, canvas.width, canvas.height, "#bca0dc");
    for (let i = 0; i < squareCountX + 1; i++) {
      drawRect(
        size * i - whiteLineThickness,
        0,
        whiteLineThickness,
        canvas.height,
        "white"
      );
    }
    for (let i = 0; i < squareCountY + 1; i++) {
      drawRect(
        0,
        size * i - whiteLineThickness,
        canvas.width,
        whiteLineThickness,
        "white"
      );
    }
};

/* 
This is a JavaScript function called "drawCurrentTetris" that draws the current tetris shape onto a canvas using the HTML5 canvas API.
The function loops through the current tetris shape's template (which is an array of arrays that represents the shape) using a nested for loop. For each element in the template, if the value is 0, the function continues to the next element. Otherwise, the function uses the drawImage() method of the canvas API to draw a square image of the tetris block onto the canvas at the appropriate position.
The drawImage() method takes several parameters, including the image object to use (in this case, the image of the tetris block), the position of the image within the image object, the size of the square to draw, and the position of the square within the canvas.
Overall, this function is an important part of a Tetris game, as it handles the visual rendering of the current tetris shape onto the game board.
*/
let drawCurrentTetris = () => {
    for (let i = 0; i < currentShape.template.length; i++){
        for (let j = 0; j < currentShape.template.length; j++){
            if (currentShape.template[i][j]==0)continue;
            ctx.drawImage(
                image,
                currentShape.imageX,
                currentShape.imageY,
                imageSquareSize,
                imageSquareSize,
                Math.trunc(currentShape.x)*size+size*i,
                Math.trunc(currentShape.x)*size+size*j,
                size,
                size
            );
        }
    }
};

/* 
This is a JavaScript function called "drawSquares" that draws all the squares on the game board onto a canvas using the HTML5 canvas API.
The function loops through the gameMap array, which represents the game board, using a for loop. For each row in the gameMap, the function loops through the squares in that row using another for loop. If the square's imageX property is -1, it means that the square is empty, so the function continues to the next square. Otherwise, the function uses the drawImage() method of the canvas API to draw the square image onto the canvas at the appropriate position.
The drawImage() method takes several parameters, including the image object to use (in this case, the image of the square), the position of the image within the image object, the size of the square to draw, and the position of the square within the canvas.
Overall, this function is an important part of a Tetris game, as it handles the visual rendering of all the squares on the game board onto the canvas.*/
let drawSquares = () => {
    for (let i = 0; i < gameMap.length; i++) {
        let t = gameMap[i];
        for (let j = 0; j < t.length; j++){
            if (t[j].imageX == -1) continue;
            ctx.drawImage(
                image,
                t[j].imageX,
                t[j].imageY,
                imageSquareSize,
                imageSquareSize,
                j*size,
                i*size,
                size,
                size
            );
        }
    }
};
/*
This function draws the next shape that will appear on the game board on the canvas located on the right side of the game board.
It starts by filling the entire canvas with a solid color using fillRect() method. Then, it loops through each square of the next shape's template and checks if it's empty or not. If the square is not empty, it uses drawImage() method to draw the corresponding image of that shape's square onto the canvas.
The nextShapeCanvas variable is a reference to the HTML canvas element on which the next shape is drawn. nctx is the 2D drawing context of that canvas. The size of each square is calculated using the size variable, which is based on the width of the game board divided by the number of squares in each row.
*/
let drawNextShape = () => {
    nctx.fillStyle = "#bca0dc"
    nctx.fillRect(0, 0, nextShapeCanvas.width, nextShapeCanvas.height);
    for (let i = 0; i < nextShape.template.length; i++){
        for (let j=0; j < nextShape.template.length; j++){
            if (nextShape.template[i][j]==0) continue;
            nctx.drawImage(
                image,
                nextShape.imageX,
                nextShape.imageY,
                imageSquareSize,
                imageSquareSize,
                size * i,
                size * j + size,
                size,
                size,
            );
        }
    }
};
/* 
These are two functions that draw the score and "Game Over" text on their respective canvas elements.
drawScore clears the score canvas and then uses the fillText method to display the current score in black color using the Poppins font with a size of 64 pixels.
drawGameOver displays the "Game Over!" text in the center of the canvas using the fillText method with the same font and size as drawScore. The text color is also black.
*/
let drawScore = () => {
    sctx.clearRect(0, 0, scoreCanvas.width, scoreCanvas.height);
    sctx.font = "64px Poppins";
    sctx.fillStyle = "black";
    sctx.fillText(score, 10, 50);
};

let drawGameOver = () => {
    sctx.font = "64px Poppins";
    sctx.fillStyle = "black";
    sctx.fillText("Game Over!", 10, canvas.height/2);
};
/*
This is a JavaScript function called "draw" that clears the canvas, and then draws the background, all the squares on the game board, the current tetris shape, the next shape, and the score onto the canvas using other functions.
The first line uses the clearRect() method of the canvas API to clear the entire canvas before redrawing everything. This is important to ensure that the canvas is always updated with the latest state of the game.
The subsequent lines call other functions to draw the different components of the game, including the background, all the squares on the game board, the current tetris shape, the next shape, and the score.
The last conditional statement checks if the game is over and, if so, calls the drawGameOver() function to draw a "game over" message on the canvas.
Overall, this function is the main function that orchestrates the drawing of all the game components onto the canvas. By calling other functions that handle the rendering of specific parts of the game, it makes the code more modular and easier to maintain.*/
let draw = () => {
 ctx.clearRect(0, 0, canvas.width, canvas.height);
 drawBackground();
 drawSquares();
 drawCurrentTetris();
 drawNextShape();
 drawScore();
 if (gameOver) {
    drawGameOver();
    }
};
/*
These are two JavaScript functions called "getRandomShape" and "resetVars" that are used in a Tetris game to generate a random shape and reset the game variables.
The getRandomShape function uses the Math.random() method to generate a random number between 0 and 1, multiplies it by the length of the shapes array, and then rounds down using the Math.floor() method. This gives a random index of the shapes array, and the function returns a new object created from the corresponding shape object using Object.create(). This ensures that a new object is created instead of modifying the original shape object.
The resetVars function resets the game variables to their initial state. It creates a two-dimensional array called initialTwoDArr that represents the game board, with each element initialized as an empty square. It then sets the score to 0 and sets the gameOver variable to false. The function then generates a new random currentShape and nextShape using the getRandomShape function, and sets the gameMap variable to the initialTwoDArr.
Overall, these functions are important in a Tetris game as they handle the random selection of new shapes and resetting of the game variables. By separating this logic into separate functions, the code is made more modular and easier to maintain.
*/
let getRandomShape = () => {
    return Object.create(shapes[Math.floor(Math.random() * shapes.length)]);
};
let resetVars = () => {
    initialTwoDArr = [];
    for (let i = 0; i < squareCountY; i++) {
      let temp = [];
      for (let j = 0; j < squareCountX; j++) {
        temp.push({ imageX: -1, imageY: -1 });
      }
      initialTwoDArr.push(temp);
    }
    score = 0;
    gameOver = false;
    currentShape = getRandomShape();
    nextShape = getRandomShape();
    gameMap = initialTwoDArr;
};
/*
This code adds an event listener to the window object to listen for keyboard inputs. When a key is pressed, the code checks which key was pressed using the keyCode property of the event object. 
If the left arrow key (key code 37) is pressed, it calls the moveLeft() method of the currentShape object. 
If the up arrow key (key code 38) is pressed, it calls the changeRotation() method of the currentShape object.
If the right arrow key (key code 39) is pressed, it calls the moveRight() method of the currentShape object. 
Finally, if the down arrow key (key code 40) is pressed, it calls the moveBottom() method of the currentShape object. 
These methods are responsible for updating the position or rotation of the current tetris shape on the canvas.
*/
window.addEventListener("keydown", (event)=> {
    if (event.keyCode == 37) currentShape.moveLeft();
    else if (event.keyCode == 38) currentShape.changeRotation();
    else if (event.keyCode == 39) currentShape.moveRight();
    else if (event.keyCode == 40) currentShape.moveBottom();
});

resetVars()
gameLoop()