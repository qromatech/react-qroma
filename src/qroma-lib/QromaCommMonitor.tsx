import React, { useState } from "react"
import { MessageType } from "@protobuf-ts/runtime";
import { useQromaPb64NewLineWebSerial } from "../qroma-lib/webserial/QromaPb64NewLineWebSerial";
import { MessageDataViewerComponent } from "../qroma-lib/proto-components/message-data-viewer/MessageDataViewerComponent";


interface IQromaCommMonitorProps<T extends object> {
  messageType: MessageType<T>
}

export const QromaCommMonitor = <T extends object>(props: IQromaCommMonitorProps<T>) => {
  
  // const [sValue, setSValue] = useState("NOT SET");
  const [messageData, setMessageData] = useState(props.messageType.create());

  const qromaPb64NewLineWebSerial = useQromaPb64NewLineWebSerial({
    messageType: props.messageType,
    onMessage(message: T) {
      // console.log("QromaCommMonitor");
      // console.log(message);
      // const messageStr = props.messageType.toJsonString(message);
      // setSValue(messageStr);
      setMessageData(message);
    },
  });

  if (qromaPb64NewLineWebSerial === null) {
    return (
      <>
      Serial not supported
      </>
    )
  }
  
  return (
    <div>
      Qroma comm monitor
      <button onClick={async () => {
        const port = await qromaPb64NewLineWebSerial.requestPort();
        console.log("PORT");
        console.log(port);
        qromaPb64NewLineWebSerial.startMonitoring();
      }}>
        Start monitor
      </button>
      <button onClick={() => {
        qromaPb64NewLineWebSerial.stopMonitoring();
      }}>
        Stop monitor
      </button>
      {/* <div>
        {sValue}
      </div> */}
      <MessageDataViewerComponent
        messageType={props.messageType}
        messageData={messageData}
        />
    </div>
  )
}