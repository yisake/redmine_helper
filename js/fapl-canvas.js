if ((typeof FaplCanvasTools) === 'undefined') {
	FaplCanvasTools = {};
};
/**
 * @author 皇甫
 * @data 2016.12.29
 * @change 在所有画图方法的mousedown和mousemove中加入设置颜色和宽度
 * tempContext.lineWidth = $('#selWidth').val();
 * tempContext.strokeStyle = $('#selColor').val();
 * 
 * 
 */
// -------------------------------------------------------------------------------------
// FaplCanvasTools.pencil 
// this is use for usual pen writing procedure 
// -------------------------------------------------------------------------------------
FaplCanvasTools.pencil = function(canvas, tempCanvas, paintImage){
	var tempContext = tempCanvas.getContext("2d");
	var tool = this;
    this.started = false;
    // This is called when you start holding down the mouse button.
    // This starts the pencil drawing.
    this.mousedown = function (ev) {
    	tempContext.beginPath();
        tempContext.lineWidth = $('#selWidth').val();
        tempContext.strokeStyle = $('#selColor').val();
        tempContext.moveTo(ev._x, ev._y);
        tool.started = true;
    };

     // This function is called every time you move the mouse. Obviously, it only 
    // draws if the tool.started state is set to true (when you are holding down 
    // the mouse button).
    this.mousemove = function (ev) {
		if (tool.started) {
	        tempContext.lineWidth = $('#selWidth').val();
	        tempContext.strokeStyle = $('#selColor').val();
			tempContext.lineTo(ev._x, ev._y);
			tempContext.stroke();
		}
    };

    // This is called when you release the mouse button.
    this.mouseup = function (ev) {
		if (tool.started) {
			tool.mousemove(ev);
			tool.started = false;
			paintImage(canvas,tempCanvas);
		}
    };
};



// -------------------------------------------------------------------------------------
// FaplCanvasTools.erase 
// this is use for erasing tools
// -------------------------------------------------------------------------------------
FaplCanvasTools.erase = function(canvas, tempCanvas, paintImage){
	var context = canvas.getContext("2d");
	var tool = this;
    this.started = false;
    console.dir(this)
    // This is called when you start holding down the mouse button.
    // This starts the pencil drawing.
    this.mousedown = function (ev) {
    	
    	context.globalCompositeOperation = "destination-out";
		context.strokeStyle = "rgba(0,0,0,100.0)";
		context.lineWidth = 10;
		context.lineWidth = $('#selWidth').val();
		context.strokeStyle = $('#selColor').val();
    	context.beginPath();
        context.moveTo(ev._x, ev._y);
        tool.started = true;
    };


     // This function is called every time you move the mouse. Obviously, it only 
    // draws if the tool.started state is set to true (when you are holding down 
    // the mouse button).
    this.mousemove = function (ev) {
      if (tool.started) {
  		context.lineWidth = $('#selWidth').val();
		context.strokeStyle = $('#selColor').val();    	  
      	context.lineTo(ev._x, ev._y);
        context.stroke();
      }
    };


    // This is called when you release the mouse button.
    this.mouseup = function (ev) {
      if (tool.started) {
        tool.mousemove(ev);
        tool.started = false;
      }
    };
};

// -------------------------------------------------------------------------------------
// FaplCanvasTools.circle
// this is use for drawing circle
// -------------------------------------------------------------------------------------
FaplCanvasTools.circle = function(canvas, tempCanvas, paintImage){
	var tempContext = tempCanvas.getContext("2d");
	var tool = this;
    this.started = false;

    this.mousedown = function (ev) {
		tempContext.lineWidth = $('#selWidth').val();
		tempContext.strokeStyle = $('#selColor').val();    	
		tool.started = true;
		tool.x0 = ev._x;
		tool.y0 = ev._y;
    };

    this.mousemove = function (ev) {
      if (!tool.started) {
        return;
      }

      var x = Math.min(ev._x,  tool.x0),
          y = Math.min(ev._y,  tool.y0),
          r = Math.abs(ev._x - tool.x0);

      tempContext.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
     
      if (!r) {
        return;
      }

	   tempContext.beginPath();
	   tempContext.arc(x,y,r,0,2*Math.PI);
	   tempContext.stroke();
	   
    };

    this.mouseup = function (ev) {
      if (tool.started) {
        tool.mousemove(ev);
        tool.started = false;
		paintImage(canvas,tempCanvas);
      }
    };

};



