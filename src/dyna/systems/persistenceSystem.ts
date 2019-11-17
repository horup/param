import { System, State } from "../../param";
import { DynaSystem, DynaState } from "../domain";

export class PersistenceSystem implements DynaSystem
{
    once(state:DynaState)
    {
        try
        {
            let s = JSON.parse(localStorage.getItem("current") as any);
            if (s == null)
                throw "state is null";
            Object.setPrototypeOf(s, State.prototype);
            state.copyFrom(s);
        }
        catch(ex)
        {
            state = new State();
        }
    }

    tick(state:DynaState)
    {
        localStorage.setItem("current", JSON.stringify(state));
    }
}