import { connect } from 'react-redux'
import { useEffectAsync } from 'reactHelper'

const SocketController = () => {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  const client = new WebSocket(`${protocol}//${"localhost"}:${10000}/driver`,'echo-protocol')

  const connectSocket = () => {
    function sendNumber() {
      if (client.readyState === client.OPEN) {
      }
      setTimeout(sendNumber, 5* 1000)
    }

    client.onerror = function() {
      console.log('Connection Error')
      setTimeout(SocketController, 5* 1000)
    }


    client.onopen = function() {
      console.log('WebSocket Client Connected')
        sendNumber()

    }

    client.onclose = function() {
        console.log('echo-protocol Client Closed')
    }

    client.onmessage = function(e) {

    }
  }

  useEffectAsync(async () => {
    connectSocket()

  }, [])

  return null
}

export default connect()(SocketController)