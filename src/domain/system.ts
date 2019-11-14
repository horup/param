import { State } from "./state";

export interface System
{
    once?(state:State);
    tick?(state:State, delta:number);
    onClick?(x:number, y:number, state:State);
    onKeydown?(keyCode:number, state:State);
}