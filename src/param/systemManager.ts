import { System } from "./system";
import { State } from "./state";

export class SystemManager<N extends number, S extends number, A extends number>
{
    systems:System<N, S, A>[] = [];
    constructor()
    {
    }

    findSystem(system:new()=>System<N, S, A>)
    {
        let found = this.systems.filter(s=>system.prototype.isPrototypeOf(s))[0];
        return found;
    }

    addSystem(system:new(optional?:any)=>System<N, S, A>, optional?:any)
    {
        if (this.findSystem(system) != undefined)
            throw "System already exists!";
        let sys = new system(optional);
        this.systems.push(sys);
        return this;
    }

    removeSystem(system:new()=>System<N, S, A>)
    {
        let s = this.findSystem(system);
        if (s == undefined)
            throw "System does not exist!";
        let i = this.systems.indexOf(s);
        this.systems.splice(i, 1);
    }

    once(state:State<N, S, A>)
    {
        this.systems.forEach(s=>
        {
            if (s.once != null)
                s.once(state);
        })
    }

    private ticks = 0;
    tick(state:State<N, S, A>, delta:number)
    {
        if (this.ticks == 0)
        {
            this.systems.forEach(s=>s.once != null ? s.once(state) : undefined);
        }
        this.systems.forEach(s=>
        {
            if (s.tick != null)
                s.tick(state, delta);
        })

        this.ticks++;
    }

    onClick(x:number, y:number, state:State<N, S, A>)
    {
        this.systems.forEach(s=>
        {
            if (s.onClick != null)
                s.onClick(x, y, state);
        })
    }

    onKeydown(keyCode:number, state:State<N, S, A>)
    {
        this.systems.forEach(s=>
        {
            if (s.onKeydown != null)
                s.onKeydown(keyCode, state);
        })
    }

    onKeyup(keyCode:number, state:State<N, S, A>)
    {
        this.systems.forEach(s=>
        {
            if (s.onKeyup != null)
                s.onKeyup(keyCode, state);
        })
    }
}
