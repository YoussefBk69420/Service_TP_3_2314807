import { Rectangle } from "./shape";

export class Birb{
    x : number = 218;
    y : number = 500;
    w : number = 44;
    h : number = 51;
    color : string = "blue";
    birbElement1 : HTMLElement;
    birbElement2 : HTMLElement;
    jumpAnimation : number = 0;
    fallingSpeed : number = 0;
    floatDelay : number = 12;

    constructor(){
        this.birbElement1 = document.querySelector("#birbgreen")!;
        this.birbElement2 = document.querySelector("#birbblue")!;
        //this.birbElement1.style.visibility = "visible";
    }

    update(keyMap : any){  
        if(this.jumpAnimation > 0){
            this.jumpAnimation = (this.jumpAnimation + 0.5) % 5;
            this.y -= 10 + 5 / (this.jumpAnimation + 1);
        }
        if(keyMap.w){
            this.y -= 15;
            this.jumpAnimation = 0.5;
            this.fallingSpeed = 0;
            this.floatDelay = 6;
        }
        else if(this.floatDelay > 0){
            this.floatDelay -= 1;
        }
        else{
            this.jumpAnimation = 0;
            this.fallingSpeed += 0.5;
            this.y += this.fallingSpeed;
        }
        if(keyMap.e){
            this.color = this.color == "green" ? "blue" : "green";
        }
    }

    moveY(n : number) : void{
        this.y += n;
    }

    draw(){
        if(this.color == "green"){
            this.birbElement1.style.visibility = "visible";
            this.birbElement2.style.visibility = "hidden";
            this.birbElement1.setAttribute("src", "/assets/images/duo_green_"+Math.min(4, Math.ceil(this.jumpAnimation))+".png");
            
            this.birbElement1.style.top = this.y + "px";
            this.birbElement1.style.left = this.x + "px";
        }
        else{
            this.birbElement2.style.visibility = "visible";
            this.birbElement1.style.visibility = "hidden";
            this.birbElement2.setAttribute("src", "/assets/images/duo_blue_"+Math.min(4, Math.ceil(this.jumpAnimation))+".png");

            this.birbElement2.style.top = this.y + "px";
            this.birbElement2.style.left = this.x + "px";
        }
    }

    hide(){
        this.birbElement1.style.visibility = "hidden";
        this.birbElement2.style.visibility = "hidden";
    }

    getHitbox() : Rectangle{
        return new Rectangle(this.color, this.x + 12, this.y + 2, this.w, this.h, true);
    }
}