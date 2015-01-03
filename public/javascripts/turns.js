
var currentPlayerIndex = 0;
var canMoveOn = false;

$(document).ready(function(){

});

var TurtleStrategy = function(colour, gameBoard){
	this.gameBoard = gameBoard;
	var self = this;
	return{
		enact:function(callback){
			var homeBlock = self.gameBoard.getHomeBlockFor(colour);
			var enemyNeighbours = [];
			while(!enemyNeighbours.length){
				var homeIndex = Math.floor(Math.random() * homeBlock.length);
				enemyNeighbours = homeBlock[homeIndex].getEnemyNeighbours()
			}
				var enemyNeighboursIndex = Math.floor(Math.random() * enemyNeighbours.length),
					enemyNeighbour = enemyNeighbours[enemyNeighboursIndex],
					sourceTileId = homeBlock[homeIndex].id,
					sourceTile = $('#tile' + sourceTileId),
					targetTileId = enemyNeighbour.id,
					targetTile = $('#tile' + targetTileId);

				setTimeout(function choose(){
					sourceTile.click();
					setTimeout(function attack(){
						targetTile.click();
						callback();
					}, 1000)
				}, 1000)
			for (var i = homeBlock.length - 1; i >= 0; i--) {

			};
		}
	}
}
var AiPlayer = function(colour, gameBoard){
	this.colour = colour;
	this.gameBoard = gameBoard
	this.strategy = new TurtleStrategy(colour,gameBoard);
	this.hasActed = false;
	self = this;

	return{
		takeTurn:function(){
			if(self.hasActed) return;

			self.hasActed=true;
			self.strategy.enact(function(){
				self.hasActed = false;
				$('.end-turn').click();
			});
		}
	}
}

var Player = function(colour, gameBoard){
	this.colour = colour;
	this.gameBoard = gameBoard
	var self = this;

	return{
		takeTurn:function(){
		}
	}
}

var Turns = function(gameBoard){
	this.aiPlayers= [
			new Player('purple', gameBoard),
			new AiPlayer('pink', gameBoard),
			new AiPlayer('orange', gameBoard),
			new AiPlayer('green', gameBoard)
		];
	this.colours = ['purple', 'pink', 'orange', 'green'];
	var self= this;

	function moveTurnAlong(){
		var currentPlayer = $('.player-list div.selected');
		currentPlayer.toggleClass('selected');
		currentPlayerIndex++;
		if(currentPlayerIndex >= 4){
			currentPlayerIndex = 0;
		}
		var nextPlayer = $($('.player-list div')[currentPlayerIndex]);
		nextPlayer.toggleClass('selected');
		gameBoard.clearSelection();
		gameBoard.setBiggestBlobNumbers(self.colours);
	}

	$('.end-turn').click(function(){
		moveTurnAlong(self.gameBoard);
	});

	return{
		colours:self.colours,
		start:function(){
			setInterval(function(){
			var currentAiPlayer = self.aiPlayers[currentPlayerIndex];
				currentAiPlayer.takeTurn();
			}, 1000);
		}
	}
}