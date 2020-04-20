import { Component, h } from '@stencil/core';
import { BoardSide } from '../../utils/chess-utils';


@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
  shadow: true
})
export class AppRoot {

  render() {
    return (
      <div>
        <header>
          <h1>Chessboard</h1>
        </header>

        <main>
          <chessBoard side={BoardSide.white} />
        </main>
      </div>
    );
  }
}
