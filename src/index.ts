import * as PIXI from 'pixi.js';
import {State, SP, NP, SystemManager} from './domain';
import { SpawnSystem } from './systems/spawnSystem';
import { RenderSystem } from './systems/renderSystem';
import { PersistenceSystem } from './systems/persistenceSystem';

import { CleanupSystem } from './systems/cleanupSystem';
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
const app = new PIXI.Application();
let state:State = new State();
const systemManager = new SystemManager();
let stage = new PIXI.Container();

systemManager.addSystem(SpawnSystem);
systemManager.addSystem(CleanupSystem);

systemManager.addSystem(RenderSystem, stage);
systemManager.addSystem(PersistenceSystem);
 
document.body.appendChild(app.view);

stage.scale.set(24 * 2);
app.stage.addChild(stage);
app.view.onclick = (ev)=>
{
    systemManager.onClick(ev.offsetX, ev.offsetY, state);
}
document.onkeydown = (ev)=>
{
    systemManager.onKeydown(ev.keyCode, state);
}
app.ticker.add((dt)=>
{
    systemManager.tick(state, dt);
});