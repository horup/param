import { State, System, NP } from '../domain';
import * as PIXI from 'pixi.js';

export class RenderSystem implements System
{
    graphics:PIXI.Graphics;;
    constructor(optional?:any)
    {
        this.graphics = optional;
    }
    tick(state:State, dt:number)
    {
        let graphics = this.graphics;
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
        graphics.endFill();

    }
}