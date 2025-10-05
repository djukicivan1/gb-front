<template>
  <v-container>
    <v-btn class="mb-5" prepend-icon="mdi-arrow-left" @click="$router.push('/home')">Back</v-btn>
    <v-row class="mb-4" align="center">
      <v-col cols="12" sm="6">
        <v-text-field v-model="search" label="Search" />
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
import { usersApi } from '../api/endpoints'

const items = ref([])
const loading = ref(false)
const saving = ref(false)
const error = ref('')
const search = ref('')
const dialog = ref(false)
const editId = ref(null)
const form = reactive({ name: '', email: '', password: '', role: 'user' })

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Name', key: 'name' },
  { title: 'Email', key: 'email' },
  { title: 'Role', key: 'role' },
  { title: 'Actions', key: 'actions', sortable: false },
]

const filtered = computed(() => {
  const s = (search.value || '').toLowerCase()
  if (!s) return items.value
  return items.value.filter(
    (x) =>
      String(x.id).includes(s) ||
      (x.name || '').toLowerCase().includes(s) ||
      (x.email || '').toLowerCase().includes(s) ||
      (x.role || '').toLowerCase().includes(s),
  )
})
const indexed = computed(() => filtered.value.map((row, i) => ({ ...row, no: i + 1 })))

onMounted(fetchList)

async function fetchList() {
  loading.value = true
  error.value = ''
  try {
    const res = await usersApi.list()
    items.value = res.data?.data || res.data || []
  } catch (e) {
    error.value = 'Failed to load users'
    console.error(e)
  } finally {
    loading.value = false
  }
}

function openCreate() {
  editId.value = null
  Object.assign(form, { name: '', email: '', password: '', role: 'user' })
  dialog.value = true
}

function openEdit(row) {
  editId.value = row.id
  Object.assign(form, { name: row.name, email: row.email, password: '', role: row.role || 'user' })
  dialog.value = true
}

async function save() {
  saving.value = true
  try {
    if (editId.value) {
      await usersApi.update(editId.value, { name: form.name, email: form.email, role: form.role })
    } else {
      await usersApi.create({ ...form })
    }
    dialog.value = false
    await fetchList()
  } catch (e) {
    const msg = e?.response?.data?.message || e?.response?.data || e.message || 'Saving failed'
    alert(msg)
    console.error('Save error:', e?.response || e)
  } finally {
    saving.value = false
  }
}

async function removeItem(row) {
  if (!confirm('Delete this user?')) return
  try {
    await usersApi.remove(row.id)
    await fetchList()
  } catch (e) {
    alert('Delete failed')
    console.error(e)
  }
}
</script>
