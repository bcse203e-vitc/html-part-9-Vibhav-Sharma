
document.addEventListener("DOMContentLoaded", function () {
  const appointmentForm = document.getElementById('appointment-form');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const dateTimeInput = document.getElementById('date-time');
  const termsInput = document.getElementById('terms');
  const serviceInput = document.getElementById('service');
  const closeModalBtn = document.getElementById('close-modal');
  const modal = document.getElementById('appointment-form-modal');
  const appointmentTableBody = document.getElementById('appointments-table').querySelector('tbody');

  let appointments = JSON.parse(localStorage.getItem('appointments')) || [];

  
  document.querySelectorAll('.book-appointment').forEach(button => {
    button.addEventListener('click', function () {
      const service = this.dataset.service;
      document.getElementById('service').value = service;
      modal.style.display = 'flex';
    });
  });

  
  closeModalBtn.addEventListener('click', function () {
    modal.style.display = 'none';
  });

  
  appointmentForm.addEventListener('submit', function (event) {
    event.preventDefault();

    let isValid = true;
    clearErrors();

    
    if (nameInput.value.trim() === "") {
      isValid = false;
      showError(nameInput, "Name is required");
    }

    
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(emailInput.value)) {
      isValid = false;
      showError(emailInput, "Invalid email format");
    }

    
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phoneInput.value)) {
      isValid = false;
      showError(phoneInput, "Phone number must be 10 digits");
    }

    
    const selectedDate = new Date(dateTimeInput.value);
    if (selectedDate <= new Date()) {
      isValid = false;
      showError(dateTimeInput, "Please select a future date and time");
    }

    
    if (!termsInput.checked) {
      isValid = false;
      showError(termsInput, "You must agree to the terms");
    }

    if (isValid) {
      const appointment = {
        name: nameInput.value,
        email: emailInput.value,
        phone: phoneInput.value,
        service: serviceInput.value,
        dateTime: dateTimeInput.value,
        status: 'Pending'
      };

      appointments.push(appointment);
      localStorage.setItem('appointments', JSON.stringify(appointments));
      displayAppointments();
      modal.style.display = 'none';
      showConfirmation(appointment);
    }
  });

  
  emailInput.addEventListener('input', function () {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(emailInput.value)) {
      showError(emailInput, "Invalid email format");
    } else {
      clearError(emailInput);
    }
  });

  
  dateTimeInput.addEventListener('input', function () {
    const selectedDate = new Date(dateTimeInput.value);
    if (selectedDate <= new Date()) {
      showError(dateTimeInput, "Please select a future date and time");
    } else {
      clearError(dateTimeInput);
    }
  });

  function clearErrors() {
    document.querySelectorAll('.error').forEach(error => error.textContent = '');
  }

  function showError(input, message) {
    const errorElement = document.getElementById(input.id + '-error');
    errorElement.textContent = message;
  }

  function clearError(input) {
    const errorElement = document.getElementById(input.id + '-error');
    errorElement.textContent = '';
  }

  function displayAppointments() {
    appointmentTableBody.innerHTML = '';
    appointments.forEach((appointment, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${appointment.name}</td>
        <td>${appointment.service}</td>
        <td>${appointment.dateTime}</td>
        <td>${appointment.status}</td>
        <td><input type="checkbox" class="complete-checkbox" data-index="${index}" ${appointment.status === "Completed" ? "checked" : ""}></td>
      `;
      appointmentTableBody.appendChild(row);
    });

    
    document.querySelectorAll('.complete-checkbox').forEach(checkbox => {
      checkbox.addEventListener('change', function () {
        const index = this.dataset.index;
        appointments[index].status = this.checked ? "Completed" : "Pending";
        localStorage.setItem('appointments', JSON.stringify(appointments));
        displayAppointments(); 
      });
    });
  }

  function showConfirmation(appointment) {
    alert(`Thank you, ${appointment.name}! Your appointment for ${appointment.service} on ${appointment.dateTime} is confirmed.`);
  }

  
  displayAppointments();
});
