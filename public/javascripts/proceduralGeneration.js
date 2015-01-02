var gameboard = null;
$(document).ready(function(){
	
	var canvas = $('.canvas');
	var image = new Image();
	image.src = '/images/hexagon-small.png';
	

	var GameBoard = function(){
		this.tiles = [];
		this.selectedTile = null;
		var self = this;

		return {
			tiles:self.tiles,
			globalId:0,
			maxColours:0,
			currentColours:{
				purple:0,
				green:0,
				orange:0,
				pink:0
			},
			clearSelection:function(){
				$('.tile.selected').removeClass('selected');
				$('.tile.highlighted').removeClass('highlighted');
			},
			getRandomColour:function(maxedColours){
				var selection = null,
					iterations = 0;
				// while(!selection || iterations > 10){
				// 	iterations ++;
					var selectedIndex = Math.round(Math.random() * 3)
					selection = Object.keys(this.currentColours)[selectedIndex];
					if(this.currentColours[selection] >= this.maxColours) {
						maxedColours.push(selection);
						if(maxedColours.length === 4){
							this.currentColours[selection]++;
							return selection;
						}
						return this.getRandomColour(maxedColours);
					} else {
						this.currentColours[selection]++;
						return selection;
					}
				// }
			},
			clicked: function(e, tile){
				if(self.selectedTile && self.selectedTile != tile){
					return;
				}
				var target = $(e.target);
				target.toggleClass('selected');
				var targetTop = parseInt(target.css('top').replace('px', '')),
					targetLeft = parseInt(target.css('left').replace('px', ''));
				for(var k in tile.neighbours){
					if(target.hasClass('selected')){
						self.selectedTile = tile;
						target.css('left', targetLeft-3+'px');
						target.css('top', targetTop-3+'px');
					}
					else{
						self.selectedTile = null;
						target.css('left', targetLeft+3+'px');
						target.css('top', targetTop+3+'px');
					}
				}
			},
			generateTiles: function(image){
				var tile = new Tile(378, 378, canvas, 0, true, image.width, this);
				tile.append();
				tile.generateNeighbours();

				var enabledTiles = this.getEnabledTiles();
				this.maxColours = Math.floor(enabledTiles.length/4);
				for (var i = enabledTiles.length - 1; i >= 0; i--) {
					if(!enabledTiles[i].enabled) continue;
					var colour = this.getRandomColour([]);
					enabledTiles[i].conquered(colour);
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
					var selectedStrength = 100000;
					while(selectedStrength > colouredTiles.length/5){
						selectedTile = this.findTileBy(colouredTiles[Math.floor(colouredTiles.length * Math.random())]);
						selectedStrength = selectedTile.strength;
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
			getEnabledTiles: function(){
				var enabledTiles = [];
				for (var i = self.tiles.length - 1; i >= 0; i--) {
					if(self.tiles[i].enabled){
						enabledTiles.push(self.tiles[i]);
					}
				}
				return enabledTiles;
			},
			getAllTilesOfColour:function(colour){
				var tileIdsMatchingColour = [],
					enabledTiles = this.getEnabledTiles();
				for (var i = enabledTiles.length - 1; i >= 0; i--) {
					if(enabledTiles[i].colour === colour && tileIdsMatchingColour.indexOf(enabledTiles[i].id) === -1){
						tileIdsMatchingColour.push(enabledTiles[i].id);
					}
				};
				return tileIdsMatchingColour;
			},
			findTileBy: function(id){
				for (var i = self.tiles.length - 1; i >= 0; i--) {
					if(self.tiles[i].id === id) return self.tiles[i];
				};
			},
			countAlliedNeighbours: function(counted, tile){
				var alliedNeighbours = tile.getAlliedNeighbours();
				for (var i = alliedNeighbours.length - 1; i >= 0; i--) {
					if(counted.indexOf(alliedNeighbours[i].id) === -1){
						counted.push(alliedNeighbours[i].id);
						this.countAlliedNeighbours(counted, alliedNeighbours[i]);
					}
				};
			},
			getBlobCountsForColour:function(colour){
				var colourTileIds = this.getAllTilesOfColour(colour)
				var blobCounts = [];
				for (var i = colourTileIds.length - 1; i >= 0; i--) {
					var tileId = colourTileIds[i];
					var counted = [tileId];
					var tile = this.findTileBy(tileId);
					this.countAlliedNeighbours(counted, tile)
					blobCounts.push(counted.length);
				};
				return blobCounts.sort(function(a, b){return b-a});
			}
		};
	}
	gameBoard = new GameBoard();

	image.onload = function(){
		gameBoard.generateTiles(this);
		var turns = new Turns(gameBoard);
		for (var i = turns.colours.length - 1; i >= 0; i--) {
			var colour = turns.colours[i];
			var biggestBlob = gameBoard.getBlobCountsForColour(colour)[0];
			$('.player-list .'+colour + ' span.size').text(biggestBlob);
		};
		turns.start();
	};
});
