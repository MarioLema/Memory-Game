const DATA = {
    boardArr: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    matchTable: [],
    currPair: [],
    moves: 0,
    pairsSolved: 0,
    gameOngoing: false
};
const VIEW = {

    displaySolvedPairs() {
        document.getElementById(`matches`).innerHTML = `MATCHES: ${DATA.pairsSolved}`;
    },

    displayTimeLeft(seconds) {
        document.getElementById(`time-left`).innerHTML = `TIME LEFT: ${seconds}`;
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
    }
};
const MODIFIER = {

    turn() {
        let id = this.correctTarget(event);
        if (id && DATA.gameOngoing) {
            DATA.currPair.push(Number(id));
            VIEW.revealCard(id);
            if (DATA.currPair.length > 1) {
                DATA.moves++;
                if (this.checkMatch()) {
                    DATA.pairsSolved++
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

    checkMatch() {
        for (let i = 0; i < DATA.matchTable.length; i++) {
            let firstMatch = DATA.matchTable[i].positions.indexOf(DATA.currPair[0]) !== -1 ? true : false;
            let secondMatch = DATA.matchTable[i].positions.indexOf(DATA.currPair[1]) !== -1 ? true : false;
            if (firstMatch && secondMatch) {
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
        DATA.gameOngoing = true;
        this.generateMatches()

        for (let i = 0; i < DATA.matchTable.length; i++) {
            VIEW.addFace(DATA.matchTable[i].positions, DATA.matchTable[i].faceId);
        }
    },

    generateMatches() {
        let board = DATA.boardArr;
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

    winkUp() {
        event.target.firstElementChild.src = `images/open-eye.png`;
    },
    winkDown() {
        event.target.firstElementChild.src = `images/closed-eye.png`;
    },

    winkUpListener(nodesArr) {
        for (let i = 0; i < nodesArr.length; i++) {
            nodesArr[i].addEventListener(`mouseenter`, this.winkUp, false);
            nodesArr[i].addEventListener(`mouseleave`, this.winkDown, false);
        }
    }
}
MODIFIER.turn = MODIFIER.turn.bind(MODIFIER);
MODIFIER.startGame = MODIFIER.startGame.bind(MODIFIER);

//========================CLICK EVENTS============================================
document.getElementById(`memory-game`).addEventListener(`click`, MODIFIER.turn, false);
document.getElementById(`start-game`).addEventListener(`click`, MODIFIER.startGame, false);
MODIFIER.winkUpListener(document.querySelectorAll(`.card-front`));





// //========================================================================

// class MixOrMatch {
//     constructor(totalTime, cards) {
//         this.cardsArray = cards;
//         this.totalTime = totalTime;
//         this.timeRemaining = totalTime;
//         this.timer = document.getElementById('time-remaining');
//         this.ticker = document.getElementById('flips');
//         this.audioController = new AudioController();
//     }

//     startGame() {
//         this.totalClicks = 0;
//         this.timeRemaining = this.totalTime;
//         this.cardToCheck = null;
//         this.matchedCards = [];
//         this.busy = true;
//         setTimeout(() => {
//             this.audioController.startMusic();
//             this.shuffleCards(this.cardsArray);
//             this.countdown = this.startCountdown();
//             this.busy = false;
//         }, 500)
//         this.hideCards();
//         this.timer.innerText = this.timeRemaining;
//         this.ticker.innerText = this.totalClicks;
//     }
//     startCountdown() {
//         return setInterval(() => {
//             this.timeRemaining--;
//             this.timer.innerText = this.timeRemaining;
//             if(this.timeRemaining === 0)
//                 this.gameOver();
//         }, 1000);
//     }
//     gameOver() {
//         clearInterval(this.countdown);
//         this.audioController.gameOver();
//         document.getElementById('game-over-text').classList.add('visible');
//     }
//     victory() {
//         clearInterval(this.countdown);
//         this.audioController.victory();
//         document.getElementById('victory-text').classList.add('visible');
//     }
//     hideCards() {
//         this.cardsArray.forEach(card => {
//             card.classList.remove('visible');
//             card.classList.remove('matched');
//         });
//     }
//     flipCard(card) {
//         if(this.canFlipCard(card)) {
//             this.audioController.flip();
//             this.totalClicks++;
//             this.ticker.innerText = this.totalClicks;
//             card.classList.add('visible');

//             if(this.cardToCheck) {
//                 this.checkForCardMatch(card);
//             } else {
//                 this.cardToCheck = card;
//             }
//         }
//     }
//     checkForCardMatch(card) {
//         if(this.getCardType(card) === this.getCardType(this.cardToCheck))
//             this.cardMatch(card, this.cardToCheck);
//         else 
//             this.cardMismatch(card, this.cardToCheck);

//         this.cardToCheck = null;
//     }
//     cardMatch(card1, card2) {
//         this.matchedCards.push(card1);
//         this.matchedCards.push(card2);
//         card1.classList.add('matched');
//         card2.classList.add('matched');
//         this.audioController.match();
//         if(this.matchedCards.length === this.cardsArray.length)
//             this.victory();
//     }
//     cardMismatch(card1, card2) {
//         this.busy = true;
//         setTimeout(() => {
//             card1.classList.remove('visible');
//             card2.classList.remove('visible');
//             this.busy = false;
//         }, 1000);
//     }
//     shuffleCards(cardsArray) { // Fisher-Yates Shuffle Algorithm.
//         for (let i = cardsArray.length - 1; i > 0; i--) {
//             let randIndex = Math.floor(Math.random() * (i + 1));
//             cardsArray[randIndex].style.order = i;
//             cardsArray[i].style.order = randIndex;
//         }
//     }
//     getCardType(card) {
//         return card.getElementsByClassName('card-value')[0].src;
//     }
//     canFlipCard(card) {
//         return !this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck;
//     }
// }
