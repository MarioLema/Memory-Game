//===========================================DATA OBJECT========================================================
const DATA = {
    boardArr: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    matchTable: [],
    currPair: [],
    moves: 0,
    pairsSolved: 0,
    timeLeft: 100,
    gameOngoing: false,
    busy: false,
    interval: setInterval(() => MODIFIER.countdown(), 1000)
};

//===========================================VIEW METHODS========================================================
const VIEW = {


    alertStart() {
        document.getElementById(`reminder`).setAttribute("style", "color:red; font-size: 1.5rem;");
    },

    //ADDS THE IMAGE OF A FACE TO TWO DIFFERENT CARDS
    addFace(arrId, faceId) {
        document.getElementById(`avatar-${arrId[0]}`).innerHTML = `<img class="face-image" src="images/face-${faceId}.png" alt=""></img>`;
        document.getElementById(`avatar-${arrId[1]}`).innerHTML = `<img class="face-image" src="images/face-${faceId}.png" alt=""></img>`;
    },

    revealCard(id) {
        document.getElementById(id).classList.add(`reveal`);
    },

    hideCard(id) {
        document.getElementById(id).classList.remove(`reveal`);
    },

    displayTimeLeft() {
        document.getElementById(`time-left`).innerHTML = `TIME LEFT: ${DATA.timeLeft}s`;
    },

    displayTurns() {
        document.getElementById(`turns`).innerHTML = `TRIES: ${DATA.moves}`;
    },

    displayEnd(winLose) {
        setTimeout(() => {
            let endMessage = document.getElementById(`end-message`);
            endMessage.style.display = `flex`;
            if (winLose === `win`) {
                endMessage.firstElementChild.innerHTML = `YOU WIN!`;
            } else {
                endMessage.firstElementChild.innerHTML = `OUT OF TIME`;
            }
        }, 1000)

    },

    hideEnd() {
        let endMessage = document.getElementById(`end-message`);
        endMessage.style.display = `none`;
    },

    winkUp() {
        event.target.firstElementChild.src = `images/open-eye.png`;
    },
    winkDown() {
        event.target.firstElementChild.src = `images/closed-eye.png`;
    },


};

