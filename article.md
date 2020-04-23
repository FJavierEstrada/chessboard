## 1 - Introducción

Stencil JS es un framework que nos permite crear web components reusables con cualquier tecnología web fácilmente debido a que se basa en el estándar de HTML. Sin embargo, una de las dificultades que podemos encontrarnos es la duplicidad de código. Los web components no soportan mecanismos de herencia. ¿Tenemos que reescribir (o copiar) nuestro código cuando encontremos componentes que compartan muchas características pero sean ligeramente diferentes?

En este tutorial vamos a aprender a usar la composición de componentes para reutilizar nuestro código al máximo y eliminar las duplicidades. Para ello, veremos un ejemplo con un tablero de ajedrez al que tendremos que añadir capacidades de navegación por teclado. Esta funcionalidad podría ser reutilizada más adelante en otros componentes como menús. 

Si todavía no sabes qué es Stencil JS o cómo funciona, te recomiendo visitar primero el [tutorial de Stencil](https://www.adictosaltrabajo.com/2019/01/31/reutilizando-web-components-generados-por-stencil/). 

## 2 - Entorno

Este tutorial se ha realizado con el siguiente entorno de trabajo:

* Hardware: SlimBook Pro X (Intel I7, 32 GB RAM)
* Sistema operativo: Windows 10
* IDE: Visual Studio Code + Extensión Stencil Tools
* NodeJS 12. 13. 1
* Stencil JS 1. 8. 8

## 3 - Entendiendo el problema

Todos hemos utilizado alguna vez una hoja de cálculo. Aunque puede asimilarse a una tabla, posee características propias que la distinguen, sobre todo a nivel de interacción. Podemos desplazar el foco con las flechas del teclado. Podemos escribir en las celdas. Podemos incluso seleccionar valores de una lista desplegable, filtrar u ordenar las columnas. 

También conocemos bien el funcionamiento de los menús. Aunque podemos manejarlos con el ratón, igual que las hojas de cálculo, a veces es más cómodo tirar del teclado y moverse rápidamente por ellos. 

Estos dos tipos de widgets comparten algo fundamental: la navegación por teclado. En ambos se implementa funcionalidad que responde a las pulsaciones de las flechas. Parecería lógico pensar que, al margen de las diferencias, podríamos abstraer este comportamiento en una clase o interfaz *KeyboardNavigable*. Sin embargo, cuando trabajamos con web components, nos encontramos con un problema: los web componentes no soportan la herencia. 

Parecemos abocados a la duplicación masiva de código. Pero, ¿podemos resolverlo de alguna forma? Sí. La solución que se debe adoptar cuando trabajamos con web components es la composición de componentes. Podéis verlo como un patrón *decorator*. Encapsulamos ciertos comportamientos en web components independientes, y luego decoramos con ellos los componentes a los que queramos agregar esta funcionalidad. 

Simple, ¿no? Quizá no tanto… Vamos a verlo con más detalle en un ejemplo. Como a mí me gusta el ajedrez, vamos a crear un tablero por el que podremos desplazar el foco utilizando las flechas. ¡Justo como en las hojas de cálculo! ¿Empezáis a notar la necesidad de reutilizar código? Además, como tengo un firme compromiso con la accesibilidad, vamos a procurar que el tablero puedan usarlo personas invidentes. Ya veréis como no es muy difícil. Será una buena manera de descubrir todo lo que se puede hacer por la gente que más lo necesita. 

## 4 - Empezamos a trabajar

¡Manos a la obra! Lo primero es crear un proyecto nuevo de Stencil. Con el entorno que tenemos configurado, esto es tan simple como abrir la paleta de comandos y buscar por *Stencil*. Encontraremos el omando *start a new project*. En nuestro caso, vamos a crear directamente una aplicación web. Seguimos el pequeño asistente y, ¡ya lo tenemos listo!

Antes de seguir, podemos detenernos a limpiar el proyecto. Como veréis, la extensión ha generado unas cuantas cosas por defecto. Nos valdrá quedarnos con el componente *app-root*. También podemos eliminar el paquete de Stencil Router, ya que no vamos a utilizarlo. También podemos agregar Jest a nuestras dependencias para los test. 

``` 
npm install --save @types/jest
```

### 4. 1 - Encapsular el código para reutilizar

Reutilizar código es siempre una buena idea. No sólo escribimos menos, sino que es más fácil realizar test y se obtiene un producto más mantenible. Tradicionalmente, se ha utilizado la herencia de clases para reutilizar código. Sin embargo, no siempre es la mejor solución. Diferentes patrones de diseño pueden aplicarse a ciertos problemas para solventar las limitaciones que tiene el enfoque de la herencia. 

En nuestro caso, directamente no podemos realizar herencia entre web components. Aunque podríamos crear clases abstractas que no hicieran uso de la API de Stencil, estaríamos desaprovechando gran parte del poder que esta nos ofrece. Por tanto, debemos buscar una alternativa viable. 

Aquí entra en juego la composición de componentes, valga la redundancia. Igual que agrupamos los elementos HTML básicos unos dentro de otros, también podemos hacer lo mismo con los web components. La única diferencia es que nosotros vamos a aprovechar esta capacidad no sólo para crear una jerarquía y una lógica de presentación, sino que también vamos a crear "componentes de comportamiento". Estos se limitarán a encapsular una cierta funcionalidad, de modo que, al componerlos dentro de otros, otorguen sus capacidades sin necesidad de duplicar el código constantemente. 

Vamos a utilizar un patrón de arquitectura emitter-listener-handler. Commo veréis a continuación, es una solución que se adapta muy bien al problema. El primer componente se encarga de capturar los eventos básicos que queremos controlar y envolverlos para facilitar su escucha. El listener se encargará de escuchar los eventos del emiter. Sin embargo, no dispone de ninguna información acerca del componente concreto que estemos desarrollando. Por eso debe apoyarse en el handler, que será una implementación concreta y limitada para cada caso. De este modo, dos de los tres componentes pueden reutilizarse para cualquier otro problema similar, mientras que sólo debemos implementar una tercera parte del código y componerlo con el resto. Fantástico, ¿verdad? Vamos a ver cómo hacerlo con dos ejemplos. 

#### 4. 1. 1 - Navegación por teclado

Como hemos dicho, estamos comprometidos con la accesibilidad. Vamos a crear una estructura de componentes que nos permita navegar con las teclas de dirección del teclado. Así podremos desplazar el foco por las distintas casillas del tablero de ajedrez. 

##### 4. 1. 1. 1 - Valores de las teclas

Lo primero que vamos a hacer es crear un *enum* con los valores que se devuelven con las pulsaciones por teclado de determinadas teclas. Así los tendremos siempre a mano y el IDE nos ayudará a autocompletar. Aquí he recogido más teclas de las que vamos a utilizar por pura comodidad. Son las que más vamos a usar para implementar navegación por teclado. Así las tendremos listas si queremos ampliar la funcionalidad. 

Creamos el directorio *utils* y dentro el fichero *keyboard-utils. ts*:

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

##### 4. 1. 1. 2 - El componente KeyboardNavigable

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
* Es importante detener la propagación de los *KeyboardEvent* para que no sean escuchados por emitters que estén por encima. Sin embargo, hay que haceerlo para los casos concretos de las flechas, ya que podría interesarnos que el evento sí se propagase en caso de ser un carácter. 
* Usamos *keyup* y no *keydown* por motivos de accesibilidad. Este evento solo se llama una vez al soltar la tecla, mientras que *keydown* puede llamarse múltiples veces durante una pulsación prolongada. 
* Utilizamos el atributo *role=none* en el elemento *Host* para que el componente sea ignorado por la capa de accesibilidad. Solo encapsula comportamiento, no queremos que se represente de ninguna forma al usuario. Esto no impide que lo que haya dentro mediante el *slot* se presente al usuario. Utilizar el atributo *aria-hidden* para ese propósito. 

Además, algo de CSS para hacerlo transparente en cuanto a representación:

``` 
keyboard-navigable {
    width: 100%;
    height: 100%;
}
```

Podemos testear este componente gracias a la librería que ofrece Stencil. Para ello, vamos a escribir nuestros test en *keyboard-navigable. e2e. ts*:

``` 
import { newE2EPage } from '@stencil/core/testing';
import { KeyCodes } from '../../utils/keyboard-utils';

describe('keyboard-navigable', () => {
  it('should renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<keyboard-navigable></keyboard-navigable>');
    const element = await page.find('keyboard-navigable');
    expect(element).toHaveClass('hydrated');
  });

  it("should notify up arrow pressed", async () => {
    const page = await newE2EPage();

    await page.setContent('<keyboard-navigable></keyboard-navigable>');
    const element = await page.find('keyboard-navigable');
    const spyEvent = await element.spyOnEvent("upArrow");
    // The element must be focusable in order to press a key inside.
    element.tabIndex = -1;
    await page.waitForChanges();
    await element.press(KeyCodes.UP);

    expect(spyEvent).toHaveReceivedEventTimes(1);
  });

  it("should notify down arrow pressed", async () => {
    const page = await newE2EPage();

    await page.setContent('<keyboard-navigable></keyboard-navigable>');
    const element = await page.find('keyboard-navigable');
    const spyEvent = await element.spyOnEvent("downArrow");
    // The element must be focusable in order to press a key inside.
    element.tabIndex = -1;
    await page.waitForChanges();
    await element.press(KeyCodes.DOWN);

    expect(spyEvent).toHaveReceivedEventTimes(1);
  });

  it("should notify left arrow pressed", async () => {
    const page = await newE2EPage();

    await page.setContent('<keyboard-navigable></keyboard-navigable>');
    const element = await page.find('keyboard-navigable');
    const spyEvent = await element.spyOnEvent("leftArrow");
    // The element must be focusable in order to press a key inside.
    element.tabIndex = -1;
    await page.waitForChanges();
    await element.press(KeyCodes.LEFT);

    expect(spyEvent).toHaveReceivedEventTimes(1);
  });

  it("should notify right arrow pressed", async () => {
    const page = await newE2EPage();

    await page.setContent('<keyboard-navigable></keyboard-navigable>');
    const element = await page.find('keyboard-navigable');
    const spyEvent = await element.spyOnEvent("rightArrow");
    // The element must be focusable in order to press a key inside.
    element.tabIndex = -1;
    await page.waitForChanges();
    await element.press(KeyCodes.RIGHT);

    expect(spyEvent).toHaveReceivedEventTimes(1);
  });

});
```

Como podéis ver, no son test unitarios, sino end-to-end. Este tipo de test se adapta mejor a nuestras necesidades. Nos permite trabajar con los componentes como si estuvieran rennderizados en un navegador. Así, podemos ver que, efectivamente, responden a las interacciones, y no sólo simularlas mediante llamadas a métodos. 

Es importante notar que si el elemento no puede recibir el foco, no podemos presionar una tecla dentro de él. Por eso, en este test le hemos dado un tabindex. Sin embargo, en la práctica, lo que vamos a hacer es crear un componente que pueda recibir y manejar el foco. Es decir, le dotaremos de enfocabilidad mediante composición. 

##### 4. 1. 1. 3 - La interfaz KeyboardNavigationHandler

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

##### 4. 1. 1. 4 - El componente KeyboardNavigationListener

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
    protected upArrowHandler(event: CustomEvent<any>) {
        event?.stopPropagation();
        const itemToFocus = this.handler.getUpItem();
        this.focusItem(itemToFocus);
    }

    @Listen('downArrow')
    protected downArrowHandler(event: CustomEvent<any>) {
        event?.stopPropagation();
        const itemToFocus = this.handler.getDownItem();
        this.focusItem(itemToFocus);
    }

    @Listen('leftArrow')
    protected leftArrowHandler(event: CustomEvent<any>) {
        event?.stopPropagation();
        const itemToFocus = this.handler.getLeftItem();
        this.focusItem(itemToFocus);
    }

    @Listen('rightArrow')
    protected rightArrowHandler(event: CustomEvent<any>) {
        event?.stopPropagation();
        const itemToFocus = this.handler.getRightItem();
        this.focusItem(itemToFocus);
    }

    focusItem(item: HTMLElement | undefined) {
        if (item instanceof HTMLElement) item.focus();
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
* Detenemos también la propagación de nuestros eventos personalizados. Si no, podría provocar problemas en un contexto en que tuviéramos varios *KeyboardNavigationListener* apilados, como en un menú con diversos submenús. 
* Sólo hacemos foco si el valor devuelto por el padre no es *undefined*. En caso contrario, no hay acción. 
* Como **KeyboardNavigable**, el *role* del elemento *Host* es none y no tiene shadow DOM. 

Como en el caso anterior, también podemos realizar test end-to-end para asegurarnos de que funciona. 

``` 
import { newE2EPage } from '@stencil/core/testing';
import { KeyCodes } from '../../utils/keyboard-utils';

describe('keyboard-navigation-listener', () => {

  it('should ask for the up item', async () => {
    const mockGetItem = jest.fn().mockReturnValue(undefined);
    const page = await newE2EPage();
    await page.setContent('<keyboard-navigation-listener><keyboard-navigable></keyboard-navigable></keyboard-navigation-listener>');
    await page.exposeFunction("getItem", mockGetItem);

    const navigable = await page.find("keyboard-navigable");

    navigable.tabIndex = -1;
    await page.$eval("keyboard-navigation-listener", (element: any) => {
      element.handler = { getUpItem: this.getItem };
    });
    await page.waitForChanges();

    await navigable.press(KeyCodes.UP);

    expect(mockGetItem).toHaveBeenCalled();
  });

  it('should ask for the down item', async () => {
    const mockGetItem = jest.fn().mockReturnValue(undefined);
    const page = await newE2EPage();
    await page.setContent('<keyboard-navigation-listener><keyboard-navigable></keyboard-navigable></keyboard-navigation-listener>');
    await page.exposeFunction("getItem", mockGetItem);

    const navigable = await page.find("keyboard-navigable");

    navigable.tabIndex = -1;
    await page.$eval("keyboard-navigation-listener", (element: any) => {
      element.handler = { getDownItem: this.getItem };
    });
    await page.waitForChanges();

    await navigable.press(KeyCodes.DOWN);

    expect(mockGetItem).toHaveBeenCalled();
  });

  it('should ask for the left item', async () => {
    const mockGetItem = jest.fn().mockReturnValue(undefined);
    const page = await newE2EPage();
    await page.setContent('<keyboard-navigation-listener><keyboard-navigable></keyboard-navigable></keyboard-navigation-listener>');
    await page.exposeFunction("getItem", mockGetItem);

    const navigable = await page.find("keyboard-navigable");

    navigable.tabIndex = -1;
    await page.$eval("keyboard-navigation-listener", (element: any) => {
      element.handler = { getLeftItem: this.getItem };
    });
    await page.waitForChanges();

    await navigable.press(KeyCodes.LEFT);

    expect(mockGetItem).toHaveBeenCalled();
  });

  it('should ask for the right item', async () => {
    const mockGetItem = jest.fn().mockReturnValue(undefined);
    const page = await newE2EPage();
    await page.setContent('<keyboard-navigation-listener><keyboard-navigable></keyboard-navigable></keyboard-navigation-listener>');
    await page.exposeFunction("getItem", mockGetItem);

    const navigable = await page.find("keyboard-navigable");

    navigable.tabIndex = -1;
    await page.$eval("keyboard-navigation-listener", (element: any) => {
      element.handler = { getRightItem: this.getItem };
    });
    await page.waitForChanges();

    await navigable.press(KeyCodes.RIGHT);

    expect(mockGetItem).toHaveBeenCalled();
  });

});
```

La forma de mockear el *handler* es un poco enrevesada, pero la API de Stencil limpia el objeto de funciones si lo asignamos con el método **setProperty**. 

#### 4. 1. 2 - Manejo del foco

Hay que tener en cuenta que el foco también puede ser desplazado por el ratón. No sirve únicamente con controlar los eventos de teclado y actualizar los datos cuando estos ocurran. Por eso, debemos realizar un diseño similar para los eventos de foco cuando se desplace a uno de los items, en nuestro caso, las casillas. 

##### 4. 1. 2. 1 - El componente FocusableItem

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

También debemos darle algo de CSS. La propiedad **outline** permitirá que se visualice el foco:

``` 
focusable-item {
    width: 100%;
    height: 100%;
    outline: thick;
}
```

Testearlo es también sencillo:

``` 
import { newE2EPage } from '@stencil/core/testing';
import { ItemPosition } from '../../abstraction/FocusedItemHandler';

describe('focusable-item', () => {
  it('should render out of tab sequence', async () => {
    const page = await newE2EPage();

    await page.setContent('<focusable-item></focusable-item>');
    const element = await page.find('focusable-item');
    expect(element).toHaveClass('hydrated');
    expect(element.tabIndex).toBe(-1);
  });

  it('should render into the tab sequence', async () => {
    const page = await newE2EPage();

    await page.setContent('<focusable-item></focusable-item>');
    const element = await page.find('focusable-item');

    element.setProperty("isInTabSequence", true);
    await page.waitForChanges();
    expect(element).toHaveClass('hydrated');
    expect(element.tabIndex).toBe(0);
  });

  it("should notify focused", async () => {
    const page = await newE2EPage();
    const position: ItemPosition = { row: 3, column: 1 };
    await page.setContent('<focusable-item></focusable-item>');
    const element = await page.find('focusable-item');

    element.setProperty("position", position);
    await page.waitForChanges();

    const spyEvent = await element.spyOnEvent("focusedItem");
    await element.focus();
    expect(spyEvent).toHaveReceivedEventDetail(position);
  });

});
```

##### 4. 1. 2. 2 - FocusedItemHandler

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

##### 4. 1. 2. 3 - El componente FocusedItemListener

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
        event.stopPropagation();
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

Probarlo es igual de sencillo:

``` 
it('should notify to handler when listens a focusedItem event', async () => {
    const mockNotify = jest.fn();
    const position: ItemPosition = { row: 3, column: 1 };
    const page = await newE2EPage();
    await page.setContent('<focused-item-listener><focusable-item></focusable-item></focused-item-listener>');
    await page.exposeFunction("notifyFocusedItem", mockNotify);

    const focusable = await page.find("focusable-item");

    await focusable.setProperty("position", position);
    await page.$eval("focused-item-listener", (element: any) => {
      element.handler = { notifyFocusedItem: this.notifyFocusedItem }
    });
    await page.waitForChanges();

    await focusable.focus();

    expect(mockNotify).toHaveBeenCalledWith(position);
  });
```

### 4. 2 - Aplicar la solución a nuestro problema

Una vez que hemos construido las piezas básicas que vamos a reutilizar para diferentes componentes, vamos a usarlas en nuestro caso concreto, el tablero de ajedrez. Tendremos un componente básico **ChessSquare** que representa cada casilla y el componente global **ChessBoard** que engloba todo el conjunto y contiene la lógica. 

Es importante resaltar que vamos a plantear nuestro modelo virtual de tablero según la representación del mismo cuando lo ponemos del lado del blanco, desde la esquina superior izquierda a la inferior derecha. Así, la posición [0, 0] del modelo virtual se corresponderá con la casilla A8, y la posición [7, 7] con la casilla H1. 

#### 4. 12. 1 - Algunas utilidades auxiliares

Debemos tener en cuenta que el tablero de ajedrez se representa de forma parecida, pero a la vez distinta, a una matriz bidimensional. En lugar de dos componentes numéricas, las columnas se especifican mediante una letra de la A a la H. Además, dado que el tablero puede girarse, la representación gráfica no coincide nunca con el modelo. Vamos a crear el archivo *utils/chess-utils. ts*. Para empezar, definiremos algunos tipos y enums que nos harán la vida más sencilla:

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

Aunque podríamos utilizar imágenes, vamos a mantener la simplicidad. Utilizaremos la notación fen para las piezas, que utiliza mayúsculas para las blancas y minúsculas para las negras. Así no tendremos tampoco problemas de contraste. 

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
    translateCoordinatesToOneDimension(position: ItemPosition2D): number;
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

    translateCoordinatesToOneDimension(position: ItemPosition2D): number {
        return position.row * 8 + position.column;
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

    translateCoordinatesToOneDimension(position: ItemPosition2D): number {
        return 63 - (position.row * 8 + position.column);
    }

}
```

Como se puede apreciar, ya que nuestro tablero es un componente bidimensional, utilizamos **ItemPosition2D** en lugar del tipo genérico **ItemPosition**. 

También hemos creado un traductor de coordenadas bidimensionales a unidimensionales. El motivo es que cuando consultemos el DOM en busca de nuestras casillas, nos devolverá una colección lineal. 

#### 4. 2. 2 - El componente ChessSquare

Como hemos dicho, este componente representa cada casilla del tablero. Para cada una, tendremos que saber su posición, si tiene una pieza y cuál es en caso afirmativo, y el color de la casilla. Algunos de estos datos pueden ser calculados a partir de otros. Además, incluiremos los dos emitter de nuestra arquitectura para incorporar su comportamiento:

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
        return `${arrayToBoardColumn(this.column)}${arrayToBoardRow(this.row)} - ${this.piece ? ChessPieceDescription[this.piece] : ""}` ;
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
                role="button"
                aria-label={this.getAccessibleDescription()}
            >
                <keyboard-navigable>
                    <focusable-item
                        position={{ row: this.row, column: this.column }}
                        isInTabSequence={this.isFirstSquare()}
                    >
                        <div class="hidder" aria-hidden="true">
                            {this.piece}
                        </div>
                    </focusable-item>
                </keyboard-navigable>
            </Host >
        );
    }
}
```

Como vemos, la complejidad referente a la navegación y el manejo del foco ha sido incorporada con un par de etiquetas. Lo único que hace el componente es preocuparse por la representación gráfica y algunos cálculos necesarios para este caso concreto. 

* Se utiliza un *div* con la propiedad aria-hidden para ocultar la letra de la pieza a las tecnologías de asistencia, como los lectores de pantalla. 
* La información accesible de cada casilla se proporciona a través de la propiedad *aria-label*, incluida la descripción expandida de la pieza si la hay. 
* Se le asigna el *role* button para que el usuario sepa que puede activarse, aunque no vayamos a implementarlo en este tutorial. 

Y aquí el CSS. Como veis, usamos **box-sizing** para que el foco no exceda el tamaño de la caja. También usamos todo el espacio disponible y centramos las piezas:

``` 
chess-square {
    height: 100%;
    width: 100%;
    box-sizing: border-box;

    font-size: 2rem;
    text-align: center;
    vertical-align: middle;
    border: 0px;
}

chess-square:focus-within {
    border: 2px solid red;
}

.white-square {
    background-color: white;
    color: black;
}

.black-square {
    background-color: black;
    color: white;
}

.hidder {
    height: 100%;
    width: 100%;
}
```

#### 4. 2. 3 - Board renderers

Como el tablero puede representarse desde el punto de vista del blanco o del negro, hay que tener en cuenta las dos opciones. Ya lo hemos hecho para la navegación. Ahora también tenemos que llevarlo a cabo para la representación gráfica. 

Para simplificar la labor, vamos a utilizar de nuevo el patrón estrategia, esta vez con **BoardRenderer**:

``` 
import { h } from '@stencil/core';
import { BoardModel, BoardView, ChessPiece, BoardSide, arrayToBoardColumn, arrayToBoardRow } from "../../utils/chess-utils";

export interface BoardRenderer {
    renderBoard(model: BoardModel): BoardView;
    renderNumber(row: number): HTMLElement;
    renderCharacters(): HTMLElement[];
}

export class WhiteSideRenderer implements BoardRenderer {

    renderBoard(model: BoardModel): BoardView {
        const view: BoardView = [];
        model.forEach((row: ChessPiece[], i: number) => {
            const rowView: HTMLElement[] = [];
            row.forEach((square: ChessPiece, j: number) => {
                rowView.push(
                    <chess-square
                        row={i}
                        column={j}
                        piece={square}
                        side={BoardSide.white}
                    />
                );
            });
            view.push(rowView);
        });
        return view;
    }

    renderCharacters(): HTMLElement[] {
        const cols = Array.from(Array(8).keys());
        return cols.map((i: number) => {
            return (
                <div class="col-header">
                    {arrayToBoardColumn(i)}
                </div>
            );
        })
    }

    renderNumber(row: number): HTMLElement {
        return (
            <div class="row-header">
                {arrayToBoardRow(row)}
            </div>
        );
    }

}

export class BlackSideRenderer implements BoardRenderer {

    renderBoard(model: BoardModel): BoardView {
        const view: BoardView = [];
        [...model].reverse().forEach((row: ChessPiece[], i: number) => {
            const rowView: HTMLElement[] = [];
            row.reverse().forEach((square: ChessPiece, j: number) => {
                rowView.push(
                    <chess-square
                        row={7 - i}
                        column={7 - j}
                        piece={square}
                        side={BoardSide.black}
                    />
                );
            });
            view.push(rowView);
        });
        return view;
    }

    renderCharacters(): HTMLElement[] {
        const cols = Array.from(Array(8).keys());
        return cols.map((i: number) => {
            return (
                <div class="col-header">
                    {arrayToBoardColumn(i)}
                </div>
            );
        })
    }

    renderNumber(row: number): HTMLElement {
        return (
            <div class="row-header">
                {9 - (arrayToBoardRow(row) as number)}
            </div>
        );
    }

}
```

Para los números sólo devolvemos un elemento, ya que vamos a incorporarlos en cada fila por separado. 

#### 4. 2. 4 - El componente ChessBoard

Y llegamos al final del camino. Este componente será el padre de todos. Implementará las dos interfaces handler para completar el patrón que hemos construido. Como veréis, esto permite delimitar muy bien lo que tenemos que hacer y reutiliza todo el código posible:

``` 
import { Component, h, Prop, State, Watch, Host, Element } from '@stencil/core';
import { BoardSide, DirectionalNavigabilityStrategy, WhiteSideNavigabilityStrategy, BlackSideNavigabilityStrategy, ChessPiece, BoardModel } from '../../utils/chess-utils';
import { BoardRenderer, WhiteSideRenderer, BlackSideRenderer } from './BoardRenderer';
import { FocusedItemHandler, ItemPosition, ItemPosition2D, isPosition2D } from '../../abstraction/FocusedItemHandler';
import { KeyboardNavigationHandler } from '../../abstraction/KeyboardNavigationHandler';

@Component({
    tag: 'chess-board',
    styleUrl: 'chess-board.css',
    shadow: true
})
export class ChessBoard implements KeyboardNavigationHandler, FocusedItemHandler {

    @Prop() side!: BoardSide;

    @State() boardModel: BoardModel;
    @State() navigabilityStrategy: DirectionalNavigabilityStrategy;
    @State() boardRenderer: BoardRenderer;

    @Element() element: HTMLElement;

    private focusedSquare: ItemPosition2D;

    @Watch('side')
    sideChanged(newSide: BoardSide) {
        console.debug("Watching side");
        this.setNavigationAndRenderStrategies(newSide);
    }

    componentWillLoad() {
        this.setNavigationAndRenderStrategies(this.side);
        this.boardModel = this.generateDefaultPosition();
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

    render() {
        return (
            <Host role="application">
                <focused-item-listener handler={this}>
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
                </focused-item-listener>
            </Host >
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
```

Veamos algunas cosas importantes:

* El watcher permite actualizar la estrategia de navegación y renderización cuando cambia el punto de vista del tablero. 
* La implementación de **KeyboardNavigationHandler** devuelve al listener el elemento **FocusableItem** dentro de cada casilla. Esto es así porque sólo este puede ser enfocado. 
* La implementación de **FocusedItemHandler** actualiza la casilla seleccionada actualmente. Importante para que pueda devolverse la casilla correcta ante la navegación por flecha. 

Y aquí el CSS. Por supuesto, la mejor forma de representar el tablero es usando *grid*:

``` 
.board {
    display: grid;
    grid-template-columns: 3em repeat(8, 1fr) 3em;
    grid-template-rows: 3em repeat(8, 1fr) 3em;
    align-items: center;

    height: 46rem;
    width: 46rem;
    margin: 2em auto;
    padding: 2em;
    background-color: #DEB887;
}

.col-header {
    text-align: center;
}

.row-header {
    text-align: center;
}
```

Sólo falta probarlo. Para ello, vamos al componente *app-root* que se creó por defecto al construir el proyecto inicial. Agregamos aquí nuestro componente *ChessBoard*. Además, vamos a incluir un botón para poder dar la vuelta al tablero de forma dinámica. El resultado quedaría así:

``` 
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
```

¡Listo! ¡Sólo queda probarlo!

``` 
npm start
```

## 5 - Conclusiones

Reutilizar código cuando trabajamos con web components puede pareceer difícil. Sin embargo, hemos visto cómo una arquitectura de tres capas con emitter-listener-handler es capaz de resolver el problema. No sólo nos permite reutilizar código de unos componentes a otros, sino que podemos apilar varios de estos componentes que encapsulan comportamiento para obtener resultados más complejos. 

En cuanto a la mantenibilidad, parece también una idea interesante. Si tenemos bien testeados los emitter y los listeners, que van a ser las piezas comunes a todos nuestros componentes, los errores están restringidos a la implementación que hagamos de los handler. Además, separar los handler de la parte de gestión de eventos también facilita el testeo de los mismos. No dejan de ser funciones con algunos parámetros y valores de retorno, como cualquier otra. 

La utilidad de este patrón no se queda en este comportamiento. Podemos pensar realmente en cualquier comportamiento común: elementos que se cierren, que se desplieguen, que se puedan arrastrar... Las posibilidades son enormes. Ahorraremos mucho tiempo en desarrollar estos comportamientos y también en testearlos. Espero que os haya gustado y que le saquéis provecho. 
