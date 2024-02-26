import Vue from "vue";

var state = {
  updated: 0,
  isOpen: false,
  apiKey: "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",
  mainTool: "canvas",
  remasterPrompt: "",
  renderedCode: "",
  loadingMasterPrompt: false,
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
      rowAmount: 16,
      savedCells: {},
      blockPrompt: "",
    },
  ],
};

export default async ({ app }, inject) => {
  inject("state", Vue.observable(state));
};
