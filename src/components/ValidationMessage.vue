<template>
  <div>
    <span class="help is-danger" v-if="allErrors && allErrors.has(propertyName)" v-text="allErrors.get(propertyName)"></span>
  </div>
</template>

<script>
  export default {
    props: {
      errors: {
        type: Object,
        required: false,
      },
      propertyName: {
        type: String,
        required: true,
      }
    },
    data() {
      return {
        injectedErrors: null,
      }
    },
    computed: {
      allErrors() {
        if (this.errors) {
          return this.errors;
        }

        return this.injectedErrors;
      }
    }
  }
</script>

<style>
  .help {
    display: block;
    font-size: 11px;
    margin-top: 5px;
  }

  .help.is-danger {
    color: #ff3860;
  }
</style>
