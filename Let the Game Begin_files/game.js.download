
let board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
];

let playerTurn = true;
let gameActive = true;
let pScore= 0
let aScore= 0


function popo() {
    document.getElementById('popsound').play()
}

function clap() {
    document.getElementById('clap').play()
}
function makeMove(row, col, symbol) {
    if (!gameActive || board[row][col] !== '' || (symbol === 'X' && !playerTurn) || (symbol === 'O' && playerTurn)) {
        return;
    }

    board[row][col] = symbol;
    document.getElementById('board').children[row * 3 + col].innerHTML = symbol;

    if (checkWin()) {
        clap();
        popBalloon(10);
        document.getElementById('result').innerHTML = `Player ${symbol} wins!`;
        gameActive = false;

        if (symbol === 'X') {
            pScore+=2;
        } else {
            aScore+=2;
        }

        updateScores();

    } else if (checkTie()) {
        document.getElementById('result').innerHTML = "It's a tie!";
        gameActive = false;
        pScore+=1;
        aScore+=1;

        updateScores();
    } else {
        popo();
        playerTurn = !playerTurn;

        if (!playerTurn) {
            setTimeout(() => {
                makeAIMove();
            }, 500);
        }
    }
}


function checkWin() {
    for (let i = 0; i < 3; ++i) {
        if (board[i][0] != '' && board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
            return true;   
        }
        if (board[0][i] != '' && board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
            return true;
        }
    }

    if (board[0][0] != '' && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
        return true;
    }
    if (board[0][2] != '' && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
        return true;
    }

    return false;
}

function checkTie() {
    for (let i=0; i < 3; i++) {
        for (let j=0;j < 3; j++) {
            if(board[i][j] === '') {
                return false;
            }
        }
    }
    return true;
}

function resetGame() {
    board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
    ];
    playerTurn = true;
    gameActive = true;

    const cells= document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.innerHTML= '';
        cell.classList.remove('move');
    });

    document.getElementById('result').innerHTML = '';
    document.getElementById('result').classList.remove('show');
}


function playbgmusic() {
    const y = document.getElementById('bg-music');
    if (y.paused || y.ended) {
        y.loop = true;
        y.play();
    }
}

document.addEventListener('click', playbgmusic);


function popBalloon(numBalloons) {
    for (i = 0;i < numBalloons; i++) {
        
        const balloon = document.createElement('div');
        balloon.classList.add('balloon');

        const balloonColor = getRandomColor();
        balloon.style.backgroundColor = balloonColor;

  
        const xPosition = Math.floor(Math.random() * window.innerWidth);
        const yPosition = window.innerHeight;

        balloon.style.left = `${xPosition}px`;
        balloon.style.top = `${yPosition}px`;

        
        document.getElementById('balloon-container').appendChild(balloon);

        setTimeout(() => {
            balloon.remove();
        }, 6000);
    }
}


function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


function makeAIMove() {
    if (!gameActive) {
        return;
    }
    
    const bestMove = findBestMove();
    const { row, col } = bestMove;
    makeMove(row, col, 'O');
}

function findBestMove() {
    let bestMove = { score: -Infinity };
    
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === '') {
                board[i][j] = 'O';
                const score = minimax(board, 0, false);
                board[i][j] = ''; 

                if (score > bestMove.score) {
                    bestMove = { score, row: i, col: j };
                }
            }
        }
    }

    return bestMove;
}

function minimax(board, depth, isMaximizing) {
    if (checkWin()) {
        return isMaximizing ? -1 : 1;
    }

    if (checkTie()) {
        return 0;
    }

    const player = isMaximizing ? 'O' : 'X';
    let bestScore = isMaximizing ? -Infinity : Infinity;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === '') {
                board[i][j] = player;
                const score = minimax(board, depth + 1, !isMaximizing);
                board[i][j] = ''; 

                bestScore = isMaximizing
                    ? Math.max(bestScore, score)
                    : Math.min(bestScore, score);
            }
        }
    }

    return bestScore;
}

function updateScores() {
    requestAnimationFrame (() => {
        document.getElementById('pscore').innerHTML = `Player: ${pScore}`;
        document.getElementById('ascore').innerHTML = `AI: ${aScore}`;
    });
    
}


document.getElementById('currentYear').innerHTML = new Date().getFullYear()