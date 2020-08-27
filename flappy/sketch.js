let fish, earth, pipes, bubbles;
let song;
let fish_img;
let score = 0;
let change = true;
let xlow, xhigh;
let Button = null;

function preload(){
    fish_img = createImg('fish.gif');
    song = loadSound('ocean.mp3');
}

function setup(){
    createCanvas(windowWidth, windowHeight);
    background(50,80,200);
    fish = new Fish(fish_img);
    earth = new Earth();
    pipes = [];
    bubbles = [];
}

function draw(){

    if (!song.isPlaying()){
        song.play();
        song.setVolume(0.1);
    }

    if(frameCount%100 == 10){
        pipes.push(new Pipe());
    }

    if(frameCount%500 == 10){
        fish.maxvel += 5;
    }

    if(frameCount%4 == 3){
        bubbles.push(new Bubble());
    }

    background(50,80,200);
    for(let i=0; i<pipes.length; i++){
        pipes[i].draw();
    }
    for(let i=0; i<bubbles.length; i++){
        bubbles[i].draw();
    }

    fish.draw();
    dealWithScore();

    if(fish.checkCollision(pipes)){
        noLoop();
        song.stop();

        fill(0);
        textSize(32);
        textAlign(CENTER, CENTER);
        text("Game Over",width/2,height*0.4);
        
        if(Button == null)
            Button = createButton("Press to restart");
        else
            Button.show();

        Button.style('font-size',32/1.5 + 'px');
        Button.style('display', 'block');
        Button.style('background-color','black');
        Button.style('border','None');
        Button.style('color','white');
        Button.size(width/3,height/10);
        Button.position(width/3,height*0.6);
        Button.mousePressed(restart);
    }

    earth.appliesgravity(fish);

    if(keyIsDown(32) || mouseIsPressed){
        fish.wantstogoup();
    }

    fish.update();
    for(let i=0; i<pipes.length; i++){
        pipes[i].update();
        if(pipes[i].outofscreen()){
            pipes.splice(i,1);
            i--;
        }
    }

    for(let i=0; i<bubbles.length; i++){
        bubbles[i].update();
        if(bubbles[i].outofscreen()){
            bubbles.splice(i,1);
            i--;
        }
    }
}

function dealWithScore(){

    noStroke();
    fill(0);
    textSize(32);
    textAlign(LEFT, TOP);
    text('Score: ' + score,10,10);
    stroke(0);

    xlow = fish.pos.x - fish.param_size*1.5;
    if(pipes.length)
        xhigh = pipes[0].x+(pipes[0].width + pipes[0].pipe_end_width)/2;

    if(change){
        if(xhigh < xlow){
            score++;
            change = false;
        }
    }
    else{
        if(xhigh > xlow){
            change = true;
        }
    }
}


function restart(){
    Button.hide();
    background(50,80,200);
    pipes = [];
    bubbles = [];
    score = 0;
    change = true;

    fish.pos.x = fish.xinitial;
    fish.pos.y = fish.yinitial;
    fish.vel = 0;
    fish.force = 10;

    loop();
}