// -------------------------------------------------------------------------------------
// FaplCanvasTools.oval
// this is use for drawing oval
// -------------------------------------------------------------------------------------
FaplCanvasTools.oval = function(canvas, tempCanvas, paintImage){
	var tempContext = tempCanvas.getContext("2d");
	var tool = this;
    this.started = false;

    this.mousedown = function (ev) {
        tempContext.lineWidth = $('#selWidth').val();
        tempContext.strokeStyle = $('#selColor').val();    	
      tool.started = true;
      tool.x0 = ev._x;
      tool.y0 = ev._y;
    };

    this.mousemove = function (ev) {
        tempContext.lineWidth = $('#selWidth').val();
        tempContext.strokeStyle = $('#selColor').val();    	
      if (!tool.started) {
        return;
      }

      var x = Math.min(ev._x,  tool.x0),
          y = Math.min(ev._y,  tool.y0),
          r = Math.abs(ev._x - tool.x0);

      tempContext.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
     
      if (!r) {
        return;
      }
	  // save state
      tempContext.save();
	  
	  // translate context
    //  tempContext.translate(FaplCanvas.CACHE.canvas.width / 2, FaplCanvas.CACHE.canvas.height / 2);

      // scale context horizontally
      tempContext.scale(2, 1);

      // draw circle which will be stretched into an oval
      tempContext.beginPath();
      tempContext.arc(x, y, r, 0, 2 * Math.PI, false);
  
   // restore to original state
      tempContext.restore();
	  
      tempContext.stroke();  
	  
	};

    this.mouseup = function (ev) {
      if (tool.started) {
        tool.mousemove(ev);
        tool.started = false;
        paintImage(canvas,tempCanvas);
      }
    };

};


// -------------------------------------------------------------------------------------
// FaplCanvasTools.line 
// this is use for drawing straight line
// -------------------------------------------------------------------------------------
FaplCanvasTools.line = function(canvas, tempCanvas, paintImage){
	var tempContext = tempCanvas.getContext("2d");
    tempContext.lineWidth = $('#selWidth').val();
    tempContext.strokeStyle = $('#selColor').val();
	var tool = this;
    this.started = false;

    this.mousedown = function (ev) {
        tempContext.lineWidth = $('#selWidth').val();
        tempContext.strokeStyle = $('#selColor').val();	    	
      tool.started = true;
      tool.x0 = ev._x;
      tool.y0 = ev._y;
    };

    this.mousemove = function (ev) {
        tempContext.lineWidth = $('#selWidth').val();
        tempContext.strokeStyle = $('#selColor').val();	    	
      if (!tool.started) {
        return;
      }

      tempContext.clearRect(0, 0, tempCanvas.width, tempCanvas.height);

      tempContext.beginPath();
      tempContext.moveTo(tool.x0, tool.y0);
      tempContext.lineTo(ev._x,   ev._y);
      tempContext.stroke();
      tempContext.closePath();
    };

    this.mouseup = function (ev) {
      if (tool.started) {
        tool.mousemove(ev);
        tool.started = false;
        paintImage(canvas,tempCanvas);
      }
    };
};



