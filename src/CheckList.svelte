<script>
  import store from "./store.js";
  import ListHeader from "./ListHeader.svelte";
  import ListItem from "./ListItem.svelte";

  export let data = [];
  export let selected = [];
  export let Header = ListHeader;
  export let Item = ListItem;

  let checklist = store(data);

  $: if ($checklist) checklist.checkStates();
  $: selected = [...$checklist.selected];
</script>

<svelte:component this={Header} {checklist} />
{#each $checklist.data as item, index (item.id)}
  <svelte:component
    this={Item}
    id={item.id}
    value={item.value}
    {index}
    bind:checked={item.checked}
    callbacks={$checklist.callbacks}
  />
{/each}
