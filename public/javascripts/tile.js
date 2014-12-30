

var Tile = function(top, left, canvas, id, enabled, imageWidth, gameBoard, colour){
	this.top = top;
	this.left = left;
	this.canvas = canvas;
	this.neighbours = {};
	this.maxNeighbours = 5;
	this.id = id;
	this.enabled = enabled;
	this.imageWidth = imageWidth;
	this.halfImageWidth = imageWidth/2;
	this.threeQuartersImageWidth = this.halfImageWidth + this.halfImageWidth/2;
	this.gameBoard = gameBoard;
	this.colour = colour;

	this.neighbourPositions = {
		0:{top:this.top-this.imageWidth, left:this.left},
		1:{top:this.top-this.halfImageWidth, left:this.left+this.threeQuartersImageWidth},
		2:{top:this.top+this.halfImageWidth, left:this.left+this.threeQuartersImageWidth},
		3:{top:this.top+this.imageWidth, left:this.left},
		4:{top:this.top+this.halfImageWidth, left:this.left-this.threeQuartersImageWidth},
		5:{top:this.top-this.halfImageWidth, left:this.left-this.threeQuartersImageWidth}
	};

	var self = this;

	function generateNeighbourAt(position, enabled, fromTile){
		for(var k in self.neighbours){
			if(k === 'position'+position){
				return;
			}
		}
		var neighbourTop = self.neighbourPositions[position].top;
		var neighbourLeft = self.neighbourPositions[position].left;

		if(neighbourTop <= self.imageWidth  || neighbourLeft <= 2*self.imageWidth || neighbourLeft > $(window).width()-192 || neighbourTop > 704){
			enabled = false;
		}

		var neighbour = new Tile(neighbourTop, neighbourLeft, self.canvas, ++self.gameBoard.globalId, enabled, self.imageWidth, self.gameBoard);
		for(var i = 0; i < self.gameBoard.tiles.length; i++){
			self.gameBoard.tiles[i].addNeighbourIfNear(neighbour);
		}
		neighbour.append();
		
	}

	function getNeighbourEquivalent(position){
		return position + 3 < 6 ? position + 3 :  position - 3;
	}
	return {
		enabled:self.enabled,
		top:self.top,
		left:self.left,
		neighbours:self.neighbours,

		generateNeighbours: function(){
			if(Object.keys(self.neighbours).length >= self.maxNeighbours){
				return
			}

			for(var position = 0; position<=self.maxNeighbours; position++){
				var enabled = this.percentageGreaterThan(30);
				generateNeighbourAt(position, enabled, this);
			}
			
			var enabledNeighbours = this.getEnabledNeighbours();
			for(var index in enabledNeighbours){
				enabledNeighbours[index].generateNeighbours();
			}
		
		},
		percentageGreaterThan: function(number){
			return Math.random()*100 > number;
		},

		append: function(){
			var disabledClass = self.enabled ? '' : ' disabled';
			var colour = self.colour ? ' '+self.colour : '';
			var html = $('<div id="tile'+self.id+'" class="tile'+disabledClass+ colour+'" style="top:'+self.top+'px;left:'+self.left+'px"></div>');
			if(self.enabled){
				html.click(function(el){self.gameBoard.clicked(el,self)});
			}
			self.gameBoard.tiles.push(this);
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
		conquered: function(newColour){
			var oldColour = self.colour;
			self.colour = newColour;
			$('#tile' + self.id).removeClass(oldColour);
			$('#tile' + self.id).addClass(self.colour);
		}
	}

}