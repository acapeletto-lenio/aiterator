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
                label: 'Grid #1',
                columnAmount: 12,
                rowHeightAmount: 50,
                rowAmount: 12,
              },
              {
                label: 'Grid #2',
                columnAmount: 6,
                rowHeightAmount: 50,
                rowAmount: 4,
              },
            ]
          "
        >
          <icons-trash />
        </button>
        <div style="display: flex">
          <button
            class="refresh-btn"
            :class="{ active: $state.mainTool === 'canvas' }"
            @click="$state.mainTool = 'canvas'"
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
            :class="{ active: $state.mainTool === 'preview' }"
            @click="$state.mainTool = 'preview'"
            style="border-top-left-radius: 0; border-bottom-left-radius: 0"
          >
            <icons-eye />
          </button>
        </div>
      </div>
      <div class="right-toolbar">
        <button class="refresh-btn" style="border: 0; padding: 0">
          <icons-question />
        </button>
        <button class="refresh-btn">
          <input
            type="text"
            placeholder="Your OpenAI API Key..."
            v-model="$state.apiKey"
          />
        </button>
        <button class="refresh-btn generate-btn">Generate Design 🤖</button>
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
      <div
        class="fake-modal"
        style="display: none"
        v-if="$state.mainTool === 'export'"
      >
        <div class="backdrop" @click="$state.mainTool = 'canvas'"></div>
        <div class="fake-modal-content">
          <div class="fake-modal-close" @click="$state.mainTool = 'canvas'">
            ×
          </div>

          <h2>Export Code</h2>
          <div>
            <div class="code-block"></div>
          </div>
          <div class="fake-modal-actions">
            <button @click="$state.mainTool = 'canvas'">Close</button>
          </div>
        </div>
      </div>

      <template v-if="$state.mainTool === 'canvas'">
        <nuxt />
        <div class="mega-sidebar" v-if="isOpen">
          <div class="recode-block-container">
            <button
              class="export-btn"
              style="
                border-bottom-right-radius: 0;
                border-bottom-left-radius: 0;
                position: relative;
              "
            >
              HTML & CSS
              <icons-copy style="position: absolute; right: 10px" />
            </button>
            <div class="recode-block">
              <pre><code>&lt;<span class="tag">main</span>&gt;<template v-for="grid in $state.savedBlocks"> 
  &lt;<span class="tag">section</span> <span class="attr">style</span>="<span class="attr">display</span>: <span class="reval">grid</span>;
    <span class="attr">grid-template-columns</span>: <span class="reval">repeat({{grid.columnAmount}}, 1fr)</span>;
    <span class="attr">grid-template-rows</span>: <span class="reval">repeat({{grid.rowAmount}}, {{grid.rowHeightAmount}}px)</span>;
  "&gt;<template v-for="area in grid.savedCells">
    &lt;<span class="tag">div</span> <span class="attr">style</span>="<span class="attr">grid-area</span>: <span class="reval">{{area.area}}</span>"&gt;&lt;/<span class="tag">div</span>&gt;</template>
  &lt;/<span class="tag">section</span>&gt;</template>
&lt;/<span class="tag">main</span>&gt;


</code></pre>
            </div>
          </div>
          <div
            style="flex: 1; max-height: 400px"
            class="recode-block-container"
          >
            <button
              style="
                border-bottom-right-radius: 0;
                border-bottom-left-radius: 0;
              "
            >
              AI Prompt
              <icons-copy style="position: absolute; right: 10px" />
            </button>
            <div class="recode-block" style="max-height: initial">
              "Design a user interface for a web application that leverages a
              grid layout with two main sections.
              <br /><br />
              The top section, covering the first two rows across all twelve
              columns, should feature a dynamic banner that showcases the latest
              or most important news, including eye-catching visuals and
              headlines. The second section, spanning from the third to the
              tenth row across all twelve columns, should be dedicated to a mix
              of articles, interviews, and photo essays, organized in a visually
              appealing manner that encourages exploration and reading.
              <br /><br />
              Each article tile should include a headline, a brief summary, and
              a thumbnail image. The layout should prioritize readability,
              intuitive navigation, and should adapt seamlessly to different
              screen sizes, from desktops to tablets and mobile phones. Include
              interactive elements such as hover effects for desktop users and
              touch feedback for mobile users, to enhance user engagement and
              provide a modern, responsive user experience."
            </div>
          </div>

          <div style="margin-top: auto">
            <i>Built with <span style="color: #c2185b">&hearts;</span> by</i>
            <icons-leniologo />
            <button class="hire-btn">
              <a href="https://leniolabs.com" target="_blank"
                >Hire our dev team!</a
              >
            </button>
          </div>
        </div>
      </template>
      <template v-if="$state.mainTool === 'preview'">
        <div class="magic-preview">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path
              fill="#F2F4F8"
              d="M44.3,-55.3C60,-49.6,77,-40.1,83.7,-25.7C90.4,-11.3,86.9,7.9,79.3,24.1C71.7,40.3,60.1,53.6,46.3,59.5C32.4,65.5,16.2,64.1,-0.1,64.3C-16.4,64.4,-32.9,66.2,-48.6,60.8C-64.3,55.5,-79.2,43,-83.8,27.5C-88.4,12,-82.7,-6.5,-76.8,-25C-70.8,-43.5,-64.7,-62.1,-51.9,-68.7C-39,-75.2,-19.5,-69.9,-2.6,-66.3C14.3,-62.8,28.6,-60.9,44.3,-55.3Z"
              transform="translate(100 100)"
            />
          </svg>
          <div
            style="
              display: flex;
              flex-direction: column;
              gap: 10px;
              max-width: 200px;
              margin: 0 auto;
              justify-content: center;
            "
          >
            <div style="font-size: 100px; text-align: center">🪄</div>
            <div style="color: #666; text-align: center">
              Define your grid and areas and click [Generate Design] to populate
              this section.
            </div>
          </div>
        </div>
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="#F2F4F8"
            d="M66.1,-38.2C78.2,-17.3,75.3,12.3,61.8,32.7C48.3,53,24.2,64.3,-1.8,65.3C-27.7,66.3,-55.5,57.2,-66.6,38.2C-77.7,19.2,-72.2,-9.7,-58.3,-31.6C-44.5,-53.6,-22.2,-68.7,2.4,-70.1C27,-71.5,54.1,-59.2,66.1,-38.2Z"
            transform="translate(150 100)"
          />
        </svg>
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

  methods: {
    handleAdd() {
      this.$state.savedBlocks.unshift({
        label: `Grid #${this.$state.savedBlocks.length + 1}`,
        columnAmount: 6,
        rowHeightAmount: 50,
        rowAmount: 4,
      });
    },
  },
};
</script>
<style lang="scss">
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
  width: 160px;
  opacity: 0.9;
  left: -10px;
  position: relative;
  cursor: pointer;
  &:hover {
    opacity: 1;
  }
}

#__layout,
#__layout > div,
#__nuxt,
html,
body {
  //background: #1e1e1e;

  //min-height: 100vh;
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
  padding-right: 2px;
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
        min-width: 280px;
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
  padding: 10px;
  font-family: monospace;
  max-height: 150px;
  overflow: auto;
  font-size: 12px;
  code {
    color: #ddd;
  }
}

pre {
  margin-top: 0;
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

.reval {
  color: #ce9178;
}
</style>
