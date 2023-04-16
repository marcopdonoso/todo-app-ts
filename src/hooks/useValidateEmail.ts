import { type AxiosError } from 'axios'
import { useId, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { axiosWithTokenValidateEmail } from '../api/axios'
import {
  type AxiosWithTokenValidateEmailOptions,
  type useValidateEmailResponse
} from '../interfaces/user.interface'

const OTP_KEY = 'todos-info-to-verify-email'
const APP_KEY = 'todos-info-to-use-app'

const useValidateEmail = (): useValidateEmailResponse => {
  const [code, setCode] = useState('')
  const [completed, setCompleted] = useState(false)
  const navigate = useNavigate()
  const toastSuccessId = useId()
  const toastErrorId = useId()

  const dataFromLocalStorage = JSON.parse(
    localStorage.getItem(OTP_KEY) as string
  )

  const dataToAxios: AxiosWithTokenValidateEmailOptions = {
    data: {
      userId: dataFromLocalStorage?.userId,
      otp: code,
      token: dataFromLocalStorage?.token
    }
  }

  const validateOPT = (): void => {
    axiosWithTokenValidateEmail('POST', 'auth/verifyEmail', dataToAxios)
      .then(response => {
        const { userId, userEmail, token, msg } = response.data
        const dataToLocalStorage = {
          userId,
          token,
          userEmail
        }
        localStorage.setItem(APP_KEY, JSON.stringify(dataToLocalStorage))
        localStorage.removeItem(OTP_KEY)
        toast.success(msg, {
          onClose: () => {
            navigate('/todos')
          },
          position: 'top-center',
          autoClose: 4000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'light',
          toastId: toastSuccessId
        })
      })
      .catch((error: AxiosError) => {
        const errorData = error.response?.data
        if (
          typeof errorData === 'object' &&
          errorData !== null &&
          'msg' in errorData
        ) {
          const errorMessageFromAxios = errorData.msg as string
          toast.error(errorMessageFromAxios, {
            position: 'top-center',
            autoClose: 4000,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: 'light',
            toastId: toastErrorId
          })
        }
      })
  }

  return { validateOPT, setCode, code, completed, setCompleted }
}

export default useValidateEmail