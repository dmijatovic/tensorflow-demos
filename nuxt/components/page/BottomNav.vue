<template>
  <div class="bottom-nav">
    <dv4-custom-button
      @click="goPath('prev')"
      :disabled="prev.disabled"
      >
      {{prev.label}}
    </dv4-custom-button>
    <dv4-custom-button
      @click="goPath('next')"
      :disabled="next.disabled"
      primary>
      {{next.label}}
    </dv4-custom-button>
  </div>
</template>
<script>
export default {
  props:{
    prev:{
      type:Object,
      default:()=>{
        return {
          label:"Previous",
          href:"prev",
          disabled: false
        }
      }
    },
    next:{
      type:Object,
      default:()=>{
        return {
          label:"Next",
          href:"next",
          disabled: false
        }
      }
    }
  },
  methods:{
    goPath(dir){
      const where = this[dir].href
      if (where==='') return
      this.$emit("goPath", where)
    }
  }
}
</script>

<style scoped>
dv4-custom-button{
  width: 8rem;
}
</style>
