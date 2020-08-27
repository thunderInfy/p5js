let a;
let state, button, slider;
let points = [];

function initialize_phi(k){
    let phi;
    phi = nj.random(k);
    phi = nj.divide(phi, nj.sum(phi));
    return phi;
}

function initialize_mu(k){
    let mu = [];
    for(let i=0; i<k; i++){
        let h = random(points);
        h.x += random(-2,2);
        h.y += random(-2,2);
        mu.push(h);
    }
    return mu;
}

function initialize_sigma(k){
    let sigma = [];

    for(let i=0; i<k; i++){
        let s;
        s = nj.random([2,2]);
        if(random()<0.5){
            s.set(1,0,s.get(0,1));    
        }
        else{
            s.set(1,0,-s.get(0,1));
            s.set(0,1,-s.get(0,1));   
        }

        s = nj.dot(s, s.transpose());

        sigma.push(s);
    }

    return sigma;
}

function gaussian(xi, mu, sigma){

    let det = sigma.get(0,0)*sigma.get(1,1) - sigma.get(0,1)*sigma.get(1,0);
    
    if(det == 0){
        sigma.set(0,0,random(pow(10,-8)));
        sigma.set(1,1,random(pow(10,-8)));
        det = sigma.get(0,0)*sigma.get(1,1) - sigma.get(0,1)*sigma.get(1,0);
    }

    let inv = nj.zeros([2,2]);

    inv.set(0,0,sigma.get(1,1));
    inv.set(0,1,-sigma.get(0,1));
    inv.set(1,0,-sigma.get(1,0));
    inv.set(1,1,sigma.get(0,0));

    inv = nj.divide(inv, det);

    let t1 = p5.Vector.sub(xi, mu);
    let t2 = nj.zeros([2,1]);
    t2.set(0, 0, t1.x);
    t2.set(1, 0, t1.y);

    let t3 = nj.dot(t2.transpose(), inv);
    t3 = nj.dot(t3, t2);
    t3 = exp(-0.5*t3.get(0,0));
    t3 = t3/TWO_PI;
    t3 = t3/sqrt(abs(det));

    return t3;
}

function expectation(phi, mu, sigma, n, k){

    let w = nj.zeros([n,k]);

    for(let i=0; i<n; i++){

        let sum = 0;

        for(let j=0; j<k; j++){

            let val;

            val = phi.get(j);

            val = val * (gaussian(points[i],mu[j], sigma[j])+pow(10,-8));

            w.set(i,j,val);

            sum+= val;
        }
        
        for(let j=0; j<k; j++){
            if(sum!=0)
                w.set(i,j, w.get(i,j)/sum);
            else
                w.set(i,j, 1/k);
        }

    }

    return w;
}

function maximization(w, mu, n){

    let phi, Mu, sigma;
    let sum;

    sum = nj.sum(w);

    phi = sum/n;

    let tmp = createVector(0,0);
    for(let i=0; i<n; i++){
        tmp.x += w.get(i)*points[i].x;
        tmp.y += w.get(i)*points[i].y;
    }

    Mu = p5.Vector.div(tmp, sum+random(pow(10,-8)));

    tmp = nj.zeros([2,2]);

    for(let i=0; i<n; i++){
        let t1 = p5.Vector.sub(points[i], mu);
        let q = nj.zeros([2,1]);
        q.set(0,0,t1.x);
        q.set(1,0,t1.y);
        t1 = nj.dot(q, q.transpose());
        t1 = nj.multiply(t1, w.get(i));
        tmp = nj.add(tmp, t1);
    }
    sigma = nj.divide(tmp, sum);

    return [phi, Mu, sigma];
}

function probs(x,y, phi, mu, sigma, n, k){
    let sum = 0;
    for(let j=0; j<k; j++){

        let val = phi.get(j);
        val = val * gaussian(createVector(x,y),mu[j], sigma[j]);
        sum += val;
    }
    return sum;
}

function interp(x1, h1, x2, h2, x){
    let m,c;
    m = (h2-h1)/(x2-x1);
    c = h2 - m*x2;
    return m*x+c;
}

function bilinear(v1,h1,v2,h2,v3,h3,v4,h4,v){
    let q1,q2,h;

    q1 = interp(v1.x, h1, v2.x, h2, v.x);
    q2 = interp(v3.x, h3, v4.x, h4, v.x);

    return interp(v1.y, q1, v3.y, q2, v.y);
}

