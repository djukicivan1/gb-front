<template>
    <v-container>
      <v-row class="mb-4" align="center">
        <v-col cols="12" sm="6">
          <v-text-field v-model="search" label="Pretraga" />
        </v-col>
        <v-col cols="12" sm="6" class="text-right">
          <v-btn @click="openCreate" prepend-icon="mdi-plus">Add user</v-btn>
        </v-col>
      </v-row>
  
      <v-data-table :items="filtered" :headers="headers" :loading="loading" item-key="id">
        <template #item.actions="{ item }">
          <v-btn icon="mdi-pencil" variant="text" @click="openEdit(item)"></v-btn>
          <v-btn icon="mdi-delete" variant="text" @click="remove(item)"></v-btn>
        </template>
      </v-data-table>
  
      <v-dialog v-model="dialog" max-width="500">
        <v-card>
          <v-card-title>{{ editId ? 'Edit' : 'Add' }} user</v-card-title>
          <v-card-text>
            <v-text-field v-model="form.name" label="Name" />
            <v-text-field v-model="form.email" label="Email" />
            <v-text-field v-if="!editId" v-model="form.password" label="Password" type="password" />
            <v-select :items="['user', 'admin']" v-model="form.role" label="Role" />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn @click="dialog=false">Cancel</v-btn>
            <v-btn @click="save" :loading="saving">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  
      <v-alert v-if="error" type="error" class="mt-4">{{ error }}</v-alert>
    </v-container>
  </template>
  
  <script>
  import { usersApi } from '../api/endpoints'
  
  export default {
    name: 'UsersView',
    data() {
      return {
        items: [],
        loading: false,
        error: '',
        search: '',
        dialog: false,
        saving: false,
        editId: null,
        form: { name: '', email: '', password: '', role: 'user' },
        headers: [
          { title: 'ID', key: 'id' },
          { title: 'Name', key: 'name' },
          { title: 'Email', key: 'email' },
          { title: 'Role', key: 'role' },
          { title: 'Actions', key: 'actions', sortable: false },
        ]
      }
    },
    computed: {
      filtered() {
        const s = this.search.toLowerCase()
        if (!s) return this.items
        return this.items.filter(x =>
          String(x.id).includes(s) ||
          (x.name || '').toLowerCase().includes(s) ||
          (x.email || '').toLowerCase().includes(s) ||
          (x.role || '').toLowerCase().includes(s)
        )
      }
    },
    created() { this.fetchList() },
    methods: {
      async fetchList() {
        this.loading = true
        this.error = ''
        try {
          const res = await usersApi.list()
          this.items = res.data?.data || res.data || []
        } catch (e) {
          this.error = 'Error loading users'
          console.error(e)
        } finally {
          this.loading = false
        }
      },
      openCreate() {
        this.editId = null
        this.form = { name: '', email: '', password: '', role: 'user' }
        this.dialog = true
      },
      openEdit(row) {
        this.editId = row.id
        this.form = { name: row.name, email: row.email, password: '', role: row.role || 'user' }
        this.dialog = true
      },
      async save() {
        this.saving = true
        try {
          if (this.editId) {
            //try
            await usersApi.update(this.editId, { name: this.form.name, email: this.form.email, role: this.form.role })
          } else {
            await usersApi.create(this.form)
          }
          this.dialog = false
          await this.fetchList()
        } catch (e) {
          alert('Saving failed')
          console.error(e)
        } finally {
          this.saving = false
        }
      },
      async remove(row) {
        if (!confirm('Delete user?')) return
        try {
          await usersApi.remove(row.id)
          await this.fetchList()
        } catch (e) {
          alert('Deleting failed')
          console.error(e)
        }
      }
    }
  }
  </script>
  