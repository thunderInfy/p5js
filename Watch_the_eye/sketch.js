var creature,v,u,flag,Diameter,bg,ball,speed,low,high,supposed,count=0,Max_dis,cnv,ratio = 0.85,bot,col=17;
var mouseCreature, widthCreature, heightCreature,once = true,Rules;
var Score,score,spNorm,strt;
function preload() {
  mouseCreature = loadImage('character.png');
  Rules = loadImage('rules.png');
}

function centerCanvas() {
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x, y);
}

function setup() {
	Score = select('#Score');
	score = 0;
	widthCreature = mouseCreature.width/2;
	heightCreature = mouseCreature.height/2;
	colorMode(RGB);
	flag=1;
	Diameter =350;
	// createCanvas(width, height);
	cnv = createCanvas(windowWidth*ratio,windowHeight*ratio);
	centerCanvas();
	
	Max_dis = dist(0,0,width,height);
	v = {
		x:0,
		y:0
	};
	u = {
		x:0,
		y:0
	};
	bg = {
		r:200,
		g:200,
		b:150
	};
	ball = {
		x:0,
		y:0,
		diameter:Diameter,
		radius:Diameter/2
	};
	
	Creature = {
		xLow: mouseX - widthCreature/2 - ball.radius,
		xHigh: mouseX + widthCreature/2 + ball.radius,
		yLow: mouseY - heightCreature/2 - ball.radius,
		yHigh: mouseY + heightCreature/2 + ball.radius
	}

	if(Creature.xHigh < ball.radius){
		ball.x = random(ball.radius,width-ball.radius);
	}
	else if(Creature.xLow < ball.radius){
		ball.x = random(Creature.xHigh,width-ball.radius);
	}
	else if(Creature.xHigh < width-ball.radius){
		ball.x = random([random(ball.radius,Creature.xLow),random(Creature.xHigh,width-ball.radius)]);
	}
	else if(Creature.xLow < width-ball.radius){
		ball.x = random(ball.radius,Creature.xLow);
	}
	else{
		ball.x = random(ball.radius,width-ball.radius);
	}

	if(Creature.yHigh < ball.radius){
		ball.y = random(ball.radius,height-ball.radius);
	}
	else if(Creature.yLow < ball.radius){
		ball.y = random(Creature.yHigh,height-ball.radius);
	}
	else if(Creature.yHigh < height-ball.radius){
		ball.y = random([random(ball.radius,Creature.yLow),random(Creature.yHigh,height-ball.radius)]);
	}
	else if(Creature.yLow < height-ball.radius){
		ball.y = random(ball.radius,Creature.yLow);
	}
	else{
		ball.y = random(ball.radius,height-ball.radius);
	}



	speed = {
		x:0,
		y:0
	};
	var th = PI/6, si = PI/3, ni = PI/2;

	var Angle = random([random(th,si),random(th+ni,si+ni),random(th+2*ni,si+2*ni),random(th+3*ni,si+3*ni)]);
	var R = 10;

	speed.x = R*cos(Angle);
	speed.y = R*sin(Angle);
	
	low = {
		x:ball.radius,
		y:ball.radius
	};

	high = {
		x:width - ball.radius,
		y:height - ball.radius
	};

	supposed = {
		x:ball.x,
		y:ball.y
	};
	creature = {
		x:0,
		y:0
	};
	bot = {
		x:mouseX,
		y:mouseY
	};
}
function findDir(x,y,x1,y1,dia){
	v_x = x1-x;
	v_y = y1-y;
	norm_v = dist(0,0,v_x,v_y);
	v_x*=dia/500;
	v_y*=dia/500;
	return [v_x,v_y];
}
function getScoreFunc(x,M){
	var res;
	res = tan(((M/2-x)*PI)/M);
	return res;
}
var Div = 100000,Once=true;
function draw() {

	if(once && frameCount<Div){
		background(255);
		var ww,hh;
		ww = Rules.width;
		hh = Rules.height;
		var Rat;
		Rat = pow(((width*height)/(2*ww*hh)),0.5);
		ww *=Rat;
		hh *=Rat;
		var imX, imY;
		imX = (width - ww)/2;
		imY = (height - hh)/2;
		image(Rules,imX,imY,ww,hh);
	}

	if(flag &&((once && frameCount>=Div)||(!once))) {
		once = false;
		if(Once){
			strt = millis();
			Once = false;
		}
		//background(80,0,10);
		var res = distance_from_mouse();
		// bg.r = map(res,0,Max_dis,255,50);
		// bg.g = map(res,0,Max_dis,150,50);
		// bg.b = map(res,0,Max_dis,150,50);
		if(res!=-1){
			background(bg.r,bg.g,bg.b);
			spNorm = dist(0,0,speed.x,speed.y);
			//10/(x^4) - 3/(x^3) + 0.3*sin(x) + 1.5 + 1/(x+4*sin(x))^2;
			var tmp = res - ball.radius;
			var maxDis;
			maxDis = dist(0,0,width-ball.radius,height-ball.radius)-ball.radius;

			score+=spNorm*getScoreFunc(tmp,maxDis)/100;
			//score+=100*spNorm/(pow((tmp),2)-tmp);
			//score+=(spNorm/(100))*(10/pow(tmp,4) - 3/pow(tmp,3) + 0.3*sin(tmp) + 1.5 + 1/pow((tmp+4),2) - pow(tmp,0.07));
			Score.html(floor(score).toString());
		}else{
			background(80,0,0);
		}	
		draw_spooky_eye(ball.x,ball.y,ball.diameter,res);
		draw_mouse_creature(mouseX,mouseY);
		// V = findDir(creature.x,creature.y,mouseX,mouseY,100);
		// creature.x+=V[0];
		// creature.y+=V[1];
		supposed.x=ball.x + speed.x;
		supposed.y=ball.y + speed.y;

		if(flag==2){
			flag=1;
			mousePressed();
		}

		if(inside(supposed)==1){
			count=0;
			if(flag!=2){
				ball.x = supposed.x;
				ball.y = supposed.y;
			}
		}
		else{
			count+=1;
		}
		if (count>1){
			console.log("Ball out of bounds");
			setup();
		}
		
	}
}
function draw_mouse_creature(X,Y){
	
	X = mouseX - widthCreature/2;
	Y = mouseY - heightCreature/2;

	image(mouseCreature,X,Y,widthCreature,heightCreature);
	// fill(0);
	// noStroke();
	// ellipse(X,Y,100,100);
	// stroke(255);
	// fill(255);
	// point(X,Y);

	//drawRobot(mouseX,mouseY,100,mouseX,mouseY);
	// V = directionfind(bot.x,bot.y,mouseX,mouseY,30);
	// bot.x+=V[0];
	// bot.y+=V[1];

}
function get_vec(x,y,v){
	factor = 0.07 * ball.diameter/350;  
	v.x = (mouseX - x);
	v.y = (mouseY - y);
	norm_v = dist(v.x,v.y,0,0);
	// v.x/=norm_v;
	// v.y/=norm_v;
	
	v.x*=factor;
	v.y*=factor;
}
function draw_spooky_eye(x,y,dia,res){
	outer(x,y,dia);
	inner_dia = (12/26) * dia;
	get_vec(x,y,v);
	inner(x+v.x,y+v.y,inner_dia);
	nerves(x+v.x,y+v.y,inner_dia,x,y,dia);
	if(res!=-1){
		cover(x,y,dia);
	}
}

