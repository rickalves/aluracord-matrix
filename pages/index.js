import { useState } from 'react';
import { useRouter } from 'next/router'
import Alert from '@mui/material/Alert';

import { Box, Button, Text, TextField, Image } from '@skynexui/components';
import appConfig from '../config.json';

function Titulo(props) {
  const Tag = props.tag || 'h1';
  return (
    <>
      <Tag>{props.children}</Tag>
      <style jsx>{`
            ${Tag} {
                color: ${appConfig.theme.colors.neutrals['000']};
                font-size: 24px;
                font-weight: 600;
            }
            `}</style>
    </>
  );
}

export default function PaginaInicial() {

  const [username, setUsername] = useState('')
  const [userError , setUserError] = useState("none")
  const router = useRouter()

  return (
    <>
      <Box
        styleSheet={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          // backgroundColor: appConfig.theme.colors.primary[500],
          backgroundImage: 'url(https://images5.alphacoders.com/672/thumb-1920-672012.jpg)',
          backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
        }}
      >
        <Box
          styleSheet={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: {
              xs: 'column',
              sm: 'row',
            },
            width: '100%', maxWidth: '600px',
            borderRadius: '20px 0px 20px 0', padding: '32px', margin: '16px',
            boxShadow: '0 2px 10px 5px #018E42',
            backgroundColor: appConfig.theme.colors.neutrals[700],
            opacity: '0.9'
          }}
        >
          {/* Formulário */}
          <Box
            as="form"
            onSubmit={function (e) {
              e.preventDefault()
              if(username){
                if(username.length > 0 && username.trim().length > 0)
                    router.push(`/chat?username=${username}`)
                else{
                  setUserError("flex")
                }
              }else{
                setUserError("flex")
              }
            }}

            styleSheet={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              width: { xs: '100%', sm: '50%' }, textAlign: 'center', marginBottom: '32px',
            }}
          >
            <Titulo tag="h2">Bem vindo de volta!</Titulo>
            <Text variant="body3" 
              styleSheet={{ marginBottom: '32px', color: appConfig.theme.colors.neutrals[300] }}>
              {appConfig.name}
            </Text>
            <TextField
              value={username}  
              onChange={(e) => {
                //Desafio proposto pelo Mario
                
                setUsername() //limpa o estado username
                const valor = e.target.value //armazena o valor em uma constante
                if(valor.length > 2 && valor.trim().length > 0){ //testa se quantidade de caracteres do user é maior que 2
                    setUsername(valor) //atribui o username
                }else
                    setUserError("none")
              }}
              fullWidth
              textFieldColors={{
                neutral: {
                  textColor: appConfig.theme.colors.neutrals[200],
                  mainColor: appConfig.theme.colors.neutrals[900],
                  mainColorHighlight: appConfig.theme.colors.primary[500],
                  backgroundColor: appConfig.theme.colors.neutrals[800],
                },
              }}
            />
            <Alert 
              severity="error"
              sx={{
                display: userError.toString(),
                border: '1px solid',
                color: 'red',
                height: '30px',
                padding: '0px 10px',
                alignItems: 'center',
                marginBottom: '5px',
                opacity: '0.9',
                fontWeight: '500',
              }}
            >
              Entre com um username válido!
            </Alert>
            <Button
              type='submit'
              label='Entrar'
              fullWidth
              buttonColors={{
                contrastColor: appConfig.theme.colors.neutrals["000"],
                mainColor: appConfig.theme.colors.primary[500],
                mainColorLight: appConfig.theme.colors.primary[400],
                mainColorStrong: appConfig.theme.colors.primary[600],
              }}
            />
          </Box>
          {/* Formulário */}


          {/* Photo Area */}
          <Box
            styleSheet={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              maxWidth: '200px',
              padding: '16px',
              backgroundColor: appConfig.theme.colors.neutrals[800],
              border: '1px solid',
              borderColor: appConfig.theme.colors.neutrals[999],
              borderRadius: '20px 0 20px 0',
              flex: 1,
              minHeight: '240px',
            }}
          >
            <Image
              styleSheet={{
                borderRadius: '50%',
                marginBottom: '16px',
              }}
              src={`https://github.com/${username}.png`}
            />
            <Text
              variant="body4"
              styleSheet={{
                color: appConfig.theme.colors.neutrals[200],
                backgroundColor: appConfig.theme.colors.neutrals[900],
                padding: '3px 10px',
                borderRadius: '1000px'
              }}
            >
              {username}
            </Text>
          </Box>
          {/* Photo Area */}
        </Box>
      </Box>
    </>
  );
}