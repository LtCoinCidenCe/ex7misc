import React, { useState, useEffect } from 'react'
import axios from 'axios'

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

const useCountry = (name) => {
  const [country, setCountry] = useState(null)

  useEffect(() =>
  {
    if (name === '') return;
    const addr = new URL(`https://restcountries.com/v3.1/name/${name}?fullText=true`)
    axios.get(addr).then(response =>
    {
      console.log(response.data[0])
      const received = response.data[0]
      const countryObject = {
        found: true, data: {
          name: received.name.common,
          capital: received.capital,
          population: received.population,
          flag: received.flags.svg
        }
      }
      setCountry(countryObject)
    })
      .catch(error =>
      {
        // for (const key in error) {
        //   if (Object.hasOwnProperty.call(error, key)) {
        //     const element = error[key];
        //     console.log(key,element)
        //   }
        // }
        if (error.response.status === 404) {
          const countryObject = { data: { name: name }, found: false }
          setCountry(countryObject)
        }
        else
          setCountry(null) // should not reach here
      })
  }, [name]) // useEffect

  return country
}

const Country = ({ country }) => {
  if (!country) {
    return null
  }

  if (!country.found) {
    return (
      <div>
        not found...
      </div>
    )
  }

  return (
    <div>
      <h3>{country.data.name} </h3>
      <div>capital {country.data.capital} </div>
      <div>population {country.data.population}</div> 
      <img src={country.data.flag} height='100' alt={`flag of ${country.data.name}`}/>  
    </div>
  )
}

const App = () => {
  const nameInput = useField('text')
  const [name, setName] = useState('')
  const country = useCountry(name)

  const fetch = (e) => {
    e.preventDefault()
    setName(nameInput.value)
  }

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>

      <Country country={country} />
    </div>
  )
}

export default App
