import { State, N, System, S } from "../domain";

export class SpawnSystem implements System
{
    onClick(x:number, y:number, state:State)
    {
        let e = state.newEntity();
        e.setN(N.x, x);
        e.setN(N.y, y);
        e.setN(N.anchorX, 0.5);
        e.setN(N.anchorY, 0.75);
        e.setN(N.health, 100);
        e.setS(S.sprite, "player");
    }

    onKeydown(keyCode:number, state:State)
    {
        if (keyCode == 49)
        {
            // clear state
            state.copyFrom(new State());
            let size = 17;
            for (let y = 0; y < size; y++)
            {
                for (let x = 0; x < size; x++)
                {
                    let e = state.newEntity();
                    e.setN(N.x, x);
                    e.setN(N.y, y);
                    if (y == 0 || y == size-1 || x == 0 || x == size-1)
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
    }
}