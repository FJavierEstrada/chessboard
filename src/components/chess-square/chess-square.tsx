import { Component, h, Prop, Host, Listen, Event, EventEmitter } from '@stencil/core';
import { ChessPiece, arrayToBoardRow, arrayToBoardColumn, BoardSide, SquareCoordinates } from '../../utils/chess-utils';
import { KeyboardNavigable } from '../keyboard-navigable/keyboard-navigable';

enum SquareColour { white, black }

@Component({
    tag: 'chess-square',
    styleUrl: 'chess-square.css',
    shadow: true
})
export class ChessSquare {

    @Prop() row!: number;
    @Prop() column!: number;
    @Prop() piece?: string;
    @Prop() side!: BoardSide;

    @Event() squareFocused: EventEmitter<SquareCoordinates>;

    @Listen('focus')
    protected focusHandler() {
        this.squareFocused.emit({ row: this.row, column: this.column });
    }

    private getColour = (): SquareColour => {
        if ((this.row + this.column) % 2 === 0) return SquareColour.white;
        else return SquareColour.black;
    }

    private getAccessibleDescription = (): string => {
        return `${arrayToBoardRow(this.row)}${arrayToBoardColumn(this.column)} - ${this.piece ? ChessPiece[this.piece] : ""}`;
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
                tabindex={this.isFirstSquare ? 0 : -1}
                aria-label={this.getAccessibleDescription()}
            >
                <KeyboardNavigable>
                    {this.piece}
                </KeyboardNavigable>
            </Host >
        );
    }
}
