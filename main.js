const canvas=document.getElementById("myCanvas");
canvas.width=850;
var stop = false;
var frameCount= 0;
var results = ("#results");
var fps, fpsInterval, starTime, now, then, elapsed;
const maxSpeed = 6.55
const trafficCount = 2000
const trafficDistance = 501
const ctx=canvas.getContext("2d");
const road=new Road(canvas.width/2,canvas.width*0.9);
const car=new Car(road.getLaneCenter(Math.floor(road.laneCount/2)),300,60,120,"KEYS",maxSpeed);
const traffic = [
    //new Car(road.getLaneCenter(Math.floor(Math.random()*(road.laneCount))),(Math.floor(Math.random()*(-101))*100),30,60,"STATIONARYDUMMY"),
]
for (let i=0;i<trafficCount;i++){
    traffic.push(new Car(road.getLaneCenter(Math.floor(Math.random()*(road.laneCount))),(Math.floor(Math.random()*(-trafficDistance))*100),60,120,"MOVINGDUMMY",Math.floor(Math.random()*(maxSpeed+1))+1))
}
//console.log(traffic)
const img = new Image();  
img.src = './car.png';
img.onload = function() {
    car.draw(ctx, img, traffic);
}
car.draw(ctx, img, traffic);
function startAnimating(fps){
    fpsInterval = 1000/fps;
    then=Date.now;
    starTime = then;
    animate();
}




function animate(){
    requestAnimationFrame(animate);
<<<<<<< Updated upstream
    now = Date.now();
    elapsed = now - then;
    if (elapsed > fpsinterval) {
        then = now - (elapsed % fpsInterval);
=======
    now=Date.now();
    elapsed=now-then;
    if(elapsed>fpsInterval){
        then=now-(elapsed%fpsInterval);
>>>>>>> Stashed changes
        for(let i=0;i<traffic.length;i++){
            traffic[i].update(road.borders,[]);
        }
        car.update(road.borders,traffic);
        canvas.height=window.innerHeight;
<<<<<<< Updated upstream
    
=======

>>>>>>> Stashed changes
        ctx.save();
        ctx.translate(0,-car.y+canvas.height*0.8);
        road.draw(ctx);
        for(let i=0;i<traffic.length;i++){
            traffic[i].draw(ctx,img)
        }
        car.draw(ctx, img, traffic);
        ctx.restore();
<<<<<<< Updated upstream
    }
=======
        requestAnimationFrame(animate);
    }   
>>>>>>> Stashed changes
}
