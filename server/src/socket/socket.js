const socketIO = require('socket.io');
const { DATA_HELPER } = require('../utils/hepler');
const userService = require('../services/user.service');

/**
 * roomId: {
 *  clientId: {
 * 
 *  }
 * }
 * 
 */
const player = {

}
/** 
 * ClientId: {
 *  roomId: uuid,
 *  socketId: uuid
 * } 
 * 
 * 
*/
const connectedPlayer = {

}
/** 
 [socketid] : [...list of room id]
 * 
 * 
*/
// Used for user manage room
const managerRooms = {

}

/**
 * [storeId]: [roomId]
 */
const roomsOfStore = {

}

const initSocket = (server) => {
    const io = socketIO(server);
    io.on('connection', function (socket) {
        socket.on('manager-room', (data) => {
            managerRooms[socket.id] = []
            managerRooms[socket.id] = data.ids

            handleEmitManagerRooms([socket.id])
        })

        /*
            {
                storeId: uuid,
                clientId: uuid of loginUser,
                clientName: client name,
                gender: string,
                playerAvatar: object,
                role: string,
                position: [0 ,0, 0],
                rotation: [0 ,0, 0],
                action: "idle"
            }
        */
        socket.on('join-room', async (data) => {
            const {
                perPersonInRoom,
                numofRooms
            } = await userService.getUserMultiplayerRoomInfo(data.storeId)
            console.log('perPersonInRoom', perPersonInRoom, numofRooms)
            const userRoomId = getRoomId(data.storeId, perPersonInRoom, numofRooms)
            data.roomId = userRoomId
            console.log(`join-room: ${data.storeId}`, data.roomId, data.clientId, roomsOfStore);
            if(!userRoomId){
                socket.emit("room-full", socket.id)
            } else {
                if(checkUserInActiveSession(data.clientId)){
                    socket.emit("user-in-active-session")
                } else {
                    socket.join(data.roomId)
                    let userData = {
                        socketId: socket.id,
                        clientName: data.clientName,
                        gender: data.gender,
                        playerAvatar: data.playerAvatar,
                        role: data.role,
                        position: data.position || [0, 0, 0],
                        rotation: data.rotation || [0, 0, 0],
                        action: data.action || "idle"
                    }
        
                    if(player[data.roomId]){
                        player[data.roomId][data.clientId] = userData;
                    } else {
                        player[data.roomId] = {};
                        player[data.roomId][data.clientId] = userData;
                    }
        
                    if(connectedPlayer[data.clientId]){
                        socket.emit("connect-in-new-device")
                    }
        
                    connectedPlayer[data.clientId] = {
                        roomId: data.roomId,
                        socketId: socket.id
                    };
        
                    // socket.to(data.roomId).emit("update-users", player[data.roomId])
        
                    socket.to(data.roomId).emit("new-user-connected", {clientId: data.clientId, ...userData})
                    socket.emit("init-users", player[data.roomId])
                    socket.emit("join-room-success", data.roomId)
        
                    handleEmitManagerRooms()
                }
            }
            
        })

        /*
            {
                roomId: uuid,
                clientId: uuid,
                socketId: uuid,
                gender: string,
                playerAvatar: object,
                role: string,
                clientName: client name,
                position: [0 ,0, 0],
                rotation: [0 ,0, 0],
                action: "idle"
            }
        */
        socket.on("move", (data) => {
            if(data?.roomId && data?.clientId && checkUserInRoom(data.roomId, data.clientId)){
                const userData = {
                    socketId: data.socketId,
                    clientName: data.clientName,
                    gender: data.gender,
                    playerAvatar: data.playerAvatar,
                    role: data.role,
                    position: data.position || [0, 0, 0],
                    rotation: data.rotation || [0, 0, 0],
                    action: data.action || "idle"
                }
    
                if(player[data.roomId]){
                    player[data.roomId][data.clientId] = userData;
                } else {
                    player[data.roomId] = {};
                    player[data.roomId][data.clientId] = userData;
                }
            }
        })

        const timeOutFollowPlayer = {};
        let itv = null
        const interval = () => {
            itv = setInterval(() => {
                for(const roomId of Object.keys(timeOutFollowPlayer)) {
                    for(const clientId of Object.keys(timeOutFollowPlayer[roomId])) {
                        const userData = timeOutFollowPlayer[roomId][clientId]
                        if(!userData.isSend) {
                            socket.to(roomId).emit("receive-event", {...userData, clientId: clientId })
                            timeOutFollowPlayer[roomId][clientId].isSend = true;   
                        }
                    }
                }
                for(const roomId of Object.keys(timeOutFollowPlayer)) {
                    timeOutFollowPlayer[roomId]
                    for(const clientId of Object.keys(timeOutFollowPlayer[roomId])) {
                        if(timeOutFollowPlayer[roomId][clientId].isSend) {
                            delete timeOutFollowPlayer[roomId][clientId]
                        }
                    }
                    if(!Object.keys(timeOutFollowPlayer[roomId]).length) {
                        delete timeOutFollowPlayer[roomId]
                    }
                }
            }, 15);
        }

        interval();

        socket.on("raise-event", (data) => {
            if(data?.roomId && data?.clientId && checkUserInRoom(data.roomId, data.clientId)){
                const userData = {
                    socketId: data.socketId,
                    clientName: data.clientName,
                    gender: data.gender,
                    playerAvatar: data.playerAvatar,
                    role: data.role,
                    position: data.position || [0, 0, 0],
                    rotation: data.rotation || [0, 0, 0],
                    action: data.action || "idle"
                }
    
                if(player[data.roomId]){
                    player[data.roomId][data.clientId] = userData;
                } else {
                    player[data.roomId] = {};
                    player[data.roomId][data.clientId] = userData;
                }

                if(timeOutFollowPlayer[data.roomId]) {
                    timeOutFollowPlayer[data.roomId][data.clientId] = {...userData, clientId: data.clientId, isSend: false }
                }
                else {
                    timeOutFollowPlayer[data.roomId] = {
                        [data.clientId]: {...userData, clientId: data.clientId, isSend: false }
                    }
                }
                // socket.to(data.roomId).emit("receive-event", {...userData, clientId: data.clientId })
            }
        })

        socket.on("signal", (to, from, data) => {
            let keys = Object.keys(connectedPlayer)
            let isToOnline = false;
            let isFromOnline = false;

            keys.forEach(el => {
                if(connectedPlayer[el].socketId === to){
                    isToOnline = true
                }
            })

            keys.forEach(el => {
                if(connectedPlayer[el].socketId === from){
                    isFromOnline = true
                }
            })

            if (isToOnline && isFromOnline) {
                io.to(to).emit("signal", to, from, data);
            } else {
                console.log("Peer not found!");
            }
        });

        socket.on("on-mute", (to, from, muteValue) => {
            socket.to(to).emit("muted", from, muteValue)
        })

        /*
            {
                roomId: uuid,
                socketId: uuid,
                clientId: uuid
            }
        */
        socket.on("leave-room", (data) => {
            socket.leave(data.roomId)

            if(player[data.roomId] && player[data.roomId][data.clientId]){
                delete player[data.roomId][clientId];
            }

            delete connectedPlayer[data.clientId];

            socket.to(data.roomId).emit("user-left", {clientId: data.clientId, socketId: socket.id})
        })

        socket.on("kick-users", ids => {
            ids.forEach(id => {
                socket.to(id).emit("kicked")
            })
        })
    
        socket.on('disconnect', () => {
            let keys = Object.keys(connectedPlayer)
            let clientId = ""

            keys.forEach(el => {
                if(connectedPlayer[el].socketId === socket.id){
                    clientId = el
                }
            })

            console.log(`Disconnect: ${socket.id}`, clientId);

            if(clientId){
                socket.leave(connectedPlayer[clientId].roomId)

                if(player[connectedPlayer[clientId].roomId] && player[connectedPlayer[clientId].roomId][clientId]){
                    delete player[connectedPlayer[clientId].roomId][clientId];
                }
                socket.to(connectedPlayer[clientId].roomId).emit("user-left", {clientId: clientId, socketId: socket.id})
    
                delete connectedPlayer[clientId];

                handleEmitManagerRooms()
            }

            if(managerRooms[socket.id]){
                delete managerRooms[socket.id]
            }
        });

        // setInterval(() => {
        //     let rooms = Object.keys(player)
        //     rooms.forEach(el => {
        //         if(Object.keys(player[el]).length > 1){
        //             socket.to(el).emit("update-users", player[el])
        //         }
        //     })
            
        // }, [50])

        const getRoomId = (storeId, perPersonInRoom, numofRooms) => {
            if(!roomsOfStore[storeId]) {
                roomsOfStore[storeId] = []
            }

            if(roomsOfStore[storeId].length > 0) {
                for(let i = 0; i < roomsOfStore[storeId].length; i++){
                    if(countTotalUsersInRoom(roomsOfStore[storeId][i]) < perPersonInRoom){
                        return roomsOfStore[storeId][i]
                    }
                }
            }

            if(roomsOfStore[storeId].length < numofRooms){
                const newRoomId = DATA_HELPER.uuidv4()

                roomsOfStore[storeId].push(newRoomId)

                return newRoomId
            }

            return null
        }

        const countTotalUsersInRoom = (roomId) => {
            if(!player[roomId]){
                return 0
            } else {
                let listPlayer = player[roomId];
                return Object.keys(listPlayer).length;
            }
        }

        const checkUserInRoom = (roomId, clientId) => {
            return player[roomId] && player[roomId][clientId];
        }

        const checkUserInActiveSession = (clientId) => {
            let check = false;
            Object.keys(player).forEach(room => {
                if(player[room][clientId]){
                    check = true;
                }
            })
            return check;
        }

        const handleEmitManagerRooms = (toIds = []) => {
            if(toIds.length == 0){
                toIds = Object.keys(managerRooms)
            }
            toIds.forEach(el => {
                const data = {}
                if(managerRooms[el] && managerRooms[el].length > 0){
                    managerRooms[el].forEach(key => {
                        data[key] = {}
                        data[key] = player[key] || {}
                    })
                }
                if(el !== socket.id){
                    socket.to(el).emit("update-rooms", data)
                } else {
                    socket.emit("update-rooms", data)
                }
            })
        }
    });
}

/*
    data join room = {
        roomId: string,
        clientId: string,
        customProperties: object,

    }

    roomInfo = {
        id: string,
        maxPlayers: number,
        
    }
*/

// const initSocketTest = (server) => {
//     const io = socketIO(server);
//     io.on('connection', function (socket) {
//         socket.on('join-or-create-room', (data) => {
//             if(!data.roomId) {
//                 return;
//             }

//             if(rooms[data.roomId]) {
//                 rooms[data.roomId] = {
//                     ...rooms[data.roomId],
//                     [data.clientId]: {
//                         customProperties: {
//                             ...data.customProperties
//                         }
//                     }
//                 }
//             }
//             else {
//                 rooms[data.roomId] = {

//                 }
//             }
//         })
//     });
// }

module.exports = {
    initSocket
}