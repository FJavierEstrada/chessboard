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

Como hemos comentado antes, vamos a crear un componente que encapsule la capacidad de navegación. Desde el explorador de proyecto, hacemos clic derecho en la carpeta *src/components* y elegimos *generate Stencil component*. Llamaremos a nuestro componente **KeyboardNavigable**. La extensión nos genera un componente ya preconfigurado. Agregamos el flag para el shadow Dom en la anotación **@Component**.

Vamos a agregar aquí el lanzamiento de eventos cuando se presionen las teclas que queremos manejar. Esto evitará tener que comprobar todos los eventos de teclado en el listener, de modo que será más limpio y eficiente. Para ello, utilizaremos las anotaciones **@Event** para lanzar los eventos personalizados y **@Listen** para escuchar el teclado.

```
import { Component, h, Host, Event, EventEmitter, Event, EventEmitter, Event, EventEmitter, Event, EventEmitter, Listen } from '@stencil/core';
import { KeyCodes } from '../../utils/keyboard-utils';


@Component({
    tag: 'keyboard-navigable',
    styleUrl: 'keyboard-navigable.css',
    shadow: true
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

