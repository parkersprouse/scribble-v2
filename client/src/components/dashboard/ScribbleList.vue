<template>
  <alert v-if='error' variant='danger'>
    There was a problem loading your Scribbles
  </alert>

  <div v-else-if='!scribbles' class='d-flex flex-wrap justify-content-center mb-3'>
    <b-spinner label="Loading..."></b-spinner>
    <div class='font-weight-bolder mt-3 text-center w-100'>
      Loading Scribbles...
    </div>
  </div>

  <div v-else>
    <form @submit.prevent='submitSearch'>
      <b-input-group class='mb-3'>
        <template v-slot:prepend>
          <b-input-group-text>
            <b-icon icon='search' />
          </b-input-group-text>
        </template>
        <b-form-input v-model='search_query' placeholder='Search'></b-form-input>
        <template v-slot:append>
          <b-button type='submit' variant='primary'>Search</b-button>
          <b-button v-if='$route.query.search' @click='clearSearch' type='button'
                    variant='outline-secondary'>
            Clear
          </b-button>
        </template>
      </b-input-group>
    </form>

    <div class='text-center'>
      <router-link class='btn btn-info mb-4 mt-3 px-4 py-2' style='font-size: 1.25rem;'
                  :to='{ name: "create_scribble" }'>
        <b-icon icon='plus' scale='1.25'></b-icon> Create Scribble
      </router-link>
    </div>

    <div class='mt-3 mb-3'>
      <h6 v-if='!search_performed' class='text-center mb-1 mt-0'>
        Total Scribbles: <span class='font-weight-bold'>{{ meta.total }}</span>
      </h6>
      <b-pagination-nav align='center' :link-gen='pagiLink' :number-of-pages='meta.pages || 1'
                        use-router>
      </b-pagination-nav>
    </div>

    <b-row v-if='scribbles.length > 0' style='margin-bottom: -30px;'>
      <b-col v-for='scribble in scribbles' class='scribble-card' :key='scribble.id' lg='3' md='4'>
        <scribble-card @getScribbles='getScribbles' :scribble='scribble' />
      </b-col>
    </b-row>

    <h3 v-else class='font-italic text-center'>
      {{ search_performed ? 'No Scribbles found' : 'You currently have no Scribbles' }}
    </h3>

    <div class='mt-3'>
      <b-pagination-nav align='center' :link-gen='pagiLink' :number-of-pages='meta.pages || 1'
                        use-router>
      </b-pagination-nav>
    </div>
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
      meta: null,
      scribbles: null,
      search_query: this.$route.query.search || '',
    };
  },
  mounted() {
    this.getScribbles();
  },
  methods: {
    clearSearch() {
      this.$router.push({
        name: this.$route.name,
        query: { ...this.$route.query, search: undefined },
      });
    },

    getScribbles() {
      this.scribbles = null;
      const query = [];
      Object.keys(this.$route.query).forEach((key) => {
        if (this.$route.query[key]) {
          query.push(`${key}=${this.$route.query[key]}`);
        }
      });
      this.$http.get(`/api/scribbles/filter?${query.join('&')}`)
        .then((res) => {
          this.meta = res.data.content.meta;
          this.scribbles = res.data.content.scribbles;
          this.search_query = this.$route.query.search || '';
        })
        .catch(() => {
          this.error = true;
        });
    },

    pagiLink(page) {
      return !page || page === 1 ? '?' : `?page=${page}`;
    },

    submitSearch() {
      const terms_match = this.search_query === this.$route.query.search;
      const terms_empty = !this.search_query && !this.$route.query.search;
      if (terms_match || terms_empty) return;

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
  watch: {
    '$route.query.search': function () {
      this.getScribbles();
    },

    '$route.query.page': function () {
      this.getScribbles();
    },
  },
};
</script>

<style lang='scss'>
$card_v_spacing: 30px;

.scribble-card {
  margin-bottom: $card_v_spacing;
}
</style>
