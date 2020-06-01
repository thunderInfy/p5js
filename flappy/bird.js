class Bird{
    constructor(){
        this.pos = createVector(width*0.1,height/2);
        this.rad = 15;
        this.vel = 0;
        this.force = 0;
        this.upForce = 1.2;
    }
    draw(){
        fill(255);
        ellipse(this.pos.x,this.pos.y,2*this.rad,2*this.rad);
    }
    wantstogoup(){
         this.force-=this.upForce;
    }
    updateVelocity(){
         this.vel += this.force;
    }
    updatePosition(){
        this.pos.y += this.vel;
    }
    beinlimit(){
        let limits = {
            up:this.rad,
            down:height-this.rad
        }
        if(this.pos.y < limits.up){
            this.pos.y = limits.up;
            this.vel *= -0.5;
        }
        if(this.pos.y > limits.down){
            this.pos.y = limits.down;
            this.vel *= -0.5;
        }
    }
}
