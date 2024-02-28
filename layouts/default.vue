<template>
  <div>
    <header>
      <div class="promoheader">
        <div>
          <h1><span>Ai</span>terator ✨</h1>
          <h2>Layout to Prompt</h2>
        </div>
      </div>
    </header>
    <div class="toolbar">
      <div class="left-toolbar">
        <button class="refresh-btn" @click="handleAdd()">
          <icons-plus />
          Add Grid
        </button>
        <button
          class="refresh-btn"
          @click="
            $state.savedBlocks = [
              {
                label: '',
                columnAmount: 12,
                rowHeightAmount: 50,
                rowAmount: 16,
                savedCells: {},
                blockPrompt: '',
              },
            ]
          "
        >
          <icons-refresh />
        </button>
        <div style="display: flex">
          <button
            class="refresh-btn"
            @click="setState('canvas')"
            style="
              border-right: 0;
              border-top-right-radius: 0;
              border-bottom-right-radius: 0;
            "
          >
            <icons-edit />
          </button>
          <button
            class="refresh-btn"
            @click="setState('preview')"
            style="border-top-left-radius: 0; border-bottom-left-radius: 0"
          >
            <icons-eye />
          </button>
        </div>
      </div>
      <div class="right-toolbar">
        <!--         <button class="refresh-btn" style="border: 0; padding: 0">
          <icons-question />
        </button>
        <button class="refresh-btn">
          <input
            type="text"
            placeholder="Your OpenAI API Key..."
            v-model="$state.apiKey"
          />
        </button> -->
        <button class="hire-btn">
          <a href="https://leniolabs.com" target="_blank">Hire our dev team!</a>
        </button>
        <button
          class="refresh-btn generate-btn"
          @click="mainGenerate()"
          :disabled="$state.apiKey === ''"
        >
          Generate Design 🤖
        </button>
        <button
          @click="isOpen = !isOpen"
          class="refresh-btn"
          :class="{ active: isOpen }"
        >
          <icons-chevron-down v-if="!isOpen" />
          <icons-chevron-up v-if="isOpen" />
        </button>
      </div>
    </div>
    <div class="content-container">
      <template>
        <nuxt />
        <div class="mega-sidebar" v-if="isOpen">
          <div class="recode-block-container" style="flex: 0">
            <button
              class="export-btn"
              style="
                border-bottom-right-radius: 0;
                border-bottom-left-radius: 0;
                position: relative;
              "
            >
              HTML & CSS
              <icons-copy style="position: absolute; right: 15px" />
            </button>
            <div class="recode-block" ref="codemagic">
              <pre><code>&lt;<span class="tag">main</span>&gt;<template v-for="grid in $state.savedBlocks"> 
  &lt;<span class="tag">section</span><template v-if="grid.label != ''"> <span class="attr">class</span>="<span class="reval">{{grid.label}}</span>"</template> <span class="attr">style</span>="
    <span class="attr">display</span>: <span class="reval">grid</span>;
    <span class="attr">grid-template-columns</span>: <span class="reval">repeat({{grid.columnAmount}}, 1fr)</span>;
    <span class="attr">grid-template-rows</span>: <span class="reval">repeat({{grid.rowAmount}}, {{grid.rowHeightAmount}}px)</span>;
  "&gt;<template v-if="grid.blockPrompt != ''">
    <span class="attr-comment">&lt;!-- {{grid.blockPrompt}} --&gt;</span></template><template v-for="area in grid.savedCells">
    &lt;<span class="tag">div</span> <span class="attr">style</span>="<span class="attr">grid-area</span>: <span class="reval">{{area.area}}</span>"&gt;<template v-if="area.prompt != ''">
      <span class="attr-comment">&lt;!-- {{area.prompt}} --&gt;</span></template>
    &lt;/<span class="tag">div</span>&gt;</template>
  &lt;/<span class="tag">section</span>&gt;</template>
