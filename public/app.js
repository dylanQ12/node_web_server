// URL base de tu API
const apiUrl = "http://localhost:8080/productos";

const tableBody = document
    .getElementById("productTable")
    .getElementsByTagName("tbody")[0];

// Función para cargar los productos al cargar la página
window.onload = function () {
    fetchProducts();
};

function submitProduct() {
    // Asignar los valores de los campos a variables
    const name = document.getElementById("productName").value;
    const quantityValue = document.getElementById("productQuantity").value;
    const priceValue = document.getElementById("productPrice").value;

    // Verificar si los campos están vacíos
    if (!name || !quantityValue || !priceValue) {
        alert("¡Por favor, complete todos los campos!");
        return;
    }

    // Convertir a números y manejar casos no numéricos
    const quantity = quantityValue ? parseInt(quantityValue, 10) : 0;
    const price = priceValue ? parseFloat(priceValue) : 0.0;

    // Asegúrate de que tanto la cantidad como el precio son números válidos
    if (isNaN(quantity) || quantity <= 0) {
        alert("¡Por favor, introduzca una cantidad válida!");
        return;
    }

    if (isNaN(price) || price <= 0.0) {
        alert("¡Por favor, introduzca un precio válido!");
        return;
    }

    // Preparar los datos para enviar al servidor en el formato esperado
    const productData = {
        nombreProducto: name,
        cantidad: quantity,
        precio: price,
    };

    // Obtener el ID del producto si se está actualizando uno existente
    const productId = document.getElementById("productId").value;
    const method = productId ? "PUT" : "POST";
    const url = productId ? `${apiUrl}/${productId}` : apiUrl;

    // Usar fetch para enviar los datos al servidor
    fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            alert("¡Producto guardado con éxito!");
            fetchProducts(); // Recargar la lista de productos
            // Limpiar el formulario
            document.getElementById("productForm").reset();
            document.getElementById("productId").value = ""; // Limpiar el ID oculto para nuevos productos
        })
        .catch((error) => {
            console.error("Error:", error);
            alert("¡Hubo un error al guardar el producto!");
        });
}

function clearForm() {
    document.getElementById("productForm").reset();
    document.getElementById("productId").value = ""; // Asegúrate de limpiar también el campo oculto de ID si es necesario
}

function fetchProducts() {
    fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
            const tableBody = document.getElementById("productTable");
            tableBody.innerHTML = ""; // Limpiar el cuerpo de la tabla antes de agregar nuevos datos
            data.forEach((product) => {
                const row = tableBody.insertRow();
                row.insertCell(0).textContent = product.id;

                // Verifica si 'nombreProducto' no es null antes de intentar mostrarlo
                row.insertCell(1).textContent =
                    product.nombreProducto ?? "No disponible";

                // Verifica si 'cantidad' no es null antes de intentar mostrarlo
                row.insertCell(2).textContent =
                    product.cantidad != null ? product.cantidad : "No disponible";

                // Verifica si 'precio' no es null y es un número antes de llamar a 'toFixed'
                const priceText =
                    typeof product.precio === "number" && product.precio != null
                        ? product.precio.toFixed(2)
                        : "No disponible";
                row.insertCell(3).textContent = priceText;

                const actionsCell = row.insertCell(4);
                actionsCell.appendChild(
                    createButton("Editar", () => editProduct(product), "edit")
                );
                actionsCell.appendChild(
                    createButton("Eliminar", () => deleteProduct(product.id), "delete")
                );
            });
        })
        .catch((error) => {
            console.error("Error:", error);
            alert("No se pudieron cargar los productos");
        });
}

// Función para crear botones de acción
function createButton(text, action, buttonType) {
    const button = document.createElement('button');
    button.type = 'button';
    button.classList.add('button');

    // Agregar clases para diferentes tipos de botones
    if (buttonType === 'edit') {
        button.classList.add('is-warning');
        button.innerHTML = `<span class="icon"><i class="fas fa-edit"></i></span><span>${text}</span>`;
    } else if (buttonType === 'delete') {
        button.classList.add('is-danger');
        button.innerHTML = `<span class="icon"><i class="fas fa-trash-alt"></i></span><span>${text}</span>`;
    }

    button.onclick = action;
    return button;
}

// Función para cargar datos del producto en el formulario para editar
function editProduct(product) {
    // Asegúrate de que los identificadores aquí coincidan con los `id` en tu HTML
    document.getElementById("productId").value = product.id;
    document.getElementById("productName").value = product.nombreProducto || ''; // Usar || '' para manejar valores nulos
    document.getElementById("productQuantity").value = product.cantidad || ''; // Usar || '' para manejar valores nulos o cero
    document.getElementById("productPrice").value = product.precio != null ? product.precio : ''; // Manejar valores nulos explícitamente para números
}


// Función para eliminar un producto
function deleteProduct(productId) {
    if (confirm("¿Estás seguro de eliminar este producto?")) {
        fetch(`${apiUrl}/${productId}`, {
            method: "DELETE",
        })
            .then((response) => {
                if (response.ok) {
                    alert("¡Producto eliminado con éxito!");
                    fetchProducts();
                } else {
                    alert("¡Error al eliminar el producto!");
                }
            })
            .catch((error) => console.error("Error:", error));
    }
}
