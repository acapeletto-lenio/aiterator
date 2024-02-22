<template>
  <div style="flex: 1; position: relative">
    <div class="container-grid-container" :style="{ 'max-width': `100%` }">
      <div
        class="container-grid"
        :key="updated"
        :style="{
          'grid-template-columns': `repeat(${gridData.columnAmount}, 1fr)`,
          'grid-template-rows': `repeat(${gridData.rowAmount}, ${gridData.rowHeightAmount}px)`,
          'align-items': 'flex-start',
          //'min-height': initialHeight,
        }"
      >
        <!-- Grid cells -->
        <i
          @pointerdown="startDrag($event)"
          @pointerup="endDrag($event)"
          @mousemove="hoverling($event)"
          v-for="cells in gridData.columnAmount * gridData.rowAmount"
          v-if="!loading"
          :data-row-start="Math.ceil(cells / gridData.columnAmount)"
          :data-row-end="Math.ceil(cells / gridData.columnAmount) + 1"
          :data-col-start="getColStart(cells)"
          :data-col-end="getColStart(cells) + 1"
          :key="`cells-${cells}`"
          :class="{
            active: edit,
            lastcol: getColStart(cells) === gridData.columnAmount,
            lastrow:
              Math.ceil(cells / gridData.columnAmount) === gridData.rowAmount,
          }"
          :style="{ height: `${gridData.rowHeightAmount}px` }"
        ></i>

        <!-- Temporary selection -->
        <div ref="selecter" class="selecter-cell"></div>

        <!-- Saved areas -->
        <section
          v-for="(item, parent) in savedCells"
          :ref="parent"
          :style="{
            'grid-area': item.area,
          }"
          :key="parent"
        >
          <!-- Area tools -->
          <div
            class="internal-tools-internal"
            v-if="edit && internalLoading != parent"
          >
            <button
              class="delete"
              v-if="edit && internalLoading != parent"
              @click="$delete(savedCells, parent)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 -960 960 960"
                width="24"
              >
                <path
                  d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"
                />
              </svg>
            </button>

            <button
              :class="{
                delete: true,
                active: item.selectedTool === tool,
              }"
              @click="savedCells[parent].selectedTool = tool"
              v-for="(svg, tool) in areaTools"
              v-html="svg"
              v-if="item.generatedHtml != ''"
            ></button>

            <button class="delete generate" @click="getReply(parent)">
              Generate
            </button>
          </div>

          <!-- Loading -->
          <div class="internal-loading" v-if="internalLoading === parent"></div>

          <!-- Preview -->
          <div
            class="generatedContent"
            style="display: contents"
            v-html="item.generatedHtml"
            v-if="internalLoading != parent && item.selectedTool === 'preview'"
          ></div>

          <!-- Code -->
          <!-- TODO -->
          <div
            class="seleccionador coder"
            v-if="internalLoading != parent && item.selectedTool === 'code'"
          >
            <pre>{{ item.generatedHtml }}</pre>
          </div>
          <!-- Prompt -->
          <div
            class="seleccionador"
            v-if="internalLoading != parent && item.selectedTool === 'prompt'"
          >
            <div>
              <input
                placeholder="Enter prompt..."
                v-model="savedCells[parent].promptText"
                @keyup.enter="getReply(parent)"
              />
            </div>
          </div>
        </section>
      </div>
      <div class="horizontal-ruler">
        <div v-for="mark in gridData.columnAmount">
          <span> {{ mark }} </span>
        </div>
      </div>
      <div class="horizontal-ruler bottom">
        <div v-for="mark in gridData.columnAmount">
          <span> {{ mark }} </span>
        </div>
      </div>
      <div class="vertical-ruler" style="top: -1px; bottom: 1px">
        <div v-for="mark in gridData.rowAmount">
          <span>{{ mark }}</span>
        </div>
      </div>
      <div class="vertical-ruler right">
        <div v-for="mark in gridData.rowAmount">
          <span>{{ mark }}</span>
        </div>
      </div>
      <div class="vertical-ruler left">
        <div>
          <p
            class="block-label"
            @click="
              $state.savedBlocks =
                $state.savedBlocks.length > 1
                  ? $state.savedBlocks.filter(
                      (block) => block.label !== gridData.label
                    )
                  : $state.savedBlocks
            "
          >
            {{ gridData.label }}
          </p>
          <p>
            <input type="number" v-model="gridData.columnAmount" />×<input
              type="number"
              v-model="gridData.rowAmount"
            />
          </p>
          <textarea name="" id="" placeholder="Enter prompt..."></textarea>
          <!--           <p>{{ gridData.rowHeightAmount }}px</p>
 -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "IndexPage",
  props: {
    data: {
      type: Object,
      required: false,
    },
    gridData: {
      type: Object,
      required: false,
    },
    edit: {
      type: Boolean,
      required: false,
    },
  },
  data() {
    return {
      columnAmount: 12,
      rowHeightAmount: 50,
      rowAmount: 6,
      maxWidth: 1366,
      selectedCat: "Todos",
      dragging: false,
      saredUrl: false,
      loading: true,
      internalLoading: false,
      modalOpen: "",
      startX: "",
      startY: "",
      boardID: "",
      savedCells: {},
      updated: 0,
      promptText: "",
      promptResponse: "",
      initialHeight: "calc(100vh - 60px)",
      areaTools: {
        prompt:
          "<svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M3 16V15H18V16H3ZM3 12V11H15V12H3ZM3 8V7H21V8H3Z' fill='black'/></svg>",
        code: "<svg xmlns='http://www.w3.org/2000/svg' height='24' viewBox='0 -960 960 960' width='24'><path d='M320-240 80-480l240-240 57 57-184 184 183 183-56 56Zm320 0-57-57 184-184-183-183 56-56 240 240-240 240Z'/></svg>",
        preview:
          "<svg xmlns='http://www.w3.org/2000/svg' height='24' viewBox='0 -960 960 960' width='24'><path d='M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59 5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z'/></svg>",
      },
    };
  },
  created() {
    this.boardID = this.$route.path;
  },
  mounted() {
    this.loading = false;
  },

  methods: {
    handleRemove() {},
    async getReply(parent) {
      this.internalLoading = parent;
      const completion = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer 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`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: `For the user's description provided below, generate the HTML and CSS CODE necessary to create the described UI component.

IMPORTANT:
- Begin with the HTML code, then follow with the CSS code within <style></style> tags.
- This code is intended for use in a V-HTML Vue element, so it should be valid for that context.
- Exclude any JavaScript or comments from your response.
- Include unique IDs for each element.
- AVOID ELEMENT SELECTORS
- The main container must be width: 100% and margin: 0 to fit its parent container fully.
- THE HEIGHT SHOULD COVER THE PARENT COMPLETELY
- You can use UNSPLASH when the word "images" is in the prompt
`,
              },
              {
                role: "user",
                content: this.savedCells[parent].promptText,
              },
            ],
          }),
        }
      ).then((resp) => resp.json());

      const obj = completion.choices[0].message.content;
      this.promptResponse = obj
        .replaceAll("```html", "")
        .replaceAll("HTML:", "")
        .replaceAll("CSS:", "")
        .replaceAll("```css", "")
        .replaceAll("```", "");
      this.promptText = "";

      this.savedCells[parent].selectedTool = "preview";
      this.savedCells[parent].generatedHtml = this.promptResponse;
      this.internalLoading = false;
    },
    handleHeightAmount(event) {
      const newHeightmount = parseInt(event.target.value, 10);

      if (
        !isNaN(newHeightmount) &&
        newHeightmount > 4 &&
        newHeightmount < 100
      ) {
        this.initialHeight = "auto";

        this.rowHeightAmount = Math.floor(newHeightmount);
      }
    },
    handleColumnAmount(event) {
      const newColumnAmount = parseInt(event.target.value, 10);
      if (
        !isNaN(newColumnAmount) &&
        newColumnAmount > 1 &&
        newColumnAmount < 25
      ) {
        this.loading = true;
        this.gridData.columnAmount = newColumnAmount;
        this.loading = false;
      } else {
        console.error("Invalid column amount:", newColumnAmount);
      }
    },

    clearBoard(cells) {
      for (let cell in cells) {
        this.$delete(this.savedCells, cell);
      }
      this.boardID = "";
      this.$router.replace({ path: "" });
    },

    getColStart(i) {
      var pepe = Math.ceil(i % this.gridData.columnAmount);
      if (pepe === 0) {
        pepe = this.gridData.columnAmount;
      }
      return pepe;
    },
    startDrag(e) {
      this.dragging = true;
      this.startX = e.clientX;
      this.startY = e.clientY;

      this.$refs.selecter.style.gridRowStart = e.target.dataset.rowStart;
      this.$refs.selecter.style.gridRowEnd = e.target.dataset.rowEnd;
      this.$refs.selecter.style.gridColumnStart = e.target.dataset.colStart;
      this.$refs.selecter.style.gridColumnEnd = e.target.dataset.colEnd;
      this.$refs.selecter.style.display = "block";
    },
    endDrag(e) {
      this.dragging = false;
      this.startX = "";
      this.startY = "";

      const cellId =
        this.$refs.selecter.style.gridRowStart +
        this.$refs.selecter.style.gridRowEnd +
        this.$refs.selecter.style.gridColumnStart +
        this.$refs.selecter.style.gridColumnEnd;

      var newCell = {
        area: `${this.$refs.selecter.style.gridRowStart} / ${this.$refs.selecter.style.gridColumnStart} / ${this.$refs.selecter.style.gridRowEnd} / ${this.$refs.selecter.style.gridColumnEnd}`,
        hasChart: false,
        generatedHtml: "",
        promptText: "",
        selectedTool: "prompt",
      };
      this.$refs.selecter.style.gridRowStart = "";
      this.$refs.selecter.style.gridRowEnd = "";
      this.$refs.selecter.style.gridColumnStart = "";
      this.$refs.selecter.style.gridColumnEnd = "";
      this.$refs.selecter.style.display = "none";

      this.$set(this.savedCells, cellId, newCell);

      console.log(this.savedCells);
    },
    hoverling(e) {
      if (this.dragging === true) {
        var yDir = this.startY - e.clientY;
        var xDir = this.startX - e.clientX;
        if (xDir > 0) {
          this.$refs.selecter.style.gridColumnStart = e.target.dataset.colStart;
        }
        if (xDir < 0) {
          this.$refs.selecter.style.gridColumnEnd = e.target.dataset.colEnd;
        }
        if (yDir > 0) {
          this.$refs.selecter.style.gridRowStart = e.target.dataset.rowStart;
        }
        if (yDir < 0) {
          this.$refs.selecter.style.gridRowEnd = e.target.dataset.rowEnd;
        }
      }
    },
  },
};
</script>

