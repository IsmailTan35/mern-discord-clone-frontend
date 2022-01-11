

module.exports.listenUser=(ws,req)=>{
    console.log(ws.id)
    if(!req.app.onlineUsers.includes(ws)){
        req.app.onlineUsers.push(ws);
    }

    console.log(req.app.onlineUsers.length)

    ws.on('close', function close(code, reason) {
        var con =req.app.db
        var idx = req.app.onlineUsers.indexOf(ws);
        var info = req.app.onlineUsers[idx].info;
        switch (code) {
            case 1000:
                console.log('Normal closure, meaning that the purpose for which the connection was established has been fulfilled.');
                break;
            // case 1001:
            //     console.log('An endpoint is "going away", such as a server going down or a browser having navigated away from a page.');
            //     break;
            // case 1002:
            //     console.log('An endpoint is terminating the connection due to a protocol error.');
            //     break;
            // case 1003:
            //     console.log('An endpoint is terminating the connection because it has received a type of data it cannot accept (e.g., an endpoint that understands only text data MAY send this if it receives a binary message).');
            //     break;
            // case 1004:
            //     console.log('Reserved. The specific meaning might be defined in the future.');
            //     break;
            // case 1005:
            //     console.log('No status code was actually present.');
            //     break;
            // case 1006:
            //     console.log('The connection was closed abnormally, e.g., without sending or receiving a Close control frame');
            //     break;
            // case 1007:
            //     console.log('An endpoint is terminating the connection because it has received data within a message that was not consistent with the type of the message (e.g., non-UTF-8 [http://tools.ietf.org/html/rfc3629] data within a text message).');
            //     break;
            // case 1008:
            //     console.log('An endpoint is terminating the connection because it has received a message that \"violates its policy\". This reason is given either if there is no other sutible reason, or if there is a need to hide specific details about the policy.');
            //     break;
            // case 1009:
            //     console.log('An endpoint is terminating the connection because it has received a message that is too big for it to process.');
            //     break;
            // case 1010: // Note that this status code is not used by the server, because it can fail the WebSocket handshake instead.
            //     console.log('An endpoint (client) is terminating the connection because it has expected the server to negotiate one or more extension, but the server didn\'t return them in the response message of the WebSocket handshake. <br /> Specifically, the extensions that are needed are: ' + (reason || '').split(/[, ]/).filter(function (val) { return val.length > 0 }).join(', ') + '.');
            //     break;
            // case 1011:
            //     console.log('A server is terminating the connection because it encountered an unexpected condition that prevented it from fulfilling the request.');
            //     break;
            // case 1015:
            //     console.log('The connection was closed due to a failure to perform a TLS handshake (e.g., the server certificate can\'t be verified).');
            //     break;
            default:
                console.log('Unknown reason: ' + reason);
                break;
        }
        if (idx !== -1) {
            req.app.onlineUsers.splice(idx, 1);
          }
          console.log(req.app.onlineUsers.length)
    });
    ws.on('message', (msg) =>{
        
        msg=JSON.parse(msg)
        var idx = req.app.onlineUsers.indexOf(ws);
        req.app.onlineUsers[idx].info = msg
        console.log(req.app.onlineUsers[idx].info)
        var con =req.app.db
    })
    ws.on()
}