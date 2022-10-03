const computer_player = 'X';
const human = 'O';
var table;
const wins = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]

const cells = document.querySelectorAll('.cell');
startGameHandler();

function startGameHandler(){
	document.querySelector(".finishGame").style.display = "none";
	table = Array.from(Array(9).keys());
	for (var i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false);
	}
}

function checkWinHandler(board, player){
	let plays = board.reduce((a, e, i) =>
		(e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of wins.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}

function gameOverHandler(gameWon){
	for (let index of wins[gameWon.index]) {
		document.getElementById(index).style.backgroundColor =
			gameWon.player == human ? "blue" : "red";
	}
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
	}
	declareWinnerHandler(gameWon.player == human ? "You win!" : "You lose.");
}

function declareWinnerHandler(who) {
	document.querySelector(".finishGame").style.display = "block";
	document.querySelector(".finishGame .text").innerText = who;
}

function turnClick(square) {
	if (typeof table[square.target.id] == 'number') {
		turn(square.target.id, human)
		if (!checkWinHandler(table, human) && !checkTie()) turn(bestSpot(), computer_player);
	}
}

function turn(squareId, player) {
	table[squareId] = player;
	document.getElementById(squareId).innerText = player;
	let gameWon = checkWinHandler(table, player)
	if (gameWon) gameOverHandler(gameWon)
}

function emptySquares() {
	return table.filter(s => typeof s == 'number');
}

function bestSpot() {
	return minimax(table, computer_player).index;
}

function checkTie() {
	if (emptySquares().length == 0) {
		for (var i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "blue";
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinnerHandler("Tie!")
		return true;
	}
	return false;
}

function minimax(newBoard, player){
	var emptySpot = emptySquares();

	if(checkWinHandler(newBoard, human)){
		return {score: -10};
	}else if (checkWinHandler(newBoard,computer_player)){
		return {score: 10};
	}else if (emptySpot.length === 0) {
		return {score: 0};
	}
}