function cover(x,y,dia){
	noFill();
	//stroke(80,0,10);
	stroke(bg.r,bg.g,bg.b);
	strokeWeight(10);
	ellipse(x,y,dia,dia);
}

function outer(x,y,dia){
	for(var i =0;i<dia;i+=5){
		// b = map(i,0,dia,10,175);
		// fill(b+80,b,b+10);

		b = map(i,0,dia,0,233);
		fill(226+b*29/233,22+b,26+b*229/233);

		noStroke();
		ellipse(x,y,dia-i,dia-i);
	}
}
function inner(x,y,dia){
	for(var i = 0, c = 3, d = 1;i<dia;i+=5){	
		fill(40+c*i,10+d*i,0);
		noStroke();
		ellipse(x,y,dia-i,dia-i);
	}
	innermost(x,y,dia/3);
	fill(255);
}
function get_inner_vec(x,y,u){
	factor = 25*ball.diameter/260;  
	u.x = (mouseX - x);
	u.y = (mouseY - y);
	norm_u = dist(u.x,u.y,0,0);
	u.x/=norm_u;
	u.y/=norm_u;
	u.x*=factor;
	u.y*=factor;
}
function innermost(x,y,dia){
	noStroke();	
	fill(40,10,0);
	ellipse(x,y,dia,dia);
	fill(0);
	a = 0.1;
	c = 0.2;
	ellipse(x+dia*a,y-dia*a,dia*c/2,dia*c/4);
	ellipse(x-dia*a,y+dia*a,dia*c/1.2,dia*c);
	fill(255,200);
	get_inner_vec(x,y,u);
	ellipse(x+u.x/2,y+u.y/2,dia*c/2,dia*c/2);
	draw_spikes(x,y,dia);
}
function draw_spikes(x,y,dia){
	fill(40,10,0,150);
	var radius = dia/2;
	var delta = 0.08;
	var num = 16;
	var offset = TWO_PI/12;
	var i = offset;
	var Long = 1;
	while(i<TWO_PI+offset){
		X1 = x + radius * cos(i-delta);
		Y1 = y + radius * sin(i-delta);
		X2 = x + radius * cos(i+delta);
		Y2 = y + radius * sin(i+delta);
		X3 = x + radius * cos(i) * (1.5+Long/2);
		Y3 = y + radius * sin(i) * (1.5+Long/2);
		// if(i==1)
		// 	console.log(X1,Y1,X2,Y2,X3,Y3);
		triangle(X1,Y1,X2,Y2,X3,Y3);
		i+=TWO_PI/num;
		Long^=1;
	}
}
function get_arg(x,y){
	if (x>=0 && y>=0){
		return atan(y/x);
	}
	else if (x>0 && y<0){
		return TWO_PI + atan(y/x);
	}
	else{
		return PI + atan(y/x); 
	}
}

