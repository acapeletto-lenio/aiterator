<template>
  <div style="flex: 1">
    <!--     <kpiSidebar />
 -->
    <div
      class="blocks-container"
      :class="{ preview: $state.mainTool === 'preview' }"
    >
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
  &.preview {
    background: #fff;
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
</style>
