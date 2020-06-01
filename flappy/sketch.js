let bird, earth;

function setup(){
    createCanvas(windowWidth, windowHeight);
    background(0);
    bird = new Bird();
    earth = new Earth();
}

function draw(){
    background(0);
    bird.draw();
    earth.appliesgravity(bird);

    if(keyIsDown(32)){
        bird.wantstogoup();
    }

    bird.updateVelocity();
    bird.updatePosition();
    bird.beinlimit();
}
