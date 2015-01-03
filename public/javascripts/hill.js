var Hill = function(){}

$(document).ready(function(){
	Hill = function(top, left, id, enabled, imageWidth, gameBoard){
		var baseTile = new Tile(top, left, id, enabled, imageWidth, gameBoard);
		baseTile.colour = 'grey';
		baseTile.conquered = function(colour, conqueredBy){
			baseTile.conqueredBy = conqueredBy;
		};
		baseTile.strength = 5;
		var actualStrength = 1;

		baseTile.setStrength = function(strength){
			actualStrength = strength;
			$('#tile' + baseTile.id).text(actualStrength + '(' + baseTile.strength + ')');
		}

		baseTile.moveStrength = function(target){
			if(actualStrength <= 1 || target.strength >= 10) return;
			actualStrength = self.actualStrength - 1;
			$('#tile' + baseTile.id).text(actualStrength + '(' + baseTile.strength + ')');
			target.setStrength(target.strength + 1);
			gameBoard.participated(baseTile);
			gameBoard.participated(target);
		}

		return baseTile;
	}
})