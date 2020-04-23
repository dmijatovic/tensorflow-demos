<template>
  <section>
    <h3>Data info</h3>
    <table>
      <tr>
        <td>Records</td>
        <td>{{dataInfo.dataLength}}</td>
      </tr>
      <tr>
        <td>Label</td>
        <td>{{dataInfo.labelTarget}} ({{dataInfo.labelType}})</td>
      </tr>
      <tr>
        <td>Features</td>
        <td>{{dataInfo.featuresList}}</td>
      </tr>
    </table>
  </section>
</template>

<script>
export default {
  props:{
    dataInfo:{
      type:Object,
      default:()=>({
        dataLength:0,
        labelTarget:"",
        labelType:"",
        featuresList:[]
      })
    }
  },
  // mounted(){
  //   debugger
  //   console.log(this.$props)
  // }
}
</script>

<style>

</style>
