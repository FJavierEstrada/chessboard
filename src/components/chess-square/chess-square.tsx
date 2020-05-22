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
    @Prop() selected: boolean = false;

    private getColour = (): SquareColour => {
        if ((this.row + this.column) % 2 === 0) return SquareColour.white;
        else return SquareColour.black;
    }

    private getAccessibleDescription = (): string => {
        return `${arrayToBoardColumn(this.column)}${arrayToBoardRow(this.row)} - ${this.piece ? ChessPieceDescription[this.piece] : ""}`;
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
                    selected: this.selected
                }}
            >
                <keyboard-navigable>
                    <activable-item position={{ row: this.row, column: this.column }}>
                        <focusable-item
                            position={{ row: this.row, column: this.column }}
                            isInTabSequence={this.isFirstSquare()}
                            role="button"
                            aria-label={this.getAccessibleDescription()}
                            aria-pressed={this.selected ? "true" : "false"}
                        >
                            <div class="hidder" aria-hidden="true">
                                {this.piece}
                            </div>
                        </focusable-item>
                    </activable-item>
                </keyboard-navigable>
            </Host >
        );
    }
}