//===========================================MODIFIER METHODS========================================================
const MODIFIER = {

    //================PLAY GAME METHODS==================
    //===================================================

    //HANDLES A CLICK ON A CARD
    turn() {

        if (!DATA.gameOngoing) VIEW.alertStart(); //if game has not started when clicking on cards prompt alert
        let id = this.correctTarget(event);
        if (id && DATA.gameOngoing && !DATA.busy) { //accepts the click if the target id is correct, the game has started and there is no animation running
            DATA.currPair.push(Number(id));
            VIEW.revealCard(id);
            DATA.busy = true;
            setTimeout(() => DATA.busy = false, 500);

            if (DATA.currPair.length > 1) { //if this is the second card turned
                DATA.moves++;
                VIEW.displayTurns();
                if (this.checkMatch()) { //if there is a match check if it is enough to win or just add to the pairs solved
                    DATA.pairsSolved++;
                    if (this.checkWin()) {
                        VIEW.displayEnd(`win`);
                        clearInterval(DATA.interval);
                    };
                    DATA.currPair = [];
                } else { //if there is no match hide cards and reset currPair array
                    setTimeout(() => {
                        VIEW.hideCard([DATA.currPair[0]]);
                        VIEW.hideCard([DATA.currPair[1]]);
                        DATA.currPair = [];
                    }, 500)

                }
            }
        }
    },

    //STARTS THE GAME 
    startGame() {
        if (!DATA.gameOngoing) {
            this.generateMatches();

            for (let i = 0; i < DATA.matchTable.length; i++) {
                VIEW.addFace(DATA.matchTable[i].positions, DATA.matchTable[i].faceId);
            }

            this.revealAll();
        }
    },

    //RESETS THE GAME
    resetGame() {
        DATA.boardArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
        DATA.matchTable = [];
        DATA.currPair = [];
        DATA.moves = 0;
        DATA.pairsSolved = 0;
        DATA.gameOngoing = false;
        DATA.busy = false;
        DATA.timeLeft = 100;
        DATA.interval = setInterval(() => MODIFIER.countdown(), 1000);

        VIEW.displayTimeLeft();
        VIEW.displayTurns();
        VIEW.hideEnd();

        for (let i = 0; i < DATA.boardArr.length; i++) {
            VIEW.hideCard(i);
        }

    },

    //FUNCTION CALLED BY SETINTERVAL TO RUN EVERY SECOND AND COUNTDOWN THE TIME
    countdown() {
        if (DATA.gameOngoing) {
            VIEW.displayTimeLeft();
            DATA.timeLeft--;
            if (DATA.timeLeft === 0) {
                VIEW.displayTimeLeft();
                clearInterval(DATA.interval);
                if (this.checkWin()) {
                    VIEW.displayEnd(`win`);
                } else {
                    VIEW.displayEnd(`lose`);
                }
            }
        }
    },

    //================VALIDATION METHODS==================
    //===================================================

    //CHECKS THE EVENT TARGET IS EITHER THE CARD OR THE CARD EYE-LOGO
    correctTarget(event) {
        if (event.target.classList.contains(`card-front`) || event.target.classList.contains(`back-image`)) {
            let targetId =
                event.target.parentElement.classList[0] === `card` ?
                event.target.parentElement.id :
                event.target.parentElement.parentElement.id;
            return targetId;
        }
        return false;
    },

    //CHECKS IF THERE IS ENOUGH PAIRS SOLVED
    checkWin() {
        return DATA.pairsSolved === 8 ? true : false;
    },

    //CHECKS IF TWO PAIRS OF CARDS ARE THE SAME
    checkMatch() {
        for (let i = 0; i < DATA.matchTable.length; i++) {
            let firstMatch = DATA.matchTable[i].positions.indexOf(DATA.currPair[0]) !== -1 ? true : false;
            let secondMatch = DATA.matchTable[i].positions.indexOf(DATA.currPair[1]) !== -1 ? true : false;
            if (firstMatch && secondMatch) {
                DATA.matchTable.splice(i, 1);
                return true;
            }
        }
        return false;
    },

    //================UTILITY METHODS==================
    //===================================================

    //REVEALS ALL THE CARDS FOR A PERIOD OF TIME
    revealAll() {
        for (let i = 0; i < DATA.boardArr.length; i++) {
            VIEW.revealCard(i);
        }
        setTimeout(() => {
            for (let i = 0; i < DATA.boardArr.length; i++) {
                VIEW.hideCard(i);
            }
            DATA.gameOngoing = true;
        }, 2500)
    },

    //GENERATES AN OBJECT WITH THE FACES IDS AND THE CORRESPONDENT INDEXES IN THE BOARD
    generateMatches() {
        let board = [...DATA.boardArr];
        //Array.from(Array(10).keys())
        let faceBoard = [...Array(66).keys()]
        while (board.length !== 0) {
            let face = faceBoard.splice(Math.floor(Math.random() * (faceBoard.length - 1)) + 1, 1)[0];
            let first = board.splice(Math.floor(Math.random() * board.length), 1)[0];
            let second = board.splice(Math.floor(Math.random() * board.length), 1)[0];
            DATA.matchTable.push({
                faceId: face,
                positions: [first, second]
            });
        }
    },


    //================LISTENER METHODS==================
    //===================================================

    //ADDS LISTENERS TO THE CARD FRONTS TO CHANGE THE SRC OF THE LOGO
    winkUpListener(nodesArr) {
        for (let i = 0; i < nodesArr.length; i++) {
            nodesArr[i].addEventListener(`mouseenter`, VIEW.winkUp, false);
            nodesArr[i].addEventListener(`mouseleave`, VIEW.winkDown, false);
        }
    }
}
MODIFIER.turn = MODIFIER.turn.bind(MODIFIER);
MODIFIER.startGame = MODIFIER.startGame.bind(MODIFIER);



//========================CLICK EVENTS============================================
document.getElementById(`memory-game`).addEventListener(`click`, MODIFIER.turn, false);
document.getElementById(`start-game`).addEventListener(`click`, MODIFIER.startGame, false);
document.getElementById(`reset-game`).addEventListener(`click`, MODIFIER.resetGame, false);
MODIFIER.winkUpListener(document.querySelectorAll(`.card-front`));