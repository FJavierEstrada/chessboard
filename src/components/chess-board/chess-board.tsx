import { Component, h, Prop, State, Watch, Host, Element } from '@stencil/core';
import { BoardSide, DirectionalNavigabilityStrategy, WhiteSideNavigabilityStrategy, BlackSideNavigabilityStrategy, ChessPiece, BoardModel } from '../../utils/chess-utils';
import { BoardRenderer, WhiteSideRenderer, BlackSideRenderer } from './BoardRenderer';
import { FocusedItemHandler, ItemPosition, ItemPosition2D, isPosition2D } from '../../abstraction/FocusedItemHandler';
import { KeyboardNavigationHandler } from '../../abstraction/KeyboardNavigationHandler';


@Component({
    tag: 'chess-board',
    styleUrl: 'chess-board.css',
    shadow: true
})
export class ChessBoard implements KeyboardNavigationHandler, FocusedItemHandler {

    @Prop() side!: BoardSide;

    @State() boardModel: BoardModel;
    @State() navigabilityStrategy: DirectionalNavigabilityStrategy;
    @State() boardRenderer: BoardRenderer;


    @Element() element: HTMLElement;

    private focusedSquare: ItemPosition2D;

    @Watch('side')
    sideChanged(newSide: BoardSide, oldSide: BoardSide) {
        console.debug("Watching side");
        this.setNavigationAndRenderStrategies(newSide);
    }

    componentWillLoad() {
        this.setNavigationAndRenderStrategies(this.side);
        this.boardModel = this.generateDefaultPosition();
    }

    getLeftItem(): HTMLElement {
        const leftCoordinates = this.navigabilityStrategy.getLeftCoordinates(this.focusedSquare);
        const square = this.getSquareToFocus(leftCoordinates);
        return square.querySelector("focusable-item") as HTMLElement;
    }

    getRightItem(): HTMLElement {
        const RightCoordinates = this.navigabilityStrategy.getRightCoordinates(this.focusedSquare);
        const square = this.getSquareToFocus(RightCoordinates);
        return square.querySelector("focusable-item") as HTMLElement;
    }

    getUpItem(): HTMLElement {
        const upCoordinates = this.navigabilityStrategy.getUpCoordinates(this.focusedSquare);
        const square = this.getSquareToFocus(upCoordinates);
        return square.querySelector("focusable-item") as HTMLElement;
    }

    getDownItem(): HTMLElement {
        const downCoordinates = this.navigabilityStrategy.getDownCoordinates(this.focusedSquare);
        const square = this.getSquareToFocus(downCoordinates);
        return square.querySelector("focusable-item") as HTMLElement;
    }

    notifyFocusedItem(position: ItemPosition) {
        if (isPosition2D(position)) {
            this.focusedSquare = position;
        }
    }

    render() {
        return (
            <Host role="application">
                <focused-item-listener handler={this}>
                    <keyboard-navigation-listener handler={this}>
                        <div class="board">
                            <div class="top-header">
                                {this.boardRenderer.renderCharacters()}
                            </div>

                            {this.boardRenderer.renderBoard(this.boardModel).map((row: HTMLElement[], index: number) => {
                                return (
                                    <div class="row">
                                        <div class="number">
                                            {this.boardRenderer.renderNumber(index)}
                                        </div>
                                        {row}
                                        <div class="number">
                                            {this.boardRenderer.renderNumber(index)}
                                        </div>
                                    </div>
                                )
                            })
                            }

                            <div class="bottom-header">
                                {this.boardRenderer.renderCharacters()}
                            </div>
                        </div>
                    </keyboard-navigation-listener>
                </focused-item-listener>
            </Host>
        );
    }

    private generateDefaultPosition(): BoardModel {
        function generateFilledRow(piece: ChessPiece): ChessPiece[] {
            const row: ChessPiece[] = [];
            for (let i = 0; i < 8; i++) {
                row.push(piece);
            }
            return row;
        }

        const board: BoardModel = [];
        board.push(["r", "n", "b", "q", "k", "b", "n", "r"]);
        board.push(generateFilledRow("p"));
        for (let i = 2; i < 6; i++) {
            board.push(generateFilledRow(null));
        }
        board.push(generateFilledRow("P"));
        board.push(["R", "N", "B", "Q", "K", "B", "N", "R"]);
        return board;
    }

    private setNavigationAndRenderStrategies(side: BoardSide) {
        if (side === BoardSide.white) {
            this.navigabilityStrategy = new WhiteSideNavigabilityStrategy();
            this.boardRenderer = new WhiteSideRenderer();
        } else {
            this.navigabilityStrategy = new BlackSideNavigabilityStrategy();
            this.boardRenderer = new BlackSideRenderer();
        }
    }

    private getSquareToFocus(position: ItemPosition2D): HTMLElement {
        const squareCollection = (this.element.shadowRoot as ShadowRoot).querySelectorAll("chess-square");
        return squareCollection.item(this.navigabilityStrategy.translateCoordinatesToOneDimension(position)) as HTMLElement;
    }

}
