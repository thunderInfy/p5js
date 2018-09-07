var cnv, points, cnvRows = 10, cnvCols = 10, gun = true,crossHairImage, roller, ratioX, ratioY;
var shoot = true, gunshot, I, P, CH = [], Draw = true, Shot, shellFall;

function preload(){
	Shot = loadSound('shot.mp3');
	shellFall = loadSound('shellFall.mp3');
	crossHairImage = loadImage('crossHair.png');
	//roller = loadImage('roller.png');
	roller = loadImage('roller.png');
	gunshot = loadImage('gunshot.png');
}


function setup() {
	frameRate(24);
	document.body.style.cursor = "None";

	var proportions = {
		crossHair : 1/2,
		eraser : 1/3
	};

	var crossHairButton = createImg('crossHair.png');
	crossHairButton.position(windowWidth-1.5*crossHairImage.width*proportions.crossHair,0.7*crossHairImage.height*proportions.crossHair);
	crossHairButton.size(crossHairImage.width*proportions.crossHair,crossHairImage.height*proportions.crossHair);

	var eraserButton = createImg('roller.png');
	eraserButton.position(windowWidth-1.2*roller.width*proportions.eraser,1.5*crossHairImage.height*proportions.crossHair+roller.height*proportions.eraser);
	eraserButton.size(roller.width*proportions.eraser,roller.height*proportions.eraser);

	crossHairButton.mousePressed(crossHairCursor);
	eraserButton.mousePressed(eraserCursor);


	var ratio = 0.75;
	ratioX = 0.85;
	ratioY = 0.90;

	//adding canvas
	cnv = createCanvas(windowWidth, windowHeight*ratioY);
	background(255);
	preparePoints();

	//adding buttons
	var jarvis, sudo, graham;
	jarvis = createButton('Get Convex Hull');
	jarvis.addClass('buttons');
	// sudo = createButton('A new approach');
	// sudo.addClass('buttons');
	// graham = createButton('Graham Scan');
	// graham.addClass('buttons');
	var buttonWidth = jarvis.size().width;
	jarvis.position(0,windowHeight*(1+ratio)/2);
	// sudo.position(buttonWidth,windowHeight*(1+ratio)/2);
	// graham.position(buttonWidth*2,windowHeight*(1+ratio)/2);
	jarvis.mouseOver(highlight);
	// sudo.mouseOver(highlight);
	// graham.mouseOver(highlight);
	jarvis.mouseOut(unhighlight);
	// sudo.mouseOut(unhighlight);
	// graham.mouseOut(unhighlight);
	cnv.mousePressed(addPoints);
	// graham.mousePressed(grahamScan);
	jarvis.mousePressed(jarvisMarch);
	// sudo.mousePressed(sudoAlgo);
	
}

function crossHairCursor(){
	document.body.style.cursor = "None";
	shoot = true;
	Draw = true;
}


function eraserCursor(){
	document.body.style.cursor = "None";
	shoot = false;
	Draw = true;
}


function preparePoints(){
	points = [];
	var row;
	for(var i=0;i<cnvRows;i++){
		row = [];
		for(var j=0;j<cnvCols;j++){
			row.push([]);
		}
		points.push(row);
	}
}

function addPoints() {

	if(shoot && Draw){
		strokeWeight(4);
		var x = mouseX;
		var y = mouseY;
		point(x,y);
		var cnvDivision = getDiv(x,y);
		Shot.play();
		setTimeout(function(){shellFall.play()},500);
		points[cnvDivision[0]][cnvDivision[1]].push([x,y]);
	}
}

function getDiv(x,y){
	var sizeObj = cnv.size();
	var cnvWidth = sizeObj.width;
	var cnvHeight = sizeObj.height;
	var col = floor(map(x,0,cnvWidth,0,cnvCols));
	var row = floor(map(y,0,cnvHeight,0,cnvRows));
	return [row,col];
}

function highlight(){
	this.style('background-color','#fff');
	this.style('color','#000');
}

