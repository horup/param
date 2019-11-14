import { State } from "./state";

export interface System
{
    once?(state:State):any;
    tick?(state:State, delta:number):any;
    onClick?(x:number, y:number, state:State):any;
    onKeydown?(keyCode:number, state:State):any;
}