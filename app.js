const cvs = document.getElementById("snake");
const ctx = cvs.getContext("2d");

//create the unit
const box = 32;

//load images

const ground = new Image();
ground.src = "images/ground.png";

const foodImg = new Image();
foodImg.src = "images/food.png";

//load audio files

let dead = new Audio();
let eat = new Audio();
let up = new Audio();
let left = new Audio();
let right = new Audio();
let down = new Audio();

dead.src = "audio/dead.mp3"
eat.src = "audio/eat.mp3"
up.src = "audio/up.mp3"
right.src = "audio/right.mp3"
left.src = "audio/left.mp3"
down.src = "audio/down.mp3"

//create the snake

let snake = [];

snake[0] = {
    x : 9 * box,
    y : 10 * box
};

//create the food

let food = {
    x : Math.floor(Math.random()*17+1) * box,
    y : Math.floor(Math.random()*15+3) * box
}

//control the snake

let d;

document.addEventListener("keydown",direction);

function direction(event) {
    let key = event.keyCode;
    if(event.keyCode == 37 && d != "RIGHT") {
        d = "LEFT";
        left.play();
    }else if(event.keyCode == 38 && d != "DOWN") {
        d = "UP";
        up.play();
    }else if(event.keyCode == 39 && d != "LEFT") {
        d = "RIGHT";
        right.play();
    }else if(event.keyCode == 40 && d != "UP") {
        d = "DOWN";
        down.play();
    }
}

//create the score var

let score = 0;

//check collision function

function collision(head, array) {
    for(let i = 0; i < array.length; i++) {
        if(head.x == array[i].x && head.y == array[i].y) {
            return true;
        }
    }
    return false;
}

//draw everything to the canvas

function draw() {

    ctx.drawImage(ground,0,0);

    for(let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i == 0)? "green" : "white";
        ctx.fillRect(snake[i].x, snake[i].y,box,box);

        ctx.strokeStyle = "red";
        ctx.strokeRect(snake[i].x,snake[i].y,box,box);
    }

    ctx.drawImage(foodImg, food.x, food.y);

    //old head position
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    //which direction
    if(d == "LEFT") snakeX -= box;
    if(d == "UP") snakeY -= box;
    if(d == "RIGHT") snakeX += box;
    if(d == "DOWN") snakeY += box;

    //if snake eats the food
    if(snakeX == food.x && snakeY == food.y) {
        score++;
        eat.play();
        food = {
            x : Math.floor(Math.random()*17+1) * box,
            y : Math.floor(Math.random()*15+3) * box
        }
        //we don't remove the tail
    }else{
        //remove the tail
        snake.pop();
    }

    //add new head

    let newHead = {
        x : snakeX,
        y : snakeY
    }

    //game over

    if(snakeX < box || snakeX > 17 * box || snakeY < 3 * box || snakeY > 17 * box || collision(newHead,snake)) {
        clearInterval(game);
        dead.play();
    }

    snake.unshift(newHead);

    ctx.fillStyle = "white";
    ctx.font = "45px Changa one";
    ctx.fillText(score, 2 * box, 1.6 * box);
}

function restartGame() {
    // Reset the snake
    snake = [];
    snake[0] = {
        x: 9 * box,
        y: 10 * box
    };

    // Reset the score
    score = 0;

    // Reset the direction
    d = undefined;

    // Reset the food
    food = {
        x: Math.floor(Math.random() * 17 + 1) * box,
        y: Math.floor(Math.random() * 15 + 3) * box
    };

    // Clear the game over message
    ctx.clearRect(0, 0, cvs.width, cvs.height);

    // Restart the game loop
    game = setInterval(draw, 100);
}

if (snakeX < box || snakeX > 17 * box || snakeY < 3 * box || snakeY > 17 * box || collision(newHead, snake)) {
    clearInterval(game);
    dead.play();
    showGameOverMessage();
    setTimeout(restartGame, 2000); // Restart the game after 2 seconds
}

function showGameOverMessage() {
    ctx.fillStyle = "red";
    ctx.font = "50px Changa one";
    ctx.fillText("Game Over", 5 * box, 10 * box);
}

//call draw function every 100ms
let game = setInterval(draw, 100);