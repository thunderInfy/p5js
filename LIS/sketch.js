var Arr,A,re,heig,wid,N,Indexes = [];

re = /^\[(-?\d+\,)*\d+\]$/;

function setup() {
	re.lastIndex = 0;
	Arr = select('#inputArray');
	initial();
	Arr.changed(initial);
	
}
function initial(){
	Indexes = [];
	A = Arr.value();
	var len = A.length;
	if(!re.test(A)){
		alert('Please enter the array in the specified format.');
	}

	var Req = A.split(/[\,\]\[]+/).filter(x => x);
	//console.log(Req);
	for (var i = 0; i < Req.length; i++) {
		Req[i] = parseInt(Req[i]);
	}
	//console.log(Req);
	algorithm(Req);
	Canvas = createCanvas(wid*N,heig*0.9);
}

function LowerBound(arr,val,low=0,high=arr.length){
	if(low==high){
		return low;
	}
	else{
		mid = floor((low+high)/2);
		if(val==arr[mid]){
			return mid;
		}
		else if(val<arr[mid]){
			return LowerBound(arr,val,low,mid);
		}
		else{
			return LowerBound(arr,val,mid+1,high);
		}
	}
}

function remClass(first){
	var temp = selectAll('.'+first);
	for (var i = 0; i < temp.length; i++) {
		temp[i].remove();
	}
}

function algorithm(arr){
	N = arr.length;
	try{
		remClass('Labels');
		remClass('BreakRules');	
	}
	catch(e){
		console.log(e);
	}

	var L = [],C = [], L_ind = [];
	for(var i=0;i<arr.length;i++){
		var pos = LowerBound(L,arr[i]);
		L[pos] = arr[i];
		L_ind[pos] = i;

		if(L_ind[pos-1]!=undefined)
			C[i] = L_ind[pos-1];
		else
			C[i] = -1;
	}

	var Ans = [];

	for(var i=L_ind[L_ind.length-1];C[i]!=-1;i=C[i]){
		Ans.push(arr[i]);
		Indexes.push(i);
	}
	Ans.push(arr[i]);
	Indexes.push(i);
	Ans.reverse();
	Indexes.reverse();

	var lenlis = select('#lenlis');
	lenlis.html('Length of the Longest Increasing Subsequence is '+Ans.length);

	var Pa = select('#lis');
	Pa.html('Longest Increasing Subsequence of this array is '+Ans);

	var Indlis = select('#lisin');
	Indlis.html('Indices of the array that are in its Longest Increasing Subsequence are '+Indexes);
	var q = createElement('br');
	q.class('BreakRules');

	for(var i=0;i<arr.length;i++){
		var obj = createElement('label',arr[i].toString());
		obj.size(50,50);
		obj.style('background-color','#022534');
		obj.class('Labels');
	}
	var S = selectAll('.Labels');
	for(var i=0;i<Indexes.length;i++){
		var obj = S[Indexes[i]];
		obj.style('background-color','#8f8606');
		console.log(obj.position());
		heig = obj.height;
		wid = obj.width;
	}
	
}
function draw(){
	background(255);
	stroke(0);
	strokeWeight(3);

	var x1=wid*Indexes[0]+wid/2,y1=0,y2=heig,j;
	line(x1,y1,x1,y2);
	drawArrowHead(x1);

	for(var i=1;i<Indexes.length;i++){
		x1 = x1 + wid*(Indexes[i]-Indexes[i-1]);
		line(x1,y1,x1,y2);
		drawArrowHead(x1);
	}

}
function drawArrowHead(x){
	line(x,0,x+10*wid/56,10*wid/56);
	line(x,0,x-10*wid/56,10*wid/56);
}

