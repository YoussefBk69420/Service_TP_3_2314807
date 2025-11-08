import { Circle, IShape, Rectangle, Shape, Vec2 } from "./shape";
import { Path, Scaling } from "./shapeTransformation";

export abstract class Barrier{

    y : number = 0;
    height : number;
    shapes : Shape[] = [];

    constructor(){
        this.height = 0;
    }

    intercepts(hitbox: Rectangle): boolean {
        let modifiedHitbox : Rectangle = new Rectangle(hitbox.color, hitbox.x, hitbox.y - this.y, hitbox.w, hitbox.h, true);
        for(let s of this.shapes){
            if(s.hitbox.intercepts(modifiedHitbox)) return true;
        }
        return false;
    }

    update(n: number): void {
        this.y += n;
        for(let s of this.shapes){
            s.update();
        }
    }

    destroy() : void{
        for(let s of this.shapes){
            s.destroy();
        }
    }

    getY() : number{
        return this.y;
    }

    getHeight() : number{
        return this.height;
    }

    isOutOfMap() : boolean{
        return this.y > 700;
    }

    draw(): void {
        for(let s of this.shapes){
            s.draw(this.y);
        }
    }
}

export class ScrollingShapes extends Barrier{

    constructor(level : number){
        super();
        let shape : string = Math.random() < 0.5 ? "circle" : "rectangle";
        let gapX = 150 + Math.max(0, Math.ceil(50 - level * 0.1 - Math.random() * 5));
        let gapY = shape == "circle" ? 20 : 30; 
        let speed = 2 + Math.min(3, Math.floor(Math.random() * 1 + level * 0.0025));
        if(shape == "circle"){
            let rows = 1 + Math.min(2, Math.floor(Math.random() * 1 + level * 0.0025));
            gapX += (rows - 1) * 20;
            let r = 30 + Math.min(60, Math.floor(level * 0.1 + Math.random() * 30));
            let n = Math.ceil((700 + r*4) / (r * 2 + gapX));

            let odd = Math.random() < 0.5;

            for(let i = 0; i < rows; i++){

                let yRow = i * (r * 2 + gapY) + r;
                let target = new Vec2(0 - r * 2, yRow);
                let start = new Vec2((r * 2 + gapX) * n, yRow);

                for(let j = 0; j < n; j++){
                    this.shapes.push(new Shape(new Circle("yellow", r + j * (r * 2 + gapX), yRow, r), null,
                        new Path(odd ? target : start, odd ? start : target, speed, "toStart", j / n)));
                }
                odd = !odd;
            }

            this.height = (r * 2 + gapY) * rows - gapY;
        }
        else{
            let rows = 1 + Math.min(2, Math.floor(Math.random() * 1 + level * 0.0025));
            gapX += (rows - 1) * 40;
            let w = 80 + Math.min(150, Math.floor(level * 0.3 + Math.random() * 80));
            let h = 40 + Math.min(80, Math.floor(level * 0.15 + Math.random() * 5));
            let n = Math.ceil(700 / (w + gapX));

            let odd = Math.random() < 0.5;

            for(let i = 0; i < rows; i++){

                let yRow = i * (h + gapY);
                let target = new Vec2(0 - w, yRow);
                let start = new Vec2((w + gapX) * n, yRow);

                for(let j = 0; j < n; j++){
                    this.shapes.push(new Shape(new Rectangle("yellow", j * (h + gapX), yRow, w, h), null,
                    new Path(odd ? target : start, odd ? start : target, speed, "toStart", j / n)));
                }
                odd = !odd;
            }

            this.height = (h + gapY) * rows - gapY;
        }
        this.y -= this.height;
    }

}

export class ScalingCircles extends Barrier{

    constructor(level : number){
        super();
        let gapY = -25;
        let n = Math.min(5, Math.ceil((level + 1) * 0.02));
        let speed = 0.05;
        let minR = 10 + Math.min(30, level * 0.05);
        let maxR = 100 + Math.min(160, level * 0.025);
        let overlapX = Math.min(50, level * 0.2);
        let odd = Math.random() < 0.5;

        for(let i = 0; i < n; i++){

            this.shapes.push(new Shape(new Circle("yellow", odd ? (250 - maxR + overlapX - 10 * (n - i)) : (250 + maxR - overlapX + 10 * (n - i)), maxR + (maxR * 2 + gapY) * i, minR),
                new Scaling(maxR / minR, speed, "all", n == 1 ? 1 : (i/ n)), null));
            odd = !odd;
        }

        this.height = (maxR * 2 + gapY) * n;
        this.y -= this.height;

    }

}

export class ColorBarrier extends Barrier{

    constructor(){
        super();
        this.shapes.push(new Shape(new Rectangle(Math.random() < 0.5 ? "blue" : "green", 100, 0, 300, 50), null, null));
        this.height = 50;
        this.y -= this.height;
    }

}

export class ScrollingColorBarrier extends Barrier{

    constructor(level : number){
        super();
        let odd = Math.random() < 0.5;
        let direction = Math.random() < 0.5;

        if(Math.random() < 0.5){ // Circles
            let r = 125 - Math.min(75, level * 0.5);
            let n = Math.ceil(700 / (r * 2));
            n = (n % 2 != 0) ? (n + 1) : n;

            for(let i = 0; i < n; i++){

                let target = new Vec2(0 - r * 2, r);
                let start = new Vec2((r * 2) * n, r);

                this.shapes.push(new Shape(new Circle(odd ? "green" : "blue", r + i * r * 2, r, r), null,
                    new Path(direction ? target : start, direction ? start : target, 2, "toStart", i / n)));
                odd = !odd;
            }
            this.height = r * 2;
        }
        else{ // Rectangles
            let w = 250 - Math.min(150, level * 0.7);
            let h = 50;
            let n = Math.ceil(700 / w);
            n = (n % 2 != 0) ? (n + 1) : n;

            for(let i = 0; i < n; i++){

                let target = new Vec2(0 - w, 0);
                let start = new Vec2(w * n, 0);

                this.shapes.push(new Shape(new Rectangle(odd ? "green" : "blue", i * w, 0, w, h), null,
                    new Path(direction ? target : start, direction ? start : target, 2.5, "toStart", i / n)));
                odd = !odd;
            }
            this.height = h;
        }
        this.y -= this.height;
    }

}