
var currentPlayerIndex = 0;
var canMoveOn = false;

$(document).ready(function(){

});

var TurtleStrategy = function(colour, gameBoard){
	this.gameBoard = gameBoard;
	this.defeated = false;
	var self = this;
	function upgrade(callback){
		callback();
	}

	function launchAttack(callback){
		var homeBlock = self.gameBoard.getHomeBlockFor(colour);
		if(!homeBlock.length) {
			self.defeated = true;
			return callback();
		}

		var enemyNeighbours = [];
		var homeTile = {strength: 1},
			iterations = 0;
		while(!enemyNeighbours.length || homeTile.strength === 1 || !homeTile.canAct){
			if(iterations > 50){
				return upgrade(callback);
			}
			var homeIndex = Math.floor(Math.random() * homeBlock.length);
			homeTile = homeBlock[homeIndex];
			enemyNeighbours = homeTile.getEnemyNeighbours();
			iterations++;
		}
		var enemyNeighboursIndex = Math.floor(Math.random() * enemyNeighbours.length),
			enemyNeighbour = enemyNeighbours[enemyNeighboursIndex],
			sourceTile = $('#tile' + homeTile.id),
			targetTile = $('#tile' + enemyNeighbour.id);

		makeAttack(sourceTile, targetTile, callback);
	}

	function makeAttack(sourceTile, targetTile, callback){
		setTimeout(function choose(){
			sourceTile.click();
			setTimeout(function attack(){
				targetTile.click();
				if(self.gameBoard.lastAttackVictory){
					launchAttack(callback);
				} else {
					callback();
				}
			}, 500)
		}, 100);
	}

	return{
		enact:function(callback){
			if(self.defeated) callback();
			launchAttack(callback);
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
	this.interval = 0;
	var self = this;

	function moveTurnAlong(){
		gameBoard.distributeStrength(self.colours[currentPlayerIndex]);
		var currentPlayer = $('.player-list div.selected');
		currentPlayer.toggleClass('selected');
		currentPlayerIndex++;
		if(currentPlayerIndex >= 4){
			currentPlayerIndex = 0;
		}
		var nextPlayer = $($('.player-list div')[currentPlayerIndex]);
		nextPlayer.toggleClass('selected');
		gameBoard.clearSelection();
		gameBoard.resetParticipation();
	}

	$('.end-turn').click(function(e){
		if(!e.originalEvent || self.currentAiPlayer.isPlayer)
			moveTurnAlong(self.gameBoard);
	});

	return{
		colours:self.colours,
		start:function(){
			self.interval = setInterval(function(){
				self.currentAiPlayer = self.aiPlayers[currentPlayerIndex];
				gameBoard.setEnabled(self.currentAiPlayer.isPlayer);
				self.currentAiPlayer.takeTurn();
				if(gameBoard.isOver()){
					clearInterval(self.interval);
					$('.end-turn').prop('disabled', true);
				}
			}, 1000);
		}
	}
}