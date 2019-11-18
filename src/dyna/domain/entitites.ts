import { DynaState, DynaEntity } from ".";
import { N, A } from "./parameters";

export class Grid
{
    e:DynaEntity;
    
    private constructor(e:DynaEntity)
    {
        this.e = e;
    }

    getBlockId(x:number, y:number):string | null
    {
        let e = this.e;
        let [bombGrid, blockGrid] = e.getAArray(A.bombGrid, A.blockGrid);
        let gridSize = e.getN(N.gridSize);
        if (bombGrid == null || blockGrid == null || gridSize == null)
            return null;
        let i = gridSize * Math.floor(y) + Math.floor(x);

        if (i>=0 && i < gridSize * gridSize)
            return blockGrid[i];

        return null;
    }

    getBombId(x:number, y:number):string | null
    {
        let e = this.e;
        let [bombGrid, blockGrid] = e.getAArray(A.bombGrid, A.blockGrid);
        let gridSize = e.getN(N.gridSize);
        if (bombGrid == null || blockGrid == null || gridSize == null)
            return null;
        let i = gridSize * Math.floor(y) + Math.floor(x);

        if (i>=0 && i < gridSize * gridSize)
            return bombGrid[i];

        return null;
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


    static firstGrid(state:DynaState):Grid | null
    {
        let e = state.getFirstN(N.gridSize);
        if (e == null)
            return null;
        else 
            return new Grid(e);
    }
}