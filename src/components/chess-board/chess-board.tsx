import { Component, h, Prop, State, Listen, Watch, Host } from '@stencil/core';
import { BoardSide, SquareCoordinates, DirectionalNavigabilityStrategy, WhiteSideNavigabilityStrategy, BlackSideNavigabilityStrategy, ChessPiece, BoardModel, BoardView } from '../../utils/chess-utils';
import { DirectionalNavigable } from '../../abstraction/DirectionalNavigable';
import { BoardRenderer, WhiteSideRenderer, BlackSideRenderer } from './BoardRenderer';


@Component({
    tag: 'chess-board',
    styleUrl: 'chess-board.css',
    shadow: true
})
export class ChessBoard implements DirectionalNavigable {

    @Prop() side: BoardSide = BoardSide.white;

    @State() boardModel: BoardModel;


    private focusedSquare: SquareCoordinates;
    private boardView: BoardView;
    private navigabilityStrategy: DirectionalNavigabilityStrategy;
    private boardRenderer: BoardRenderer;

    @Watch('side')
    sideChanged(newSide: BoardSide) {
        this.setNavigationAndRenderStrategies(newSide);
    }

    @Listen('squareFocused')
    protected squareFocusedHandler(event: CustomEvent<SquareCoordinates>) {
        this.focusedSquare = event.detail;
    }

    componentWillLoad() {
        this.setNavigationAndRenderStrategies(this.side);
        this.boardModel = this.generateDefaultPosition();
    }

    componentWillRender() {
        this.boardView = this.boardRenderer.renderBoard(this.boardModel);
    }

    getLeftItem(): HTMLElement {
        const leftCoordinates = this.navigabilityStrategy.getLeftCoordinates(this.focusedSquare);
        return this.boardView[leftCoordinates.row][leftCoordinates.column];
    }

    getRightItem(): HTMLElement {
        const RightCoordinates = this.navigabilityStrategy.getRightCoordinates(this.focusedSquare);
        return this.boardView[RightCoordinates.row][RightCoordinates.column];
    }

    getUpItem(): HTMLElement {
        const upCoordinates = this.navigabilityStrategy.getUpCoordinates(this.focusedSquare);
        return this.boardView[upCoordinates.row][upCoordinates.column];
    }

    getDownItem(): HTMLElement {
        const downCoordinates = this.navigabilityStrategy.getDownCoordinates(this.focusedSquare);
        return this.boardView[downCoordinates.row][downCoordinates.column];
    }

    render() {
        return (
            <Host role="application">
                <keyboardNavigationListener navigable={this}>
                    {this.boardView.map((row: HTMLElement[]) => {
                        row.map((square: HTMLElement) => square);
                    })
                    }
                    {this.boardRenderer.renderRowHeader()}
                    {this.boardRenderer.renderColumnHeader()}
                </keyboardNavigationListener>
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

    setNavigationAndRenderStrategies(side: BoardSide) {
        if (side === BoardSide.white) {
            this.navigabilityStrategy = new WhiteSideNavigabilityStrategy();
            this.boardRenderer = new WhiteSideRenderer();
        } else {
            this.navigabilityStrategy = new BlackSideNavigabilityStrategy();
            this.boardRenderer = new BlackSideRenderer();
        }
    }

}
