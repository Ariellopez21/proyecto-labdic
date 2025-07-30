<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast';

const toast = useToast()
const emit = defineEmits(['submit'])

const username = ref('')
const password = ref('')
const isAdmin = ref(false)
const rut = ref('')
const name = ref('')
const email = ref('')
const phone = ref('')
const address = ref('')

async function handleSubmit() {

  if(!username.value || !password.value || !rut.value || !name.value || !email.value ) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Todos los campos son obligatorios',
      life: 3000
    })
    return
  }
  else{
    emit('submit', {
      username: username.value,
      password: password.value,
      isAdmin: isAdmin.value,
      rut: rut.value,
      name: name.value,
      email: email.value,
      phone: phone.value,
      address: address.value,
    })
  }

}

</script>

<template>
  <div class="flex flex-col gap-4">
    <FloatLabel variant="in">
      <InputText id="rut" v-model="rut" fluid />
      <label for="rut">RUT</label>
    </FloatLabel>
    <FloatLabel variant="in">
      <InputText id="name" v-model="name" fluid />
      <label for="name">Nombre</label>
    </FloatLabel>
    <FloatLabel variant="in">
      <InputText id="username" v-model="username" fluid />
      <label for="username">Usuario</label>
    </FloatLabel>
    <FloatLabel variant="in">
      <Password id="password" v-model="password" toggle-mask fluid />
      <label for="password">Contraseña</label>
    </FloatLabel>
    <FloatLabel variant="in">
      <InputText id="email" v-model="email" fluid />
      <label for="email">Correo</label>
    </FloatLabel>
    <FloatLabel variant="in">
      <InputText id="address" v-model="address" fluid />
      <label for="address">Dirección</label>
    </FloatLabel>
    <FloatLabel variant="in">
      <InputText id="phone" v-model="phone" fluid />
      <label for="phone">Teléfono</label>
    </FloatLabel>
    <div class="flex items-center gap-2">
      <Checkbox id="isAdmin" v-model="isAdmin" binary />
      <label for="isAdmin">Es administrador</label>
    </div>
    <Button severity="primary" @click="handleSubmit">
      Guardar
    </Button>
  </div>
</template>
