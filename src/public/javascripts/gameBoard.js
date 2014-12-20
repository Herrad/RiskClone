$(document).ready(function(){
	var selectors = {
		allTiles:'td',
		endTurn: '.endTurn'
	},
	sourceTile = null,
	playerList = [
		{colour:'purple'},
		{colour:'green'},
		{colour:'red'},
		{colour:'orange'}
	],
	currentTurn = 0;

	$(selectors.allTiles).click(function(e){
		if(currentTurn > 0) return;
		var target = $(e.target);

		if(sourceTile && !target.hasClass(playerList[currentTurn].colour)){
			attack(target);
		} else {
			setSourceTile(target);
		}
	});

	$(selectors.endTurn).click(function(){

		currentTurn++;
		if(currentTurn >= playerList.length){
			currentTurn = 0;
		}
		clearSourceTile();

		highlightCuurrentPlayer();
	});

	function attack(target){

	}

	function setSourceTile(target){
		sourceIsTarget = sourceTile && sourceTile.data('x') === target.data('x') && sourceTile.data('y') === target.data('y');
		clearSourceTile();
		if(sourceIsTarget || target.hasClass('disabled'))return;

		sourceTile = target;
		sourceTile.addClass('blue')
	}

	function clearSourceTile(){
		if(!sourceTile) return;
		sourceTile.removeClass('blue')
		sourceTile = null;
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

	function highlightCuurrentPlayer(){
		$('.players span').css('background', 'white')
		var currentColour = playerList[currentTurn].colour;
		$('.players .'+currentColour).css('background', currentColour);
	}
});
