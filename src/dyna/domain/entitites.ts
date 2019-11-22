import { DynaState, DynaEntity } from ".";
import { N, A } from "./parameters";

export class Grid
{
    e:DynaEntity;
    
    private constructor(e:DynaEntity)
    {
        this.e = e;
    }

    private get(x:number, y:number, a:A)
    {
        let e = this.e;
        let grid = e.getA(a);
        let gridSize = e.getN(N.gridSize);
        if (grid == null || gridSize == null)
            return null;
        if (x<0 || x >= gridSize || y<0 || y>=gridSize)
            return null;
            
        let i = gridSize * Math.floor(y) + Math.floor(x);

        if (i>=0 && i < gridSize * gridSize)
            return grid[i];

        return null;
    }

    getBlockId(x:number, y:number):string | null
    {
        return this.get(x, y, A.blockGrid);
    }

    getBombId(x:number, y:number):string | null
    {
        return this.get(x, y, A.bombGrid);
    }

    setBombId(x:number, y:number, id:string | null)
    {
        let e = this.e;
        let [bombGrid, blockGrid] = e.getAArray(A.bombGrid, A.blockGrid);
        let gridSize = e.getN(N.gridSize);
        if (bombGrid == null || blockGrid == null || gridSize == null)
            return false;
        let i = gridSize * Math.floor(y) + Math.floor(x);

        if (i>=0 && i < gridSize * gridSize)
        {
            bombGrid[i] = id;
            return true;
        }

        return false;
    }


    getState()
    {
        return this.e.state;
    }

    static firstGrid(state:DynaState):Grid | null
    {
        let e = state.getFirstN(N.gridSize);
        if (e == null)
            return null;
        else 
            return new Grid(e);
    }
}