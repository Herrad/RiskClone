$(document).ready(function(){
	
	var canvas = $('.canvas');
	var image = new Image();
	image.src = '/images/hexagon-small.png';
	

	var GameBoard = function(){
		this.tiles = [],
			self = this,
			selectedTile = null;
		return {
			tiles:self.tiles,
			globalId:0,
			clicked: function(e, tile){
				if(self.selectedTile && self.selectedTile != tile){
					return;
				}
				var target = $(e.target);
				target.toggleClass('selected');
				for(var k in tile.neighbours){
					if(target.hasClass('selected')){
						self.selectedTile = tile;
						tile.neighbours[k].highlight();
					}
					else{
						self.selectedTile = null;
						tile.neighbours[k].dehighlight();
					}
				}
			},
			generateTiles: function(image){
				var tile = new Tile(378, 378, canvas, 0, true, image.width, this);
				tile.append();
				tile.generateNeighbours();

				var enabledTiles = this.getEnabledTiles();
				var purple = green = orange = pink = Math.floor(enabledTiles.length/4);
				for (var i = enabledTiles.length - 1; i >= 0; i--) {
					if(!enabledTiles[i].enabled) continue;
					var colour = 'purple';
					purple--;
					if(purple <= 0){
						colour = 'green';
						green--;
						purple = 0;
					}
					if(green <= 0){
						colour = 'orange';
						orange--;
						green = 0;
					}
					if(orange <= 0){
						colour = 'pink';
						pink--;
						orange = 0;
					}
					enabledTiles[i].conquered(colour);
				};
			},
			getEnabledTiles: function(){
				var enabledTiles = [];
				for (var i = self.tiles.length - 1; i >= 0; i--) {
					if(self.tiles[i].enabled){
						enabledTiles.push(self.tiles[i]);
					}
				}
				return enabledTiles;
			}
		};
	}
	var gameBoard = new GameBoard();

	image.onload = function(){
		gameBoard.generateTiles(this);
	};
});
