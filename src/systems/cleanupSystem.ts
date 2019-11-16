import { System, State } from "../param";
import { DynaSystem, DynaState, N } from "../dyna";

export class CleanupSystem implements DynaSystem
{
    tick(state:DynaState)
    {
        state.forEach(e=>
        {
            if (e.getN(N.health) <= 0)
                state.delete(e.id);
        }, [N.health])
    }
}