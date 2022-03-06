import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import itemList from "@/views/item-list.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/:status?",
    name: "item-list",
    component: itemList,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
