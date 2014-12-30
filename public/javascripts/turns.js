$(document).ready(function(){
	
	$('.end-turn').click(function(e){
		var currentPlayer = $('span.selected');
		currentPlayer.toggleClass('selected');
		var nextPlayer = currentPlayer.next('span').length ? currentPlayer.next('span') : $('.player-list span').first();
		nextPlayer.toggleClass('selected');
	});

	var Player = function(number, colour){
		this.number = number;
		this.colour = colour;
		self = this;

		return{
			isMe: function(identifier){
				return identifier === 'Player ' + self.number;
			},
			canSelectTile: function(colour){
				return colour === self.colour;
			}
		}
	}
});