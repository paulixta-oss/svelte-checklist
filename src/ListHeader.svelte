<script>
  import { onMount } from "svelte";

  export let checklist;

  let mainCheckbox;
  let newItem = "";

  onMount(() => {
    checklist.addCallback("delete", (id) => checklist.remove(id));
  });

  $: if (mainCheckbox) mainCheckbox.checked = $checklist.allChecked;
  $: if (mainCheckbox) mainCheckbox.indeterminate = $checklist.someChecked;
</script>

<div>
  <input type="text" bind:value={newItem} />
  <button
    class="action"
    on:click={() => {
      if (newItem === "") return;
      checklist.push(newItem, false);
      newItem = "";
    }}>Push</button
  >
</div>

<div class="checkbox show">
  <input
    name="mainCheck"
    type="checkbox"
    bind:this={mainCheckbox}
    on:click={() => checklist.setAll(mainCheckbox.checked)}
  />
</div>

<slot />

<style>
  input[type="text"] {
    margin-bottom: 8px;
    border-radius: 4px;
    border: 1px solid lightgrey;
    padding: 4px;
    outline: none;
  }

  .action {
    padding: 4px 16px;
    margin-bottom: 16px;
    outline: none;
    border-radius: 4px;
  }

  input[type="checkbox"],
  button {
    margin: 0;
    padding: 0;
    border-radius: 0;
  }

  .checkbox {
    height: 30px;
    width: 25px;
    display: grid !important;
    align-content: center;
    justify-content: center;
  }

  .checkbox input[type="checkbox"] {
    height: 15px;
    width: 15px;
  }

  .checkbox:hover,
  .checkbox:focus,
  .checkbox:active {
    background-color: #ddd;
  }

  .show {
    display: block;
  }
</style>
