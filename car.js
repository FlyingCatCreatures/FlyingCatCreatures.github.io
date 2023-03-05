class Car{
    constructor(x,y,width,height,controlType,maxSpeed=4.55,drawStyle="image"){
        this.x=x;
        this.y=y;
        this.startPosX=this.x
        this.width=width;
        this.height=height;

        this.speed=0;
        this.acceleration=0.2;
        this.maxSpeed=maxSpeed;
        this.friction=0.05;
        this.angle=0
        this.damaged=false
        this.controlType=controlType
        this.drawStyle=drawStyle
        this.useBrain=controlType=="AI";

        if(this.controlType=="KEYS" || this.controlType=="AI"){
            this.sensor=new Sensor(this);
            this.brain=new NeuralNetwork(
                [this.sensor.rayCount+4,10,6,4],
            );
        };
        this.controls=new Controls(controlType);
        this.producePolygon()
    }

    update(roadBorders, traffic, KillBarrier){
        if(this.y>KillBarrier){
            this.damaged=true
        }
        if(!this.damaged){
            if(this.controlType=="AI" || this.controlType=="KEYS" || this.controlType=="MOVINGDUMMY"){
                this.#move();
            }
            this.polygon=this.#createPolygon();
            if(this.controlType=="AI" || this.controlType=="KEYS"){
                this.damaged=this.#assessDamage(roadBorders, traffic);
            }
        }
        if(this.sensor){
            this.sensor.update(roadBorders, traffic);
            const offsets=this.sensor.readings.map(
                s=>s==null?0:1-s.offset
            );
            var InputsToNetwork=offsets
            InputsToNetwork.push(this.angle)
            InputsToNetwork.push(this.speed)
            InputsToNetwork.push(this.width)
            InputsToNetwork.push(this.height)

            const outputs=NeuralNetwork.feedForward(InputsToNetwork,this.brain);
            if(this.useBrain){
                this.controls.forward=outputs[0];
                this.controls.left=outputs[1];
                this.controls.right=outputs[2];
                this.controls.reverse=outputs[3];
            }
        }
        //console.table(this.speed,this.y,this.x, this.angle)
        }  

    producePolygon(){
        this.polygon=this.#createPolygon();
    }


    #assessDamage(roadBorders, traffic){
        for(let i=0;i<roadBorders.length;i++){
            if(polysIntersect(this.polygon,roadBorders[i])){
                return true
            }
        }
        for(let j=0;j<traffic.length;j++){
            for(let k=0;k<cars.length;k++){
                if(cars[k].y<0 && traffic[j].y<0){
                    const checkingYcar=-cars[k].y
                    const checkingYtraffic=-traffic[j].y
                    const DifferenceInY= checkingYtraffic-checkingYcar;
                    if ((DifferenceInY)<(200) && DifferenceInY>-(200))
                        for(let i=0;i<traffic.length;i++){
                            if(polysIntersect(this.polygon,traffic[i].polygon)){
                                return true
                        }
                    
                    }
                }
            }
        }
        return false 
    }

    #createPolygon(){
        const points=[];
        const rad = Math.hypot(this.width,this.height)/2;
        const alpha = Math.atan2(this.width,this.height)
        points.push({
            x:this.x-Math.sin(this.angle-alpha)*rad,
            y:this.y-Math.cos(this.angle-alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(this.angle+alpha)*rad,
            y:this.y-Math.cos(this.angle+alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle-alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle-alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle+alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle+alpha)*rad
        });
        return points;
    }






    #move(){
        if(this.controls.forward){
            this.speed=this.speed + this.acceleration;
        }
        if(this.controls.reverse){
            this.speed-=this.acceleration;
        }


        if(this.speed>this.maxSpeed){
            this.speed=this.maxSpeed;
        }
        if(this.speed<-this.maxSpeed/1.5){
            this.speed=-this.maxSpeed/1.5;
        }

        if(this.speed>0){
            this.speed-=this.friction;
        }
        if(this.speed<0){
            this.speed+=this.friction;
        }
        if(Math.abs(this.speed)<this.friction){
            this.speed=0;
        }
        if(this.speed!=0){
            const flip=this.speed>0?1:-1;
        
            if(this.controls.right){
                this.angle-=0.03*flip;
            }
            if(this.controls.left){
                this.angle+=0.03*flip;
            }
        this.x-=Math.sin(this.angle)*this.speed;
        this.y-=Math.cos(this.angle)*this.speed;
        }
    }


    draw(ctx, img, traffic,drawSensor=false){
        if(this.controlType=="KEYS" || this.controlType=="AI"){
            this.sensor.update(road.borders, traffic);
            if(drawSensor){
                this.sensor.draw(ctx);
            }
        };
        if(this.drawStyle=="image"){
            ctx.save();
            ctx.translate(this.x,this.y);
            ctx.rotate(-this.angle);
            ctx.globalCompositeOperation = "source-over";
            ctx.drawImage(
                img, 
                -this.width/2, 
                -this.height/2, 
                this.width, 
                this.height
        );
            ctx.restore();
        }else{
            ctx.beginPath();
            ctx.moveTo(this.polygon[0].x,this.polygon[0].y);
            for(let i=1;i<this.polygon.length;i++){
                ctx.lineTo(this.polygon[i].x,this.polygon[i].y);
            }
            ctx.fill();
        }
        

    }
    
}