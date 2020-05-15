import { Component, h, State } from '@stencil/core';
import { BoardSide, BoardModel, ChessPiece } from '../../utils/chess-utils';


@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
  shadow: true
})
export class AppRoot {

  @State() side: BoardSide = BoardSide.white;
  @State() boardModel: BoardModel = this.generateDefaultPosition();

  toggleSide = () => {
    console.debug("Toggling board side.");
    console.debug(this.side);
    if (this.side === BoardSide.white) this.side = BoardSide.black;
    else this.side = BoardSide.white;
  }

  render() {
    return (
      <div>
        <header>
          <h1>Chessboard</h1>
        </header>

        <main>
          <chess-board
            side={this.side}
            boardModel={this.boardModel}
          />
          <button onClick={this.toggleSide}>Toggle side</button>
        </main>
      </div>
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

}
