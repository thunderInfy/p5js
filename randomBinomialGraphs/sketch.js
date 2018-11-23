var n, nodes = [], p, edges = [];




function setup() {
	var vslider = document.getElementById("vslider");
	var vval = document.getElementById("vVal");
	vval.innerHTML = vslider.value; // Display the default slider value

	// Update the current slider value (each time you drag the slider handle)
	vslider.oninput = function() {
	    vval.innerHTML = this.value;
	  	clearGraph();
	    setupGraph(this.value,pslider.value);
	}

	var pslider = document.getElementById("pslider");
	var pval = document.getElementById("pVal");
	pval.innerHTML = pslider.value; // Display the default slider value

	// Update the current slider value (each time you drag the slider handle)
	pslider.oninput = function() {
	    pval.innerHTML = this.value;
		edges = [];
	    for(let i=0;i<n;i++){
		for(let j=i+1;j<n;j++){
			if(random(1)<pslider.value){
				edges.push(new edge(i,j));
			}
		}
		}
		show();
	}



	createCanvas(windowWidth, windowHeight);
	background(255);
	setupGraph(vslider.value, pslider.value);
}

function setupGraph(pVal,vVal){
	push();
	translate(width/2,height/2);
	let r;
	r = min(width/2,height/2)*0.7;
	let r2 = max(width/2,height/2)*0.5;
	n = pVal;
	p = vVal;
	let vec = createVector(r,0),num=1;
	vec.rotate(-PI/7);
	for(let i=0;i<n;i++,num++){
		nodes.push(new node(r2*vec.x/r,vec.y,2*r/n,num));
		vec.rotate(random(1,3));
	}

	for(let i=0;i<n;i++){
		for(let j=i+1;j<n;j++){
			if(random(1)<p){
				edges.push(new edge(i,j));
			}
		}
	}
	pop();
	show();
}

function clearGraph(){
	nodes = [];
	edges = [];
}

class node{
	constructor(x,y,r,num){
		this.label = num;
		this.x = (1+this.label)*x/n;
		this.y = (1+this.label)*y/n;
		this.r = r;
	}
	display(){
		fill(0);
		ellipse(this.x,this.y,this.r,this.r);
		textAlign(CENTER,CENTER);
		stroke(255);
		fill(255);
		textSize(this.r/2);
		text(str(this.label),this.x,this.y);
	}
}

class edge{
	constructor(i,j){
		this.i = i;
		this.j = j;
	}
	display(){
		stroke(0,0,255);
		if(n<100)
			strokeWeight(exp(-n/45));
		else if(n<200)
			strokeWeight(exp(-n/60));
		else if(n<300)
			strokeWeight(exp(-n/75));
		else if(n<400)
			strokeWeight(exp(-n/90));
		else
			strokeWeight(exp(-n/100));
		line(nodes[this.i].x,nodes[this.i].y,nodes[this.j].x,nodes[this.j].y);
	}
}

function show() {
	background(255);
	translate(width/2,height/2);
	for(let i=0;i<edges.length;i++){
		edges[i].display();
	}
	for(let i=0;i<n;i++){
		nodes[i].display();
	}
	var edgesSpan = document.getElementById("numedges");
	edgesSpan.innerHTML = edges.length;
}