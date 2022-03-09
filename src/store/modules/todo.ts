import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { TodoState, TodoItem } from "../index.interface";

export const storeTodo = defineStore("todo", {
  state: () => ({
    todoList: useStorage("todoList", [
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
    ] as TodoItem[]),
  }),
  getters: {
    createId(): number {
      const todoList = JSON.parse(JSON.stringify(this.todoList));
      const length = todoList.length;
      const lastId: number = todoList[length - 1].id;
      return length === 0 ? 0 : lastId + 1;
    },
    allTodos(): TodoItem[] {
      /* eslint-disable @typescript-eslint/ban-ts-comment */
      // @ts-ignore
      return this.todoList;
      // JSON.parse(JSON.stringify(this.todoList))
    },
  },
  actions: {},
  debounce: {},
});
