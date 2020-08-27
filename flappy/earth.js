class Earth{
    constructor(){
        this.gravity = 0.3;
    }
    appliesgravity(fish){
        fish.force = this.gravity;
    }
}
