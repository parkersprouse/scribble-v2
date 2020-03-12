<template>
  <div>
    <b-jumbotron bg-variant='dark' class='front-jumbotron text-center' header='Scribble'
                 lead='Need a notepad?' text-variant='white'>
    </b-jumbotron>
    <b-container>
      <b-row align-h='center'>
        <b-col md='6'>
          <b-card no-body>
            <b-card-body>
              <b-card-title>What is Scribble?</b-card-title>
              Scribble is an online notepad and to-do list. Take quick notes to remember for later,
              whip up a quick to-do list to check later - whatever you may need.
            </b-card-body>
          </b-card>
        </b-col>
        <b-col md='6'>
          <b-card v-if='show_register' no-body>
            <b-card-body>
              <b-card-title>Register</b-card-title>
              <register-form />
            </b-card-body>
            <b-card-footer class='text-center'>
              <b-link @click='show_register = false'>Login</b-link>
            </b-card-footer>
          </b-card>
          <b-card v-else no-body>
            <b-card-body>
              <b-card-title>Login</b-card-title>
              <login-form />
            </b-card-body>
            <b-card-footer class='text-center'>
              <b-link @click='show_register = true'>Register</b-link>
            </b-card-footer>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import LoginForm from '@/components/index/LoginForm.vue';
import RegisterForm from '@/components/index/RegisterForm.vue';

export default {
  name: 'index',
  components: {
    LoginForm,
    RegisterForm,
  },
  data() {
    return {
      show_register: false,
    };
  },
};
</script>

<style lang='scss'>
.front-jumbotron {
  h1 {
    font-weight: 500;
  }
}
</style>
