import { System, State, N } from "../domain";

enum Codes
{
    up = 87,
    down = 83,
    left = 65,
    right = 68,
    space = 32
}

export class playerSystem implements System
{
    
    down:any = {};
    onKeydown(keyCode:number, state:State)
    {
      //  console.log("down:" + keyCode);
        this.down[keyCode] = true;
    }

    onKeyup(keyCode:number, state:State)
    {
    //    console.log("up:" + keyCode);
        delete this.down[keyCode];
    }

    tick(state:State, dt:number)
    {
        let speed = 0.05;
        state.forEach(e=> {
            if (this.down[Codes.up])
                e.setN(N.vy, -speed);
            else if (this.down[Codes.down])
                e.setN(N.vy, speed);
            else
                e.setN(N.vy, 0);

            if (this.down[Codes.left])
                e.setN(N.vx, -speed);
            else if (this.down[Codes.right])
                e.setN(N.vx, speed);
            else
                e.setN(N.vx, 0);
            

        }, [N.x, N.y, N.vx, N.vy])
    }
}