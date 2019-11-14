import { S, N, A, Entity } from ".";

export class State
{
    private entities:{[id:string]:{}} = {};
    private nextId = 0;
    private sp:Partial<{[parameter in S]:{[id:string]:string}}> = {};
    private np:Partial<{[parameter in N]:{[id:string]:number}}> = {};
    private ap:Partial<{[parameter in A]:{[id:string]:any}}> = {};

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

    private exists(parameter:number, id:string, dic:any)
    {
        if (dic[parameter] != undefined && dic[parameter][id] != undefined)
            return true;
        return false;
    }

    delete(id:string)
    {
        for (let np in this.np)
            delete (this.np as any)[np][id];
        for (let sp in this.sp)
            delete (this.sp as any)[sp][id];
        delete this.entities[id];
    }

    newEntity():Entity
    {
        let id = (this.nextId++).toString();
        let e = new Entity(this, id);
        this.entities[e.id] = {};
        return e;
    }

    setNP(parameter:N, v:number, id:string)
    {
        this.set(parameter, v, id, this.np);
    }
    getNP(parameter:N, id:string)
    {
        return this.get(parameter, id, this.np);
    }

    setSP(parameter:S, v:string, id:string)
    {
        this.set(parameter, v, id, this.sp);
    }
    getSP(parameter:S, id:string)
    {
        return this.get(parameter, id, this.sp);
    }

    setAP(parameter:A, v:string, id:string)
    {
        this.set(parameter, v, id, this.ap);
    }
    getAP(parameter:A, id:string)
    {
        return this.get(parameter, id, this.ap);
    }

    forEach(f:(e:Entity)=>any, npArray:N[] = [], spArray:S[] = [], apArray:A[] = [])
    {
        let e = new Entity(this, "");
        for (let id in this.entities)
        {
            let there = true;
            for (let np of npArray)
            {
                if (!this.exists(np, id, this.np))
                {
                    there = false;
                    break;
                }
            }
            for (let sp of spArray)
            {
                if (!this.exists(sp, id, this.sp))
                {
                    there = false;
                    break;
                }
            }

            for (let ap of apArray)
            {
                if (!this.exists(ap, id, this.ap))
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

