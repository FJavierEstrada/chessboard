## 1 - Introducción

Stencil JS es un framework que nos permite crear web components reusables con cualquier tecnología web fácilmente debido a que se basa en el estándar de HTML. Sin embargo, una de las dificultades que podemos encontrarnos es la duplicidad de código. Los web components no soportan mecanismos de herencia. ¿Tenemos que reescribir (o copiar) nuestro código entonces cuando encontremos componentes que compartan muchas características pero sean ligeramente diferentes?

En este tutorial vamos a aprender a usar la composición de componentes para reutilizar nuestro código al máximo y eliminar las duplicidades. Para ello, veremos un ejemplo con un tablero de ajedrez al que tendremos que añadir capacidades de navegación por teclado. Esta funcionalidad podría ser reutilizada más adelante en otros componentes como menús.

Si todavía no sabes qué es Stencil JS o cómo funciona, te recomiendo visitar primero el [tutorial de Stencil](https://www.adictosaltrabajo.com/2019/01/31/reutilizando-web-components-generados-por-stencil/).

## 2 - Entorno

Este tutorial se ha realizado con el siguiente entorno de trabajo:

* Hardware: SlimBook Pro X (Intel I7, 32 GB RAM)
* Sistema operativo: Windows 10
* IDE: Visual Studio Code + Extensión Stencil Tools
* NodeJS 12.13.1
* Stencil JS 1.8.8

## 3 - Entendiendo el problema

Todos hemos utilizado alguna vez una hoja de cálculo. Aunque puede asimilarse a una tabla, posee características propias que la distinguen, sobre todo a nivel de interacción. Podemos desplazar el foco con las flechas del teclado. Podemos escribir en las celdas. Podemos incluso seleccionar valores de una lista desplegable, filtrar u ordenar las columnas.

También conocemos bien el funcionamiento de los menús. Aunque podemos manejarlos con el ratón, igual que las hojas de cálculo, a veces es más cómodo tirar del teclado y moverse rápidamente por ellos.

Estos dos tipos de widgets comparten algo fundamental: la navegación por teclado. En ambos se implementa funcionalidad que responde a las pulsaciones de las flechas. Parecería lógico pensar que, al margen de las diferencias, podríamos abstraer este comportamiento en una clase o interfaz *KeyboardNavigable*. Sin embargo, cuando trabajamos con web components, nos encontramos con un problema: los web componentes no soportan la herencia.

Parecemos abocados a la duplicación masiva de código. Pero, ¿podemos resolverlo de alguna forma? Sí. La solución que se debe adoptar cuando trabajamos con web components es la composición de componentes. Podéis verlo como un patrón *decorator*. Encapsulamos ciertos comportamientos en web components independientes, y luego decoramos con ellos los componentes a los que queramos agregar esta funcionalidad.

Simple, ¿no? Quizá no tanto… Vamos a verlo con más detalle en un ejemplo. Como a mí me gusta el ajedrez, vamos a crear un tablero por el que podremos desplazar el foco utilizando las flechas. ¡Justo como en las hojas de cálculo! ¿Empezáis a notar la necesidad de reutilizar código? Además, como tengo un firme compromiso con la accesibilidad, vamos a procurar que el tablero puedan usarlo personas invidentes. Ya veréis como no es muy difícil. Será una buena manera de descubrir todo lo que se puede hacer por la gente que más lo necesita.

## 4 - Empezamos a trabajar

¡Manos a la obra! Lo primero es crear un proyecto nuevo de Stencil. Con el entorno que tenemos configurado, esto es tan simple como abrir la paleta de comandos y buscar por *Stencil*. Encontraremos el omando *start a new project*. En nuestro caso, vamos a crear directamente una aplicación web. Seguimos el pequeño asistente y, ¡ya lo tenemos listo!

### 4.1 - Encapsular el código para reutilizar

Reutilizar código es siempre una buena idea. No sólo escribimos menos, sino que es más fácil realizar test y se obtiene un producto más mantenible. Tradicionalmente, se ha utilizado la herencia de clases para reutilizar código. Sin embargo, no siempre es la mejor solución. Diferentes patrones de diseño pueden aplicarse a ciertos problemas para solventar las limitaciones que tiene el enfoque de la herencia.

En nuestro caso, directamente no podemos realizar herencia entre web components. Aunque podríamos crear clases abstractas que no hicieran uso de la API de Stencil, estaríamos desaprovechando gran parte del poder que esta nos ofrece. Por tanto, debemos buscar una alternativa viable.

Aquí entra en juego la composición de componentes, valga la redundancia. Igual que agrupamos los elementos HTML básicos unos dentro de otros, también podemos hacer lo mismo con los web components. La única diferencia es que nosotros vamos a aprovechar esta capacidad no sólo para crear una jerarquía y una lógica de presentación, sino que también vamos a crear "componentes de comportamiento". Estos se limitarán a encapsular una cierta funcionalidad, de modo que, al componerlos dentro de otros, otorguen sus capacidades sin necesidad de duplicar el código constantemente.

Vamos a utilizar un patrón de arquitectura emiter-listener-handler. Commo veréis a continuación, es una solución que se adapta muy bien al problema. El primer componente se encarga de capturar los eventos básicos que queremos controlar y envolverlos para facilitar su escucha. El listener se encargará de escuchar los eventos del emiter. Sin embargo, no dispone de ninguna información acerca del componente concreto que estemos desarrollando. Por eso debe apoyarse en el handler, que será una implementación concreta y limitada para cada caso. De este modo, dos de los tres componentes pueden reutilizarse para cualquier otro problema similar, mientras que sólo debemos implementar una tercera parte del código y componerlo con el resto. Fantástico, ¿verdad? Vamos a ver cómo hacerlo con dos ejemplos.

#### 4.1.1 - Navegación por teclado

Como hemos dicho, estamos comprometidos con la accesibilidad. Vamos a crear una estructura de componentes que nos permita navegar con las teclas de dirección del teclado. Así podremos desplazar el foco por las distintas casillas del tablero de ajedrez.

##### 4.1.1.1 - Valores de las teclas

Lo primero que vamos a hacer es crear un *enum* con los valores que se devuelven con las pulsaciones por teclado de determinadas teclas. Así los tendremos siempre a mano y el IDE nos ayudará a autocompletar. Aquí he recogido más teclas de las que vamos a utilizar por pura comodidad. Son las que más vamos a usar para implementar navegación por teclado. Así las tendremos listas si queremos ampliar la funcionalidad.

Creamos el directorio *utils* y dentro el fichero *keyboard-utils.ts*:

```
export enum KeyCodes {
    BACKSPACE = 'Backspace',
    TAB = 'Tab',
    RETURN = 'Enter',
    ESC = 'Escape',
    SPACE = ' ',
    PAGE_UP = 'PageUp',
    PAGE_DOWN = 'PageDown',
    END = 'End',
    HOME = 'Home',
    LEFT = 'ArrowLeft',
    UP = 'ArrowUp',
    RIGHT = 'ArrowRight',
    DOWN = 'ArrowDown',
    DELETE = 'Delete'
}
```

##### 4.1.1.2 - El componente KeyboardNavigable

Como hemos comentado antes, vamos a crear un componente emiter que envuelva los eventos de teclado. Desde el explorador de proyecto, hacemos clic derecho en la carpeta *src/components* y elegimos *generate Stencil component*. Llamaremos a nuestro componente **KeyboardNavigable**. La extensión nos genera un componente ya preconfigurado. Agregamos el flag para deshabilitar shadow Dom en la anotación **@Component** de forma que sea transparente.

Vamos a agregar aquí el lanzamiento de eventos cuando se presionen las teclas que queremos manejar. Esto evitará tener que comprobar todos los eventos de teclado en el listener, de modo que será más limpio y eficiente. Para ello, utilizaremos las anotaciones **@Event** para lanzar los eventos personalizados y **@Listen** para escuchar el teclado.

```
import { Component, h, Host, Event, EventEmitter, Event, EventEmitter, Event, EventEmitter, Event, EventEmitter, Listen } from '@stencil/core';
import { KeyCodes } from '../../utils/keyboard-utils';


@Component({
    tag: 'keyboard-navigable',
    styleUrl: 'keyboard-navigable.css',
    shadow: false
})
export class KeyboardNavigable {

    @Event() upArrow: EventEmitter<any>;
    @Event() downArrow: EventEmitter<any>;
    @Event() leftArrow: EventEmitter<any>;
    @Event() rightArrow: EventEmitter<any>;

    @Listen('keyup')
    protected keyupHandler(event: KeyboardEvent) {
        switch (event.key) {
            case KeyCodes.UP:
                event.stopPropagation();
                this.upArrow.emit();
                break;
            case KeyCodes.DOWN:
                event.stopPropagation();
                this.downArrow.emit();
                break;
            case KeyCodes.LEFT:
                event.stopPropagation();
                this.leftArrow.emit();
                break;
            case KeyCodes.RIGHT:
                event.stopPropagation();
                this.rightArrow.emit();
        }
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

Algunas notas sobre este componente:
* Como solo nos interesa la tecla que se ha pulsado, el evento puede llevar cualquier tipo de valor.
* Usamos *keyup* y no *keydown* por motivos de accesibilidad. Este evento solo se llama una vez al soltar la tecla, mientras que *keydown* puede llamarse múltiples veces durante una pulsación prolongada.
* Utilizamos el atributo *role=none* en el elemento *Host* para que el componente sea ignorado por la capa de accesibilidad. Solo encapsula comportamiento, no queremos que se represente de ninguna forma al usuario. Esto no impide que lo que haya dentro mediante el *slot* se presente al usuario. Utilizar el atributo *aria-hidden* para ese propósito.

##### 4.1.1.3 - La interfaz KeyboardNavigationHandler

Como hemos visto, hay una infinidad de widgets que pueden requerir de la navegación por teclado. En nuestro caso, que la hemos simplificado a cuatro teclas, debemos tener una forma para que esta navegación se personalice en cada caso sin necesidad de duplicar el código.

Vamos a crear una carpeta llamada *abstractions* en la que crearemos la interfaz *KeyboardNavigationHandler*:

```
export interface KeyboardNavigationHandler {
    getLeftItem(): HTMLElement | undefined;
    getRightItem(): HTMLElement | undefined;
    getUpItem(): HTMLElement | undefined;
    getDownItem(): HTMLElement | undefined;
}
```

Especificamos que el tipo retornado es HTMLElement | undefined para prevenir problemas con el tipado estricto. Si usamos tipado flexible, no es necesario, pero puede provocar errores en otros puntos del sistema.

##### 4.1.1.4 - El componente KeyboardNavigationListener

Aquí tenemos la pieza final del conjunto. Creamos un nuevo componente que actuará como listener de los eventos lanzados por **KeyboardNavigable**:

```
import { Component, h, Prop, Host, Listen } from '@stencil/core';
import { KeyboardNavigationHandler } from '../../abstraction/KeyboardNavigationHandler';


@Component({
    tag: 'keyboard-navigation-listener',
    styleUrl: 'keyboard-navigation-listener.css',
    shadow: false
})
export class KeyboardNavigationListener {

    @Prop() handler: KeyboardNavigationHandler;

    @Listen('upArrow')
    protected upArrowHandler() {
        const itemToFocus = this.handler.getUpItem();
        this.focus(itemToFocus);
    }

    @Listen('downArrow')
    protected downArrowHandler() {
        const itemToFocus = this.handler.getDownItem();
        this.focus(itemToFocus);
    }

    @Listen('leftArrow')
    protected leftArrowHandler() {
        const itemToFocus = this.handler.getLeftItem();
        this.focus(itemToFocus);
    }

    @Listen('rightArrow')
    protected rightArrowHandler() {
        const itemToFocus = this.handler.getRightItem();
        this.focus(itemToFocus);
    }

    focus(item: HTMLElement | undefined) {
        if (item !== undefined) item.focus();
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

Algunas notas sobre el componente:
* Contiene la propiedad **handler** que debe ser asignada por su padre. De esta forma, podemos recuperar el elemento al que hay que desplazar el foco sin importar el contexto concreto. De eso se encarga cada widget específico.
* Sólo hacemos foco si el valor devuelto por el padre no es *undefined*. En caso contrario, no hay acción.
* Como **KeyboardNavigable**, el *role* del elemento *Host* es none y no tiene shadow DOM.

#### 4.1.2 - Manejo del foco

Hay que tener en cuenta que el foco también puede ser desplazado por el ratón. No sirve únicamente con controlar los eventos de teclado y actualizar los datos cuando estos ocurran. Por eso, debemos realizar un diseño similar para los eventos de foco cuando se desplace a uno de los items, en nuestro caso, las casillas.

##### 4.1.2.1 - El componente FocusableItem

Este será el emiter para el evento de foco. Como veis, es muy similar al *KeyboardNavigable*:

```
import { Component, h, Prop, Event, EventEmitter, Host, Listen } from '@stencil/core';
import { ItemPosition } from '../../abstraction/FocusedItemHandler';


@Component({
    tag: 'focusable-item',
    styleUrl: 'focusable-item.css',
    shadow: false
})
export class FocusableItem {

    @Prop() isInTabSequence: boolean = false;
    @Prop() position!: ItemPosition;
    @Event() focusedItem: EventEmitter<ItemPosition>;

    @Listen('focus')
    protected focusHandler() {
        this.focusedItem.emit(this.position);
    }

    render() {
        return (
            <Host
                tabindex={this.isInTabSequence ? 0 : -1}
            >
                <slot />
            </Host>
        );
    }
}
```

Algunas notas sobre este componente:
* La Propiedad isInTabSequence se utiliza para determinar si el componente se debe incluir en la secuencia del tabulador. Como Normalmente no nos interesa, la ponemos por defecto a false. Sin embargo, puede ser útil incluirla en el primer componente hijo para que podamos empezar a desplazar el foco con las flechas a partir de él.
* En este caso, el evento que emitimos lleva asociada la posición del item. Este dato puede ser interesante para el conocimiento del padre. A continuación veremos cómo usarla.

##### 4.1.2.2 - FocusedItemHandler

Como con la navegación de teclado, vamos a crear una interfaz que actúe de handler y que se implemente en cada caso concreto. Lo único que hará en este caso será recibir notificaciones de cambio de foco con la posición del elemento enfocado. Debemos tener en cuenta que nuestros componentes pueden ser de varias dimensiones distintas. Nuestro tablero tiene dos dimensiones, pero un menú tiene una y un gráfico SVG que emule un entorno puede tener tres. Aprovecharemos la potencia que nos ofrece TypeScript para lidiar con este asunto y proporcionar un componente que permita trabajar con todos los casos:

```
export type ItemPosition = ItemPosition1D | ItemPosition2D | ItemPosition3D;

export interface ItemPosition1D {
    index: number;
}

export interface ItemPosition2D {
    row: number;
    column: number;
}

export interface ItemPosition3D {
    row: number;
    column: number;
    level: number;
}

export interface FocusedItemHandler {
    notifyFocusedItem(position: ItemPosition);
}

export function isPosition1D(position: ItemPosition): position is ItemPosition1D {
    return (position as ItemPosition1D).index !== undefined;
}

export function isPosition2D(position: ItemPosition): position is ItemPosition2D {
    return (position as ItemPosition2D).row !== undefined && (position as ItemPosition2D).column !== undefined;
}

export function isPosition3D(position: ItemPosition): position is ItemPosition3D {
    return (position as ItemPosition3D).row !== undefined && (position as ItemPosition3D).column !== undefined && (position as ItemPosition3D).level !== undefined;
}
```

Hemos definido que el tipo **ItemPosition** es la unión de los tres casos que podemos encontrarnos. Además, ofrecemos funciones de type guarding para poder trabajar cómodamente con ellas.

##### 4.1.2.3 - El componente FocusedItemListener

Ya sólo nos queda implementar el listener para el manejo del foco. No hay ucho que comentar al respecto. Como antes, este componente se apoya en el handler:

```
import { Component, h, Host, Prop, Listen } from '@stencil/core';
import { FocusedItemHandler, ItemPosition } from '../../abstraction/FocusedItemHandler';


@Component({
    tag: 'focused-item-listener',
    styleUrl: 'focused-item-listener.css',
    shadow: false
})
export class FocusedItemListener {

    @Prop() handler!: FocusedItemHandler;

    @Listen('focusedItem')
    protected focusedItemHandler(event: CustomEvent<ItemPosition>) {
        this.handler.notifyFocusedItem(event.detail);
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

### 4.2 - Aplicar la solución a nuestro problema

Una vez que hemos construido las piezas básicas que vamos a reutilizar para diferentes componentes, vamos a usarlas en nuestro caso concreto, el tablero de ajedrez. Tendremos un componente básico **ChessSquare** que representa cada casilla y el componente global **ChessBoard** que engloba todo el conjunto y contiene la lógica.

Es importante resaltar que vamos a plantear nuestro modelo virtual de tablero según la representación del mismo cuando lo ponemos del lado del blanco, desde la esquina superior izquierda a la inferior derecha. Así, la posición [0, 0] del modelo virtual se corresponderá con la casilla A8, y la posición [7, 7] con la casilla H1.

#### 4.12.1 - Algunas utilidades auxiliares

Debemos tener en cuenta que el tablero de ajedrez se representa de forma parecida, pero a la vez distinta, a una matriz bidimensional. En lugar de dos componentes numéricas, las columnas se especifican mediante una letra de la A a la H. Además, dado que el tablero puede girarse, la representación gráfica no coincide nunca con el modelo. Vamos a crear el archivo *utils/chess-utils.ts*. Para empezar, definiremos algunos tipos y enums que nos harán la vida más sencilla:

```
export type ChessPiece = "K" | "Q" | "R" | "B" | "N" | "P" | "k" | "q" | "r" | "b" | "n" | "p" | null;

export type BoardModel = ChessPiece[][];

export type BoardView = HTMLElement[][];

export enum ChessPieceDescription {
    K = "White king",
    Q = "White queen",
    R = "White Rook",
    B = "White bishop",
    N = "White knight",
    P = "White pawn",
    k = "Black king",
    q = "Black queen",
    r = "Black rook",
    b = "Black Bishop",
    n = "Black knight",
    p = "Black pawn"
}

export enum BoardSide { white, black }
```

También tenemos que crear algunas utilidades que nos permitan traducir de un sistema al otro. Esto también influye a la hora de interpretar a qué casilla se debe mover cuando pulsamos una tecla. Para este caso, implementamos un patrón estrategia:

```
export function arrayToBoardColumn(col: number): string | undefined {
    switch (col) {
        case 0: return "A";
        case 1: return "B";
        case 2: return "C";
        case 3: return "D";
        case 4: return "E";
        case 5: return "F";
        case 6: return "G";
        case 7: return "H";
    }
}

export function arrayToBoardRow(row: number): number | undefined {
    if (row >= 0 && row <= 7) {
        return 8 - row;
    }
    else return undefined;
}

export interface DirectionalNavigabilityStrategy {
    getLeftCoordinates(current: ItemPosition2D): ItemPosition2D;
    getRightCoordinates(current: ItemPosition2D): ItemPosition2D;
    getUpCoordinates(current: ItemPosition2D): ItemPosition2D;
    getDownCoordinates(current: ItemPosition2D): ItemPosition2D;
}

export class WhiteSideNavigabilityStrategy implements DirectionalNavigabilityStrategy {

    getLeftCoordinates(current: ItemPosition2D): ItemPosition2D {
        if (current.column === 0) return current;
        return { row: current.row, column: current.column - 1 };
    }

    getRightCoordinates(current: ItemPosition2D): ItemPosition2D {
        if (current.column === 7) return current;
        return { row: current.row, column: current.column + 1 };
    }

    getUpCoordinates(current: ItemPosition2D): ItemPosition2D {
        if (current.row === 0) return current;
        return { row: current.row - 1, column: current.column };
    }

    getDownCoordinates(current: ItemPosition2D): ItemPosition2D {
        if (current.row === 7) return current;
        return { row: current.row + 1, column: current.column };
    }

}

export class BlackSideNavigabilityStrategy implements DirectionalNavigabilityStrategy {

    getLeftCoordinates(current: ItemPosition2D): ItemPosition2D {
        if (current.column === 7) return current;
        return { row: current.row, column: current.column + 1 };
    }

    getRightCoordinates(current: ItemPosition2D): ItemPosition2D {
        if (current.column === 0) return current;
        return { row: current.row, column: current.column - 1 };
    }

    getUpCoordinates(current: ItemPosition2D): ItemPosition2D {
        if (current.row === 7) return current;
        return { row: current.row + 1, column: current.column };
    }

    getDownCoordinates(current: ItemPosition2D): ItemPosition2D {
        if (current.row === 0) return current;
        return { row: current.row - 1, column: current.column };
    }

}
```

Como se puede apreciar, ya que nuestro tablero es un componente bidimensional, utilizamos **ItemPosition2D** en lugar del tipo genérico **ItemPosition**.

#### 4.2.2 - El componente ChessSquare

Como hemos dicho, este componente representa cada casilla del tablero. Para cada una, tendremos que saber su posición, si tiene una pieza y cuál es en caso afirmativo, y el color de la casilla. Algunos de estos datos pueden ser calculados a partir de otros. Además, incluiremos los dos emiter de nuestra arquitectura para incorporar su comportamiento:

```
import { Component, h, Prop, Host } from '@stencil/core';
import { ChessPieceDescription, arrayToBoardRow, arrayToBoardColumn, BoardSide, ChessPiece } from '../../utils/chess-utils';

enum SquareColour { white, black }

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

    private getColour = (): SquareColour => {
        if ((this.row + this.column) % 2 === 0) return SquareColour.white;
        else return SquareColour.black;
    }

    private getAccessibleDescription = (): string => {
        return `${arrayToBoardRow(this.row)}${arrayToBoardColumn(this.column)} - ${this.piece ? ChessPieceDescription[this.piece] : ""}`;
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
                aria-label={this.getAccessibleDescription()}
            >
                <focusableItem
                    position={{ row: this.row, column: this.column }}
                    isInTabSequence={this.isFirstSquare()}
                >
                    <keyboardNavigable>
                        {this.piece}
                    </keyboardNavigable>
                </focusableItem>
            </Host >
        );
    }
}
```

Como vemos, la complejidad referente a la navegación y el manejo del foco ha sido incorporada con un par de etiquetas. Lo único que hace el componente es preocuparse por la representación gráfica y algunos cálculos necesarios para este caso concreto.

#### 4.2.3 - Board renderers

#### 4.2.4 - El componente ChessBoard


## 6 - Conclusiones

