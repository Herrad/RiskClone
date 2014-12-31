
var currentPlayerIndex = 0;

$(document).ready(function(){

	$('.end-turn').click(function(e){
		var currentPlayer = $('span.selected');
		currentPlayer.toggleClass('selected');
		currentPlayerIndex++;
		if(currentPlayerIndex >= 4){
			currentPlayerIndex = 0;
		}
		var nextPlayer = $($('.player-list span')[currentPlayerIndex]);
		nextPlayer.toggleClass('selected');
	});

});
var AiPlayer = function(colour, gameBoard){
	this.colour = colour;
	this.gameBoard = gameBoard
	self = this;

	return{
		takeTurn:function(){
			$('.end-turn').click();
		}
	}
}

var Player = function(colour, gameBoard){
	this.colour = colour;
	this.gameBoard = gameBoard
	self = this;

	return{
		takeTurn:function(){}
	}
}

var Turns = function(gameBoard){
	this.gameBoard = gameBoard;
	this.aiPlayers = [
		new Player('purple', this.gameBoard),
		new AiPlayer('pink', this.gameBoard),
		new AiPlayer('orange', this.gameBoard),
		new AiPlayer('green', this.gameBoard)
	];
	self = this;

	return{
		start:function(){
			setInterval(function(){
				var currentAiPlayer = self.aiPlayers[currentPlayerIndex];
				currentAiPlayer.takeTurn();
			}, 1000);
		}
	}
}