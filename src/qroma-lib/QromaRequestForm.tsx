import { Buffer } from 'buffer';
import { FieldInfo, MessageType } from "@protobuf-ts/runtime"
import React, { useState } from "react"
import { MessageInputComponent } from "./proto-components/message-builder/MessageInputComponent"
import { MessageDataViewerComponent } from './proto-components/message-data-viewer/MessageDataViewerComponent';
import { useQromaWebSerial } from './webserial/QromaWebSerial';


interface IQromaRequestFormProps<T extends object> {
  requestMessageType: MessageType<T>
}

export const QromaRequestForm = <T extends object>(props: IQromaRequestFormProps<T>) => {
  const m = props.requestMessageType;

  const [requestObject, setRequestObject] = useState(props.requestMessageType.create());
  const [requestObjectData, setRequestObjectData] = useState(
    props.requestMessageType.toJson(props.requestMessageType.create()));

  const [requestB64, setRequestB64] = useState("");

  const onChange = (_: FieldInfo, newValue: any) => {
    console.log("REQUEST FORM CHANGE");
    console.log(newValue);

    const newRequestObjectData = JSON.parse(JSON.stringify(newValue));
    setRequestObjectData(newRequestObjectData);
  }

  const qromaWebSerial = useQromaWebSerial();
  
  const sendRequest = async () => {
    console.log("SEND COMMAND");

    const requestObject = props.requestMessageType.fromJson(requestObjectData);
    const requestBytes = props.requestMessageType.toBinary(requestObject);
    console.log(requestBytes);
    const requestB64 = Buffer.from(requestBytes).toString('base64') + "\n";
    console.log(requestB64);
    console.log(requestB64.length);

    setRequestB64(requestB64);
    setRequestObject(requestObject);

    const port = await qromaWebSerial.requestPort();
    console.log(port);
    const writer = port.writable.getWriter();

    const encoder = new TextEncoder();
    const encoded = encoder.encode(requestB64);
    await writer.write(encoded);
    writer.releaseLock();
  }
  
  return (
    <div>
      Qroma Request Form: {props.requestMessageType.typeName}

      <MessageInputComponent
        requestMessageType={m}
        messageName="requestForm"
        typeName={m.typeName}
        fields={m.fields}
        onChange={onChange}
        key={m.typeName}
        />
      <button onClick={() => sendRequest() }>Send Request</button>
      <MessageDataViewerComponent
        messageType={props.requestMessageType}
        messageData={requestObject}
        />
      <div>
        {props.requestMessageType.toJsonString(props.requestMessageType.fromJson(requestObjectData))}
      </div>
      <div>
        {requestB64}
      </div>
    </div>
  )
}