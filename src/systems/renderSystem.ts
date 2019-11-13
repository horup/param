import { State, System, NP, SP } from '../domain';
import * as PIXI from 'pixi.js';
import * as imgs from '../../imgs';
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
       // this.stage.addChild(this.graphics);
    }
    tick(state:State, dt:number)
    {
        state.forEach(e => {
            let sprite = this.sprites.children.filter(s => s.name == e.id)[0] as PIXI.Sprite;
            if (sprite == undefined) {
                let spriteName = e.getSP(SP.sprite);
                sprite = PIXI.Sprite.from(imgs[spriteName]);
                sprite.name = e.id;
                console.log(sprite);
                this.sprites.addChild(sprite);
            }

            sprite.x = e.getNP(NP.x);
            sprite.y = e.getNP(NP.y);
        }, [NP.x, NP.y], [SP.sprite])
      /*  let graphics = this.graphics;
        graphics.clear();
        graphics.beginFill(0xFF0000)
        state.forEach(e=>
        {
            let health = e.getNP(NP.health);
            graphics.drawCircle(e.getNP(NP.x),e.getNP(NP.y), health);

            e.setNP(NP.health, --health);
            if (health <= 0)
                state.delete(e.id);

        }, [NP.x, NP.y, NP.health]);
        graphics.endFill();*/

    }
}