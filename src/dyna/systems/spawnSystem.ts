import { State, System } from "../../param";
import { DynaSystem, DynaState, N, S, A, SpriteType } from "../domain";

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
        e.setN(N.sprite, SpriteType.player);
        e.setN(N.solid, 2);
    }

    spawnGrid(state:DynaState)
    {
        let gridEntity = state.newEntity();
        let gridSize = 17;
        gridEntity.setN(N.gridSize, gridSize);
        let blockGrid:string[] = new Array(gridSize * gridSize);
        let bombGrid:string[] = new Array(gridSize * gridSize);
        gridEntity.setA(A.blockGrid, blockGrid);
        gridEntity.setA(A.bombGrid, bombGrid);
        for (let y = 0; y < gridSize; y++)
        {
            for (let x = 0; x < gridSize; x++)
            {
                let e = state.newEntity();
                let i = y * gridSize + x;
                blockGrid[i] = e.id;
                e.setN(N.x, x + 0.5);
                e.setN(N.y, y + 0.5);
                e.setN(N.anchorX, 0.5);
                e.setN(N.anchorY, 0.5);
                e.setN(N.sprite, SpriteType.tile);
                if (y == 0 || y == gridSize-1 || x == 0 || x == gridSize-1)
                {
                    e.setN(N.solid, 1);
                    e.setN(N.frame, 0);

                }
                else
                {
                    if (x % 2 == 0 && y % 2 == 0)
                    {
                        e.setN(N.solid, 1);
                        e.setN(N.frame, 7+1);

                     //  e.setN(N.sprite, "block");
                    }
                    else
                    {
                        e.setN(N.frame, 1);
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