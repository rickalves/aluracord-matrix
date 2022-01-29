import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import { React, useState, useEffect } from 'react';
import appConfig from '../config.json';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/router'
import { ButtonSendSticker } from '../src/components/ButtonSendSticker'


import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import CircularProgress from '@mui/material/CircularProgress';

export default function ChatPage() {
  
    // Sua lógica vai aqui
    const [message, setMessage] = useState('')
    const [progressVisibility, setProgressVisibility] = useState('hidden')
    const [enabledBtnSend, setEnabledBtnSend] = useState('hidden')
    const [messageList, setMessageList] = useState([])

    //pegando usuário logado
    const router = useRouter()
    const userLogin = router.query.username


    //supabase backend fetch
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzM0MDc2NCwiZXhwIjoxOTU4OTE2NzY0fQ.8FMeJ7rCjXAha-bQGVzdRey-WnX0nSTyL8-5XOr9t3E'
    const SUPABASE_URL = 'https://idplnfcysqunnzfpthpu.supabase.co'
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    

    useEffect(() => {
        //mostrando loading effect
        setProgressVisibility('visible')
        //listando mensagens
        supabase
        .from('messages')
        .select('*')
        .order('id', {ascending: false})
        .then((resp) => {
                //encerrando loading
                setProgressVisibility('hidden')
                setMessageList(resp.data)
        })
        
       // inserindo novas mensagens em realtime
        realTimeMessages((newMessage) => {
            setMessageList((nowList) => {
                return[
                    newMessage,
                    ...nowList
                ]
            })
        })

        // realTimeMessages(handleNewMessage)
    }, [])
    
    function realTimeMessages(setNewMessage){
        return(
            supabase
                .from('messages')
                .on('INSERT', (resp) => {
                    setNewMessage(resp.new)
                })
                .subscribe()
        );
    }

    function handleNewMessage(newMessage) {
        const message = {
            from: userLogin,
            text: newMessage,
        }

        supabase
            .from('messages')
            .insert([
                message
            ])
            .then(() => {
                setMessage('')
            })
        
    }

    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: appConfig.theme.colors.primary[500],
                backgroundImage: `url(https://mir-s3-cdn-cf.behance.net/project_modules/disp/b30b4d16704577.562b018908a7c.png)`,
                backgroundRepeat: 'repeat', backgroundSize: 'contain', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: '100%',
                    maxWidth: '95%',
                    maxHeight: '95vh',
                    padding: '32px',
                    opacity: '0.90',
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                        overflowY: 'scroll',
                    }}
                >
                    {/* Mostra barra de progresso de acordo com estado */}
                    <CircularProgress 
                        color="success"
                        sx={{
                            visibility:`${progressVisibility}`,
                            position: 'absolute',
                            top: '30%',
                            left: '45%',    
                        }}
                    />
                    {/* Mostra lista de mensagens */}
                    <MessageList messages={messageList} />
                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            placeholder="Insira sua mensagem aqui..."
                            value={message}
                            onChange={(e) => {
                                const valor = e.target.value
                                setMessage(valor)
                                if(valor.length >= 0 && valor.trim().length > 0)
                                    setEnabledBtnSend('visible')
                                else
                                    setEnabledBtnSend('hidden')
                                    
                            }}

                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                color: appConfig.theme.colors.neutrals[200],
                                marginTop: '8px',
                                paddingRight: '60px',
                            }}
                        />
                        {/* Botão de enviar stickers */}
                        <ButtonSendSticker 
                            onStickerClick={(sticker) => {
                               handleNewMessage(`:sticker:${sticker}`)
                            }} 
                        />
                        {/* Desafio do botão */}
                        <IconButton 
                            title='Enviar'
                            color="success"
                            sx={{
                                position: 'relative',
                                border: '1px solid',
                                width: '30px',
                                height: '30px',
                                marginLeft: '-75px',
                                ":hover":{
                                    backgroundColor: 'green',
                                    color: '#fff',
                                    border: 'none'
                                },
                                visibility: `${enabledBtnSend}`,
                                
                            }}
                        
                            onClick={(e) => {
                                    handleNewMessage(message)
                                    // e.preventDefault()
                                
                            }}
                            >
                                <SendIcon 
                                    sx={{
                                        height: '20px',
                                        width: '20px',
                                        marginLeft: '3px',
                                    }} 
                                />
                        </IconButton>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5'>
                    Chat
                </Text>
                <Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Logout'
                    href="/"
                />
            </Box>
        </>
    )
}

function MessageList(props) {

    return (

        <Box
            tag="ul"
            styleSheet={{
                // overflow: 'scroll',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >
            {props.messages.map(ms => {
                return (
                    <Text
                        key={ms.id}
                        value={ms.text}
                        tag="li"
                        styleSheet={{
                            borderRadius: '5px',
                            padding: '6px',
                            marginBottom: '7px',
                            hover: {
                                backgroundColor: appConfig.theme.colors.neutrals[700],
                            },
                            fontSize: '14px',
                        }}
                    >
                        <Box
                            styleSheet={{
                                marginBottom: '8px',
                            }}
                        >
                            <Image
                                styleSheet={{
                                    width: '35px',
                                    height: '35px',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    marginRight: '8px',
                                }}
                                src={`https://github.com/${ms.from}.png`}
                            />
                            <Text tag="strong">
                                {ms.from}
                            </Text>
                            <Text
                                styleSheet={{
                                    fontSize: '10px',
                                    marginLeft: '8px',
                                    color: appConfig.theme.colors.neutrals[300],
                                }}
                                tag="span"
                            >
                                {(new Date(ms.created_at).toLocaleString().slice(0, length - 3).replace(" ", ' - '))}
                            </Text>
                        </Box>
                        {ms.text.startsWith(':sticker:') 
                            ? (
                                <Image 
                                    src={ms.text.replace(':sticker:', '')} 
                                    styleSheet={{
                                        maxWidth: '160px',
                                        maxHeight: '160px',
                                    }}
                                />
                            ) 
                            : (
                                ms.text
                            )}
                        
                    </Text>
                )
            })}

        </Box>
    )
}