import { Component, h, Prop, State, Listen, Watch } from '@stencil/core';
import { BoardSide, SquareCoordinates, DirectionalNavigabilityStrategy, WhiteSideNavigabilityStrategy, BlackSideNavigabilityStrategy } from '../../utils/chess-utils';
import { DirectionalNavigable } from '../../abstraction/DirectionalNavigable';


@Component({
    tag: 'chess-board',
    styleUrl: 'chess-board.css',
    shadow: true
})
export class ChessBoard implements DirectionalNavigable {

    @Prop() side: BoardSide = BoardSide.white;

    @State() focusedSquare: SquareCoordinates;
    @State() boardModel: HTMLElement[][];

    private navigabilityStrategy: DirectionalNavigabilityStrategy;

    @Watch('side')
    sideChanged(newSide: BoardSide) {
        if (newSide === BoardSide.white) this.navigabilityStrategy = new WhiteSideNavigabilityStrategy();
        else this.navigabilityStrategy = new BlackSideNavigabilityStrategy();
    }

    @Listen('squareFocused')
    protected squareFocusedHandler(event: CustomEvent<SquareCoordinates>) {
        this.focusedSquare = event.detail;
    }

    getLeftItem(): HTMLElement {
        const leftCoordinates = this.navigabilityStrategy.getLeftCoordinates(this.focusedSquare);
        return this.boardModel[leftCoordinates.row][leftCoordinates.column];
    }

    getRightItem(): HTMLElement {
        const RightCoordinates = this.navigabilityStrategy.getRightCoordinates(this.focusedSquare);
        return this.boardModel[RightCoordinates.row][RightCoordinates.column];
    }

    getUpItem(): HTMLElement {
        const upCoordinates = this.navigabilityStrategy.getUpCoordinates(this.focusedSquare);
        return this.boardModel[upCoordinates.row][upCoordinates.column];
    }

    getDownItem(): HTMLElement {
        const downCoordinates = this.navigabilityStrategy.getDownCoordinates(this.focusedSquare);
        return this.boardModel[downCoordinates.row][downCoordinates.column];
    }

    render() {
        return (
            <div>
                <p>Hello ChessBoard!</p>
            </div>
        );
    }
}
