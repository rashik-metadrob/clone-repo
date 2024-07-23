import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react"
import PhotonElement from "./components/ElementPhoton"
import _ from "lodash"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { CONFIG_TEXT, PHOTON_EVENT_CODES, PUBLISH_ROLE, UNIQUE_BROWSER_UUID } from "../../../../utils/constants"
import { useSelector } from "react-redux"
import { addOtherPlayer, getOnMuteOtherChange, getOtherPlayers, removeOtherPlayer, setBeMutedTwoWayOtherPlayer, setOtherPlayer } from "../../../../redux/photonSlice"
import { socket } from "../../../../socket/socket"
import { userApi } from "../../../../api/user.api"
import { getStorageUserDetail } from "../../../../utils/storage"
import { getCanBeJoinMultiplePlayer, getIsMuteAll, getIsMuteAudio, getPlayerAvatar, getPlayerGender, getPlayerName } from "../../../../redux/modelSlice"
import { useAppDispatch } from "../../../../redux"
import { notification } from "antd"
import global from "../../../../redux/global"
import usePublishStoreRole from "../../../../hook/usePublishStoreRole"

let PEERS = {

}

const MultiplePlayerPhoton = forwardRef(({
    currentPosition,
    onSetUserIP = () => {},
    modelRef,
}, ref) => {
    const clientRef = useRef()
    const [isOpenRealTime, setIsOpenRealTime] = useState(false)
    const navigate = useNavigate()
    // const isUpdatePhotonClientRef = useRef(false)
    // const [isUpdatePhotonClient, setIsUpdatePhotonClient] = useState(isUpdatePhotonClientRef.current)
    const playerName = useSelector(getPlayerName)
    const playerGender = useSelector(getPlayerGender)
    const playerAvatar = useSelector(getPlayerAvatar)

    const dispatch = useAppDispatch()
    const currentUser = getStorageUserDetail()

    const {id: storeId} = useParams()
    const { publishRole } = usePublishStoreRole()
    const multiplayerRoomId = useRef(null)

    const canBeJoinMultiplePlayer = useSelector(getCanBeJoinMultiplePlayer)

    const otherPlayers = useSelector(getOtherPlayers)
    const otherPlayersRef = useRef(otherPlayers)
    const clientId = useMemo(() => {
        return UNIQUE_BROWSER_UUID;
    }, [])

    useImperativeHandle(ref, () => {
        return {
            // photonClient: isUpdatePhotonClient ? clientRef.current : null
            clientId: clientId,
            socket: isOpenRealTime ? socket : null,
            multiplayerRoomId: multiplayerRoomId
        };
    }, [isOpenRealTime, clientId]);

    const onChangeMutePlayer = useSelector(getOnMuteOtherChange)
    const localMediaStream = useRef()
    const shouldConnectSocket = useRef(true)
    const isMuteAudio = useSelector(getIsMuteAudio)
    const isMuteAll = useSelector(getIsMuteAll)

    // Mute 2 way cross socket
    useEffect(() => {
        if(!localMediaStream.current){
            return
        }
        for(let i = 0; i < otherPlayers.length; i++){
            if(otherPlayers[i].mute){
                if(PEERS[otherPlayers[i].socketId] && PEERS[otherPlayers[i].socketId].peerConnection && PEERS[otherPlayers[i].socketId].peerConnection.connected){
                    // Emit mute to target socket
                    if(socket.connected){
                        socket.emit("on-mute", otherPlayers[i].socketId, socket.id, true)
                    }
                }
            } else {
                if(PEERS[otherPlayers[i].socketId] && PEERS[otherPlayers[i].socketId].peerConnection && PEERS[otherPlayers[i].socketId].peerConnection.connected){
                    // Emit un-mute to target socket
                    if(socket.connected){
                        socket.emit("on-mute", otherPlayers[i].socketId, socket.id, false)
                    }
                }
            }
        }
    },[onChangeMutePlayer])

    const exitLiveMode = () => {
        // Mic not working if stop in here
        // // Stop current track
        // if(localMediaStream.current){
        //     localMediaStream.current.getTracks().forEach(function(track) {
        //         track.stop();
        //     });
        // }

        console.log('exitLiveMode')

        // Disconnect socket
        if(socket.connected){
            socket.disconnect()
            setIsOpenRealTime(false)
            shouldConnectSocket.current = true
        }

        unregisterSocketEvent()

        let keys = Object.keys(PEERS);

        keys.forEach(el => {
            removeClientVideoElementAndCanvas(el)
            try {
                if(PEERS[el].peerConnection){
                    // PEERS[el].peerConnection.removeStream(localMediaStream.current);
                    PEERS[el].peerConnection.destroy()
                }
            } catch (err) {
            }
        })

        PEERS = {}

        dispatch(setOtherPlayer([]))
    }

    useEffect(() => {
        return () => {
            if(localMediaStream.current){
                // eslint-disable-next-line react-hooks/exhaustive-deps
                localMediaStream.current.getTracks().forEach(function(track) {
                    track.stop();
                });
            }
            exitLiveMode()
        }
    }, [])

    useEffect(() => {
        handleMuteAudio()
    }, [isMuteAudio])

    const handleMuteAudio = () => {
        if(isMuteAudio){
            if(localMediaStream.current){
                localMediaStream.current.getTracks().forEach(function(track) {
                    track.enabled = false;
                });
            }
        } else {
            if(localMediaStream.current){
                localMediaStream.current.getTracks().forEach(function(track) {
                    track.enabled = true;
                });
            }
        }
    }

    const handleNewUserAccess = (data) => {
        if(data.clientId === clientId) {
            return
        }

        const isAdd = otherPlayersRef.current.findIndex(item => item.clientId === data?.clientId) === -1

        PEERS[data.socketId] = {};

        createClientMediaElements(data.socketId);

        if(isAdd) {
            dispatch(addOtherPlayer({
                ...data,
                mute: isMuteAll,
                beMuted: false,
            }))
        }
    }

    const handleUserLeft = (data) => {
        if(data.clientId === clientId) {
            return
        }

        removeClientVideoElementAndCanvas(data.socketId);

        try {
            console.log('handleUserLeft', PEERS, data.socketId)
            if(PEERS[data.socketId]){
                if(PEERS[data.socketId].peerConnection){
                    // PEERS[data.socketId].peerConnection.removeStream(localMediaStream.current)
                    PEERS[data.socketId].peerConnection.destroy()
                }
                delete PEERS[data.socketId]
            }
        } catch (err) {
            console.log('handleUserLeft err', err)
        }

        dispatch(removeOtherPlayer(data.clientId))
    }

    const handleInitUser = (data) => {

        if(otherPlayersRef.current?.length) {
            return
        }

        const initPlayer = Object.keys(data)
            .filter(key => key !== clientId)
            .map((key) => {
                return {
                    ...data[key],
                    // roomId: roomId,
                    clientId: key,
                    mute: isMuteAll,
                    beMuted: false,
                }
        })
        console.log("init player: ", initPlayer)

        if(initPlayer.length) {
            for(let i = 0; i < initPlayer.length; i++){
                PEERS[initPlayer[i].socketId] = {}
    
                let pc = createPeerConnection(initPlayer[i].socketId, true);
                PEERS[initPlayer[i].socketId].peerConnection = pc;
    
                createClientMediaElements(initPlayer[i].socketId);
            }

            dispatch(setOtherPlayer(initPlayer))
        }
    }

    const handleReceiveEvent = (data) => {
        if (data.clientId === clientId) {
            return
        }

        const newData = otherPlayersRef.current.map(item => {
            if (item.clientId === data?.clientId) {
                return data
            }
            return item;
        })

        dispatch(setOtherPlayer(newData))
    }

    const initMultiplayerHandle = useCallback(async () => {
        if(!localMediaStream.current){
            localMediaStream.current = await getMedia()
            handleMuteAudio()
        }

        socket.on('join-room-success', onJoinRoomSuccess)
        socket.on('init-users', handleInitUser)
        socket.on("new-user-connected", handleNewUserAccess)
        socket.on("user-left", handleUserLeft)
        socket.on("receive-event", handleReceiveEvent)
        socket.on("signal", handleSignal)
        socket.on("kicked", handleKicked)
        socket.on("room-full", handleRoomFull)
        socket.on("muted", handleBeMutedTwoWay)
        socket.on("user-in-active-session", handleUserInActiveSession)

        if(!socket.connected && canBeJoinMultiplePlayer && !isOpenRealTime){
            socket.connect()

            userApi.getUserIP().then(rs => {
                setIsOpenRealTime(true)
                onSetUserIP(rs)
                socket.emit("join-room", {
                    storeId: storeId,
                    clientId: clientId,
                    clientName: playerName || currentUser?.name,
                    gender: playerGender,
                    playerAvatar: playerAvatar,
                    role: publishRole ?? PUBLISH_ROLE.CUSTOMER,
                    position: [modelRef.current.position.x, modelRef.current.position.y, modelRef.current.position.z],
                    rotation: [modelRef.current.rotation.x, modelRef.current.rotation.y, modelRef.current.rotation.z],
                    action: "idle"
                })
            })
        }
    }, [canBeJoinMultiplePlayer, isOpenRealTime, playerName])

    useEffect(() => {
        initMultiplayerHandle()

        window.addEventListener('unload', () => {
            if (socket.connected) {
                socket.off("connect");
                unregisterSocketEvent()
                dispatch(setOtherPlayer([]))
                socket.disconnect()
                setIsOpenRealTime(false)
            }
        })

        return (() => {
            unregisterSocketEvent()
        })
    }, [initMultiplayerHandle, dispatch])

    const unregisterSocketEvent = () => {
        socket.off("new-user-connected", handleNewUserAccess)
        socket.off("user-left", handleUserLeft)
        socket.off("receive-event", handleReceiveEvent)
        socket.off("init-users", handleInitUser)
        socket.off("signal", handleSignal)
        socket.off("kicked", handleKicked)
        socket.off("room-full", handleRoomFull)
        socket.off("muted", handleBeMutedTwoWay)
        socket.off("user-in-active-session", handleUserInActiveSession)
        socket.off('join-room-success', onJoinRoomSuccess)
    }

    const onJoinRoomSuccess = (roomId) => {
        multiplayerRoomId.current = roomId
    }

    const handleUserInActiveSession = () => {
        notification.warning({
            message: CONFIG_TEXT.USER_IN_ACTIVE_SESSION,
        })

        navigate("/")
    }

    const handleBeMutedTwoWay = (from, muteValue) => {
        dispatch(setBeMutedTwoWayOtherPlayer({from: from, value: muteValue}))
    }

    const handleKicked = () => {
        notification.warning({
            message: CONFIG_TEXT.KICK_BY_ADMIN
        })

        window.isRequiredTracking = false;
        navigate('/')
    }

    const handleRoomFull = () => {
        notification.warning({
            message: CONFIG_TEXT.ROOM_FULL
        })

        navigate("/")
    }

    const handleSignal = (to, from, data) => {
        // to should be us
        if (to !== socket.id) {
          console.log("Socket IDs don't match");
        }
        
        // Look for the right simplepeer in our array
        let peer = PEERS[from];
        if (peer.peerConnection && !peer.peerConnection.destroying && !peer.peerConnection.destroyed) {
          peer.peerConnection.signal(data);
        } else {
          // Let's create it then, we won't be the "initiator"
          // let theirSocketId = from;
          PEERS[from] = {}
          let peerConnection = createPeerConnection(from, false);

          PEERS[from].peerConnection = peerConnection;
    
          // Tell the new simplepeer that signal
          peerConnection.signal(data);
        }
    }

    const createPeerConnection = (theirClientId, isInitiator = false) => {
        let options = { 
            initiator: isInitiator, 
            config: { 
                iceServers: [
                    {
                        "urls": "stun:stun.relay.metered.ca:80"
                    },
                    {
                        "urls": "turn:a.relay.metered.ca:80",
                        "username": "bbfc0e76ea973444e072ee14",
                        "credential": "JYM/JgbAw2zPGEzN"
                    },
                    {
                        "urls": "turn:a.relay.metered.ca:80?transport=tcp",
                        "username": "bbfc0e76ea973444e072ee14",
                        "credential": "JYM/JgbAw2zPGEzN"
                    },
                    {
                        "urls": "turn:a.relay.metered.ca:443",
                        "username": "bbfc0e76ea973444e072ee14",
                        "credential": "JYM/JgbAw2zPGEzN"
                    },
                    {
                        "urls": "turn:a.relay.metered.ca:443?transport=tcp",
                        "username": "bbfc0e76ea973444e072ee14",
                        "credential": "JYM/JgbAw2zPGEzN"
                    }
                ]
            }, 
            trickle: true
        }
        let peerConnection = new window.SimplePeer(options)
        // simplepeer generates signals which need to be sent across socket
        peerConnection.on("signal", (data) => {
            console.log('peer signal')
            socket.emit("signal", theirClientId, socket.id, data);
        });
      
        // When we have a connection, send our stream
        peerConnection.on("connect", () => {
            console.log('peer connect')
            // Let's give them our stream
            peerConnection.addStream(localMediaStream.current);
        });
      
        // Stream coming in to us
        peerConnection.on("stream", (stream) => {
            console.log('peer stream')
            updateClientMediaElements(theirClientId, stream);
        });
      
        peerConnection.on("close", () => {
            // Should probably remove from the array of simplepeers
            console.log('peer close')
        });
      
        peerConnection.on("error", (err) => {
            console.log('peer err', err, isInitiator)
        });
      
        return peerConnection;
    }

    function updateClientMediaElements(_id, stream) {

        try {
            let audioStream = new MediaStream([stream.getAudioTracks()[0]]);
            let audioEl = document.getElementById(_id + "_audio");
            audioEl.srcObject = audioStream;
        } catch (err) {
            console.log('updateClientMediaElements err', err)
        }
    }

    useEffect(() => {
        otherPlayersRef.current = otherPlayers

    }, [otherPlayers])

    function removeClientVideoElementAndCanvas(_id) {
        let videoEl = document.getElementById(_id + "_video");
        if (videoEl != null) {
            videoEl.remove();
        }

        let audioEl = document.getElementById(_id + "_audio");
        if (audioEl != null) {
            audioEl.remove();
        }
    }

    async function getMedia(_mediaConstraints = {audio: true, video: false}) {
        let stream = null;
        try {
          stream = await navigator.mediaDevices.getUserMedia(_mediaConstraints);
        } catch (err) {
          console.warn(err);
        }
      
        return stream;
    }

    function createClientMediaElements(_id) {
        // create audio element for client
        let audioEl = document.createElement("audio");
        audioEl.setAttribute("id", _id + "_audio");
        audioEl.controls = "controls";
        audioEl.hidden = true;
        audioEl.volume = 1;
        document.body.appendChild(audioEl);
      
        audioEl.addEventListener("loadeddata", () => {
          audioEl.play();
        });
    }

    return <>
        {
            otherPlayers && otherPlayers.map((playerInfo, index) => {
                return <PhotonElement
                    key={index}
                    playerId={playerInfo.clientId}
                    gender={playerInfo.gender}
                    playerAvatar={playerInfo?.playerAvatar}
                    role={playerInfo.role}
                    position={playerInfo.position}
                    rotation={playerInfo.rotation}
                    action={playerInfo.action}
                    name={playerInfo.clientName}
                    socketId={playerInfo.socketId}
                    currentPosition={currentPosition}
                />
            })
        }
    </>
})
export default React.memo(MultiplePlayerPhoton)