<style lang="scss">
.container-grid-container {
  margin: 0 auto;
  position: relative;
}
.container-grid {
  display: grid;
  position: relative;

  //background: #fff;

  > i {
    pointer-events: none;
    cursor: crosshair;
    position: relative;
    border-right: 1px solid #eee;
    border-bottom: 1px solid #eee;
    &.active {
      pointer-events: all;
      &:after {
        content: "";
        width: 2px;
        height: 2px;
        border-radius: 10px;
        position: absolute;
        bottom: -1px;
        right: -1px;
        background: #aaa;
        display: none;
      }
      &.lastrow:after,
      &.lastcol:after,
      &[data-col-start="1"][data-col-end="2"]:before,
      &[data-row-start="1"][data-row-end="2"]:before {
        content: "";
        width: 2px;
        height: 2px;
        border-radius: 10px;
        position: absolute;
        top: -1px;
        left: -1px;
        background: #aaa;
        display: none;
      }
      &.lastrow {
        border-bottom: 0;
      }
      &.lastcol {
        border-right: 0;
      }
    }
    &:hover {
      background: rgba(255, 255, 0, 0.3);
    }
  }
  .selecter-cell {
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 0, 0.3);
    display: none;
    pointer-events: none;
  }
  > section {
    background: #fff;

    outline: 1px solid #eee;
    outline-offset: -1px;

    position: absolute;
    left: 0;
    bottom: 0;
    top: 0;
    right: 0;
    overflow: hidden;
    z-index: 999;
    &:hover {
      outline: 3px solid rgba(253, 216, 53, 0.95);
      outline-offset: -3px;
      border-radius: 0;
      z-index: 9999;
      button.delete {
        display: flex;
      }
    }
    button.delete {
      border: 0;
      border-radius: 0;

      cursor: pointer;
      align-items: center;
      z-index: 9;
      padding: 0 8px 0;
      color: #111;
      background: rgba(253, 216, 53, 0.95);
      display: none;
      border: 0;

      border-left: 1px solid #e1b802;
      &.disabled {
        pointer-events: none;
        svg {
          opacity: 0.5;
        }
      }
      svg {
        width: 14px;
        height: auto;
        stroke: #111;
      }
      &.active,
      &:hover {
        background: #e1b802;
      }
      &.generate {
        border: 0;
        border-left: 1px solid #e1b802;

        width: max-content;
        cursor: pointer;
        &:last-child {
          border-left: 0;
        }
        svg {
          width: 18px;
          height: auto;
          stroke: transparent;
        }
      }
    }
  }
}

