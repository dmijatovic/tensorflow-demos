<template>
  <article>
    <header>
      <h1>Houses</h1>
    </header>
    <section>
      <p>Here comes some additional info</p>
    </section>
    <nav>
      <!-- <dv4-custom-button
        @click="createModel">
        Create model
      </dv4-custom-button>
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
    <dv4-loader-timer
      v-if="loader.show">
        {{loader.message}}
    </dv4-loader-timer>
  </article>
</template>

<script>
export default {
  asyncData(ctx){
    const {dispatch} = ctx.store
    if (dispatch){
      return dispatch("houses/getHousesData")
    } else {
      return {
        carsDataDispatch: false
      }
    }
  },
  data(){
    return{
       loader:{
        show:false,
        message: "Loading..."
      },
    }
  }

}
</script>

<style>

</style>
