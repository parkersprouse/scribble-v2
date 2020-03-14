<template>
  <b-alert v-if='error' show variant='danger'>
    <b-icon icon='x-circle-fill'></b-icon>
    There was a problem loading your Scribbles
  </b-alert>

  <div v-else-if='!scribbles' class='d-flex flex-wrap justify-content-center mb-3'>
    <b-spinner label="Loading..."></b-spinner>
    <div class='font-weight-bolder mt-3 text-center w-100'>
      Loading Scribbles...
    </div>
  </div>

  <div v-else>
    <h1 class='border-bottom font-weight-bold mb-5 pb-2'>Your Scribbles</h1>
    <b-row v-if='scribbles.length > 0'>
      <b-col v-for='scribble in scribbles' class='scribble-card' :key='scribble.id' lg='3' md='4'>
        <scribble-card :scribble='scribble' />
      </b-col>
    </b-row>
    <h3 v-else class='font-italic text-center'>
      You currently have no Scribbles
    </h3>
  </div>
</template>

<script>
import ScribbleCard from './ScribbleCard.vue';

export default {
  name: 'scribble_list',
  components: {
    ScribbleCard,
  },
  data() {
    return {
      error: false,
      scribbles: null,
    };
  },
  mounted() {
    this.$http.get('/api/scribbles/owner')
      .then((res) => {
        this.scribbles = res.data.content;
      })
      .catch(() => {
        this.error = true;
      });
  },
};
</script>

<style lang='scss'>
.scribble-card {
  margin-bottom: 30px;
}
</style>
