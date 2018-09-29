let particles = [];
let N = 1000;
let seed;

class Particle {
	
	constructor(){
	
		this.position = createVector(random(width),random(height));
		this.speed = createVector(0,0);
		this.acceleration = createVector(0,0);
		this.prev = this.position;

	}
	
	move(){

		let perlin = noise(this.position.x/100, this.position.y/100);
		perlin = map(perlin,0,1,0,6*PI);

		this.acceleration.x = cos(perlin)*0.1;
		this.acceleration.y = sin(perlin)*0.1;
		this.prev = this.position;	
		this.position=p5.Vector.add(this.position,this.speed);
		this.speed=p5.Vector.add(this.speed,this.acceleration);
		this.speed.limit(2);

		if(this.position.x > width){
			this.position.x-=width;
			this.prev = this.position;
		}
		else if(this.position.x < 0){
			this.position.x+=width;
			this.prev = this.position;
		}


		if(this.position.y > height){
			this.position.y-=height;
			this.prev = this.position;
		}
		else if(this.position.y < 0){
			this.position.y+=height;
			this.prev = this.position;
		}

	}
	
	show(){
	
		stroke(0,5);
		strokeWeight(1);
		line(this.position.x, this.position.y, this.prev.x, this.prev.y);
	
	}
}

function setup() {
	
	createCanvas(windowWidth, windowHeight);
	background(255);
	
	for(let i=0; i<N; i++){
	
		particles.push(new Particle());
	
	}
}

function draw() {

	
	for(let i=0; i<N; i++){
	
		particles[i].show();
		particles[i].move();
	
	}
}
