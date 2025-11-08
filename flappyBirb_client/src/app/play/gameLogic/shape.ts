import { Path, Scaling } from "./shapeTransformation";

export class Shape{

    toRemove : boolean = false;

    constructor(public hitbox: IShape, public scaling : Scaling | null, public path : Path | null){}

    update() : void{
        if(this.path != null){
            let v = this.path.update();
            this.hitbox.setPosition(v);
        }
        if(this.scaling != null){
            let s = this.scaling.update();
            this.hitbox.scale(this.scaling.mode != "y" ? s : 1, this.scaling.mode != "x" ? s : 1);
        }
        if(this.hitbox.isOutOfMap()){
            this.toRemove = true;
        }
    }

    destroy() : void{
        this.hitbox.destroyElement();
    }

    draw(y : number) : void{
        this.hitbox.draw(y);
    }
}

export interface IShape{
    intercepts(shape : Rectangle) : boolean;
    isOutOfMap() : boolean;
    scale(nX : number, nY : number) : void;
    move(v : Vec2) : void;
    setPosition(v : Vec2) : void;
    destroyElement() : void;
    draw(y : number) : void;
}

export class Vec2{
    constructor(
        public x : number,
        public y : number
    ){}

    add(v : Vec2) : Vec2{
        return new Vec2(this.x + v.x, this.y + v.y);
    }

    sub(v : Vec2) : Vec2{
        return new Vec2(this.x - v.x, this.y - v.y);
    }

    mul(n : number) : Vec2{
        return new Vec2(this.x * n, this.y * n);
    }

    clone() : Vec2{
        return new Vec2(this.x, this.y);
    }

    length() : number{
        return Math.sqrt(this.lengthSquared());
    }

    lengthSquared() : number{
        return this.x * this.x + this.y * this.y;
    }

    normalize() : Vec2{
        let length = this.length();
        return new Vec2(this.x / length, this.y / length);
    }
}

export class Rectangle implements IShape{

    initX : number;
    initY : number;
    initW : number;
    initH : number;
    element : HTMLElement | null;

    constructor(
        public color : string,
        public x : number, 
        public y : number, 
        public w : number, 
        public h : number,
        temp ?: boolean){
            this.initX = x;
            this.initY = y;
            this.initW = w;
            this.initH = h;
            if(temp == undefined || !temp){
                this.element = document.createElement("div");
                this.element.classList.add("shape");
                document.querySelector("#game")?.appendChild(this.element);
                this.draw(-500);
            }
            else{
                this.element = null;
            }
        }

    intercepts(birb: Rectangle): boolean {
        if(birb.color == this.color) return false;
        return !(this.x >= birb.x + birb.w || birb.x >= this.x + this.w || this.y >= birb.y + birb.h || birb.y >= this.y + this.h);
    }

    isOutOfMap() : boolean{
        return this.y > 700;
    }

    move(v : Vec2) : void{
        this.initX += v.x;
        this.initY += v.y;
    }

    setPosition(v : Vec2) : void{
        this.initX = v.x;
        this.x = v.x;
        this.initY = v.y;
        this.y = v.y;
    }

    scale(nX : number, nY : number) : void{
        this.w = this.initW * nX;
        this.h = this.initH * nY;
        this.x = this.initX + this.initW / 2 - this.w / 2;
        this.y = this.initY + this.initH / 2 - this.h / 2;
    }

    draw(y : number) : void{
        if(this.element == null) return;
        this.element.style.width = this.w + "px";
        this.element.style.height = this.h + "px";
        this.element.style.backgroundColor = this.color == "green" ? "#bbe041" : (this.color == "blue" ? "#6ce6e6" : "#f2e05a");
        this.element.style.top = this.y + y + "px";
        this.element.style.left = this.x + "px";
    }

    destroyElement(): void {
        if(this.element == null) return;
        this.element.remove();
    }
}

export class Circle implements IShape{

    initR : number;
    element : HTMLElement;

    constructor(
        public color : string,
        public x : number,
        public y : number,
        public r : number
    ){
        this.initR = r;
        this.element = document.createElement("div");
        this.element.classList.add("shape");
        document.querySelector("#game")?.appendChild(this.element);
        this.draw(-500);
    }

    intercepts(birb: Rectangle): boolean {
        if(birb.color == this.color) return false;
        let closestPoint = new Vec2(this.clamp(birb.x, this.x, birb.x + birb.w), this.clamp(birb.y, this.y, birb.y + birb.h));
        return closestPoint.sub(new Vec2(this.x, this.y)).lengthSquared() < this.r * this.r;
    }

    isOutOfMap(): boolean {
        return this.y + this.r > 700;
    }

    clamp(min : number, value : number, max : number) : number{
        return value < min ? min : (value > max ? max : value);
    }

    move(v : Vec2) : void{
        this.x += v.x;
        this.y += v.y;
    }

    setPosition(v : Vec2) : void{
        this.x = v.x;
        this.y = v.y;
    }

    scale(nX : number, nY : number) : void{
        this.r = this.initR * nX;
    }

    draw(y : number) : void{
        this.element.style.borderRadius = this.r + "px";
        this.element.style.width = this.r * 2 + "px";
        this.element.style.height = this.r * 2 + "px";
        this.element.style.backgroundColor = this.color == "green" ? "#bbe041" : (this.color == "blue" ? "#6ce6e6" : "#f2e05a");
        this.element.style.top = this.y + y - this.r + "px";
        this.element.style.left = this.x - this.r + "px";
    }

    destroyElement(): void {
        this.element.remove();
    }
}