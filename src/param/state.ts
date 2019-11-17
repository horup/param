import { Entity } from "./entity";

export class State<NParam extends number, SParam extends number, AParam extends number>
{
    private entities:{[id:string]:{}} = {};
    private nextId = 0;
    private sp:Partial<{[s:number]:{[id:string]:string}}> = {};
    private np:Partial<{[n:number]:{[id:string]:number}}> = {};
    private ap:Partial<{[a:number]:{[id:string]:any}}> = {};

    copyFrom(state:State<NParam, SParam, AParam>)
    {
        this.entities = state.entities;
        this.nextId = state.nextId;
        this.sp = state.sp;
        this.np = state.np;
        this.ap = state.ap;
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

    newEntity():Entity<NParam, SParam, AParam>
    {
        let id = (this.nextId++).toString();
        let e = new Entity(this, id);
        this.entities[e.id] = {};
        return e;
    }

    getFirstN(n:NParam):Entity<NParam, SParam, AParam>|null
    {
        if (this.np[n] != null)
        {
            for (let id in this.np[n])
            {   
                let e = new Entity(this, id);
                return e;
            }
        }
        return null;
    }


    setNP(parameter:NParam, v:number, id:string)
    {
        this.set(parameter, v, id, this.np);
    }
    getNP(parameter:NParam, id:string)
    {
        return this.get(parameter, id, this.np) as number | null;
    }

    setSP(parameter:SParam, v:string, id:string)
    {
        this.set(parameter, v, id, this.sp);
    }
    getSP(parameter:SParam, id:string)
    {
        return this.get(parameter, id, this.sp)  as string | null;;
    }

    setAP(parameter:AParam, v:string, id:string)
    {
        this.set(parameter, v, id, this.ap);
    }
    getAP(parameter:AParam, id:string)
    {
        return this.get(parameter, id, this.ap) as any;;
    }

    forEach(f:(e:Entity<NParam, SParam, AParam>)=>any, npArray:NParam[] = [], spArray:SParam[] = [], apArray:AParam[] = [])
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

