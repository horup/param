import { System, State } from "../domain";

export class PersistenceSystem implements System
{
    once(state:State)
    {
        try
        {
            let s = JSON.parse(localStorage.getItem("current"));
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

    tick(state:State)
    {
        localStorage.setItem("current", JSON.stringify(state));
    }
}