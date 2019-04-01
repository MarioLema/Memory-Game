const DATA = {
    boardArr: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    matchTable: [],
    currPair: [],
    moves: 0,
    pairsSolved: 0,
    gameOngoing: false,
    busy: false,
    timeLeft: 100,
    interval: setInterval( () =>  MODIFIER.countdown() , 1000)
};
const VIEW = {

    displayTurns() {
        document.getElementById(`turns`).innerHTML = `TRIES: ${DATA.moves}`;
    },

    hideEnd(){
        let endMessage = document.getElementById(`end-message`);
        endMessage.style.display = `none`;
    },

    displayEnd(winLose){
        setTimeout( () => {
            let endMessage = document.getElementById(`end-message`);
            endMessage.style.display = `flex`;
            if(winLose === `win`){
            endMessage.firstElementChild.innerHTML = `YOU WIN!`;
            }else{
            endMessage.firstElementChild.innerHTML = `OUT OF TIME`;
            }
        }, 1000)

    },
    displayTimeLeft() {
        document.getElementById(`time-left`).innerHTML = `TIME LEFT: ${DATA.timeLeft}s`;
    },

    revealCard(id) {
        document.getElementById(id).classList.add(`reveal`);
    },

    hideCard(id) {
         document.getElementById(id).classList.remove(`reveal`);
    },

    addFace(arrId, faceId) {
        document.getElementById(`avatar-${arrId[0]}`).innerHTML = `<img class="face-image" src="images/face-${faceId}.png" alt=""></img>`;
        document.getElementById(`avatar-${arrId[1]}`).innerHTML = `<img class="face-image" src="images/face-${faceId}.png" alt=""></img>`;
    },

    winkUp() {
        event.target.firstElementChild.src = `images/open-eye.png`;
    },
    winkDown() {
        event.target.firstElementChild.src = `images/closed-eye.png`;
    },

    alertStart(){ 
        document.getElementById(`reminder`).setAttribute("style", "color:red; font-size: 1.5rem;");
    }
};
const MODIFIER = {

    turn() {
        if(!DATA.gameOngoing) VIEW.alertStart();
        let id = this.correctTarget(event);
        if (id && DATA.gameOngoing && !DATA.busy) {
            DATA.currPair.push(Number(id));
            VIEW.revealCard(id);
            DATA.busy = true;
            setTimeout( () => DATA.busy = false, 500);
            if (DATA.currPair.length > 1) {
                DATA.moves++;
                VIEW.displayTurns();
                if (this.checkMatch()) {
                    DATA.pairsSolved++;
                    if(this.checkWin()) {
                        VIEW.displayEnd(`win`);
                        clearInterval(DATA.interval);
                    };
                    DATA.currPair = [];
                } else {
                    setTimeout(() => {
                        VIEW.hideCard([DATA.currPair[0]]);
                        VIEW.hideCard([DATA.currPair[1]]);
                        DATA.currPair = [];
                    }, 500)

                }
            }
        }



    },
    countdown(){
        if(DATA.gameOngoing){
            VIEW.displayTimeLeft();
            DATA.timeLeft--;
            if(DATA.timeLeft === 0){
                VIEW.displayTimeLeft();
                clearInterval(DATA.interval);
                if(this.checkWin()){
                    VIEW.displayEnd(`win`);
                }else{
                    VIEW.displayEnd(`lose`);
                }
            }
        }
    },


    checkWin(){
        return DATA.pairsSolved === 8 ? true : false;
    },

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
    //CHECKS THE EVENT TARGET IS THE CORRECT ONE
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

    startGame() {
        if(!DATA.gameOngoing){
            this.generateMatches()
    
            for (let i = 0; i < DATA.matchTable.length; i++) {
                VIEW.addFace(DATA.matchTable[i].positions, DATA.matchTable[i].faceId);
            }
            this.revealAll();
        }

    },

    resetGame(){
        DATA.boardArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
        DATA.matchTable = [];
        DATA.currPair = [];
        DATA.moves = 0;
        DATA.pairsSolved = 0;
        DATA.gameOngoing = false;
        DATA.busy = false;
        DATA.timeLeft = 100;

      VIEW.displayTimeLeft();
      VIEW.displayTurns();
      VIEW.hideEnd();

      for(let i = 0; i < DATA.boardArr.length; i++){
          VIEW.hideCard(i);
      }

    },

    revealAll(){
        for(let i = 0; i < DATA.boardArr.length; i++){
            VIEW.revealCard(i);
        }
        setTimeout( () => {
            for(let i = 0; i < DATA.boardArr.length; i++){
                VIEW.hideCard(i);
            }
            DATA.gameOngoing = true;
        }, 3000 )
    },

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
