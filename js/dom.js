const paddle = document.querySelector('#paddle_ball');
const container = document.querySelector('#container');
const ball = document.querySelector('#ball');
// מהירות התנועה של הכדור בכיוונים X ו-Y.
let ballX = 1;
let ballY = 1;

let point = 0;
// מהירות התנועה של המקלדת.
let paddleSpeed = 20;
// מהירות התנועה של הכדור.
let ballSpeed = 6;
let blocksArray = [];
// let color = [
//     "rgb(196,185,215)",
//     "rgb(158,192,217)",
//     "rgb(210,234,221)",
//     "rgb(237,161,174)",
//     "rgb(247,202,143)",
//     "rgb(246,243,164)",
// ];

let color = [
    "rgb(196,185,215)", //סגול
    "rgb(158,192,217)",//כחול
    "rgb(210,234,221)",//ירוק
    "rgb(212,255,210)",  // צבע ירוק בהיר
    "rgb(237,161,174)",//ורוד
    "rgb(253,185,199)",  // צבע ורוד בהיר
    "rgb(247,202,143)",//כתום
    "rgb(246,243,164)",//צהוב
];

let num = [3, 1, 2, 0, 4, 6, 5, 7, 8, 9];
//צריך שימוש בפונ 🤦
num.sort();
console.log(num);


let gameInterval;
//משתנה לבדיקה אם נגמר המשחק
let isGameOver = false;
let level = 1;
let lives = 2;

// משתנים כדי לאחסן את הציון המקסימלי
let maxScore = 0;
let loggedInUser = null;
let ploggedInUser = null;


// פונקציה שמתבצעת מיד עם ריענון העמוד
window.onload = function createbigboard() {
    //מקבלת את המשתמש המחובר
    loggedInUser = localStorage.getItem('loggedInUser');
    ploggedInUser = localStorage.getItem('ploggedInUser');

    console.log(ploggedInUser);
    console.log(loggedInUser);


    //טוענת את רשימת המשתמשים
    let users = JSON.parse(localStorage.getItem('users')) || [];
    //מחפשת את המשתמש המחובר ברשימת המשתמשים
    let user = users.find(user => user.username === loggedInUser && user.password === ploggedInUser);
    //מאחסנת את הציון המקסימלי של המשתמש המחובר:
    maxScore = user ? user.maxScore : 0;
    createBoard();
    document.querySelector("#level").innerText = `Level: ${level}`;
    document.querySelector("#lives").innerText = `Lives: ${lives}`;
    document.querySelector("#points").innerText = `Points: ${point} `;
}

function createBoard() {
    document.querySelector("#board").innerHTML = ''; // איפוס הלוח
    for (let i = 0; i < color.length; i++) {
        let line_div = document.createElement('div');
        line_div.classList.add("line_div");
        createBlocks(line_div, i);
        document.querySelector("#board").append(line_div);
    }
}

function createBlocks(parentDiv, colorIndex) {
    num.map(() => {
        let myblock = document.createElement("div");
        myblock.classList.add("myblock");
        myblock.style.backgroundColor = color[colorIndex];
        parentDiv.appendChild(myblock);
        blocksArray.push(myblock);
    });
}

//פונק למהירות הכדור
function move_ball() {
    let ball_left = ball.offsetLeft;
    let ball_top = ball.offsetTop;
    ball.style.top = ball_top + (ballSpeed * ballY) + 'px';
    ball.style.left = ball_left + (ballSpeed * ballX) + 'px';
}

//פונק להוזזת הכדור במקרה של גבולות, וכן העלמת בלוקים
function change_ball() {
    let ball_left = ball.offsetLeft;
    let ball_top = ball.offsetTop;

    if (ball_left < 0 || ball_left > container.offsetWidth - ball.offsetWidth)
        ballX = -ballX;

    if (ball_top < 0 || ball_top > container.offsetHeight - ball.offsetHeight)
        ballY = -ballY;

    blocksArray.forEach(block => {
        let ballRect = ball.getBoundingClientRect();
        let blockRect = block.getBoundingClientRect();

        if (blockRect.left < ballRect.right && blockRect.top < ballRect.bottom && blockRect.right > ballRect.left && blockRect.bottom > ballRect.top) {
            console.log("catch");
            block.style.display = 'none';
            blocksArray = blocksArray.filter(block => block.style.display !== "none");
            console.log(point);
            point += 5;
            document.querySelector("#points").innerText = `Points: ${point} `;
            ballY = -ballY;
        }
    });

    if (blocksArray.length === 0)
        nextLevel();

    document.querySelector("#container").addEventListener("mousemove", (event) => {
        let containerm = container.getBoundingClientRect();
        let paddleX = event.clientX - containerm.left - paddle.offsetWidth / 2;
        if (paddleX >= 0 && paddleX <= container.offsetWidth - paddle.offsetWidth)
            paddle.style.left = paddleX + "px";
    });

    document.addEventListener("keydown", control);
}

//שליטה על המקלדת, בדיקה האופציות
function control(event) {
    switch (event.keyCode) {
        case 37:
            movePaddle('left')
            break;
        case 39:
            movePaddle('right')
            break;
    }
}

//הזזת המשוט בהתאם למקלדת
function movePaddle(direction) {
    let paddleX = paddle.offsetLeft;
    if (direction === 'right' && paddleX < container.offsetWidth - paddle.clientWidth)
        paddle.style.left = paddleX + paddleSpeed + 'px'
    else if (direction === 'left' && paddleX > 0)
        paddle.style.left = paddleX - paddleSpeed + 'px'

}

//הזזת הכדור בהתאם למשוט
function change_paddle() {
    let p = paddle.getBoundingClientRect()
    let ballRect = ball.getBoundingClientRect()
    if (p.left < ballRect.right && p.top < ballRect.bottom && p.right > ballRect.left && p.bottom > ballRect.top)
        ballY = -ballY
}

//פונקציית סיום המשחק
function end_game() {
    let ballRect = ball.getBoundingClientRect();
    let containerRect = container.getBoundingClientRect();

    if (ballRect.bottom >= containerRect.bottom) {
        if (!isGameOver) {
            lives--;
            if (lives >= 0) {
                document.querySelector("#lives").innerText = `Lives: ${lives}`;
                ball.style.top = '70%';
                ball.style.left = '50%';
            }
            else {
                isGameOver = true;
                let users = JSON.parse(localStorage.getItem('users')) || [];
                let userIndex = users.findIndex(user => user.username === loggedInUser && user.password === ploggedInUser);
                if (userIndex !== -1 && point > users[userIndex].maxScore) {
                    users[userIndex].maxScore = point;
                    localStorage.setItem('users', JSON.stringify(users));
                }
                alert(`Game Over!      Your point: ${point}.    Your Max point: ${Math.max(maxScore, point)}`);
                clearInterval(gameInterval);
                location.reload();
            }
        }
    }
}

//פונק שטוענת את השלב הבא במקרה של ניצחון
function nextLevel() {
    level++;
    if (level > 10) {
        alert("You are a champion! and really fast");
        clearInterval(gameInterval);
        location.reload();
    } else {
        alert(`Level ${level}`);
        paddleSpeed += 1.5;
        ballSpeed += 2;
        document.querySelector("#level").innerText = `Level: ${level}`;
        createBoard();
    }
}

const start_game = () => {
    if (!isGameOver) {
        move_ball();
        change_ball();
        change_paddle();
        end_game();
    }
}

gameInterval = setInterval(start_game, 20);