.seleccionador {
  position: absolute;
  left: 0;
  bottom: 0;
  top: 0;
  right: 0;
  display: flex;
  &.disabled {
    pointer-events: none;
    opacity: 0.5;
  }
  &.coder {
    pre {
      color: #333;
      padding: 15px;
    }
  }
  h2 {
    position: absolute;
    top: 20px;
    left: 20px;
    margin: 0;
    font-size: 18px;
    font-weight: 400;
    font-family: Helvetica, Arial, sans-serif;
    font-weight: lighter;
    color: #888;
  }
}

.internal-loading {
  background-color: rgba(0, 0, 0, 0);

  opacity: 0.8;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
}
.internal-loading::after {
  content: "🤖 Generating UI...";
  display: flex;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  align-items: center;
  justify-content: center;
  font-family: monospace;
  color: #222;
  animation: blink-animation 0.5s linear infinite;
}

@keyframes blink-animation {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.65;
  }
}
.seleccionador > div input {
  pointer-events: initial;
  text-align: center;
  border: 0;
  font-size: 22px;
  color: #888;
  background: transparent;
  width: 100%;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  &:focus {
    outline: 0;
  }
}
.seleccionador > div button {
  position: absolute;

  right: 30px;
  top: 5px;
}
textarea {
  background: transparent;
  width: 90%;
  resize: none;
  border: 1px solid #444;
  color: #ccc;
}

