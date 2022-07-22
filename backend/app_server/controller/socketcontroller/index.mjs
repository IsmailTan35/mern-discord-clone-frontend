import { UniqueId } from "../../helper/helperGetUniqueID.mjs";
import configuration from "./configs/configuration.mjs";
import { acceptFriendRequest, cancelFriendRequest, getFriendRequests, rejectFriendRequest } from "./friend/request.mjs";
import { getFriendBlockeds } from "./friend/blocked.mjs";
import { getFriendAll } from "./friend/all.mjs";
import unfriend from "./friend/unfriend.mjs";
import sendMessage from "./message/sendMessage.mjs";
import getMessages from "./message/getMessages.mjs";
import disconnect from "./configs/disconnect.mjs";
import userSchema from "../../schema/user.mjs";
import serverSchema from "../../schema/server.mjs";
import { ObjectId } from "mongodb";
import mongoose from 'mongoose';

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

        socket.on("sendMessage",async user=>{
            sendMessage(io,socket,user)
        })
        
        socket.on("getMessages",async user=>{
            getMessages(io,socket,user)

        })

        socket.on("call video chat", async user => {
            let roomID = "webRTC-"+UniqueId()
            socket.join(roomID)
	        const rawSockets = await io.fetchSockets()
            const rcvID = rawSockets.find(items => items.handshake.auth.userId === user.receiver)
            if(!rcvID) return
            io.to(rcvID.id).emit('calling', { from: socket.id,name:socket.handshake.auth.name });
        })
        
        socket.on("answerCall", async data=> {
            const rawSockets = await io.fetchSockets()
            
            if(!rawSockets) return
            const rcvID = rawSockets.find(items => items.id === data.receiver)

            for(const [key,value] of rcvID.rooms.entries()){
                if(value.includes("webRTC-")){
                    io.to(rcvID.id).emit('acceptedCall', {from:socket.id});
                    const usersInThisRoom = await io.in(value).fetchSockets()
                    const rawData = usersInThisRoom.map(items=>{
                        return (items.id)
                        
                    })
                    if(!usersInThisRoom) return
                    socket.emit("all users", rawData);
                    socket.join(value)
                    break;
                }
            }
        })

        socket.on("sending signal", payload => {
            io.to(payload.receiver).emit('user joined', { signal: payload.signal, from: socket.id });
        });
        
        socket.on("returning signal", payload => {
            io.to(payload.receiver).emit('receiving returned signal', { signal: payload.signal, from: socket.id });
        });

        socket.on("hangupCall", async payload => {
            for(const [key,value] of socket.rooms.entries()){
                if(value.includes("webRTC-")){
                    const usersInThisRoom = await io.in(value).fetchSockets()
                    if(usersInThisRoom.length<=0) return
                    usersInThisRoom.map(item => {
                        if(item.id !== socket.id){
                            io.to(item.id).emit('hangup', { from: socket.id });
                        }
                    })
                }
            }
        })

        socket.on('getServerList',async ()=>{
            const token = socket.handshake.auth.token
            if(!token) return
            const res = await userSchema.aggregate([
                {
                    $match:{  
                        token:{
                            $elemMatch:{
                                $eq:token
                            }
                        },
                    },
                },
                {
                    $lookup:{
                        from:"discordservers",
				        let:{req:"$servers"},
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $in:["$_id","$$req"],
                                    },
                                    
                                }
                            }
                        ],
                        as:"myservers"
                    }
                },
                {
                    $unwind:"$myservers"
                },
                {
                    $replaceRoot:{
                        newRoot:"$myservers"
                    }
                }
            ])
            socket.emit("serverList",res)
        })

        socket.on('getServerUsers',async (data)=>{
            const { serverId } = data
            const token = socket.handshake.auth.token
            if(!token) return
            console.log("first")
            const res = await userSchema.aggregate([
                {
                    $match:{
                        token:{
                            $elemMatch:{
                                $eq:token
                            }
                        },
                        servers:{
                            $elemMatch:{$eq:serverId}
                        }
                    },
                },
            ])
            const users = await serverSchema.aggregate([
                {
                    $match:{
                        _id:ObjectId(serverId)
                    }
                },
                {
                    $lookup:{
                        from:"discordusers",
                        let:{req:"$userIDs"},
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $in:["$_id","$$req"],
                                    },
                                }
                            }
                        ],
                        as:"users"
                    }
                },
                {
                    $unwind:"$users"
                },
                {
                    $replaceRoot:{
                        newRoot:"$users"
                    }
                },
                {
                    $project:{
                        _id:0,
                        id:"$_id",
                        name:"$username",
                        code:"$code"
                    }
                }

            ])
            // const usersInServer = users.filter(item=>item.servers.find(items=>items.toString()===serverId))
            socket.emit("serverUsers",users)
        })
    })

    io.on('reconnect',(data)=>{
        console.log("first")
    })
}