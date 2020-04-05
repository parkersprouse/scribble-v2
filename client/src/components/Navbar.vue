<template>
  <b-navbar toggleable='md' type='dark' variant='dark'>
    <b-navbar-brand :to='{ name: "dashboard" }'>Scribble</b-navbar-brand>

    <b-navbar-toggle target='nav-collapse'></b-navbar-toggle>

    <b-collapse id='nav-collapse' is-nav>
      <b-navbar-nav>
        <b-nav-item :to='{ name: "dashboard" }'>
        <b-icon icon='house-fill'></b-icon> Dashboard
        </b-nav-item>
      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class='ml-auto'>
        <b-nav-item-dropdown menu-class='w-100' right>
          <!-- Using 'button-content' slot -->
          <template v-slot:button-content>
            <b-icon icon='people-circle'></b-icon> {{ $store.state.current_user.email }}
          </template>
          <b-dropdown-item :to='{ name: "profile" }'>
            <b-icon icon='gear'></b-icon> Profile
          </b-dropdown-item>
          <b-dropdown-item :to='{ name: "logout" }'>
            <b-icon icon='box-arrow-left'></b-icon> Logout
          </b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
export default {
  name: 'navbar',
};
</script>

<style lang='scss'>
.navbar {
  margin-bottom: 1.5rem;
}
</style>
