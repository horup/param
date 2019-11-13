import { System, State, NP } from "../domain";

export class CleanupSystem implements System
{
    tick(state:State)
    {
        state.forEach(e=>
        {
            let h = e.getNP(NP.health);
            h--;
            e.setNP(NP.health, h);
            if (e.getNP(NP.health) <= 0)
                state.delete(e.id);
        }, [NP.health])
    }
}