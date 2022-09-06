import { UniqueId } from "../../helper/helperGetUniqueID.mjs";
import configuration from "./configs/configuration.mjs";
import { acceptFriendRequest, cancelFriendRequest, getFriendRequests, rejectFriendRequest } from "./friend/request.mjs";
import { getFriendBlockeds } from "./friend/blocked.mjs";
import getFriendAll from "./friend/all.mjs";
import unfriend from "./friend/unfriend.mjs";
import sendMessage from "./message/sendMessage.mjs";
import getMessages from "./message/getMessages.mjs";
import disconnect from "./configs/disconnect.mjs";

import userSchema from "../../schema/user.mjs";
import serverSchema from "../../schema/server.mjs";
import channelSchema from "../../schema/channel.mjs";

import joinVoiceChannel from "./channel/join.mjs"
import leaveVoiceChannel from "./channel/leave.mjs"

import listServer from "./server/list.mjs"
import usersServer from "./server/users.mjs"

import infoUser from "./user/info.mjs"

global.users = {};
global.messages={};
global.socketToRoom = {};

export default (io,con)=>{
    io.db = con;
    io.on("connection", (socket) => {
        socket.on("configuration", async (data) => {
            configuration(io,socket,data);
        })
        
        socket.on('disconnect', (data) => {
            disconnect(io,socket,data);
        });

        socket.on("getFriendRequests", async (data)=>{
            getFriendRequests(io,socket,data)
        })

        socket.on("getFriendBlockeds", async (data)=>{
            getFriendBlockeds(io,socket,data)
        })

        socket.on("getFriendAll", async (data)=>{
            getFriendAll(io,socket,data)
        })

        socket.on("acceptFriendRequest", async (data)=>{
            acceptFriendRequest(io,socket,data)
        })

        socket.on("rejectFriendRequest", async (data)=>{
            rejectFriendRequest(io,socket,data)
        })

        socket.on("cancelFriendRequest", async (data)=>{
            cancelFriendRequest(io,socket,data)
        })

        socket.on("unfriend", async (data)=>{
            unfriend(io,socket,data)
        })

        socket.on("sendMessage",async data=>{
            sendMessage(io,socket,data)
        })
        
        socket.on("getMessages",async data=>{
            getMessages(io,socket,data)
        })

        socket.on("call video chat", async user => {
            let roomID = "webRTC-"+UniqueId()
            socket.join(roomID)
            try {
	        const rawSockets = await io.fetchSockets()
            const rcvSockets = rawSockets.filter(items => items.handshake.auth.userId === user.receiver)
       
            if(rcvSockets.length===0) return

            rcvSockets.map(rcvSocket=>{
                rcvSocket.emit('calling', { 
                    from: socket.id,
                    name:socket.handshake.auth.name,
                    id:socket.handshake.auth.userId,
                    chatType:user.chatType
                });

            })
            } catch (error) {
                console.error(error)
        
            }
        })
        
        socket.on("answerCall", async data=> {
            try {
                const rawSockets = await io.fetchSockets()
                
                if(!rawSockets) return
                const rcvID = rawSockets.find(items => items.id === data.receiver)
                
                for(const [key,value] of rcvID.rooms.entries()){
                    if(value.includes("webRTC-")){
                        let roomID = value
                        
                        io.to(rcvID.id).emit('acceptedCall', {from:socket.id});
                        const usersInThisRoom = await io.in(roomID).fetchSockets()
                        const rawData = usersInThisRoom.map(items=>{
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

        socket.on("sending signal", payload => {
            io.to(payload.receiver).emit('user joined', { signal: payload.signal, from: socket.id ,chatType:payload.chatType});
        });
        
        socket.on("returning signal", payload => {
            io.to(payload.receiver).emit('receiving returned signal', { signal: payload.signal, from: socket.id });
        });

        socket.on("hangupCall", async payload => {
            for(const [key,value] of socket.rooms.entries()){
                if(value.includes("webRTC-")){
                    let roomID = value
                    socket.leave(roomID)
                    try {

                    const usersInThisRoom = await io.in(roomID).fetchSockets()
                    if(usersInThisRoom.length<=0) {
                        io.in(roomID).socketsLeave(roomID) 
                        return
                    }
                    usersInThisRoom.map(item => {
                        if(item.id !== socket.id){
                            if(usersInThisRoom.length<=1){
                                io.in(roomID).socketsLeave(roomID) 
                            }
                            io.to(item.id).emit('hangup', { from: socket.id });
                        }
                    })
                    const usersInThisRooms = await io.in(roomID).fetchSockets()
                } catch (error) {
                    console.error(error)
            
                }
                }
            }
        })

        socket.on('getServerList',async (data)=>{
            listServer(io,socket,data)
        })

        socket.on('getServerUsers',async (data)=>{
            usersServer(io,socket,data)
        })
        socket.on('getUserInfo',async(data)=>{
            infoUser(io,socket,data)
        })

        socket.on("joinVoiceChannel",async data=>{
            joinVoiceChannel(io,socket,data)
        })

        socket.on("joinVoiceChannelReturnSignal",async data=>{
            
        })

        socket.on("channelSendingSignal",async data =>{
            const token = socket.handshake.auth.token
            if(!token) return
            try {
                const user = await userSchema.aggregate([
                    {$match:{
                        token:{"$in":[token]
                    }}
                }])
            
                if(!user) return
                const rawRoomName =`server-${data.serverID}-${data.channelID}`

                const server = await serverSchema.findById(data.serverID)
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

        socket.on("channelReturningSignal", async data=>{
            const token = socket.handshake.auth.token

            const user = await userSchema.aggregate([
                {$match:{
                    token:{"$in":[token]
                }}
            }])
        
            if(!user) return
	        let rawSockets =await io.fetchSockets()
	        const sockets = rawSockets.map(sockett=>{
                console.log(sockett.handshake.auth.userId==data.userID);
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
        
        socket.on("leaveAllChannels",async data=>{
            leaveVoiceChannel(io,socket,data)

        })
        
    })

    io.on('reconnect',(data)=>{
        
    })
}