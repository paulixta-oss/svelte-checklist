import { noop, safe_not_equal } from "svelte/internal";

const subscriber_queue = [];

export default function (items = [], start = noop) {
  let data = {
    entries: items.map((item) => ({
      id: (new Date().getTime() + Math.random()).toString(36),
      item,
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

  function set(new_data) {
    if (safe_not_equal(data, new_data)) {
      data = new_data;
      data.allChecked = data.entries.map((e) => e.checked).every((v) => v);
      data.noneChecked = data.entries.map((e) => e.checked).every((v) => !v);
      data.someChecked = !data.allChecked && !data.noneChecked;
      data.selected = data.entries.filter((e) => e.checked).map((e) => e.item);
    }
    if (stop) {
      // store is ready
      const run_queue = !subscriber_queue.length;
      for (let i = 0; i < subscribers.length; i += 1) {
        const s = subscribers[i];
        s[1]();
        subscriber_queue.push(s, data);
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
    set(fn(data));
  }

  function subscribe(run, invalidate = noop) {
    const subscriber = [run, invalidate];
    subscribers.push(subscriber);
    if (subscribers.length === 1) {
      stop = start(set) || noop;
    }
    run(data);

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
    checkAll() {
      update((current) => {
        current.entries.forEach((e) => (e.checked = true));
        return current;
      });
    },
    uncheckAll() {
      update((current) => {
        current.entries.forEach((e) => (e.checked = false));
        return current;
      });
    },
    setAll(state) {
      state ? this.checkAll() : this.uncheckAll();
    },
    checkOnly(fn) {
      update((current) => {
        current.entries.forEach((e, i) => (e.checked = fn(e, i)));
        return current;
      });
    },
    checkPlus(fn) {
      update((current) => {
        current.entries.forEach((e, i) => (e.checked = fn(e, i) || e.checked));
        return current;
      });
    },
    check(id) {
      update((current) => {
        let index = current.entries.findIndex((e) => e.id === id);
        current.entries[index].checked = true;
        return current;
      });
    },
    uncheck(id) {
      update((current) => {
        let index = current.entries.findIndex((e) => e.id === id);
        current.entries[index].checked = false;
        return current;
      });
    },
    toggleAll() {
      update((current) => {
        current.entries.forEach((e) => (e.checked = !e.checked));
        return current;
      });
    },
    toggle(id) {
      update((current) => {
        let index = current.entries.findIndex((e) => e.id === id);
        current.entries[index].checked = !current.entries[index].checked;
        return current;
      });
    },
    push(item, checked = false) {
      let id = new Date().getTime().toString(36);
      update((current) => {
        current.entries = [
          ...current.entries,
          {
            id,
            item,
            checked,
          },
        ];
        return current;
      });
      return id;
    },
    remove(id) {
      update((current) => {
        let index = current.entries.findIndex((e) => e.id === id);
        if (index !== -1) current.entries.splice(index, 1);
        return current;
      });
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
