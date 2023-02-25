class Tetris {
    constructor(imageX, imageY, template){
        this.imageX=imageX;
        this.imageY=imageY;
        this.template=template;
    }

    checkBottom(){}

    checkLeft(){}

    checkRight(){}

    moveBottom(){}

    moveLeft(){}

    moveRight(){}

    changeRotation() {}
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
//const nctx = nextShapeCanvas.getContext("2d");
//const sctx = scoreCanvas.getContext("2d");
const squareCountX = canvas.width / size;
const squareCountY = canvas.height / size;

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

let gameLoop = () => {
    setInterval(update, 1000 / gameSpeed);
    setInterval(draw, 1000 / framePerSecond);
};

let update = () => {};

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
The function loops through the current tetris shape's template (which is an array of arrays that represents the shape) using a nested for loop. 
For each element in the template, if the value is 0, the function continues to the next element. Otherwise, the function uses the drawImage() method of the canvas API to draw a 
square image of the tetris block onto the canvas at the appropriate position.
The drawImage() method takes several parameters, including the image object to use (in this case, the image of the tetris block), 
the position of the image within the image object, the size of the square to draw, and the position of the square within the canvas.
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

gameLoop()