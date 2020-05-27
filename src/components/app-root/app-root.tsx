import { Component, h, State, Listen } from '@stencil/core';
import { BoardSide, BoardModel, ChessPiece, ChessMove, ChessPieceDescription, arrayToBoardColumn, arrayToBoardRow } from '../../utils/chess-utils';


@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
  shadow: true
})
export class AppRoot {

  @State() side: BoardSide = BoardSide.white;
  @State() boardModel: BoardModel = this.generateDefaultPosition();
  @State() moveNotificationMsg: string = "";

  @Listen('move')
  protected moveHandler(event: CustomEvent<ChessMove>) {
    const move = event.detail;
    this.changeMoveNotification(move);
    this.movePiece(move);
  }

  movePiece = (move: ChessMove) => {
    const piece = this.boardModel[move.start.row][move.start.column];
    this.boardModel[move.start.row][move.start.column] = null;
    this.boardModel[move.end.row][move.end.column] = piece;
  }

  changeMoveNotification = (move: ChessMove) => {
    const piece = this.boardModel[move.start.row][move.start.column] as string;
    const pieceDescription = ChessPieceDescription[piece];
    const verb = this.boardModel[move.end.row][move.end.column] === null ? "moves to " : "takes";
    const endSquare = `${arrayToBoardColumn(move.end.column)}${arrayToBoardRow(move.end.row)}`;
    this.moveNotificationMsg = `${pieceDescription} ${verb} ${endSquare}`;
  }

  toggleSide = () => {
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
          <div class="sr-only" aria-live="polite" aria-atomic="true">
            {this.moveNotificationMsg}
          </div>
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
