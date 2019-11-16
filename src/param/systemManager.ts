import { System } from "./system";
import { State } from "./state";

export class SystemManager<NParam extends number, SParam extends number, AParam extends number>
{
    systems:System<NParam, SParam, AParam>[] = [];
    constructor()
    {
    }

    findSystem(system:new()=>System<NParam, SParam, AParam>)
    {
        let found = this.systems.filter(s=>system.prototype.isPrototypeOf(s))[0];
        return found;
    }

    addSystem(system:new(optional?:any)=>System<NParam, SParam, AParam>, optional?:any)
    {
        if (this.findSystem(system) != undefined)
            throw "System already exists!";
        let sys = new system(optional);
        this.systems.push(sys);
        return this;
    }

    removeSystem(system:new()=>System<NParam, SParam, AParam>)
    {
        let s = this.findSystem(system);
        if (s == undefined)
            throw "System does not exist!";
        let i = this.systems.indexOf(s);
        this.systems.splice(i, 1);
    }

    once(state:State<NParam, SParam, AParam>)
    {
        this.systems.forEach(s=>
        {
            if (s.once != null)
                s.once(state);
        })
    }

    private ticks = 0;
    tick(state:State<NParam, SParam, AParam>, delta:number)
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

    onClick(x:number, y:number, state:State<NParam, SParam, AParam>)
    {
        this.systems.forEach(s=>
        {
            if (s.onClick != null)
                s.onClick(x, y, state);
        })
    }

    onKeydown(keyCode:number, state:State<NParam, SParam, AParam>)
    {
        this.systems.forEach(s=>
        {
            if (s.onKeydown != null)
                s.onKeydown(keyCode, state);
        })
    }

    onKeyup(keyCode:number, state:State<NParam, SParam, AParam>)
    {
        this.systems.forEach(s=>
        {
            if (s.onKeyup != null)
                s.onKeyup(keyCode, state);
        })
    }
}
