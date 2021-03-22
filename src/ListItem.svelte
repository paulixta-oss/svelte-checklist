<script>
  import { createEventDispatcher } from "svelte";

  export let value = "";
  export let index;
  export let checked = false;

  let dispatch = createEventDispatcher();
</script>

<label class:even={index % 2}>
  <input type="checkbox" name={value} bind:checked />
  {value} <span on:click={() => dispatch("delete")}>&#10060;</span>
</label>

<style>
  label {
    display: flex;
    align-items: center;
    cursor: pointer;
    user-select: none;
  }

  label > span {
    margin-left: 10px;
    font-size: 10px;
  }

  input[type="checkbox"] {
    margin: 0 6px;
    padding: 0;
    border-radius: 0;
  }

  .even {
    background-color: rgb(238, 238, 238);
  }
</style>
