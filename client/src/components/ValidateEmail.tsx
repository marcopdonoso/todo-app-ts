import { Button } from 'antd'
import { useEffect } from 'react'
import { ToastContainer } from 'react-toastify'
import useValidateEmail from '../hooks/useValidateEmail'
import { SLink, SPinField } from '../styled-components/ValidateEmail'
import { SContainer, SPinFieldContainer } from '../styled-components/Wrappers'

const ValidateEmail: React.FC = () => {
  const { validateOPT, setCode, completed, setCompleted } = useValidateEmail()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Enter' && completed) {
        validateOPT()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [completed, validateOPT])

  return (
    <>
      <SContainer>
        <h1>Ingrese el código recibido</h1>
        <p>
          Por favor, ingrese el código que recibió en su correo electrónico para
          poder usar la app 😎.
        </p>
        <p>
          Recuerde que el código expira a los 60 minutos luego de ser recibido,
          si ya pasó ese tiempo, puede solicitar otro sin problema en el{' '}
          <SLink to='/login'>login</SLink>.
        </p>
        <SPinFieldContainer>
          <SPinField
            $completed={completed}
            length={4}
            onComplete={() => {
              setCompleted(true)
            }}
            onChange={(val) => {
              setCode(val)
              setCompleted(false)
            }}
            autoFocus
            validate='0123456789'
          />
        </SPinFieldContainer>
        <Button
          style={{ margin: '0 auto', marginTop: '1.5rem' }}
          type='primary'
          size='large'
          onClick={() => {
            validateOPT()
          }}
          disabled={!completed}
        >
          Validar e-mail
        </Button>
      </SContainer>
      <ToastContainer />
    </>
  )
}

export default ValidateEmail
