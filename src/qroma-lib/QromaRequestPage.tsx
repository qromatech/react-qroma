// import { Buffer } from 'buffer';
import { IMessageType } from "@protobuf-ts/runtime"
import React from "react"
import { IUseQromaAppWebSerialInputs, useQromaAppWebSerial } from './webserial/QromaAppWebSerial';
import { QromaCommResponse } from '../qroma-comm-proto/qroma-comm';
import { QromaRequestForm } from "./QromaRequestForm";


interface IQromaRequestPageProps<TCommand extends object, TResponse extends object> {
  requestMessageType: IMessageType<TCommand>
  responseMessageType: IMessageType<TResponse>
}

export const QromaRequestPage = <TCommand extends object, TResponse extends object>(props: IQromaRequestPageProps<TCommand, TResponse>) => {

  // const [requestObject, _] = useState(props.requestMessageType.create());
  // const [requestObjectData, setRequestObjectData] = useState(
  //   props.requestMessageType.toJson(props.requestMessageType.create()));

  // const onChange = (_: FieldInfo, newValue: any) => {
  //   console.log("REQUEST FORM CHANGE");
  //   console.log(newValue);

  //   const newRequestObjectData = JSON.parse(JSON.stringify(newValue));
  //   setRequestObjectData(newRequestObjectData);
  // }

  
  const inputs: IUseQromaAppWebSerialInputs<TCommand, TResponse> = {
    onQromaAppResponse: (appMessage: TResponse) => {
      console.log("QromaRequestForm - onQromaAppResponse");
      console.log(appMessage);
    },
    onQromaCommResponse: (message: QromaCommResponse) => {
      console.log("QromaRequestForm - onQromaCommResponse");
      console.log(message);
    },
    commandMessageType: props.requestMessageType,
    responseMessageType: props.responseMessageType,
    onPortRequestResult: () => { console.log("PORT REQUEST COMPLETE") }
  }
  const qromaWebSerial = useQromaAppWebSerial(inputs);

  
  return (
    <div>
      Qroma Request Page: {props.requestMessageType.typeName}
      <button onClick={() => qromaWebSerial.startMonitoring() }>START MONITORING</button>

      <QromaRequestForm
        requestMessageType={props.requestMessageType}
        responseMessageType={props.responseMessageType}
        qromaWebSerial={qromaWebSerial}
        />
    </div>
  )
}