// -------------------------------------------------------------------------------------
// FaplCanvasTools.rectangle 
// this is use for drawing straight rectangle
// -------------------------------------------------------------------------------------
FaplCanvasTools.rectangle = function(canvas, tempCanvas, paintImage){
	var tempContext = tempCanvas.getContext("2d");
    tempContext.lineWidth = $('#selWidth').val();
    tempContext.strokeStyle = $('#selColor').val();	
	var tool = this;
    this.started = false;

    this.mousedown = function (ev) {
	    tempContext.lineWidth = $('#selWidth').val();
	    tempContext.strokeStyle = $('#selColor').val();
		tool.started = true;
		tool.x0 = ev._x;
		tool.y0 = ev._y;
    };

    this.mousemove = function (ev) {
        tempContext.lineWidth = $('#selWidth').val();
        tempContext.strokeStyle = $('#selColor').val();	    	
      if (!tool.started) {
        return;
      }

      var x = Math.min(ev._x,  tool.x0),
          y = Math.min(ev._y,  tool.y0),
          w = Math.abs(ev._x - tool.x0),
          h = Math.abs(ev._y - tool.y0);

      tempContext.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
	  
      if (!w || !h) {
        return;
      }

      tempContext.strokeRect(x, y, w, h);
    };

    this.mouseup = function (ev) {
      if (tool.started) {
        tool.mousemove(ev);
        tool.started = false;
        paintImage(canvas,tempCanvas);
      }
    };

};

// -------------------------------------------------------------------------------------
// FaplCanvasTools.arrow 
// this is use for drawing  arrow line
// -------------------------------------------------------------------------------------
FaplCanvasTools.arrow = function(canvas, tempCanvas, paintImage){
	var tempContext = tempCanvas.getContext("2d");
    tempContext.lineWidth = $('#selWidth').val();
    tempContext.strokeStyle = $('#selColor').val();
	var tool = this;
    this.started = false;

    this.mousedown = function (ev) {
        tempContext.lineWidth = $('#selWidth').val();
        tempContext.strokeStyle = $('#selColor').val();	    	
      tool.started = true;
      tool.x0 = ev._x;
      tool.y0 = ev._y;
    };

    this.mousemove = function (ev) {
        tempContext.lineWidth = $('#selWidth').val();
        tempContext.strokeStyle = $('#selColor').val();	    	
      if (!tool.started) {
        return;
      }

      tempContext.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
	  
      tempContext.beginPath();
      tempContext.moveTo(tool.x0, tool.y0);
      tempContext.lineTo(ev._x,   ev._y);
      
      // need to calculate the arch
      var arrowHeadLength = 12;
      var lineAngle = Math.atan ( (ev._y-tool.y0)/(ev._x-tool.x0) );
      
      var end1 = lineAngle + 45 * Math.PI/180;
	  var end2 = lineAngle - 45 * Math.PI/180;
	  
	  var y3 = 0;
	  var x3 = 0;

      var y4 = 0;
      var x4 = 0;

      if((ev._x-tool.x0) < 0 ){
      	y3 = ev._y + arrowHeadLength * Math.sin(end1);
      	x3 = ev._x + arrowHeadLength * Math.cos(end1);
		y4 = ev._y + arrowHeadLength * Math.sin(end2);
		x4 = ev._x + arrowHeadLength * Math.cos(end2);
	  } else{
		y3 = ev._y - arrowHeadLength * Math.sin(end1);
		x3 = ev._x - arrowHeadLength * Math.cos(end1);
		y4 = ev._y - arrowHeadLength * Math.sin(end2);
		x4 = ev._x - arrowHeadLength * Math.cos(end2);
	  }

      tempContext.lineTo(x3,   y3);
      tempContext.lineTo(x4,   y4);
      tempContext.lineTo(ev._x,   ev._y);
      

	  tempContext.stroke();
      tempContext.closePath();
    };

    this.mouseup = function (ev) {
      if (tool.started) {
      
        tool.mousemove(ev);
        tool.started = false;
        paintImage(canvas,tempCanvas);
      }
    };

};

