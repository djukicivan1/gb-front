<template>
    <v-container>
      <v-row class="mb-4" align="center">
        <v-col cols="12" sm="6">
          <v-text-field v-model="search" label="Search" />
        </v-col>
        <v-col cols="12" sm="6" class="text-right">
          <v-btn @click="openCreate" prepend-icon="mdi-plus">Add task</v-btn>
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
          <v-card-title>{{ editId ? 'Edit' : 'Add' }} task</v-card-title>
          <v-card-text>
            <v-text-field v-model="form.title" label="Title" />
            <v-text-field v-model="form.description" label="Description" />
            <v-text-field v-model="form.due_date" label="Due date (DD-MM-YYYY HH:mm:ss)" />
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
  import { tasksApi } from '../api/endpoints'
  
  export default {
    name: 'TasksView',
    data() {
      return {
        items: [],
        loading: false,
        error: '',
        search: '',
        dialog: false,
        saving: false,
        editId: null,
        form: { title: '', description: '', due_date: '' },
        headers: [
          { title: 'ID', key: 'id' },
          { title: 'Title', key: 'title' },
          { title: 'Description', key: 'description' },
          { title: 'Due date', key: 'due_date' },
          { title: 'Actions', key: 'actions', sortable: false },
        ]
      }
    },
    computed: {
      filtered() {
        const search = this.search.toLowerCase()
        if (!search) return this.items
        return this.items.filter(item =>
          String(item.id).includes(search) ||
          (item.title || '').toLowerCase().includes(search) ||
          (item.description || '').toLowerCase().includes(search) ||
          (item.due_date || '').toLowerCase().includes(search)
        )
      }
    },
    created() { this.fetchList() },
    methods: {
      async fetchList() {
        this.loading = true
        this.error = ''
        try {
          const res = await tasksApi.list() 
          this.items = res.data?.data || res.data || []
        } catch (e) {
          this.error = 'Error loading tasks'
          console.error(e)
        } finally {
          this.loading = false
        }
      },
      openCreate() {
        this.editId = null
        this.form = { title: '', description: '', due_date: '' }
        this.dialog = true
      },
      openEdit(row) {
        this.editId = row.id
        this.form = { title: row.title, description: row.description, due_date: row.due_date }
        this.dialog = true
      },
      async save() {
        this.saving = true
        try {
          if (this.editId) {
            //try
            await tasksApi.update(this.editId, this.form)
          } else {
            await tasksApi.create(this.form)
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
        if (!confirm('Delete task?')) return
        try {
          await tasksApi.remove(row.id)
          await this.fetchList()
        } catch (e) {
          alert('Deleting failed')
          console.error(e)
        }
      }
    }
  }
  </script>
  