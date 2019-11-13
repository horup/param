import * as PIXI from 'pixi.js';
import {State, SP, NP, SystemManager} from './domain';
import { SpawnSystem } from './systems/spawnSystem';
import { RenderSystem } from './systems/renderSystem';

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

let graphics = new PIXI.Graphics();

const systemManager = new SystemManager();
systemManager.addSystem(SpawnSystem);
systemManager.addSystem(RenderSystem, graphics);

const app = new PIXI.Application();
 
document.body.appendChild(app.view);

let stage = new PIXI.Container();

stage.addChild(graphics);
app.stage.addChild(stage);
app.view.onclick = (ev)=>
{
    systemManager.onClick(ev.offsetX, ev.offsetY, state);
}
app.ticker.add((dt)=>
{
    systemManager.tick(state, dt);
   /* graphics.clear();
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

    localStorage.setItem("current", JSON.stringify(state));*/
});