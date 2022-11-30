import { UniqueId } from "../../helper/helperGetUniqueID";
import configuration from "./configs/configuration";
import { acceptFriendRequest, cancelFriendRequest, getFriendRequests, rejectFriendRequest } from "./friend/request";
import { getFriendBlockeds } from "./friend/blocked";
import getFriendAll from "./friend/all";
import unfriend from "./friend/unfriend";
import sendMessage from "./message/sendMessage";
import getMessages from "./message/getMessages";
// import disconnect from "./configs/disconnect";

import userSchema from "../../schema/user";
import serverSchema from "../../schema/server";
import channelSchema from "../../schema/channel";

import joinVoiceChannel from "./channel/join"
import leaveVoiceChannel from "./channel/leave"

import listServer from "./server/list"
import usersServer from "./server/users"

import infoUser from "./user/info"

// global.users = {};
// global.messages={};
// global.socketToRoom = {};

export default (io:any,con:any)=>{
    io.db = con;
    io.on("connection", (socket:any) => {
        socket.on("configuration", async (data:any) => {
            configuration(io, socket, data);
        })
        
        socket.on('disconnect', (data:any) => {
            // disconnect(io, socket, data);
        });

        socket.on("getFriendRequests", async (data:any)=>{
            getFriendRequests(io, socket, data)
        })

        socket.on("getFriendBlockeds", async (data:any)=>{
            getFriendBlockeds(io, socket, data)
        })

        socket.on("getFriendAll", async (data:any)=>{
            getFriendAll(io, socket, data)
        })

        socket.on("acceptFriendRequest", async (data:any)=>{
            acceptFriendRequest(io, socket, data)
        })

        socket.on("rejectFriendRequest", async (data:any)=>{
            rejectFriendRequest(io, socket, data)
        })

        socket.on("cancelFriendRequest", async (data:any)=>{
            cancelFriendRequest(io, socket, data)
        })

        socket.on("unfriend", async (data:any)=>{
            unfriend(io, socket, data)
        })

        socket.on("sendMessage",async (data:any)=>{
            sendMessage(io, socket, data)
        })
        
        socket.on("getMessages",async (data:any)=>{
            getMessages(io, socket, data)
        })

        socket.on("call video chat", async (user:any) => {
            let roomID = "webRTC-"+UniqueId()
            socket.join(roomID)
            try {
	        const rawSockets:any = await io.fetchSockets()
            const rcvSockets = rawSockets.filter((items:any) => items.handshake.auth.userId === user.receiver)
       
            if(rcvSockets.length===0) return

            rcvSockets.map((rcvSocket:any)=>{
                rcvSocket.emit('calling', { 
                    from: socket.id,
                    name:socket.handshake.auth.name,
                    id:socket.handshake.auth.userId,
                    chatType:user.chatType
                });

            })
            socket.emit("callStarted",{
                userID:rcvSockets[0].handshake.auth.userId,
                name:rcvSockets[0].handshake.auth.name,
                code:rcvSockets[0].handshake.auth.code
            })
            } catch (error) {
                console.error(error)
        
            }
        })
        
        socket.on("answerCall", async (data:any)=> {
            try {
                const rawSockets:any = await io.fetchSockets()
                
                if(!rawSockets) return
                const rcvID = rawSockets.find((items:any) => items.id === data.receiver)
                
                for(const [key,value] of rcvID.rooms.entries()){
                    if(value.includes("webRTC-")){
                        let roomID = value
                        
                        io.to(rcvID.id).emit('acceptedCall', {from:socket.id});
                        const usersInThisRoom:any = await io.in(roomID).fetchSockets()
                        const rawData = usersInThisRoom.map((items:any)=>{
                            return (items.id)
                            
                        })
                        if(!usersInThisRoom) return
                        socket.emit("all users", {users:rawData,chatType:data.chatType});
                        socket.join(roomID)
                        break;
                    }
                }
            } catch (error) {
                console.error(error)
        
            }
        })

        socket.on("rejectCall", async (data:any) =>{
            try {
                const rawSockets:any = await io.fetchSockets()
    
                const rcvID = rawSockets.find((items:any) => items.id === data.callerId)
                rcvID.forEach((sck:any) => {
                    sck.emit("rejectedCall")
                });
                
            } catch (error) {
                
            }
        })
        socket.on("callCancel",async (data:any) =>{
            try {
                const rawSockets:any = await io.fetchSockets()
                const rcvID = rawSockets.filter((items:any) => items.handshake.auth.userId === data.userID)
                rcvID.forEach((sck:any) => {
                    sck.emit("callCanceled")
                });
                
            } catch (error) {
                
            }
        })
        socket.on("sending signal", (payload:any) => {
            io.to(payload.receiver).emit('user joined', { signal: payload.signal, from: socket.id ,chatType:payload.chatType});
        });
        
        socket.on("returning signal", (payload:any) => {
            io.to(payload.receiver).emit('receiving returned signal', { signal: payload.signal, from: socket.id });
        });

        socket.on("hangupCall", async (payload:any) => {
            for(const [key,value] of socket.rooms.entries()){
                if(value.includes("webRTC-")){
                    let roomID = value
                    socket.leave(roomID)
                    try {

                    const usersInThisRoom:any = await io.in(roomID).fetchSockets()
                    if(usersInThisRoom.length<=0) {
                        io.in(roomID).socketsLeave(roomID) 
                        return
                    }
                    usersInThisRoom.map((item:any) => {
                        if(item.id !== socket.id){
                            if(usersInThisRoom.length<=1){
                                io.in(roomID).socketsLeave(roomID) 
                            }
                            io.to(item.id).emit('hangup', { from: socket.id });
                        }
                    })
                    const usersInThisRooms:any = await io.in(roomID).fetchSockets()
                } catch (error) {
                    console.error(error)
            
                }
                }
            }
        })

        socket.on('getServerList',async (data:any)=>{
            listServer(io, socket, data)
        })

        socket.on('getServerUsers',async (data:any)=>{
            usersServer(io, socket, data)
        })
        socket.on('getUserInfo',async(data:any)=>{
            infoUser(io, socket, data)
        })

        socket.on("joinVoiceChannel",async (data:any)=>{
            joinVoiceChannel(io, socket, data)
        })

        socket.on("hata",async (data:any)=>{
            console.error(data);
        })
        socket.on("channelSendingSignal",async (data:any) =>{
            const token = socket.handshake.auth.token
            if(!token) return
            try {
                const user:any = await userSchema.aggregate([
                    {$match:{
                        token:{"$in":[token]
                    }}
                }])
            
                if(!user) return
                const rawRoomName =`server-${data.serverID}-${data.channelID}`

                const server:any = await serverSchema.findById(data.serverID)
                io.to(rawRoomName).emit("userJoinedChannel",{
                    _id:user[0]._id,
                    username:user[0].username,
                    code:user[0].code,
                    serverID:data.serverID,
                    channelID:data.channelID,
                    signal:data.signal,
                    me:socket.handshake.auth.userId===user[0]._id ? null :data.signal,
                    first:data.first
                })
            }
            catch{

            }

        })

        socket.on("channelReturningSignal", async (data:any)=>{
            const token = socket.handshake.auth.token

            const user:any = await userSchema.aggregate([
                {$match:{
                    token:{"$in":[token]
                }}
            }])
        
            if(!user) return
	        let rawSockets =await io.fetchSockets()
	        const sockets = rawSockets.map((sockett:any)=>{
                if(sockett.handshake.auth.userId==data.userID){
                    sockett.emit("channelReturningSignalListener",{
                        _id:user[0]._id,
                        username:user[0].username,
                        code:user[0].code,
                        serverID:data.serverID,
                        channelID:data.channelID,
                        signal:data.signal,
                        me:socket.handshake.auth.userId===user[0]._id ? null :data.signal,
                        first:data.first
                    })
                }
            })
        })
        
        socket.on("leaveAllChannels",async (data:any)=>{
            leaveVoiceChannel(io, socket, data)

        })
        
    })

    io.on('reconnect',(data:any)=>{
        
    })
}