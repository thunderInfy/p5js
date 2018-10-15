var pencil, reload, _cursor;						//for the icons
var itemSize;										//icons' size
var pencilIsClicked;								//if drawing is on
var lineOnHold;										//the line currently is on hold
var lineHold;										//if actually holding of the line is true
var ascentText;										//for text height
var linesObjArr = [];								//object array of lines
var showLineNames;
var drawGraph;
var G;
var kInp;
var kVal;
var describeSlider;

//class for the horizontal bars

class horizontalLine {
	constructor(v1,v2){
		this.x1 = min(v1.x,v2.x);
		this.x2 = max(v1.x,v2.x);
		this.y = v1.y;
		this.name = 'a';
	}
	setName(n){
		this.name = n;
	}
	show(){
	
		stroke(0);								
		strokeWeight(3);
		line(this.x1, this.y, this.x2, this.y);
		noStroke();

		if(showLineNames){
			fill(0);
			textSize(15);
			textAlign(CENTER,CENTER);
			text(this.name, this.x1-10,this.y);
		}
	}
	updateCoordinates(w,h,pw,ph){
		this.x1 *= (w/pw);
		this.x2 *= (w/pw);
		this.y *= (h/ph);
	}
}

//icon location objects

var pencilIconLocation = {
	x:0,
	y:0
};

var reloadIconLocation = {
	x:0,
	y:0
};

var _cursorIconLocation = {
	x:0,
	y:0
};


//preloading icons
function preload(){
	pencil = loadImage("pencilIcon.png");
	reload = loadImage("reloadIcon.png");
	_cursor = loadImage("cursorIcon.png");
}

function setup() {
	kVal = 0;
	createCanvas(windowWidth, windowHeight);
	setSizes();									//function to set location objects of icons
	pencilIsClicked = false;					//currently pencil isn't selected
	lineHold = false;							//currently no line is on hold
	showLineNames = false;						//don't show line names at the start
	G = new Graph();
	kInp = createSlider(0,20,0,1);
	kInp.position(windowWidth*0.1,0);
	kInp.size(windowWidth*0.05,windowWidth*0.025);
	kInp.changed(kChanged);
	describeSlider = createP('Value of K');
	describeSlider.position(windowWidth*0.1,windowWidth*0.02);
}

function kChanged(){
	G.clearGraph();
	kVal = this.value();
	doTheAlgorithm();
}

function draw() {
	
	formBackground();							//form the background colors 

	//side icons
	image(pencil,pencilIconLocation.x,pencilIconLocation.y,itemSize,itemSize);
	image(reload,reloadIconLocation.x,reloadIconLocation.y,itemSize,itemSize);
	image(_cursor,_cursorIconLocation.x,_cursorIconLocation.y,itemSize,itemSize);
	
	//headers
	writeText();

	if(pencilIsClicked){
		image(pencil,mouseX,mouseY-itemSize/2,itemSize/2,itemSize/2);	//if pencil is selected draw pencil
	}

	for(let i=0;i<linesObjArr.length;i++){
		linesObjArr[i].show();				//draw lines which are not on hold on the screen
	}

	if(lineHold){
		stroke(0);								
		strokeWeight(3);
		line(lineOnHold.x, lineOnHold.y, mouseX, lineOnHold.y);		//draw on hold line
	}
	
	noStroke();
	mouseOver();				//for changing the cursor to hand pointer at the bottom of the page

	if(drawGraph){
		G.drawEdges();
		G.drawNodes();
	}

}

function formBackground(){
	fill(150);		
	noStroke();
	rect(0,0,windowWidth*0.1, windowHeight);

	push();
	translate(windowWidth*0.1, 0);
	fill(220,200,200);
	noStroke();
	rect(0,0,windowWidth*0.45, windowHeight);
	pop();

	push();
	translate(windowWidth*0.55, 0);
	fill(200,200,220);
	noStroke();
	rect(0,0,windowWidth*0.45, windowHeight);
	pop();
}

