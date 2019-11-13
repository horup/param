import { State, NP, System, SP } from "../domain";

export class SpawnSystem implements System
{
    onClick(x:number, y:number, state:State)
    {
        let e = state.newEntity();
        e.setNP(NP.x, x);
        e.setNP(NP.y, y);
        e.setNP(NP.health, 100);
        e.setSP(SP.sprite, "player");
    }
}