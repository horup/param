import { System, State, Entity, } from "../../param";
import * as SAT from 'sat';
import { DynaSystem, DynaState, N, A } from "..";

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

    getCellId(x:number, y:number, grid:string[], state:DynaState):string | null
    {
        let size = Math.sqrt(grid.length);
        let i = size * Math.floor(y) + Math.floor(x);
        if (i>=0 && i < grid.length)
            return grid[i];

        return null;
    }

    getIsSolid(x:number, y:number, grid:string[], state:DynaState):boolean
    {
        let cellId = this.getCellId(x, y, grid, state);
        if (cellId != null)
        {
            return state.getNP(N.solid, cellId) != null;
        }

        return true;
    }

    foreachAdjacent(x:number, y:number, f:(ax:number, ay:number)=>void)
    {
        x = Math.floor(x);
        y = Math.floor(y);
        for (let iy = -1; iy <= 1; iy++) {
            for (let ix = -1; ix <= 1; ix++) {
                if (!(iy == 0 && ix == 0)) {
                    f(x+ix, y+iy);
                }
            }
        }
    }

    collides(x:number, y:number, grid:string[], state:DynaState)
    {
        let r = 1;
        let a = 0.001;
        let box1 = new SAT.Box();
        let box2 = new SAT.Box();
        box1.w = box1.h = r - a*2;
        box2.w = box2.h = r - a*2;
        box1.pos.x = x - r/2 + a;
        box1.pos.y = y - r/2 + a;
        let collision = false;
        this.foreachAdjacent(x, y, (ax, ay)=>{
            if (this.getIsSolid(ax, ay, grid, state))
            {
                box2.pos.x = ax + a;
                box2.pos.y = ay + a;
                let resp = new SAT.Response();
                if (SAT.testPolygonPolygon(box1.toPolygon(), box2.toPolygon(), resp)) {
                    collision = true;
                }
            }
        });

        return collision;
    }
    
    tick(state:DynaState, dt:number)
    {
        let r = 1;
        let longestResp = new SAT.Response();
        let circle = new SAT.Circle();
        let box1 = new SAT.Box();
        let box2 = new SAT.Box();
        let a = 0.0001;
        circle.r = r/2 - a;
        box1.w = box1.h = r - a*2;
        box2.w = box2.h = r - a*2;
        let gridEntity = state.getFirstN(N.gridSize);
        if (gridEntity != undefined)
        {

            let grid = gridEntity.getA(A.grid) as string[];
            let spd = 0.05;
            state.forEach((e) => {
                let [x, y, vx, vy] = e.getNArray(N.x, N.y, N.vx, N.vy);
                if (x == null || y == null || vx == null || vy == null)
                    return;
                if (vx == 0 && vy == 0)
                    return;


                let moveToCenter = ()=>
                {
                    if (x != null && y != null)
                    {
                        let cx = Math.floor(x) + 0.5;
                        let cy = Math.floor(y) + 0.5;
                        let vx = cx - x;
                        let vy = cy - y;
                        let l = Math.sqrt(vx * vx + vy * vy);
                        if (Math.sqrt(vx * vx + vy * vy) > spd)
                        {
                            x += vx / l * spd;
                            y += vy / l * spd;
                        }
                        else
                        {
                            x = cx;
                            y = cy;
                        }
                        e.setN(N.x, x);
                        e.setN(N.y, y);
                    }
                }

                let nx = x;
                let ny = y;

                let centerize = false;
                
                if (vx != 0)
                {
                    nx = x + vx;
                    let dx = Math.sign(vx);
                    if (!this.collides(x + vx, ny, grid, state))
                    {
                        e.setN(N.x, nx);
                    }
                    else
                    {
                        nx = x;
                        if (!this.getIsSolid(x+dx, y, grid, state))
                        {
                            centerize = true;
                        }
                    }
                }

                if (vy != 0)
                {
                    ny = y + vy;
                    let dy = Math.sign(vy);

                    if (!this.collides(nx, ny, grid, state))
                    {
                        e.setN(N.y, ny);
                    }
                    else
                    {
                        ny = y;
                        if (!this.getIsSolid(x, y+dy, grid, state))
                        {
                            centerize = true;
                        }
                    }
                }

                if (x == nx && y == ny)
                {
                    if (centerize)
                        moveToCenter();
                }
            }, [N.x, N.y, N.vx, N.vy])
        }
    }
}