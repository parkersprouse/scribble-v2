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
    <form @submit.prevent='search'>
      <b-input-group class='mb-3'>
        <template v-slot:prepend>
          <b-input-group-text>
            <b-icon icon='search' />
          </b-input-group-text>
        </template>
        <b-form-input v-model='search_query' placeholder='Search'></b-form-input>
        <template v-slot:append>
          <b-button type='submit'>Search</b-button>
        </template>
      </b-input-group>
    </form>

    <div class='text-center'>
      <router-link class='btn btn-info mb-4 mt-3 px-4 py-2' style='font-size: 1.25rem;'
      :to='{ name: "create_scribble" }'>
        <b-icon icon='plus' scale='1.5'></b-icon> Create Scribble
      </router-link>
    </div>

    <b-row v-if='scribbles.length > 0'>
      <b-col v-for='scribble in scribbles' class='scribble-card' :key='scribble.id' lg='3' md='4'>
        <scribble-card :scribble='scribble' />
      </b-col>
    </b-row>
    <h3 v-else class='font-italic text-center'>
      {{ search_performed ? 'No Scribbles found' : 'You currently have no Scribbles' }}
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
      search_query: this.$route.query.search || '',
    };
  },
  mounted() {
    const { search } = this.$route.query;
    const query = [];
    if (search) query.push(`term=${search}`);
    this.$http.get(`/api/scribbles/filter?${query.join('&')}`)
      .then((res) => {
        this.scribbles = res.data.content.scribbles;
      })
      .catch(() => {
        this.error = true;
      });
  },
  methods: {
    search() {
      if (this.search_query === this.$route.query.search) return;
      this.$router.push({
        name: this.$route.name,
        query: { ...this.$route.query, search: this.search_query || undefined },
      });
    },
  },
  computed: {
    search_performed() {
      return !!this.$route.query.search;
    },
  },
};
</script>

<style lang='scss'>
.scribble-card {
  margin-bottom: 30px;
}
</style>
