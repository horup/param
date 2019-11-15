import { System, State, N, Entity } from "../domain";
import * as SAT from 'sat';

export class MovementSystem implements System
{
    checkCollision(mover:Entity, state:State, x1:number, y1:number, radius1:number):any
    {
        let box1 = new SAT.Box();
        box1.pos.x = x1 - radius1;
        box1.pos.y = y1 - radius1;
        box1.w = radius1 * 2;
        box1.h = radius1 * 2;

        let box2 = new SAT.Box();
        if (mover.getN(N.solid) != undefined)
        {
            let collides = false;
            state.forEach(e=> {
                if (e.id != mover.id && collides == false)
                {
                    let [x2, y2, solid2, radius2] = e.getNArray(N.x, N.y, N.solid, N.radius); 
                    box2.pos.x = x2 - radius2;
                    box2.pos.y = y2 - radius2;
                    box2.w = radius2 * 2;
                    box2.h = radius2 * 2;
                    let resp:any = new SAT.Response();
                    collides = SAT.testPolygonPolygon(box1.toPolygon(), box2.toPolygon(), resp);
                    if (collides)
                    {
                    }
                }
            }, [N.x, N.y, N.solid, N.radius]);
            return collides;
        }
        return false;
    }
    tick(state:State, dt:number)
    {
        state.forEach((e) => {
            let [x, y, vx, vy, radius] = e.getNArray(N.x, N.y, N.vx, N.vy, N.radius);
    
            if (vx != 0)
            {
                let nx = x + vx;
                if (!this.checkCollision(e, state, nx, y, radius))
                {
                    x = nx;
                    e.setN(N.x, nx);
                }
            }
            if (vy != 0)
            {
                let ny = y + vy;
                if (!this.checkCollision(e, state, x, ny, radius))
                    e.setN(N.y, ny);
            }

        }, [N.x, N.y, N.vx, N.vy, N.radius])
    }
}