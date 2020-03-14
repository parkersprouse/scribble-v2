<template>
  <div>
    <navbar />
    <b-container>
      <b-alert v-if='error' show variant='danger'>
        There was a problem loading the Scribble
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
import { call } from '@/lib';

export default {
  name: 'show_scribble',
  async beforeRouteEnter(_to, _from, next) {
    const [err, data] = await call(this.$http.get(`/api/scribbles/id/${this.$route.params.id}`));
    if (!data || err) {
      next((vm) => {
        vm.error = true;
      });
    } else {
      const scribble = data.content;
      if (scribble.owner_id !== this.$store.state.current_user.id && !scribble.public) {
        return next('/');
      }
      next((vm) => {
        vm.scribble = scribble;
      });
    }
  },
  data() {
    return {
      error: false,
      scribble: null,
    };
  },
};
</script>
