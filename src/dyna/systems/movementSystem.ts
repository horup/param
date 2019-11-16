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

                
                let nx = x + vx;
                let ny = y;

                let resolveCollision = ()=>{
                    circle.pos.x = nx;
                    circle.pos.y = ny;
                    box1.pos.x = nx - r/2 + a;
                    box1.pos.y = ny - r/2 + a;
                    let overlap = false;
                    let longestResp:SAT.Response = new SAT.Response();
                    for (let iy = -1; iy <= 1; iy++) {
                        for (let ix = -1; ix <= 1; ix++) {
                            if (!(iy == 0 && ix == 0)) {
                                let cellId = this.getCellId(nx + ix, ny + iy, grid, state);
                                if (cellId != null && state.getNP(N.solid, cellId) != null) {
                                    box2.pos.x = Math.floor(nx) + ix + a;
                                    box2.pos.y = Math.floor(ny) + iy + a;
                                    let resp = new SAT.Response();
                                    if (SAT.testPolygonPolygon(box1.toPolygon(), box2.toPolygon(), resp)) {
                                        if (overlap == false || resp.overlap > longestResp.overlap)
                                            longestResp = resp;
                                        overlap = true;
                                    }
                                }
                            }
                        }
                    }
                    if (overlap)
                    {
                        nx -= longestResp.overlapV.x;
                        ny -= longestResp.overlapV.y;
                    }
                }

                if (x != nx)
                    resolveCollision();

                ny = y + vy;

                if (y != ny)
                    resolveCollision();

                e.setN(N.x, nx);
                e.setN(N.y, ny);
            }, [N.x, N.y, N.vx, N.vy])
        }
    }
}