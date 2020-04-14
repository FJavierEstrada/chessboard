import { h } from '@stencil/core';
import { BoardModel, BoardView, ChessPiece, BoardSide, arrayToBoardColumn, arrayToBoardRow } from "../../utils/chess-utils";
import { ChessSquare } from "../chess-square/chess-square";

export interface BoardRenderer {
    renderBoard(model: BoardModel): BoardView;
    renderRowHeader(): HTMLElement[];
    renderColumnHeader(): HTMLElement[];
}

export class WhiteSideRenderer implements BoardRenderer {

    renderBoard(model: BoardModel): BoardView {
        const view: BoardView = [];
        model.forEach((row: ChessPiece[], i: number) => {
            const rowView: HTMLElement[] = [];
            row.forEach((square: ChessPiece, j: number) => {
                rowView.push(
                    <ChessSquare
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

    renderColumnHeader(): HTMLElement[] {
        const colHeaders: HTMLElement[] = [];
        for (let i = 0; i < 8; i++) {
            colHeaders.push(
                <div class="col-header">
                    {arrayToBoardColumn(i)}
                </div>
            );
        }
        return colHeaders;
    }

    renderRowHeader(): HTMLElement[] {
        const rowHeaders: HTMLElement[] = [];
        for (let i = 0; i < 8; i++) {
            rowHeaders.push(
                <div class="row-header">
                    {arrayToBoardRow(i)}
                </div>
            );
        }
        return rowHeaders;
    }

}

export class BlackSideRenderer implements BoardRenderer {

    renderBoard(model: BoardModel): BoardView {
        const view: BoardView = [];
        [...model].reverse().forEach((row: ChessPiece[], i: number) => {
            const rowView: HTMLElement[] = [];
            row.reverse().forEach((square: ChessPiece, j: number) => {
                rowView.push(
                    <ChessSquare
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

    renderColumnHeader(): HTMLElement[] {
        const colHeaders: HTMLElement[] = [];
        for (let i = 7; i >= 0; i--) {
            colHeaders.push(
                <div class="col-header">
                    {arrayToBoardColumn(i)}
                </div>
            );
        }
        return colHeaders;
    }

    renderRowHeader(): HTMLElement[] {
        const rowHeaders: HTMLElement[] = [];
        for (let i = 7; i >= 0; i--) {
            rowHeaders.push(
                <div class="row-header">
                    {arrayToBoardRow(i)}
                </div>
            );
        }
        return rowHeaders;
    }

}
