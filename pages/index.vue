<template>
  <div style="flex: 1; position: relative">
    <!--     <kpiSidebar />
 -->
    <div
      class="blocks-container"
      :class="{
        loading: $state.loadingMain,
      }"
    >
      <template v-if="$state.loadingMain">
        <div class="preview-loader">
          <div class="preview-loader-content">
            <div>🤖</div>
            <div>Generating UI...</div>
            <div>(this might take a while!)</div>
          </div>
        </div>
      </template>
      <kpiBoard
        edit
        :data="i"
        :gridData="block"
        v-for="(block, i) in $state.savedBlocks"
        :key="`block-${i}`"
      />
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
    top: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 65px;
    z-index: 9999999;

    .preview-loader-content {
      border-radius: 10px;
      overflow: hidden;
      background-color: #fff;
      padding: 30px 50px;
      box-shadow: 0 0 10px 0px rgba(0, 0, 0, 0.15);
      max-width: max-content;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      gap: 5px;
      > div:first-child {
        font-size: 50px;
        animation: blink-animation 0.5s linear infinite;
      }
      > div:last-child {
        color: #888;
      }
    }
    &:before {
      content: "";
      background: rgba(0, 0, 0, 0.2);
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
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
