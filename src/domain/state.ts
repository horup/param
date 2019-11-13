import { SP, NP, Entity } from ".";

export class State
{
    private entities:{[id:string]:{}} = {};
    private nextId = 0;
    private sp:Partial<{[parameter in SP]:{[id:string]:string}}> = {};
    private np:Partial<{[parameter in NP]:{[id:string]:number}}> = {};

    copyFrom(state:State)
    {
        this.entities = state.entities;
        this.nextId = state.nextId;
        this.sp = state.sp;
        this.np = state.np;
    }

    private get(parameter:number, id:string, dic:any)
    {
        let d = dic[parameter];
        if (d != undefined)
            return d[id];
        return null;
    }
    private set(parameter:number, v:any, id:string, dic:any)
    {
        if (dic[parameter] == null)
            dic[parameter] = {};
        dic[parameter][id] = v;
        return null;
    }

    private exist(parameter:number, id:string, dic:any)
    {
        if (dic[parameter] != undefined && dic[parameter][id] != undefined)
            return true;
        return false;
    }

    delete(id:string)
    {
        for (let np in this.np)
            delete this.np[np][id];
        for (let sp in this.sp)
            delete this.sp[sp][id];
        delete this.entities[id];

        console.log(this);
    }

    newEntity():Entity
    {
        let e = new Entity();
        e.id = (this.nextId++).toString();
        e.state = this;
        this.entities[e.id] = {};
        return e;
    }

    setNP(parameter:NP, v:number, id:string)
    {
        this.set(parameter, v, id, this.np);
    }
    getNP(parameter:NP, id:string)
    {
        return this.get(parameter, id, this.np);
    }

    setSP(parameter:SP, v:string, id:string)
    {
        this.set(parameter, v, id, this.sp);
    }
    getSP(parameter:SP, id:string)
    {
        return this.get(parameter, id, this.sp);
    }

    forEach(f:(e:Entity)=>any, npArray:NP[] = [], spArray:SP[] = [])
    {
        let e = new Entity();
        e.state = this;
        for (let id in this.entities)
        {
            let there = true;
            for (let np of npArray)
            {
                if (!this.exist(np, id, this.np))
                {
                    there = false;
                    break;
                }
            }
            for (let sp of spArray)
            {
                if (!this.exist(sp, id, this.sp))
                {
                    there = false;
                    break;
                }
            }

            if (there)
            {
                e.id = id;
                f(e);
            }
        }
       
    }
}

