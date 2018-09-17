var canvasWidth, canvasHeight, cnv;

function _canvas(){

	this.canvasWidth = 4.8*windowHeight/9;
	this.canvasHeight = 0.8*windowHeight;

	//initializations
	this.outerFactor = 0.01;
	this.outerInitX = this.canvasWidth*this.outerFactor/2;
	this.outerInitY = this.canvasHeight*this.outerFactor/2;
	this.outerWidth = this.canvasWidth*(1-this.outerFactor);
	this.outerHeight = this.canvasHeight*(1-this.outerFactor);

	this.innerFactor = 0.08;
	this.innerInitX = this.canvasWidth*this.innerFactor/2;
	this.innerInitY = this.canvasHeight*this.innerFactor/2;
	this.innerWidth = this.canvasWidth*(1-this.innerFactor);
	this.innerHeight = this.canvasHeight*(1-this.innerFactor);

	this.OUTER = createArray(10,7,2);
	this.INNER = createArray(10,7,2);

	for(var i=0;i<10;i++){
		for(var j=0;j<7;j++){
			this.OUTER[i][j][0] = this.outerInitX+j*(this.outerWidth/6); 
			this.OUTER[i][j][1] = this.outerInitY+i*(this.outerHeight/9);
			this.INNER[i][j][0] = this.innerInitX+j*(this.innerWidth/6); 
			this.INNER[i][j][1] = this.innerInitY+i*(this.innerHeight/9);
		}
	}

	//---------------




	this.init = function(){
		this.cnv = createCanvas(this.canvasWidth,this.canvasHeight);
		this.centerCanvas();
		background(0);
	};

	this.centerCanvas = function(){
		this.x = (windowWidth - this.canvasWidth)/2;
		this.y = 0.1*windowHeight + (0.9*windowHeight - this.canvasHeight)/2;
		this.cnv.position(this.x,this.y);
	};

	this.formGrid = function(r, g, b){
		stroke(r, g, b);
		noFill();
		
		for(var i=0;i<10;i++){
			for(var j=0;j<7;j++){
				if(j!=6){
					line(this.OUTER[i][j][0],this.OUTER[i][j][1],
						this.OUTER[i][j+1][0],this.OUTER[i][j+1][1]);
					line(this.INNER[i][j][0],this.INNER[i][j][1],
						this.INNER[i][j+1][0],this.INNER[i][j+1][1]);
				}
				if(i!=9){
					line(this.OUTER[i][j][0],this.OUTER[i][j][1],
						this.OUTER[i+1][j][0],this.OUTER[i+1][j][1]);
					line(this.INNER[i][j][0],this.INNER[i][j][1],
						this.INNER[i+1][j][0],this.INNER[i+1][j][1]);
				}
				line(this.OUTER[i][j][0],this.OUTER[i][j][1],
						this.INNER[i][j][0],this.INNER[i][j][1]);
			}
		}
	};	
}

function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}



function setup() {

	var canvas_ = new _canvas();
	canvas_.init();
	canvas_.formGrid(255, 0, 0);


	var msg = createP('This page is under construction.');
	msg.position(100,100);
	msg.style('color','#0f0');


}

function draw() {

}
