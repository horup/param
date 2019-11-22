import { State, System } from '../../param';
import * as PIXI from 'pixi.js';
import * as imgs from '../imgs';
import { DynaSystem, DynaState, N, S, SpriteType } from '../domain';
type Seen = {[id:string]:any};
const loader = PIXI.Loader.shared;

class Sprite extends PIXI.Sprite
{
    private prevSpriteType:SpriteType | null;
    spriteType:SpriteType | null;
    constructor()
    {
        super();
        this.prevSpriteType = null;
        this.spriteType = null;
        this.update();
    }

    frame = 0;

    frames2()
    {
        switch (this.spriteType)
        {
            case SpriteType.tile:
                return 8;
            case SpriteType.bomb:
                return 2;
        }
        return 1;
    }

    update()
    {
        if (this.spriteType != null && this.prevSpriteType != this.spriteType)
        {
            let res = loader.resources[this.spriteType];
            if (res != null)
                this.texture.baseTexture = res.texture.baseTexture;
            this.prevSpriteType = this.spriteType;
        }

        if (this.spriteType != null)
        {
            let frames2 = this.frames2();
            let frames = frames2 * frames2;
            let frame = this.frame % frames;
            let w = this.texture.baseTexture.width;
            let h = this.texture.baseTexture.height;
            let fw = w / frames2;
            let fh = h / frames2;
            let fx = (frame % frames2) * fw;
            let fy = Math.floor(frame / frames2) * fh;
            this.texture = new PIXI.Texture(this.texture.baseTexture, new PIXI.Rectangle(fx, fy, fh,fw));
        }
    }
}

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
        let sprite = this.sprites.children.filter(s => s.name == id)[0] as Sprite;
        return sprite as Sprite;
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
                let spriteType = e.getN(N.sprite);
                if (spriteType != null)
                {
                    sprite = new Sprite()//PIXI.Sprite.from((imgs as any)[spriteName]);
                   // sprite.texture = new PIXI.Texture(sprite.texture.baseTexture);
                    sprite.name = e.id;
                    sprite.scale.set(1/16);
                    this.sprites.addChild(sprite);
                }
            }
            
            if (sprite != null)
            {
                let spriteType = e.getN(N.sprite);
                if (spriteType != null)
                {
                    sprite.spriteType = spriteType;
                    let [x, y, anchorX, anchorY] = e.getNArray(N.x, N.y, N.anchorX, N.anchorY);
                    sprite.x = x != null ? x : 0;
                    sprite.y = y != null ? y : 0;
                    sprite.anchor.x = anchorX != null ? anchorX : 0;
                    sprite.anchor.y = anchorY != null ? anchorY : 0;
                    seen[e.id] = true;
                    let frame = Math.floor(e.getN(N.frame, 0) as number);

                    sprite.frame = frame;
                   
                    sprite.update();

                }
            }
        }, [N.x, N.y, N.sprite])
    }

    tick(state:DynaState, dt:number)
    {
        let seen:Seen = {};
        
        this.drawSprites(state,dt,seen);
        this.removeUnseen(seen);
    }
}