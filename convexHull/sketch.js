var cnv, points, cnvRows = 10, cnvCols = 10;
function setup() {
	var ratio = 0.75;
	var ratioX = 0.85;
	//adding canvas
	cnv = createCanvas(windowWidth*ratioX, windowHeight*ratio);
	cnv.position(0,windowHeight*(1-ratio)/2);
	background(230);

	preparePoints();

	//adding buttons
	var jarvis, sudo, graham;
	jarvis = createButton('Jarvis March');
	jarvis.addClass('buttons');
	sudo = createButton('A new approach');
	sudo.addClass('buttons');
	graham = createButton('Graham Scan');
	graham.addClass('buttons');
	var buttonWidth = jarvis.size().width;
	jarvis.position(0,windowHeight*(1+ratio)/2);
	sudo.position(buttonWidth,windowHeight*(1+ratio)/2);
	graham.position(buttonWidth*2,windowHeight*(1+ratio)/2);
	jarvis.mouseOver(highlight);
	sudo.mouseOver(highlight);
	graham.mouseOver(highlight);
	jarvis.mouseOut(unhighlight);
	sudo.mouseOut(unhighlight);
	graham.mouseOut(unhighlight);
	cnv.mousePressed(addPoints);

	
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
	strokeWeight(4);
	var x = mouseX;
	var y = mouseY;
	var P = point(x,y);
	var temp;
	var cnvDivision = getDiv(x,y);
	points[cnvDivision[0]][cnvDivision[1]].push(x,y);
}

function getDiv(x,y){
	var sizeObj = cnv.size();
	var cnvWidth = sizeObj.width;
	var cnvHeight = sizeObj.height;
	var col = floor(map(x,0,cnvWidth,0,cnvCols));
	var row = floor(map(y,0,cnvHeight,0,cnvRows));
	console.log(row,col);
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




