<template>
  <v-container>
    <v-btn class="mb-5" prepend-icon="mdi-arrow-left" @click="$router.push('/home')">Back</v-btn>
    <v-row class="mb-2" align="center">
      <v-col cols="12" sm="6">
        <v-text-field v-model="search" label="Search" />
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
          <v-btn @click="dialog = false">Cancel</v-btn>
          <v-btn @click="save" :loading="saving">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-alert v-if="error" type="error" class="mt-4">{{ error }}</v-alert>
  </v-container>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { vehiclesApi } from '../api/endpoints'

const items = ref([])
const loading = ref(false)
const saving = ref(false)
const error = ref('')
const search = ref('')
const dialog = ref(false)
const editId = ref(null)
const form = reactive({ title: '', brand: '', licence_plate: '', year: '' })

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Title', key: 'title' },
  { title: 'Brand', key: 'brand' },
  { title: 'Licence plate', key: 'licence_plate' },
  { title: 'Year', key: 'year' },
  { title: 'Actions', key: 'actions', sortable: false },
]

const filtered = computed(() => {
  const s = (search.value || '').toLowerCase()
  if (!s) return items.value
  return items.value.filter(
    (x) =>
      String(x.id).includes(s) ||
      (x.title || '').toLowerCase().includes(s) ||
      (x.brand || '').toLowerCase().includes(s) ||
      (x.licence_plate || '').toLowerCase().includes(s) ||
      String(x.year || '').includes(s),
  )
})
const indexed = computed(() => filtered.value.map((row, i) => ({ ...row, no: i + 1 })))

onMounted(fetchList)

async function fetchList() {
  loading.value = true
  error.value = ''
  try {
    const res = await vehiclesApi.list()
    items.value = res.data?.data || res.data || []
  } catch (e) {
    error.value = 'Failed to load vehicles'
    console.error(e)
  } finally {
    loading.value = false
  }
}

function openCreate() {
  editId.value = null
  Object.assign(form, { title: '', brand: '', licence_plate: '', year: '' })
  dialog.value = true
}

function openEdit(row) {
  editId.value = row.id
  Object.assign(form, {
    title: row.title,
    brand: row.brand,
    licence_plate: row.licence_plate,
    year: row.year,
  })
  dialog.value = true
}

async function save() {
  saving.value = true
  try {
    const payload = { ...form, year: Number(form.year) || form.year }
    if (editId.value) {
      await vehiclesApi.update(editId.value, payload)
    } else {
      const before = items.value.length
      const res = await vehiclesApi.create(payload)
      const created = res?.data?.data || res?.data
      if (created && (created.id || created.title)) items.value = [created, ...items.value]
      if (items.value.length === before)
        items.value = [{ id: Date.now(), ...payload }, ...items.value]
    }
    await fetchList()
    dialog.value = false
  } catch (e) {
    const msg = e?.response?.data?.message || e?.response?.data || e.message || 'Saving failed'
    alert(msg)
    console.error('Vehicle save error:', e?.response || e)
  } finally {
    saving.value = false
  }
}

async function removeItem(row) {
  if (!confirm('Delete this vehicle?')) return
  try {
    await vehiclesApi.remove(row.id)
    await fetchList()
  } catch (e) {
    alert('Delete failed')
    console.error(e)
  }
}
</script>
