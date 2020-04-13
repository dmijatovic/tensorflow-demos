<template>
<PageContent>
    <template #page-title>
      <h1>House prices</h1>
      <nav>
        <dv4-custom-button
          @click="createScatter">
          Scatter
        </dv4-custom-button>
        <dv4-custom-button
          @click="chartPanel"
          primary
          :disabled="tfvis===null">
          Chart panel
        </dv4-custom-button>
        <!--
        <dv4-custom-button
          @click="trainModel"
          primary>
          Train model
        </dv4-custom-button>
        <dv4-custom-button
          @click="testModel"
          danger>
          Test model
        </dv4-custom-button>
        <dv4-custom-button
          @click="makePredictions"
          >
          Make predictions
        </dv4-custom-button> -->
      </nav>
    </template>
    <template #page-body>
      <section>
        <h3>Regression problem</h3>
        <p>
          This regression model works with local CSV data loaded using tensorflow CSV method.
        </p>
        <p>
          The houses data has {{housesData.length}} rows.
        </p>
      </section>
      <dv4-loader-timer
        v-if="loader.show">
          {{loader.message}}
      </dv4-loader-timer>
    </template>
  </PageContent>
</template>

<script>
import PageContent from '@/components/page/PageContent'
import {mapState} from 'vuex'
import {scatterPlot} from "../utils/tf-chart"

export default {
  components:{
    PageContent
  },
  data(){
    return{
      loader:{
        show:true,
        message: "Loading CSV..."
      },
      model:{
        epochs: 10,
        step: 0.125,
        treshold: 0.002,
        batchSize: 50,
        activation:'softmax',
        features:['Horsepower','Weight_in_lbs','Cylinders','YYYY'],
        labels:'Fuel_Efficiency'
      },
      tfvis:null
    }
  },
  computed:{
    ...mapState('houses',[
      'housesData',
      'plotData'
    ])
  },
  methods:{
    chartPanel(){
      if (!this.tfvis) return false
      this.tfvis.visor().toggle()
    },
    createScatter(){
      this.tfvis = scatterPlot({
        name:"House prices",
        tab: "Houses"
      },{
        values: this.plotData,
        series:['Houses']
      },{
        xLabel:'total square foot',
        yLabel:'price'
      })
      console.log("tfvis...", this.tfvis)
    }
  },
  mounted(){
    this.$store.dispatch(("houses/getHousesData"))
      .finally(()=>{
        this.loader.show = false
      })
  }
}
</script>

<style>

</style>
