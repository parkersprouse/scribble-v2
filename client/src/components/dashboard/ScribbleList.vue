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
    <b-row>
      <b-col v-for='scribble in scribbles' class='scribble-card' :key='scribble.id' lg='3' md='4'>
        <b-card no-body>
          <b-card-body>
            <b-card-title v-html='scribble.title || "<em>No Title</em>"'></b-card-title>
            {{ scribble.content }}
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: 'scribble_list',
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
