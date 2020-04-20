import { h } from '@stencil/core';
import { BoardModel, BoardView, ChessPiece, BoardSide, arrayToBoardColumn, arrayToBoardRow } from "../../utils/chess-utils";

export interface BoardRenderer {
    renderBoard(model: BoardModel): BoardView;
    renderRowHeader(): HTMLElement;
    renderColumnHeader(): HTMLElement;
}

export class WhiteSideRenderer implements BoardRenderer {

    renderBoard(model: BoardModel): BoardView {
        const view: BoardView = [];
        model.forEach((row: ChessPiece[], i: number) => {
            const rowView: HTMLElement[] = [];
            row.forEach((square: ChessPiece, j: number) => {
                rowView.push(
                    <chessSquare
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

    renderColumnHeader(): HTMLElement {
        const cols = Array.from(Array(8).keys());
        return (
            <div class="col-headers">
                {cols.map((i: number) => {
                    return (
                        <div class="col-header">
                            {arrayToBoardColumn(i)}
                        </div>
                    );
                })
                }
            </div>
        );
    }

    renderRowHeader(): HTMLElement {
        const rows = Array.from(Array(8).keys());
        return (
            <div class="row-headers">
                {rows.map((i: number) => {
                    return (
                        <div class="row-header">
                            {arrayToBoardRow(i)}
                        </div>
                    );
                })
                }
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
                    <chessSquare
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

    renderColumnHeader(): HTMLElement {
        const cols = Array.from(Array(8).keys());
        return (
            <div>
                {cols.forEach((i: number) => {
                    return (
                        <div class="col-header">
                            {arrayToBoardColumn(i)}
                        </div>
                    );
                })
                }
            </div>
        );
    }

    renderRowHeader(): HTMLElement {
        const rows = Array.from(Array(8).keys());
        return (
            <div>
                {rows.forEach((i: number) => {
                    return (
                        <div class="row-header">
                            {arrayToBoardRow(i)}
                        </div>
                    );
                })
                }
            </div>
        );
    }

}
