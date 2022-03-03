import { defineStore } from "pinia";

interface TodoItem {
  id: number;
  createdDt: string;
  editedDt: string;
  text: string;
  checked: boolean;
}
interface State {
  todoList: TodoItem[];
}

export const storeTodo = defineStore("todo", {
  state: () =>
    ({
      todoList: [
        {
          id: 0, // readonly
          createdDt: "", // readonly
          editedDt: "",
          text: "할일",
          checked: false,
        },
      ],
    } as State),
  getters: {},
  actions: {},
  debounce: {},
});
