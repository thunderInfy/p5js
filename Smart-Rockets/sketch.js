let life = 500;
let lifeTime = 0;
let generation = 1, genPara;
let popSize = 1000;
let mypop;
let rocketImage;
let target;
let mutationRate = 0.01;
let targetRadius = 16;
let startPos;
let play = 1;
let obstacles = [];
let imgRatio = 0.05;
let crashCount = 0;
let completeCount = 0;

function preload(){
	rocketImage = loadImage("rocketImage.png");
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	startPos = createVector(width/2,height);
	mypop = new population(startPos.x,startPos.y, popSize);
	target = createVector(width/2, height*0.1);
	// console.log("Generation : " + generation);
	obstacles.push(new obstacle(width*0.5 - width*0.3/2,height*0.5 - height*0.04/2,width*0.3,height*0.04));
	// genPara = createP();
}

function draw() {
	if(play){
		background(100);
		for(let i=0;i<obstacles.length;i++){
			obstacles[i].show();
		}
		noStroke();
		fill(255,255,0);
		ellipse(target.x, target.y, targetRadius*2, targetRadius*2);
		mypop.show();
		mypop.update();
		stroke(0);
		fill(0);
		textSize(16);
		textAlign(LEFT, TOP);
		text("Generation : " + str(generation) + "\nSuccessful count : " + str(completeCount) + "\nPopulation Count : " + str(popSize),0,0);
		noStroke();
		fill(0);
		// genPara.html("Generation : " + generation);
		lifeTime++;
		if(lifeTime>=life || mypop.allCrashedOrCompleted()){
			let genes = mypop.evaluate();
			mypop = new population(startPos.x,startPos.y, popSize,genes);
			generation++;
			// console.log("Generation : " + generation);
			lifeTime = 0;
		}
	}
	// noLoop();
}

class obstacle{
	constructor(x,y,w,h){
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h; 
	}
	show(){
		fill(255,0,0);
		rect(this.x,this.y,this.w,this.h);
	}
}

class population{

	constructor(x,y,size,genes){
		crashCount = 0;
		completeCount = 0;
		this.size = size;
		this.members = [];
		for(let i=0; i<size; i++){
			if(genes){
				this.members.push(new rocket(x,y,genes[i]));
			}
			else{
				this.members.push(new rocket(x,y));
			}
		}
	}
	allCrashedOrCompleted(){
		if(crashCount+completeCount>=popSize){
			return true;
		}
		else{
			return false;
		}
	}
	show(){
		for(let i=0; i<this.members.length; i++){
			this.members[i].show();
		}
	}
	update(){
		for(let i=0; i<this.members.length; i++){
			this.members[i].update();
		}
	}

	getNormalizedFitnessValues(){
		let fitnessValues = [];

		for(let i=0; i<this.members.length; i++){
			let temp = this.members[i].fitness();
			fitnessValues.push(temp);
		}
		
		let maxFit = max(fitnessValues);

		for(let i=0; i<fitnessValues.length; i++){
			fitnessValues[i] /= maxFit;
		}

		// console.log(maxFit);

		return fitnessValues;
	}

	getMatingPool(fitnessValues){
		let matingPool = [];	
		
		for(let i=0; i<this.members.length; i++){
			for(let j=0; j<fitnessValues[i]*popSize; j++){
				matingPool.push(this.members[i]);
			}
		}
		return matingPool;
	}

	crossover(parent1, parent2){
		let child = [];
		let crossoverPoint = random(life);

		for(let i=0; i<life; i++){
			if(i<crossoverPoint){
				child[i] = parent1[i];
			}
			else{
				child[i] = parent2[i];
			}
		}
		return child;
	}

	mutate(child){
		if(random()<mutationRate){
			for(let i=0; i<child.length; i++){
				child[i] = p5.Vector.random2D();
			}
		}
	}

