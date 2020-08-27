class Pipe{
    constructor(xinitial = width){
        this.x = xinitial;
        this.width = 60;
        this.speed = 5;
        this.hole_x = random(0.2, 0.6) * height;
        this.hole_height = random(0.2, 0.3) * height;
        this.pipe_end_width = 1.5*this.width;
        this.pipe_end_height = 0.05*height;
        this.color = color(20,180,0);

        this.rectangles = [  
                                [this.x, 0, this.width, this.hole_x],
                                [this.x, this.hole_x+this.hole_height, this.width, height - this.hole_x - this.hole_height],
                                [this.x-this.pipe_end_width/2+this.width/2, this.hole_x - this.pipe_end_height, this.pipe_end_width, this.pipe_end_height],
                                [this.x-this.pipe_end_width/2+this.width/2, this.hole_x+this.hole_height, this.pipe_end_width, this.pipe_end_height]
                            ];
    }
    draw(){

        fill(this.color);
        stroke(0);
        strokeWeight(2);

        for(let i=0; i<this.rectangles.length; i++){
            let obj = this.rectangles[i];
            rect(obj[0], obj[1], obj[2], obj[3]);
        }

        fill(10,100,0);
        noStroke();
        rect(this.rectangles[0][0]+this.width*0.7, this.rectangles[0][1] + 5, this.rectangles[0][2]/5, this.rectangles[0][3] - this.pipe_end_height - 10);
        rect(this.rectangles[1][0]+this.width*0.7, this.rectangles[1][1] + this.pipe_end_height + 5, this.rectangles[1][2]/5, this.rectangles[1][3] - this.pipe_end_height - 10);
        
        this.color = color(20,180,0);
    }

    collisionDetection(A, B){

        if(A[0] < B[0] + B[2] && A[0] + A[2] > B[0] && A[1] < B[1] + B[3] && A[1] + A[3] > B[1])
            return true;
        else
            return false;
    }

    checkCollision(fishrect){
        for(let i=0; i<this.rectangles.length; i++){
            let obj = this.rectangles[i];
            if(this.collisionDetection(fishrect, obj)){
                // this.highlight();
                return true;
            }
        }
    }

    update(){
        this.x-=this.speed;

        this.rectangles = [  
                        [this.x, 0, this.width, this.hole_x],
                        [this.x, this.hole_x+this.hole_height, this.width, height - this.hole_x - this.hole_height],
                        [this.x-this.pipe_end_width/2+this.width/2, this.hole_x - this.pipe_end_height, this.pipe_end_width, this.pipe_end_height],
                        [this.x-this.pipe_end_width/2+this.width/2, this.hole_x+this.hole_height, this.pipe_end_width, this.pipe_end_height]
                    ];

    }
    outofscreen(){
        if(this.x < -(this.width + this.pipe_end_width)/2){
            return true;
        }
        return false;
    }
    highlight(){
        this.color = color(255,0,0);
    }
}
