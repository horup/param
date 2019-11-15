import { System, State, N } from "../domain";

export class CleanupSystem implements System
{
    tick(state:State)
    {
        state.forEach(e=>
        {
            if (e.getN(N.health) <= 0)
                state.delete(e.id);
        }, [N.health])
    }
}