function runEM(){


    let k = 20;
    let n = points.length;

    let phi = initialize_phi(k);
    let mu = initialize_mu(k);
    let sigma = initialize_sigma(k);


    for(let h=0;h<30;h++){

        let w = expectation(phi, mu, sigma, n, k);   

        for(let j=0; j<k; j++){
            let r = maximization(w.pick(null, j), mu[j], n);

            phi.set(j,r[0]);
            mu[j] = r[1];
            sigma[j] = r[2];
        }
    }

    loadPixels();

    let d = pixelDensity();

    let m = -1;

    let mem = [];

    let off = 16;

    for(let x=0; x<width; x+=off){
        let st = [];
        for(let y=0; y<height; y+=off){
            let heat = probs(x,y, phi, mu, sigma, n, k);
            if(m<heat){
                m = heat;
            }
            st.push(heat);
        }
        mem.push(st);
    }

    for(let x=0; x<width; x++){
        for(let y=0; y<height; y++){

            let heat;

            if(x%off==0 && y%off==0){
                let xin, yin;
                xin = floor(x/off);
                yin = floor(y/off);
                heat = mem[xin][yin]/m;
            }
            else{
                let v1,v2,v3,v4;
                let h1,h2,h3,h4;
                
                v1 = createVector(x - x%off, y - y%off);
                h1 = mem[floor(v1.x/off)][floor(v1.y/off)]/m;

                v2 = createVector(x - x%off + off, y - y%off);

                if(x - x%off + off < width)
                    h2 = mem[floor(v2.x/off)][floor(v2.y/off)]/m;
                else
                    h2 = 0;

                v3 = createVector(x - x%off, y - y%off + off);
                
                if(y - y%off + off < height)   
                    h3 = mem[floor(v3.x/off)][floor(v3.y/off)]/m;
                else
                    h3 = 0;

                v4 = createVector(x - x%off + off, y - y%off + off);
                
                if(x - x%off + off < width && y - y%off + off < height)
                    h4 = mem[floor(v4.x/off)][floor(v4.y/off)]/m;
                else
                    h4 = 0;

                heat = bilinear(v1,h1,v2,h2,v3,h3,v4,h4,createVector(x,y));
            }

            for (let i = 0; i < d; i++) {
                for (let j = 0; j < d; j++) {
                    // loop over
                    index = 4 * ((y * d + j) * width * d + (x * d + i));

                    pixels[index] = heat*255;
                    pixels[index+1] = 0;
                    pixels[index+2] = 0;
                    pixels[index+3] = 255;
                  }
            }
        }
    }


    updatePixels();

}

function changeState(){
    if(state == 0){
        button.html('Redraw');
        state = 1;
        runEM();
    }
    else{
        button.html('Run');
        state = 0;
        points = [];
        for(let i=0; i<5; i++)
            randomPoints();
        loop();
    }
}

let rand;

function randomPoints(){

    // points = [];
    if(state==0){
        let x,y;
        x = random(width);
        y = random(height);

        points.push(createVector(x, y));

        let p = noise(x,y);

        for(let i=0; i<10; i++){
            x = x+p*random(-50,50);
            y = y+p*random(-50,50);

            if(x<0){
                x*=-1;
            }
            if(x > width){
                x = 2*width - x;
            }
            if(y<0){
                y*=-1;
            }
            if(y > height){
                y = 2*height - y;
            }

            points.push(createVector(x, y));    
            p = noise(x,y);    
        }

        loop();
    }

}

function setup() {
    state = 0;
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.mousePressed(mouseCanvas);

    a = nj.array([2,3,4], 'int32');

    button = createButton('Run');
    button.position(10, 10);
    button.mousePressed(changeState);
    button.center('horizontal');

    rand = createButton('Add Random Points');
    rand.position(50,50);
    rand.mousePressed(randomPoints);
    rand.center('horizontal');

    for(let i=0; i<5; i++)
        randomPoints();
}

function draw() {

    background(255);
    for(let i=0; i<points.length; i++){
        stroke(0);
        strokeWeight(4);
        point(points[i].x, points[i].y);
    }

    noLoop();
}

function mouseCanvas(){
    if(state==0){
        points.push(createVector(mouseX, mouseY));
        loop();
    }
}
