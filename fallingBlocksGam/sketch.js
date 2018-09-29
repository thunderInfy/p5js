//Created by Aditya Rastogi

//TODO:
//Aesthetics of the game: general aesthetics can be improved, a regular gameplay sound can be introduced

var canvas_; 						//global variable for canvas
var fps = 50; 						//global variable for frames per sec
var playSketch = 1; 				//playSketch determines whether to draw or not
var collisionOccurred = 0; 			//collisionOccurred tells whether collision has occurred
var GAMEOVER = 0; 					//global variable for gameover	
var GameOverSound;					//global variable for game over sound
var Gravity, lam = 3;				//lam is initial value of objects/sec
var levelUpScore = 25;				//after every increment of 25 in the score, level will increase 


function preload(){					//preload game over sound

	GameOverSound = loadSound('GameOverSound.mp3');
}

function _canvas(){					
	//mouse cursor properties

	this.mcreature = {
		side:0,
		x:100,
		y:100,
		xMax:windowWidth,
		xMin:0,
		yMax:windowHeight,
		yMin:0
	};

	//canvas initialization function

	this.init = function(){
		this.computeCnvSize();										
		this.computeMargins();
		this.cnv = createCanvas(this.canvasWidth,this.canvasHeight);
		this.centerCanvas();
		background(150);
	};

	//centering canvas function

	this.centerCanvas = function(){
		this.computeCnvXY();
		this.cnv.position(this.cnvX,this.cnvY);
	};

	//compute canvas positions

	this.computeCnvXY = function(){
		this.cnvX = (windowWidth - this.canvasWidth)/2;
		this.cnvY = 0;
	};

	//compute canvas size related attributes

	this.computeCnvSize = function(){
		this.canvasWidth = 0.53*windowWidth;
		this.canvasHeight = windowHeight;
		this.mcreature.side = 0.066*this.canvasWidth;
		this.mcreature.xMax = this.canvasWidth - this.mcreature.side;
		this.mcreature.yMax = this.canvasHeight - this.mcreature.side;
	};

	//showing mouse rectangle using this function

	this.showMouse = function(){
		fill(255,0,0);
		noStroke();
		
		this.mcreature.x = mouseX - this.mcreature.side/2;
		this.mcreature.y = mouseY - this.mcreature.side/2;
		
		this.keepMouseWithin();
		
	};

	//function for keeping mouse object within the canvas

	this.keepMouseWithin = function(){
		var within = this.mouseWithinCanvas(this.mcreature.x,this.mcreature.y);
		//this if-then-else ladder keeps track of all the cases that mouse cursor can be in

		if(within==2){
			this.mcreature.x = this.mcreature.xMin;

			if(this.mcreature.y<this.mcreature.yMax){
				if(this.mcreature.y<this.mcreature.yMin){
					this.mcreature.y = this.mcreature.yMin;
				}
			}
			else{
				this.mcreature.y = this.mcreature.yMax;
			}
		}
		else if(within==3){
			this.mcreature.x = this.mcreature.xMax;
			if(this.mcreature.y<this.mcreature.yMax){
				if(this.mcreature.y<this.mcreature.yMin){
					this.mcreature.y = this.mcreature.yMin;
				}
			}
			else{
				this.mcreature.y = this.mcreature.yMax;
			}
		}
		else if(within==4){
			this.mcreature.y = this.mcreature.yMin;
		}
		else if(within==5){
			this.mcreature.y = this.mcreature.yMax;
		}
		rect(this.mcreature.x, this.mcreature.y, this.mcreature.side, this.mcreature.side);
	};

	//utility function for the above if-then-else ladder

	this.mouseWithinCanvas = function(x,y){
		if(x<this.mcreature.xMax && x>this.mcreature.xMin && 
			y<this.mcreature.yMax && y>this.mcreature.yMin)
			return 1;
		else if(x<=this.mcreature.xMin)
			return 2;
		else if(x>=this.mcreature.xMax)
			return 3;
		else if(y<=this.mcreature.yMin)
			return 4;
		else
			return 5;
	};

	this.score = 0;								//score variable
	this.deltaScore = 0;						//for keeping track of increment in score
	this.level = 1;								//initialize level
	this.objects = [];							//array to keep track of all the objects

	//function to display the objects

	this.displayObjects = function(resizeFlag=0){

		GAMEOVER = 0;						

		for(var i=0;i<this.objects.length;i++){
			
			if(resizeFlag)
				this.objects[i].resizeObject();			//resize objcts if resize flag is 1

			this.objects[i].display();					//display objects

			if(!resizeFlag)								//if window is resizing, pause for a moment
				this.objects[i].move();

			if(collisionOccurred==0){					

				var collided = this.detectCollision(this.objects[i]);  	

				if(collided){
					GAMEOVER = 1;
				}
			}

			//if object has gone beyond the screen, then removing it from the array

			if(this.objects[i].y>this.canvasHeight){

				//level up
				if(this.deltaScore == levelUpScore){

					ObjectRect.upperRatio+=0.005;
					lam+=0.5;
					this.deltaScore = 0;
					this.level++;

				}
				this.deltaScore++;
				this.score++;
				this.objects.splice(i,1);
				i--;
			}
		}

		if(GAMEOVER){
			GameOverSound.play();
			gameOver();
		}
	};


	this.detectCollision = function(obj){
		var centerX, centerY;
		
		centerX = obj.x+ obj.A/2;
		centerY = obj.y+ obj.B/2;

		var mouseCenterX = this.mcreature.x + this.mcreature.side/2;
		var mouseCenterY = this.mcreature.y + this.mcreature.side/2;

		var xDiff, yDiff;

		xDiff = abs(mouseCenterX - centerX);
		yDiff = abs(mouseCenterY - centerY);

		var minimumXdiff, minimumYdiff;

		minimumXdiff = (obj.A/2 + this.mcreature.side/2);
		minimumYdiff = (obj.B/2 + this.mcreature.side/2);

		if(xDiff < minimumXdiff && yDiff < minimumYdiff){
			return 1;
		}
		else
			return 0;

	};

	//function to create a new object

	this.createNewObject = function(){
		this.objects.push(new ObjectRect(this.canvasWidth,this.canvasHeight));
	};	

	this.computeMargins = function(){
		this.TEXTSIZE = 32 * this.canvasWidth/724;
		this.leftMargin = this.canvasWidth*0.03;
		this.upperMargin = this.canvasHeight*0.03;
	};

	this.displayScore = function(){
		fill(255);
		textSize(this.TEXTSIZE);
		textAlign(LEFT, TOP);

		var Score_String = "Score ";
		var Score_width = textWidth(Score_String);

		text(Score_String,this.leftMargin,this.upperMargin);
		text(this.score,Score_width+this.leftMargin,this.upperMargin);
	};

	this.displayLevel = function(){
		fill(255);
		textSize(this.TEXTSIZE);
		textAlign(RIGHT, TOP);

		var Level_width = textWidth(this.level);

		text("Level ",this.canvasWidth - Level_width - this.leftMargin,this.upperMargin);
		text(this.level,this.canvasWidth - this.leftMargin,this.upperMargin);
	};

	this.displayRestartMessage = function(){
		fill(255);
		textSize(this.TEXTSIZE);
		textAlign(CENTER, CENTER);
		text("Game Over",this.canvasWidth/2,this.canvasHeight*0.4);
		text("Press R to restart",this.canvasWidth/2,this.canvasHeight*0.6);
	};
}

