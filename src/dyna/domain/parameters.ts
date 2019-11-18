export enum N
{
    /** x position of the entity */
    x,

    /** y position of the entity */
    y,

    /** x velocity of the entity */
    vx,

    /** y velocity of the entity */
    vy,

    /** direction of the entity */
    direction,

    /** health of the entity */
    health,

    /** 1 if the entity is solid
     *  2 if the entity is soft, but solid, i.e. can pass through other soft entities */
    solid,

    anchorX,
    anchorY,

    /** the size of a grid in both dimension */
    gridSize,

    /** current number of avaliable bombs */
    bombs,

    /** number of max avaliable bombs */
    bombsMax,
    /** number of frames for the sprite */
    frames

}

export enum S
{
    /** visible title of the entity */
    title,

    /** name of the sprite used for the entity */
    sprite,
}


export enum A
{
    /** a 2d grid of entities, assumed to be an array of entity ids of length = gridSize*gridSize */
    blockGrid,

    /** a 2d grid of bombs, each cell can only hold a single bomb, length = gridSize*gridSize */
    bombGrid
}