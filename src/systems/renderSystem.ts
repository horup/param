import { State, System, NP, SP } from '../domain';
import * as PIXI from 'pixi.js';
import * as imgs from '../../imgs';
type Seen = {[id:string]:any};
export class RenderSystem implements System
{
    stage:PIXI.Container;
    graphics:PIXI.Graphics;
    sprites:PIXI.Container;
    constructor(optional?:any)
    {
        this.stage = optional;
        this.graphics = new PIXI.Graphics();
        this.sprites = new PIXI.Container();
        this.stage.addChild(this.sprites);
        this.stage.addChild(this.graphics);
    }

    private findSprite(id:string)
    {
        let sprite = this.sprites.children.filter(s => s.name == id)[0] as PIXI.Sprite;
        return sprite as PIXI.Sprite;
    }
    private removeUnseen(seen:Seen)
    {
        let remove = this.sprites.children.filter(s=>seen[s.name] == undefined);
        for (let r of remove)
            this.sprites.removeChild(r);
    }

    private drawSprites(state:State, dt:number, seen:Seen)
    {
        let f = 1/16;
        state.forEach(e => {
            let sprite = this.findSprite(e.id);
            if (sprite == undefined) {
                let spriteName = e.getSP(SP.sprite);
                sprite = PIXI.Sprite.from((imgs as any)[spriteName]);
                sprite.name = e.id;
                sprite.scale.set(1/16);
                this.sprites.addChild(sprite);
            }
            
            sprite.x = e.getNP(NP.x);
            sprite.y = e.getNP(NP.y);
            sprite.anchor.x = e.getNP(NP.anchorX, 0);
            sprite.anchor.y = e.getNP(NP.anchorY, 0);
            seen[e.id] = true;
        }, [NP.x, NP.y], [SP.sprite])
    }

    tick(state:State, dt:number)
    {
        let seen:Seen = {};
        
        this.drawSprites(state,dt,seen);
        this.removeUnseen(seen);
    }
}