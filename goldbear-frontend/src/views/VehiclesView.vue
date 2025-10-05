<template>
    <v-container>
      <v-row class="mb-4" align="center">
        <v-col cols="12" sm="6">
          <v-text-field v-model="search" label="Pretraga" />
        </v-col>
        <v-col cols="12" sm="6" class="text-right">
          <v-btn @click="openCreate" prepend-icon="mdi-plus">Add vehicle</v-btn>
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
          <v-card-title>{{ editId ? 'Edit' : 'Add' }} vehicle</v-card-title>
          <v-card-text>
            <v-text-field v-model="form.title" label="Title" />
            <v-text-field v-model="form.brand" label="Brand" />
            <v-text-field v-model="form.licence_plate" label="Licence plate" />
            <v-text-field v-model="form.year" label="Year" type="number" />
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
  import { vehiclesApi } from '../api/endpoints'
  
  export default {
    name: 'VehiclesView',
    data() {
      return {
        items: [],
        loading: false,
        error: '',
        search: '',
        dialog: false,
        saving: false,
        editId: null,
        form: { title: '', brand: '', licence_plate: '', year: '' },
        headers: [
          { title: 'ID', key: 'id' },
          { title: 'Title', key: 'title' },
          { title: 'Brand', key: 'brand' },
          { title: 'Licence plate', key: 'licence_plate' },
          { title: 'Year', key: 'year' },
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
          (x.title || '').toLowerCase().includes(s) ||
          (x.brand || '').toLowerCase().includes(s) ||
          (x.licence_plate || '').toLowerCase().includes(s) ||
          String(x.year || '').includes(s)
        )
      }
    },
    created() { this.fetchList() },
    methods: {
      async fetchList() {
        this.loading = true
        this.error = ''
        try {
          const res = await vehiclesApi.list()
          this.items = res.data?.data || res.data || []
        } catch (e) {
          this.error = 'Error loading vehicles'
          console.error(e)
        } finally {
          this.loading = false
        }
      },
      openCreate() {
        this.editId = null
        this.form = { title: '', brand: '', licence_plate: '', year: '' }
        this.dialog = true
      },
      openEdit(row) {
        this.editId = row.id
        this.form = { title: row.title, brand: row.brand, licence_plate: row.licence_plate, year: row.year }
        this.dialog = true
      },
      async save() {
        this.saving = true
        try {
          if (this.editId) {
            //try
            await vehiclesApi.update(this.editId, this.form)
          } else {
            await vehiclesApi.create(this.form)
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
        if (!confirm('Delete vehicle?')) return
        try {
          await vehiclesApi.remove(row.id)
          await this.fetchList()
        } catch (e) {
          alert('Deleting failed')
          console.error(e)
        }
      }
    }
  }
  </script>
  