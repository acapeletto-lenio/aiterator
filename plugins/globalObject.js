import Vue from "vue";
//import key from "~/static/ai.json";

var state = {
  updated: 0,
  isOpen: false,
  apiKey: "",
  mainTool: "canvas",
  remasterPrompt:
    "Visualize a webpage layout with two major sections within a main grid. The structure, built with CSS Grid, creates a flexible framework.\n\nThe first section represents a larger grid. Imagine it as a matrix with 12 equal columns and 12 rows, where each row is 50 pixels tall. This structure generates a uniform and consistent layout that can accommodate versatile content.\n\nThe second section presents a smaller grid, featuring 6 equal-width columns and 4 rows that are also 50 pixels tall. This smaller grid would sit inside the larger structure, providing a distinct subdivision within the overall layout.\n\nThe final design should highlight the modular nature of CSS grid layouts and exemplify how various sections with different grid specifications can share the same webpage space harmoniously.",
  renderedCode: "",
  loadingMasterPrompt: false,
  loadingMain: false,
  mainCode: "",
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
