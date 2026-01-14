
let board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
];

let playerTurn = true;
let gameActive = true;
let difficulty = 'easy';
let pScore= 0
let aScore= 0
let playerStartsNext = false; // Track who starts next game (alternates)


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
        createConfetti();
        highlightWin();
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
        updateTurnIndicator();

        if (!playerTurn) {
            setTimeout (() => {
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

    // Alternate who starts
    playerStartsNext = !playerStartsNext;
    playerTurn = playerStartsNext;
    gameActive = true;

    const cells= document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.innerHTML= '';
        cell.classList.remove('move','winning-cell');
    });

    document.getElementById('result').innerHTML = '';
    document.getElementById('result').classList.remove('show');

    updateTurnIndicator();

    // If AI starts, make a move
    if (!playerTurn) {
        const rR = Math.floor(Math.random() * 3);
        const rC = Math.floor(Math.random() * 3);
        makeMove(rR, rC, 'O');
    }
}


function playbgmusic() {
    const y = document.getElementById('bg-music');
    if (y.paused || y.ended) {
        y.loop = true;
        y.play();
    }
}

document.addEventListener('click', playbgmusic);


function createConfetti() {
    const confettiColors = ['#667eea', '#764ba2', '#11998e', '#38ef7d', '#ffeaa7', '#fdcb6e', '#ffffff', '#2d2d2d'];
    const confettiCount = 150;
    const container = document.getElementById('confetti-container');
    
    if (!container) return; // Safety check
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        
        // Random properties
        const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
        const size = Math.random() * 6 + 6; // 6-12px
        const xPosition = Math.random() * window.innerWidth;
        const delay = Math.random() * 0.5;
        const duration = Math.random() * 2 + 3; // 3-5 seconds
        
        // Set styles
        confetti.style.backgroundColor = color;
        confetti.style.left = `${xPosition}px`;
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        confetti.style.animationDelay = `${delay}s`;
        confetti.style.animationDuration = `${duration}s`;
        
        container.appendChild(confetti);
        
        // Remove after animation
        setTimeout(() => {
            if (confetti.parentNode) {
                confetti.remove();
            }
        }, (duration + delay) * 1000);
    }
}

function makeAIMove() {
    if (!gameActive) {
      return;
    }

    const difficulty = document.querySelector('input[name="difficulty"]:checked').value;
  
    if (difficulty === 'easy') { 
      const emptyCells = [];
      for (let i=0;i<3;i++) {
          for (j=0;j<3;j++) {
              if (board[i][j]==='') {
                  emptyCells.push({row:i,col:j});
              }
          }
      }
  
      if (emptyCells.length > 0) {
          const randomPos = Math.floor(Math.random() * emptyCells.length);
          const { row, col } = emptyCells[randomPos];
          makeMove(row, col,'O');
      }
    } else {
      const bestMove = findBestMove();
      const { row, col } = bestMove;
      makeMove(row, col, 'O');
    }
  }

  function findBestMove() {
    let bestMove = { score: -Infinity };
    if (difficulty === 'difficult') {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === '') {
                    board[i][j] = 'X';
                    const score = minimax(board, 0, true);
                    board[i][j] = '';
  
                    if (score === 1) {
                        bestMove = { score: -1, row: i, col: j };
                        break;
                    }
                }
            }
        }
    }
  
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
        document.getElementById('pscore').querySelector('.score-value').innerHTML = pScore;
        document.getElementById('ascore').querySelector('.score-value').innerHTML = aScore;
    });
    
}


document.getElementById('currentYear').innerHTML = new Date().getFullYear()


function startGame() {
    // First game: AI starts (playerStartsNext starts as false)
    playerTurn = playerStartsNext;
    gameActive = true;

    updateTurnIndicator();

    // If AI starts, make a move
    if (!playerTurn) {
        const rR = Math.floor(Math.random() * 3);
        const rC = Math.floor(Math.random() * 3);
        makeMove(rR, rC, 'O');
    }
}

function updateTurnIndicator() {
    const indicator = document.getElementById('turn-indicator');
    if (indicator) {
        if (playerTurn) {
            indicator.innerHTML = 'Your Turn';
            indicator.className = 'turn-indicator player-turn';
        } else {
            indicator.innerHTML = "AI's Turn";
            indicator.className = 'turn-indicator ai-turn';
        }
    }
}

startGame();

function highlightCell(row,col) {
    const cellInd = row * 3 + col;
    document.getElementById('board').children[cellInd].classList.add('winning-cell', 'disable-hover');
}
function highlightWin() {
    for (let i=0;i<3;i++) {
        if (board[i][0] != '' && board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
            highlightCell(i,0);
            highlightCell(i,1);
            highlightCell(i,2);
            return;
        }
        if (board[0][i] != '' && board[0][i] === board[1][i] && board[1][i] === board [2][i]) {
            highlightCell(0,i);
            highlightCell(1,i);
            highlightCell(2,i);
            return;
        }
    }

    if (board[0][0] != '' && board[0][0] === board[1][1] && board [1][1] === board[2][2] ){
        highlightCell(0,0);
        highlightCell(1,1);
        highlightCell(2,2);
        return;
    }

    if (board[0][2] != '' && board[0][2] === board[1][1] && board [1][1] === board[2][0] ){
        highlightCell(0,2);
        highlightCell(1,1);
        highlightCell(2,0);
        return;
    }
    handDiff()
}

const diffRadio = document.querySelector('input[name="difficulty"]');
diffRadio.addEventListener('change' , handDiff);

function handDiff() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell)=> {
        cell.classList.remove('winning-cell');
    });
}


