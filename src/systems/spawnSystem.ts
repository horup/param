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

            let size = 16;
            for (let y = 0; y < size; y++)
            {
                for (let x = 0; x < size; x++)
                {
                    let e = state.newEntity();
                    e.setNP(NP.x, x);
                    e.setNP(NP.y, y);
                    e.setSP(SP.sprite, "player");
                }
            }
        }
    }
}