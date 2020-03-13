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
        <router-link :to='{ name: "view_scribble", params: { id: scribble.id } }'>
          <b-card no-body>
            <b-card-body>
              <b-card-title :id='`title${scribble.id}`'>
                <span v-html='scribble.title || "<em>No Title</em>"'></span>
                <b-tooltip :target='`title${scribble.id}`' triggers='hover'>
                  <span v-if='scribble.title' v-text='scribble.title'></span>
                  <em v-else>No Title</em>
                </b-tooltip>
              </b-card-title>
              {{ scribble.content }}
            </b-card-body>
          </b-card>
        </router-link>
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

  > a {
    color: inherit;

    &:hover {
      text-decoration: none;

      > .card {
        box-shadow: 0px 7px 8px -4px rgba(0, 0, 0, 0.2), 0px 12px 17px 2px rgba(0, 0, 0, 0.14), 0px 5px 22px 4px rgba(0, 0, 0, 0.12) !important;
      }
    }
  }

  .card-title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
