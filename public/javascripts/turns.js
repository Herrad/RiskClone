
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
		gameBoard.clearSelection();
	});

});

var TurtleStrategy = function(colour, gameBoard){
	return{
		enact:function(){
			gameBoard.getHomeBlockFor(colour);
		}
	}
}
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
	var self = this;

	return{
		takeTurn:function(){}
	}
}

var Turns = function(){
	this.aiPlayers = [
		new Player('purple'),
		new AiPlayer('pink'),
		new AiPlayer('orange'),
		new AiPlayer('green')
	];
	var self = this;
	this.hasActed = false;

	return{
		colours:['purple', 'pink', 'orange', 'green'],
		start:function(){
			setInterval(function(){
				if(!this.hasActed){
					var currentAiPlayer = self.aiPlayers[currentPlayerIndex];
					currentAiPlayer.takeTurn();
					hasActed = true;
				}
			}, 1000);
		}
	}
}