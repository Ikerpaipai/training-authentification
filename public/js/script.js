const $ = el => document.querySelector(el)

const loginForm = $('#login-form')
const validationLoginUsername = $('.validation-login-username')
const validationLoginPassword = $('.validation-login-password')
const loginSpan = $('#login-form .validation-form')

const registerForm = $('#register-form')
const validationRegisterUsername = $('.validation-register-username')
const validationRegisterPassword = $('.validation-register-password')
const validationRegisterConfirmPassword = $('.validation-register-confirm-password')
const registerSpan = $('#register-form .validation-form')

const logoutButton = $('#close-session')
const backToWebButton = $('#button-back-web')

loginForm?.addEventListener('submit', e => {
  e.preventDefault()
  const username = $('#login-username').value
  const password = $('#login-password').value

  fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })
  .then(res => res.json().then(data => ({ status: res.status, body: data })))
  .then(res => {
    if (res.status === 200) {
      loginSpan.innerText = 'Session started... Entering...'
      loginSpan.style.color = 'green'
      setTimeout(() => {
        window.location.href = '/protected'
      }, 2000)
    } else {
      const errors = res.body
      if (errors.username.length > 0) {
        validationLoginUsername.innerText = errors.username[0]
      } else {
        validationLoginUsername.innerText = ''
      }
      if (errors.password.length > 0) {
        validationLoginPassword.innerText = errors.password[0]
      } else {
        validationLoginPassword.innerText = ''
      }
      loginSpan.innerText = 'Error logging in'
      loginSpan.style.color = 'red'
    }
  })
})

registerForm?.addEventListener('submit', e => {
  e.preventDefault()
  const username = $('#register-username').value
  const password = $('#register-password').value
  const confirmPassword = $('#register-confirm-password').value

  if (password !== confirmPassword) {
    validationRegisterConfirmPassword.innerText = 'Password do not match'
  } else {
    validationRegisterConfirmPassword.innerText = ''
  }

  fetch('/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })
  .then(res => res.json().then(data => ({ status: res.status, body: data })))
  .then(res => {
    if (res.status === 200) {
      registerSpan.innerText = 'Great, you have registered!'
      registerSpan.style.color = 'green'
    } else {
      const errors = res.body
      if (errors.username.length > 0) {
        validationRegisterUsername.innerText = errors.username[0]
      } else {
        validationRegisterUsername.innerText = ''
      }
      if (errors.password.length > 0) {
        validationRegisterPassword.innerText = errors.password[0]
      } else {
        validationRegisterPassword.innerText = ''
      }

      registerSpan.innerText = 'Error registering user'
      registerSpan.style.color = 'red'
    }
  })
})

logoutButton?.addEventListener('click', e => {
  e.preventDefault()
  fetch('/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(() => {
    window.location.href = '/'
  })
})

backToWebButton?.addEventListener('click', e => {
  e.preventDefault()
  window.location.href = '/'
})
