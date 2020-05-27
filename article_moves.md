## Índice

<nav aria-label="índice">

* [1 - Introducción](#1)
* [2 - Entorno](#2)

</nav>

<a name="1">

## 1 - Introducción

</a>

Las regiones activas o live regions son fundamentales para la accesibilidad en las aplicaciones modernas. Hace años, la web se componía de documentos estáticos y los únicos cambios en el contenido se producían al cargar nuevas páginas. Hoy en día, estos cambios son completamente dinámicos. Este tipo de comportamiento es especialmente problemático cuando tratamos con usuarios con algún tipo de discapacidad sensorial. Al no percibir las alteraciones del contenido, puede costarles entender qué está pasando y cómo deben actuar en cada momento.

Las regiones activas vienen a solventar este problema. Los cambios en el contenido de una región activa son notificados a las tecnologías de asistencia según las preferencias seleccionadas. En ocasiones, es necesario crear regiones activas específicas para anunciar ciertos mensajes de estado a los usuarios que lo necesiten.

En este tutorial, vamos a ampliar [la aplicación de muestra ChessBoard que ya vimos en otro tutorial](https://www.adictosaltrabajo.com/2020/05/15/reutilizacion-de-codigo-con-web-components/). Vamos a añadir la capacidad de mover las piezas por el tablero y vamos a crear una región activa que anuncie al usuario los movimientos que se llevan a cabo. Por supuesto, esta funcionalidad se va a implementar a grandes rasgos, sin entrar en la validación de los movimientos. Además, vamos a ver cuestiones adicionales de accesibilidad.

<a name="2">

## 2 – Entorno

</a>

*Windows 10

* SlimBook Pro X (Intel I7, 32GB RAM)
* Visual Studio Code

## 3 – Planteando la funcionalidad

Como recordaréis, ChessBoard era una prueba de concepto sobre la reutilización de web components utilizando el framework Stencil JS. Ofrecía la posibilidad de navegar por el tablero con el teclado y anunciaba al usuario el contenido de cada casilla en caso de que no pudiera verlo directamente.

Ahora vamos a añadir la funcionalidad para mover las piezas. Queremos que, ya sea con un clic de ratón o con la pulsación de una tecla de activación, enter o la barra espaciadora, se seleccione una casilla. Si ya hay una casilla seleccionada y se selecciona otra, entonces se intenta ejecutar el movimiento. Por supuesto, en la casilla inicial tendrá que haber una pieza.

Además, queremos anunciar la jugada para que cualquiera pueda entenderla. Vamos a crear una región activa invisible donde haremos estos anuncios.

Por supuesto, seguiremos la idea de dividir nuestra lógica en emitter-listener-handler para encapsular y poder reutilizar el código. Veréis que con este esquema que ya vimos en el tutorial anterior, es muy sencillo añadir este comportamiento sin miedo a que cause problemas con los otros que ya habíamos implementado.

## 4 – Manejo de la activación

Lo primero que vamos a hacer es crear un conjunto de emitter-listener-handler que se responsabilice de este comportamiento. Si esta idea no es familiar, os recomiendo leer antes el tutorial previo que mencionaba antes.

### 4.1. – El componente ActivableItem

Este componente se encargará de detectar los clics y las pulsaciones de teclas de activación. Recibe por propiedad la posición del elemento, para poder adjuntarla cuando emita su propio evento **activatedItem**. Además, también podremos elegir mediante propiedades si queremos que capture las pulsaciones de la barra espaciadora, la tecla enter o ambas. Esto se ha pensado así porque no siempre nos puede interesar el mismo comportamiento.

``` 
import { Component, h, Host, Prop, Event, EventEmitter, Listen } from '@stencil/core';
import { ItemPosition } from '../../abstraction/FocusedItemHandler';
import { KeyCodes } from '../../utils/keyboard-utils';

@Component({
    tag: 'activable-item',
    styleUrl: 'activable-item.css',
    shadow: false
})
export class ActivableItem {

    @Prop() position: ItemPosition;
    @Prop() space: boolean = true;
    @Prop() enter: boolean = true;

    @Event() activatedItem: EventEmitter<ItemPosition>;

    @Listen('click')
    protected clickHandler() {
        this.activatedItem.emit(this.position);
    }

    @Listen('keyup')
    protected keyupHandler(event: KeyboardEvent) {
        function activate(event: KeyboardEvent, emitter: EventEmitter<ItemPosition>, position: ItemPosition) {
            event.preventDefault();
            event.stopPropagation();
            emitter.emit(position);
        }

        if (this.space && event.key === KeyCodes.SPACE) activate(event, this.activatedItem, this.position);
        else if (this.enter && event.key === KeyCodes.RETURN) activate(event, this.activatedItem, this.position);
    }

    render() {
        return (
            <Host role="none">
                <slot />
            </Host>
        );
    }
}
```

### 4.2 – El componente ActivatedItemListener

A continuación, implementamos el listener para nuestro emitter. Como en el caso del _FocusedItemListener_, sólo notificará al handler de que ha recibido el evento, pasándole la posición.

``` 
import { Component, h, Prop, Host, Listen } from '@stencil/core';
import { ActivatedItemHandler } from '../../abstraction/ActivatedItemHandler';
import { ItemPosition } from '../../abstraction/FocusedItemHandler';

@Component({
    tag: 'activated-item-listener',
    styleUrl: 'activated-item-listener.css',
    shadow: false
})
export class ActivatedItemListener {

    @Prop() handler!: ActivatedItemHandler;

    @Listen('activatedItem')
    protected activatedItemHandler(event: CustomEvent<ItemPosition>) {
        event.stopPropagation();
        this.handler.notifyActivation(event.detail);
    }

    render() {
        return (
            <Host role="none">
                <slot />
            </Host>
        );
    }
}
```

### 4.3 – La interfaz ActivatedItemHandler

Igual que antes, creamos la interfaz que se relaciona con nuestro listener. Se compone sólo de un método sencillo que permite notificar la activación.

``` 
import { ItemPosition } from "./FocusedItemHandler";

export interface ActivatedItemHandler {
    notifyActivation(position: ItemPosition);
}
```

## 5 – Integrar la activación

Ahora vamos a integrar estos elementos que hemos creado en nuestros componentes principales. Como veréis, el esquema de separación por comportamientos facilita mucho la labor. No tendremos que modificar nada de lo que ya teníamos anteriormente. Sólo habrá que añadir nuestro emitter y listener mediante composición, e implementar el handler.

### 5.1 – Las casillas

Os habréis dado cuenta de que en ningún momento estamos controlando con nuestro emitter o listener si hay alguna casilla seleccionada. El motivo es que ellos sólo se ocupan de manejar las activaciones. El estado en que queda el componente padre o hijo después de eso escapa a su responsabilidad.

Vamos a añadir una propiedad al componente _ChessSquare_ que indique si la casilla está seleccionada o no. En función de esto, añadiremos una clase CSS adicional para marcar visualmente la selección. Además, utilizaremos el atributo **aria-pressed**. Este atributo indica si un botón de conmutación (toggle button) está pulsado o no. De esta forma, el usuario que no pueda ver la marca visual, podrá saber si la casilla está seleccionada a través de una tecnología de asistencia como un lector de pantalla.

``` 
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

    // ...

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

```

Y el CSS para la clase selected:

``` 
.selected {
    border: 2px dashed red;
}
```

### 5.2 – El tablero

Como la vez anterior, nuestro componente _ChessBoard_ implementará la interfaz _ActivatedItemHandler_. En este caso, vamos a almacenar en un estado interno la casilla seleccionada si no hay otra. En ese caso, comprobaremos si el movimiento es válido y lanzaremos un evento de movimiento. Si no lo es, lanzaremos un evento de movimiento inválido.

Como notaréis, hay algunas diferencias de implementación con el tutorial anterior. Algunas son simples mejoras de rendimiento. Otras, como pasar el atributo **boardModel** de estado a propiedad, tienen implicaciones más profundas. En este caso, lo que intentamos es que nuestro componente tablero sea lo más agnóstico posible. Él se limita a representar lo que otros le dicen que haga y a manejar la lógica interna. Por eso emitimos el evento, para que sea otro quien lo maneje. En este caso, sólo vamos a modificar la posición y a anunciar la jugada, pero cabría la posibilidad de enviarlo a un servidor o tratarlo de alguna manera. Todo esto es irrelevante para nuestro tablero. Cuanto más ignorante se mantenga, más fácil será integrarlo dentro de cualquier aplicación.

``` 
import { Component, h, Prop, Host, Element, Event, EventEmitter, State } from '@stencil/core';
import { BoardSide, DirectionalNavigabilityStrategy, WhiteSideNavigabilityStrategy, BlackSideNavigabilityStrategy, BoardModel, ChessMove, isValidMove } from '../../utils/chess-utils';
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

    @State() selectedSquare?: ItemPosition2D = undefined;

    @Event() move: EventEmitter<ChessMove>;
    @Event() invalidMove: EventEmitter<ChessMove>;

    // ...
    
    notifyActivation(position: ItemPosition) {
        if (isPosition2D(position)) {
            if (!this.selectedSquare) {
                this.selectedSquare = position;
            } else {
                const move = { start: this.selectedSquare, end: position };
                if (isValidMove(this.selectedSquare, position, this.boardModel)) {
                    this.move.emit(move);
                } else {
                    this.invalidMove.emit(move);
                }
                this.selectedSquare = undefined;
            }
        }
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

                                {this.boardRenderer.renderBoard(this.boardModel, this.selectedSquare).map((row: HTMLElement[], index: number) => {
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

//...

    }
```

También cambiaremos la forma de renderizar. Ahora tendremos en cuenta si hay una casilla seleccionada para añadir dicha propiedad a los componentes _ChessSquare_. De este modo, cuando la posición seleccionada que se almacena como estado en _ChessBoard_ cambie, el tablero se renderizará de nuevo.

``` 
renderBoard(model: BoardModel, selectedPosition?: ItemPosition2D): BoardView {
        const view: BoardView = [];
        [...model].reverse().forEach((row: ChessPiece[], i: number) => {
            const rowView: HTMLElement[] = [];
            row.reverse().forEach((square: ChessPiece, j: number) => {
                rowView.push(
                    <chess-square
                        key={ `${i}${j}` }
                        row={7 - i}
                        column={7 - j}
                        piece={square}
                        side={BoardSide.black}
                        selected={selectedPosition && selectedPosition.row === i && selectedPosition.column === j}
                    />
                );
            });
            view.push(rowView);
        });
        return view;
    }
```

## 6 – Ejecutando los movimientos

La responsabilidad de ejecutar los movimientos y anunciar ls jugadas al usuario queda del lado del componente _app-root_. Este es quien se encarga de mantener el **boardModel** y cambiar el mensaje de la región activa.

Tenemos un par de listener que escuchan los eventos **move** e **invalidMove** que emite el componente _ChessBoard_. Es importante tener en cuenta que primero debemos anunciar la jugada, pues si lo hacemos después de ejecutar el movimiento en el **boardModel** , no tendremos la información necesaria disponible.

``` 
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
    this.boardModel = this.movePiece(move);
  }

  @Listen('invalidMove')
  protected invalidMoveHandler() {
    this.moveNotificationMsg = "Invalid move!";
  }

  movePiece = (move: ChessMove) => {
    const tempBoard = this.boardModel.slice();
    const piece = tempBoard[move.start.row][move.start.column];
    tempBoard[move.start.row][move.start.column] = null;
    tempBoard[move.end.row][move.end.column] = piece;
    return tempBoard;
  }

  changeMoveNotification = (move: ChessMove) => {
    const piece = this.boardModel[move.start.row][move.start.column] as string;
    const pieceDescription = ChessPieceDescription[piece];
    const verb = this.boardModel[move.end.row][move.end.column] === null ? "moves to " : "takes";
    const endSquare = `${arrayToBoardColumn(move.end.column)}${arrayToBoardRow(move.end.row)}` ;
    this.moveNotificationMsg = `${pieceDescription} ${verb} ${endSquare}` ;
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
```

Las regiones activas anuncian cambios al usuario cuando su contenido se modifica. Estos cambios pueden anunciarse de forma parcial o atómica. En el segundo caso, se anuncia todo el contenido, mientras que en el primero sólo se anuncian las partes de este que cambian. En nuestro caso, nos interesa anunciar toda la jugada, aunque sea la misma pieza que la anterior, así que usamos el atributo **aria-atomic** a true.

En cuanto al atributo **aria-live** , es el que se encarga de definir la región aciva. Tenemos los posibles valores _assertive_ y _polite_. El primero se utiliza sobre todo para mensajes de alerta, ya que interrumpe la cola de anuncios establecida. En el segundo caso, se encola el mensaje, que se anunciará cuando llegue su turno.

El contenido de la región activa se actualizará en cuanto el atributo **moveNotificationMsg** cambie, ya que es un estado. El mensaje contiene la pieza, la acción (mover o capturar) y la casilla de destino.

## 7 – Conclusiones

La especificación WAI-ARIA incluida en HTML 5 es muy potente. Hemos visto cómo podemos transmitir al usuario el estado de ciertos elementos, como botones de conmutación. También hemos explorado de forma superficial las características de las regiones activas, que son fundamentales para la accesibilidad en páginas altamente dinámicas.

Además, hemos constatado lo que dijimos en el tutorial anterior en que comenzamos a crear esta aplicación: la composición de comportamientos mediante web components facilita enormemente la labor de integrar funcionalidades nuevas a nuestros componentes.
