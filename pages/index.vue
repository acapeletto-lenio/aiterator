<template>
  <div style="flex: 1; position: relative">
    <!--     <kpiSidebar />
 -->
    <div
      class="blocks-container"
      :class="{
        preview: $state.mainTool === 'preview',
        loading: $state.loadingMain,
      }"
    >
      <template v-if="$state.mainTool === 'preview'">
        <div class="preview-loader">
          <div>🤖</div>
          <div>Generating UI...</div>
          <div>(it might take a while!)</div>
        </div>
        <div
          class="main-container"
          style="overflow: hidden"
          v-html="$state.mainCode"
        ></div>
      </template>
      <template v-if="$state.mainTool === 'canvas'">
        <kpiBoard
          edit
          :data="i"
          :gridData="block"
          v-for="(block, i) in $state.savedBlocks"
          :key="`block-${i}`"
        />
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: "IndexPage",
  data() {
    return {};
  },
};
</script>

<style lang="scss">
.main-container {
  background: #fff;
  position: absolute;
  top: 8px;
  left: 0;
  bottom: 0;
  right: 0;
}
.blocks-container {
  box-shadow: 0px 0px 10px 0px #000;
  background: #fff;
  //min-height: calc(100vh - 100px);
  background: repeating-linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.05),
      rgba(255, 255, 255, 0.05),
      rgba(255, 255, 255, 0.05),
      rgba(255, 255, 255, 0.05) 4px,
      rgba(0, 0, 0, 0.05) 6px
    )
    #fff;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 2 2'%3E%3Cpath d='M1 2V0h1v1H0v1z' fill-opacity='.015'/%3E%3C/svg%3E")
    0 0/16px 16px #fff;
  //max-width: 1440px;
  margin: 8px auto;
  border-top: 1px solid #ddd;
  .preview-loader {
    display: none;
  }
  &.loading .main-container {
    background: repeating-linear-gradient(
        45deg,
        rgba(255, 255, 255, 0.05),
        rgba(255, 255, 255, 0.05),
        rgba(255, 255, 255, 0.05),
        rgba(255, 255, 255, 0.05) 4px,
        rgba(0, 0, 0, 0.05) 6px
      )
      #fff;
  }
  &.loading .preview-loader {
    z-index: 999;
    position: absolute;
    left: 0;
    right: 0;
    top: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    > div:first-child {
      font-size: 40px;
      animation: blink-animation 0.5s linear infinite;
    }
    > div:last-child {
      color: #888;
    }
  }
  &.preview {
    background: #fff;
    border-top: 0;
    .container-grid > i {
      border-color: transparent;
    }
  }
  .container-grid-container {
    //border-top: 1px solid #ddd;
  }
  > div:first-child {
    .container-grid-container {
      border-top: 0;
      .vertical-ruler.left {
        border-top: 1px dashed #555;
      }
    }
  }
  > div:last-child {
    .container-grid-container {
      border-bottom: 1px solid #ddd;
    }
  }
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
</style>
