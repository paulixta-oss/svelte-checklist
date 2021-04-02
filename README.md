# Svelte Checklist

## A customizable CheckList build on Svelte.

It started as a learning question in the [Svelte Brasil](https://sveltebrasil.dev/) Telegram group. And took it as a personal challenge to create a Svelte Component and experiment a few things, like passing components as props.

The CheckList component handles the logic and behaviour of the checklist. It works based on two sets of data: an items list and a meta object. The former is the list of items on your checklist, the latter any other information relevant for your customization. By the way, the CheckList component can be customized with the help of two optional components: a Wrapper component and an Item component.

The sets of data are stored in a custom Svelte Store, that can be accessed in the Wrapper component.

The Wrapper works as a "controller" for your checklist, it's a standard Svelte component with only two requirements that must be implemented. (1) It must expect a prop named checklist, the custom Svelte Store with the relevant data structure of the component; and (2) it must have a <slot /> entry, that's where the CheckList component will insert the items provided. This way you can design and style the surrounding of your checklist, including headers and footers.

The Item is another Svelte component a component, it will be instatiated for each item on the checklist.

## Installation

```{bash}
npm install -D svelte-checklist
```

## Usage

### Basic usage

This example will use the built-in Wrapper and Item. Demo is on [REPL](https://svelte.dev/repl/a39f9752ff2541f59761051faf834c6e).

```{html}
<script>
  import CheckList from "svelte-checklist";

  let items = ["Apple", "Banana", "Orange", "Strawberry"];
  let selected = [];
</script>

<CheckList bind:items bind:selected />
```

### Advanced usage

As mentioned this is a customizable component. That means that you can pass your own Wrapper and Item components to the CheckList component.

#### Custom Item

It is possible to define a custom Item that must conform to the interface as defined in the API.

Check this example on [REPL](https://svelte.dev/repl/1f0878155cb84808ab43a94de2127987)

```
<!-- App.svelte -->
<script>
  import CheckList from "svelte-checklist";
	import Item from "./Item.svelte";

  let items = ["Apple", "Banana", "Orange", "Strawberry"];
  let selected = [];
</script>

<CheckList {items} bind:selected {Item} />

<!-- Item.svelte -->
<script>
  export let item = "";
  export let checked = false;
</script>

<p on:click={() => (checked = !checked)} class:checked>{item}</p>

<style>
  p {
    cursor: pointer;
  }
  .checked {
    text-decoration: line-through;
		user-select: none;
  }
</style>
```

#### Custom Wrapper

It is possible to add a custom Wrapper component, and make full use of the checklist store. See API for documentation.

Check this example on [REPL](https://svelte.dev/repl/0deec06959224a08b418efd2f7778478)

```
<!-- App.svelte -->
<script>
  import CheckList from "svelte-checklist";
	import Wrapper from "./Wrapper.svelte"

  let items = ["Wash dishes","Feed pets","Do laundry","Prepare meal","Clean bathrooms","Dust"];
  let selected = [];
</script>

<CheckList {items} bind:selected {Wrapper} />

<!-- Wrapper.svelte -->
<script>
  export let checklist;

  $: togo = $checklist.items.length - $checklist.selected.length;
</script>

{#if $checklist.allChecked}
  <p>Congratulations you've completed all your tasks</p>
{:else}
  <span>{togo} {togo === 1 ? "task" : "tasks"} to go!</span>
  <button type="button" on:click={() => checklist.checkAll()}>Complete All
  </button>
{/if}

```

## API

### CheckList Component

```
<script>
import CheckList from "svelte-checklist"

let selected;
</script>

<CheckList {meta} {items} bind:selected {Wrapper} {Item} />
```

- meta (optional) - Any other information you may use in a custom Wrapper (i.e. previous and next endpoints for navigation)
- items (required) - An array of items. Works fine with both primitive and complex items types, although the latter will require a custom Item component to handle the vizualization of the object.
- selected (required) - The resulting array of selected elements. It must be bound to a local variable so the final state of the component can be manipulated.
- Wrapper (optional) - A custom Wrapper component. Please check the Custom Wrapper Component documentation.
- Item (optional) - A custom Item component. Please check the Custom Item Component documentation.

### Custom Wrapper Component

The custom Wrapper component is rendered once per checklist, it has full access to the checklist store, and can make full use of it. It must contain a <slot /> element.

#### Props Interface

```
<script>
  export let checklist
</script>

<slot />
```

- checklist - The checklist store.
- slot - The custom Wrapper component must have a slot, where the items will be rendered.

### Custom Item Component

The custom Item component will be rendered for each item in the items.

#### Props Interface

```
<script>
  export let item = "";
  export let id;
  export let index;
  export let checked = false;
  export let dispatcher;
</script>
```

All those props are passed from the Checklist component for each item received in it's items prop.

- id - The id of the item in the checklist store items entry.
- item - Each item as passed in the Checklist component items prop.
- index - The index of the item.
- checked - The check state of the item. It is bound by the main CheckList component, so changes here will update the store.
- dispatcher - A function to call the calbacks registered via the checklist.addCallback function at the Wrapper.

### Checklist Store

#### Value Type

The value is what you'll interact with Svelte's $checklist syntax.

```
type Entry = {
  id: string;
  item: any;
  checked: boolean;
};

type Checklist = {
  meta: any
  entries: Entry[];
  allChecked: boolean;
  someChecked: boolean;
  noneChecked: boolean;
  selected: any[];
};
```

- meta - The meta data as described in the CheckList component API
- entries - The list of entries
- AllChecked (automatic update) - True if all entries are checked
- noneChecked (automatic update) - True if no entries are checked
- someChecked (automatic update) - True if some entries are checked, false in case of allChecked or noneChecked
- selected (automatic update) - The checked entries

#### Store Methods

- checkAll()
- uncheckAll()
- setAll(checkedState)
- checkOnly(fn)
- checkPlus(fn)
- check(id)
- uncheck(id)
- toggleAll()
- toggle(id)
- push(value, checked = false)
- remove(item)
- replace(id, item)
- replaceAll(items)
- addCallback(name, callback)
- callCallback(name, ...args)
