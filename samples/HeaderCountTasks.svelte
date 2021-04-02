<script>
  export let checklist;

  $: togo = $checklist.items.length - $checklist.selected.length;
</script>

{#if $checklist.allChecked}
  <p>Congratulations you've completed all your tasks</p>
{:else}
  <p>{togo} {togo === 1 ? "task" : "tasks"} to go!</p>
  <button type="button" on:click={() => checklist.checkAll()}
    >Complete All
  </button>
{/if}