// -------------------------------------------------------------------------------------
// FaplCanvasTools.font 
// this is use for font related matter
// -------------------------------------------------------------------------------------
var fontEl;
FaplCanvasTools.font = function(canvas, tempCanvas, paintImage){
	var tempContext = tempCanvas.getContext("2d");
	var tool = this;
    this.started = false;

    this.mousedown = function (ev) {
      tool.started = true;
      tool.x0 = ev._x;
      tool.y0 = ev._y;
      // get the selected font by coordinate??
       fontEl = $('<a/>',{
              class : '.font-draggable',
              text : 'Enter Text',
              /**
               * Commit by 春峰 2016.12.28
               * 去掉javascript标签，排除在chrome的inline js execution错误
              href : 'javascript:void(0)',
               */
              style : 'position:absolute;',
            });
      $(fontEl).css('top',ev._y);
      $(fontEl).css('left',ev._x);
      $(fontEl).attr('data-original-title','Enter comments');

      $('#font-container').append(fontEl);
     
      $(fontEl).draggable({ containment: "#canvas-container" });
      $(fontEl).editable({
            send: 'never',
            type: 'text', // text|textarea|select|date|checklist
            inputclass : 'input-xlarge',
            placement :'right',
            success: function(response, newValue) {
            	console.log('############')
            	if(newValue === '')
            		$(this).remove();
            	//根据其他方法添加字体输入到canvas画布中。。。
            	tempContext.fillStyle="#0088cc";
            	tempContext.textBaseline = 'top';//对齐方式
            	tempContext.font="20px Arial";
            	
            	console.log(fontEl.css('left'));
            	tempContext.fillText(newValue,parseInt(fontEl.css('left'))-21, parseInt(fontEl.css('top'))-30);
            	paintImage(canvas,tempCanvas);
            }
          });
    };
};



function FaplCanvas(canvasId){
	this.canvas = document.getElementById(canvasId);
	this.context = this.canvas.getContext('2d');

	var container = this.canvas.parentNode;
    this.tempCanvas = document.createElement('canvas');

    this.tempCanvas.id     = 'canvasTemp';
    this.tempCanvas.width  = this.canvas.width;
    this.tempCanvas.height = this.canvas.height;
    container.appendChild(this.tempCanvas);

    this.tempContext = this.tempCanvas.getContext('2d');

	this.tempCanvas.faplCanvas = this;
    this.tempCanvas.addEventListener('mousedown', this.eventMouseAction, false);
    this.tempCanvas.addEventListener('mousemove', this.eventMouseAction, false);
    this.tempCanvas.addEventListener('mouseup',   this.eventMouseAction, false);
	
	this.undoImages = [];
	this.redoImages = [];
	this.setTool(this.TOOLS_TYPE.PENCIL);
}


FaplCanvas.prototype.TOOLS_TYPE = {
	ERASE : 'erase',
	PENCIL : 'pencil',
	LINE : 'line',
	CIRCLE : 'circle',
	OVAL : 'oval',
	RECTANGLE : 'rectangle',
	ARROW : 'arrow',
	FONT : 'font',
}


// -------------------------------------------------------------------------------------
// Used to define what is the current selected tools
// -------------------------------------------------------------------------------------

FaplCanvas.prototype.SELECTED_TOOL = {
/*
	toolType : TOOLS_TYPE.PENCIL,
	tool : null,
	color : '#000000'
	*/
};

// -------------------------------------------------------------------------------------
// Shorthand method to set the tool for canvas
// -------------------------------------------------------------------------------------
FaplCanvas.prototype.setTool = function(tool){
	console.log('set tool ' + tool);
	this.SELECTED_TOOL.tool = new FaplCanvasTools[tool](this.canvas,this.tempCanvas,this.paintImage);
	this.SELECTED_TOOL.toolType = tool;
	this.SELECTED_TOOL.color = '#000000';
	console.log("end set tool ");
};

