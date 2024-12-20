import Echo from 'laravel-echo';
import { axios } from '../lib/axios';

import Pusher from 'pusher-js';
window.Pusher = Pusher;

let echoInstance = null;

export function initializeEcho(token)
{
    if(!token) true;

    if(echoInstance){
        console.log("Echo already initialized")
        return echoInstance
    }

    echoInstance = new Echo({
        broadcaster: 'reverb',
        key: import.meta.env.VITE_REVERB_APP_KEY,
        authorizer: (channel, options) => {
            return {
                authorize: (socketId, callback) => {
                    axios.post('/api/broadcasting/auth', {
                        socket_id: socketId,
                        channel_name: channel.name
                    })
                    .then(response => {
                        callback(false, response.data);
                    })
                    .catch(error => {
                        callback(true, error);
                    });
                }
            };
        },
        wsHost: import.meta.env.VITE_REVERB_HOST,
        wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
        wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
        forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
        enabledTransports: ['ws', 'wss'],
    });

    console.log("Echo initialize successfully")
    return echoInstance
}

export function getEchoInstance()
{
    return echoInstance;
}

export function disconnectEcho()
{
    if(echoInstance)
    {
        echoInstance.disconnect();
        echoInstance = null
    }
    console.log("Echo disconnect")
}