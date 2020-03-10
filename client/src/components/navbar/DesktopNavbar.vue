<template>
  <v-app-bar id='desktop-nav' dense>
    <v-toolbar-title>
      <router-link class='toolbar-title' :to='{ name: "index" }'>
        Scribble
      </router-link>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <router-link v-if='user.username' :to='{ name: "settings" }'>
      Settings
    </router-link>
    <router-link v-if='user.username' :to='{ name: "logout" }'>
      Logout
    </router-link>
  </v-app-bar>
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
