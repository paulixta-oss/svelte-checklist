type Entry = {
  id: string;
  item: any;
  checked: boolean;
};

type Checklist = {
  entries: Entry[];
  allChecked: boolean;
  someChecked: boolean;
  noneChecked: boolean;
  selected: any[];
};
