# Svelte Checklist

## A customizable CheckList build on Svelte.

It started as a learning question in the [Svelte Brasil](https://sveltebrasil.dev/) Telegram group. And took it as a personal challenge to create a Svelte Component and experiment a few things, like passing components as props.

## Demo

Demo is on this [REPL](https://svelte.dev/repl/a39f9752ff2541f59761051faf834c6e). Fork and experiment!!!

## Installation

```{bash}
npm install -D svelte-checklist
```

## Usage

### Basic usage

This example will use the built-in Header and Item

```{html}
<script>
  import CheckList from "svelte-checklist";

  let data = ["Apple", "Banana", "Orange", "Strawberry"];
  let selected = [];
</script>

<CheckList bind:data bind:selected />
```

### Advanced usage

As mentioned this is a customizable component. That means that you can pass your own Header and Item components to the CheckList component.

#### Custom Item

It is possible to define a custom Item that must conform to the interface as defined in the API.

Check this example on [REPL](https://svelte.dev/repl/1f0878155cb84808ab43a94de2127987)

```
<!-- App.svelte -->
<script>
  import CheckList from "svelte-checklist";
	import Item from "./Item.svelte";

  let data = ["Apple", "Banana", "Orange", "Strawberry"];
  let selected = [];
</script>

<CheckList {data} bind:selected {Item} />

<!-- Item.svelte -->
<script>
  export let value = "";
  export let checked = false;
</script>

<p on:click={() => (checked = !checked)} class:checked>{value}</p>

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

#### Custom Header

It is possible to add a custom Header component, and make full use of the checklist store. See API for documentation.

Check this example on [REPL](https://svelte.dev/repl/0deec06959224a08b418efd2f7778478)

```
<!-- App.svelte -->
<script>
  import CheckList from "svelte-checklist";
	import Header from "./Header.svelte"

  let data = ["Wash dishes","Feed pets","Do laundry","Prepare meal","Clean bathrooms","Dust"];
  let selected = [];
</script>

<CheckList {data} bind:selected {Header} />

<!-- Header.svelte -->
<script>
  export let checklist;

  $: togo = $checklist.data.length - $checklist.selected.length;
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

<CheckList {data} bind:selected {Header} {Item} />
```

- data (required) - An array of data. Works fine with both primitive and complex data types, although the latter will require a custom Item component to handle the vizualization of the object.
- selected (required) - The resulting array of selected elements. It must be bound to a local variable so the final state of the component can be manipulated.
- Header (optional) - A custom Header component. Please check the Custom Header Component documentation.
- Item (optional) - A custom Item component. Please check the Custom Item Component documentation.

### Custom Header Component

The custom Header component is rendered once per checklist, it has full access to the checklist store, and can make full use of it. It is currently rendered before the list of Items.

#### Props Interface

```
<script>
  export let checklist
</script>

<slot />
```

- checklist - The checklist store.
- slot - The custom Header component must have a slot, where the items will be rendered.

### Custom Item Component

The custom Item component will be rendered for each item in the data.

#### Props Interface

```
<script>
  export let value = "";
  export let id;
  export let index;
  export let checked = false;
  export let dispatcher;
</script>
```

All those props are passed from the Checklist component for each item received in it's data prop.

- id - The id of the item in the checklist store data entry.
- value - Each data as it is passed in the Checklist component data prop.
- index - The index of the item.
- checked - The check state of the item. It is bound by the main CheckList component, so changes here will update the store.
- dispatcher - A function to call the calbacks registered via the checklist.addCallback function at the Header.

### Checklist Store

#### Value Type

The value is what you'll interact with Svelte's $checklist syntax.

```
type Entry = {
  id: string;
  value: any;
  checked: boolean;
};

type Checklist = {
  data: Entry[];
  allChecked: boolean;
  someChecked: boolean;
  noneChecked: boolean;
  selected: any[];
  callbacks: Record<string, function>;
};
```

- data - The list of Entry's
- AllChecked (automatic update) - True if all items are checked
- noneChecked (automatic update) - True if no itemas are checked
- someChecked (automatic update) - True if some items are checked, false in case of allChecked or noneChecked
- selected (automatic update) - The entries checked
- callbacks - Registered by calling checkllist.addCallback (see below), usually to be performed at the Header.

#### Store Methods

- checkStates()
- checkAll()
- uncheckAll()
- setAll(checkedState)
- checkOnly(value)
- checkPlus(value)
- check(id)
- uncheck(id)
- toggleAll()
- toggle(id)
- push(value, checked = false)
- remove(item)
- options()
- addCallback(name, callback)
