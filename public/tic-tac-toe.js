// Your code here
let currPlayer = 'X';
let forfeit = false;
let grid = new Array(3).fill(null).map( row => new Array(3).fill(null));

function hasWinner(){
    //check row
    for (let row of grid){
        if ((row[0] == row[1] && row[1] == row[2]) && row[0] != null){
            return row[0];
        }
    }

    //check col
    for (let col = 0; col < 3; col++){
        if ((grid[0][col] == grid[1][col] && grid[1][col] == grid[2][col]) && grid[0][col] != null){
            return grid[0][col];
        }
    }

    //check diag
    if ((grid[0][0] == grid[1][1] && grid[1][1] == grid[2][2]) && grid[0][0] != null){
        return grid[0][0];
    }

    if ((grid[0][2] == grid[1][1] && grid[1][1] == grid[2][0]) && grid[0][2] != null){
        return grid[0][2];
    }

    return false;
}

function noEmptySq(){
    for (let row = 0; row < 3; row++){
        for (let col = 0; col < 3; col++){
            if (grid[row][col] == null){
                return false;
            }
        }
    }
    return true;
}

function createBoard(){
    let gamebox = document.createElement('div');
    gamebox.setAttribute('class', 'box');
    for (let row = 0; row < 3; row++){
        let gamerow = document.createElement('div');
        gamerow.setAttribute('class', 'row');
        for (let col = 0; col < 3; col++){
            let gameitem = document.createElement('div');
            gameitem.setAttribute('data-type', `${row}-${col}`);
            gameitem.setAttribute('class', 'square')
            if (row == 0){
                gameitem.classList.add('top');
            }
            if (row == 2){
                gameitem.classList.add('bot');
            }
            if (col == 0){
                gameitem.classList.add('left');
            }
            if (col == 2){
                gameitem.classList.add('right');
            }
            gameitem.addEventListener('click', handlePlay)
            gamebox.addEventListener('click', () => {
                let winner = hasWinner();
                if (winner){
                    gameitem.removeEventListener('click', handlePlay);
                    let heading = document.getElementsByClassName('winner')[0];
                    heading.innerText = `Winner: ${winner}`;
                } else if (noEmptySq()){
                    gameitem.removeEventListener('click', handlePlay);
                    let heading = document.getElementsByClassName('winner')[0];
                    heading.innerText = 'Winner: None'
                }
            })
            gamerow.appendChild(gameitem);
        }
        gamebox.appendChild(gamerow);
    }
    document.body.children[0].after(gamebox);
}

function handlePlay(event){
    if (!event.target.innerHTML){
        if (currPlayer == 'X'){
            event.target.innerHTML = "<img src='https://assets.aaonline.io/Module-DOM-API/formative-project-tic-tac-toe/player-x.svg' alt='X'>";
            let [r, c] = event.target.dataset.type.split('-');
            grid[r][c] = currPlayer;
            currPlayer = 'O';
        } else {
            event.target.innerHTML = "<img src='https://assets.aaonline.io/Module-DOM-API/formative-project-tic-tac-toe/player-o.svg' alt='O'>";
            let [r, c] = event.target.dataset.type.split('-');
            grid[r][c] = currPlayer;
            currPlayer = 'X';
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    //create winner/tie heading
    let heading = document.createElement('h1');
    heading.setAttribute('class', 'winner');
    document.body.appendChild(heading);

    //create tic-tac-toe gamesquare
    createBoard();

    //create bottom buttons box
    let buttonbox = document.createElement('div');
    buttonbox.setAttribute('class', 'button-box');
    let newgame = document.createElement('button');
    newgame.setAttribute('class', 'new-game');
    newgame.innerText = 'New Game';
    newgame.type = 'button';
    newgame.addEventListener('click', () => {
        if (hasWinner() || noEmptySq() || forfeit){
            currPlayer = 'X';
            forfeit = false;
            grid = new Array(3).fill(null).map( row => new Array(3).fill(null));
            let heading = document.getElementsByClassName('winner')[0];
            heading.innerText = '';
            document.body.children[1].remove();
            createBoard();
        }
    })
    let giveup = document.createElement('button');
    giveup.setAttribute('class', 'give-up');
    giveup.innerText = 'Give Up';
    giveup.type = 'button';
    giveup.addEventListener('click', event => {
        if ((!hasWinner() || !noEmptySq) && !forfeit){
            forfeit = true;
            let heading = document.getElementsByClassName('winner')[0];
            let collections = document.getElementsByClassName('square');
            for (let c of collections){
                c.removeEventListener('click', handlePlay);
            }
            if (currPlayer == 'X'){
                console.log(heading);
                heading.innerText = 'Winner: O';
            } else {
                heading.innerText = 'Winner: X';
            }
        }
    })
    buttonbox.appendChild(newgame);
    buttonbox.appendChild(giveup);
    document.body.appendChild(buttonbox);

    //create saveState
    document.body.addEventListener('click', () => {
        let saveState = {
            heading: document.getElementsByClassName('winner')[0].innerText,
            currPlayer: currPlayer,
            forfeit: forfeit,
            grid: grid,
        }
        localStorage.setItem('saveState', JSON.stringify(saveState));
    })

    //load saveState
    if (localStorage.getItem('saveState')){
        let saveState = JSON.parse(localStorage.getItem('saveState'));
        document.getElementsByClassName('winner')[0].innerText = saveState.heading;
        currPlayer = saveState.currPlayer;
        forfeit = saveState.forfeit;
        grid = saveState.grid;
        for (let row = 0; row < 3; row++){
            for (let col = 0; col < 3; col++){
                if (grid[row][col]){
                    let griditem = document.querySelector(`[data-type="${row}-${col}"]`);
                    if (grid[row][col] == 'X'){
                        griditem.innerHTML = "<img src='https://assets.aaonline.io/Module-DOM-API/formative-project-tic-tac-toe/player-x.svg' alt='X'>";
                    } else {
                        griditem.innerHTML = "<img src='https://assets.aaonline.io/Module-DOM-API/formative-project-tic-tac-toe/player-o.svg' alt='O'>";
                    }
                }
            }
        }
    }

})