	evaluate(){
		let fitnessValues = this.getNormalizedFitnessValues();
		// console.log(fitnessValues);
		let matingPool = this.getMatingPool(fitnessValues);

		let parent1, parent2, child;

		let genes = [];

		for(let i=0; i<popSize; i++){

			parent1 = random(matingPool).DNA.genes;
			parent2 = random(matingPool).DNA.genes;

			child = this.crossover(parent1, parent2);
			this.mutate(child);
			genes.push(child);
		}

		return genes;
	}
}

class dna{

	constructor(genes){
		if(genes){
			this.genes = genes;
		}
		else{
			this.genes = [];
			for(let i=0; i<life; i++){
				this.genes.push(p5.Vector.random2D());
			}
		}
	}

}

class rocket{

	constructor(x, y, genes){
		this.pos = createVector(x,y);
		this.speed = createVector();
		this.acc = createVector();
		this.crashed = false;
		this.completed = false;
		this.completedLifeTime = -1;

		if(genes){
			this.DNA = new dna(genes);
		}
		else{
			this.DNA = new dna();
		}
	}

	applyForce(){
		this.acc = this.DNA.genes[lifeTime].copy();
		// this.acc = createVector(0,-1);
	}

	update(){

		if(!this.completed && !this.crashed){
			if(dist(this.pos.x, this.pos.y, target.x, target.y) < targetRadius){
				this.completed = true;
				completeCount++;
				this.completedLifeTime = lifeTime;
			}

			for(let i=0; i<obstacles.length; i++){
				let x,y,w,h;
				x = obstacles[i].x;
				y = obstacles[i].y;
				w = obstacles[i].w;
				h = obstacles[i].h;

				if(this.pos.x > x && this.pos.x < x+w && this.pos.y > y && this.pos.y < y+h){
					this.crashed = true;
					this.completedLifeTime = lifeTime;
					crashCount++;
				}
			}

			if(this.pos.x > width || this.pos.x < 0 || this.pos.y > height || this.pos.y < 0){
				this.crashed = true;
				this.completedLifeTime = lifeTime;
				crashCount++;
			}

			if(!this.completed && !this.crashed){
				this.speed.add(this.acc);
				this.pos.add(this.speed);
				this.acc.mult(0);
				this.applyForce();
			}
		}
	}

	show(){
		push();
		let theta = this.speed.heading();
		translate(this.pos.x+cos(theta)*rocketImage.height*imgRatio/2+sin(theta)*rocketImage.width*imgRatio/2, this.pos.y-cos(theta)*rocketImage.width*imgRatio/2+sin(theta)*rocketImage.height*imgRatio/2);
		rotate(theta+PI/2);
		image(rocketImage,0,0,rocketImage.width*imgRatio,rocketImage.height*imgRatio);
		pop();
	}

	fitness(){

		let fitVal;

		if(!this.completed){
			if(dist(this.pos.x, this.pos.y, target.x, target.y) < targetRadius){
				this.completed = true;
				completeCount++;
				this.completedLifeTime = lifeTime;
			}
		}

		if(!this.crashed){
			for(let i=0; i<obstacles.length; i++){
				let x,y,w,h;
				x = obstacles[i].x;
				y = obstacles[i].y;
				w = obstacles[i].w;
				h = obstacles[i].h;

				if(this.pos.x > x && this.pos.x < x+w && this.pos.y > y && this.pos.y < y+h){
					this.crashed = true;
					this.completedLifeTime = lifeTime;
					crashCount++;
				}
			}
			if(this.pos.x > width || this.pos.x < 0 || this.pos.y > height || this.pos.y < 0){
				this.crashed = true;
				this.completedLifeTime = lifeTime;
				crashCount++;
			}
		}

		if(this.completed){
			fitVal = 1/targetRadius + 1/this.completedLifeTime;
		}
		else if(this.crashed){
			fitVal = 1/dist(target.x, target.y, this.pos.x, this.pos.y) - 1/(exp(this.completedLifeTime));
			if(fitVal<0){
				fitVal = 0;
			}
		}
		else{
			fitVal = 1/dist(target.x, target.y, this.pos.x, this.pos.y);
		}

		return fitVal;
	}
}

// function mousePressed(){
// 	play^=1;
// }
