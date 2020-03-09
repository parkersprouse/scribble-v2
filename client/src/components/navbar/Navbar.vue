<template>
  <div v-if='!user'>
    <v-toolbar id='desktop-nav' app dense></v-toolbar>
  </div>
  <div v-else>
    <desktop-navbar class='hidden-sm-and-down' :user='user' />
    <mobile-navbar class='hidden-md-and-up' :user='user' />
  </div>
</template>

<script>
import DesktopNavbar from './DesktopNavbar.vue';
import MobileNavbar from './MobileNavbar.vue';

export default {
  name: 'navbar',
  components: {
    'desktop-navbar': DesktopNavbar,
    'mobile-navbar': MobileNavbar,
  },
  data() {
    return {
      user: null,
    };
  },
  mounted() {
    this.user = {};
  },
  watch: {
    $route() {
      // this.user = this.$store.state.current_user;
    },
  },
};
</script>
