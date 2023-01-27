const canvas=document.getElementById("myCanvas");
canvas.width=850;
const frameduration = 1000 / 60
const maxSpeed = 8.55
const trafficCount = 200
const trafficDistance = 100
const ctx=canvas.getContext("2d");
const road=new Road(canvas.width/2,canvas.width*0.9);
const car=new Car(road.getLaneCenter(Math.floor(road.laneCount/2)),300,78,132,"KEYS",maxSpeed);
const traffic = [
    //new Car(road.getLaneCenter(Math.floor(Math.random()*(road.laneCount))),(Math.floor(Math.random()*(-101))*100),30,60,"STATIONARYDUMMY"),
]
for (let i=0;i<trafficCount;i++){
    traffic.push(new Car(road.getLaneCenter(Math.floor(Math.random()*(road.laneCount))),(Math.floor(Math.random()*(-trafficDistance))*100),78,132,"MOVINGDUMMY",Math.floor(Math.random()*(maxSpeed+1))+1))
}
//console.log(traffic)
const img = new Image();  
img.src = './yellow.png';

const carimg = new Image();
carimg.src = './red.png';

function update(){
    var then = Date.now()
    for(let i=0;i<traffic.length;i++){
        traffic[i].update(road.borders,[]);
    }
    car.update(road.borders,traffic);
    setTimeout(update, frameduration)
}

function render(){
    canvas.height=window.innerHeight;
    ctx.save();
    ctx.translate(0,-car.y+canvas.height*0.8);
    road.draw(ctx);
    for(let i=0;i<traffic.length;i++){
        traffic[i].draw(ctx,img)
    }
    car.draw(ctx, img, traffic);
    car.draw(ctx, carimg, traffic);
    ctx.restore();
    requestAnimationFrame(render);
}

update();
render();