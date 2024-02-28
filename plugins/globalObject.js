import Vue from "vue";
import localKey from "~/static/ai.json";
export default async ({ app }, inject) => {
  const apiKey = app.$config.apiKey;

  var state = {
    updated: 0,
    isOpen: false,
    apiKey: apiKey || localKey.data,
    mainTool: "canvas",
    remasterPrompt:
      "Imagine a webpage layout where the main content area is divided into a grid with 12 columns and 16 rows. Each row has a height of 50px. Picture this grid structure as if you are organizing information on a digital bulletin board, where you can place different elements in a precise manner. The grid offers a structured canvas for arranging content in a neat and organized way. \n\nVisualize how various sections like text, images, buttons, or interactive elements could be placed within this grid layout to create a visually appealing and well-structured webpage design. Consider the possibilities of symmetry, balance, and creative placement of content within the defined grid structure to optimize the user experience and visual appeal of the webpage.",
    renderedCode: "",
    loadingMasterPrompt: false,
    loadingMain: false,
    savedBlocks: [
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

  inject("state", Vue.observable(state));
};
