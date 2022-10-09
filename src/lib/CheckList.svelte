<script>
  import store from "./store.js";
  import ListWrapper from "./ListWrapper.svelte";
  import ListItem from "./ListItem.svelte";

  export let meta = {};
  export let items = [];
  export let selected = [];
  export let Wrapper = ListWrapper;
  export let Item = ListItem;

  let checklist = store(meta, items);

  function dispatcher(name, ...args) {
    checklist.callCallback(name, ...args);
  }

  $: selected = [...$checklist.selected];
</script>

<svelte:component this={Wrapper} {checklist}>
  {#each $checklist.entries as entry, index (entry.id)}
    <svelte:component
      this={Item}
      id={entry.id}
      item={entry.item}
      {index}
      bind:checked={entry.checked}
      {dispatcher}
    />
  {/each}
</svelte:component>
