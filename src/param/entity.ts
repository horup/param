import { State } from "./state";


export class Entity<NParam extends number, SParam extends number, AParam extends number>
{
    state:State<NParam, SParam, AParam>;
    id:string;

    constructor(state:State<NParam, SParam, AParam>, id:string)
    {
        this.state = state;
        this.id = id;
    }

    setN(np:NParam, v:number)
    {
        this.state.setNP(np, v, this.id);
    }
    getN(np:NParam, def:number | null = null):number|null
    {
        let v = this.state.getNP(np, this.id);
        return v != null ? v : def;
    }

    setS(sp:SParam, v:string)
    {
        this.state.setSP(sp, v, this.id);
    }

    getS(sp:SParam, def:string | null = null):string|null
    {
        let v = this.state.getSP(sp, this.id);
        return v != null ? v : def;
    }


    setA(a:AParam, v:any)
    {
        this.state.setAP(a, v, this.id);
    }
    getA(a:AParam, def:any = undefined):any
    {
        let v = this.state.getAP(a, this.id);
        return v != null ? v : def;
    }

    getNArray(...args:NParam[]):(number|null)[]
    {
        let nArray:(number|null)[] = [];
        for (let i = 0; i < args.length; i++)
            nArray[i] = this.getN(args[i]);

        return nArray;
    }

    getAArray(...args:AParam[]):(any|null)[]
    {
        let nArray:(any|null)[] = [];
        for (let i = 0; i < args.length; i++)
            nArray[i] = this.getA(args[i]);

        return nArray;
    }
}