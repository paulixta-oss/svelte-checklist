import { writable } from "svelte/store";

export default function (data = []) {
  const value = {
    data: data.map((v) => ({
      id: (new Date().getTime() + Math.random()).toString(36),
      value: v,
      checked: false,
    })),
    allChecked: false,
    someChecked: false,
    noneChecked: true,
    selected: [],
    callbacks: {},
  };

  let { subscribe, update, set } = writable(value);

  const methods = {
    checkStates() {
      update((current) => {
        current.allChecked = current.data.map((e) => e.checked).every((v) => v);
        current.noneChecked = current.data
          .map((e) => e.checked)
          .every((v) => !v);
        current.someChecked = !current.allChecked && !current.noneChecked;
        current.selected = current.data
          .filter((e) => e.checked)
          .map((e) => e.value);
        return current;
      });
    },
    checkAll() {
      update((current) => {
        current.data.forEach((e) => (e.checked = true));
        return current;
      });
      this.checkStates();
    },
    uncheckAll() {
      update((current) => {
        current.data.forEach((e) => (e.checked = false));
        return current;
      });
      this.checkStates();
    },
    setAll(state) {
      state ? this.checkAll() : this.uncheckAll();
    },
    checkOnly(value) {
      update((current) => {
        current.data.forEach((e) => (e.checked = e.value === value));
        return current;
      });
      this.checkStates();
    },
    checkPlus(value) {
      update((current) => {
        current.data.forEach(
          (e) => (e.checked = e.value === value ? true : e.checked)
        );
        return current;
      });
      this.checkStates();
    },
    check(id) {
      update((current) => {
        let index = current.data.findIndex((e) => e.id === id);
        current.data[index].checked = true;
        return current;
      });
      this.checkStates();
    },
    uncheck(id) {
      update((current) => {
        let index = current.data.findIndex((e) => e.id === id);
        current.data[index].checked = false;
        return current;
      });
      this.checkStates();
    },
    set(id, state) {
      state ? this.check(id) : this.uncheck(id);
    },
    toggleAll() {
      update((current) => {
        current.data.forEach((e) => (e.checked = !e.checked));
        return current;
      });
      this.checkStates();
    },
    toggle(id) {
      update((current) => {
        let index = current.data.findIndex((e) => e.id === id);
        current.data[index].checked = !current.data[index].checked;
        return current;
      });
      this.checkStates();
    },
    push(value, checked = false) {
      update((current) => {
        current.data = [
          ...current.data,
          {
            id: new Date().getTime().toString(36),
            value,
            checked,
          },
        ];
        return current;
      });
      this.checkStates();
    },
    remove(id) {
      update((current) => {
        let index = current.data.findIndex((e) => e.id === id);
        current.data.splice(index, 1);
        return current;
      });
    },
    options() {
      return [...new Set(value.data.map((e) => e.value))];
    },
    addCallback(name, callback) {
      update((current) => {
        value.callbacks[name] = callback;
        return current;
      });
    },
  };

  return {
    subscribe,
    update,
    set,
    ...methods,
  };
}
