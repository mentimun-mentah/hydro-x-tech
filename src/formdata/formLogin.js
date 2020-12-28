import isEmpty from 'validator/lib/isEmpty'
import isEmail from 'validator/lib/isEmail'

export const formLogin = {
  email: { value: "", isValid: true, message: null },
  password: { value: "", isValid: true, message: null },
}

export const formLoginIsValid = (state, setState) => {
  const email = { ...state.email }
  const password = { ...state.password }
  let isGood = true

  if(!isEmail(email.value)){
    isGood = false;
    email.isValid = false;
    email.message = "Email tidak valid";
  }

  if(isEmpty(password.value, { ignore_whitespace: true })){
    isGood = false;
    password.isValid = false;
    password.message = "Kolom tidak boleh kosong";
  }

  if(!isGood) setState({ ...state, email, password })

  return isGood
}

