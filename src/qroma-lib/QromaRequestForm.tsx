import { Buffer } from 'buffer';
import { FieldInfo, MessageType } from "@protobuf-ts/runtime"
import React, { useState } from "react"
import { MessageInputComponent } from "./proto-components/message-builder/MessageInputComponent"
import { MessageDataViewerComponent } from './proto-components/message-data-viewer/MessageDataViewerComponent';


interface IQromaRequestFormProps<T extends object> {
  requestMessageType: MessageType<T>
}

export const QromaRequestForm = <T extends object>(props: IQromaRequestFormProps<T>) => {
  const m = props.requestMessageType;

  const [requestObject, setRequestObject] = useState(props.requestMessageType.create());
  const [requestObjectData, setRequestObjectData] = useState(
    props.requestMessageType.toJson(props.requestMessageType.create()));

  const [requestB64, setRequestB64] = useState("");

  // const [requestBytes, setRequestBytes] = useState(new Uint8Array());

  // const f0 = m.fields[0];
  // const draft = props.requestMessageType.fromJson({
  //   "name": "blah",
  // });
  // console.log("DRAFT");
  // console.log(draft);

  // console.log("REQUEST OBJECT");
  // console.log(requestObjectData);

  const onChange = (field: FieldInfo, newValue: any) => {
    console.log("REQUEST FORM CHANGE");
    console.log(newValue);

  //   console.log("New value!!! " + newValue);
  //   // console.log(field);

    const newRequestObjectData = JSON.parse(JSON.stringify(newValue));
  //   newRequestObjectData[field.name] = newValue;
    setRequestObjectData(newRequestObjectData);
  //   console.log(newRequestObjectData);

  //   // setRequestObjectData({
  //   //   ...requestObjectData,

  //   // })
  }

  const sendRequest = () => {
    console.log("SEND COMMAND");
    // console.log(props.requestMessageType.fromJson(requestObjectData));
    // console.log(requestObject);

    const requestObject = props.requestMessageType.fromJson(requestObjectData);
    const requestBytes = props.requestMessageType.toBinary(requestObject);
    console.log(requestBytes);
    // const messageB64 = Buffer.from(requestBytes, 'base64');
    const requestB64 = Buffer.from(requestBytes).toString('base64') + "\n";
    console.log(requestB64);
    console.log(requestB64.length);

    setRequestB64(requestB64);
    setRequestObject(requestObject);
  }
  
  return (
    <div>
      Qroma Request Form: {props.requestMessageType.typeName}

      {/* <MessageDetailsComponent */}
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