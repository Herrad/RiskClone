var gameboard = null;
$(document).ready(function(){

	var image = new Image();
	image.src = '/images/hexagon-small.png';
	

	var GameBoard = function(){
		this.tiles = [];
		this.selectedTile = null;
		this.enabled = true;
		this.participatedTiles = [];
		var maxColours = 0;
		var currentColours = {
				purple:0,
				green:0,
				orange:0,
				pink:0
			},
			self = this;

		function getEnabledTiles(){
			var enabledTiles = [];
			for (var i = self.tiles.length - 1; i >= 0; i--) {
				if(self.tiles[i].enabled){
					enabledTiles.push(self.tiles[i]);
				}
			}
			return enabledTiles;
		};

		function getRandomColour(maxedColours){
			var	iterations = 0,
				selectedIndex = Math.round(Math.random() * 3),
				selection = Object.keys(currentColours)[selectedIndex];

			if(currentColours[selection] >= self.maxColours) {
				maxedColours.push(selection);
				if(maxedColours.length === 4){
					currentColours[selection]++;
					return {colour:selection, index:selectedIndex};
				}
				return getRandomColour(maxedColours);
			} else {
				currentColours[selection]++;
				return {colour:selection, index:selectedIndex};
			}
		};

		function participated(tile){
			self.participatedTiles.push(tile);
			tile.setHasActed(true);
		}

		return {
			tiles:self.tiles,
			globalId:0,
			lastAttackVictory:false,
			rollDice:function(numberOfDiceToRoll){
				var runningTotal = 0;
				for (var i = numberOfDiceToRoll - 1; i >= 0; i--) {
					runningTotal += Math.floor(1 + Math.random()*6);
				};
				return runningTotal;

			},
			clearSelection:function(){
				var target = $('div.tile.selected');
				target.removeClass('selected');
				self.selectedTile = null;
				if(!target.length) return;
				var targetTop = parseInt(target.css('top').replace('px', '')),
					targetLeft = parseInt(target.css('left').replace('px', ''));
				target.css('left', targetLeft+3+'px');
				target.css('top', targetTop+3+'px');
			},
			clicked: function(e, tile){
				var selectedTile = self.selectedTile;
				if(e.originalEvent){
					if(!self.enabled) return;
					if(!selectedTile && tile.owner != 0) return;
				} 
					
				if(selectedTile && selectedTile != tile){
					if(selectedTile.hasNeighbour(tile)){
						if(tile.getColour() === selectedTile.getColour()) {
							selectedTile.moveStrength(tile);
						}
						else{
							selectedTile.attack(tile);
						}
					}
					return;
				}
				if(!selectedTile && tile.strength === 1) return;

				tile.toggleSelection(e);
			},
			selectedTile:function(){
				return self.selectedTile;
			},
			setSelectedTile: function(tile){
				self.selectedTile = tile;
			},
			generateTiles: function(image){
				var halfCanvasWidth = Math.floor($('.canvas').width()/2),
					halfCanvasHeight = Math.floor($('.canvas').height()/2),
					tile = new Tile(halfCanvasHeight, halfCanvasWidth, 0, true, image.width, this);
				tile.append();
				tile.generateNeighbours();


				var enabledTiles = getEnabledTiles();
				self.maxColours = Math.floor(enabledTiles.length/4);
				for (var i = enabledTiles.length - 1; i >= 0; i--) {
					if(!enabledTiles[i].enabled) continue;
					var colourObj = getRandomColour([]);
					enabledTiles[i].conquered(colourObj.colour, colourObj.index);
				};
				this.setTileStrengths('purple');
				this.setTileStrengths('pink');
				this.setTileStrengths('orange');
				this.setTileStrengths('green');
			},
			setTileStrengths:function(colour){
				var colouredTiles = this.getAllTilesOfColour(colour);
				for (var i = colouredTiles.length*5 - 1; i >= 0; i--) {
					var selectedTile = null;
					var selectedStrength = 10;
					var iterations = 0;
					while(selectedStrength >= 10){
						if(iterations > 40){
							throw new Error('attempted to set strength too many times');
						}
						selectedTile = this.getRandomTile(colouredTiles);
						selectedStrength = selectedTile.strength;
						iterations++;
					}
					selectedTile.setStrength(selectedStrength + 1);
				};
				for (var i = colouredTiles.length - 1; i >= 0; i--) {
					var tile = this.findTileBy(colouredTiles[i]);
					if(!tile.strength){
						tile.setStrength(1);
					}
				}
			},
			getRandomTile:function(tiles){
				return this.findTileBy(tiles[Math.floor(tiles.length * Math.random())]);
			},
			findTileBy: function(id){
				for (var i = self.tiles.length - 1; i >= 0; i--) {
					if(self.tiles[i].id === id) return self.tiles[i];
				};
			},
			getBlobCountsForColour:function(colour){
				var colourTileIds = this.getAllTilesOfColour(colour)
				var blobCounts = [];
				for (var i = colourTileIds.length - 1; i >= 0; i--) {
					var tileId = colourTileIds[i];
					var counted = [tileId];
					var tile = this.findTileBy(tileId);
					tile.countAlliedNeighbours(counted)
					blobCounts.push(counted.length);
				};
				return blobCounts.sort(function(a, b){return b-a});
			},
			getHomeBlockIds:function(colour){
				var colourTileIds = this.getAllTilesOfColour(colour)
				var blocks = [];
				for (var i = colourTileIds.length - 1; i >= 0; i--) {
					var tileId = colourTileIds[i];
					var counted = [tileId];
					var tile = this.findTileBy(tileId);
					tile.countAlliedNeighbours(counted)
					blocks.push(counted);
				};
				return blocks.sort(function(a, b){return b.length-a.length})[0];
			},
			getHomeBlockFor: function(colour){
				var homeBlock = [],
					homeBlockIds = this.getHomeBlockIds(colour);
				if(!homeBlockIds || homeBlockIds.length <= 0){
					return homeBlock;
				}
				for (var i = homeBlockIds.length - 1; i >= 0; i--) {
					homeBlock.push(this.findTileBy(homeBlockIds[i]));
				};
				return homeBlock;
			},
			setBiggestBlobNumbers:function(colours){
				for (var i = colours.length - 1; i >= 0; i--) {
					var colour = colours[i];
					var biggestBlob = this.getBlobCountsForColour(colour)[0];
					$('.player-list .'+colour + ' span.size').text(biggestBlob);
				};
			},
			setEnabled: function(enabled){
				self.enabled = enabled;
			},
			distributeStrength: function(colour){
				var reinforcements = parseInt($('.player-list div.'+colour + ' span.size').text());
				for (var i = reinforcements - 1; i >= 0; i--) {
					var allTilesForColour = this.getAllTilesOfColour(colour)
					var tile = this.getRandomTile(allTilesForColour);
					if(!tile) return;
					var iterations = 0;
					while(tile.strength>=10 && iterations < allTilesForColour.length * 2){
						tile = this.getRandomTile(allTilesForColour)
						iterations++;
					}

					if(iterations < allTilesForColour.length * 2) {
						tile.upgrade(tile.strength + 1, tile.id);
					}
				};
			},

			 getAllTilesOfColour: function(colour){
				var tileIdsMatchingColour = [],
					enabledTiles = getEnabledTiles();
				for (var i = enabledTiles.length - 1; i >= 0; i--) {
					if(enabledTiles[i].colour === colour && tileIdsMatchingColour.indexOf(enabledTiles[i].id) === -1){
						tileIdsMatchingColour.push(enabledTiles[i].id);
					}
				};
				return tileIdsMatchingColour;
			},
			resetParticipation:function(){
				for(var tile in self.participatedTiles){
					self.participatedTiles[tile].setHasActed(false);
				}
				self.participatedTiles = [];
			},
			isOver: function(){
				var enabledTiles = getEnabledTiles(),
					initialColour = enabledTiles[0].getColour();
				for (var i = enabledTiles.length - 1; i >= 0; i--) {
					if(enabledTiles[i].getColour() != initialColour){
						return false;
					}
				};
				self.enabled = false;
				return true;
			},
			participated:participated
		};
	}

	image.onload = function(){
		var gameBoard = new GameBoard();
		var turns = new Turns(gameBoard);
		gameBoard.generateTiles(this);
		gameBoard.setBiggestBlobNumbers(turns.colours);
		turns.start();
	};
});
