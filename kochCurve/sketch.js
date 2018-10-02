
class KochCurve{
	constructor(x,y,size){
		let a,b,c,origin;
		
		origin = createVector(x,y);
		a = createVector(x,y-size);
		b = createVector(x+size,y);
		c = createVector(x-size,y);

		var s1 = p5.Vector.sub(b, origin);
		var s2 = p5.Vector.sub(c, origin);

		angleMode(DEGREES);

		s1.rotate(30);
		s2.rotate(-30);

		b = p5.Vector.add(origin, s1);
		c = p5.Vector.add(origin, s2);

		this.lines = [];
		this.lines.push(new KochLine(a,b));
		this.lines.push(new KochLine(b,c));
		this.lines.push(new KochLine(c,a));
	}
	display(r=0,g=0,b=0){
		for(let i=0;i<this.lines.length;i++){
			this.lines[i].display(r,g,b);
		}
	}
	update(){
		let linesNew = [];

		for(let i=0;i<this.lines.length;i++){
			let res = this.lines[i].updateKochLine();
			
			for(let j=0;j<res.length;j++){
				linesNew.push(res[j]);
			}
		}

		this.lines = linesNew;
	}
}

class KochLine{
	constructor(startVec,endVec){
		this.startVec = startVec;
		this.endVec = endVec;
	}
	display(r=0,g=0,b=0){
		stroke(r,g,b);
		line(this.startVec.x, this.startVec.y, this.endVec.x, this.endVec.y);
	}
	updateKochLine(){
		let a,b,c,d,e;

		let t1,t2,t3,t4;

		t1 = p5.Vector.mult(this.startVec, 2/3);
		t2 = p5.Vector.mult(this.startVec, 1/3);
		t3 = p5.Vector.mult(this.endVec, 2/3);
		t4 = p5.Vector.mult(this.endVec, 1/3);

		a = this.startVec.copy();
		b = p5.Vector.add(t4, t1);
		d = p5.Vector.add(t3, t2);
		e = this.endVec.copy();
		c = p5.Vector.sub(d, b);

		angleMode(DEGREES);
		c.rotate(-60);
		c.add(b);

		let res = [];
		res.push(new KochLine(a,b));
		res.push(new KochLine(b,c));
		res.push(new KochLine(c,d));
		res.push(new KochLine(d,e));

		return res;
	}
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(0);
	
	let k = new KochCurve(width/2,height/2,height/2.1);
	k.display();

	let k2 = new KochCurve(width/6,2*height/5,height/4);
	k2.display();

	let k3 = new KochCurve(5*width/6,2*height/5,height/4);
	k3.display();
	
	for(let i=0;i<5;i++){
		k.update();
		k2.update();
		k3.update();
		background(54,80,177);
		k.display(255,255,255);
		k2.display(255,255,255);
		k3.display(255,255,255);
	}

}