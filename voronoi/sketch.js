var update = 0, points = [], maxdis;
function setup() {
	createCanvas(windowWidth, windowHeight);
	maxdis = sqrt(pow(windowWidth,2)+pow(windowHeight,2));
}

function draw(){
	if(update){
		update = 0;
		var N = points.length;
		var cols = [];
		for(var i=0;i<N;i++){
			cols.push(createVector(random()*255,random()*255,random()*255));
		}

		for(var i=0;i<windowWidth;i+=10){
			for(var j=0;j<windowHeight;j+=10){
				var t = createVector(i,j);		
				var distance = maxdis,site;
				for(var k=0;k<N;k++){
					var h = dist(points[k].x,points[k].y,t.x,t.y);
					if(h<distance){
						distance = h;
						site = k;
					}
				}
				stroke(cols[site].x,cols[site].y,cols[site].z);
				strokeWeight(15);
				point(t.x,t.y);
			}
		}
		stroke(0);
		strokeWeight(10);
		for(var i=0;i<points.length;i++){
			point(points[i].x,points[i].y);
		}
	}
}

function mouseClicked(){
	points.push(createVector(mouseX,mouseY));
	update = 1;
}