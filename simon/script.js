let sequence = [];
let progressIndex = 0;

let red = document.querySelector('#red');
let yellow = document.querySelector('#yellow');
let green = document.querySelector('#green');
let blue = document.querySelector('#blue');
let squares = document.querySelectorAll('.key');
let scoreBoard = document.querySelector('h3');

function getRandomSquare() {
    let index = Math.floor(Math.random()*4);
    sequence.push(index);
}

function getSquareByIndex(index) {
    squares.forEach(sq => {
        if(sq.dataset.color == index) play(sq);
    });
}

function play(el) {
    el.classList.add('active');
    setTimeout(() => {
        el.classList.remove('active');
    }, 250);
}

function computerTurn() {
    getRandomSquare();
    let i = 0;
    setInterval(()=>{
        getSquareByIndex(sequence[i]);
        i++;
        if (i == sequence.length) {
            clearInterval();
        }
    },400);
    humanTurn(0);
}

function gameOver() {
    if(confirm('You lost. Press ok to restart.')) {
        window.location = '/simon';
    }
    return;
}

function handleCorrectClick() {
    progressIndex++;
    if (progressIndex == sequence.length) {
        progressIndex = 0;
        scoreBoard.textContent = `Score: ${sequence.length}`;
        computerTurn();
    } else {
        humanTurn(progressIndex);
    }
}
 
function humanTurn(index) {
    squares.forEach(sq => {
        if (sq.dataset.color == sequence[index]) {
            console.log('Next color: ',sq.dataset.color);
            if (sq.dataset.color != sequence[index-1]) {
                sq.removeEventListener('click',gameOver);
            }
            sq.addEventListener('click',handleCorrectClick);
        } else {
            if (sq.dataset.color == sequence[index-1]) {
                sq.removeEventListener('click',handleCorrectClick);
            }
            sq.addEventListener('click',gameOver);
        }
    });
}

alert('Press ok to start');
computerTurn();