<template>
  <div>
    <!-- Botón para abrir el modal -->
    <b-button @click="showModal">Update</b-button>

    <!-- Modal con ID dinámico -->
    <b-modal :id="`modal-client-${dataClient.id}`" ref="modal" :title="`Update Client: ${dataClient.name}`"
      @show="resetModal" @hidden="resetModal" @ok="handleOk">
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <!-- Campos del formulario -->

        <b-form-group label="Name" label-for="name-input" invalid-feedback="Name is required" :state="nameState">
          <b-form-input id="name-input" v-model="name" :state="nameState" required></b-form-input>
        </b-form-group>

        <b-form-group label="Email" label-for="email-input" invalid-feedback="Email is required" :state="emailState">
          <b-form-input id="email-input" v-model="email" :state="emailState" type="email" required></b-form-input>
        </b-form-group>

        <b-form-group label="Phone" label-for="phone-input" invalid-feedback="Phone is required" :state="phoneState">
          <b-form-input id="phone-input" v-model="phone" :state="phoneState" required></b-form-input>
        </b-form-group>

        <h6>Transactions</h6>

        <b-form-group v-for="(transaction, index) in transtactionsPerClient" :key="transaction.id"
          class="flex flex-col md:flex-row gap-4 p-4 rounded-lg bg-gray-100 shadow-lg">
          <b-form-input type="number" v-model="transaction.amount"
            class="w-full md:w-2/3 p-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            placeholder="Amount" :state="transaction.amount ? true : false"></b-form-input>

          <b-form-input type="date" v-model="transaction.date"
            class="w-full md:w-1/3 p-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            placeholder="Date" :state="transaction.date ? true : false"></b-form-input>

          <!-- Botón para eliminar una transacción específica -->
          <b-button variant="danger" @click="deleteTransaction(index)">Delete Transaction</b-button>
        </b-form-group>

        <!-- Botón para añadir más transacciones -->
        <b-button variant="success" @click="addTransaction">Add Transaction</b-button>

      </form>
    </b-modal>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    dataClient: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      id: this.dataClient.id,
      name: this.dataClient.name || "",
      email: this.dataClient.email || "",
      phone: this.dataClient.phone || "",
      nameState: null,
      emailState: null,
      phoneState: null,
      transtactionsPerClient: this.dataClient.transtactions || []
    };
  },
  methods: {
    // Abre el modal dinámicamente
    showModal() {
      this.$bvModal.show(`modal-client-${this.dataClient.id}`);

      // Si no hay transacciones iniciales, crea una por defecto
      if (this.transtactionsPerClient.length === 0) {
        this.addTransaction();
      }

      console.log("Hola desde update", JSON.stringify(this.transtactionsPerClient));
    },

    checkFormValidity() {
      const valid = this.$refs.form.checkValidity();
      this.nameState = valid;
      this.emailState = valid;
      this.phoneState = valid;
      return valid;
    },

    resetModal() {
      this.name = this.dataClient.name || "";
      this.email = this.dataClient.email || "";
      this.phone = this.dataClient.phone || "";
      this.nameState = null;
      this.emailState = null;
      this.phoneState = null;
    },

    // Se llama cuando se presiona OK en el modal
    handleOk(bvModalEvent) {
      bvModalEvent.preventDefault();
      this.handleSubmit();
    },

    handleSubmit() {
      if (!this.checkFormValidity()) {
        return;
      }

      if (!this.validateTransactions()) {
        return; // Si las transacciones no son válidas, no continuar con el envío
      }

      this.$nextTick(() => {
        this.$bvModal.hide(`modal-client-${this.dataClient.id}`);
        console.log("Form Submitted!");
        this.updateClient(); // Llamada a la función de actualización
      });
    },

    async updateClient() {
      try {
        // Actualizar los datos del cliente
        const bodyData = {
          id: this.dataClient.id,
          name: this.name,
          email: this.email,
          phone: this.phone,
        };

        const { data } = await axios.patch("http://127.0.0.1:8000/update", bodyData, {
          headers: {
            'Content-Type': 'application/json'
          },
        });

        await this.inserTransactions()

      } catch (error) {
        console.error('Error al actualizar el cliente o las transacciones:', error.data || error.message);
      }
    },

    async inserTransactions() {
      try {
        const { data } = await axios.post("http://127.0.0.1:8000/insert/transactions", JSON.stringify(this.transtactionsPerClient), {
          headers: {
            'Content-Type': 'application/json'
          },
        });
        console.log('transacciones insertadas: ', data);

      } catch (error) {
        console.error('Error al actualizar el cliente o las transacciones:', error.data || error.message);
      }
    },

    validateTransactions() {
      for (let transaction of this.transtactionsPerClient) {
        if (!transaction.amount || !transaction.date) {
          alert('Please fill in all transaction fields.');
          return false;
        }
      }
      return true;
    },

    addTransaction() {
      if (this.transtactionsPerClient.some(transaction => !transaction.amount || !transaction.date)) {
        alert("Please fill in all transaction fields before adding a new one.");
        return;
      }

      const newTransaction = {
        clientID: this.dataClient.id,
        amount: null,
        date: ""
      };

      this.transtactionsPerClient.push(newTransaction);
    },

    deleteTransaction(index) {
      this.transtactionsPerClient.splice(index, 1);
    }
  }
};
</script>
