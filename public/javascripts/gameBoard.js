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
		} 
		if(target.hasClass(playerList[currentTurn].colour)) {
			setSourceTile(target);
		}
	});

	function attack(target){
		if(!getSurroundings().contains(target)) return;

		var sourceText = sourceTile.text(),
		sourceValue = rollDice(sourceText),
		targetValue = rollDice(target.text());

		if(sourceValue > targetValue){
			target.text(sourceText-1);
			sourceTile.text(1);
			target.removeClass();
			target.addClass(sourceTile.attr('class'));
			console.log('won ' + sourceValue + 'v'+targetValue);
		} else {
			sourceTile.text(1);
			console.log('lost ' + sourceValue + 'v'+targetValue);
		}
		clearSourceTile();
	}

	function rollDice(numberOfDice){
		var runningTotal = 0;
		for(var x = 0; x < numberOfDice; x++){
			runningTotal += 1 + Math.floor(Math.random() * 6);
		}
		return runningTotal;
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
		surroundings.contains = function(target){
			for(var k in surroundings){
				var surrounding = $(surroundings[k]);
				if(surrounding && surrounding.data('x') == target.data('x') && surrounding.data('y') == target.data('y')){
					return true;
				}
			}
			return false;
		}

		return surroundings;
	}


	$(selectors.endTurn).click(function(){

		addWinnings();

		currentTurn++;
		if(currentTurn >= playerList.length){
			currentTurn = 0;
		}
		clearSourceTile();

		highlightCurrentPlayer();
	});

	function addWinnings(){
		var totalTroops = 0;
		var currentPlayerTiles = $('td.'+playerList[currentTurn].colour)
		currentPlayerTiles.each(function(index, tile){
			totalTroops += parseInt($(tile).text());
		});
		for(var i = 0; i < totalTroops; i++){
			var winningTileText = 10;
			tried = 0;
			while(tried < 20){
				var winningTileIndex = Math.floor(Math.random() * currentPlayerTiles.length);

				var winningTile = $(currentPlayerTiles[winningTileIndex]);
				winningTileText = parseInt(winningTile.text());
				if(winningTileText < 10){
					winningTile.text(winningTileText+1);
					break;
				}
				tried++;
			}

		}
	}

	function highlightCurrentPlayer(){
		$('.players span').css('background', 'white')
		var currentColour = playerList[currentTurn].colour;
		$('.players .'+currentColour).css('background', currentColour);
	}
});
