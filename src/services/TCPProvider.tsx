import {createContext, FC, useCallback, useContext, useState} from 'react';
import {useChunkStore} from '../db/chunkStore';
import TcpSocket from 'react-native-tcp-socket';
import DeviceInfo from 'react-native-device-info';
import {Buffer} from 'buffer';
import RNFS from 'react-native-fs';
import {Alert, Platform} from 'react-native';
import {v4 as uuidv4} from 'uuid';
import {produce} from 'immer';

interface TCPContextType {
  server: any;
  client: any;
  isConnected: boolean;
  connectedDevice: any;
  sendFiles: any;
  receviedFiles: any;
  totalSendBytes: number;
  totalReceviedBytes: number;
  startServer: (port: number) => void;
  connectToServer: (host: string, port: number, deviceName: string) => void;
  sendMessage: (message: string | Buffer) => void;
  sendFileAck: (file: any, type: 'file' | 'image') => void;
  disconnect: () => void;
}

const TCPContext = createContext<TCPContextType | undefined>(undefined);

export const useTCP = (): TCPContextType => {
  const context = useContext(TCPContext);
  if (!context) {
    throw new Error('useTCP must be use within a TCPProvider');
  }
  return context;
};

const options = {
  keystore: require('../../tls_cert/server-keystore.p12'),
};

export const TCPProvider: FC<{children: React.ReactNode}> = ({children}) => {
  const [server, setServer] = useState<any>(null);
  const [client, setClient] = useState<any>(null);
  const [isConnected, setIsConnected] = useState<any>(false);
  const [connectedDevice, setconnectedDevice] = useState<any>(null);
  const [serverSocket, setServerSocket] = useState<any>(null);
  const [sendFiles, setSendFiles] = useState<any>([]);
  const [receviedFiles, setReceviedFiles] = useState<any>([]);
  const [totalSendBytes, setTotalSendBytes] = useState<number>(0);
  const [totalReceviedBytes, setTotalReceviedBytes] = useState<number>(0);

  const {currentChunkSet, setCurrentChunkeSet, setChunkeStore} =
    useChunkStore();

  //start server

  const startServer = useCallback(
    (port: number) => {
      if (server) {
        console.log('server already running');
        return;
      }

      const newServer = TcpSocket.createTLSServer(options, socket => {
        console.log('Client Connected', socket.address());
        setServerSocket(socket);
        socket.setNoDelay(true);
        socket.readableHighWaterMark = 1024 * 1024 * 1;
        socket.writableHighWaterMark = 1024 * 1024 * 1;

        socket.on('data', async data => {
          const parseData = JSON.parse(data?.toString());
          if (parseData?.event === 'connect') {
            setIsConnected(true);
            setconnectedDevice(parseData?.deviceName);
          }
          if (parseData?.event === 'file_ack') {
            recevieFileAck(parseData?.file, socket, setReceviedFiles);
          }
        });
        socket.on('close', () => {
          console.log('Client Disconnected');
          setReceviedFiles([]);
          setSendFiles([]);
          setCurrentChunkeSet(null);
          setTotalReceviedBytes(0);
          setChunkeStore(null);
          setIsConnected(false);
          disconnect();
        });
        socket.on('error', err => console.error('Socket Error: ', err));
      });

      newServer.listen({port, host: '0.0.0.0'}, () => {
        const address = newServer.address();
        console.log(`server running on ${address?.address}:${address?.port}`);
      });

      newServer.on('error', err => console.error('Server Error', err));
      setServer(newServer);
    },
    [server],
  );

  const connectToServer = useCallback(
    (host: string, port: number, deviceName: string) => {
      const newClient = TcpSocket.connectTLS(
        {
          host,
          port,
          cert: true,
          ca: require('../../tls_cert/server-cert.pem'),
        },
        () => {
          setIsConnected(true);
          setconnectedDevice(deviceName);
          const myDeviceName = DeviceInfo.getDeviceNameSync();
          newClient.write(
            JSON.stringify({event: 'connect', deviceName: myDeviceName}),
          );
        },
      );
      newClient.setNoDelay(true);
      newClient.readableHighWaterMark = 1024 * 1024 * 1;
      newClient.writableHighWaterMark = 1024 * 1024 * 1;

      newClient.on('data', async data => {
        const parseData = JSON.parse(data?.toString());
      });
      newClient.on('close', () => {
        console.log('Connection Closed');
        setReceviedFiles([]);
        setSendFiles([]);
        setCurrentChunkeSet(null);
        setTotalReceviedBytes(0);
        setChunkeStore(null);
        setIsConnected(false);
        disconnect();
      });
      newClient.on('error', err => console.error('Client Error: ', err));
      setClient(newClient);
    },
    [client],
  );

  const disconnect = useCallback(() => {
    if (client) {
      client.destory();
    }
    if (server) {
      server.destory();
    }
    setReceviedFiles([]);
    setSendFiles([]);
    setCurrentChunkeSet(null);
    setTotalReceviedBytes(0);
    setChunkeStore(null);
    setIsConnected(false);
  }, [client, server]);

  const sendMessage = useCallback(
    (message: string | Buffer) => {
      if (client) {
        client.write(JSON.stringify(message));
        console.log('send from cleint: ', message);
      } else if (server) {
        serverSocket.write(JSON.stringify(message));
        console.log('send from server: ', message);
      } else {
        console.error('No client or server socket available');
      }
    },
    [client, server],
  );

  const sendFileAck = async (file: any, type: 'image' | 'file') => {
    if (currentChunkSet != null) {
      Alert.alert('wait for current file to be sent!');
      return;
    }
    const normalizePath =
      Platform.OS === 'ios' ? file?.uri?.replace('file://', '') : file?.uri;
    const fileData = await RNFS.readFile(normalizePath, 'base64');
    const buffer = Buffer.from(fileData, 'base64');
    const CHUNK_SIZE = 1024 * 8;
    let totalChunk = 0;
    let offset = 0;
    let chunkArray = [];

    while (offset < buffer.length) {
      const chunk = buffer.slice(offset, offset + CHUNK_SIZE);
      totalChunk += 1;
      chunkArray.push(chunk);
      offset += chunk.length;
    }

    const rawData = {
      id: uuidv4(),
      name: type === 'file' ? file?.name : file?.fileName,
      size: type === 'file' ? file?.size : file?.fileSize,
      mimeType: type === 'file' ? 'file' : '.jpg',
      totalChunk,
    };

    setCurrentChunkeSet({
      id: rawData?.id,
      chunkArray,
      totalChunk,
    });

    setSendFiles((prevData: any) => {
      produce(prevData, (draft: any) => {
        draft.push({...rawData, uri: file?.uri});
      });
    });

    const socket = client || serverSocket;
    if (!socket) {
      return;
    }
    try {
      console.log('File Acknowledge done');
      socket.write(JSON.stringify({event: 'file_ack', file: rawData}));
    } catch (error) {
      console.log('Error sending file: ', error);
    }
  };

  return (
    // eslint-disable-next-line react/react-in-jsx-scope
    <TCPContext.Provider
      value={{
        server,
        client,
        connectedDevice,
        sendFiles,
        receviedFiles,
        totalReceviedBytes,
        totalSendBytes,
        isConnected,
        startServer,
        connectToServer,
        disconnect,
        sendMessage,
        sendFileAck,
      }}>
      {children}
    </TCPContext.Provider>
  );
};
