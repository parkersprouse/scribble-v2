<template>
  <div>
    <navbar />
    <b-container>
      <b-alert v-if='error' show variant='danger'>
        There was a problem loading your Scribble
      </b-alert>

      <div v-else-if='!scribble' class='d-flex flex-wrap justify-content-center mb-3'>
        <b-spinner label="Loading..."></b-spinner>
        <div class='font-weight-bolder mt-3 text-center w-100'>
          Loading Scribble...
        </div>
      </div>

      <div v-else>
        <h2 v-html='scribble.title || "<em>No Title</em>"'
            class='border-bottom font-weight-bold mb-5 pb-2'></h2>
      </div>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'show_scribble',
  beforeRouteEnter (to, from, next) {

  },
  data() {
    return {
      error: false,
      scribble: null,
    };
  },
  mounted() {
    this.$http.get(`/api/scribbles/id/${this.$route.params.id}`)
      .then((res) => {
        this.scribble = res.data.content;
      })
      .catch(() => {
        this.error = true;
      });
  },
};
</script>
