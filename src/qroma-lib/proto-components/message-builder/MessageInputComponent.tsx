import React, { useState } from "react"
import { FieldInfo, IMessageType, MessageType } from "@protobuf-ts/runtime"
import { MessageAllFieldsInputComponent } from "./MessageAllFieldsInputComponent"
// import { MessageAllFieldsDetailsComponent } from "./MessageAllFieldsDetailsComponent";


interface IMessageInputComponentProps<T extends object> {
  // requestMessageType: MessageType<T>
  requestMessageType: IMessageType<T>
  messageName: string
  typeName: string
  fields: readonly FieldInfo[]
  onChange: <T>(field: FieldInfo, newValue: T) => void
}


export const MessageInputComponent = <T extends object>(props: IMessageInputComponentProps<T>) => {
  // const [isExpanded, setIsExpanded] = useState(false);

  // const ExpansionButton = () => {
  //   return <button onClick={() => setIsExpanded(!isExpanded)}>
  //     {isExpanded ? '-' : '+'}
  //   </button>
  // }

  // const subMessageOnChange = (subField: FieldInfo, newValue) => {
  //   console.log("MessageInputComponent CHANGE: " + subField.name);
  //   console.log(newValue);
  //   const subValue = {
  //     // subField.name: newValue,
  //   };
  //   subValue[subField.name] = newValue;
  //   // props.onChange(field, subValue);
  // };

  const [requestObjectData, setRequestObjectData] = useState(
    props.requestMessageType.toJson(props.requestMessageType.create()));


  const onMessageInputChange = (field: FieldInfo, newValue: any) => {
    console.log("onMessageInputChange - New value!!! ");
    console.log(field);
    console.log(newValue);

    const newRequestObjectData = JSON.parse(JSON.stringify(requestObjectData));
    console.log(requestObjectData);
    newRequestObjectData[field.name] = newValue;
    setRequestObjectData(newRequestObjectData);
    console.log(newRequestObjectData);

    props.onChange(field, newRequestObjectData);

    // setRequestObjectData({
    //   ...requestObjectData,

    // })
  }



  return (
    // <div>
    //   <ExpansionButton />{props.typeName}
    //   {isExpanded ? 
    //     <MessageAllFieldsDetailsComponent
    //       messageTypeName={props.typeName}
    //       fields={props.fields}
    //       /> : 
    //     null
    //   }
    // </div>
    <div>
      {props.messageName} [{props.typeName}]
      <MessageAllFieldsInputComponent
        messageTypeName={props.typeName}
        fields={props.fields}
        // onChange={props.onChange}
        // onChange={subMessageOnChange}
        onChange={onMessageInputChange}
        />
    </div>

  )
}