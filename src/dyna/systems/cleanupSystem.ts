import { System, State } from "../../param";
import { DynaSystem, DynaState, N } from "..";

export class CleanupSystem implements DynaSystem
{
    tick(state:DynaState)
    {
        state.forEach(e=>
        {
            let h = e.getN(N.health)
            if (h != null && h <= 0)
                state.delete(e.id);
        }, [N.health])
    }
}