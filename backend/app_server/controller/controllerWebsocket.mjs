import {UniqueId,UniqueName} from "../helper/helperGetUniqueID.mjs";
const users = {};
let onlineUser=[];
const socketToRoom = {};

export default (io,con)=>{
    io.db = con;
    io.on("connection", (socket) => {
        socket.name =UniqueName()
        socket.code =UniqueId()

        socket.emit("data", {
            id: socket.id,
            name: socket.name,
            code: socket.code,
            onlineUser,
            users,
            socketToRoom
            });
        onlineUser.push({
            id: socket.id,
            name: socket.name
            })
        
        socket.broadcast.emit("user join", { 
            id: socket.id,
            name: socket.name})
        // console.log(io.opts.app.ismail)
        // console.log(io.app.ismail)
    
        socket.on("join room", roomID => {
            if (users[roomID]) {
                const length = users[roomID].length;
                if (length === 4) {
                    socket.emit("room full");
                    return;
                }
                users[roomID].push(socket.id);
            } else {
                users[roomID] = [socket.id];
            }
            socketToRoom[socket.id] = roomID;
            const usersInThisRoom = users[roomID].filter(id => id !== socket.id);
    
            socket.emit("all users", usersInThisRoom);
        });
        
        socket.on("send message",data=>{
            console.log(data)
        })
        socket.on("sending signal", payload => {
            io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
        });
    
        socket.on("returning signal", payload => {
            io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
        });
    
        socket.on('disconnect', () => {
            onlineUser=onlineUser.filter(items => items.id !== socket.id)
            const roomID = socketToRoom[socket.id];
            let room = users[roomID];
            if (room) {
                room = room.filter(id => id !== socket.id);
                users[roomID] = room;
            }
            socket.broadcast.emit("user left", { 
                id: socket.id,
                name: socket.name});
        });
    
    })
}