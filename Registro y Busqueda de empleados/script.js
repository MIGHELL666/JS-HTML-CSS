// Array para almacenar los usuarios registrados
const users = []
let nextId = 1 // Para asignar IDs secuenciales

// Elementos del DOM
const registrationForm = document.getElementById("registrationForm")
const searchInput = document.getElementById("searchInput")
const usersTableBody = document.getElementById("usersTableBody")
const emptyMessage = document.getElementById("emptyMessage")

// Función para validar el formulario
function validateForm(formData) {
  let isValid = true
  const errors = {}
  const currentYear = new Date().getFullYear()

  // Validar nombre
  if (!formData.firstName.trim()) {
    errors.firstName = "El nombre es obligatorio"
    isValid = false
  }

  // Validar apellido paterno
  if (!formData.paternalLastName.trim()) {
    errors.paternalLastName = "El apellido paterno es obligatorio"
    isValid = false
  }

  // Validar apellido materno
  if (!formData.maternalLastName.trim()) {
    errors.maternalLastName = "El apellido materno es obligatorio"
    isValid = false
  }

  // Validar día de nacimiento
  if (!formData.birthDay.trim()) {
    errors.birthDay = "El día es obligatorio"
    isValid = false
  } else if (Number.parseInt(formData.birthDay) < 1 || Number.parseInt(formData.birthDay) > 31) {
    errors.birthDay = "El día debe estar entre 1 y 31"
    isValid = false
  }

  // Validar mes de nacimiento
  if (!formData.birthMonth.trim()) {
    errors.birthMonth = "El mes es obligatorio"
    isValid = false
  } else if (Number.parseInt(formData.birthMonth) < 1 || Number.parseInt(formData.birthMonth) > 12) {
    errors.birthMonth = "El mes debe estar entre 1 y 12"
    isValid = false
  }

  // Validar año de nacimiento
  if (!formData.birthYear.trim()) {
    errors.birthYear = "El año es obligatorio"
    isValid = false
  } else if (Number.parseInt(formData.birthYear) < 1900 || Number.parseInt(formData.birthYear) > currentYear) {
    errors.birthYear = "Por favor ingrese un año válido"
    isValid = false
  }

  return { isValid, errors }
}

// Función para mostrar errores en el formulario
function displayErrors(errors) {
  // Limpiar errores anteriores
  document.querySelectorAll(".error").forEach((el) => (el.textContent = ""))

  // Mostrar nuevos errores
  for (const field in errors) {
    const errorElement = document.getElementById(`${field}Error`)
    if (errorElement) {
      errorElement.textContent = errors[field]
    }
  }
}

// Función para limpiar el formulario
function resetForm() {
  registrationForm.reset()
  document.querySelectorAll(".error").forEach((el) => (el.textContent = ""))
}

// Implementación del método burbuja para ordenar usuarios por ID (ascendente)
function bubbleSort(arr) {
  const n = arr.length
  let swapped

  for (let i = 0; i < n - 1; i++) {
    swapped = false

    for (let j = 0; j < n - i - 1; j++) {
      // Comparar IDs numéricamente (orden ascendente)
      if (arr[j].id > arr[j + 1].id) {
        // Intercambiar elementos
        const temp = arr[j]
        arr[j] = arr[j + 1]
        arr[j + 1] = temp
        swapped = true
      }
    }

    // Si no hubo intercambios en esta pasada, el array ya está ordenado
    if (!swapped) break
  }

  return arr
}

// Función para agregar un usuario
function addUser(user) {
  // Asignar ID secuencial
  user.id = nextId++
  users.push(user)
  updateUsersList()
}

