
var currentPlayerIndex = 0;
var canMoveOn = false;

$(document).ready(function(){

});

var Strategy = function(colour, gameBoard){
	this.gameBoard = gameBoard;
	this.defeated = false;
	var self = this;
	function upgrade(callback){
		callback();
	}

	function reallocate(homeBlock, callback){
		var strongestHomeTile = homeBlock.sort(function(a, b){ return b.strength - a.strength})[0],
			alliedNeighbours = strongestHomeTile.getAlliedNeighbours();
		if(!alliedNeighbours.length) return upgrade(callback);
		
		alliedNeighboursIndex = Math.floor(Math.random()* alliedNeighbours.length);

		$('#tile' + strongestHomeTile.id).click();
		for(var i = 0; i < strongestHomeTile.strength - 1; i++){
			if(alliedNeighbours[alliedNeighboursIndex].strength > 10) continue;
			var alliedId = alliedNeighbours[alliedNeighboursIndex].id;
			$('#tile' + alliedId).click();
		}
		callback();
	}

	function fireClicks(sourceTile, targetTile, callback){
		setTimeout(function choose(){
			sourceTile.click();
			setTimeout(function attack(){
				targetTile.click();
				callback();
			}, 1)
		}, 1);
	}

	return{
		gameBoard:self.gameBoard,
		enact:function(callback){
			var homeBlock = self.gameBoard.getHomeBlockFor(colour);
			if(!homeBlock.length) {
				self.defeated = true;
				return callback();
			}
			this.launchAttack(homeBlock, callback);
		},
		launchAttack:function(homeBlock, callback){
			var allyAndEnemy = this.getAllyAndEnemy([]);
			if(!allyAndEnemy) return reallocate(homeBlock, callback);
			var availableAttackTile = allyAndEnemy.ally,
				enemyNeighbour = allyAndEnemy.enemy;

			var currentObj = this,
				sourceTile = $('#tile' + availableAttackTile.id),
				targetTile = $('#tile' + enemyNeighbour.id);

			return fireClicks(sourceTile, targetTile, 
				function(){
					if(self.gameBoard.lastAttackVictory){
						currentObj.launchAttack(homeBlock, callback);
					}else{
						callback();
					}
				});

			return reallocate(homeBlock, callback);
		},
		getAllyAndEnemy:function(triedTiles){
			var availableAttackTile = this.findAvailableAttackTile(triedTiles);
			if(!availableAttackTile) return null;
			
			var enemyNeighbour = this.findEnemyToAttack(availableAttackTile);
			
			if(!enemyNeighbour) {
				triedTiles.push(availableAttackTile);
				return this.getAllyAndEnemy(triedTiles);
			}

			return {ally:availableAttackTile, enemy: enemyNeighbour};
		},
		findAvailableAttackTile: function(triedTiles){
			var homeBlock = self.gameBoard.getHomeBlockFor(colour),
				iterations = 0,
				homeIndex = Math.floor(Math.random() * homeBlock.length),
				homeTile = homeBlock[homeIndex],
				enemyNeighbours = homeTile.getEnemyNeighbours();

				while(!enemyNeighbours.length || homeTile.strength <= 1){
					if(iterations > 50){
						return null;
					}
					homeIndex = Math.floor(Math.random() * homeBlock.length),
					homeTile = homeBlock[homeIndex],
					enemyNeighbours = homeTile.getEnemyNeighbours();
					iterations++;
				}
			if(triedTiles.indexOf(homeTile) != -1) return null;
			return homeTile;
		},
		findEnemyToAttack:function(availableAttackTile){
			var enemyNeighbours = availableAttackTile.getEnemyNeighbours();

			for (var i = enemyNeighbours.length - 1; i >= 0; i--) {
				if(this.shouldAttack(availableAttackTile, enemyNeighbours[i])){
					return enemyNeighbours[i];
				}
			};
		},
		shouldAttack:function(alliedTile, enemyTile){
			return enemyTile.strength <= alliedTile.strength - 1
		}
	}
}

var SafeBetStrategy = function(colour, gameBoard){
	var baseStrategy = new Strategy(colour, gameBoard);

	baseStrategy.findAvailableAttackTile = function(triedTiles){
		var allTiles = baseStrategy.gameBoard.getAllTilesOfColour(colour);
		if(!allTiles) return null;
		var strongestTile = {strength:0};
		for (var i = allTiles.length - 1; i >= 0; i--) {
			var tile = baseStrategy.gameBoard.findTileBy(allTiles[i]);
			if(triedTiles.indexOf(tile) === -1 && tile.strength > strongestTile.strength){
				strongestTile = tile;
			}
		};
		if(strongestTile.strength === 0) return null;
		return strongestTile;
	}

	baseStrategy.shouldAttack = function(alliedTile, enemyTile){
		return enemyTile.strength <= alliedTile.strength - 2 || (alliedTile.strength === 10 && enemyTile.strength === 10)
	}

	return baseStrategy;

}
var AiPlayer = function(colour, gameBoard, strategy){
	this.colour = colour;
	this.gameBoard = gameBoard
	this.strategy = strategy;
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
			 new AiPlayer('purple', gameBoard, new SafeBetStrategy('purple',gameBoard)),// new Player('purple', gameBoard)
			new AiPlayer('pink', gameBoard, new SafeBetStrategy('pink',gameBoard)),
			new AiPlayer('orange', gameBoard, new SafeBetStrategy('orange',gameBoard)),
			new AiPlayer('green', gameBoard, new SafeBetStrategy('green',gameBoard))
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
			}, 100);
		}
	}
}