import { Component, h, State } from '@stencil/core';
import { BoardSide } from '../../utils/chess-utils';


@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
  shadow: true
})
export class AppRoot {

  @State() side: BoardSide = BoardSide.white;

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
          <chess-board side={this.side} />
          <button onClick={this.toggleSide}>Toggle side</button>
        </main>
      </div>
    );
  }
}
