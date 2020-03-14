<template>
  <router-link :to='{ name: "show_scribble", params: { id: scribble.id } }'>
    <b-card no-body>
      <b-card-body>
        <b-card-title :id='`title${scribble.id}`'>
          <span v-html='scribble.title || "<em>No Title</em>"'></span>
          <b-tooltip :target='`title${scribble.id}`' triggers='hover'>
            <span v-if='scribble.title' v-text='scribble.title'></span>
            <em v-else>No Title</em>
          </b-tooltip>
        </b-card-title>
        <b-card-sub-title class='mb-2'>{{ created_at }}</b-card-sub-title>
        <b-card-text>
          {{ scribble.content }}
        </b-card-text>
      </b-card-body>
    </b-card>
  </router-link>
</template>

<script>
import { DateTime } from 'luxon';

export default {
  name: 'scribble_card',
  props: {
    scribble: {
      required: true,
      type: Object,
    },
  },
  computed: {
    created_at() {
      const date = DateTime.fromISO(this.scribble.createdAt);
      return date.toLocaleString(DateTime.DATETIME_MED);
    },
  },
};
</script>

<style lang='scss' scoped>
a {
  color: inherit;

  &:hover {
    text-decoration: none;

    > .card {
      box-shadow: 0px 7px 8px -4px rgba(0, 0, 0, 0.2), 0px 12px 17px 2px rgba(0, 0, 0, 0.14),
                  0px 5px 22px 4px rgba(0, 0, 0, 0.12);
    }
  }

  .card-title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .card-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
