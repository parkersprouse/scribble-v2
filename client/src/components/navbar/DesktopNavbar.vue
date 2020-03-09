<template>
  <v-toolbar id='desktop-nav' app dense>
    <v-toolbar-title>
      <router-link class='toolbar-title' :to='{ name: "index" }'>
        Scribble
      </router-link>
    </v-toolbar-title>

    <v-spacer></v-spacer>
  </v-toolbar>
</template>

<script>
export default {
  name: 'desktop_navbar',
  props: {
    user: {
      required: true,
      type: Object,
    },
  },
};
</script>

<style lang='scss'>
.toolbar-title {
  color: inherit;
  text-decoration: inherit;
}
</style>
