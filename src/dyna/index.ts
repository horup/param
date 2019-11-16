import { State, SystemManager, System } from '../param';
import { N, S, A, DynaState, DynaSystemManager} from './types';
import * as PIXI from 'pixi.js';
import { SpawnSystem } from './systems/spawnSystem';
import { RenderSystem } from './systems/renderSystem';
import { PersistenceSystem } from './systems/persistenceSystem';

import { CleanupSystem } from './systems/cleanupSystem';
import { playerSystem } from './systems/playerSystem';
import { MovementSystem } from './systems/movementSystem';


export * from './types';

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
const app = new PIXI.Application();
let state:DynaState = new State<N, S, A>();
const systemManager:DynaSystemManager = new SystemManager<N, S, A>();
let stage = new PIXI.Container();

systemManager.addSystem(SpawnSystem);
systemManager.addSystem(playerSystem);
systemManager.addSystem(MovementSystem);
systemManager.addSystem(CleanupSystem);

systemManager.addSystem(RenderSystem, stage);
systemManager.addSystem(PersistenceSystem);
 
document.body.appendChild(app.view);

let scale = 16*2;
stage.scale.set(scale);
app.stage.addChild(stage);
app.view.onclick = (ev)=>
{
    systemManager.onClick(ev.offsetX / scale, ev.offsetY / scale, state);
}
document.onkeydown = (ev)=>
{
    systemManager.onKeydown(ev.keyCode, state);
}
document.onkeyup = (ev)=>
{
    systemManager.onKeyup(ev.keyCode, state);
}
app.ticker.add((dt)=>
{
    systemManager.tick(state, dt);
});