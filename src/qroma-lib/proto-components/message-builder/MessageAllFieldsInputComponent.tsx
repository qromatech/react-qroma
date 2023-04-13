import React from "react";
import { FieldInfo } from "@protobuf-ts/runtime";
import { MessageSingleFieldInputComponent } from "./MessageSingleFieldInputComponent";
// import { MessageSingleFieldDetailsComponent } from "./MessageSingleFieldDetailsComponent";
// import { MessageOneofDetailsComponent } from "./MessageOneofDetailsComponent";


interface OneofGroup {
  oneofFieldName: string
  oneofFields: FieldInfo[]
}

interface IMessageAllFieldsInputsComponentProps {
  messageTypeName: string
  fields: readonly FieldInfo[]
  onChange: <T>(field: FieldInfo, newValue: T) => void
}


export const MessageAllFieldsInputComponent = (props: IMessageAllFieldsInputsComponentProps) => {

  const fields = props.fields;
  
  const oneofFields = fields.filter(f => f.oneof);
  const oneofMap = new Map<string, FieldInfo[]>();

  for (var f of oneofFields) {
    const oneof = f.oneof!;
    if (oneofMap.has(oneof)) {
      oneofMap.get(oneof)!.push(f)
    } else {
      oneofMap.set(oneof, [f]);
    }
  }

  const oneofGroups = [] as OneofGroup[];
  for (let [k, v] of oneofMap) {
    console.log(k);
    oneofGroups.push({
      oneofFieldName: k,
      oneofFields: v,
    });
  }

  const nonOneofFields = fields.filter(f => !f.oneof);

  // const subMessageOnChange = (subField: FieldInfo, newValue) => {
  //   console.log("SUBMESSAGE CHANGE: " + subField.name);
  //   console.log(newValue);
  //   const subValue = {
  //     // subField.name: newValue,
  //   };
  //   subValue[subField.name] = newValue;
  //   props.onChange(field, subValue);
  // };

  return (
    <div>
      {/* MessageAllFieldsInputComponent */}
      <ul>
        {/* {
          oneofGroups.map(oog => (
            <MessageOneofDetailsComponent
              oneofName={oog.oneofFieldName}
              fields={oog.oneofFields}
              key={oog.oneofFieldName}
            />
          ))
        } */}
      </ul>

      <ul>
        {nonOneofFields.map(f => {
          // const subMessageOnChange = (subField: FieldInfo, newValue) => {
          //   console.log("SUBMESSAGE CHANGE: " + subField.name);
          //   console.log(newValue);
          //   const subValue = {
          //     // subField.name: newValue,
          //   };
          //   subValue[subField.name] = newValue;
          //   props.onChange(f, subValue);
          // };

          return (
            <MessageSingleFieldInputComponent
              field={f}
              // requestMessageType={f}
              onChange={props.onChange}
              // onChange={subMessageOnChange}
              key={f.name}
              />
          )
        }
        )}
      </ul>
    </div>
  )
}