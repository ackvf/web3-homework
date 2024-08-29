import { useCallback } from 'react'

import { useFormState, useToggle } from '@/hooks'
import { sleepResolve } from '@/utils'
import { Block } from '@/components'
import { Input } from '@/components/Atoms/Input'

export default function SignUp() {
  const [formState, { onInputChange }, , refState] = useFormState<SignUpFormState>(EMPTY_FORM_STATE)

  const [isLocked, , lock, unlock] = useToggle()

  const handleSubmit = useCallback(
    async (event: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
      event?.preventDefault()

      if (isLocked) return

      lock()
      try {
        console.debug('refState', refState)
        await sleepResolve(2000)
      } catch (e: any) {
        alert(`Error: ${e.message}`)
      }
      unlock()
    },
    [isLocked, lock, unlock, refState],
  )

  return (
    <main id='MainContentWrap' className='flex-grow pt-8'>
      <Block id='SignUpForm'>
        <div className='light:text-light-500 md:leading-2xl text-stone-500 md:text-2xl'>
          Enter your details to sign up
        </div>
        <form className='mt-8 flex flex-col gap-8' onSubmit={handleSubmit}>
          <Input<SignUpFormState>
            label='Name'
            placeholder='e.g. "John Doe"'
            name='name'
            onChange={onInputChange}
            value={formState.name}
            disabled
          />
          <Input<SignUpFormState>
            label='Email'
            placeholder='e.g. "qwerty@exodus.com"'
            name='email'
            onChange={onInputChange}
            value={formState.email}
          />
          <Input<SignUpFormState>
            label='Password'
            placeholder='password'
            name='password'
            type='password'
            onChange={onInputChange}
            value={formState.password}
          />
          <div className='flex flex-col gap-4 md:flex-row md:gap-8'>
            <button
              type='submit'
              className='mx-auto block h-14 w-60 cursor-pointer justify-center rounded-md border border-stone-600 bg-stone-200 px-4 text-stone-900 transition-colors duration-500 hover:bg-stone-400'
            >
              <span className='text-base font-normal uppercase'>REGISTER</span>
            </button>
            {/* <Button disabled={isLocked || !isFormValid} loading={isLocked} label='Save' type='submit' fullWidth /> */}
          </div>
        </form>
      </Block>
    </main>
  )
}

interface SignUpFormState {
  name: string
  email: string
  password: string
}

const EMPTY_FORM_STATE: SignUpFormState = {
  name: '',
  email: '',
  password: '',
}
