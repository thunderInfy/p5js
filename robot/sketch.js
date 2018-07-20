var col=17,bot;
function setup() {
	createCanvas(windowWidth, windowHeight);
	bot = {
		x:300,
		y:300
	};
}

function draw() {
	background(100,150);
	drawRobot(bot.x,bot.y,300,mouseX,mouseY);
	V = directionfind(bot.x,bot.y,mouseX,mouseY,300);
	bot.x+=V[0];
	bot.y+=V[1];
}

function drawRobot(x,y,dia,x1,y1){
	drawFace(x,y,dia,x1,y1);
}
function drawFace(x,y,dia,x1,y1){
	var W = drawHead(x,y,dia);
	drawMouth(x,y+W[1]/2,dia*0.3);
	drawWedgeLines(x,y+dia*0.1,dia*0.5,x,y-W[1]*0.5,dia/6,dia/4);
	V = directionfind(x,y,x1,y1,dia);
	drawEye(x-(W[0]/2-(W[0]*0.35)/2),y,W[0],V);
	drawEye(x+(W[0]/2-(W[0]*0.35)/2),y,W[0],V);
}
function directionfind(x,y,x1,y1,dia){
	v_x = x1-x;
	v_y = y1-y;
	norm_v = dist(0,0,v_x,v_y);
	v_x*=dia/500;
	v_y*=dia/500;
	return [v_x,v_y];
}
function drawWedgeLines(x1,y1,r1,x2,y2,a,b){
	var firstLine = {
		x1:x2+a*cos(PI/4),
		y1:y2+b*sin(PI/4),
		y2:y1+r1*sin(-PI*0.4)
	};
	
	var secondLine = {
		x1:x2+a*cos(3*PI/4),
		y1:y2+b*sin(PI/4),
		y2:y1+r1*sin(-PI*0.4)
	}

	fill(col);
	rect(secondLine.x1,secondLine.y2,firstLine.x1 - secondLine.x1,firstLine.y1 - secondLine.y2);
}
function drawHead(x,y,dia){
	var wid = dia*1.414/2;
	var hei = dia/1.414 - 0.2*dia;
	noStroke();
	fill(20);
	arc(x,y+dia/10,dia,dia,-3*PI/4,-PI/4,CHORD);
	fill(col);
	arc(x,y+dia/10,dia,dia,-PI*0.59,-PI*0.41,PIE);
	fill(255);
	rect(x - dia/(2*1.414),y+(0.1*dia)-(dia/(2*1.414)),wid,hei);
	fill(col);
	arc(x,y-hei/2,dia/3,dia/2,0,PI,CHORD);
	fill(20);
	drawAboveEye(x,y,dia,wid,hei,true);
	drawAboveEye(x,y,dia,wid,hei,false);
	fill(255);
	arc(x,y-dia/10,dia,dia,PI/4,3*PI/4,CHORD);
	
	return [wid,hei];
}
function drawAboveEye(X,Y,dia,wid,hei,left){
	if(left==true){
		sign = -1;
	}
	else{
		sign = 1; 
	}
	var first = {
		x:X+sign*wid*0.5,
		y:Y-hei*0.5
	};
	var second = {
		x:X,
		y:Y-hei*0.5
	};
	var third = {
		x:X+sign*(wid/2-(wid*0.35)/2),
		y:Y
	};
	var fourth = {
		x:X+sign*wid/2,
		y:Y
	};
	quad(first.x,first.y,second.x,second.y,third.x,third.y,fourth.x,fourth.y);
}
function drawEye(x,y,w,V){
	fill(0);
	stroke(255,200,0);
	strokeWeight(4);
	var a = w*0.35;
	var b = a*1.2;
	ellipse(x,y,a,b);
	fill(255);
	noStroke();
	ellipse(x+V[0],y+V[1],a/5,b/5);

}
function drawMouth(x,y,dia){
	fill(0);
	drawLowerLip(x,y,dia);
	drawUpperLip(x,y,dia);
	drawTongue(x,y,dia);
}
function drawLowerLip(x,y,dia){
	arc(x,y,dia,dia/2,0,PI);
}
function drawUpperLip(x,y,dia){
	arc(x,y,dia,dia/5,PI,0);
}
function drawTongue(x,y,dia){
	fill(214,32,29);
	ellipse(x,y+dia/10,dia/7,dia/5);
}


// stroke(col);
// strokeWeight(5);
// line(firstLine.x1,firstLine.y1,firstLine.x1,firstLine.y2);
// line(secondLine.x1,secondLine.y1,secondLine.x1,secondLine.y2);