button input[type="text"],
input[type="number"] {
  background: transparent;
  border: 1px solid #666;
  padding: 4px 6px;
  font-family: monospace;
  max-width: 50px;
  color: #aaa;
  &:focus {
    outline: 0;
  }
}

button input[type="text"] {
  max-width: 180px;
  padding-left: 0;
  border: 0;
  color: #ddd;
  &:focus {
    outline: 0;
  }
}

.generatedContent > * {
  height: 100% !important;
}

.horizontal-ruler {
  display: flex;
  position: absolute;
  z-index: 99;
  left: -1px;
  right: 1px;

  pointer-events: none;
  top: 0;
  user-select: none;
  &.bottom {
    top: initial;
    bottom: 0;
  }
  > div {
    flex: 1;
    align-items: flex-end;
    display: flex;
    position: relative;
    span {
      position: absolute;
      right: 0;
      left: 0;
      text-align: center;
      color: #ccc;
      font-family: monospace;
      font-size: 11px;
      top: 3px;
      color: transparent;
    }
    &:after {
      content: "";
      width: 1px;
      height: 10px;
      background: #ccc;
      display: block;
    }
    &:first-child:after {
      display: none;
    }
  }
}

.vertical-ruler {
  display: flex;
  flex-direction: column;
  width: 30px;
  position: absolute;
  left: 0;
  bottom: 0;
  top: 0;
  z-index: 9999;
  user-select: none;
  pointer-events: none;
  &.right {
    left: initial;
    right: 0px;
    bottom: 1px;
    top: -1px;
    > div {
      justify-content: flex-end;
    }
  }
  &.left {
    //left: initial;
    left: -160px;
    border-top: 1px dashed #555;
    width: 160px;
    padding: 8px;
    padding-right: 10px;
    padding-left: 8px;
    pointer-events: all;
    &:after {
      content: "";
      height: 8px;
      width: 1px;
      border-left: 1px dashed #555;
      position: absolute;
      top: 0;
      left: 0;
    }
    textarea {
      padding: 0;
      margin: 0;
      border: 0;
      height: 100%;
      width: 100%;
    }
    > div {
      justify-content: flex-start;
      align-items: flex-start;
      flex-direction: column;
      gap: 4px;
      p {
        display: flex;
        align-items: center;
        gap: 4px;
        color: #ccc;
        font-size: 13px;
        bottom: initial;
        left: 0;
        padding: 0;
        font-family: monospace;
        margin: 0;
        padding-bottom: 5px;
        width: 100%;
        input {
          border-color: #444;
        }
        & ~ p {
          padding-top: 0;
          color: #888;
        }
      }
    }
  }
  > div {
    flex: 1;
    justify-content: flex-start;
    display: flex;
    position: relative;
    span {
      position: absolute;
      top: 0;
      bottom: 0;
      align-items: center;
      color: #ccc;
      color: transparent;
      font-family: monospace;
      left: 4px;
      font-size: 11px;
      display: flex;
    }
    &:after {
      content: "";
      height: 1px;
      width: 10px;
      background: #ccc;
      display: block;
    }
    &:first-child:after {
      display: none;
    }
  }
}

.internal-tools-internal {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  flex-direction: row-reverse;
  > * {
    padding: 5px 8px !important;
  }
}

.vertical-ruler.left > div p.block-label {
  cursor: pointer;
  &:hover {
    color: crimson;
    &:after {
      content: "×";
      margin-left: 5px;
    }
  }
}
</style>
