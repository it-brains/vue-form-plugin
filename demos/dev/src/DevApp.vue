<template>
  <form v-form="form">
    <div>
      <label>First name</label>
      <input v-model="form.first_name" id="first_name" name="first_name">
      <validation-message property-name="first_name"></validation-message>
    </div>
    <div>
      <label>Last name</label>
      <input v-model="form.last_name" id="last_name" name="last_name">
      <validation-message property-name="last_name"></validation-message>
    </div>
    <button @click.prevent="save" id="submitBtn">Save</button>
  </form>
</template>

<script>
  export default {
    data() {
      return {
        form: new Form({
          first_name: '',
          last_name: '',
        })
      }
    },
    methods: {
      save() {
        this.form.post('/test');
      }
    }
  }
</script>