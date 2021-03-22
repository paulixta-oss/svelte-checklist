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
  }
</style>
