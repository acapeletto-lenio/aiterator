import Vue from "vue";

var state = {
  updated: 0,
  isOpen: false,
  apiKey: "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",
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
      label: "",
      columnAmount: 12,
      rowHeightAmount: 50,
      rowAmount: 12,
      savedCells: {},
      blockPrompt: "",
    },
    {
      label: "",
      columnAmount: 6,
      rowHeightAmount: 50,
      rowAmount: 4,
      savedCells: {},
      blockPrompt: "",
    },
  ],
};

export default async ({ app }, inject) => {
  inject("state", Vue.observable(state));
};