// -------------------------------------------------------------------------------------
// private function to handle the mouse event. do not call from out side of this class
// -------------------------------------------------------------------------------------
FaplCanvas.prototype.eventMouseAction = function(ev){
	this.faplCanvas.pushUndo(ev);
	if (ev.layerX || ev.layerX == 0) { // Firefox
		ev._x = ev.layerX;
		ev._y = ev.layerY;
	} else if (ev.offsetX || ev.offsetX == 0) { // Opera
		ev._x = ev.offsetX;
		ev._y = ev.offsetY;
	}
	// Call the event handler of the tool.
	var func = this.faplCanvas.SELECTED_TOOL.tool[ev.type];
	if (func) {
		func(ev);
	}
};

// -------------------------------------------------------------------------------------
// used to draw the image to actual canvas.
// -------------------------------------------------------------------------------------
FaplCanvas.prototype.paintImage = function(canvas,tempCanvas){
	var context=canvas.getContext("2d");
	var tempContext=tempCanvas.getContext("2d");
	context.globalCompositeOperation = 'source-over';
	context.strokeStyle = '#000000';
	context.lineWidth = 1;

	context.drawImage(tempCanvas, 0, 0);
	tempContext.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
	console.log('paint ' + canvas.toDataURL().length);
};

// -------------------------------------------------------------------------------------
// Preparation to store the previous drawn step by user
// -------------------------------------------------------------------------------------
FaplCanvas.prototype.pushUndo = function(ev){
	if(this.isValidMovement(ev)){
		console.log('push undo: ' + this.canvas.toDataURL().length);
		this.redoImages = [];
		this.undoImages.push(this.canvas.toDataURL());
		this.undoRedoListener()
	}
};

// -------------------------------------------------------------------------------------
// Undo functionality
// -------------------------------------------------------------------------------------
FaplCanvas.prototype.undoStep = function(){
	console.log('undo');
	var imageData = this.undoImages.pop();
	if(!(typeof imageData === 'undefined')){
		// need to work on redo
		this.redoImages.push(this.canvas.toDataURL());
		this.loadImage(imageData);
		this.undoRedoListener();
	}
};

// -------------------------------------------------------------------------------------
// Redo Functionality
// -------------------------------------------------------------------------------------
FaplCanvas.prototype.redoStep = function(){
  var imageData = this.redoImages.pop();
  if(!(typeof imageData === 'undefined')){
    this.undoImages.push(this.canvas.toDataURL());
	this.loadImage(imageData);
    this.undoRedoListener();
  }
  
};


// -------------------------------------------------------------------------------------
// Load the image to canvas
// -------------------------------------------------------------------------------------
FaplCanvas.prototype.loadImage = function(imageData){
	var self = this;
	$("<img/>").load(function(e) {
		self.context.clearRect(0, 0, self.canvas.width, self.canvas.height);
		self.context.drawImage(this, 0, 0);
	}).attr("src",imageData);  
};


// -------------------------------------------------------------------------------------
// To check for valid movement to undo ro redo store
// -------------------------------------------------------------------------------------
FaplCanvas.prototype.isValidMovement = function(ev){ 
	if('mousedown' == ev.type){
		return (this.SELECTED_TOOL.toolType == this.TOOLS_TYPE.ERASE);
	}else if ('mouseup' == ev.type){
		return (! ((this.SELECTED_TOOL.toolType == this.TOOLS_TYPE.ERASE) || (this.SELECTED_TOOL.toolType == this.TOOLS_TYPE.FONT)));
	}
	return false;
};


FaplCanvas.prototype.undoRedoListener = function(){
	this.undoListener();
    this.redoListener();
}

FaplCanvas.prototype.clearCanvas = function(){
	this.context.clearRect(0,0,this.canvas.width, this.canvas.height);
	this.tempcontext.clearRect(0,0,this.tempCanvas.width, this.tempCanvas.height);
}