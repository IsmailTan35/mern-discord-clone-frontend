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
        
        socket.on("send message",user=>{
            messages[socket.id].push({from:socket.id,to:user.to,message:user.message,read:false})
            messages[user.to].push({from:user.to,to:socket.id,message:user.message,read:false})
            io.to(user.to).emit("messages",{from:socket.id,to:user.to,message:user.message,read:false});
            io.to(socket.id).emit("messages",{from:socket.id,to:user.to,message:user.message,read:false});

        })
        
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
                users[socket.roomID].push(socket.id);
            } else {
                users[socket.roomID] = [socket.id];
            }
            socketToRoom[socket.id] = socket.roomID;

            io.to(user.to).emit('calling', { from: socket.id,name:socket.name });
        })
        
        socket.on("answerCall",data=> {
            const roomID = socketToRoom[data.to];
            users[roomID].push(socket.id);
            const usersInThisRoom = users[roomID].filter(id => id !== socket.id);
            io.to(data.to).emit('acceptedCall', {from:socket.id});
            socket.emit("all users", usersInThisRoom);
            
        })

        socket.on("sending signal", payload => {
            io.to(payload.to).emit('user joined', { signal: payload.signal, from: socket.id });
        });
        
        socket.on("returning signal", payload => {
            io.to(payload.to).emit('receiving returned signal', { signal: payload.signal, from: socket.id });
        });
    })
}