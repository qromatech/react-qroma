import { useEffect } from "react";


const qromaWebSerialContext = {
  initialized: false,
  port: null as any,
  monitorOn: false,
};


export interface IQromaWebSerial {
  requestPort(): any
  startMonitoring(onData: (data: Uint8Array) => void): void
  stopMonitoring(): void
  onData: (data: Uint8Array) => void
}

export const useQromaWebSerial = (): IQromaWebSerial => {

  const qNavigator: any = window.navigator;

  useEffect(() => {

    const initPort = async() => {
      if (qromaWebSerialContext.initialized) {
        return;
      }
    
      console.log("Requesting port");
 
      qromaWebSerialContext.initialized = true;
    }
    initPort();
  });

  const requestPort = async () => {
    try {
      if (qromaWebSerialContext.port) {
        return qromaWebSerialContext.port;
      }

      const port = await qNavigator.serial.requestPort();
      await port.open({baudRate: 115200});

      qromaWebSerialContext.port = port;

      return port;
    } catch (e: any) {
      console.log("requestPort() failed");
      console.log(e);
    }
  }

  const startMonitoring = async (onData: (data: Uint8Array) => void) => {
    console.log("START MONITORING: startMonitoring");

    const port = qromaWebSerialContext.port!;
    qromaWebSerialContext.monitorOn = true;

    console.log(qromaWebSerialContext);
    console.log(port);
    console.log(port.readable);
    
    while (port.readable && qromaWebSerialContext.monitorOn) {
      const reader = port.readable.getReader();

      try {
        const { value, done } = await reader.read();
        if (done) {
          // |reader| has been canceled.
          qromaWebSerialContext.monitorOn = false;
          console.log("READER CANCELED")
          break;
        }

        // console.log("VALUE")
        // console.log(value);
        onData(value);
      } catch (error) {
        // Handle |error|...
      } finally {
        reader.releaseLock();
      }
    }

    console.log("DONE MONITORING: startMonitoring");
  }

  const stopMonitoring = () => {
    qromaWebSerialContext.monitorOn = false;
  }

  return {
    requestPort,
    startMonitoring,
    stopMonitoring,
    onData: (x: Uint8Array) => { },
  };
}