import * as yup from "yup";
import React, { useEffect, useState } from 'react'
import axios from "axios";

// 👇 Here are the validation errors you will use with Yup.
const validationErrors = {
  fullNameTooShort: 'full name must be at least 3 characters',
  fullNameTooLong: 'full name must be at most 20 characters',
  sizeIncorrect: 'size must be S or M or L'
}

const { fullNameTooShort, fullNameTooLong, sizeIncorrect } = validationErrors


//intentional values
const initialFormValues = {
  fullName: '',
  size: '',
  toppings: []
}

const initialFormErrors = {
  fullName: '',
  size: '',
}

const initialEnabled = false

// 👇 Here you will create your schema.

const formSchema = yup.object().shape({
  fullName: yup
    .string()
    .trim()
    .min(3, fullNameTooShort)
    .max(20, fullNameTooLong),
  size: yup
    .string()
    .oneOf(["S", "M", "L"], sizeIncorrect),
  toppings: yup
    .array()
    .notRequired()

})

// 👇 This array could help you construct your checkboxes using .map in the JSX.
const toppings = [
  { topping_id: '1', text: 'Pepperoni' },
  { topping_id: '2', text: 'Green Peppers' },
  { topping_id: '3', text: 'Pineapple' },
  { topping_id: '4', text: 'Mushrooms' },
  { topping_id: '5', text: 'Ham' },
]

export default function Form() {

  const [formValues, setFormValues] = useState(initialFormValues) // object
  const [formErrors, setFormErrors] = useState(initialFormErrors) // object
  const [enabled, setEnabled] = useState(initialEnabled)       // boolean


  const [order, setOrder] = useState('')
  const [isError, setIsError] = useState('')


  const postNewOrder = newOrder => {

    axios.post("http://localhost:9009/api/order", newOrder)
      .then(res => {


        setOrder(res.data.message);
      })
      .catch(err => setIsError(err.data.message))
      .finally(() => setFormValues(initialFormValues))
  }


  const validate = (name, value) => {

    yup.reach(formSchema, name)
      .validate(value)
      .then(() => setFormErrors({ ...formErrors, [name]: "" }))
      .catch(err => setFormErrors({ ...formErrors, [name]: err.errors[0] }))
  }

  const inputChange = (name, value) => {

    setFormValues({
      ...formValues,
      [name]: value
    })

    validate(name, value)

  }


  const onChange = evt => {
    const { toppings } = formValues;
    const { id, name, value, checked, type } = evt.target

    let newName = (type === "checkbox") ? 'toppings' : id
    let newValue = (type === "checkbox") ? checked ?
      [...toppings, name]
      : toppings.filter((e) => e !== name)
      : value

    inputChange(newName, newValue)
  }

  const formSubmit = evt => {
    evt.preventDefault()
    postNewOrder(formValues);
  }



  useEffect(() => {

    formSchema.isValid(formValues).then(valid => setEnabled(valid))
  }, [formValues])



  return (
    <form onSubmit={formSubmit}>
      <h2>Order Your Pizza</h2>
      {order && <div className='success'>{order}</div>}
      {isError && <div className='failure'>{isError}</div>}

      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label><br />
          <input
            placeholder="Type full name"
            id="fullName"
            type="text"
            value={formValues.fullName}
            onChange={onChange}
          />
        </div>
        {formErrors.fullName && <div className='error'>{formErrors.fullName}</div>}
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label><br />
          <select
            id="size"
            onChange={onChange}
            value={formValues.size}
          >
            <option value="">----Choose Size----</option>
            {/* Fill out the missing options */}
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
          </select>
        </div>
        {formErrors.size && <div className='error'>{formErrors.size}</div>}
      </div>

      <div className="input-group">
        {/* 👇 Maybe you could generate the checkboxes dynamically */}
        {toppings.map(({ topping_id, text }) => {
          return (
            <label key={topping_id}>
              <input
                name={topping_id}
                type="checkbox"
                onChange={onChange}
                checked={formValues.toppings.includes(topping_id)}
              />
              {text}<br />
            </label>)
        })}

      </div>
      {/* 👇 Make sure the submit stays disabled until the form validates! */}
      <input type="submit" disabled={!enabled} />
    </form>
  )
}
