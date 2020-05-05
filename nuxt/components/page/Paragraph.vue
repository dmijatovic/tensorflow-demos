<template>
  <div>
    <h3 v-if="title">
      {{title}}
    </h3>
    {{text}}
  </div>
</template>

<script>
export default {
  props:{
    title:{
      type:String,
      default: null
    },
    text:{
      type:String,
      default:"Default text"
    }
  }
}
</script>

<style>

</style>
