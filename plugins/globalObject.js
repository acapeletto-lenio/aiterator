import Vue from "vue";

var state = {
  updated: 0,
  isOpen: false,
  apiKey: "",
  mainTool: "canvas",
  savedBlocks: [
    /*     {
      label: "Header",
      columnAmount: 4,
      rowHeightAmount: 60,
      rowAmount: 1,
    },
    {
      label: "Hero",
      columnAmount: 12,
      rowHeightAmount: 50,
      rowAmount: 6,
    }, */
    {
      label: "Grid #1",
      columnAmount: 12,
      rowHeightAmount: 50,
      rowAmount: 16,
      savedCells: {},
    },
  ],
};

export default async ({ app }, inject) => {
  inject("state", Vue.observable(state));
};
