import { System } from "./system";
import { State } from "./state";

export class SystemManager
{
    systems:System[] = [];
    constructor()
    {
    }

    findSystem(system:new()=>System)
    {
        let found = this.systems.filter(s=>system.prototype.isPrototypeOf(s))[0];
        return found;
    }

    addSystem(system:new(optional?:any)=>System, optional?:any)
    {
        if (this.findSystem(system) != undefined)
            throw "System already exists!";
        this.systems.push(new system(optional));
        return this;
    }

    removeSystem(system:new()=>System)
    {
        let s = this.findSystem(system);
        if (s == undefined)
            throw "System does not exist!";
        let i = this.systems.findIndex(ss=>ss == s);
        this.systems.splice(i, 1);
    }

    once(state:State)
    {
        this.systems.forEach(s=>
        {
            if (s.once != null)
                s.once(state);
        })
    }

    tick(state:State, delta:number)
    {
        this.systems.forEach(s=>
        {
            if (s.tick != null)
                s.tick(state, delta);
        })
    }

    onClick(x:number, y:number, state:State)
    {
        this.systems.forEach(s=>
        {
            if (s.onClick != null)
                s.onClick(x, y, state);
        })
    }
}
