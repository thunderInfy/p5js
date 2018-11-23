var m,n,inp1,inp2;
//var inpArray;
function setup() {
	// createCanvas(1,1);
	// createElement('br');
	// frameRate(1);

	noCanvas();
	setPara();
	inp1.changed(setPara);
	inp2.changed(setPara);
	var Run = select('#button1');
	Run.mousePressed(algorithm);

	// Run.size(200,100);
	// var S = selectAll('.Labels');
	// for(var i=0;i<S.length;i++){
	// 	S[i].mouseOver(highlight);
	// 	S[i].mouseOut(unhighlight);
	// 	//S[i].mouseClicked(clicked);
	// 	//console.log(S[i].value());
	// }

	// rect(0,0,10,10);
	//algorithm();
}
function remClass(first){
	var temp = selectAll('.'+first);
	for (var i = 0; i < temp.length; i++) {
		temp[i].remove();
	}
}
function setPara(){
	try{
		remClass('Labels');
		remClass('BreakRules');	
	}
	catch(e){
		console.log(e);
	}
	initialize();
	// var xOffsetIncrement = 2;
	// var yOffsetIncrement = 2;

	if(m<=30 && n<=30){

		var totWidth = windowWidth*0.6;
		var totHeight = windowHeight*0.6;

		if(totWidth>totHeight){
			totHeight = totWidth;
		}
		else{
			totWidth = totHeight;
		}

		if(totHeight<0){
			console.log("Negative Height!!!!!");
		}

		var eachWidth = floor(totWidth/(n));
		var eachHeight = floor(totHeight/(m));
		var holder = select('#labelHolder');

		for(var i=0;i<m;i++){
			for(var j=0;j<n;j++){
				var inp = createInput(floor(random(-100,101)).toString());
				//inp.position(j*eachWidth+xOffset,i*eachHeight+yOffset);
				inp.size(eachWidth,eachHeight);

				//CSS for inp
				inp.style('font-size',min(eachHeight,eachWidth)*0.6+'px');
				//inp.mouseOver(highlight);
				//inp.mouseOut(unhighlight);


				inp.class("Labels");			
				//inpArray.push(inp);
				inp.parent(holder);
			}
			var breakRule = createElement('br');
			breakRule.class("BreakRules");
			breakRule.parent(holder);
		}
		algorithm();
	}	
}
// function draw(){
// 	console.log(mouseX,mouseY,windowWidth*0.5,windowWidth*0.5/n);
// }
function initialize(){
	inp1 = select('#inp1');
	inp2 = select('#inp2');

	m = parseInt(inp1.value());
	n = parseInt(inp2.value());

	if(m>30 || n>30){
		document.location.reload(true);
	}
	//inpArray = [];
}
function highlight(){
	this.style('background-color','#008a8a');
	this.style('color','#000');
}
function unhighlight(){
	this.style('background-color','#043221');
	this.style('color','#FFF');
}

var L,parameters;

function algorithm(){
	var S = selectAll('.Labels');
	L = [];
	while(S.length){
		L.push(S.splice(0,n));
	}
	var V = [],row = [];
	for(var i=0;i<m;i++){
		row = [];
		for(var j=0;j<n;j++){
			row.push(parseInt(L[i][j].value()));
		}
		V.push(row);
	}
	for(var i=0;i<m;i++){
		for(var j=0;j<n;j++){
			if(i>0){
				V[i][j]+=V[i-1][j];
			}
			if(j>0){
				V[i][j]+=V[i][j-1];
			}
			if(i>0 && j>0){
				V[i][j]-=V[i-1][j-1];
			}
		}
	}
	var maxSum =  Number.MIN_SAFE_INTEGER;	//lowest value possible
	parameters = {
		i:0,
		j:0,
		k:m-1,
		l:n-1
	};
	var sum;
	for(var i=0;i<m;i++){
		for(var j=0;j<n;j++){
			for(var k=i;k<m;k++){
				for(var l=j;l<n;l++){
					sum = V[k][l];
					if(i>0){
						sum-=V[i-1][l];
					}
					if(j>0){
						sum-=V[k][j-1];
					}
					if(i>0 && j>0){
						sum+=V[i-1][j-1];
					}
					if(sum>maxSum){
						maxSum = sum;
						parameters.i = i;
						parameters.j = j;
						parameters.k = k;
						parameters.l = l;
					}
				}
			}
		}
	}
	displayResult(maxSum);
}

function highlight2(){
	this.style('background-color','#FFF');
	this.style('color','#000');
}
function unhighlight2(){
	this.style('background-color','#563d7c');
	this.style('color','#FFF');
}



function displayResult(maxSum){
	var lab = select('#maxSumLabel');
	lab.html(maxSum.toString());
	for(var i=0;i<m;i++){
		for(var j=0;j<n;j++){
			console.log('here');
			if(i>=parameters.i && i<=parameters.k && j>=parameters.j && j<=parameters.l)
				{	
					L[i][j].style('background-color','#563d7c');
					L[i][j].mouseOver(highlight2);
					L[i][j].mouseOut(unhighlight2);
				}
			else{
					L[i][j].style('background-color','#043221');
					L[i][j].mouseOver(highlight);
					L[i][j].mouseOut(unhighlight);
				}
		}
	}
	console.log(parameters);
}
