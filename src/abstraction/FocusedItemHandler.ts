export type ItemPosition = ItemPosition1D | ItemPosition2D | ItemPosition3D;

export interface ItemPosition1D {
    index: number;
}

export interface ItemPosition2D {
    row: number;
    column: number;
}

export interface ItemPosition3D {
    row: number;
    column: number;
    level: number;
}

export interface FocusedItemHandler {
    notifyFocusedItem(position: ItemPosition);
}

export function isPosition1D(position: ItemPosition): position is ItemPosition1D {
    return (position as ItemPosition1D).index !== undefined;
}

export function isPosition2D(position: ItemPosition): position is ItemPosition2D {
    return (position as ItemPosition2D).row !== undefined && (position as ItemPosition2D).column !== undefined;
}

export function isPosition3D(position: ItemPosition): position is ItemPosition3D {
    return (position as ItemPosition3D).row !== undefined && (position as ItemPosition3D).column !== undefined && (position as ItemPosition3D).level !== undefined;
}