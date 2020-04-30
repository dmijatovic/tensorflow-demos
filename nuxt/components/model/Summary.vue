<template>
<table>
  <tr>
    <td>Label</td><td>{{config.label}}</td>
  </tr>
  <tr>
    <td>Features</td><td>{{config.features ? config.features.toString():""}}</td>
  </tr>
  <tr>
    <td>Epochs</td><td>{{config.epochs}}</td>
  </tr>
  <tr>
    <td>Batch size</td><td>{{config.batchSize}}</td>
  </tr>
  <tr>
    <td>Optimizer</td><td>{{JSON.stringify(config.optimizer)}}</td>
  </tr>
  <tr>
    <td>Loss Fn</td><td>{{JSON.stringify(config.loss)}}</td>
  </tr>
  <tr v-if="config.layers.length===0">
    <td>Layers:</td><td>NO LAYERS DEFINED FOR THE MODEL. <a href="/model/layers">Go back</a></td>
  </tr>
  <tr
    v-for="(layer,pos) in config.layers"
    :key="pos">
    <td>Layer {{pos+1}}</td><td>{{JSON.stringify(layer)}}</td>
  </tr>
</table>
</template>
<script>
import {mapState} from "vuex"
export default {
  props:{
    config:{
      type: Object,
      default:()=>({
        label:null,
        features:[],
        epochs:null,
        batchSize:null,
        optimizer:{
          type: null,
          args:[]
        },
        loss:{
          type: null,
          args:[]
        },
        layers:[]
      })
    }
  }
}
</script>

<style>

</style>
