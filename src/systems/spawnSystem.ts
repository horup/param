import { State, NP, System, SP } from "../domain";

export class SpawnSystem implements System
{
    onClick(x:number, y:number, state:State)
    {
        let e = state.newEntity();
        e.setNP(NP.x, x);
        e.setNP(NP.y, y);
        e.setNP(NP.health, 100);
        e.setSP(SP.sprite, "player");
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
                    e.setNP(NP.x, x);
                    e.setNP(NP.y, y);
                    if (y == 0 || y == size-1 || x == 0 || x == size-1)
                    {
                        e.setNP(NP.solid, 1);
                        e.setSP(SP.sprite, "stone");
                    }
                    else
                    {
                        if (x % 2 == 0 && y % 2 == 0)
                        {
                            e.setNP(NP.solid, 1);
                            e.setSP(SP.sprite, "block");
                        }
                        else
                        {
                            e.setSP(SP.sprite, "grass");
                        }
                    }
                }
            }
        }
    }
}