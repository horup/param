import { N, S } from "./parameters";
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

    setN(np:N, v:number)
    {
        this.state.setNP(np, v, this.id);
    }
    getN(np:N, def:number | undefined = undefined):number
    {
        let v = this.state.getNP(np, this.id);
        return v != null ? v : def;
    }

    setS(sp:S, v:string)
    {
        this.state.setSP(sp, v, this.id);
    }
    getS(sp:S, def:string | undefined = undefined):string
    {
        let v = this.state.getSP(sp, this.id);
        return v != null ? v : def;
    }
}