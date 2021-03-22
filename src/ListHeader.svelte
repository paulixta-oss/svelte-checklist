<script>
  export let checklist;

  let mainCheckbox;
  let newItem = "";
  let showMenu = false;

  console.log($checklist);

  $: if ($checklist) checklist.checkStates();
  $: options = [...new Set($checklist.data.map((e) => e.value))];
  $: if (mainCheckbox) mainCheckbox.checked = $checklist.allChecked;
  $: if (mainCheckbox) mainCheckbox.indeterminate = $checklist.someChecked;
</script>

<svelte:window
  on:click={() => {
    showMenu = false;
  }}
/>

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

<div class="dropdown">
  <div class="checkbox show">
    <input
      name="mainCheck"
      type="checkbox"
      bind:this={mainCheckbox}
      on:click={() => checklist.setAll(mainCheckbox.checked)}
    />
  </div>
  <div class="select">
    <button
      on:click|stopPropagation={() => {
        showMenu = true;
      }}
      class="dropbtn">▼</button
    >
  </div>

  <div class="dropdown-content" class:show={showMenu}>
    <span on:click={() => checklist.checkAll()}>Todos</span>
    <span on:click={() => checklist.uncheckAll()}>Nenhum</span>
    <span on:click={() => checklist.toggleAll()}>Inverter</span>
    {#each options as option}
      <span on:click={() => checklist.checkOnly(option)}>{option}</span>
      <span on:click={() => checklist.checkPlus(option)}>+{option}</span>
    {/each}
  </div>
</div>

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

  .dropbtn {
    color: black;
    font-size: 1em;
    border: none;
    cursor: pointer;
    background-color: inherit;
    width: 100%;
    height: 100%;
  }

  .dropbtn:hover,
  .dropbtn:focus,
  .dropbtn:active {
    background-color: #ddd;
  }

  .dropdown {
    position: relative;
    display: inline-grid;
    grid-template-columns: repeat(2, min-content);
  }

  input,
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

  .select {
    height: 30px;
    width: 20px;
  }

  .select:hover,
  .select:focus,
  .select:active {
    background-color: #ddd;
  }

  .dropdown-content {
    display: none;
    position: absolute;
    background-color: #f1f1f1;
    min-width: 160px;
    overflow: auto;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    z-index: 1;
    margin-top: 30px;
  }

  .dropdown-content span {
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
    background-color: inherit;
    height: 100%;
  }

  .dropdown span:hover {
    background-color: #ddd;
  }

  .show {
    display: block;
  }
</style>
