<template>
  <v-layout wrap>
    <v-toolbar dense>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-toolbar-side-icon @click.stop='open = !open'></v-toolbar-side-icon>
      </v-toolbar-items>
    </v-toolbar>

    <v-navigation-drawer v-model='open' absolute right temporary>
      <v-list>
        <v-list-tile :to='{ name: "index" }'>
          <v-list-tile-avatar><v-icon>fa-home</v-icon></v-list-tile-avatar>
          <v-list-tile-title class='nav-link'>Home</v-list-tile-title>
        </v-list-tile>

        <v-divider></v-divider>

        <!-- Profile Links -->
        <v-list-group v-if='user.username'>
          <template v-slot:activator>
            <v-list-tile>
              <v-list-tile-avatar><v-icon>fa-user-circle</v-icon></v-list-tile-avatar>
              <v-list-tile-title>{{ user.username }}</v-list-tile-title>
            </v-list-tile>
          </template>
          <v-list-tile :to='{ name: "profile" }'>
            <v-list-tile-avatar><v-icon>fa-cog</v-icon></v-list-tile-avatar>
            <v-list-tile-title class='nav-link'>Settings</v-list-tile-title>
          </v-list-tile>
          <v-list-tile href='/logout'>
            <v-list-tile-avatar><v-icon>fa-sign-out-alt</v-icon></v-list-tile-avatar>
            <v-list-tile-title class='nav-link'>Logout</v-list-tile-title>
          </v-list-tile>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

  </v-layout>
</template>

<script>
export default {
  name: 'mobile_navbar',
  props: {
    user: {
      required: true,
      type: Object,
    },
  },
  data() {
    return {
      open: false,
    };
  },
};
</script>
