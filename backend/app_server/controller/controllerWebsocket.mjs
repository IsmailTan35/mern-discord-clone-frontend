import {UniqueId} from "../helper/helperGetUniqueID.mjs";
import userSchema from "../schema/user.mjs";

const users = {};
let messages={};
const socketToRoom = {};

export default (io,con)=>{
    io.db = con;
    io.on("connection", (socket) => {
        // messages[socket.id]=[]
        
        // console.log(io.opts.app.ismail)
        // console.log(io.app.ismail)
        socket.on("configuration", async (data) => {
            var user = await userSchema.findOne({token:{"$in":[data.token]}})
            if(!user) return

            var ids =user._id.toString()
            socket.name =user.username
            socket.code =user.code
            socket.userId = ids
            console.log(user)
            const rawSockets =await io.fetchSockets()
            const sockets =rawSockets.filter(items => items.id !== socket.id)
            let onlineUsers =[]
            sockets.map(function(elem){
                console.log(elem)
                onlineUsers.push({
                        name:elem.name, 
                        code:elem.code,
                        id:elem.id,
                        userId:elem.userId
                    });
              })
            const datak ={
                id: socket.userId,
                name: socket.name,
                code: socket.code,
                messages:messages[socket.id],
                onlineUsers,
                users,
                socketToRoom
            }
            console.log(datak)
            socket.emit("data", datak);

            socket.broadcast.emit("user join", { 
                id: ids,
                name: socket.username,
                code: socket.name
            })

        })

        socket.on("send message",async user=>{
            let socketss =await io.fetchSockets()
            const userTo = socketss.filter(s=>s.userId==user.to)
            io.to(userTo.id).emit("messages",{from:socket.userId,to:user.to,message:user.message,read:false});
            io.to(socket.id).emit("messages",{from:socket.userId,to:user.to,message:user.message,read:false});

        })
        
        socket.on('disconnect', () => {
            const roomID = socketToRoom[socket.id];
            let room = users[roomID];
            if (room) {
                room = room.filter(id => id !== socket.id);
                users[roomID] = room;
            }
            socket.broadcast.emit("user left", { 
                id: socket.id,
                name: socket.name
            });

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