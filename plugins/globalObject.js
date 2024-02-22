import Vue from "vue";

var state = {
  updated: 0,
  isOpen: false,
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
      label: "Block #1",
      columnAmount: 12,
      rowHeightAmount: 50,
      rowAmount: 12,
    },
    {
      label: "Block #2",
      columnAmount: 6,
      rowHeightAmount: 50,
      rowAmount: 4,
    },
  ],
};

export default async ({ app }, inject) => {
  inject("state", Vue.observable(state));
};
