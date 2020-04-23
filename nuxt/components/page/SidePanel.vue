<template>
  <nav class="side-panel">
    <dv4-custom-button
      v-for="item in nav"
      :key="item.label"
      :disabled="item.disabled"
      @click="(e)=>emitClick(e,item.action)"
    >
    {{item.label}}
    </dv4-custom-button>
  </nav>
</template>

<script>
export default {
  props:{
    nav:{
      type:Array,
      default:()=>{
        return [{
          label:"Test Btn",
          action:"TestAction",
          disabled: false
        }]
      }
    }
  },
  methods:{
    emitClick({target},action){
      const disabled = target.getAttribute("disabled")
      if (disabled) return
      this.$emit("navClick",action)
    }
  }
}
</script>

<style>

</style>
