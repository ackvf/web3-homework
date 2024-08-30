import { useCallback } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'

import { useFormState, useToggle } from '@/hooks'
import type { UserFormPayload } from '@/services/redis'
import UserService from '@/services/UserService'
import { Block } from '@/components'
import { Input } from '@/components/Atoms/Input'

// https://next-auth.js.org/getting-started/client#signin

export default function SignIn() {
  const { data: session } = useSession()

  const [formState, { onInputChange }, , refState] = useFormState<SignInFormState>(EMPTY_FORM_STATE)

  const [isLocked, , lock, unlock] = useToggle()

  const handleSubmit = useCallback(
    async (event: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
      event?.preventDefault()

      const formData = refState.current

      if (isLocked) return
      if (formData.email === '' || formData.password === '') return

      lock()

      try {
        const exists = await UserService.exists(formData)

        if (!exists) {
          alert("User doesn't exists")
          unlock()
          return
        }

        await signIn('email-password', {
          ...formData,
          redirect: false,
          callbackUrl: '/',
        })
      } catch (e: any) {
        alert(`Error: ${e.message}`)
      }
      unlock()
    },
    [isLocked, lock, unlock, refState],
  )

  if (session) {
    return (
      <main id='MainContentWrap' className='flex-grow pt-8'>
        <Block id='SignUpForm'>
          <div className='light:text-light-500 md:leading-2xl text-stone-500 md:text-2xl'>
            Signed in as {session.user?.email}
          </div>
          <div className='mt-8 flex flex-col gap-8'>
            <div className='flex flex-col gap-4 md:flex-row md:gap-8'>
              <button
                type='submit'
                className='mx-auto block h-14 w-60 cursor-pointer justify-center rounded-md border border-stone-600 bg-stone-200 px-4 text-stone-900 transition-colors duration-500 hover:bg-stone-400'
                onClick={() => signOut()}
              >
                <span className='text-base font-normal uppercase'>SIGN OUT</span>
              </button>
              {/* <Button disabled={isLocked || !isFormValid} loading={isLocked} label='Save' type='submit' fullWidth /> */}
            </div>
          </div>
        </Block>
      </main>
    )
  }

  return (
    <main id='MainContentWrap' className='flex-grow pt-8'>
      <Block id='SignUpForm'>
        <div className='light:text-light-500 md:leading-2xl text-stone-500 md:text-2xl'>
          Enter your details to log in
        </div>
        <form className='mt-8 flex flex-col gap-8' onSubmit={handleSubmit}>
          <Input<SignInFormState>
            label='Email'
            placeholder='e.g. "qwerty@exodus.com"'
            name='email'
            onChange={onInputChange}
            value={formState.email}
          />
          <Input<SignInFormState>
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
              <span className='text-base font-normal uppercase'>LOGIN</span>
            </button>
            {/* <Button disabled={isLocked || !isFormValid} loading={isLocked} label='Save' type='submit' fullWidth /> */}
          </div>
        </form>
      </Block>
    </main>
  )
}

interface SignInFormState extends Pick<UserFormPayload, 'email' | 'password'> {
  email: string
  password: string
}

const EMPTY_FORM_STATE: SignInFormState = {
  email: '',
  password: '',
}
