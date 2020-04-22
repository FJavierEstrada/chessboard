import { h } from '@stencil/core';
import { BoardModel, BoardView, ChessPiece, BoardSide, arrayToBoardColumn, arrayToBoardRow } from "../../utils/chess-utils";

export interface BoardRenderer {
    renderBoard(model: BoardModel): BoardView;
    renderNumber(row: number): HTMLElement;
    renderCharacters(): HTMLElement[];
}

export class WhiteSideRenderer implements BoardRenderer {

    renderBoard(model: BoardModel): BoardView {
        const view: BoardView = [];
        model.forEach((row: ChessPiece[], i: number) => {
            const rowView: HTMLElement[] = [];
            row.forEach((square: ChessPiece, j: number) => {
                rowView.push(
                    <chess-square
                        row={i}
                        column={j}
                        piece={square}
                        side={BoardSide.white}
                    />
                );
            });
            view.push(rowView);
        });
        return view;
    }

    renderCharacters(): HTMLElement[] {
        const cols = Array.from(Array(8).keys());
        return cols.map((i: number) => {
            return (
                <div class="col-header">
                    {arrayToBoardColumn(i)}
                </div>
            );
        })
    }

    renderNumber(row: number): HTMLElement {
        return (
            <div class="row-header">
                {arrayToBoardRow(row)}
            </div>
        );
    }

}

export class BlackSideRenderer implements BoardRenderer {

    renderBoard(model: BoardModel): BoardView {
        const view: BoardView = [];
        [...model].reverse().forEach((row: ChessPiece[], i: number) => {
            const rowView: HTMLElement[] = [];
            row.reverse().forEach((square: ChessPiece, j: number) => {
                rowView.push(
                    <chess-square
                        row={7 - i}
                        column={7 - j}
                        piece={square}
                        side={BoardSide.black}
                    />
                );
            });
            view.push(rowView);
        });
        return view;
    }

    renderCharacters(): HTMLElement[] {
        const cols = Array.from(Array(8).keys());
        return cols.map((i: number) => {
            return (
                <div class="col-header">
                    {arrayToBoardColumn(i)}
                </div>
            );
        })
    }

    renderNumber(row: number): HTMLElement {
        return (
            <div class="row-header">
                {9 - (arrayToBoardRow(row) as number)}
            </div>
        );
    }

}
