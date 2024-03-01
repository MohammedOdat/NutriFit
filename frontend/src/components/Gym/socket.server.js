import io from 'socket.io-client';

const socketInit = ({user_id, token,room})=>{
    return io(`http://localhost:8080/`, {
        extraHeaders:{
            user_id,
            token,
            room
        },
    })
}

export default socketInit