&lt;/<span class="tag">main</span>&gt;</code></pre>
            </div>
          </div>
          <div style="flex: 1" class="recode-block-container">
            <button
              class="reloading"
              :class="{ active: $state.loadingMasterPrompt }"
              @click="getMasterPrompt($refs.codemagic.innerHTML)"
              :disabled="$state.apiKey === ''"
            >
              <icons-loading />
            </button>
            <button
              style="
                border-bottom-right-radius: 0;
                border-bottom-left-radius: 0;
              "
            >
              AI Prompt
              <icons-copy style="position: absolute; right: 15px" />
            </button>
            <div
              class="recode-block"
              style="max-height: 450px; padding-top: 0"
              :class="{ loading: $state.loadingMasterPrompt }"
            >
              {{ $state.remasterPrompt }}
            </div>
          </div>

          <div style="margin-top: auto">
            <i>Built with <span style="color: #c2185b">&hearts;</span> by</i>
            <icons-leniologo />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  scrollToTop: false,
  data() {
    return {
      isOpen: true,
      numberOfMarks: 400,
      markSpacing: 5,
    };
  },
  mounted() {
    this.$nextTick(() => {
      if (this.$state.mainCode === "") {
        this.$state.renderedCode = this.$refs.codemagic.innerText;
      }
    });
  },
  updated() {
    this.$state.renderedCode = this.$refs.codemagic.innerText;
  },
  methods: {
    setState(tool) {
      this.$state.mainTool = tool;
      this.$state.savedBlocks.forEach((item) => {
        for (let cellId in item.savedCells) {
          if (item.savedCells.hasOwnProperty(cellId)) {
            item.savedCells[cellId].selectedTool = tool;
          }
        }
      });
    },
    async mainGenerate() {
      this.$state.mainTool = "preview";
      this.$state.mainCode = "";

      this.$state.loadingMain = true;
      await this.getMasterPrompt(this.$state.renderedCode);

      const originalData = JSON.parse(JSON.stringify(this.$state.savedBlocks));
      const transformedData = JSON.stringify(
        originalData.flatMap((block) =>
          Object.values(block.savedCells).map((cell) => ({
            area: cell.area,
            prompt: cell.prompt,
            html: "",
          }))
        )
      );
      console.log(transformedData);
      const completion = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.$state.apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo-0125",
            messages: [
              {
                role: "system",
                content: `For the JSON provided, populate each instance of [html] using [prompt] to generate beautiful HTML and CSS design.

                IMPORTANT:
                - YOU MUST REPLY EXACTLY THIS ARRAY: ${transformedData}. DO NOT ADD OR REMOVE KEYS, JUST MODIFY HTML VALUE
                - This code is intended for use in a V-HTML Vue element, so it should be valid for that context.
                - USE NESTED HTML TO CREATE COMPLETE DESIGN. IT CAN BE AS DEEP AND COMPLEX AS NEEDED
                - USE SINGLE QUOTES WHEN NEEDED
                - Exclude any JavaScript or comments.
                - USE ONLY INLINE STYLES
                - DO NOT INCLUDE GRID-AREA INLINE
                - The main container must cover its parent completely.
                - You can use UNSPLASH when the word "images" is in the prompt
                `,
              },
            ],
          }),
        }
      ).then((resp) => resp.json());

      const obj = completion.choices[0].message.content;
      console.log("obj", obj);

      this.$state.mainCode = obj
        .replaceAll("```html", "")
        .replaceAll("```json", "")
        .replaceAll("HTML:", "")
        .replaceAll("JSON:", "")
        .replaceAll("CSS:", "")
        .replaceAll("```css", "")
        .replaceAll("```", "");

      const reconstructedArray = JSON.parse(this.$state.mainCode);
      var reconstructedObject = {};
      for (let i = 0; i < reconstructedArray.length; i++) {
        const cellId = reconstructedArray[i].area
          .replaceAll("/", "")
          .replaceAll(" ", "");
        reconstructedObject[cellId] = {
          area: reconstructedArray[i].area,
          prompt: reconstructedArray[i].prompt,
          html: reconstructedArray[i].html,
        };
      }

      this.$state.savedBlocks.forEach((block) => {
        Object.keys(block.savedCells).forEach((key) => {
          if (reconstructedObject[key]) {
            this.$set(
              block.savedCells[key],
              "html",
              reconstructedObject[key].html
            );
          }
        });
      });

      this.$state.loadingMain = false;
      this.setState("preview");
    },
    async getMasterPrompt(parent) {
      this.$state.loadingMasterPrompt = true;
      const completion = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.$state.apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo-0125",
            messages: [
              {
                role: "system",
                content:
                  "Based on the provided HTML and CSS code, create a design prompt suitable for generating a visual representation. The code outlines a web page layout using CSS Grid, specifying the structure and positioning of various sections within the page. Translate these technical details into a descriptive prompt that can be used to visualize the layout. Do not say 'design prompt' at the beggining. Be verbose.",
              },
              {
                role: "user",
                content: parent,
              },
            ],
          }),
        }
      ).then((resp) => resp.json());

      const obj = completion.choices[0].message.content;
      this.$state.remasterPrompt = obj;
      this.$state.loadingMasterPrompt = false;
    },
    handleAdd() {
      this.$state.savedBlocks.push({
        label: "",
        columnAmount: 6,
        rowHeightAmount: 50,
        rowAmount: 4,
        savedCells: {},
        blockPrompt: "",
      });
    },
  },
};
</script>
<style lang="scss">
@keyframes rotateAnimation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.st0 {
  fill: #fff;
}
html {
  box-sizing: border-box;
  font-family: arial, helvetica, sans-serif;
  color: #222;

  p {
    color: #676c6f;
    strong {
      color: #676c6f;
    }
  }
}
*,
*:before,
*:after {
  box-sizing: inherit;
}

