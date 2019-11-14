import { System, State, N } from "../domain";

export class CleanupSystem implements System
{
    tick(state:State)
    {
        state.forEach(e=>
        {
            let h = e.getNP(N.health);
            h--;
            e.setN(N.health, h);
            if (e.getNP(N.health) <= 0)
                state.delete(e.id);
        }, [N.health])
    }
}