function unhighlight(){
	this.style('background-color','#212f3d');
	this.style('color','#fff');
}

var gunshotW, gunshotH;


function draw(){

	if(Draw){
		background(255);

		fill(220);
		noStroke();
		rect(windowWidth*ratioX,0,windowWidth*(1-ratioX), windowHeight*ratioY);

		for(var i=0;i<cnvRows;i++){
			for(var j=0;j<cnvCols;j++){

				for(var k=0;k<points[i][j].length;k++){
					stroke(0);
					strokeWeight(4);
					var x = points[i][j][k][0];
					var y = points[i][j][k][1];

					gunshotW = gunshot.width/4;
					gunshotH = gunshot.height/4;

					image(gunshot,x- gunshotW/2 ,y - gunshotH/2,gunshotW,gunshotH);
				}
			}
		}
		for(var i=0;i<cnvRows;i++){
			for(var j=0;j<cnvCols;j++){

				for(var k=0;k<points[i][j].length;k++){

					var x = points[i][j][k][0];
					var y = points[i][j][k][1];

					noStroke();
					fill(255);
					ellipse(x,y,18,18);
				//point(points[i][j][k][0],points[i][j][k][1]);
			}
		}
	}

	

	drawCursor(mouseX, mouseY);
}

}
function drawCursor(x,y){
	if(shoot){
		var w = crossHairImage.width/2;
		var h = crossHairImage.height/2;
		image(crossHairImage,x- w/2, y - h/2,w,h);
	}
	else{
		var w = roller.width/3;
		var h = roller.height/3;
		image(roller,x- w/2, y - h/2,w,h);
	}
}



function mousePressed(){

	if(!shoot){
		
		var mX = mouseX;
		var mY = mouseY;

		var w = roller.width/3;
		var h = roller.height/3;
		var X =  mX- w/2;
		var Y =  mY - h/2;

		
		var CenterPoint = [X+61,Y+41];

		var D = getDiv(CenterPoint[0],CenterPoint[1]);
		var Rows = {
			low: D[0]-1,
			high: D[0]+1 
		};
		var Cols = {
			low: D[1]-1,
			high: D[1]+1
		};
		
		if(Rows.low<0)	Rows.low=0;
		if(Rows.high>cnvRows-1)	Rows.high=cnvRows-1;
		if(Cols.low<0)	Cols.low=0;
		if(Cols.high>cnvCols-1)	Cols.high=cnvCols-1;

		for(var i=Rows.low;i<=Rows.high;i++){
			for(var j=Cols.low;j<=Cols.high;j++){
				
				for(var k=0; k<points[i][j].length;k++){
					var x = points[i][j][k][0];
					var y = points[i][j][k][1];
					if(insideQuad(x,y,mX,mY)){
						points[i][j].splice(k,1);
						k--;
					}
				}
			}
		}

	}
}
function insideQuad(x,y,mX,mY){

	var w = roller.width/3;
	var h = roller.height/3;
	var X =  mX- w/2;
	var Y =  mY - h/2;
	var Quad = [[X+3,Y+59],[X+108,Y+2],[X+122,Y+24],[X+18,Y+82]];
	var a, Res = [], sumX=0, sumY=0;

	for(var i=0;i<Quad.length;i++){
		
		sumX+=Quad[i][0];
		sumY+=Quad[i][1];

		if(i==Quad.length-1)
			a=0;
		else 
			a=i+1;

		Res.push(getLineForm(Quad[i],Quad[a]));
	}
	sumX/=Quad.length;
	sumY/=Quad.length;

	if(getRes(Res,sumX,sumY,x,y)){
		return true;
	}
	return false;

}
function getLineForm(p1,p2){
	var x1,y1,x2,y2;

	x1 = p1[0];
	y1 = p1[1];
	x2 = p2[0];
	y2 = p2[1];

	var slope, intercept;
	slope = (y2 - y1)/(x2 - x1);
	intercept = y1 - slope*x1;
	return [slope,intercept];
}
function getRes(Res, sX, sY, x, y){
	var m,c;
	var ans = true;
	for (var i=0;i<Res.length;i++){
		m = Res[i][0];
		c = Res[i][1];

		ans = ans && getVal(m,c,sX,sY,x,y);
	}
	return ans;
}
function getVal(m, c, sX, sY, x, y){
	var one, two;
	one = sY - m*sX - c;
	two = y - m*x - c;

	return ((one>=0 && two>=0) || (one<0 && two<0));
}


