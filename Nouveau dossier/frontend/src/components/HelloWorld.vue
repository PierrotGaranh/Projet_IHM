<template>
  <section>
    <h2>Test API /api/hello</h2>
    <button @click="loadMessage">Charger message /api/hello</button>
    <p v-if="message">✅ {{ message }}</p>
    <p v-if="error" style="color:#c0392b">Erreur: {{ error }}</p>
  </section>

  <section style="margin-top: 2rem; border-top: 1px solid #ddd; padding-top: 1rem;">
    <h2>Ajouter un matériel</h2>
    <form @submit.prevent="addMateriel">
      <div>
        <label>numMatériel : <input v-model="form.numMateriel" required /></label>
      </div>
      <div>
        <label>Design : <input v-model="form.design" required /></label>
      </div>
      <div>
        <label>Qualité : <input v-model="form.qualite" required /></label>
      </div>
      <div>
        <label>État :
          <select v-model="form.etat" required>
            <option disabled value="">Sélectionner</option>
            <option>Mauvais</option>
            <option>Bon</option>
            <option>Abime</option>
          </select>
        </label>
      </div>
      <button type="submit" style="margin-top: .5rem;">Ajouter</button>
    </form>
    <p v-if="materielMessage" :style="{ color: materielError ? '#c0392b' : '#16a085' }">{{ materielMessage }}</p>
  </section>

  <section style="margin-top:2rem; border-top:1px solid #ddd; padding-top:1rem;">
    <h2>Liste du matériel</h2>
    <button @click="loadMateriel">Rafraîchir</button>
    <table v-if="materiels.length" style="width:100%; margin-top:.5rem; border-collapse:collapse;">
      <thead>
        <tr>
          <th style="border:1px solid #ddd; padding:.4rem">numMatériel</th>
          <th style="border:1px solid #ddd; padding:.4rem">Design</th>
          <th style="border:1px solid #ddd; padding:.4rem">Qualité</th>
          <th style="border:1px solid #ddd; padding:.4rem">État</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in materiels" :key="item.numMateriel">
          <td style="border:1px solid #ddd; padding:.4rem">{{ item.numMateriel }}</td>
          <td style="border:1px solid #ddd; padding:.4rem">{{ item.design }}</td>
          <td style="border:1px solid #ddd; padding:.4rem">{{ item.qualite }}</td>
          <td style="border:1px solid #ddd; padding:.4rem">{{ item.etat }}</td>
        </tr>
      </tbody>
    </table>
    <p v-else>Aucun matériel enregistré.</p>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const message = ref('');
const error = ref('');

const form = ref({ numMateriel: '', design: '', etat: '', qualite: '' });
const materiels = ref([]);
const materielMessage = ref('');
const materielError = ref(false);

async function loadMessage() {
  error.value = '';
  message.value = '';

  try {
    const resp = await axios.get('/api/hello');
    message.value = resp.data.message;
  } catch (e) {
    error.value = e?.response?.data?.message || e.message || 'Erreur réseau';
  }
}

async function loadMateriel() {
  materielMessage.value = '';
  materielError.value = false;
  try {
    const resp = await axios.get('/api/materiel');
    materiels.value = resp.data;
  } catch (e) {
    materielMessage.value = e?.response?.data?.message || e.message || 'Impossible de charger le matériel';
    materielError.value = true;
  }
}

async function addMateriel() {
  materielMessage.value = '';
  materielError.value = false;
  try {
    await axios.post('/api/materiel', form.value);
    materielMessage.value = 'Matériel ajouté avec succès';
    form.value = { numMateriel: '', design: '', etat: '', qualite: '' };
    await loadMateriel();
  } catch (e) {
    materielMessage.value = e?.response?.data?.message || e.message || 'Erreur lors de l’ajout';
    materielError.value = true;
  }
}

onMounted(loadMateriel);
</script>

<style scoped>
section {
  margin-top: 1rem;
}
button {
  border: 1px solid #2c3e50;
  background: #3498db;
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 0.4rem;
  cursor: pointer;
}
input, select {
  margin-left: .5rem;
}
</style>
