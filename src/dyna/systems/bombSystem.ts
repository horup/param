import { DynaSystem, DynaState, N, Grid, S, SpriteType } from "../domain";

export class BombSystem implements DynaSystem
{
    tick(state:DynaState, dt:number)
    {
        state.forEach((e)=>
        {
            let fuse = e.getN(N.fuse) as number;
            let x = e.getN(N.x) as number;
            let y = e.getN(N.y) as number;
            let flame = e.getN(N.flame) as number;
            
            if (fuse <= 0)
            {
                let grid = Grid.firstGrid(state);
                if (grid != null)
                {
                    grid.setBombId(x, y, null);
                    state.delete(e.id);
                  
                    let makeflame = (x:number, y:number) =>
                    {
                        let e = state.newEntity();
                        e.setN(N.x, x);
                        e.setN(N.y, y);
                        e.setN(N.anchorX, 0.5);
                        e.setN(N.anchorY, 0.5);
                        e.setN(N.flameLife, 30);
                        e.setN(N.sprite, SpriteType.flame);
                    }
                    let spewflame = (x:number, y: number, dx:number, dy:number, flame:number) =>
                    {
                        if (grid != null)
                        {
                            if (dx == 0 && dy == 0)
                            {
                                makeflame(x, y);
                            }
                            else
                            {
                                while (flame > 0)
                                {
                                    x += dx;
                                    y += dy;
                                    let block = grid.getBlockId(x, y);
                                    if (block != null && state.getNP(N.solid, block) != null)
                                    {
                                        state.setNP(N.solid, null, block);
                                        state.setNP(N.frame, 1, block);
                                        return;
                                    }
                                    else
                                    {
                                        makeflame(x, y);
                                        flame--;
                                    }
                                }
                            }
                        }
                    }

                    spewflame(x, y, 0,0, flame);
                    spewflame(x, y, 1, 0, flame);
                    spewflame(x, y, -1, 0, flame);
                    spewflame(x, y, 0, -1, flame);
                    spewflame(x, y, 0, 1, flame);
                }
            }
            else
            {
                fuse--;
                e.setN(N.fuse, fuse);
            }
        }, [N.fuse, N.x, N.y, N.flame])
    }
}