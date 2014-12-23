var express = require('express');
var moment = require('moment');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	var map = {
		width:11,
		height:11
	}

  res.render('index', { 
  		title: 'Express',
	   	maxX:11,
	    maxY:11,
	    startStrength:5,
	    startTime:moment().format('D/MM/YYYY, h:mm:ss'),
	    getColour: function(x, y){
	    	if(x < 6 && y < 6 || y === 5 && x === 6){
	    		return 'green';
	    	}
	    	if(x > 6 && y < 6 || y === 6 && x === 7){
	    		return 'red';
	    	}
	    	if(x < 6 && y > 6 || y === 6 && x === 5){
	    		return 'purple';
	    	}
	    	if(x > 6 && y > 6 || y === 7 && x === 6){
	    		return 'orange';
	    	}
	    }
	});
});

module.exports = router;
