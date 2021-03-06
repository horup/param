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

    /** 1 if the entity is solid and cannot be destroyed
     *  2 if the entity is solid but can be destroyed */
    solid,

    anchorX,
    anchorY,

    /** the size of a grid in both dimension */
    gridSize,

    /** current number of avaliable bombs */
    bombs,

    /** number of max avaliable bombs */
    bombsMax,

    /** current frame */
    frame,

    /** fuse of a bomb entity, when it reaches 0 it goes boom! */
    fuse,

    /** length of the flame produced by an explosion */
    flame,

    /** Life of a flame, when it reaches 0 it is exstingished */
    flameLife,

    /** sprite used for entity, should be a value from Sprite enum */
    sprite 

}

export enum S
{
    /** visible title of the entity */
    title,

    /** points to an entity id which 'owns' the entity */
    owner
}


export enum A
{
    /** a 2d grid of entities, assumed to be an array of entity ids of length = gridSize*gridSize */
    blockGrid,

    /** a 2d grid of bombs, each cell can only hold a single bomb, length = gridSize*gridSize */
    bombGrid
}


export enum SpriteType
{
    player,
    bomb,
    block,
    flame, 
    tile
}