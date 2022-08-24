const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particleArray = [];
let hue = 0;

const mouse = {
    x:null,
    y:null,
    radius:70
}

window.addEventListener('mousemove',function(event){
    mouse.x = event.x;
    mouse.y = event.y;
    //console.log(mouse.x,mouse.y);
});

ctx.fillStyle = 'white';
ctx.font = '30px serif';
ctx.fillText('VELTECH' , 13 , 40);
ctx.fillText('SQUAD :)' , 35 , 70);
const textCoordinates = ctx.getImageData(0 , 0 , 1000 , 1000);

class Particle{
    constructor(x , y){
        this.x = x;
        this.y = y;
        this.size = 2;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 30) + 1;
    }
    draw(){
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'hsl('+hue+",100%, 50%)"
        ctx.beginPath();
        ctx.arc(this.x , this.y , this.size , 0 , Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
    update(){
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx*dx + dy*dy);
        let forcedirectionX = dx/distance;
        let forcedirectionY = dy/distance;
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forcedirectionX * force * this.density;
        let directionY = forcedirectionY * force * this.density;
        if (distance < mouse.radius){
            this.x -= directionX ;
            this.y -= directionY ;
        }
        else{
            if(this.x != this.baseX){
                let dx = this.x - this.baseX;
                this.x -= dx/10;
            }
            if(this.y != this.baseY){
                let dy = this.y - this.baseY;
                this.y -=dy/10;
            }
        }
    }
}

function init(){
    particleArray = [];
    for(let y = 0 , y2 = textCoordinates.height ; y<y2 ;y++){
        for(let x=0 , x2 = textCoordinates.width ; x<x2 ; x++){
            if(textCoordinates.data[(y * 4 * textCoordinates.width) + (x * 4) + 3] > 128){
                let positionx = x;
                let positiony = y;
                particleArray.push(new Particle(positionx * 7 , positiony * 8))
            }
        }
    } 
    
}

init();

function animate(){
    ctx.clearRect(0 , 0 , canvas.width , canvas.height);
    for(let i=0 ;i <particleArray.length ;i++){
        particleArray[i].draw();
        particleArray[i].update();
        //console.log(particleArray[i]);
    }
    connect();
    hue += 15;
    requestAnimationFrame(animate);
}

animate();

function connect(){
    for(let a=0 ; a<particleArray.length ;a++){
        for(let b=a ;b<particleArray.length ; b++){
            let dx = particleArray[a].x - particleArray[b].x
            let dy = particleArray[a].y - particleArray[b].y 
            let distance = Math.sqrt(dx * dx + dy *dy);

            if(distance < 7){
                ctx.strokeStyle = 'hsl('+hue+",100%, 50%)";
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particleArray[a].x,particleArray[a].y);
                ctx.lineTo(particleArray[b].x,particleArray[b].y);
                ctx.stroke();
            } 
        }
    }
}