function windowResized(){
	let prevWid = width;
	let prevHei = height;
	resizeCanvas(windowWidth, windowHeight);	
	setSizes();

	for(let i=0; i<linesObjArr.length; i++){
		linesObjArr[i].updateCoordinates(windowWidth, windowHeight, prevWid, prevHei);
	}
	G.updateCoordinates(windowWidth, windowHeight, prevWid, prevHei);
	kInp.position(windowWidth*0.1,0);
	kInp.size(windowWidth*0.05,windowWidth*0.025);
	describeSlider.position(windowWidth*0.1,windowWidth*0.02);
}

function setSizes(){
	itemSize = windowWidth*0.07;
	
	let delta = (windowHeight - 3*itemSize)/4;

	pencilIconLocation.x = windowWidth*0.015;
	pencilIconLocation.y = delta;

	_cursorIconLocation.x = windowWidth*0.015;
	_cursorIconLocation.y = pencilIconLocation.y + itemSize + delta;

	reloadIconLocation.x = windowWidth*0.015;
	reloadIconLocation.y = _cursorIconLocation.y + itemSize + delta;

}

function writeText(){
	push();
	translate(windowWidth*(0.325), 0);
	fill(0);
	textAlign(CENTER,TOP);
	textSize(20);
	if(kVal)
		text("Bar " +kVal+ " - visibility\n representation of G",0,0);
	else
		text("Bar visibility\n representation of G",0,0);
	pop();

	push();
	translate(windowWidth*(0.775), 0);
	fill(0);
	textAlign(CENTER,TOP);
	textSize(20);
	if(kVal)
		text("Bar " +kVal+ " - visibility\n graph G",0,0);
	else
		text("Bar visibility\n graph G",0,0);
	pop();

	push();
	rectMode(CORNERS);
	translate(windowWidth*(0.325), windowHeight);
	textAlign(CENTER,BOTTOM);
	textSize(20);
	fill(0);
	stroke(0);
	ascentText = textAscent();
	rect(-0.225*windowWidth,-ascentText-30,0.225*windowWidth,0);
	noStroke();
	fill(255);
	if(kVal)
		text("Get bar " +kVal+ " - visibility graph G",0,-15);
	else
		text("Get bar visibility graph G",0,-15);
	pop();


}

function pencilClicked(){
	document.body.style.cursor = "none";
	pencilIsClicked = true;
	showLineNames = false;
	drawGraph = false;
	G.clearGraph();
}

function cursorClicked(){
	document.body.style.cursor = "";
	pencilIsClicked = false;
	showLineNames = false;
	drawGraph = false;
	G.clearGraph();
}

function reloadClicked(){
	document.body.style.cursor = "";
	pencilIsClicked = false;
	linesObjArr = [];
	showLineNames = false;
	drawGraph = false;
	G.clearGraph();
}

function mouseOver(){
	if(mouseX>0.1*windowWidth && mouseX<0.55*windowWidth && mouseY>	windowHeight-ascentText-30 && !pencilIsClicked){
		document.body.style.cursor = "pointer";
	}
	else if(!pencilIsClicked){
		document.body.style.cursor = "";
	}
	else{
		document.body.style.cursor = "none";
	}
}

function mousePressed(){
	if(mouseX>pencilIconLocation.x && mouseX<(pencilIconLocation.x+itemSize)
	 	&& mouseY>pencilIconLocation.y && mouseY<(pencilIconLocation.y+itemSize)){
		pencilClicked();
	}
	else if(mouseX>_cursorIconLocation.x && mouseX<(_cursorIconLocation.x+itemSize)
	 	&& mouseY>_cursorIconLocation.y && mouseY<(_cursorIconLocation.y+itemSize)){
		if(!lineHold)
			cursorClicked();
	}
	else if(mouseX>reloadIconLocation.x && mouseX<(reloadIconLocation.x+itemSize)
	 	&& mouseY>reloadIconLocation.y && mouseY<(reloadIconLocation.y+itemSize)){
		if(!lineHold)
			reloadClicked();
	}
	else if(mouseX>windowWidth*0.1 && mouseX<windowWidth*0.55 && pencilIsClicked && mouseY<windowHeight-ascentText-30){
		lineEvent();
	}
	else if(mouseX>0.1*windowWidth && mouseX<0.55*windowWidth && mouseY>windowHeight-ascentText-30 && !pencilIsClicked){
		doTheAlgorithm();
	}
}

