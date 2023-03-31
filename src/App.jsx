import { useMemo, useState, useCallback } from 'react';
import { useForm } from "react-hook-form";
import dayjs from "dayjs"

import Table from './components/table'

import './App.css'

import { ZipCodeService } from './service/zip-code-service';

function App() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [data, setData] = useState([])

  const onSubmit = async (data, e) => {
    const city = await ZipCodeService.getInstance().getCode(data.zipCode)
    setData(pre => [
      ...pre,
      {
        ...data,
        createDateTime: +new Date(),
        city
      }
    ])
    e.target.reset()
  }

  const registerEmail = 
    register("email", {
      required: true,
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "invalid email address"
      },
      validate: {
        isInData: (email) => !data.some(el => el.email === email) || 'The input email is already exist in the table',
      }
    })

  const registerZipCode = 
    register("zipCode", {
      required: true,
      validate: {
        isVaildZipCode: async (zipCode) => !!await ZipCodeService.getInstance().getCode(zipCode) || 'No city is identified',
      }
    })

  const columns = useMemo(
    () => [
      {
        Header: 'Email',
        accessor: 'email',
        width: 200,
      },
      {
        Header: 'US Zip Code',
        accessor: 'zipCode',
      },
      {
        Header: 'City (from api)',
        accessor: 'city',
      },
      {
        Header: 'Created DateTime',
        accessor: 'createDateTime',
        width: 300,
        Cell: ({ value, row }) => renderDateTimeCell({ value, row })
      },
    ],
    []
  )

  const renderDateTimeCell = ({ value, row }) => 
    <div className='createdatetime-cell'>
      {dayjs(value).format('MM/DD/YYYY h:mm:a')}
      <button className="delete-btn" onClick={() => removeData(row)}>delete</button>
    </div>

  const removeData = useCallback((row) => {
    const email = row.values.email
    setData(pre => pre.filter(d => email !== d.email))
  }, [data])


  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="email-form">
          <label htmlFor='email-field' className='email'>
            Email
            <input id="email-field"{...registerEmail} />
          </label>
          <label id="zipcode-field" className='zipcode'>
            ZipCode
            <input id='zipcode-field' type='number' {...registerZipCode} />
          </label>
          <input className="submit-btn" type="submit" value="Add email" />
        </div>

        <div className='error-msg'>
          {errors.email && <p role="alert">{errors.email?.message}</p>}
          {errors.zipCode && <p role="alert">{errors.zipCode?.message}</p>}
        </div>
      </form>
      <Table columns={columns} data={data} />
    </div>
  )
}

export default App
