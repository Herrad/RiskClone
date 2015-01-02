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
				var maxStrength = 10;
				var colourStrengths = {
					'purple':this.currentColours['purple']*10,
					'pink':this.currentColours['pink']*10,
					'orange':this.currentColours['orange']*10,
					'green':this.currentColours['green']*10
				}
				console.log(colourStrengths);
				for (var i = enabledTiles.length - 1; i >= 0; i--) {
					if(!enabledTiles[i].enabled) continue;
					var colour = enabledTiles[i].colour;

					var strength = Math.floor(1+Math.random()*10);
					if(colourStrengths[colour] - strength < 0){
						strength = colourStrengths[colour];
						colourStrengths[colour] = 0;
					} else {
						colourStrengths[colour] = colourStrengths[colour]-strength;
					}
					enabledTiles[i].setStrength(strength);
				};
				console.log('purple ' + this.getAllTilesOfColour('purple').length);
				console.log('pink ' + this.getAllTilesOfColour('pink').length);
				console.log('orange ' + this.getAllTilesOfColour('orange').length);
				console.log('green ' + this.getAllTilesOfColour('green').length);
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
		turns.start();
		console.log(gameBoard.getBlobCountsForColour('purple'));
	};
});