function lineEvent() {
	if(!lineHold){
		lineOnHold = createVector(mouseX, mouseY);
		lineHold = true;
	}
	else{
		lineHold = false;
		linesObjArr.push(new horizontalLine(lineOnHold,createVector(mouseX,lineOnHold.y)));
	}
}

class GraphNode {
	constructor(x,y,name){
		this.x = x;
		this.y = y;
		this.name = name;
		this.edges = [];
	}
	drawNode(){
		fill(0);
		ellipse(this.x, this.y, 30, 30);
		fill(255);
		textSize(15);
		text(this.name, this.x, this.y);
	}
	updateNode(w, h, pw, ph){
		this.x *= (w/pw);
		this.y *= (h/ph);
	}
	addEdge(edgeNode){
		this.edges.push(edgeNode);
	}
}

class Graph{
	constructor(){
		this.nodes = [];
	}
	addNode(v){
		this.nodes.push(v);
	}
	drawNodes(){
		for(let i=0; i<this.nodes.length; i++){
			this.nodes[i].drawNode();
		}
	}
	updateCoordinates(w, h, pw, ph){
		for(let i=0; i<this.nodes.length; i++){
			this.nodes[i].updateNode(w, h, pw, ph);
		}
	}
	clearGraph(){
		this.nodes = [];
	}
	addEdges(name, edges){
		for(let i=0; i<this.nodes.length; i++){
			if(name == this.nodes[i].name){
				for(let j=0; j<edges.length; j++){
					for(let k=0; k<this.nodes.length; k++){
						if(edges[j]==this.nodes[k].name){
							this.nodes[i].addEdge(this.nodes[k]);
						}
					}
				}
			}
		}
	}
	drawEdges(){
		for(let i=0; i<this.nodes.length; i++){
			for(let j=0; j<this.nodes[i].edges.length; j++){
				this.drawEdge(this.nodes[i], this.nodes[i].edges[j]);
			}
		}
	}
	drawEdge(node1, node2){
		stroke(0);
		strokeWeight(1);
		line(node1.x, node1.y, node2.x, node2.y);
		noStroke();
	}
}


function createGraphNodes(N) {
	let deltaAngle = TWO_PI/N;
	let side = min(windowWidth*0.15,windowHeight*0.4);
	let initVec = createVector(side/1.41421,-side/1.41421);

	for(let i=0; i<N; i++){
		G.addNode(new GraphNode(windowWidth*0.775+initVec.x, windowHeight/2+initVec.y, linesObjArr[i].name));
		initVec.rotate(-deltaAngle);
	}
	G.drawNodes();
}


function doTheAlgorithm(){
	getSortedObjectArrayOfLines();
	showLineNames = true;
	drawGraph = true;
	createGraphNodes(linesObjArr.length);

	let a = [];
	let b = [];

	for(let i=0; i<linesObjArr.length; i++){
		let edges;
		a = checkVerticalIntersections(linesObjArr[i].x1,kVal,i);
		b = checkVerticalIntersections(linesObjArr[i].x2,kVal,i);
		
		edges = new Set(a);
		
		for(let j=0;j<b.length;j++){
			edges.add(b[j]);
		}
		
		edges = [...edges];
		G.addEdges(linesObjArr[i].name, edges);
	}

	G.drawEdges();
}

function getSortedObjectArrayOfLines(){

	linesObjArr.sort(function(a, b) {
		return a.y-b.y;
	});

	for(let i=0; i<linesObjArr.length; i++){
			linesObjArr[i].setName(i+1);
	}
}

function checkVerticalIntersections(x,k,currIndex){
	k++;
	let a = [];
	let posCurr;

	for(let i=0; i<linesObjArr.length; i++){
		if(i!=currIndex){
			if(linesObjArr[i].x1<=x && linesObjArr[i].x2>=x){
				a.push(i+1);
			}
		}
		else{
			posCurr = a.length;
		}
	}
	
	let b = [];
	let count = 0;

	for(let i=posCurr-1; i>=0; i--){
		b.push(a[i]);
		count++;
		if(count==k){
			break;
		}
	}

	count = 0;

	for(let i=posCurr;i<a.length; i++){
		b.push(a[i]);
		count++;
		if(count==k){
			break;
		}
	}

	return b;
}