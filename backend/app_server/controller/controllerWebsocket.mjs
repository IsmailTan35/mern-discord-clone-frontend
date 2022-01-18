import {UniqueId,UniqueName} from "../helper/helperGetUniqueID.mjs";
const users = {};
let onlineUser=[];
let messages={};
const socketToRoom = {};

export default (io,con)=>{
    io.db = con;
    io.on("connection", (socket) => {
        socket.name =UniqueName()
        socket.code =UniqueId()
        messages[socket.id]=[]

        socket.emit("data", {
            id: socket.id,
            name: socket.name,
            code: socket.code,
            messages:messages[socket.id],
            onlineUser,
            users,
            socketToRoom
            });
        onlineUser.push({
            id: socket.id,
            name: socket.name,
            code: socket.code,
            })
        
        socket.broadcast.emit("user join", { 
            id: socket.id,
            name: socket.name,
            code: socket.code})
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
        
        socket.on("send message",user=>{
            messages[socket.id].push({from:socket.id,to:user.to,message:user.message})
            messages[user.to].push({from:user.to,to:socket.id,message:user.message})
            io.to(user.to).emit("messages",{from:socket.id,to:user.to,message:user.message});
            io.to(socket.id).emit("messages",{from:socket.id,to:user.to,message:user.message});

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

        socket.on("call video chat", user => {
            socket.roomID = UniqueId()
            if (users[socket.roomID]) {
                const length = users[socket.roomID].length;
                if (length === 4) {
                    socket.emit("room full");
                    return;
                }
                users[socket.roomID].push(socket.id);
            } else {
                users[socket.roomID] = [socket.id];
            }
            socketToRoom[socket.id] = socket.roomID;

            io.to(user.to).emit('calling', { from: socket.id,name:socket.name });
            console.log(socketToRoom)
            console.log(users)
        })
        
        socket.on("answerCall",data=> {
            console.log(data)
            const roomID = socketToRoom[data.from];
            users[roomID].push(socket.id);
            const usersInThisRoom = users[roomID].filter(id => id !== socket.id);
            socket.emit("all users", usersInThisRoom);
            console.log({ from: socket.id,name:socket.name })
            io.to(data.from).emit('acceptedCall', { from: socket.id,name:socket.name });
        })
    
    })
}