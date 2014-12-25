$(document).ready(function(){
	function percentageGreaterThan(number){
		return Math.random()*100 > number;
	}
	var globalId = 0;
	var recursionLimit = 3;

	var Tile = function(top, left, canvas, id, enabled){
		this.top = top;
		this.left = left;
		this.canvas = canvas;
		this.neighbours = {};
		this.maxNeighbours = 5;
		this.id = id;
		this.enabled = enabled;

		var self = this;

		function generateNeighbourAt(position, enabled, fromTile){
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
			if(neighbourTop <= 64 || neighbourLeft <= 64 || neighbourLeft > 512 || neighbourTop > 512){
				enabled = false;
			}

			var neighbour = new Tile(neighbourTop, neighbourLeft, self.canvas, ++globalId, enabled);
			self.neighbours['position' + position] = neighbour;

			//add me to neighbour's neighbours
			var neighbourPositionForMe = getNeighbourEquivalent(position)
			neighbour.addNeighbourAt(neighbourPositionForMe, fromTile);


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


			var rightNeighbourIndex = position + 1 < 6 ? position + 1 : 0;
			var rightNeighbour = self.neighbours['position' + rightNeighbourIndex]
			if(rightNeighbour){
				var oldNeighboursIndexForMe = getNeighbourEquivalent(rightNeighbourIndex);
				var oldNeighboursNewNeighboursIndex = oldNeighboursIndexForMe+1 < 6? oldNeighboursIndexForMe+1:0;
				rightNeighbour.addNeighbourAt(oldNeighboursNewNeighboursIndex, neighbour);

				var newNeighboursIndexForMe = getNeighbourEquivalent(position);
				var newNeighboursOldNeighboursIndex = newNeighboursIndexForMe -1 >=0?newNeighboursIndexForMe-1:5;
				neighbour.addNeighbourAt(newNeighboursOldNeighboursIndex, rightNeighbour);
			}
			neighbour.append();
			
		}

		function getNeighbourEquivalent(position){
			return position + 3 < 6 ? position + 3 :  position - 3;
		}

		function getNeighboursAsString(){
			var neighbourSummary = '';
			for(var k in self.neighbours){
				neighbourSummary += k+':'+self.neighbours[k].id;
			}
			return neighbourSummary;
		}
		return {
			generateNeighbours: function(recursed){
				if(Object.keys(self.neighbours).length >= self.maxNeighbours){
					return
				}

				for(var position = 0; position<=self.maxNeighbours; position++){
					var enabled = percentageGreaterThan(20);
					generateNeighbourAt(position, enabled, this);
				}
				if(recursed < recursionLimit){
					var enabledNeighbours = this.getEnabledNeighbours();
					for(var index in enabledNeighbours){
						enabledNeighbours[index].generateNeighbours(recursed+1);
					}
				}
			},

			append: function(){
				var disabledClass = self.enabled ? '' : 'disabled';
				var html = $('<div id="tile'+self.id+'" class="tile '+disabledClass+'" style="top:'+self.top+'px;left:'+self.left+'px" data-neighbours="'+getNeighboursAsString()+'">'+self.id+'</div>');
				if(self.enabled){
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
				}
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
			},
			getEnabledNeighbours:function(){
				var enabledNeighbours = [];
				for(var k in self.neighbours){
					if(self.neighbours[k].enabled){
						enabledNeighbours.push(self.neighbours[k]);
					}
				}
				return enabledNeighbours;
			},
			enabled:self.enabled,
			id:self.id
		}

	}

	var canvas = $('.canvas');

	var tile = new Tile(128, 128, canvas, 0, true);
	tile.generateNeighbours(0);
	tile.append();
});
