Pending

1.  Account/Security
2.
3.
4.
5.
6.  IMP Video & Audio Call features

<!--
OutGoing Call

call --> open call model model

should see video of user him/her self
its should be ringing

-->

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

type Maybe<T> = T | null;
type RTC = RTCPeerConnection;

const SIGNALING_SERVER = "http://192.168.0.101:3000"; // your signaling server

export const useWebRTC = () => {
const socketRef = useRef<Socket | null>(null);
const pcRef = useRef<Maybe<RTC>>(null);
const localStreamRef = useRef<Maybe<MediaStream>>(null);
const [remoteStream, setRemoteStream] = useState<Maybe<MediaStream>>(null);
const [localStream, setLocalStream] = useState<Maybe<MediaStream>>(null);
const [inCall, setInCall] = useState(false);
const [mySocketId, setMySocketId] = useState<string | null>(null);

useEffect(() => {
socketRef.current = io(SIGNALING_SERVER);
socketRef.current.on("connect", () => {
setMySocketId(socketRef.current!.id);
});

    socketRef.current.on("incoming-call", async ({ offer, fromSocketId }) => {
      // create pc
      await createPeerConnection(fromSocketId, false);
      const pc = pcRef.current!;
      await pc.setRemoteDescription(offer);
      // create answer
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socketRef.current!.emit("answer-call", { toSocketId: fromSocketId, answer });
      setInCall(true);
    });

    socketRef.current.on("call-answered", async ({ answer }) => {
      if (!pcRef.current) return;
      await pcRef.current.setRemoteDescription(answer);
      setInCall(true);
    });

    socketRef.current.on("ice-candidate", async ({ candidate }) => {
      try {
        if (candidate && pcRef.current) {
          await pcRef.current.addIceCandidate(candidate);
        }
      } catch (e) {
        console.warn("Error adding remote ice candidate", e);
      }
    });

    socketRef.current.on("hangup", () => {
      endCall();
    });

    return () => {
      socketRef.current?.disconnect();
    };

}, []);

const getLocalMedia = async (opts: MediaStreamConstraints = { audio: true, video: true }) => {
const s = await navigator.mediaDevices.getUserMedia(opts);
localStreamRef.current = s;
setLocalStream(s);
return s;
};

const createPeerConnection = async (otherSocketId: string, isCaller: boolean) => {
// STUN/TURN servers config
const config: RTCConfiguration = {
iceServers: [
{ urls: "stun:stun.l.google.com:19302" },
// add TURN server here for production
],
};
const pc = new RTCPeerConnection(config);
pcRef.current = pc;

    // attach local tracks
    if (!localStreamRef.current) {
      try {
        await getLocalMedia();
      } catch (e) {
        console.error("getUserMedia failed", e);
        throw e;
      }
    }
    localStreamRef.current!.getTracks().forEach((track) => pc.addTrack(track, localStreamRef.current!));

    // remote stream
    const remote = new MediaStream();
    setRemoteStream(remote);
    pc.addEventListener("track", (event) => {
      // add all received tracks to remote stream
      event.streams[0]?.getTracks().forEach((t) => remote.addTrack(t));
    });

    // ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current?.emit("ice-candidate", { toSocketId: otherSocketId, candidate: event.candidate });
      }
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "disconnected" || pc.connectionState === "failed" || pc.connectionState === "closed") {
        endCall();
      }
    };

    return pc;

};

const callUser = async (toSocketId: string) => {
// create peer, get media, create offer
await createPeerConnection(toSocketId, true);
const pc = pcRef.current!;
const offer = await pc.createOffer();
await pc.setLocalDescription(offer);
socketRef.current!.emit("call-user", { toSocketId, offer: pc.localDescription, fromSocketId: mySocketId });
};

const endCall = () => {
// close pc, stop tracks
if (pcRef.current) {
try { pcRef.current.close(); } catch {}
pcRef.current = null;
}
if (localStreamRef.current) {
localStreamRef.current.getTracks().forEach((t) => t.stop());
localStreamRef.current = null;
setLocalStream(null);
}
setRemoteStream(null);
setInCall(false);
};

const toggleMic = () => {
localStreamRef.current?.getAudioTracks().forEach((t) => (t.enabled = !t.enabled));
};

const toggleCamera = () => {
localStreamRef.current?.getVideoTracks().forEach((t) => (t.enabled = !t.enabled));
};

return {
socketId: mySocketId,
socket: socketRef.current,
localStream,
remoteStream,
inCall,
getLocalMedia,
callUser,
endCall,
toggleMic,
toggleCamera,
};
};

// CallUI.tsx
import React, { useRef, useEffect } from "react";
import { useWebRTC } from "./hooks/useWebRTC";

const CallUI = ({ calleeSocketId }: { calleeSocketId: string }) => {
const {
socketId, localStream, remoteStream, callUser, endCall, getLocalMedia
} = useWebRTC();

const localRef = useRef<HTMLVideoElement | null>(null);
const remoteRef = useRef<HTMLVideoElement | null>(null);

useEffect(() => {
if (localRef.current && localStream) localRef.current.srcObject = localStream;
}, [localStream]);

useEffect(() => {
if (remoteRef.current && remoteStream) remoteRef.current.srcObject = remoteStream;
}, [remoteStream]);

return (

<div>
<div>
<video ref={localRef} autoPlay muted playsInline style={{ width: 120, height: 90 }} />
<video ref={remoteRef} autoPlay playsInline style={{ width: 320, height: 240 }} />
</div>
<div>
<button onClick={() => callUser(calleeSocketId)}>Call</button>
<button onClick={() => endCall()}>Hangup</button>
</div>
</div>
);
};

import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
cors: { origin: "\*" }
});

// Keep map of socketId -> userId if you need, or allow direct socket-to-socket by id.
io.on("connection", (socket) => {
console.log("socket connected", socket.id);

socket.on("call-user", ({ toSocketId, offer, fromSocketId, metadata }) => {
// forward offer to callee
io.to(toSocketId).emit("incoming-call", { offer, fromSocketId, metadata });
});

socket.on("answer-call", ({ toSocketId, answer }) => {
io.to(toSocketId).emit("call-answered", { answer });
});

socket.on("ice-candidate", ({ toSocketId, candidate }) => {
io.to(toSocketId).emit("ice-candidate", { candidate });
});

socket.on("hangup", ({ toSocketId }) => {
io.to(toSocketId).emit("hangup");
});

socket.on("disconnect", () => {
console.log("socket disconnected", socket.id);
});
});

const PORT = Number(process.env.PORT) || 3000;
server.listen(PORT, "0.0.0.0", () => console.log(`Server on ${PORT}`));
