import { State, System } from '../../param';
import * as PIXI from 'pixi.js';
import * as imgs from '../imgs';
import { DynaSystem, DynaState, N, S } from '../domain';
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
                   // sprite.texture = new PIXI.Texture(sprite.texture.baseTexture);
                    sprite.name = e.id;
                    sprite.scale.set(1/16);
                    this.sprites.addChild(sprite);
                }
            }
            
            if (sprite != null)
            {
                let [x, y, anchorX, anchorY, frames] = e.getNArray(N.x, N.y, N.anchorX, N.anchorY, N.frames);
                sprite.x = x != null ? x : 0;
                sprite.y = y != null ? y : 0;
                sprite.anchor.x = anchorX != null ? anchorX : 0;
                sprite.anchor.y = anchorY != null ? anchorY : 0;
                seen[e.id] = true;

                frames = frames != null ? frames : 1;
                let frame = Math.floor(e.getN(N.frame, 0) as number) % frames;
                let w = sprite.texture.baseTexture.width;
                let h = sprite.texture.baseTexture.height;
                sprite.texture = new PIXI.Texture(sprite.texture.baseTexture, new PIXI.Rectangle(frame * w/frames,0, w/frames,h));
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