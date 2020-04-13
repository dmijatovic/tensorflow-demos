<template>
  <PageContent>
    <template #page-title>
      <h1>Memory management</h1>
      <nav>
        <dv4-custom-button
          @click="createTensors(20)"
          primary
          >
          Create 20 tensors
        </dv4-custom-button>
        <dv4-custom-button
          @click="clearMemory"
          danger
          >
          Clear memory
        </dv4-custom-button>
        <dv4-custom-button
          @click="loadCSV"
          >
          CSV data
        </dv4-custom-button>
      </nav>
    </template>
    <template #page-body>
      <p>
        Tensorflow has internal memory management. When using WebGL the
        memory management needs to be done by tensorflow. For this purpose
        tensorflow has number of functions:
        <ul>
          <li>tidy() will clear memory with tensors wrapped in this function</li>
          <li>dispose(tensors) will remove tensors passed to function</li>
        </ul>
        Note! There is no function to clear all TF memory. You can only clean
        tensors you have referenced.
      </p>
      <h2>Number of created tensors</h2>
      <p>
        Tensors:{{model ? model.length : 0}}
      </p>
      <div v-if="memInfo">
        <h2>Memory info</h2>
        <pre>{{JSON.stringify(memInfo,null, 2)}}</pre>
      </div>
      <div v-if="testData">
        <h2>Test data from CSV file</h2>
        <pre>{{JSON.stringify(testData,null, 2)}}</pre>
      </div>
    </template>
  </PageContent>
</template>

<script>

import PageContent from '@/components/page/PageContent'
import { mapState } from 'vuex'
import {memoryInfo, clearMemory, getTF, getCSV} from "../utils/tf-data"

export default {
  components:{
    PageContent
  },
  computed:{
    ...mapState([
      'loading'
    ])
  },
  data(){
    return{
      memInfo: null,
      model:[],
      testData: null
    }
  },
  mounted(){
    // debugger
  },
  methods:{
    createTensors(n){
      const tf = getTF()
      if (tf){
        for (let i=0; i<n; i++){
          this.model.push(tf.scalar(n))
        }
      }
      console.log("Created tensors...", n)
      this.tensors+= n
      this.memoryInfo()
    },
    memoryInfo(){
      this.memInfo = memoryInfo()
    },
    clearMemory(){
      clearMemory(this.model)
      console.log("Memory cleared")
      this.memoryInfo()
      this.model = []
    },
    loadCSV(){
      const url='/data/kc_house_data.csv'
      const d = getCSV(url)
      debugger
      d.take(10)
        .toArray()
        .then(data=>{
          this.testData = data
        })
    }
  }
}
</script>
<style>

</style>
