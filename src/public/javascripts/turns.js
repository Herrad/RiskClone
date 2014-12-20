var Player = function(number, colour){
	this.number = number,
	this.colour = colour;
}

var Turns = function(colours, gameBoard){
	var players = [],
	currentTurn = 0;

	for(var i = 0; i < colours.length; i++){
		var colour = colours[i];
		players[i] = new Player(i + 1, colour);
	}

	gameBoard.playerInteractionBlocked = false;

	Turns.prototype.endTurn = function() {
		currentTurn++;
		if(currentTurn >= players.length){
			currentTurn = 0;
		}
		if(currentTurn > 0){
			gameBoard.playerInteractionBlocked = true;
		}
	};
}