function nerves(x,y,dia,x1,y1,dia1){
	stroke(100,20,20,200);
	strokeWeight(1.2*dia1/260);
	noFill();
	
	var num = floor(sqrt(dia1));
	var offset = TWO_PI/10;
	var i = offset;
	var distance = dist(x,y,x1,y1);
	var radius_inv = dia1/2 - distance;

	while(i<TWO_PI+offset){

		tolerance = 0.05*radius_inv;

		radius = radius_inv + random(-tolerance,tolerance);

		X1 = x + radius * cos(i);
		Y1 = y + radius * sin(i);

		dist_walt = dist(X1,Y1,x1,y1);
		if(dist_walt>=dia1/2){
			continue;
		}

		Ang = get_arg(X1 - x1,Y1 - y1);
		Tol = 0.2;
		Ang+=random(-Tol,Tol);		

		X2 = x1 + dia1/2 * cos(Ang);
		Y2 = y1 + dia1/2 * sin(Ang);
		
		var v_x = X1 - X2;
		var v_y = Y1 - Y2;
		var dis = dist(v_x,v_y,0,0);
		v_x/=dis;
		v_y/=dis;
		var factor1 = dis * 0.33;
		var factor2 = dis * 0.67;

		var Orig = [v_x,v_y];
		
		var Rot1 = Rotate(Orig,X2,Y2,factor1);
		var Rot2 = Rotate(Orig,X2,Y2,factor2);

		bezier(X1,Y1,Rot1[0],Rot1[1],Rot2[0],Rot2[1],X2,Y2);
		i+=TWO_PI/num;
	}
}

function Rotate(vec,x2,y2,factor){
	x = vec[0];
	y = vec[1];
	theta = random(-PI/6,PI/6);
	c = cos(theta);
	s = sin(theta);
	X = c*x - s*y;
	Y = s*x + c*y;
	var f_x = x2 + X*factor;
	var f_y = y2 + Y*factor;
	var ans = [f_x,f_y];
	return ans;
}

function inside(given){
	if ((given.x<high.x && given.x>low.x) && (given.y<high.y && given.y>low.y)){
		return 1;
	}
	else if((given.x<low.x && given.y<low.y)||(given.x<low.x && given.y>high.y)||(given.x>high.x && given.y<low.y)||(given.x>high.x && given.y>high.y)){
			speed.x*=-1;
			speed.y*=-1;
	}
	else if((given.x<low.x)||(given.x>high.x)){
			speed.x*=-1;
	}
	else if((given.y<low.y)||(given.y>high.y)){
		speed.y*=-1;
	}
	complicate();

	return 0;
}
function complicate(del=0.01){
	speed.x*=(1+del);
	speed.y*=(1+del);
	ball.radius*=(1-del);
	ball.diameter = ball.radius*2;
	low.x = ball.radius;
	low.y = ball.radius;

	high.x = width - ball.radius;
	high.y = height - ball.radius;

	if(ball.radius<0.05){
		setup();
	}

}

function windowResized() {
  resizeCanvas(windowWidth*ratio,windowHeight*ratio);
  centerCanvas();
}

function distance_from_mouse(){
	res = dist(mouseX,mouseY,ball.x,ball.y);
	//console.log(mouseX,mouseY);
	if(res<=ball.radius+30 || !insideTheWindow() || (millis()-strt)>=45000){
		console.log(millis());
		colorMode(HSB);
		flag = 2;
		Once = true;
		return -1;
		//mousePressed(); 
	}
	return res;
}

function insideTheWindow(){
	if(mouseX<=width && mouseX>=0 && mouseY<=height && mouseY>=0){
		return 1;
	}
	return 0;
}

function mousePressed(){
	
	if(once){
		once = false;
	}
	else{

		flag^=1;
		if(flag){
			setup();
		}
	}
	Once = true;
}

