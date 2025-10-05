<template>
  <v-container>
    <v-row align="center" class="mb-4">
      <v-col cols="12" sm="6">
        <v-text-field v-model="search" label="Search users" clearable />
      </v-col>
      <v-col cols="12" sm="6" class="text-right">
        <v-btn color="primary" @click="openCreate" prepend-icon="mdi-plus">Add user</v-btn>
      </v-col>
    </v-row>

    <v-data-table :items="indexed" :headers="headers" :loading="loading" item-value="id">
      <template #item.actions="{ item }">
        <v-btn icon="mdi-pencil-outline" variant="text" @click="openEdit(item)" />
        <v-btn icon="mdi-delete-outline" variant="text" @click="removeItem(item)" />
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title>{{ editId ? 'Edit' : 'Add' }} User</v-card-title>
        <v-card-text>
          <v-text-field v-model="form.name" label="Name" />
          <v-text-field v-model="form.email" label="Email" />
          <v-text-field v-if="!editId" v-model="form.password" label="Password" type="password" />
          <v-select :items="['user', 'admin']" v-model="form.role" label="Role" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="dialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="save" :loading="saving">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="2000">
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { usersApi } from '../api/endpoints'

const items = ref([])
const search = ref('')
const loading = ref(false)
const dialog = ref(false)
const saving = ref(false)
const editId = ref(null)
const snackbar = reactive({ show: false, text: '', color: 'success' })

const form = reactive({
  name: '',
  email: '',
  role: '',
})

const headers = [
  { title: '#', key: 'no', sortable: false },
  { title: 'Name', key: 'name' },
  { title: 'Email', key: 'email' },
  { title: 'Role', key: 'role' },
  { title: 'Actions', key: 'actions', sortable: false },
]

const filtered = computed(() => {
  const s = search.value.toLowerCase()
  return !s
    ? items.value
    : items.value.filter(
        (x) =>
          (x.name || '').toLowerCase().includes(s) || (x.email || '').toLowerCase().includes(s),
      )
})

const indexed = computed(() => filtered.value.map((row, i) => ({ ...row, no: i + 1 })))

onMounted(fetchList)

async function fetchList() {
  loading.value = true
  try {
    const res = await usersApi.list()
    items.value = res.data?.data || res.data || []
  } catch (e) {
    showSnack('Failed to load users', 'error')
    console.error(e)
  } finally {
    loading.value = false
  }
}

function openCreate() {
  editId.value = null
  Object.assign(form, { name: '', email: '', role: '' })
  dialog.value = true
}

function openEdit(row) {
  editId.value = row.id
  Object.assign(form, { name: row.name, email: row.email, role: row.role })
  dialog.value = true
}

async function save() {
  if (!form.name.trim() || !form.email.trim()) {
    showSnack('Name and email are required', 'error')
    return
  }

  saving.value = true
  try {
    if (editId.value) {
      await usersApi.update(editId.value, { ...form })
      showSnack('User updated', 'success')
    } else {
      await usersApi.create({ ...form })
      showSnack('User created', 'success')
    }
    dialog.value = false
    await fetchList()
  } catch (e) {
    showSnack('Saving failed', 'error')
    console.error(e)
  } finally {
    saving.value = false
  }
}

async function removeItem(row) {
  if (!confirm(`Delete user "${row.name}"?`)) return
  try {
    await usersApi.remove(row.id)
    showSnack('User deleted', 'success')
    await fetchList()
  } catch (e) {
    showSnack('Delete failed', 'error')
    console.error(e)
  }
}

function showSnack(text, color = 'success') {
  snackbar.text = text
  snackbar.color = color
  snackbar.show = true
}
</script>
