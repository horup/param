import { System, State } from "../../param";
import { DynaSystem, DynaState, N, Grid } from "../domain";
import { A, S, SpriteType } from "../domain/parameters";

enum Codes
{
    up = 87,
    down = 83,
    left = 65,
    right = 68,
    space = 32
}

export class PlayerSystem implements DynaSystem
{
    
    down:any = {};
    onKeydown(keyCode:number, state:DynaState)
    {
      //  console.log("down:" + keyCode);
        this.down[keyCode] = true;
    }

    onKeyup(keyCode:number, state:DynaState)
    {
    //    console.log("up:" + keyCode);
        delete this.down[keyCode];
    }

    tick(state:DynaState, dt:number)
    {
        let speed = 0.05;
        let grid = Grid.firstGrid(state);

        state.forEach(e=> {
            
            let [x, y] = e.getNArray(N.x, N.y);
            if (x == null || y == null)
                return;
            if (this.down[Codes.up])
                e.setN(N.vy, -speed);
            else if (this.down[Codes.down])
                e.setN(N.vy, speed);
            else
                e.setN(N.vy, 0);

            if (this.down[Codes.left])
                e.setN(N.vx, -speed);
            else if (this.down[Codes.right])
                e.setN(N.vx, speed);
            else
                e.setN(N.vx, 0);

            if (this.down[Codes.space])
            {
                // place bomb
                if (grid != null)
                {
                    let ix = Math.floor(x)+0.5;
                    let iy = Math.floor(y)+0.5;
                    if (grid.getBombId(ix, iy) == null)
                    {
                        let e = state.newEntity();
                        e.setN(N.x, ix);
                        e.setN(N.y, iy);
                        e.setN(N.anchorX, 0.5);
                        e.setN(N.anchorY, 0.5);
                        e.setN(N.frame, 0);
                        e.setN(N.solid, 2);
                        e.setN(N.flame, 2);
                        e.setN(N.sprite, SpriteType.bomb);
                        e.setN(N.fuse, 60*2);
                        e.setS(S.owner, e.id);
                        grid.setBombId(ix, iy, e.id);
                    }
                }

            }
            

        }, [N.x, N.y, N.vx, N.vy])
    }
}