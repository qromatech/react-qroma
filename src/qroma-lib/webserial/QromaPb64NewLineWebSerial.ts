import { Buffer } from 'buffer';
import { MessageType } from "@protobuf-ts/runtime";
import { useQromaWebSerial } from "./QromaWebSerial";
import { useEffect } from 'react';


// const qromaPb64NewLineWebSerialContext = {
//   rxBuffer: new Uint8Array(),
// };


// export interface IQromaPb64NewLineWebSerial<T> {
//   requestPort(): any
//   // startMonitoring(onUpdate: (update: T) => void): void
//   startMonitoring(): void
//   stopMonitoring(): void
// }


export const useQromaPb64NewLineWebSerial = <T extends object>(
  {messageType, onMessage, 
    onConnect, onDisconnect
  }: {
    messageType: MessageType<T>,
    onMessage: (message: T) => void,
    onConnect?: () => void,
    onDisconnect?: () => void,
  }
) => {

  console.log("useQromaPb64NewLineWebSerial");
  const qNavigator: any = window.navigator;
  const qSerial = qNavigator.serial;

  console.log(qSerial);
  if (!qSerial) {
    return null;
  }

  const _onConnect = () => {
    if (onConnect) {
      onConnect();
    }
  }

  const _onDisconnect = () => {
    if (onDisconnect) {
      onDisconnect();
    }
  }

  console.log("PREx USEEFFECT - LISTNERS");
  useEffect(() => {
    console.log("USEEFFECT - LISTNERS");
    qSerial.addEventListener("connect", _onConnect)
    qSerial.addEventListener("disconnect", _onDisconnect)
    return () => {
      qSerial.removeEventListener("connect", _onConnect)
      qSerial.removeEventListener("disconnect", _onDisconnect)
    }
  });
  console.log("POST USEEFFECT - LISTNERS");

  const startMonitoring = async () => {
    let rxBuffer = new Uint8Array();

    const setRxBuffer = (update: Uint8Array) => {
      rxBuffer = update;
    }

    const onData = (newData: Uint8Array) => {
      let currentRxBuffer = new Uint8Array([...rxBuffer, ...newData]);

      let firstNewLineIndex = 0;

      while (firstNewLineIndex !== -1) {

        let firstNewLineIndex = currentRxBuffer.findIndex(x => x === 10);

        if (firstNewLineIndex === -1) {
          setRxBuffer(currentRxBuffer);
          return;
        }

        if (firstNewLineIndex === 0) {
          currentRxBuffer = currentRxBuffer.slice(1, currentRxBuffer.length);
          continue;
        }

        try {
          const b64Bytes = currentRxBuffer.slice(0, firstNewLineIndex);
          currentRxBuffer = currentRxBuffer.slice(firstNewLineIndex, currentRxBuffer.length);

          const b64String = new TextDecoder().decode(b64Bytes);
          const messageBytes = Buffer.from(b64String, 'base64');
          const message = messageType.fromBinary(messageBytes);
  
          onMessage(message);
    
        } catch (e) {
          console.log("CAUGHT ERROR");
          console.log(e);
        }
      }
      setRxBuffer(currentRxBuffer);
    }
    qromaWebSerial.startMonitoring(onData);
  }

  console.log("CALLING useQromaWebSerial");
  const qromaWebSerial = useQromaWebSerial();

  return {
    requestPort: qromaWebSerial.requestPort,
    startMonitoring: startMonitoring,
    stopMonitoring: qromaWebSerial.stopMonitoring,
  };
}