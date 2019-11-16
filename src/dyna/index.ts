import { State, SystemManager, System } from '../param';
import { N, S, A} from './parameters';

export * from './parameters';


export type DynaState = State<N, S, A>;
export type DynaSystemManager = SystemManager<N, S, A>;
export type DynaSystem = System<N, S, A>;