var Generation = function(){};

var gameboard = null;
$(document).ready(function(){

	var image = new Image();
	image.src = '/images/hexagon-small.png';
	

	var Generation = function(gameBoard){
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
		this.gameBoard = gameboard;
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
			generateTiles: function(imageWidth){
				var halfCanvasWidth = Math.floor($('.canvas').width()/2),
					halfCanvasHeight = Math.floor($('.canvas').height()/2),
					tile = new Tile(halfCanvasHeight, halfCanvasWidth, 0, true, imageWidth, self.gameBoard);
				tile.append();
				tile.generateNeighbours();
			},
		};
	}

	image.onload = function(){
		var gameBoard = new GameBoard();
		var turns = new Turns(gameBoard);
		gameBoard.generateTiles(32);
		gameBoard.setBiggestBlobNumbers(turns.colours);
		turns.start();
	};
});