#Layer_1 {
  width: 150px;
  opacity: 0.9;
  left: -8px;
  margin: 3px 0;
  position: relative;
  cursor: pointer;
  &:hover {
    opacity: 1;
  }
}
button,
input {
  font-size: 13px;
}

#__layout,
#__layout > div,
#__nuxt,
html,
body {
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
}
body {
  padding-top: 20px;
  padding-left: 15px;
  padding-right: 15px;
  min-height: 100vh;
  background: linear-gradient(100deg, #000000, #32174d);
}

h1 {
  font-size: 20px;
}

header {
  display: flex;
  flex-direction: row;
  position: absolute;
  top: 12px;
  left: 20px;
}

button {
  max-width: max-content;
  background: #01579b;
  background: linear-gradient(to right, #01579b, #014980);

  padding: 0 14px;
  font-size: 13px;
  text-shadow: none;
  font-family: Consolas, Monaco, Andale Mono, Ubuntu Mono, monospace;
  color: #fff;
  border: 0;
  border-radius: 2px;
  cursor: pointer;
  &[disabled] {
    opacity: 0.5;
    pointer-events: none;
  }
}

button:hover {
  background: #014982;
}

header > div {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

a,
textarea {
  font-size: 13px;
  font-family: Consolas, Monaco, Andale Mono, Ubuntu Mono, monospace;
}

textarea {
  width: 90%;
  padding: 10px;
  border: 0;
  color: #ddd;
}

textarea:focus {
  outline: 0;
}

p,
ul,
h1,
h2 {
  margin: 0;
}

ul {
  padding-left: 25px;
}

ul li {
  margin-bottom: 10px;
}

header h1 {
  font-family: Helvetica, Arial, sans-serif;
  font-size: 24px;
  font-weight: lighter;
  min-width: max-content;
  color: #fff;
}

header h2 {
  color: #999;
  font-weight: normal;
  font-size: 13px;
  top: -1px;
  position: relative;
  font-family: monospace;
}

header h1 span {
  font-weight: 600;
  padding-right: 1px;
}

hr {
  border: 0;
  border-top: 1px solid #444;
  width: 100%;
}

#__layout > div {
  display: flex;
  flex-direction: column;
}

.content-container {
  flex: 1;
  display: flex;
  //flex-direction: column;
  position: relative;
  padding-left: 165px;
}
.mega-sidebar,
.toolbar {
  padding-bottom: 10px;
  display: flex;
  gap: 10px;
  justify-content: space-between;
  button {
    min-height: 35px;
    box-shadow: 0px 0px 0.9310142993927002px 0px rgba(0, 0, 0, 0.17),
      0px 0px 3.1270833015441895px 0px rgba(0, 0, 0, 0.08),
      0px 7px 14px 0px rgba(0, 0, 0, 0.05);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    position: relative;

    svg {
      fill: #fff;
      width: 16px;
    }
    &.export-btn {
      background: linear-gradient(to right, #388e3c, #35873a);
      &:hover {
        background: #2e7532;
      }
    }
    &.hire-btn {
      background: #c2185b;
      min-width: 220px;
      &:hover {
        background: #a3144d;
      }
    }
    &.refresh-btn {
      background: transparent;
      border: 1px solid #666;
      min-width: max-content;
      color: #ddd;
      &.active,
      &:hover {
        background: rgba(255, 255, 255, 0.25);
      }
      &.generate-btn {
        background: linear-gradient(-45deg, #01579b, #388e3c);
        border: 0;
        transition: all 0.2s linear;
        min-width: 279px;
        &:hover {
          background: linear-gradient(-45deg, #013b67, #317134);
          transition: all 0.2s linear;
        }
      }
    }
  }
  > div {
    display: flex;
    gap: 10px;
  }
}
.toolbar {
  user-select: none;
  padding-left: 165px;
}
.mega-sidebar button {
  max-width: 100%;
  width: 100%;
}

.fake-modal {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 9999999;
  display: flex;
  padding-top: 150px;
  justify-content: center;
  align-items: flex-start;
  .backdrop {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
  }
  .fake-modal-close {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 24px;
    color: #ccc;
    cursor: pointer;
    &:hover {
      color: #444;
    }
  }
  .fake-modal-content {
    background: #fff;
    position: relative;
    padding: 20px;
    align-items: flex-start;
    box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.25);
    min-width: 600px;
    border-radius: 3px;
  }
  h2 {
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
  }
  .code-block {
    height: 250px;
    border: 1px solid #ddd;
    background: #151515;
    position: relative;
    &:after {
      position: absolute;
      top: 0;
      width: 30px;
      left: 0;
      bottom: 0;
      background: #333;
      content: "";
    }
    &:before {
      content: "Coming Soon";
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      display: flex;
      color: #666;
      align-items: center;
      justify-content: center;
    }
  }
  .prompt-block {
    height: 250px;
    border: 1px solid #ddd;
    background: #fafafa;
    position: relative;
    &:before {
      content: "Coming Soon";
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      display: flex;
      color: #ccc;
      align-items: center;
      justify-content: center;
    }
  }
  button {
    min-height: 34px;
    margin-top: 10px;
  }
}

button a {
  text-decoration: none;
  color: #eee;
}

.mega-sidebar {
  width: 335px;
  margin-left: 10px;
  margin-top: 8px;
  display: flex;
  gap: 18px;
  flex-direction: column;
  justify-content: flex-start;
  height: calc(100vh - 100px);
  > div {
    display: flex;
    flex-direction: column;
    gap: 0;
    i {
      color: #999;
      font-style: normal;
      font-family: monospace;
      text-align: left;
    }
  }
}

.recode-block {
  background: #111;
  color: #bbb;
  border: 1px solid #333;
  border-radius: 2px;
  border-top: 0;
  border-top-right-radius: 0;
  border-top-left-radius: 0;
  padding: 12px;
  font-family: monospace;
  max-height: 220px;
  overflow: auto;
  font-size: 12px;
  height: 100%;
  white-space: pre-line;
  position: relative;
  transition: color 0.25s linear;
  &.loading {
    color: #666;
    code {
      color: #666;
    }
  }
  code {
    color: #bbb;
  }
}

pre {
  margin: 0;
}

.magic-preview {
  min-height: calc(100vh - 100px);
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  svg {
    position: absolute;
    z-index: -1;
  }
}

.recode-block-container {
  box-shadow: 0px 0px 0.9310142993927002px 0px rgba(0, 0, 0, 0.17),
    0px 0px 3.1270833015441895px 0px rgba(0, 0, 0, 0.08),
    0px 7px 14px 0px rgba(0, 0, 0, 0.05);
  position: relative;
}
.mega-sidebar > div.chevrutton-container {
  flex-direction: row;
  button {
  }
}
button.chevrutton {
  width: 45px;
  padding: 0px 0px 0px 10px;
  z-index: 99;
  background: transparent;
  box-shadow: none;
  padding-right: 5px;
}

.tag {
  color: #569cd6;
}
.attr {
  color: #9cdcfe;
}

.attr-comment {
  color: #74975d;
  white-space: normal;
}
.reval {
  color: #ce9178;
}

.mega-sidebar button.reloading {
  position: absolute;
  background: none;
  box-shadow: none;
  max-width: max-content;
  left: 0;
  z-index: 99;
  padding-right: 50px;
  &.active svg {
    animation: rotateAnimation 2s linear infinite;
  }
}
</style>
