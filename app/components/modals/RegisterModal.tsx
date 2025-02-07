'use client'

import useLoginModal from '@/app/hooks/useLoginModal';
import useRegisterModal from '@/app/hooks/useRegisterModal';
import axios from 'axios';
import { useCallback, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Heading from '../Heading';
import Input from '../inputs/Input';
import Modal from './Modal';

const RegisterModal = () => {
  const registerModal = useRegisterModal()
  const loginModal = useLoginModal()
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    }
  })
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true)

    axios.post('/api/register', data)
      .then(() => {
        toast.success('Register success')
        registerModal.onClose()
        loginModal.onOpen()
      }).catch((res) => {
        const error = res.response.data.error;
        toast.error(error)
      }).finally(() => {
        setIsLoading(false)
      })
  }
  const bodyContent = (
    <div className='flex flex-col gap-4'>
      <Heading
        title='Welcome to Travel World'
        subtitle='Create an account!'
      />
      <Input
        id='email'
        label='Email'
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id='name'
        label='Name'
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id='password'
        type='password'
        label='Password'
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
    </div>
  )

  const toogle = useCallback(() => {
    registerModal.onClose()
    loginModal.onOpen()
  }, [loginModal, registerModal])

  const footerContent = (
    <div className='flex flex-col gap-4 mt-3'>
      <div
        className='
        text-neutral-500
          text-center
          mt-4
          font-light'>
        <div
          className='
            justify-center 
            flex 
            flex-row 
            items-center 
            gap-2'>

          <div>
            Already have an account?
          </div>
          <div
            onClick={toogle}
            className='text-neutral-800 cursor-pointer hover:underline'>
            Login
          </div>
        </div>

      </div>
    </div>
  )

  return (
    <Modal
      disabled={isLoading}
      isOpen={registerModal.isOpen}
      title="Register"
      actionLabel='Continue'
      onClose={registerModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  )
}

export default RegisterModal