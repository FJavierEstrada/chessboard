import { h } from '@stencil/core';
import { BoardModel, BoardView, ChessPiece, BoardSide, arrayToBoardColumn, arrayToBoardRow } from "../../utils/chess-utils";
import { ItemPosition2D } from '../../abstraction/FocusedItemHandler';

export interface BoardRenderer {
    renderBoard(model: BoardModel, selectedPosition?: ItemPosition2D): BoardView;
    renderNumber(row: number): HTMLElement;
    renderCharacters(): HTMLElement[];
}

export class WhiteSideRenderer implements BoardRenderer {

    renderBoard(model: BoardModel, selectedPosition?: ItemPosition2D): BoardView {
        const view: BoardView = [];
        model.forEach((row: ChessPiece[], i: number) => {
            const rowView: HTMLElement[] = [];
            row.forEach((square: ChessPiece, j: number) => {
                rowView.push(
                    <chess-square
                        key={`${i}${j}`}
                        row={i}
                        column={j}
                        piece={square}
                        side={BoardSide.white}
                        selected={selectedPosition && selectedPosition.row === i && selectedPosition.column === j}
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

    renderBoard(model: BoardModel, selectedPosition?: ItemPosition2D): BoardView {
        const view: BoardView = [];
        [...model].reverse().forEach((row: ChessPiece[], i: number) => {
            const rowView: HTMLElement[] = [];
            row.reverse().forEach((square: ChessPiece, j: number) => {
                rowView.push(
                    <chess-square
                        key={`${i}${j}`}
                        row={7 - i}
                        column={7 - j}
                        piece={square}
                        side={BoardSide.black}
                        selected={selectedPosition && selectedPosition.row === i && selectedPosition.column === j}
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
