import { State, System } from '../../param';
import * as PIXI from 'pixi.js';
import * as imgs from '../../../imgs';
import { DynaSystem, DynaState, N, S } from '..';
type Seen = {[id:string]:any};
export class RenderSystem implements DynaSystem
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

    private drawSprites(state:DynaState, dt:number, seen:Seen)
    {
        let f = 1/16;
        state.forEach(e => {
            let sprite = this.findSprite(e.id);
            if (sprite == null) {
                let spriteName = e.getS(S.sprite);
                if (spriteName != null)
                {
                    sprite = PIXI.Sprite.from((imgs as any)[spriteName]);
                    sprite.name = e.id;
                    sprite.scale.set(1/16);
                    this.sprites.addChild(sprite);
                }
            }
            
            if (sprite != null)
            {
                let [x, y, anchorX, anchorY] = e.getNArray(N.x, N.y, N.anchorX, N.anchorY);
                if (x != null && y != null && anchorX != null && anchorY)
                {
                    sprite.x = x;
                    sprite.y = y;
                    sprite.anchor.x = anchorX;
                    sprite.anchor.y = anchorY;
                    seen[e.id] = true;
                }
            }
        }, [N.x, N.y], [S.sprite])
    }

    tick(state:DynaState, dt:number)
    {
        let seen:Seen = {};
        
        this.drawSprites(state,dt,seen);
        this.removeUnseen(seen);
    }
}