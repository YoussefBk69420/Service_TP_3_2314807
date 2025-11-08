import { Vec2 } from "./shape";

export class Path{

    direction : Vec2;
    progress : number;
    length : number;

    constructor(
        public target : Vec2,
        public start : Vec2,
        public speed : number,
        public mode : string,
        initialProgress : number
    ){
        if(mode != "reverse" && mode != "toStart") throw new Error("Invalid path mode");
        if(initialProgress < 0 || initialProgress > 1) throw new Error("Initial progress must be between 0 and 1.");
        this.direction = target.sub(start).normalize();
        this.length = target.sub(start).length();
        this.progress = this.length * initialProgress;

    }

    update() : Vec2{
        if((this.speed > 0 && this.progress > this.length)
        || (this.speed < 0 && this.progress < 0)){
            switch(this.mode){
                case "reverse" :
                    this.speed = -this.speed;
                    break;
                case "toStart" :
                    this.progress = 0;
                    return this.start.sub(this.target);
            }
        }
        this.progress += this.speed;
        return this.start.add(this.direction.mul(this.progress));
    }

}

export class Scaling{

    current : number;

    constructor(
        public target : number,
        public speed : number,
        public mode : string,
        initialProgress : number
    ){
        if(mode != "x" && mode != "y" && mode != "all") throw new Error("Invalid scaling mode.");
        if(initialProgress < 0 || initialProgress > 1) throw new Error("Initial progress must be between 0 and 1 instead of " + initialProgress);
        this.current = 1 + (target - 1) * initialProgress;
    }

    update() : number{
        if(this.current > this.target || this.current < 1){
            this.speed = - this.speed;
        }
        this.current += this.speed;
        return this.current;
    }

}