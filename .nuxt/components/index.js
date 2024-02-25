export { default as KpiBoard } from '../../components/kpiBoard.vue'
export { default as IconsChevronDown } from '../../components/icons/chevron-down.vue'
export { default as IconsChevronUp } from '../../components/icons/chevron-up.vue'
export { default as IconsCopy } from '../../components/icons/copy.vue'
export { default as IconsEdit } from '../../components/icons/edit.vue'
export { default as IconsEye } from '../../components/icons/eye.vue'
export { default as IconsLeniologo } from '../../components/icons/leniologo.vue'
export { default as IconsPlus } from '../../components/icons/plus.vue'
export { default as IconsQuestion } from '../../components/icons/question.vue'
export { default as IconsRefresh } from '../../components/icons/refresh.vue'
export { default as IconsTrash } from '../../components/icons/trash.vue'

// nuxt/nuxt.js#8607
function wrapFunctional(options) {
  if (!options || !options.functional) {
    return options
  }

  const propKeys = Array.isArray(options.props) ? options.props : Object.keys(options.props || {})

  return {
    render(h) {
      const attrs = {}
      const props = {}

      for (const key in this.$attrs) {
        if (propKeys.includes(key)) {
          props[key] = this.$attrs[key]
        } else {
          attrs[key] = this.$attrs[key]
        }
      }

      return h(options, {
        on: this.$listeners,
        attrs,
        props,
        scopedSlots: this.$scopedSlots,
      }, this.$slots.default)
    }
  }
}
