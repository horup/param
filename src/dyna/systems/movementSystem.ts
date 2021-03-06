import { System, State, Entity, } from "../../param";
import * as SAT from 'sat';
import { DynaSystem, DynaState, N, A, Grid } from "../domain";

export class MovementSystem implements DynaSystem
{
    getIsSolid(x:number, y:number, grid:Grid):boolean
    {
        let isSolid = false;
        let state = grid.getState();
        let cellId = grid.getBlockId(x, y);
        if (cellId != null)
        {
            isSolid = state.getNP(N.solid, cellId) != null || isSolid;
        }

        cellId = grid.getBombId(x, y);
        if (cellId != null)
        {
            isSolid = state.getNP(N.solid, cellId) != null || isSolid;
        }

        return isSolid;
    }

    getIsBomb(x:number, y:number, grid:Grid)
    {
        let state = grid.getState();
        let cellId = grid.getBombId(x, y);
        if (cellId != null)
        {
            return state.getNP(N.fuse, cellId) != null
        }

        return false;
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

    collides(x:number, y:number, grid:Grid, dx = 0, dy = 0)
    {
        let state = grid.getState();
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
            if (dx > 0 && ax < x) return;
            if (dx < 0 && ax > x) return;
            if (dy > 0 && ay < y) return;
            if (dy < 0 && ay > y) return;
            if (this.getIsSolid(ax, ay, grid))
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

        let grid = Grid.firstGrid(state);

        state.forEach((e) => {
            if (grid == null)
                return;
                
            let [x, y, vx, vy] = e.getNArray(N.x, N.y, N.vx, N.vy);
            if (x == null || y == null || vx == null || vy == null)
                return;
            if (vx == 0 && vy == 0)
                return;

            let spd = Math.sqrt(vx * vx + vy * vy);
            

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
                if (!this.collides(x + vx, ny, grid, dx, 0))
                {
                    e.setN(N.x, nx);
                }
                else
                {
                    nx = x;
                    if (!this.getIsSolid(x+dx, y, grid) || this.getIsBomb(x+dx, y, grid))
                    {
                        centerize = true;
                    }
                }
            }

            if (vy != 0)
            {
                ny = y + vy;
                let dy = Math.sign(vy);

                if (!this.collides(nx, ny, grid, 0, dy))
                {
                    e.setN(N.y, ny);
                }
                else
                {
                    ny = y;
                    if (!this.getIsSolid(x, y+dy, grid) || this.getIsBomb(x, y+dy, grid))
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