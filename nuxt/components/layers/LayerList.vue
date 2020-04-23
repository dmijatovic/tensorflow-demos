<template>
<section>
  <table v-if="layersInfo.length > 0">
    <tr>
      <th v-for="item in tableInfo"
        :key="item.label">
        {{item.label}}
      </th>
      <th>Commands</th>
    </tr>
    <tr v-for="(item,pos) in layersInfo"
      :key="pos">

      <td v-for="col in tableInfo"
        :key="JSON.stringify(item[col['prop']])">
        {{item[col['prop']]}}
      </td>
      <td>
        <dv4-custom-button
          @click="deleteItem(pos)"
          danger>
          Delete
        </dv4-custom-button>
      </td>
    </tr>
  </table>
  <div v-if="layersInfo.length === 0">No layers found add one!</div>
</section>
</template>

<script>
import {mapState} from 'vuex'
export default {
  props:{
    layersInfo:{
      type: Array,
      default:()=>([])
    },
    tableInfo:{
      type:Array,
      default:()=>([
      {
        label:'Activation',
        prop:'activation'
      },{
        label:'Nodes',
        prop:'units'
      },{
        label:'Bias',
        prop:'useBias'
      }])
    }
  },
  mounted(){
    // debugger
    // console.log("layersInfo...", this.layersInfo)
  },
  methods:{
    deleteItem(pos){
      this.$emit('deleteLayer', pos)
    }
  }
}
</script>

<style scoped>
table{
  width: 100%;
}
th{
  background-color:burlywood;
}
</style>