//this class represents all the properties and functions of the falling object

class ObjectRect {
	constructor(cnvWidth,cnvHeight){
		
		//A and B are length and breadth of the falling object

		this.A = cnvWidth*random(0.08,0.12);
		this.B = cnvWidth*random(0.08,0.12);

		this.x = random(cnvWidth - this.A);
		this.y = -this.B;

		//lower ratio for variable speeds
		this.lowerRatio = 0.0025;
		this.cnvWidth = cnvWidth;
		this.cnvHeight = cnvHeight;
		this.count = 0;

		this.speed = random(this.lowerRatio,ObjectRect.upperRatio)*cnvHeight;
	}
	display(){
		noStroke();
		fill(0,0,255);
		rect(this.x,this.y,this.A,this.B);
	}
	move(){
		this.y+=this.speed;
		this.speed+=Gravity;
		this.count++;
	}
	resizeObject(){
		var widthR = (canvas_.canvasWidth)/(this.cnvWidth);
		var heightR = (canvas_.canvasHeight)/(this.cnvHeight);

		this.A*=widthR;
		this.B*=widthR;
		this.x*=widthR;
		this.y*=heightR;
		this.speed = (this.speed - Gravity*this.count)*heightR+Gravity*this.count;

		this.cnvWidth = canvas_.canvasWidth;
		this.cnvHeight = canvas_.canvasHeight;
	}
}

ObjectRect.upperRatio = 0.005;

//setup function

function setup() {
	document.body.style.cursor = 'none';
	frameRate(fps);
	Gravity = 0.8;

	// //creating a white background canvas for no-cursor property to hold everywhere in the window

	var s = function( sketch ) {

		sketch.setup = function() {
			sketch.createCanvas(windowWidth, windowHeight);
			sketch.background(255);
		};

		sketch.draw = function() {
		};
	};

	var myp5 = new p5(s);


	//our game canvas

	canvas_ = new _canvas();
	canvas_.init();
}


//function to createObjects

function createObjects(){
	var R = random(1);
	var K;

 	K = Module.poissonDis(lam/fps);

	for(var i=0;i<K;i++){
		canvas_.createNewObject();
	}
}


//draw function 

function draw(){

	if(playSketch){
		background(150);
		canvas_.showMouse();
		createObjects();
		canvas_.displayScore();
		canvas_.displayLevel();
		canvas_.displayObjects();
	}
}

function drawAfterCollision(resizeFlag=0){
	background(150);
	canvas_.showMouse();
	canvas_.displayObjects(resizeFlag);
	canvas_.displayScore();
	canvas_.displayLevel();
	canvas_.displayRestartMessage();
}

function gameOver(){
	collisionOccurred = 1;
	drawAfterCollision();
	playSketch^=1;
}

function keyPressed(){
	if(playSketch==0){
		if(keyCode==82){
			GameOverSound.stop();
			ObjectRect.upperRatio=0.005;
			lam=3;
			canvas_.objects.splice(0,canvas_.objects.length);
			collisionOccurred = 0;
			canvas_.score = 0;
			canvas_.level = 1;
			canvas_.deltaScore = 0;
			playSketch^=1;
		}
	}
}

function windowResized(){
	canvas_.computeCnvSize();
	resizeCanvas(canvas_.canvasWidth, canvas_.canvasHeight);
	canvas_.centerCanvas();
	canvas_.computeMargins();
	drawAfterCollision(1);
}