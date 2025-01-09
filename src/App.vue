<template>
  <div>
    <div class="w-100 d-flex justify-center flex-column">
      <!-- Botón para agregar cliente -->
      <b-button v-b-modal.modal-prevent-closing class="bg-primary mx-auto">Add New Client</b-button>

      <!-- Modal para agregar nuevo cliente -->
      <b-modal id="modal-prevent-closing" ref="modal" title="Submit Client Info" @show="resetModal" @hidden="resetModal"
        @ok="handleOk">
        <form ref="form" @submit.stop.prevent="handleSubmit">
          <b-form-group label="Name" label-for="name-input" invalid-feedback="Name is required" :state="nameState">
            <b-form-input id="name-input" v-model="name" :state="nameState" required></b-form-input>
          </b-form-group>

          <b-form-group label="Email" label-for="email-input" invalid-feedback="Email is required" :state="emailState">
            <b-form-input id="email-input" v-model="email" :state="emailState" required></b-form-input>
          </b-form-group>

          <b-form-group label="Phone" label-for="phone-input" invalid-feedback="Phone is required" :state="phoneState">
            <b-form-input id="phone-input" v-model="phone" :state="phoneState" required></b-form-input>
          </b-form-group>
        </form>
      </b-modal>
    </div>

    <!-- Tabla con los clientes y sus transacciones -->
    <table cellpadding="10" cellspacing="0" class="w-100 table table-bordered">
      <thead class="text-center">
        <tr>
          <th>ID</th>
          <th>NAME</th>
          <th>EMAIL</th>
          <th>PHONE</th>
          <th>TRANSACTIONS</th>
          <th>OPTIONS</th>
        </tr>
      </thead>

      <tbody v-if="clients.length !== 0" class="text-center">
        <tr v-for="client in clients" :key="client.id">
          <td>{{ client.id }}</td>
          <td>{{ client.name }}</td>
          <td>{{ client.email }}</td>
          <td>{{ client.phone }}</td>

          <td>
            <div class="border p-1">
              <strong>Total Amount:</strong> {{ calculateTotalAmount(client.transtactions) }}
            </div>
          </td>

          <td class="d-flex gap-4 justify-content-center">
            <b-button variant="danger" @click="deleteClient(client.id)">Delete</b-button>
            <ModalUpdate :dataClient="client" @clientUpdated="handleClientUpdated" />
          </td>
        </tr>
      </tbody>

      <tbody v-else>
        <tr>
          <td colspan="6" class="text-center">No clients available</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { fnFetchClients, fnDeleteClient, fnCreateClient } from "./services/Services.js";

import ModalUpdate from './components/ModalUpdate.vue';

export default {
  components: {
    ModalUpdate
  },
  data() {
    return {
      name: '',
      email: '',
      phone: '',
      clients: [],
      nameState: null,
      emailState: null,
      phoneState: null,
      isClientUpdated: false
    }
  },
  async mounted() {
    this.clients = await fnFetchClients();
    console.log(this.clients)
  },

  watch: {
    'clients.length': async function (newLength, oldLength) {
      this.clients = await fnFetchClients();
    },

    'isClientUpdated': async function (newLength, oldLength) {
      window.location.reload();
    }
  },

  methods: {
    handleClientUpdated(isUpdated) {
      this.isClientUpdated = true;
    },


    checkFormValidity() {
      const valid = this.$refs.form.checkValidity()
      this.nameState = valid
      this.emailState = valid
      this.phoneState = valid
      return valid
    },
    resetModal() {
      this.name = '';
      this.email = '';
      this.phone = '';
      this.nameState = null;
      this.emailState = null;
      this.phoneState = null;
    },
    handleOk(bvModalEvent) {
      bvModalEvent.preventDefault()
      this.handleSubmit()
    },
    async handleSubmit() {
      if (!this.checkFormValidity()) {
        return
      }
      this.clients.push(this.name)

      const dataClient = {
        name: this.name,
        email: this.email,
        phone: this.phone
      }
      await fnCreateClient(dataClient)
      this.$nextTick(() => {
        this.$bvModal.hide('modal-prevent-closing')
      })

    },

    async deleteClient(id) {
      this.clients = this.clients.filter((client) => client.id != id)
      await fnDeleteClient(id)
    },

    calculateTotalAmount(transactions) {
      transactions = transactions || [];
      console.log(transactions)

      return transactions.reduce((total, transaction) => total + (transaction.amount || 0), 0);
    },


  }
}
</script>


<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
