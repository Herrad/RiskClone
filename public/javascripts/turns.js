
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
			var homeTile = {strength: 1};
			while(!enemyNeighbours.length || homeTile.strength === 1){
				var homeIndex = Math.floor(Math.random() * homeBlock.length);
				homeTile = homeBlock[homeIndex];
				enemyNeighbours = homeTile.getEnemyNeighbours()
			}
				var enemyNeighboursIndex = Math.floor(Math.random() * enemyNeighbours.length),
					enemyNeighbour = enemyNeighbours[enemyNeighboursIndex],
					sourceTileId = homeTile.id,
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
	var self = this;

	return{
		takeTurn:function(){
			if(self.hasActed) return;

			self.hasActed=true;
			self.strategy.enact(function(){
				self.hasActed = false;
				$('.end-turn').click();
			});
		},
		isPlayer:false
	}
}

var Player = function(colour, gameBoard){
	this.colour = colour;
	this.gameBoard = gameBoard
	var self = this;

	return{
		takeTurn:function(){
		},
		isPlayer:true
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
	this.currentAiPlayer = this.aiPlayers[currentPlayerIndex]
	var self = this;

	function moveTurnAlong(){
		// gameBoard.distributeStrength(self.colours[currentPlayerIndex]);
		var currentPlayer = $('.player-list div.selected');
		currentPlayer.toggleClass('selected');
		currentPlayerIndex++;
		if(currentPlayerIndex >= 4){
			currentPlayerIndex = 0;
		}
		var nextPlayer = $($('.player-list div')[currentPlayerIndex]);
		nextPlayer.toggleClass('selected');
		gameBoard.clearSelection();
	}

	$('.end-turn').click(function(){
		moveTurnAlong(self.gameBoard);
	});

	return{
		colours:self.colours,
		start:function(){
			// setInterval(function(){
			// 	self.currentAiPlayer = self.aiPlayers[currentPlayerIndex];
			// 	gameBoard.setEnabled(self.currentAiPlayer.isPlayer);
			// 	self.currentAiPlayer.takeTurn();
			// }, 1000);
		}
	}
}