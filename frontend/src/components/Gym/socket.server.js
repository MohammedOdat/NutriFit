import io from 'socket.io-client';

const socketInit = ({user_id, token,room})=>{
    return io(`https://nutrifit-g0gn.onrender.com/`, {
        extraHeaders:{
            user_id,
            token,
            room
        },
    })
}

export default socketInit