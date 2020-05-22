import { Component, h, Prop, State, Watch, Host, Element } from '@stencil/core';
import { BoardSide, DirectionalNavigabilityStrategy, WhiteSideNavigabilityStrategy, BlackSideNavigabilityStrategy, ChessPiece, BoardModel } from '../../utils/chess-utils';
import { BoardRenderer, WhiteSideRenderer, BlackSideRenderer } from './BoardRenderer';
import { FocusedItemHandler, ItemPosition, ItemPosition2D, isPosition2D } from '../../abstraction/FocusedItemHandler';
import { KeyboardNavigationHandler } from '../../abstraction/KeyboardNavigationHandler';
import { ActivatedItemHandler } from '../../abstraction/ActivatedItemHandler';


@Component({
    tag: 'chess-board',
    styleUrl: 'chess-board.css',
    shadow: true
})
export class ChessBoard implements KeyboardNavigationHandler, FocusedItemHandler, ActivatedItemHandler {

    @Prop() side!: BoardSide;
    @Prop() boardModel!: BoardModel;

    navigabilityStrategy: DirectionalNavigabilityStrategy;
    boardRenderer: BoardRenderer;
    private focusedSquare: ItemPosition2D;

    @Element() element: HTMLElement;

    componentWillRender() {
        this.setNavigationAndRenderStrategies(this.side);
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

    notifyActivation(position: ItemPosition) {
        // TODO
    }

    render() {
        return (
            <Host role="application">
                <focused-item-listener handler={this}>
                    <activated-item-listener handler={this}>
                        <keyboard-navigation-listener handler={this}>
                            <div class="board">
                                <div class="corner"></div>
                                {this.boardRenderer.renderCharacters()}
                                <div class="corner"></div>

                                {this.boardRenderer.renderBoard(this.boardModel).map((row: HTMLElement[], index: number) => {
                                    return [
                                        this.boardRenderer.renderNumber(index),
                                        ...row,
                                        this.boardRenderer.renderNumber(index)
                                    ]
                                })
                                }

                                <div class="corner"></div>
                                {this.boardRenderer.renderCharacters()}
                                <div class="corner"></div>
                            </div>
                        </keyboard-navigation-listener>
                    </activated-item-listener>
                </focused-item-listener>
            </Host >
        );
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
