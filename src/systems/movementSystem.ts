import { System, State, N } from "../domain";

export class MovementSystem implements System
{
    tick(state:State, dt:number)
    {
        state.forEach((e) => {
            let [x, y, vx, vy] = e.getNArray(N.x, N.y, N.vx, N.vy);
            x += vx;
            y += vy;
            e.setN(N.x, x);
            e.setN(N.y, y);
        }, [N.x, N.y, N.vx, N.vy])
    }
}