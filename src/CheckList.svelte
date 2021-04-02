<script>
  import store from "./store.js";
  import ListWrapper from "./ListWrapper.svelte";
  import ListItem from "./ListItem.svelte";
  import { derived } from "svelte/store";

  export let items = [];
  export let selected = [];
  export let Wrapper = ListWrapper;
  export let Item = ListItem;

  let checklist = store(items);

  function dispatcher(name, ...args) {
    checklist.callCallback(name, ...args);
  }

  $: selected = [...$checklist.selected];
</script>

<svelte:component this={Wrapper} {checklist}>
  {#each $checklist.entries as item, index (item.id)}
    <svelte:component
      this={Item}
      id={item.id}
      item={item.item}
      {index}
      bind:checked={item.checked}
      {dispatcher}
    />
  {/each}
</svelte:component>
