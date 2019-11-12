import * as PIXI from 'pixi.js';
import {State, SP, NP} from './domain';

let state:State = null;
try
{
    state = JSON.parse(localStorage.getItem("current"));
    if (state == null)
        throw "state is null";
    Object.setPrototypeOf(state, State.prototype);
}
catch(ex)
{
    state = new State();
}


const app = new PIXI.Application();
 
document.body.appendChild(app.view);

let stage = new PIXI.Container();
let graphics = new PIXI.Graphics();

stage.addChild(graphics);
app.stage.addChild(stage);
app.view.onclick = (ev)=>
{
    let e = state.newEntity();
    e.setNP(NP.x, ev.offsetX);
    e.setNP(NP.y, ev.offsetY);
    e.setNP(NP.health, 100);

    console.log(ev);
}
app.ticker.add(()=>
{
    graphics.clear();
    graphics.beginFill(0xFF0000)
    state.forEach(e=>
    {
        let health = e.getNP(NP.health);
        graphics.drawCircle(e.getNP(NP.x),e.getNP(NP.y), health);

        e.setNP(NP.health, --health);
        if (health <= 0)
            state.delete(e.id);

        }, [NP.x, NP.y, NP.health]);
    graphics.endFill();

    localStorage.setItem("current", JSON.stringify(state));
});