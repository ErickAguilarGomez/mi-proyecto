import axios from 'axios';

let clients = []

async function fnFetchClients() {
    const reponse = await axios.get("http://127.0.0.1:8000/home")
    clients = reponse.data.data
}


async function fnDeleteClient(id) {
    const { data } = await axios.delete(`http://127.0.0.1:8000/delete/${id}`)
    clients = clients.filter((client) => client.id != id)
    return "Usuario eliminado  con exito"
}


async function fnCreateClient(cName, cEmail, cPhone) {
    const { data } = await axios.post("http://127.0.0.1:8000/create", {
        name: cName,
        email: cEmail,
        phone: cPhone
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    )

    return alert("Usuario creado exitosamente")
}


export { clients, fnFetchClients, fnDeleteClient, fnCreateClient };
