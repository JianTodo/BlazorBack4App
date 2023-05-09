'use strict';

const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
let pc;

var connect = function (cSharpObj) {
    (async () => {
        const constraints = {
            audio: false,
            video: true
        };

        let mediaStream = await navigator.mediaDevices.getUserMedia(constraints);

        window.stream = mediaStream;
        localVideo.srcObject = mediaStream;

        const ice = {
            "iceServers": [
                { "url": "stun:stun.l.google.com:19302" },
            ]
        };
        pc = new RTCPeerConnection(ice);
        pc.onicecandidate = e => {
            const message = {
                type: 'candidate',
                candidate: null,
            };
            if (e.candidate) {
                message.candidate = e.candidate.candidate;
                message.sdpMid = e.candidate.sdpMid;
                message.sdpMLineIndex = e.candidate.sdpMLineIndex;
            }
            // signaling.postMessage(message);
            cSharpObj.invokeMethodAsync('HandleCandidate', JSON.stringify(message));
        };

        pc.ontrack = e => {
            remoteVideo.srcObject = e.streams[0];
            console.log('測試', e);
        }
        // 將本地的視訊和音訊流添加到 PeerConnection 中
        stream.getTracks().forEach((track) => {
            pc.addTrack(track, stream);
        });
    })();
}

var getOffer = async function () {
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    return JSON.stringify(offer);
}

var getAnswer = async function (offer) {
    // console.log('T0');
    await pc.setRemoteDescription(JSON.parse(offer));
    // console.log('T1');
    const answer = await pc.createAnswer();
    // console.log('T2');
    await pc.setLocalDescription(answer);
    // console.log('T3');
    return JSON.stringify(answer);
}

var setAnswer = async function (answer) {
    await pc.setRemoteDescription(JSON.parse(answer));
}

var handleCandidate = async function (candidate) {
    if (!pc) {
        console.error('no peerconnection');
        return;
    }
    //await pc.addIceCandidate(JSON.parse(candidate));
    if (!candidate.candidate) {
        await pc.addIceCandidate(null);
    } else {
        await pc.addIceCandidate(candidate);
    }
}


export {
    connect,
    getOffer,
    getAnswer,
    setAnswer,
    handleCandidate
}