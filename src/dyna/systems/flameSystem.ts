import { DynaSystem, DynaState, N } from "../domain";

export class FlameSystem implements DynaSystem
{
    tick(state:DynaState, dt:number)
    {
        state.forEach((e)=> {
            let life = e.getN(N.flameLife) as number;
            life--;
            e.setN(N.flameLife, life);
            if (life <= 0)
                state.delete(e.id);
        }, [N.flameLife])
    }
}