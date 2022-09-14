import { Server } from "socket.io";
import {createServer as httpCreate} from "http";
import {createServer as httpsCreate} from "https";
import * as fs from'fs';

const httpServer = (app,port) =>{
	const httpServer = httpCreate(app)
	httpServer.listen(port, () =>{
		console.info((new Date()) + 'Https server is listening on port ' + port);
	});
	return httpServer
}

const httpsServer = (app,port,credentials) =>{
	const httpsServer = httpsCreate(credentials,app)
	httpsServer.listen(port, () =>{
		console.info((new Date()) + 'Https server is listening on port ' + port);
	});
	return httpsServer
}

const webSocket = (httpServer) =>{
    const io = new Server(httpServer, { 
		cors: {
			origin: "*",
		  }
    });
    return io;
}

const CreateServer= (app,port) => {
	const checkPrivateKey = fs.existsSync('/root/projects/private.key')
	const checkCertificate = fs.existsSync('/root/projects/certificate.crt')
	const checkCa = fs.existsSync('/root/projects/ca_bundle.crt')
	
	if(checkPrivateKey && checkCertificate && checkCa){
		const privateKey = fs.readFileSync('/root/projects/private.key', 'utf8')
		const certificate = fs.readFileSync('/root/projects/certificate.crt', 'utf8')
		const ca = fs.readFileSync('/root/projects/ca_bundle.crt', 'utf8')
		
		const credentials = {
			key: privateKey,
			cert: certificate,
			ca: ca
		}
	
		return httpsServer(app,port,credentials)
	}
	else{

		return httpServer(app,port)
	}
}

export {
    httpServer,
    httpsServer,
    webSocket,
	CreateServer
}