import { State, System } from "../param";
import { DynaSystem, DynaState, N, S, A } from "../dyna";

export class SpawnSystem implements DynaSystem
{
    onClick(x:number, y:number, state:DynaState)
    {
      /*  let e = state.newEntity();
        e.setN(N.x, x);
        e.setN(N.y, y);
        e.setN(N.anchorX, 0.5);
        e.setN(N.anchorY, 0.75);
        e.setN(N.health, 100);
        e.setS(S.sprite, "player");*/
    }

    spawnPlayer(state:DynaState)
    {
        let e = state.newEntity();
        e.setN(N.x, 1 + 0.5);
        e.setN(N.y, 1 + 0.5);
        e.setN(N.vx, 0);
        e.setN(N.vy, 0);
        e.setN(N.anchorX, 0.5);
        e.setN(N.anchorY, 0.75);
        e.setN(N.health, 100);
        e.setS(S.sprite, "player");
        e.setN(N.solid, 2);
    }

    spawnGrid(state:DynaState)
    {
        let gridEntity = state.newEntity();
        let gridSize = 17;
        gridEntity.setN(N.gridSize, gridSize);
        let grid:string[] = new Array(gridSize*gridSize);
        gridEntity.setA(A.grid, grid);
        for (let y = 0; y < gridSize; y++)
        {
            for (let x = 0; x < gridSize; x++)
            {
                let e = state.newEntity();
                let i = y * gridSize + x;
                grid[i] = e.id;
                e.setN(N.x, x + 0.5);
                e.setN(N.y, y + 0.5);
                e.setN(N.anchorX, 0.5);
                e.setN(N.anchorY, 0.5);

                if (y == 0 || y == gridSize-1 || x == 0 || x == gridSize-1)
                {
                    e.setN(N.solid, 1);
                    e.setS(S.sprite, "stone");
                }
                else
                {
                    if (x % 2 == 0 && y % 2 == 0)
                    {
                        e.setN(N.solid, 1);
                        e.setS(S.sprite, "block");
                    }
                    else
                    {
                        e.setS(S.sprite, "grass");
                    }
                }
            }
        }
    }

    onKeydown(keyCode:number, state:DynaState)
    {
        if (keyCode == 49)
        {
            // clear state
            state.copyFrom(new State());
            this.spawnGrid(state);
            this.spawnPlayer(state);
        }
    }
}