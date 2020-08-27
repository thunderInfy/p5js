class Fish{
    constructor(lookslike, xinitial = width*0.15, yinitial = height/2){
        this.xinitial = xinitial;
        this.yinitial = yinitial;
        this.pos = createVector(this.xinitial, this.yinitial);
        this.param_size = 30;
        this.vel = 0;
        this.force = 10;
        this.upForce = 1.3;
        this.e = 0;
        this.maxvel = 10;
        this.ilooklikethis = lookslike;
    }
    draw(){
        
        this.ilooklikethis.position(this.pos.x - this.param_size*1.5, this.pos.y - this.param_size);
        this.ilooklikethis.size(this.param_size*3, this.param_size*2);

        fill(255);

        if(false){
            let tlcx, tlcy, w, h;
            w = this.param_size*3*0.7;
            h = this.param_size*2*0.7;
            tlcx = this.pos.x - w/2 + 10;
            tlcy = this.pos.y - 3 - h/2 + 10;
            rect(tlcx,tlcy,w,h);
        }
    }
    update(){
        this.updateVelocity();
        this.updatePosition();
        this.beinlimit();
    }
    wantstogoup(){
         this.force-=this.upForce;
    }
    updateVelocity(){
        this.vel += this.force;
        
        if(this.vel > this.maxvel)
            this.vel = this.maxvel;
        else if(this.vel < -this.maxvel){
            this.vel = -this.maxvel;
        }
    }
    updatePosition(){
        this.pos.y += this.vel;
    }
    beinlimit(){
        let limits = {
            up:this.param_size,
            down:height-this.param_size
        }
        if(this.pos.y < limits.up){
            this.pos.y = limits.up;
            this.vel *= -this.e;
        }
        if(this.pos.y > limits.down){
            this.pos.y = limits.down;
            this.vel *= -this.e;
        }
    }
    checkCollision(pipes){
        let pipe;
        for(pipe of pipes){

            let tlcx, tlcy, w, h;
            w = this.param_size*3*0.7;
            h = this.param_size*2*0.7;
            tlcx = this.pos.x - w/2 + 10;
            tlcy = this.pos.y - 3 - h/2 + 10;

            let fishrect = [tlcx, tlcy, w, h];
            if(pipe.checkCollision(fishrect))
                return true;
        }
        return false;
    }
}
