import { System, State, Entity, } from "../param";
import * as SAT from 'sat';
import { DynaSystem, DynaState, N, A } from "../dyna";

export class MovementSystem implements DynaSystem
{
   /* checkCollision(mover:Entity, state:State, x1:number, y1:number, radius1:number):any
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
    }*/

    getCell(ix:number, iy:number, grid:string[], gridSize:number, state:DynaState):string | null
    {
        let i = gridSize * iy + ix;
        if (i>=0 && i < gridSize)
            return grid[i];

        return null;
    }
    
    tick(state:DynaState, dt:number)
    {
        let gridEntity = state.getFirstN(N.gridSize);
        if (gridEntity != undefined)
        {

            let gridSize = gridEntity.getN(N.gridSize);
            let grid = gridEntity.getA(A.grid) as string[];
            let spd = 0.05;
            state.forEach((e) => {
                let [x, y, vx, vy] = e.getNArray(N.x, N.y, N.vx, N.vy);
                if (vx != 0)
                {
                    let diff = Math.floor(y) - (y - 0.5);
                    console.log(diff);
                    if (diff == 0)
                    {
                        let nx = x + vx;
                        x = nx;
                        e.setN(N.x, nx);
                    }
                    else
                    {
                        if (Math.abs(diff) > spd)
                            y += Math.sign(diff)*spd;
                        else
                            y += diff;
                        e.setN(N.y, y);
                    }
                }
                else if (vy != 0)
                {
                    let diff = Math.floor(x) - (x - 0.5);
                    console.log(diff);
                    if (diff == 0)
                    {
                        let ny = y + vy;
                        y = ny;
                        e.setN(N.y, ny);
                    }
                    else
                    {
                        if (Math.abs(diff) > spd)
                            x += Math.sign(diff)*spd;
                        else
                            x += diff;
                        e.setN(N.x, x);
                    }
                }
        /*
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
                }*/

            }, [N.x, N.y, N.vx, N.vy])
        }
    }
}