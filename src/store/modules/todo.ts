import { defineStore } from "pinia";
import { TodoState, TodoItem } from "../index.interface";

export const storeTodo = defineStore("todo", {
  state: () =>
    ({
      todoList: [
        {
          id: 0,
          title: "청소하기",
          status: "active",
        },
        {
          id: 1,
          title: "공과금 내기",
          status: "active",
        },
        {
          id: 2,
          title: "운동 30분하기",
          status: "clear",
        },
      ],
    } as TodoState),
  getters: {
    createId() {
      const length: number = this.todoList.length;
      const lastId: number = this.todoList[length - 1].id;
      return length === 0 ? 0 : lastId + 1;
    },
  },
  actions: {
    addItem(item: TodoItem) {
      this.todoList.push(item);
    },
    changeStatus({
      id,
      status,
    }: {
      id: TodoItem["id"];
      status: TodoItem["status"];
    }) {
      this.todoList[id].status = status;
    },
    removeItem(id: TodoItem["id"]) {
      this.todoList.splice(id, 1);
    },
  },
  debounce: {},
});
