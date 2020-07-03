<template>
  <b-alert show :variant='variant_class.variant'>
    <b-icon :icon='variant_class.icon'></b-icon> <slot></slot>
  </b-alert>
</template>

<script>
export default {
  name: 'alert',
  props: {
    variant: {
      default: 'primary',
      type: String,
      validator: (val) => ['danger', 'primary', 'success', 'warning'].includes(val),
    },
  },
  computed: {
    variant_class() {
      const variants = {
        danger: {
          icon: 'x-circle-fill',
          variant: 'danger',
        },
        primary: {
          icon: 'info-circle-fill',
          variant: 'primary',
        },
        success: {
          icon: 'check-circle-fill',
          variant: 'success',
        },
        warning: {
          icon: 'exclamation-triangle-fill',
          variant: 'warning',
        },
      };

      return variants[this.variant];
    },
  },
};
</script>
