import { Barrier, ColorBarrier, ScalingCircles, ScrollingColorBarrier, ScrollingShapes } from "./barrier";
import { Birb } from "./birb";
import { Rectangle } from "./shape";

export class Game{

    interval : any = null;
    score : number = 0;
    time : number = 0;
    scoreElement : HTMLElement;
    birb : Birb;
    nextGapY : number = 400;
    barriers : Barrier[] = [];

    keyMap = {
        w : false,
        e : false
    };
    gameIsLaunched : boolean = false;

    constructor(){
        this.birb = new Birb();
        this.scoreElement = document.querySelector("#score")!;
        
        document.addEventListener("keydown", this.keyDown.bind(this));
        document.addEventListener("keyup", this.keyUp.bind(this));
    }

    play(){
        let startMsg : HTMLElement = document.querySelector("#startMsg")!;
        startMsg.style.visibility = "hidden";
        this.interval = setInterval(this.update.bind(this), 20);
        this.barriers.push(new ScrollingShapes(this.score + 1));
    }

    stop(){
        clearInterval(this.interval);
        let scorePanel : HTMLElement = document.querySelector("#darkScreen")!;
        scorePanel.style.visibility = "visible";
        sessionStorage.setItem("score", JSON.stringify(this.score));
        sessionStorage.setItem("time", JSON.stringify(this.time));
        let displayScore : HTMLElement = document.querySelector("#lastScore")!;
        displayScore.textContent = "Score : " + this.score;

        let reaction : HTMLElement = document.querySelector("#reaction")!;
        reaction.setAttribute("src", "/assets/images/"+(this.score > 100 ? "very_happy" : (this.score > 50 ? "happy" : (this.score > 10 ? "sad" : "angry")))+".png");

        this.score = 0;
        this.time = 0;
        this.scoreElement.textContent = this.score + "";
        document.removeEventListener("keydown", this.keyDown.bind(this));
        document.removeEventListener("keyup", this.keyUp.bind(this));
    }

    prepareGame(){
        let startMsg : HTMLElement = document.querySelector("#startMsg")!;
        startMsg.style.visibility = "visible";
        let scorePanel : HTMLElement = document.querySelector("#darkScreen")!;
        scorePanel.style.visibility = "hidden";
        for(let b of this.barriers){
            b.destroy();
        }
        this.barriers = [];
        this.score = 0;
        this.time = 0;
        this.nextGapY = 400;
        this.birb = new Birb();
        this.birb.hide();
        this.gameIsLaunched = false;
        
        document.addEventListener("keydown", this.keyDown.bind(this));
        document.addEventListener("keyup", this.keyUp.bind(this));
    }

    update(){
        this.birb.update(this.keyMap);
        this.time += 0.02;

        let yProgress = Math.max(0, 350 - this.birb.y);
        this.birb.moveY(yProgress);

        let birbHitbox : Rectangle = this.birb.getHitbox();
        for(let i = this.barriers.length - 1; i >= 0; i--){
            this.barriers[i].update(yProgress);
            if(this.barriers[i].intercepts(birbHitbox)) this.stop();
            if(this.barriers[i].isOutOfMap()){
                this.score += 1;
                this.barriers[i].destroy();
                this.barriers.splice(i, 1);
            }
        }
        this.prepareNextBarrier();
        this.keyMap.e = false;
        this.keyMap.w = false;
        if(this.birb.y >= 690){
            this.stop();
        }
        this.draw();
    }

    prepareNextBarrier() : void{
        if(this.barriers[this.barriers.length - 1].getY() - this.nextGapY > 0){
            let r = Math.floor(Math.random() * 4);
            switch(r){
                case 0 : this.barriers.push(new ScrollingShapes(this.score)); break;
                case 1 : this.barriers.push(new ScalingCircles(this.score)); break;
                case 2 : this.barriers.push(new ColorBarrier()); break;
                case 3 : this.barriers.push(new ScrollingColorBarrier(this.score)); break;
            }
            this.nextGapY = 350 - Math.min(100, Math.ceil(Math.random() * 10 + this.score / 10));
        }
    }

    draw(){
        this.scoreElement.textContent = this.score + "";
        this.birb.draw();
        for(let b of this.barriers){
            b.draw();
        }
    }

    keyDown(e : KeyboardEvent){

        let key = e.key;

        if(key == "e" || key == "w"){
            this.keyMap[key] = true;
        }
        else if(key != "F12"){
            e.preventDefault(); 
        }

        if(!this.gameIsLaunched && this.keyMap.w && this.keyMap.e){
            this.gameIsLaunched = true;
            this.play();
        }
    }

    keyUp(e : KeyboardEvent){
        let key = e.key;
        if(key == "e" || key == "w"){
            this.keyMap[key] = false;
        }
        else if(key != "F12"){
            e.preventDefault(); 
        }
    }
}