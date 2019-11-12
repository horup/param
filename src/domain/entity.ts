import { NP, SP, State } from ".";

export class Entity
{
    state:State;
    id:string;

    setNP(np:NP, v:number)
    {
        this.state.setNP(np, v, this.id);
    }
    getNP(np:NP)
    {
        return this.state.getNP(np, this.id);
    }

    setSP(sp:SP, v:string)
    {
        this.state.setSP(sp, v, this.id);
    }
    getSP(sp:SP)
    {
        return this.state.getSP(sp, this.id);
    }
}