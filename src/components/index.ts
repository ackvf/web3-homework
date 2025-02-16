/**
 *
 * **Atoms**
 *  are the simplest pure visual components.
 * e.g. Input, Label, Option, Button
 *
 * **Molecules**
 *  compose *Atoms* and further specify onclick handlers and other callbacks,
 *  local state and toggles required for ui interaction, etc.
 * e.g. SearchBox, Dropdown, Alert, Toast
 *
 * **Organisms**
 *  are groups of molecules, atoms and other organisms composing complex UI components.
 *  Organisms' purpose is to be placed within a template layout.
 * e.g. Header, Footer, Modal, Form, AlertManager, ModalManager
 *
 * **Templates**
 *  specify the layout of a page that can be presented in storybook with mock data.
 *  Templates are directly used on page routes `/holograph/src/pages/*` that also provide real data.
 * e.g. CollectionDetailTemplate
 *
 * --------------------------------------------------------------------------------------------------------------------
 *
 * https://atomicdesign.bradfrost.com/chapter-2/
 *
 * @description
 * *Atoms* are UI elements that can't be broken down any further
 *    and serve as the elemental building blocks of an interface.
 * *Molecules* are collections of atoms that form relatively simpleUI components.
 * *Organisms* are relatively complex components that form discrete sections of an interface.
 * *Templates* place components within a layout and demonstrate the design’s underlying content structure.
 * *Pages* apply real content to templates and articulate variations
 *    to demonstrate the final UI and test the resilience of the design system.
 *    *note: These Pages are conceptually different from route-pages as their use is primarily for storybook presentation.*
 */

export * from "./Atoms"
export * from "./Molecules"
export * from "./Organisms"
export * from "./Templates"
export * from "./Pages"
