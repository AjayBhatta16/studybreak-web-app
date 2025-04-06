let game = document.querySelector('.game')
game.style.display='none'

let sizeInput = document.querySelector('input[name="size"]')
let bombInput = document.querySelector('input[name="bombs"]')
let go = document.querySelector("#go")
let errMsg = document.querySelector('.error')
let init = document.querySelector('.init')
let sound = document.querySelector('audio.game-over')
let sound2 = document.querySelector('audio.game-won')
let scoreBoard = document.querySelector('h2.score')

let freeSquares = 0

function sizeError() {
    errMsg.textContent = 'ERROR: More bombs than squares on board.'
}

function createTable(size) {
    let code = ['<table>']
    let tr = []
    for (let i = 0; i < size; i++) {
        tr.push('<tr>')
        for (let j = 0; j < size; j++) {
            tr.push(`<td class="unchecked" data-row="${i}" data-column="${j}"></td>`)
        }
        tr.push('</tr>')
        code.push(tr.join(''))
        tr = []
    }
    code.push('</table>')
    game.innerHTML = game.innerHTML + code.join('')
    scoreBoard = document.querySelector('h2.score')
}

function isBomb(pos,bombs) {
    let flag = false
    bombs.forEach(bomb => {
        if (bomb.x == pos.x && bomb.y == pos.y) {
            flag = true
        }
    })
    return flag
}

function generateBombs(gridSize, total) {
    let output = []
    let x = 0, y = 0
    for (let i = 0; i < total; i++) {
        x = Math.floor(Math.random()*gridSize)
        y = Math.floor(Math.random()*gridSize)
        if (!isBomb({x,y},output)) {
            output.push({x,y})
        } else {
            i--
        }
    }
    return output
}

function checkAdjacence(pos1,pos2) {
    return (
        pos1.x == pos2.x && pos1.y == (pos2.y - 1)
        || pos1.x == pos2.x && pos1.y == (pos2.y + 1)
        || pos1.x == (pos2.x - 1) && pos1.y == pos2.y
        || pos1.x == (pos2.x + 1) && pos1.y == pos2.y
        || pos1.x == (pos2.x - 1) && pos1.y == (pos2.y - 1) 
        || pos1.x == (pos2.x - 1) && pos1.y == (pos2.y + 1)
        || pos1.x == (pos2.x + 1) && pos1.y == (pos2.y - 1)
        || pos1.x == (pos2.x + 1) && pos1.y == (pos2.y + 1)
    )
}

function countAdjacentBombs(pos,bombs) {
    let output = 0
    bombs.forEach(bomb => {
        if (checkAdjacence(pos,bomb)) {
            output += 1
        }
    })
    return output
}

function autodig(pos,size,bombs) {
    let adjacents = [
        {x:pos.x,y:pos.y-1},
        {x:pos.x,y:pos.y+1},
        {x:pos.x-1,y:pos.y},
        {x:pos.x+1,y:pos.y},
        {x:pos.x-1,y:pos.y-1},
        {x:pos.x-1,y:pos.y+1},
        {x:pos.x+1,y:pos.y-1},
        {x:pos.x+1,y:pos.y+1}
    ]
    adjacents.forEach(adj => {
        if (adj.x >= 0 && adj.x < size && adj.y >= 0 && adj.y < size) {
            console.log(adj.x,adj.y)
            let cell = document.querySelector(`td[data-row="${adj.x}"][data-column="${adj.y}"]`)
            if (cell.classList.contains('unchecked')) {
                freeSquares -= 1
                scoreBoard.textContent = `Free Cells Remaining: ${freeSquares}`
                cell.classList.remove('unchecked')
                let risk = countAdjacentBombs(adj,bombs) 
                if (risk == 0) {
                    autodig(adj,size,bombs)
                } else {
                    cell.classList.add(`risk${risk}`)
                    cell.textContent = `${risk}`
                } 
            }
        }
    })
}

function reveal(cell,bombs) {
    if (cell.classList.contains('unchecked')) {
        cell.classList.remove('unchecked')
        if (isBomb({x:parseInt(cell.dataset.row),y:parseInt(cell.dataset.column)},bombs)) {
            cell.classList.add('bomb')
            cell.textContent = '*'
        } else {
            let risk = countAdjacentBombs({x:parseInt(cell.dataset.row),y:parseInt(cell.dataset.column)},bombs)
            if (risk != 0) {
                cell.classList.add(`risk${risk}`)
                cell.textContent = `${risk}`
            }
        }
    }
}

function startGame(size,total) {
    init.style.display = 'none'
    game.style.display = 'block'
    createTable(size)
    freeSquares = (size**2) - total
    scoreBoard.textContent = `Free Cells Remaining: ${freeSquares}`
    let bombs = generateBombs(size,total)
    let cells = document.querySelectorAll('td')
    cells.forEach(cell => {
        cell.style.width = `${275/size}px`
        cell.style.height = `${275/size}px`
        cell.style.fontSize = `${0.6*275/size}px`
        cell.addEventListener('click', () => {
            cell.classList.remove('unchecked')
            if(isBomb({x:parseInt(cell.dataset.row),y:parseInt(cell.dataset.column)}, bombs)) {
                cell.classList.add('bomb')
                cell.textContent = '*'
                sound.play()
                cells.forEach(c => {
                    reveal(c,bombs)
                })
                setTimeout(() => {
                    alert("Game over!")
                    window.location = '/minesweeper'
                }, 1000)
            } else {
                let risk = countAdjacentBombs({x:parseInt(cell.dataset.row),y:parseInt(cell.dataset.column)},bombs) 
                if (risk == 0) {
                    freeSquares -= 1
                    scoreBoard.textContent = `Free Cells Remaining: ${freeSquares}`
                    autodig({x:parseInt(cell.dataset.row),y:parseInt(cell.dataset.column)},size,bombs)
                } else {
                    cell.classList.add(`risk${risk}`)
                    cell.textContent = `${risk}`
                    freeSquares -= 1
                    scoreBoard.textContent = `Free Cells Remaining: ${freeSquares}`
                }
                if (freeSquares == 0) {
                    sound2.play()
                    cells.forEach(c => {
                        reveal(c,bombs)
                    })
                    setTimeout(() => {
                        alert("You won!")
                        window.location = '/minesweeper'
                    }, 1000)
                }
            }
        })
    })
}

go.addEventListener("click", () => {
    let size = parseInt(sizeInput.value)
    let bombs = parseInt(bombInput.value)
    if (bombs >= (size**2)) {
        sizeError()
        return
    }
    startGame(size,bombs)
})
