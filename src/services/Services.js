import axios from 'axios';


async function fnFetchClients() {
    const reponse = await axios.get("http://127.0.0.1:8000/home")
    return reponse.data.data
}

async function fnCreateClient(clientData) {
    const { data } = await axios.post("http://127.0.0.1:8000/create", clientData, {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    )
    return alert("Usuario creado exitosamente")
}


async function fnDeleteClient(id) {
    const { data } = await axios.delete(`http://127.0.0.1:8000/delete/${id}`)
    clients = clients.filter((client) => client.id != id)
    return "Usuario eliminado  con exito"
}


async function fnInserTransaction(params) {
    const { data } = await axios.post("http://127.0.0.1:8000/insert/transactions",
        { transactions: params },
        { headers: { 'Content-Type': 'application/json' } });
    console.log("Transaciones insertadas ");
}

async function fnUpdateClient(data) {
    await axios.patch("http://127.0.0.1:8000/update", data, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return alert("Usuario actualizo exitosamente")
}

async function fnDeleteTransaction(id) {
    const { data } = await axios.delete(`http://127.0.0.1:8000/delete/transaction/${id}`)
    return "Transaccion eliminada de manera exitosa"
}

async function fnUpdateTransaction(params) {
    const { data } = await axios.post("http://127.0.0.1:8000/update/transactions",
        params,
        { headers: { 'Content-Type': 'application/json' } });
    console.log("Transaciones insertadas ");
}

export { fnFetchClients, fnDeleteClient, fnCreateClient, fnInserTransaction, fnUpdateClient,fnDeleteTransaction,fnUpdateTransaction };
