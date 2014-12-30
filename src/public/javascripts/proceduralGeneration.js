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
				tile.generateNeighbours(0);
			}
		};
	}
	var gameBoard = new GameBoard();

	image.onload = function(){
		gameBoard.generateTiles(this);
	};
});
