<script>
  import store from "./store.js";
  import ListHeader from "./ListHeader.svelte";
  import ListItem from "./ListItem.svelte";

  export let data = [];
  export let selected = [];
  export let Header = ListHeader;
  export let Item = ListItem;

  let checklist = store(data);

  $: selected = [...$checklist.selected];
</script>

<svelte:component this={Header} {checklist} />

<div style="margin-top: 10px;" />

{#each $checklist.data as item, index (item.id)}
  <svelte:component
    this={Item}
    value={item.value}
    {index}
    bind:checked={item.checked}
    on:delete={(e) => checklist.remove(item.id)}
  />
{/each}
