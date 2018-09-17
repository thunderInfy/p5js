var angle = 0, SHOW = 1;
function setup() {
	createCanvas(windowWidth, windowHeight, WEBGL);
}

function mousePressed(){
	SHOW^=1;
}

function draw(){
	if(SHOW){
		background(200);
		noStroke();
		
		push();
			ambientMaterial(255);
			directionalLight(255,0,0,0,0,-1);
			rotateX(angle);
			rotateY(angle);
			rotateZ(angle);
			translate(70,0,0);
			sphere(100);
		pop();

		push();
			ambientMaterial(255);
			rotateX(angle);
			rotateY(angle);
			rotateZ(angle);
			translate(0,70,0);
			sphere(100);
			translate(0,0,70);
			sphere(100);
			angle+=0.07;
		pop();
	}
}
