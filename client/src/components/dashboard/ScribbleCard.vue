<template>
  <router-link :to='{ name: "show_scribble", params: { id: scribble.id } }'>
    <b-card no-body>
      <b-card-body>
        <b-card-title :id='`title${scribble.id}`'>
          <span v-html='scribble.title || "<em>No Title</em>"'></span>
          <b-tooltip v-if='scribble.title' :target='`title${scribble.id}`' triggers='hover'>
            {{ scribble.title }}
          </b-tooltip>
        </b-card-title>
        <b-card-sub-title class='mb-2'>{{ created_at }}</b-card-sub-title>
        <ul v-if='scribble.tags.length > 0'
            class='list-unstyled d-flex flex-wrap align-items-center mb-0'>
          <li v-for='tag in scribble.tags' :key='tag'
              class='badge b-form-tag d-inline-flex align-items-baseline mw-100
                     mr-1 badge-secondary'>
            <span class='b-form-tag-content flex-grow-1 text-truncate'>
              {{ tag }}
            </span>
          </li>
        </ul>
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
