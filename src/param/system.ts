import { State } from "./state";

export interface System<NParam extends number, SParam extends number, AParam extends number>
{
    once?(state:State<NParam, SParam, AParam>):any;
    tick?(state:State<NParam, SParam, AParam>, delta:number):any;
    onClick?(x:number, y:number, state:State<NParam, SParam, AParam>):any;
    onKeydown?(keyCode:number, state:State<NParam, SParam, AParam>):any;
    onKeyup?(keyCode:number, state:State<NParam, SParam, AParam>):any;
}