// Función para actualizar la lista de usuarios
function updateUsersList() {
  const searchTerm = searchInput.value.toLowerCase()

  // Filtrar usuarios por nombre, apellido paterno o fecha de nacimiento
  const filteredUsers = users.filter((user) => {
    const fullDate = `${user.birthDay}/${user.birthMonth}/${user.birthYear}`

    return (
      user.firstName.toLowerCase().includes(searchTerm) ||
      user.paternalLastName.toLowerCase().includes(searchTerm) ||
      fullDate.includes(searchTerm)
    )
  })

  // Ordenar por ID usando el método burbuja (orden ascendente)
  const sortedUsers = bubbleSort([...filteredUsers])

  // Limpiar tabla
  usersTableBody.innerHTML = ""

  // Mostrar mensaje si no hay usuarios
  if (sortedUsers.length === 0) {
    emptyMessage.style.display = "block"
    emptyMessage.textContent =
      users.length === 0 ? "No hay usuarios registrados" : "No se encontraron usuarios con ese criterio de búsqueda"
  } else {
    emptyMessage.style.display = "none"

    // Agregar usuarios a la tabla
    sortedUsers.forEach((user) => {
      const row = document.createElement("tr")
      row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.firstName}</td>
                <td>${user.paternalLastName}</td>
                <td>${user.maternalLastName}</td>
                <td>${user.birthDay}/${user.birthMonth}/${user.birthYear}</td>
            `
      usersTableBody.appendChild(row)
    })
  }
}

// Event Listeners
registrationForm.addEventListener("submit", (e) => {
  e.preventDefault()

  const formData = {
    firstName: document.getElementById("firstName").value,
    paternalLastName: document.getElementById("paternalLastName").value,
    maternalLastName: document.getElementById("maternalLastName").value,
    birthDay: document.getElementById("birthDay").value,
    birthMonth: document.getElementById("birthMonth").value,
    birthYear: document.getElementById("birthYear").value,
  }

  const { isValid, errors } = validateForm(formData)

  if (isValid) {
    addUser(formData)
    resetForm()
  } else {
    displayErrors(errors)
  }
})

searchInput.addEventListener("input", updateUsersList)

// Función para registrar usuarios de ejemplo
function registerSampleUsers() {
  const sampleUsers = [
    {
      firstName: "Miguel Angel",
      paternalLastName: "Flores",
      maternalLastName: "Dávila",
      birthDay: "1",
      birthMonth: "1",
      birthYear: "1990",
    },
    {
      firstName: "Carlos",
      paternalLastName: "Alcalá",
      maternalLastName: "Mater",
      birthDay: "3",
      birthMonth: "4",
      birthYear: "1985",
    },
    {
      firstName: "María",
      paternalLastName: "González",
      maternalLastName: "Pérez",
      birthDay: "15",
      birthMonth: "6",
      birthYear: "1992",
    },
    {
      firstName: "Juan",
      paternalLastName: "Rodríguez",
      maternalLastName: "López",
      birthDay: "22",
      birthMonth: "8",
      birthYear: "1988",
    },
    {
      firstName: "Ana",
      paternalLastName: "Martínez",
      maternalLastName: "Sánchez",
      birthDay: "10",
      birthMonth: "3",
      birthYear: "1995",
    },
    {
      firstName: "Pedro",
      paternalLastName: "Hernández",
      maternalLastName: "García",
      birthDay: "5",
      birthMonth: "12",
      birthYear: "1987",
    },
    {
      firstName: "Laura",
      paternalLastName: "Díaz",
      maternalLastName: "Torres",
      birthDay: "18",
      birthMonth: "7",
      birthYear: "1993",
    },
    {
      firstName: "Roberto",
      paternalLastName: "Vázquez",
      maternalLastName: "Ramírez",
      birthDay: "27",
      birthMonth: "2",
      birthYear: "1984",
    },
    {
      firstName: "Sofía",
      paternalLastName: "Fernández",
      maternalLastName: "Morales",
      birthDay: "8",
      birthMonth: "9",
      birthYear: "1991",
    },
    {
      firstName: "Miguel",
      paternalLastName: "Jiménez",
      maternalLastName: "Ortiz",
      birthDay: "14",
      birthMonth: "5",
      birthYear: "1989",
    },
    {
      firstName: "Lucía",
      paternalLastName: "Ruiz",
      maternalLastName: "Castillo",
      birthDay: "20",
      birthMonth: "11",
      birthYear: "1994",
    },
    {
      firstName: "Daniel",
      paternalLastName: "Álvarez",
      maternalLastName: "Mendoza",
      birthDay: "2",
      birthMonth: "10",
      birthYear: "1986",
    },
    {
      firstName: "Carmen",
      paternalLastName: "Romero",
      maternalLastName: "Navarro",
      birthDay: "25",
      birthMonth: "1",
      birthYear: "1997",
    },
    {
      firstName: "Javier",
      paternalLastName: "Moreno",
      maternalLastName: "Cruz",
      birthDay: "12",
      birthMonth: "4",
      birthYear: "1983",
    },
    {
      firstName: "Elena",
      paternalLastName: "Torres",
      maternalLastName: "Reyes",
      birthDay: "30",
      birthMonth: "8",
      birthYear: "1996",
    },
    {
      firstName: "Alejandro",
      paternalLastName: "Gutiérrez",
      maternalLastName: "Flores",
      birthDay: "7",
      birthMonth: "6",
      birthYear: "1990",
    },
    {
      firstName: "Raquel",
      paternalLastName: "Sánchez",
      maternalLastName: "Vargas",
      birthDay: "19",
      birthMonth: "3",
      birthYear: "1985",
    },
    {
      firstName: "Francisco",
      paternalLastName: "López",
      maternalLastName: "Herrera",
      birthDay: "23",
      birthMonth: "9",
      birthYear: "1992",
    },
    {
      firstName: "Marta",
      paternalLastName: "Pérez",
      maternalLastName: "Gómez",
      birthDay: "11",
      birthMonth: "12",
      birthYear: "1988",
    },
    {
      firstName: "Antonio",
      paternalLastName: "García",
      maternalLastName: "Medina",
      birthDay: "16",
      birthMonth: "5",
      birthYear: "1994",
    },
  ]

  // Registrar cada usuario de ejemplo
  sampleUsers.forEach((user) => {
    addUser(user)
  })
}

// Inicializar la lista de usuarios
updateUsersList()

// Registrar automáticamente 20 usuarios de ejemplo
registerSampleUsers()

