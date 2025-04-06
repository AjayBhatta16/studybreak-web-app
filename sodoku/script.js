let startButton = document.querySelector('#solve')
let inputPuzzle = [[],[],[],[],[],[],[],[],[]]

let secretButton = document.querySelector('.load')
let testData = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
]
function loadTestData() {
    for(let i = 0; i < 9; i++) {
        for(let j = 0; j < 9; j++) {
            if(testData[i][j] != 0) setBoardValue(i, j, testData[i][j])
        }
    }
}

function getInputPuzzle() {
    let nextBox
    for(let i = 0; i < 9; i++) {
        inputPuzzle[i] = []
        for(let j = 0; j < 9; j++) {
            nextBox = document.querySelector(`input[name="sq${i+1}${j+1}"]`)
            inputPuzzle[i].push(parseInt(nextBox.value) ? parseInt(nextBox.value) : 0)
        }
    }
    // console.log(inputPuzzle)
}

function sudoku(puzzle) {
    let blankSpaces = getBlankSpaces(puzzle)
    let i = 0, count = 0
    while(i < blankSpaces.length) {
        count++
        console.log(i, count) // DEBUG
        puzzle[blankSpaces[i].x][blankSpaces[i].y]++
        setBoardValue(blankSpaces[i].x, blankSpaces[i].y, puzzle[blankSpaces[i].x][blankSpaces[i].y])
        while(!isValid(puzzle, blankSpaces[i].x, blankSpaces[i].y)
                && puzzle[blankSpaces[i].x][blankSpaces[i].y] < 9) {
            puzzle[blankSpaces[i].x][blankSpaces[i].y]++
            setBoardValue(blankSpaces[i].x, blankSpaces[i].y, puzzle[blankSpaces[i].x][blankSpaces[i].y])
        }
        if(!isValid(puzzle, blankSpaces[i].x, blankSpaces[i].y)) {
            puzzle[blankSpaces[i].x][blankSpaces[i].y] = 0
            setBoardValue(blankSpaces[i].x, blankSpaces[i].y, '')
        }
        i += (puzzle[blankSpaces[i].x][blankSpaces[i].y] > 0) ? 1 : -1
    }
    return puzzle
}
function setBoardValue(x, y, val) {
    document.querySelector(`input[name="sq${x+1}${y+1}"]`).value = val 
}
function getBlankSpaces(puzzle) {
    let output = []
    puzzle.forEach((row, i) => {
        row.forEach((el, j) => {
            if(el == 0) output.push({x: i, y: j})
        })
    })
    return output
}
function getNthBox(puzzle, n) {
    let output = []
    let row = Math.floor(n/3)*3, col = (n%3)*3
    for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 3; j++) {
            output.push(puzzle[row+i][col+j])
        }
    }
    return output
}
function isFullyValid(puzzle) {
    let errorFound = false
    // check for duplicate values
    for(let i = 0; i < 9; i++) {
        for(let j = 1; j <= 9; j++) {
            if(puzzle[i].filter(k => k == j).length > 1
                || puzzle.map(row => row[i]).filter(k => k == j).length > 1
                || getNthBox(puzzle, i).filter(k => k == j).length > 1
            ) {
                errorFound = true
                break 
            }
        }
        if(errorFound) break
    }
    // check for values greater than 9
    for(let i = 0; i < 9; i++) {
        for(let j = 0; j < 9; j++) {
            if(puzzle[i][j] > 9) {
                errorFound = true
                break
            }
        }
        if(errorFound) break
    }
    return !errorFound
}
function isValid(puzzle, x, y) {
    if(puzzle[x][y] == 0 || puzzle[x][y] > 9) return false
    let val = puzzle[x][y]
    let row = puzzle[x]
    if(row.filter(sp => sp == val).length > 1) return false
    let column = puzzle.map(r => r[y])
    if(column.filter(sp => sp == val).length > 1) return false
    let topLeftX = Math.floor(x/3)*3, topLeftY = Math.floor(y/3)*3
    let box = puzzle[topLeftX].slice(topLeftY, topLeftY + 3)
                .concat(puzzle[topLeftX + 1].slice(topLeftY, topLeftY + 3))
                .concat(puzzle[topLeftX + 2].slice(topLeftY, topLeftY + 3))
    return !(box.filter(sp => sp == val).length > 1)
}

startButton.addEventListener('click', () => {
    getInputPuzzle()
    if(!isFullyValid(inputPuzzle)) {
        alert("ERROR: Invalid sudoku")
        return
    }
    // solve sudoku
    console.log(sudoku(inputPuzzle))
})
secretButton.addEventListener('click', loadTestData)