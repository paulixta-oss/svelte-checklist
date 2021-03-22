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
