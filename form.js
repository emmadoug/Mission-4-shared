console.log('Fixit Form Connected ✅')

const fullName = document.getElementById('fullName')
const email = document.getElementById('email')
const phonenumber = document.getElementById('pnumber')
const password = document.getElementById('pword')
const terms = document.getElementById('terms')

const form = document.getElementById('createAccount')
const inputs = form.querySelectorAll('.form-input')

// validation functions
function validateName(name) {
  return name.trim().length >= 3
}

function validateEmail(email) {
  // /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailPattern.test(email)
}

function validatePhone(phone) {
  // 8 (landline) 9, 10 (mobile)
  // https://stackoverflow.com/questions/9850428/regular-expression-to-validate-new-zealand-phone-numbers
  const phonePattern = /^[\d\s\-\+\(\)]{10,}$/
  return phonePattern.test(phone)
}

function validatePassword(password) {}

// function showError(input) {
//   console.log(input.id)
//   errorDiv = document.getElementById('nameError')
//   // errorDiv = document.getElementById('emailError')
//   // errorDiv = document.getElementById('phoneError')
//   // errorDiv = document.getElementById('passwordError')
//   // errorDiv.textContent = 'help'
// }

// position the checkmark icon far right of input box
// style="position: relative !important; height: 0px !important; width: 0px !important; float: left !important;"

function showSuccess() {}

function showError(input, message) {
  console.log('Error for:', input.id)

  let errorDivId

  if (input.id === 'fullName') {
    errorDivId = 'nameError'
  } else if (input.id === 'email') {
    errorDivId = 'emailError'
  } else if (input.id === 'pnumber') {
    errorDivId = 'phoneError'
  } else if (input.id === 'pword') {
    errorDivId = 'passwordError'
  }

  const errorDiv = document.getElementById(errorDivId)

  // input.classList.add('h2')

  // add styling to input border
  input.classList.add('error')
  input.classList.remove('success')

  // show the error message
  errorDiv.textContent = message
  errorDiv.classList.add('show')
}

function clearError(input) {
  let clearDivId
  console.log(input.id)

  if (input.id === 'fullName') {
    clearDivId = 'nameError'
  } else if (input.id === 'email') {
    clearDivId = 'emailError'
  } else if (input.id === 'pnumber') {
    clearDivId = 'phoneError'
  } else if (input.id === 'pword') {
    clearDivId = 'passwordError'
  }

  const clearDiv = document.getElementById(clearDivId)
  // console.log(clearDivId)
  console.log(clearDiv)
  // console.log(clearDivId.classList)
  // console.log(document.getElementById(clearDivId))

  // remove error styling from input
  input.classList.remove('error')

  // clear the error message and hide the error div
  clearDiv.textContent = ''
  clearDiv.classList.remove('show')
}

// form inputs
fullName.addEventListener('input', (e) => {
  const value = e.target.value
  if (value === '') {
    clearError(fullName)
  } else if (validateName(value)) {
    showSuccess(fullName)
  } else {
    showError(
      fullName,
      'Name must be at least 2 characters and contain only letters',
    )
  }
})

email.addEventListener('input', (e) => {
  const value = e.target.value
  if (value === '') {
    clearError(email)
  } else if (validateEmail(value)) {
    showSuccess(email)
  } else {
    showError(email, 'Please enter a valid email address')
  }
})

phonenumber.addEventListener('input', (e) => {
  const value = e.target.value
  if (value === '') {
    clearError(phonenumber)
  } else if (validatePhone(value)) {
    showSuccess(phonenumber)
  } else {
    showError(phonenumber, 'Please enter a valid phone number')
  }
})

password.addEventListener('input', (e) => {
  const value = e.target.value
  if (value === '') {
    clearError(password)
  } else if (validatePassword(value)) {
    showSuccess(password)
  } else {
    showError(password, 'Password must be at least 8 characters long')
  }
})
