<template>

  <div>
    <div class="w-100 d-flex justify-center flex-column">

      <b-button v-b-modal.modal-prevent-closing class="bg-primary mx-auto">Add New Client</b-button>

      <b-modal id="modal-prevent-closing" ref="modal" title="Submit Client Info" @show="resetModal" @hidden="resetModal"
        @ok="handleOk">

        <form ref="form" @submit.stop.prevent="handleSubmit">
          <b-form-group label="Name" label-for="name-input" invalid-feedback="Name is required" :state="nameState">
            <b-form-input id="name-input" v-model="name" :state="nameState" required></b-form-input>
          </b-form-group>

          <b-form-group label="Email" label-for="email-input" invalid-feedback="Email is required" :state="emailState">
            <b-form-input id="email-input" v-model="email" :state="emailState" required></b-form-input>
          </b-form-group>

          <b-form-group label="Phone" label-for="phone-input" invalid-feedback="phone is required" :state="phoneState">
            <b-form-input id="phone-input" v-model="phone" :state="phoneState" required></b-form-input>
          </b-form-group>
        </form>

      </b-modal>

    </div>

    <table cellpadding="10" cellspacing="0" class="w-100">
      <thead>
        <tr>
          <th>ID</th>
          <th>NAME</th>
          <th>EMAIL</th>
          <th>PHONE</th>
          <th>TRANSACTIONS</th>
          <th>OPTIONS</th>
        </tr>
      </thead>

      <tbody v-if="clients.length != 0">
        <tr v-for="client in clients" :key="client.id" class="border border-primary">
          <td>{{ client.id }}</td>
          <td>{{ client.name }}</td>
          <td>{{ client.email }}</td>
          <td>{{ client.phone }}</td>
          <td v-for="clientTransaction in client.transtactions"  class="d-flex flex-col gap-5">
            <div class="border border-primary  p-1" >{{ clientTransaction.amount }} </div>
            <div class="border border-primary  p-1">{{ clientTransaction.date }}</div>
          </td>
          <td class="d-flex gap-3">
            <b-button variant="danger" @click="deleteClient(client.id)">Delete</b-button>
            <HelloWorld :dataClient="client"/>
          </td>
        </tr>

      </tbody>
    </table>
  </div>

</template>

<script>
import axios from 'axios';
import { clients, fnFetchClients, fnDeleteClient, fnCreateClient } from "./services/Services.js";

import HelloWorld from './components/HelloWorld.vue';

export default {
  components: {
    HelloWorld
  },
  data() {
    return {
      name: '',
      email: '',
      phone: '',
      clients: [],
      nameState: null,
      emailState: null,
      phoneState: null
    }
  },
  mounted() {
    this.fetchClients();
  },

  watch: {
    'clients.length': function (newLength, oldLength) {
      this.fetchClients();
    }
  },

  methods: {
    async fetchClients() {
      const reponse = await axios.get("http://127.0.0.1:8000/home")
      this.clients = reponse.data.data
      console.log(this.clients)
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
      await this.createClient()
      this.$nextTick(() => {
        this.$bvModal.hide('modal-prevent-closing')
      })

    },

    async createClient() {
      const { data } = await axios.post("http://127.0.0.1:8000/create", {
        name: this.name,
        email: this.email,
        phone: this.phone
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      }
      )
    },

    async deleteClient(id) {
      const { data } = await axios.delete(`http://127.0.0.1:8000/delete/${id}`)
      this.clients = this.clients.filter((client) => client.id != id)
    }


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
