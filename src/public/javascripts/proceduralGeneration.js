$(document).ready(function(){
	function percentageGreaterThan(number){
		return Math.random()*100 > number;
	}
	var globalId = 0;

	var Tile = function(position, top, left, canvas, id){
		this.top = top;
		this.left = left;
		this.canvas = canvas;
		this.position = position;
		this.neighbours = {};
		this.maxNeighbours = 5;
		this.id = id;

		var self = this;

		function generateNeighbourAt(position, fromTile){
			for(var k in self.neighbours){
				if(k === 'position'+position){
					return;
				}
			}
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
			if(neighbourTop > 0 && neighbourLeft > 0 && neighbourLeft < 400 && neighbourTop < 400){
				var neighbour = new Tile(position, neighbourTop, neighbourLeft, self.canvas, ++globalId);
				neighbour.append();
				self.neighbours['position' + position] = neighbour;

				//add me to neighbour's neighbours
				var neighbourPositionForMe = getNeighbourEquivalent(position)
				neighbour.addNeighbourAt(neighbourPositionForMe, fromTile);

				//add my neighbours to new neighbour
				var leftNeighbourIndex = position - 1 >= 0 ? position - 1 : 5;
				var leftNeighbour = self.neighbours['position' + leftNeighbourIndex]
				if(leftNeighbour){
					var oldNeighboursIndexForMe = getNeighbourEquivalent(leftNeighbourIndex);
					var oldNeighboursNewNeighboursIndex = oldNeighboursIndexForMe-1 >= 0? oldNeighboursIndexForMe-1:5;
					
					leftNeighbour.addNeighbourAt(oldNeighboursNewNeighboursIndex, neighbour);

					var newNeighboursIndexForMe = getNeighbourEquivalent(position);
					var newNeighboursOldNeighboursIndex = newNeighboursIndexForMe +1 <6?newNeighboursIndexForMe+1:0;
					neighbour.addNeighbourAt(newNeighboursOldNeighboursIndex, leftNeighbour);
				}
				if(position === 5 && self.neighbours['position0']){
					neighbour.addNeighbourAt(1,self.neighbours['position0']);
					self.neighbours['position0'].addNeighbourAt(4, neighbour);
				}
				

				var rightNeighbour = position + 1 < 6 ? position + 1 : 0;
				// if(self.id < 100)
				// 	neighbour.generateNeighbours();
			}
		}

		function getNeighbourEquivalent(position){
			return position + 3 < 6 ? position + 3 :  position - 3;
		}
		return {
			generateNeighbours: function(){
				if(self.neighbours.length === self.maxNeighbours){
					return
				}

				for(var position = 0; position<=self.maxNeighbours; position++){
					var getsNeighbour = percentageGreaterThan(00);
					if(getsNeighbour){
						generateNeighbourAt(position, this);
					}
				}
			},

			append: function(){
				var html = $('<div id="tile'+self.id+'" class="tile" style="top:'+self.top+'px;left:'+self.left+'px">'+self.id+'</div>');
				html.click(function(el){
					var target = $(el.target);
					target.toggleClass('selected');
					for(var k in self.neighbours){
						if(target.hasClass('selected'))
							self.neighbours[k].highlight();
						else
							self.neighbours[k].dehighlight();
					}
				});
				self.canvas.append(html);
			},

			addNeighbourAt: function(newNeighbourIndex, newNeighbour){
				self.neighbours['position' + newNeighbourIndex] = newNeighbour;
			},

			highlight: function(){
				var me = $('#tile'+self.id);
				me.addClass('highlighted');
			},
			dehighlight: function(){
				var me = $('#tile'+self.id);
				me.removeClass('highlighted');
			}
		}

	}

	var canvas = $('.canvas');

	var tile = new Tile(-1, 200, 200, canvas, 0);
	tile.generateNeighbours(-1);
	tile.append();
});
