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

### 4.1 - Encapsular la navegación

#### 4.1.1 - Valores de las teclas

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

#### 4.1.2 - El componente KeyboardNavigable

Como hemos comentado antes, vamos a crear un componente que encapsule la capacidad de navegación. Desde el explorador de proyecto, hacemos clic derecho en la carpeta *src/components* y elegimos *generate Stencil component*. Llamaremos a nuestro componente **KeyboardNavigable**. La extensión nos genera un componente ya preconfigurado. Agregamos el flag para deshabilitar shadow Dom en la anotación **@Component** de forma que sea transparente.

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

#### 4.1.3 - La interfaz DirectionalNavigable

Como hemos visto, hay una infinidad de widgets que pueden requerir de la navegación por teclado. En nuestro caso, que la hemos simplificado a cuatro teclas, debemos tener una forma para que esta navegación se personalice en cada caso sin necesidad de duplicar el código.

Vamos a crear una carpeta llamada *abstractions* en la que crearemos la interfaz *DirectionalNavigable*:

```
export interface DirectionalNavigable {
    getLeftItem(): HTMLElement | undefined;
    getRightItem(): HTMLElement | undefined;
    getUpItem(): HTMLElement | undefined;
    getDownItem(): HTMLElement | undefined;
}
```

Especificamos que el tipo retornado es HTMLElement | undefined para prevenir problemas con el tipado estricto. Si usamos tipado flexible, no es necesario, pero puede provocar errores en otros puntos del sistema.

#### 4.1.4 - El componente KeyboardNavigationListener

Aquí tenemos la pieza final del conjunto. Creamos un nuevo componente que actuará como listener de los eventos lanzados por **KeyboardNavigable**:

```
import { Component, h, Prop, Host, Listen } from '@stencil/core';
import { DirectionalNavigable } from '../../abstraction/DirectionalNavigable';


@Component({
    tag: 'keyboard-navigation-listener',
    styleUrl: 'keyboard-navigation-listener.css',
    shadow: false
})
export class KeyboardNavigationListener {

    @Prop() navigable!: DirectionalNavigable;

    @Listen('upArrow')
    protected upArrowHandler() {
        const itemToFocus = this.navigable.getUpItem();
        this.focus(itemToFocus);
    }

    @Listen('downArrow')
    protected downArrowHandler() {
        const itemToFocus = this.navigable.getDownItem();
        this.focus(itemToFocus);
    }

    @Listen('leftArrow')
    protected leftArrowHandler() {
        const itemToFocus = this.navigable.getLeftItem();
        this.focus(itemToFocus);
    }

    @Listen('rightArrow')
    protected rightArrowHandler() {
        const itemToFocus = this.navigable.getRightItem();
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
* Contiene la propiedad **navigable** que debe ser asignada por su padre. De esta forma, podemos recuperar el elemento al que hay que desplazar el foco sin importar el contexto concreto. De eso se encarga cada widget específico.
* Sólo hacemos foco si el valor devuelto por el padre no es *undefined*. En caso contrario, no hay acción.
* Como **KeyboardNavigable**, el *role* del elemento *Host* es none y no tiene shadow DOM.

### 4.2. - Aplicar la navegación a nuestros componentes

Una vez que hemos definido el sistema de navegación, vamos a implementarlo para comprobar que funciona correctamente. Para nuestro caso, tendremos dos componentes principales: ChessBoard y ChessSquare. El primero define el comportamiento general del tablero, mientras que el segundo representa una de las casillas o escaques. Veremos cómo componerlos para obtener el resultado deseado. Pero antes, vamos a necesitar unos pequeños añadidos para interpretar correctamente el tablero mediante accesibilidad.

#### 4.2.1 - Intérprete de piezas

Aunque podríamos utilizar imágenes para representar las piezas en el tablero, pretendemos que este ejemplo sea lo más simple posible. Por eso, vamos a utilizar una representación textual con las iniciales de cada una. Podríamos pensar que basta con ponerlas de uno u otro color, pero ten en cuenta que, igual que las piezas son blancas o negras, las casillas también. Esto podría causar problemas de contraste.

Como solución, vamos a utilizar la misma nomenclatura que la [notación FEN](https://es.wikipedia.org/wiki/Notaci%C3%B3n_de_Forsyth-Edwards). Las piezas blancas irán en mayúscula y las negras en minúscula. Para ello, vamos a crear un enum en *utils/chess-utils.ts*:

```
export enum ChessPiece {
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
```

Usaremos las letras como representación gráfica. Para cuestiones de accesibilidad, utilizaremos esta traducción. Bastará con utilizar el enum como si fuera un objeto, pasando como clave la inicial.

#### 4.2.2 - Intérprete de casillas

Seguro que alguna vez has visto un tablero de ajedrez y te han llamado la atención las letras y los números que se sitúan en los bordes. Aunque podrían usarse para jugar al Hundir la flota, el propósito es identificar de forma unívoca cada casilla del tablero. Aunque existen diferentes notaciones para expresar los movimientos en ajedrez, la más extendida es la [notación algebraica](https://es.wikipedia.org/wiki/Notaci%C3%B3n_algebraica). En esta se identifican las casillas con el par letra-número. Para trasladar esto a nuestro ámbito, debemos tener en cuenta dos cosas:

* El modelo del tablero lo representaremos como una matriz bidimensional. Las matrices admiten como argumentos en sus posiciones números, no letras.`Además, empiezan en 0, no en 1.
* El tablero empieza con la posición A1 en la esquina inferior izquierda y termina en H8 en la esquina superior derecha. Eso siempre que se represente del lado de las blancas.

Parece evidente que necesitamos una forma de traducir de un sistema al otro, de forma que podamos trabajar de manera transparente. Así que, vamos a añadir algunas cosas más a nuestro archivo *utils/chess-utils.ts*:

```
export enum BoardSide { white, black }

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
```

Con esto, ya estamos listos para crear los componentes.

#### 4.2.3 - El componente ChessSquare

Este componente representa la mínima unidad del tablero. En él almacenaremos los datos para su representación, incluida la pieza, si la hubiera. Además, añadiremos el componente **KeyboardNavigable**: