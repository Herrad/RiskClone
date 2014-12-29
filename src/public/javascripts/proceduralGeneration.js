$(document).ready(function(){
	function percentageGreaterThan(number){
		return Math.random()*100 > number;
	}
	var globalId = 0;
	var recursionLimit = 20;
	var tiles = [];
	var selectedTile = null;

	var Tile = function(top, left, canvas, id, enabled){
		this.top = top;
		this.left = left;
		this.canvas = canvas;
		this.neighbours = {};
		this.maxNeighbours = 5;
		this.id = id;
		this.enabled = enabled;

		this.neighbourPositions = {
			0:{top:this.top-128, left:this.left},
			1:{top:this.top-64, left:this.left+96},
			2:{top:this.top+64, left:this.left+96},
			3:{top:this.top+128, left:this.left},
			4:{top:this.top+64, left:this.left-96},
			5:{top:this.top-64, left:this.left-96}
		};

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
				neighbourTop-=128;
			}
			if(position === 1){
				neighbourTop-=64;
				neighbourLeft+=96;
			}
			if(position === 2){
				neighbourTop += 64;
				neighbourLeft+=96;
			}
			if(position === 3){
				neighbourTop+=128;
			}
			if(position === 4){
				neighbourTop += 64;
				neighbourLeft-=96;
			}
			if(position === 5){
				neighbourTop -= 64;
				neighbourLeft-=96;
			}
			if(neighbourTop <= 64 || neighbourLeft <= 64 || neighbourLeft > 1536 || neighbourTop > 704){
				enabled = false;
			}
			var neighbour = new Tile(neighbourTop, neighbourLeft, self.canvas, ++globalId, enabled);
			self.neighbours['position' + position] = neighbour;
			for(var i = 0; i < tiles.length; i++){
				tiles[i].addNeighbourIfNear(neighbour);
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
					var enabled = percentageGreaterThan(30);
					generateNeighbourAt(position, enabled, this);
				}
				
				var enabledNeighbours = this.getEnabledNeighbours();
				for(var index in enabledNeighbours){
					enabledNeighbours[index].generateNeighbours(recursed+1);
				}
			
			},

			append: function(){
				var disabledClass = self.enabled ? '' : 'disabled';
				var html = $('<div id="tile'+self.id+'" class="tile '+disabledClass+'" style="top:'+self.top+'px;left:'+self.left+'px" data-neighbours="'+getNeighboursAsString()+'"></div>');
				if(self.enabled){
					html.click(function(el){
						if(selectedTile && selectedTile != self){
							return;
						}
						var target = $(el.target);
						target.toggleClass('selected');
						for(var k in self.neighbours){
							if(target.hasClass('selected')){
								selectedTile = self;
								self.neighbours[k].highlight();
							}
							else{
								selectedTile = null;
								self.neighbours[k].dehighlight();
							}
						}
					});
				}
				tiles.push(this);
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
			addNeighbourIfNear:function(tile){
				var top = tile.top,
					left = tile.left;
				for(var k in self.neighbourPositions){
					if(self.neighbourPositions[k].top === top && self.neighbourPositions[k].left === left){
						var position = parseInt(k);
						this.addNeighbourAt(position, tile);
						var neighbourEquivalent = position + 3 < 6 ? position + 3 :  position - 3;
						tile.addNeighbourAt(neighbourEquivalent, this);
					}
				}
			},
			enabled:self.enabled,
			id:self.id,
			top:self.top,
			left:self.left
		}

	}

	var canvas = $('.canvas');

	var tile = new Tile(378, 378, canvas, 0, true);
	tile.append();
	tile.generateNeighbours(0);
});
