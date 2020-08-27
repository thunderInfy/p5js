let s,g,t,p,N=4;


class State{
	constructor(){
		
		this.arr = [];
		this.initialise_arr();

		let num_swaps = floor((N*N)/2);

		if(num_swaps%2==1){
			num_swaps+=1;
		}

		for(let i=0; i<num_swaps; i++){
			this.random_swap();
		}
	}

	initialise_arr(){
		for(let i=0; i<N; i++){
			this.arr[i] = [];
			for(let j=0; j<N; j++){
				this.arr[i][j] = N*i + j + 1;
			}
		}
		this.arr[N-1][N-1] = -1;
	}

	random_swap(){

		let u,v;
		u = floor(random(N*N-1));
		v = floor(random(N*N-1));

		while(u==v){
			v = floor(random(N*N-1));			
		}

		let temp;
		let u_vec = createVector(floor(u/N),u%N);
		let v_vec = createVector(floor(v/N),v%N);
		
		this.swap_elements_arr(u_vec, v_vec);
	}

	swap_elements_arr(u_vec, v_vec){

		let temp = this.arr[u_vec.x][u_vec.y];
		this.arr[u_vec.x][u_vec.y] = this.arr[v_vec.x][v_vec.y];
		this.arr[v_vec.x][v_vec.y] = temp;
	
	}

	print_arr(){

		for(let i=0; i<N; i++){
			for(let j=0; j<N; j++){
				print(this.arr[i][j] + "\t");
			}
			print("\n");
		}

	}
	check_goal_state(){

		let flag = 1;

		for(let i=0; i<N; i++){
			for(let j=0; j<N; j++){
				if(!(i==N-1 && j==N-1)){
					if(this.arr[i][j] != N*i + j + 1){
						flag = 0;
						break;
					}
				}
			}
			if(flag==0)
				break;
		}

		if(flag==1){
			noStroke();
			fill(255);
			textAlign(CENTER,CENTER);
			textSize(20);
			text("Congratulations!",width/2, 9*height/10);
		}
	}
}

class Cell{
	constructor(i,j,val,edge){
		this.a = edge;
		this.vec = createVector(0,0);
		this.initialise_vec(i,j);
		this.val = val;
	}
	initialise_vec(i,j){
		this.vec.x = (this.a)*j-(N-1)*(this.a)/2;
		this.vec.y = (this.a)*i-(N-1)*(this.a)/2;
	}
	display(){
		
		if(this.val != -1){
			stroke(40);
			strokeWeight(3);
			fill(255);
			rect(this.vec.x, this.vec.y,this.a, this.a);
			
			textSize(32*this.a/122.5);
			noStroke();
			fill(0);
			text(this.val,this.vec.x,this.vec.y);
		}
		else{
			stroke(40);
			strokeWeight(3);
			fill(40);
			rect(this.vec.x, this.vec.y,this.a, this.a);
		}
	}
}

class GUI{
	constructor(){
		this.cell_edge_size = min(width/6, height/6);
		this.arr = [];
		this.initialise_arr();
		this.blank_vec = createVector(N-1,N-1);
	}
	show_num_moves(){
		textSize(20);
		noStroke();
		fill(255);
		textAlign(LEFT,TOP);
		text("#Moves: "+p.num_moves,10,10);
	}
	initialise_arr(){
		for(let i=0; i<N; i++){
			this.arr[i] = [];
			for(let j=0; j<N; j++){
				this.arr[i][j] = new Cell(i,j,s.arr[i][j],this.cell_edge_size);
			}
		}
	}
	display(){
		push();
		background(0);
		translate(width/2, height/2);
		rectMode(CENTER);
		stroke(40);
		strokeWeight(3);
		fill(40);
		rect(0,0,N*this.cell_edge_size,N*this.cell_edge_size);
		textAlign(CENTER,CENTER);
		for(let i=0; i<N; i++){
			for(let j=0; j<N; j++){
				this.arr[i][j].display();
			}
		}
		pop();
		this.show_num_moves();
		s.check_goal_state();
	}
	get_cell_index(vec){
		let cell_indices =  t.swap_x_y(t.floor(p5.Vector.div(vec, this.cell_edge_size)));

		if(cell_indices.x>(N-1) || cell_indices.x<0 || cell_indices.y>(N-1) || cell_indices.y<0){
			cell_indices.x = -1;
			cell_indices.y = -1;
		}

		return cell_indices;
	}
	translate(vec){
		let delta = p5.Vector.sub(vec,this.blank_vec);
		if((abs(delta.x)==1 && delta.y==0) || (delta.x==0 && abs(delta.y)==1)){
	
			let cell_to_move = this.arr[vec.x][vec.y];
			let cell_blank = this.arr[this.blank_vec.x][this.blank_vec.y];

			let temp = cell_to_move.x;
			cell_to_move.x = cell_blank.x;
			cell_blank.x = temp;

			temp = cell_to_move.y;
			cell_to_move.y = cell_blank.y;
			cell_blank.y = temp;

			temp = cell_to_move.val;
			cell_to_move.val = cell_blank.val;
			cell_blank.val = temp;

			temp = s.arr[vec.x][vec.y];
			s.arr[vec.x][vec.y] = s.arr[this.blank_vec.x][this.blank_vec.y];
			s.arr[this.blank_vec.x][this.blank_vec.y] = temp;

			this.update_blank(vec);
			p.num_moves += 1;
			this.display();
		}
	}
	update_blank(vec){
		this.blank_vec.x = vec.x;
		this.blank_vec.y = vec.y;
	}
}

class VectorOps{
	constructor(){

	}
	translate(v1,v2){
		//translates a vector v1 supposing that the new origin is at v2
		v1.sub(v2);
	}
	floor(vec){
		vec.x = floor(vec.x);
		vec.y = floor(vec.y);
		return vec; 
	}
	swap_x_y(vec){
		let temp = vec.x;
		vec.x = vec.y;
		vec.y = temp;
		return vec;
	}
}

class PlayerData{
	constructor(){
		this.num_moves = 0;
	}
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	s = new State();
	g = new GUI();
	t = new VectorOps();
	p = new PlayerData();
	g.display();
}

function mousePressed() {

	let mouse_vec = createVector(mouseX, mouseY);
	let new_origin = createVector(width/2-(N/2)*g.cell_edge_size, height/2-(N/2)*g.cell_edge_size);
	t.translate(mouse_vec, new_origin);
	let cell_pos = g.get_cell_index(mouse_vec);
	if(!cell_pos.equals(-1,-1)){
		g.translate(cell_pos);
	}
}