$(document).ready(function(){
	var selectors = {
		allTiles:'td'
	},
	sourceTile = null;

	$(selectors.allTiles).click(function(e){
		var target = $(e.target),
		sourceIsTarget = sourceTile && sourceTile.data('x') === target.data('x') && sourceTile.data('y') === target.data('y');
		clearSourceTile();
		if(sourceIsTarget || target.hasClass('disabled'))return;

		sourceTile = target;
		sourceTile.addClass('blue')
		highlightSurroundings()
	});

	function clearSourceTile(){
		if(!sourceTile) return;
		sourceTile.removeClass('blue')
		sourceTile = null;
	}

	function highlightSurroundings(){
		if(sourceTile === null){
			return;
		}
		var surroundings = getSurroundings();

		for(var k in surroundings){
			var tile = $(surroundings[k]);
			if(tile.hasClass('purple')) continue;
			// tile.addClass('red');
		}
	}

	function getSurroundings(){

		var sourceTileX = sourceTile.data('x')-1;

		var surroundings = {
			east: sourceTile.next(),
			west: sourceTile.prev()
		}

		var rowAbove = sourceTile.parent().prev();
		if(rowAbove){
			surroundings.north = $(rowAbove.children()[sourceTileX]);
			surroundings.northEast = surroundings.north.next();
			surroundings.northWest = surroundings.north.prev();
		} 

		var rowBelow = sourceTile.parent().next();
		if(rowBelow){
			surroundings.south = $(rowBelow.children()[sourceTileX]);
			surroundings.southEast = surroundings.south.next();
			surroundings.southWest = surroundings.south.prev();
		} 
		for(var k in surroundings){
			if(surroundings[k] && $(surroundings[k]).hasClass('disabled')){
				surroundings[k] = null;
			}
		}

		return surroundings;
	}
});