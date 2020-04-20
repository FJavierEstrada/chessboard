import { Component, h, Prop, Host } from '@stencil/core';
import { ChessPieceDescription, arrayToBoardRow, arrayToBoardColumn, BoardSide, ChessPiece } from '../../utils/chess-utils';

enum SquareColour { white, black }

@Component({
    tag: 'chess-square',
    styleUrl: 'chess-square.css',
    shadow: false
})
export class ChessSquare {

    @Prop() row!: number;
    @Prop() column!: number;
    @Prop() piece?: ChessPiece;
    @Prop() side!: BoardSide;

    private getColour = (): SquareColour => {
        if ((this.row + this.column) % 2 === 0) return SquareColour.white;
        else return SquareColour.black;
    }

    private getAccessibleDescription = (): string => {
        return `${arrayToBoardRow(this.row)}${arrayToBoardColumn(this.column)} - ${this.piece ? ChessPieceDescription[this.piece] : ""}`;
    }

    private isFirstSquare = (): boolean => {
        if (this.side === BoardSide.white && this.row === 0 && this.column === 0) return true;
        if (this.side === BoardSide.black && this.row === 7 && this.column === 7) return true;
        return false;
    }

    render() {
        return (
            <Host
                class={{
                    "white-square": this.getColour() === SquareColour.white,
                    "black-square": this.getColour() === SquareColour.black,
                }}
                role="gridcell"
                aria-label={this.getAccessibleDescription()}
            >
                <focusableItem
                    position={{ row: this.row, column: this.column }}
                    isInTabSequence={this.isFirstSquare()}
                >
                    <keyboardNavigable>
                        {this.piece}
                    </keyboardNavigable>
                </focusableItem>
            </Host >
        );
    }
}