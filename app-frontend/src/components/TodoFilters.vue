<script setup lang="ts">
interface Props {
  modelValue: 'all' | 'pending' | 'completed'
}

interface Emits {
  (e: 'update:modelValue', value: 'all' | 'pending' | 'completed'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

function updateFilter(value: 'all' | 'pending' | 'completed') {
  emit('update:modelValue', value)
}
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <Button
      label="Todas"
      :severity="modelValue === 'all' ? 'primary' : 'secondary'"
      size="small"
      :class="
        modelValue === 'all'
          ? 'bg-blue-600 border-blue-600'
          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
      "
      @click="updateFilter('all')"
    />
    <Button
      label="Pendientes"
      :severity="modelValue === 'pending' ? 'primary' : 'secondary'"
      size="small"
      :class="
        modelValue === 'pending'
          ? 'bg-blue-600 border-blue-600'
          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
      "
      @click="updateFilter('pending')"
    />
    <Button
      label="Completadas"
      :severity="modelValue === 'completed' ? 'primary' : 'secondary'"
      size="small"
      :class="
        modelValue === 'completed'
          ? 'bg-blue-600 border-blue-600'
          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
      "
      @click="updateFilter('completed')"
    />
  </div>
</template>