// function drawRobot(x,y,dia,x1,y1){
// 	//drawFace(x,y,dia,x1,y1);
// }
// function drawFace(x,y,dia,x1,y1){
// 	var W = drawHead(x,y,dia);
// 	drawMouth(x,y+W[1]/2,dia*0.3);
// 	drawWedgeLines(x,y+dia*0.1,dia*0.5,x,y-W[1]*0.5,dia/6,dia/4);
// 	V = directionfind(x,y,x1,y1,dia);
// 	drawEye(x-(W[0]/2-(W[0]*0.35)/2),y,W[0],V);
// 	drawEye(x+(W[0]/2-(W[0]*0.35)/2),y,W[0],V);
// }
// function directionfind(x,y,x1,y1,dia){
// 	v_x = x1-x;
// 	v_y = y1-y;
// 	norm_v = dist(0,0,v_x,v_y);
// 	v_x*=dia/500;
// 	v_y*=dia/500;
// 	return [v_x,v_y];
// }
// function drawWedgeLines(x1,y1,r1,x2,y2,a,b){
// 	var firstLine = {
// 		x1:x2+a*cos(PI/4),
// 		y1:y2+b*sin(PI/4),
// 		y2:y1+r1*sin(-PI*0.4)
// 	};
	
// 	var secondLine = {
// 		x1:x2+a*cos(3*PI/4),
// 		y1:y2+b*sin(PI/4),
// 		y2:y1+r1*sin(-PI*0.4)
// 	}

// 	fill(col);
// 	rect(secondLine.x1,secondLine.y2,firstLine.x1 - secondLine.x1,firstLine.y1 - secondLine.y2);
// }
// function drawHead(x,y,dia){
// 	var wid = dia*1.414/2;
// 	var hei = dia/1.414 - 0.2*dia;
// 	noStroke();
// 	fill(20);
// 	arc(x,y+dia/10,dia,dia,-3*PI/4,-PI/4,CHORD);
// 	fill(col);
// 	arc(x,y+dia/10,dia,dia,-PI*0.59,-PI*0.41,PIE);
// 	fill(255);
// 	rect(x - dia/(2*1.414),y+(0.1*dia)-(dia/(2*1.414)),wid,hei);
// 	fill(col);
// 	arc(x,y-hei/2,dia/3,dia/2,0,PI,CHORD);
// 	fill(20);
// 	drawAboveEye(x,y,dia,wid,hei,true);
// 	drawAboveEye(x,y,dia,wid,hei,false);
// 	fill(255);
// 	arc(x,y-dia/10,dia,dia,PI/4,3*PI/4,CHORD);
	
// 	return [wid,hei];
// }
// function drawAboveEye(X,Y,dia,wid,hei,left){
// 	if(left==true){
// 		sign = -1;
// 	}
// 	else{
// 		sign = 1; 
// 	}
// 	var first = {
// 		x:X+sign*wid*0.5,
// 		y:Y-hei*0.5
// 	};
// 	var second = {
// 		x:X,
// 		y:Y-hei*0.5
// 	};
// 	var third = {
// 		x:X+sign*(wid/2-(wid*0.35)/2),
// 		y:Y
// 	};
// 	var fourth = {
// 		x:X+sign*wid/2,
// 		y:Y
// 	};
// 	quad(first.x,first.y,second.x,second.y,third.x,third.y,fourth.x,fourth.y);
// }
// function drawEye(x,y,w,V){
// 	fill(0);
// 	stroke(255,200,0);
// 	strokeWeight(4);
// 	var a = w*0.35;
// 	var b = a*1.2;
// 	ellipse(x,y,a,b);
// 	fill(255);
// 	noStroke();
// 	ellipse(x+V[0],y+V[1],a/5,b/5);

// }
// function drawMouth(x,y,dia){
// 	fill(0);
// 	drawLowerLip(x,y,dia);
// 	drawUpperLip(x,y,dia);
// 	drawTongue(x,y,dia);
// }
// function drawLowerLip(x,y,dia){
// 	arc(x,y,dia,dia/2,0,PI);
// }
// function drawUpperLip(x,y,dia){
// 	arc(x,y,dia,dia/5,PI,0);
// }
// function drawTongue(x,y,dia){
// 	fill(214,32,29);
// 	ellipse(x,y+dia/10,dia/7,dia/5);
// }
// r = map(i,0,dia/5,255,220);
// g = map(i,0,dia/5,255,180);
// b = map(i,0,dia/5,255,180);
// fill(r,g,b);


// function sum(a1,a2,offset){
// 	var s = a1+a2;
// 	if(s<offset + TWO_PI){
// 		return s;
// 	}
// 	else if(s<offset + TWO_PI*2){
// 		return s - TWO_PI;
// 	}

// 	return s - TWO_PI*2;
// }
// function diff(a1,a2,offset){
// 	var d = a1-a2;
// 	if(d<offset - TWO_PI){
// 		return d+TWO_PI*2;
// 	}
// 	else if(d<offset){
// 		return d+TWO_PI;
// 	}
// 	return d;
// }