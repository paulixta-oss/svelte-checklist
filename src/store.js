import { noop, safe_not_equal } from "svelte/internal";

const subscriber_queue = [];

export default function (data = [], start = noop) {
  let value = {
    data: data.map((v) => ({
      id: (new Date().getTime() + Math.random()).toString(36),
      value: v,
      checked: false,
    })),
    allChecked: false,
    someChecked: false,
    noneChecked: true,
    selected: [],
  };

  let callbacks = {};

  let stop;
  const subscribers = [];

  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      value.allChecked = value.data.map((e) => e.checked).every((v) => v);
      value.noneChecked = value.data.map((e) => e.checked).every((v) => !v);
      value.someChecked = !value.allChecked && !value.noneChecked;
      value.selected = value.data.filter((e) => e.checked).map((e) => e.value);
    }
    if (stop) {
      // store is ready
      const run_queue = !subscriber_queue.length;
      for (let i = 0; i < subscribers.length; i += 1) {
        const s = subscribers[i];
        s[1]();
        subscriber_queue.push(s, value);
      }
      if (run_queue) {
        for (let i = 0; i < subscriber_queue.length; i += 2) {
          subscriber_queue[i][0](subscriber_queue[i + 1]);
        }
        subscriber_queue.length = 0;
      }
    }
  }

  function update(fn) {
    set(fn(value));
  }

  function subscribe(run, invalidate = noop) {
    const subscriber = [run, invalidate];
    subscribers.push(subscriber);
    if (subscribers.length === 1) {
      stop = start(set) || noop;
    }
    run(value);

    return () => {
      const index = subscribers.indexOf(subscriber);
      if (index !== -1) {
        subscribers.splice(index, 1);
      }
      if (subscribers.length === 0) {
        stop();
        stop = null;
      }
    };
  }

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
      callbacks[name] = callback;
    },
    callCallback(name, ...args) {
      if (callbacks[name]) return callbacks[name](...args);
    },
  };

  return {
    subscribe,
    update,
    set,
    ...methods,
  };
}
