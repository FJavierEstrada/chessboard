import { ItemPosition2D } from "../abstraction/FocusedItemHandler";

export type ChessPiece = "K" | "Q" | "R" | "B" | "N" | "P" | "k" | "q" | "r" | "b" | "n" | "p" | null;

export type BoardModel = ChessPiece[][];

export type BoardView = HTMLElement[][];

export enum ChessPieceDescription {
    K = "White king",
    Q = "White queen",
    R = "White Rook",
    B = "White bishop",
    N = "White knight",
    P = "White pawn",
    k = "Black king",
    q = "Black queen",
    r = "Black rook",
    b = "Black Bishop",
    n = "Black knight",
    p = "Black pawn"
}

export enum BoardSide { white, black }

export function arrayToBoardColumn(col: number): string | undefined {
    switch (col) {
        case 0: return "A";
        case 1: return "B";
        case 2: return "C";
        case 3: return "D";
        case 4: return "E";
        case 5: return "F";
        case 6: return "G";
        case 7: return "H";
    }
}

export function arrayToBoardRow(row: number): number | undefined {
    if (row >= 0 && row <= 7) {
        return 8 - row;
    }
    else return undefined;
}

export interface DirectionalNavigabilityStrategy {
    getLeftCoordinates(current: ItemPosition2D): ItemPosition2D;
    getRightCoordinates(current: ItemPosition2D): ItemPosition2D;
    getUpCoordinates(current: ItemPosition2D): ItemPosition2D;
    getDownCoordinates(current: ItemPosition2D): ItemPosition2D;
    translateCoordinatesToOneDimension(position: ItemPosition2D): number;
}

export class WhiteSideNavigabilityStrategy implements DirectionalNavigabilityStrategy {

    getLeftCoordinates(current: ItemPosition2D): ItemPosition2D {
        if (current.column === 0) return current;
        return { row: current.row, column: current.column - 1 };
    }

    getRightCoordinates(current: ItemPosition2D): ItemPosition2D {
        if (current.column === 7) return current;
        return { row: current.row, column: current.column + 1 };
    }

    getUpCoordinates(current: ItemPosition2D): ItemPosition2D {
        if (current.row === 0) return current;
        return { row: current.row - 1, column: current.column };
    }

    getDownCoordinates(current: ItemPosition2D): ItemPosition2D {
        if (current.row === 7) return current;
        return { row: current.row + 1, column: current.column };
    }

    translateCoordinatesToOneDimension(position: ItemPosition2D): number {
        return position.row * 8 + position.column;
    }

}

export class BlackSideNavigabilityStrategy implements DirectionalNavigabilityStrategy {

    getLeftCoordinates(current: ItemPosition2D): ItemPosition2D {
        if (current.column === 7) return current;
        return { row: current.row, column: current.column + 1 };
    }

    getRightCoordinates(current: ItemPosition2D): ItemPosition2D {
        if (current.column === 0) return current;
        return { row: current.row, column: current.column - 1 };
    }

    getUpCoordinates(current: ItemPosition2D): ItemPosition2D {
        if (current.row === 7) return current;
        return { row: current.row + 1, column: current.column };
    }

    getDownCoordinates(current: ItemPosition2D): ItemPosition2D {
        if (current.row === 0) return current;
        return { row: current.row - 1, column: current.column };
    }

    translateCoordinatesToOneDimension(position: ItemPosition2D): number {
        return 63 - (position.row * 8 + position.column);
    }

}
