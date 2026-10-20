
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import {
    getDatabase,
    ref,
    push,
    onValue
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyAwUMIMqBy0auX5PvTWhPjvTJBhFZ7E0WQ",
    authDomain: "bicicleteria-b2ae3.firebaseapp.com",
    databaseURL: "https://bicicleteria-b2ae3-default-rtdb.firebaseio.com",
    projectId: "bicicleteria-b2ae3",
    storageBucket: "bicicleteria-b2ae3.firebasestorage.app",
    messagingSenderId: "759510024682",
    appId: "1:759510024682:web:7c1bb3a06dccb9c982f293"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const inputMarca = document.querySelector("#marca");
const inputStock = document.querySelector("#stock");
const inputColor = document.querySelector("#color");
const inputTipo = document.querySelector("#tipo");
const botonGuardar = document.querySelector("#btn");

const inputBuscar = document.querySelector("#buscarMarca");
const botonLimpiar = document.querySelector("#limpiar");

const tabla = document.querySelector("#tablaBicicletas");
const mensaje = document.querySelector("#mensaje");

const bicicletasRef = ref(db, "Bicicleteria");

let registros = {};

botonGuardar.onclick = function () {

    const marca = inputMarca.value.trim();
    const stock = inputStock.value;
    const color = inputColor.value.trim();
    const tipo = inputTipo.value.trim();

    if (
        marca === "" ||
        stock === "" ||
        color === "" ||
        tipo === ""
    ) {
        mensaje.textContent = "Completa todos los campos.";
        return;
    }

    if (Number(stock) < 0 || !Number.isInteger(Number(stock))) {
        mensaje.textContent = "El stock debe ser un numero entero mayor o igual a cero.";
        return;
    }

    push(bicicletasRef, {
        marca: marca,
        stock: Number(stock),
        color: color,
        tipo: tipo
    })
    .then(function () {
        mensaje.textContent = "Bicicleta guardada correctamente.";

        inputMarca.value = "";
        inputStock.value = "";
        inputColor.value = "";
        inputTipo.value = "";

        inputMarca.focus();
    })
    .catch(function (error) {
        mensaje.textContent =
            "Error al guardar la bicicleta: " + error.message;
    });
};

onValue(bicicletasRef, function (datos) {

    registros = datos.val() || {};

    mostrarBicicletas();
    
}, function (error) {
    mensaje.textContent =
        "Error al leer los datos: " + error.message;
});

function mostrarBicicletas() {

    const busqueda = inputBuscar.value.trim().toLowerCase();

    tabla.innerHTML = "";

    let cantidad = 0;

    Object.entries(registros).forEach(function ([clave, bicicleta]) {

        if (!bicicleta.marca.toLowerCase().includes(busqueda)) {
            return;
        }

        const fila = document.createElement("tr");

        const valores = [
            clave,
            bicicleta.marca,
            bicicleta.stock,
            bicicleta.color,
            bicicleta.tipo
        ];

        valores.forEach(function (valor) {
            const celda = document.createElement("td");
            celda.textContent = valor;
            fila.appendChild(celda);
        });

        tabla.appendChild(fila);
        cantidad++;
    });

    if (cantidad === 0) {
        const fila = document.createElement("tr");
        const celda = document.createElement("td");

        celda.colSpan = 5;
        celda.textContent = busqueda
            ? "No se encontraron bicicletas con esa marca."
            : "Todavia no hay bicicletas cargadas.";

        fila.appendChild(celda);
        tabla.appendChild(fila);
    }
}

inputBuscar.addEventListener("input", mostrarBicicletas);

botonLimpiar.onclick = function () {
    inputBuscar.value = "";
    mostrarBicicletas();
};
