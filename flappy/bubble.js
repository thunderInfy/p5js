class Bubble{
    constructor(){
        this.pos = createVector(random(windowWidth), windowHeight);
        this.dia = random(30,80);
        this.speed = random(5,15);
    }
    draw(){
        noStroke();
        fill(200,200,255, 100);
        ellipse(this.pos.x, this.pos.y, this.dia, this.dia);
    }
    update(){
        this.pos.y -= this.speed;
    }
    outofscreen(){
        if(this.pos.y < -this.dia)
            return true;
        return false;
    }
}
