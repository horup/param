import * as PIXI from 'pixi.js';
import {State, SP, NP, SystemManager} from './domain';
import { SpawnSystem } from './systems/spawnSystem';
import { RenderSystem } from './systems/renderSystem';
import { PersistenceSystem } from './systems/persistenceSystem';

import { CleanupSystem } from './systems/cleanupSystem';

const app = new PIXI.Application();
let state:State = new State();
const systemManager = new SystemManager();

systemManager.addSystem(SpawnSystem);
systemManager.addSystem(CleanupSystem);

systemManager.addSystem(RenderSystem, app.stage);
systemManager.addSystem(PersistenceSystem);
 
document.body.appendChild(app.view);

let stage = new PIXI.Container();

app.stage.addChild(stage);
app.view.onclick = (ev)=>
{
    systemManager.onClick(ev.offsetX, ev.offsetY, state);
}
app.ticker.add((dt)=>
{
    systemManager.tick(state, dt);
});