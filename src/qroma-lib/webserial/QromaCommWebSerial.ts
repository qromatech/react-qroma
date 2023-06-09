import { Buffer } from 'buffer';
import { useQromaWebSerial } from "./QromaWebSerial";
import { useEffect } from 'react';
import { QromaCommCommand, QromaCommResponse } from '../../qroma-comm-proto/qroma-comm';


// const qromaPb64NewLineWebSerialContext = {
//   rxBuffer: new Uint8Array(),
// };


// export interface IQromaPb64NewLineWebSerial<T> {
//   requestPort(): any
//   // startMonitoring(onUpdate: (update: T) => void): void
//   startMonitoring(): void
//   stopMonitoring(): void
// }


export const useQromaCommWebSerial = (  //  <T extends object>(
  { // onAppMessage,
    onQromaCommMessage,
    onConnect, onDisconnect
  }: {
    // messageType: MessageType<T>,
    onQromaCommMessage: (message: QromaCommResponse) => void,
    // onAppMessage: (message: T) => void,
    onConnect?: () => void,
    onDisconnect?: () => void,
  }
) => {

  if (!window) {
    throw Error("Not running in a browser");
  }

  console.log("useQromaCommWebSerial");
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
          console.log("RESPONSE: " + b64String);
          const messageBytes = Buffer.from(b64String, 'base64');
          // console.log(messageBytes);
          const response = QromaCommResponse.fromBinary(messageBytes);
  
          console.log(response);

          onQromaCommMessage(response);

          // onAppMessage(message);
    
        } catch (e) {
          // console.log("CAUGHT ERROR");
          // console.log(e);
        }
      }
      setRxBuffer(currentRxBuffer);
    }
    qromaWebSerial.startMonitoring(onData);
  }

  const sendQromaCommCommand = async (qcCommand: QromaCommCommand) => {

    const messageBytes = QromaCommCommand.toBinary(qcCommand);
    
    console.log(messageBytes);
    const requestB64 = Buffer.from(messageBytes).toString('base64') + "\n";
    console.log(requestB64);
    console.log(requestB64.length);

    const port = await qromaWebSerial.requestPort();
    console.log(port);
    const writer = port.writable.getWriter();

    const encoder = new TextEncoder();
    const encoded = encoder.encode(requestB64);
    await writer.write(encoded);
    writer.releaseLock();
  }

  const getFileData = async (filePath: string) => {
    const reportFileDataCommand: QromaCommCommand = {
      command: {
        oneofKind: 'fsCommand',
        fsCommand: {
          command: {
            oneofKind: 'reportFileDataCommand',
            reportFileDataCommand: {
              filename: filePath,
            }
          }
        }
      }
    };

    await sendQromaCommCommand(reportFileDataCommand);
  }

  console.log("CALLING useQromaWebSerial");
  const qromaWebSerial = useQromaWebSerial();

  return {
    requestPort: qromaWebSerial.requestPort,
    startMonitoring: startMonitoring,
    stopMonitoring: qromaWebSerial.stopMonitoring,
    getFileData,
  };
}