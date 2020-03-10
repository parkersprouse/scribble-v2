<template>
  <v-layout wrap>
    <v-app-bar dense>
      <v-toolbar-title>
        <router-link class='toolbar-title' :to='{ name: "index" }'>
          Scribble
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-app-bar-nav-icon @click.stop='open = !open'></v-app-bar-nav-icon>
    </v-app-bar>

    <v-navigation-drawer v-model='open' app right temporary>

      <v-list>
        <v-list-item :to='{ name: "index" }'>
          <v-list-item-icon>
            <v-icon>fa-home</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Home</v-list-item-title>
        </v-list-item>

        <v-list-group v-if='user.username' no-action prepend-icon="fa-user">
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>Account</v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item :to='{ name: "settings" }'>
            <v-list-item-icon>
              <v-icon>fa-cog</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item>
          <v-list-item :to='{ name: "logout" }'>
            <v-list-item-icon>
              <v-icon>fa-sign-out-alt</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
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
