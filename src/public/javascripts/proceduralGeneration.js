$(document).ready(function(){

	var Tile = function(position, top, left, canvas){
		this.top = top;
		this.left = left;
		this.canvas = canvas;
		this.position = position;

		this.neighbours = [];
		this.maxNeighbours = 5;

		var self = this;

		function addNeighbourAt(position){
			var neighbourTop = self.top;
			var neighbourLeft = self.left;
			if(position === 0){
				neighbourTop-=127;
			}
			if(position === 1){
				neighbourTop-=64;
				neighbourLeft+=95;
			}
			if(position === 2){
				neighbourTop += 63;
				neighbourLeft+=95;
			}
			if(position === 3){
				neighbourTop+=127;
			}
			if(position === 4){
				neighbourTop += 63;
				neighbourLeft-=95;
			}
			if(position === 5){
				neighbourTop -= 64;
				neighbourLeft-=95;
			}
			if(neighbourTop > 0 && neighbourLeft > 0){
				var neighbour = new Tile(position, neighbourTop, neighbourLeft, self.canvas);
				self.neighbours.push(neighbour);
				neighbour.append();
			}
		}

		return {
			addNeighbours: function(neighbourComingFrom){
				for(var position = 0; position<=self.maxNeighbours; position++){
					if(position === neighbourComingFrom){
						continue;
					}
					addNeighbourAt(position);
				}
			},

			append: function(){
				var html = $('<div class="tile" style="top:'+self.top+'px;left:'+self.left+'px">'+self.position+'</div>');
				html.click(function(el){
					var target = $(el.target);
					target.toggleClass('selected');
				});
				self.canvas.append(html);
			}
		}

	}

	var canvas = $('.canvas');

	var tile = new Tile(-1, 200, 200, canvas);
	tile.addNeighbours(-1);
	tile.append();
});
