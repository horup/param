import { NP, SP } from "./parameters";
import { State } from "./state";

export class Entity
{
    state:State;
    id:string;

    constructor(state:State, id:string)
    {
        this.state = state;
        this.id = id;
    }

    setNP(np:NP, v:number)
    {
        this.state.setNP(np, v, this.id);
    }
    getNP(np:NP, def = null):number
    {
        let v = this.state.getNP(np, this.id);
        return v != null ? v : def;
    }

    setSP(sp:SP, v:string)
    {
        this.state.setSP(sp, v, this.id);
    }
    getSP(sp:SP, def = null):string
    {
        let v = this.state.getSP(sp, this.id);
        return v != null ? v : def;
    }
}