
export type ChessPiece = "K" | "Q" | "R" | "B" | "N" | "P" | "k" | "q" | "r" | "b" | "n" | "p" | null;

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

export interface SquareCoordinates {
    row: number;
    column: number;
}

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
    getLeftCoordinates(current: SquareCoordinates): SquareCoordinates;
    getRightCoordinates(current: SquareCoordinates): SquareCoordinates;
    getUpCoordinates(current: SquareCoordinates): SquareCoordinates;
    getDownCoordinates(current: SquareCoordinates): SquareCoordinates;
}

export class WhiteSideNavigabilityStrategy implements DirectionalNavigabilityStrategy {

    getLeftCoordinates(current: SquareCoordinates): SquareCoordinates {
        if (current.column === 0) return current;
        return { row: current.row, column: current.column - 1 };
    }

    getRightCoordinates(current: SquareCoordinates): SquareCoordinates {
        if (current.column === 7) return current;
        return { row: current.row, column: current.column + 1 };
    }

    getUpCoordinates(current: SquareCoordinates): SquareCoordinates {
        if (current.row === 0) return current;
        return { row: current.row - 1, column: current.column };
    }

    getDownCoordinates(current: SquareCoordinates): SquareCoordinates {
        if (current.row === 7) return current;
        return { row: current.row + 1, column: current.column };
    }

}

export class BlackSideNavigabilityStrategy implements DirectionalNavigabilityStrategy {

    getLeftCoordinates(current: SquareCoordinates): SquareCoordinates {
        if (current.column === 7) return current;
        return { row: current.row, column: current.column + 1 };
    }

    getRightCoordinates(current: SquareCoordinates): SquareCoordinates {
        if (current.column === 0) return current;
        return { row: current.row, column: current.column - 1 };
    }

    getUpCoordinates(current: SquareCoordinates): SquareCoordinates {
        if (current.row === 7) return current;
        return { row: current.row + 1, column: current.column };
    }

    getDownCoordinates(current: SquareCoordinates): SquareCoordinates {
        if (current.row === 0) return current;
        return { row: current.row - 1, column: current.column };
    }

}