// function grahamScan(){
// }

function jarvisMarch(){
	document.body.style.cursor = "";
	Draw = false;
	getTwoDPointArr();

	//find the leftmost point

	var minP = {
		Point:P[0],
		index:0
	};
	var maxP = {
		Point:P[0],
		index:0
	};

	for(var i = 1; i < P.length ; i++){
		if(P[i][0]<minP.Point[0]){
			minP.Point = P[i];
			minP.index = i;
		}
		else if(P[i][0] == minP.Point[0]){
			if(minP.Point[1] > P[i][1]){
				minP.Point = P[i];
				minP.index = i;
			}
		}

		if(P[i][0]>maxP.Point[0]){
			maxP.Point = P[i];
			maxP.index = i;
		}
		else if(P[i][0] == maxP.Point[0]){
			if(maxP.Point[1] > P[i][1]){
				maxP.Point = P[i];
				maxP.index = i;
			}
		}

	}


	var initialIndex = minP.index;

	

	CH = [];


	while(initialIndex!=maxP.index){


		CH.push(initialIndex);

		var minAngle = {
			angle: 360,
			index: initialIndex
		};

		for(var i=0;i<P.length;i++){
			if(i!=initialIndex){

				var temp = findAngle(P[initialIndex],P[i],true);
				if(temp < minAngle.angle){
					minAngle.angle = temp;
					minAngle.index = i;
				}

			}
		}

		initialIndex = minAngle.index;
	}

	while(initialIndex!=minP.index){


		CH.push(initialIndex);

		var minAngle = {
			angle: 360,
			index: initialIndex
		};

		for(var i=0;i<P.length;i++){
			if(i!=initialIndex){

				var temp = findAngle(P[initialIndex],P[i],false);
				if(temp < minAngle.angle){
					minAngle.angle = temp;
					minAngle.index = i;
				}

			}
		}

		initialIndex = minAngle.index;
	}
	var a;
	for(var i=0;i<CH.length;i++){
		if(i==CH.length-1)
			a = 0;
		else
			a = i+1;

		stroke(255,0,0);
		strokeWeight(4);
		line(P[CH[i]][0],P[CH[i]][1],P[CH[a]][0],P[CH[a]][1]);
	}


	

}
// function sudoAlgo(){

// }

function getTwoDPointArr(){

	P = [];

	for(var i=0;i<cnvRows;i++){
		for(var j=0;j<cnvCols;j++){

			for(var k=0;k<points[i][j].length;k++){
				P.push(points[i][j][k]);
			}
		}
	}
}


function findAngle(p1,p2,above){
	var x = p2[0] - p1[0];
	var y = p2[1] - p1[1];
	var normV = dist(x,y,0,0);

	var mag = normV;
	if(above){
		var dot = y;
		
		var costheta = dot/mag;
		var theta = degrees(acos(costheta));
		if(x>=0){
			return theta;
		}
		else{
			return (360-theta);
		}
	}
	else{
		var dot = -y;
		var costheta = dot/mag;
		var theta = degrees(acos(costheta));
		if(x<=0){
			return theta;
		}
		else{
			return (360-theta);
		}
	}
}








// var myp5 = new p5( function( sketch ) {

	// 	sketch.setup = function() {
	// 		var cnvS = sketch.createCanvas(, windowHeight*ratioY);
	// 		sketch.background(220);
	// 	};
	// 	sketch.draw = function() {
	// 		drawCursor(mouseX,mouseY);
	// 	}
	// });

