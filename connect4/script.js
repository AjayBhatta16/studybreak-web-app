let startSection = document.querySelector('.start')
let gameSection = document.querySelector('.game')
let endSection = document.querySelector('.end')

let gameHeader = document.querySelector('.game > h1')
let gameButtons = document.querySelectorAll('#controls > button')

gameSection.style.display = 'none'
endSection.style.display = 'none'

let goButton = document.querySelector('#start-button')
let p1Color = document.querySelector('#p1')
let p2Color = document.querySelector('#p2')
p1Color.value = JSON.parse(localStorage.getItem('player1Color')) || "#ff0000"
p2Color.value = JSON.parse(localStorage.getItem('player2Color')) || "#ffaa00"
let colors = [p1Color.value, p2Color.value]

let p1turn = true
let p1checkers = [], p2checkers = []
let stackHeights = [0, 0, 0, 0, 0, 0, 0]

function hasChecker(checkerList, col, row) {
    return checkerList.some(checker => (checker.col == col && checker.row == row))
}

// initial for-loop value when searching for wins diagonally
function dSearchMin(checker) {
    if(checker.col >= 4) return -3
    if(checker.col == 1 || checker.row == 1 || checker.row == 6) return 0
    return 1 - checker.col
} 

// terminal for-loop value when searching for wins diagonally
function dSearchMax(checker) {
    return -dSearchMin({row: checker.row, col: 8 - checker.col})
}

function hasWin(checkerList) {
    console.log("here", checkerList[0])
    if(checkerList.length < 4) return false
    let found = false
    let counter = 0
    let last = checkerList[checkerList.length - 1]
    for(let i = Math.max(last.col - 3, 1); i <= Math.min(last.col + 3, 7); i++) {
        if(counter >= 4) {
            found = true
            break
        }
        if(i == last.col) {
            counter++
            continue
        }
        if(hasChecker(checkerList, i, last.row)) {
            counter++
        } else {
            if(counter >= 4) continue
            counter = 0
            if(i >= Math.min(last.col, 4)) break
        }
    }
    if(found || counter >= 4) return true 
    counter = 0
    for(let i = Math.max(last.row - 3, 1); i <= Math.min(last.row + 3, 6); i++) {
        if(counter >= 4) {
            found = true
            break
        }
        if(i == last.row) {
            counter++
            continue
        }
        if(hasChecker(checkerList, last.col, i)) {
            counter++
        } else {
            if(counter >= 4) continue
            counter = 0
            if(i >= Math.min(last.row, 3)) break
        }
    }
    if(found || counter >= 4) return true 
    counter = 0
    let mirrorCounter = 0
    for(let i = dSearchMin(last); i <= dSearchMax(last); i++) {
        if(counter >= 4 || mirrorCounter >= 4) {
            found = true
            break
        }
        if(i == 0) {
            counter++
            mirrorCounter++
            continue
        }
        if(last.col + i >= 1 && last.col + i <= 7) {
            if(last.row + i >= 1 && last.row + i <= 6 && !(i > 0 && counter == 0)) {
                if(hasChecker(checkerList, last.col + i, last.row + i)) {
                    counter++
                } else {
                    counter = 0
                }
            }
            if(last.row - i >= 1 && last.row - i <= 6 && !(i > 0 && mirrorCounter == 0)) {
                if(hasChecker(checkerList, last.col + i, last.row - i)) {
                    mirrorCounter++
                } else {
                    mirrorCounter = 0
                }
            }
        }
        if(i > 0 && counter == 0 && mirrorCounter == 0) break 
    }
    return found || counter >= 4 || mirrorCounter >= 4
}

function handleDrop() {
    let col = parseInt(this.id.substring(4))
    if(stackHeights[col - 1] >= 6) {
        return
    }
    stackHeights[col - 1]++
    (p1turn ? p1checkers : p2checkers).push({col: col, row: stackHeights[col - 1]})
    document.querySelector(`#col${col} > .row${7-stackHeights[col-1]}`).style.backgroundColor = colors[p1turn ? 0 : 1]
    if(hasWin(p1turn ? p1checkers : p2checkers)) {
        endGame(p1turn ? 'Player 1' : 'Player 2')
        return
    }
    if(p1checkers.length + p2checkers.length >= 42) {
        endGame(null)
        return 
    }
    p1turn = !p1turn
    gameButtons.forEach(button => {
        button = button.removeEventListener('click', handleDrop)
    })
    gameLoop()
}

function gameLoop() {
    gameHeader.textContent = `Player ${p1turn ? 1 : 2}'s Turn`
    gameButtons.forEach(button => {
        button.addEventListener('click', handleDrop)
    })
}

function startGame(color1, color2) {
    startSection.style.display = 'none'
    gameSection.style.display = 'inline-block'
    colors = [color1, color2]
    gameLoop()
}

function endGame(winner) {
    setTimeout(() => {
        gameSection.style.display = 'none'
        let resultText = document.querySelector('#result')
        resultText.textContent = winner ? `${winner} wins` : 'Tie'
        resultText.style.color = winner ? colors[parseInt(winner.substring(7)) - 1] : '#ffffff'
        endSection.style.display = 'block' 
    }, 1500)
}

goButton.addEventListener('click', () => {
    localStorage.setItem('player1Color', JSON.stringify(p1Color.value))
    localStorage.setItem('player2Color', JSON.stringify(p2Color.value))
    startGame(p1Color.value, p2Color.value)
})