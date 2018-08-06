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
    <div>
      <label>Parent name</label>
      <input v-model="form.parent.name" id="parent_name" name="parent_name">
      <validation-message property-name="parent_name"></validation-message>
    </div>
    <div>
      <label>Parent age</label>
      <input v-model="form.parent.age" id="parent_age" name="parent_age">
      <validation-message property-name="parent_age"></validation-message>
    </div>
    <div>
      <label>Agent</label>
      <select v-model="form.agents" multiple id="agents" name="agents">
        <option value="1">Agent1</option>
        <option value="2">Agent2</option>
        <option value="3">Agent3</option>
      </select>
      <validation-message property-name="agents"></validation-message>
    </div>

    <button @click.prevent="save" id="submitBtn">Save</button>
    <button @click.prevent="resetForm">Reset</button>
  </form>
</template>

<script>
  export default {
    data() {
      return {
        form: new Form({
          first_name: 'John',
          last_name: 'Doe',
          parent: {
            name: 'John Doe',
            age: 30
          },
          agents: [1, 3]
        })
      }
    },
    methods: {
      save() {
        this.form.post('/test');
      },
      resetForm() {
        this.form.reset();
      },
    }
  }
</script>