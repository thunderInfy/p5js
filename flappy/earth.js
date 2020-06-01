class Earth{
    constructor(){
        this.gravity = 0.3;
    }
    appliesgravity(bird){
        bird.force = this.gravity;
    }
}
