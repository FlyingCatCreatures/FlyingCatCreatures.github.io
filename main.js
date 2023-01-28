const carCanvas=document.getElementById("carCanvas");
carCanvas.width=850;
const networkCanvas=document.getElementById("networkCanvas");
networkCanvas.width=0;

const frameduration = 1000 / 60
const maxSpeed = 8.55
const TrafficDistance = 30
const movingTrafficDensity=0.5
const movingTrafficCount = movingTrafficDensity*TrafficDistance
const stationaryTrafficDensity = 0.5
const stationaryTrafficCount = stationaryTrafficDensity*TrafficDistance

const NeuralNetworkAdaptabillityValue = 0.2
// How much new iterations differ from previous best on a scale of 0 to 1

const carCtx=carCanvas.getContext("2d");
const networkCtx=carCanvas.getContext("2d");

const road=new Road(carCanvas.width/2,carCanvas.width*0.9);

//const car=new Car(road.getLaneCenter(Math.floor(road.laneCount/2)),-10,87,146,"KEYS",maxSpeed);

const numberOfAI=100
const cars=generateCars(numberOfAI);
let bestCar=cars[0];
if(localStorage.getItem("bestBrain")){
    for(let i=0;i<cars.length;i++){
    cars[i].brain=JSON.parse(
        localStorage.getItem("bestBrain"));
    if(i!=0){
        NeuralNetwork.mutate(cars[i].brain,0.2);
    }
    }
}

const traffic = [
]
for (let i=0;i<movingTrafficCount;i++){
    traffic.push(new Car(road.getLaneCenter(Math.floor(Math.random()*(road.laneCount))),(Math.floor(Math.random()*(-movingTrafficDistance))*100)-450,78,132,"MOVINGDUMMY",Math.floor(Math.random()*(maxSpeed+1))+1))
}
for (let i=0;i<stationaryTrafficCount;i++){
    traffic.push(new Car(road.getLaneCenter(Math.floor(Math.random()*(road.laneCount))),(Math.floor(Math.random()*(-stationaryTrafficDistance))*100)-450,78,132,"STATIONARYDUMMY"));
}
//console.log(traffic)
const trafficimg = new Image();  
trafficimg.src = './yellow.png';

const carimg = new Image();
carimg.src = './red.png'


function update(){
    var then = Date.now()
    for(let i=0;i<traffic.length;i++){
        traffic[i].update(road.borders,[]);
    }
    for(let i=0;i<cars.length;i++){
        cars[i].update(road.borders,traffic);
    }
    bestCar=cars.find(
        c=>c.y==Math.min(
            ...cars.map(c=>c.y)
        )
    );
    setTimeout(update, frameduration)
}

function render(){
    carCanvas.height=window.innerHeight;
    networkCanvas.height=window.innerHeight;
    carCtx.save();
    carCtx.translate(0,-bestCar.y+carCanvas.height*0.8);
    road.draw(carCtx);
    for(let i=0;i<traffic.length;i++){
        traffic[i].draw(carCtx,trafficimg)
    }
    for(let i=0;i<cars.length;i++){
        cars[i].draw(carCtx, carimg, traffic);
    }
    bestCar.draw(carCtx, carimg ,traffic, true)
    carCtx.restore();
    requestAnimationFrame(render);
}

function generateCars(Amount){
    const cars=[];
    for(let i=0;i<Amount;i++){
        cars.push(new Car(road.getLaneCenter(Math.floor(road.laneCount/2)),300,78,132,"AI",maxSpeed))
    }
    return cars;
}
function save(){
    localStorage.setItem("bestBrain",
        JSON.stringify(bestCar.brain));
}

function discard(){
    localStorage.removeItem("bestBrain")
}
update();
render();