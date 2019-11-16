import { State } from "./state";

export interface System<N extends number, S extends number, A extends number>
{
    once?(state:State<N, S, A>):any;
    tick?(state:State<N, S, A>, delta:number):any;
    onClick?(x:number, y:number, state:State<N, S, A>):any;
    onKeydown?(keyCode:number, state:State<N, S, A>):any;
    onKeyup?(keyCode:number, state:State<N, S, A>):any;
}