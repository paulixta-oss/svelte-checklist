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
