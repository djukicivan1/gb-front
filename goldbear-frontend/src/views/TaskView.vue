<template>
  <v-container>
    <v-btn class="mb-5" prepend-icon="mdi-arrow-left" @click="$router.push('/home')">Back</v-btn>
    <v-row align="center" class="mb-4">
      <v-col cols="12" sm="6">
        <v-text-field v-model="search" label="Search tasks" clearable />
      </v-col>
      <v-col cols="12" sm="6" class="text-right">
        <v-btn color="primary" @click="openCreate" prepend-icon="mdi-plus">Add task</v-btn>
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
        <v-card-title>{{ editId ? 'Edit' : 'Add' }} Task</v-card-title>
        <v-card-text>
          <v-text-field v-model="form.title" label="Title" />
          <v-textarea v-model="form.description" label="Description" />
          <v-text-field v-model="form.due_date" label="Due date (YYYY-MM-DD HH:mm:ss)" />
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
import { tasksApi } from '../api/endpoints'

const items = ref([])
const search = ref('')
const loading = ref(false)
const dialog = ref(false)
const saving = ref(false)
const editId = ref(null)
const snackbar = reactive({ show: false, text: '', color: 'success' })

const form = reactive({
  title: '',
  description: '',
  due_date: '',
})

const headers = [
  { title: '#', key: 'no', sortable: false },
  { title: 'Title', key: 'title' },
  { title: 'Description', key: 'description' },
  { title: 'Due date', key: 'due_date' },
  { title: 'Actions', key: 'actions', sortable: false },
]

const filtered = computed(() => {
  const s = search.value.toLowerCase()
  return !s
    ? items.value
    : items.value.filter(
        (x) =>
          (x.title || '').toLowerCase().includes(s) ||
          (x.description || '').toLowerCase().includes(s),
      )
})

const indexed = computed(() => filtered.value.map((row, i) => ({ ...row, no: i + 1 })))

onMounted(fetchList)

async function fetchList() {
  loading.value = true
  try {
    const res = await tasksApi.list()
    items.value = res.data?.data || res.data || []
  } catch (e) {
    showSnack('Failed to load tasks', 'error')
    console.error(e)
  } finally {
    loading.value = false
  }
}

function openCreate() {
  editId.value = null
  Object.assign(form, { title: '', description: '', due_date: '' })
  dialog.value = true
}

function openEdit(row) {
  editId.value = row.id
  Object.assign(form, {
    title: row.title,
    description: row.description,
    due_date: row.due_date,
  })
  dialog.value = true
}

async function save() {
  if (!form.title.trim()) {
    showSnack('Title is required', 'error')
    return
  }

  saving.value = true
  try {
    if (editId.value) {
      await tasksApi.update(editId.value, { ...form })
      showSnack('Task updated', 'success')
    } else {
      await tasksApi.create({ ...form })
      showSnack('Task created', 'success')
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
  if (!confirm(`Delete task "${row.title}"?`)) return
  try {
    await tasksApi.remove(row.id)
    showSnack('Task deleted', 'success')
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
