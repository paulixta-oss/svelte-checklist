<script lang="ts">
	import CheckList from "$lib/index.js";
	import Item from "./Item.svelte";

  let items = ["Apple", "Banana", "Orange", "Strawberry"];
  let selected: boolean[] = [];
</script>

<CheckList {items} bind:selected {Item} />
<CheckList {items} bind:selected />

<pre>
{selected}
</pre>
