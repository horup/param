import {N, S, A} from './parameters';
import { State, SystemManager, System, Entity } from "../../param";

export type DynaState = State<N, S, A>;
export type DynaEntity = Entity<N, S, A>;
export type DynaSystemManager = SystemManager<N, S, A>;
export type DynaSystem = System<N, S, A>;

export * from './parameters';
export * from './entitites';
