import {Alert} from 'react-native';
import {useChunkStore} from '../db/chunkStore';
import {produce} from 'immer';
import {Buffer} from 'buffer';
// import Buffer from 'buffer';

export const recevieFileAck = async (
  data: any,
  socket: any,
  setReceviedFiles: any,
) => {
  const {setChunkeStore, chunkStore} = useChunkStore.getState();

  if (chunkStore) {
    Alert.alert('There are files which need to be revecied wait Bro!');
    return;
  }

  setReceviedFiles((prevData: any) => {
    produce(prevData, (draft: any) => {
      draft.push(data);
    });
  });

  setChunkeStore({
    id: data?.id,
    totalChunks: data?.totalChunks,
    name: data?.name,
    size: data?.size,
    memiType: data?.memiType,
    chunkArray: [],
  });

  if (!socket) {
    console.log('Socket not availabe');
    return;
  }

  try {
    await new Promise(resovle => setTimeout(resovle, 10));
    console.log('File Received');
    socket.write(JSON.stringify({event: 'send_chunk_ack', chunkNo: 0}));
    console.log('RQUESTED FOR FIRST CHUNKS');
  } catch (error) {
    console.log('Erro Sending File: ', error);
  }
};

export const sendChunkAck = async (
  chunkIndex: any,
  socket: any,
  setTotalSendBytes: any,
  setSentFiles: any,
) => {
  const {currentChunkSet, resetCurrentChunkeSet} = useChunkStore.getState();

  if (!currentChunkSet) {
    Alert.alert('There are no chucks to be send');
    return;
  }

  if (!socket) {
    console.error('Socket are not available');
    return;
  }

  const totalChunks = currentChunkSet?.totalChunk;

  try {
    await new Promise(resovle => setTimeout(resovle, 10));

    socket.write(
      JSON.stringify({
        event: 'recevied_chunk_ack',
        chunk: currentChunkSet?.chunkArray[chunkIndex].toString('base64'),
        chunkNo: chunkIndex,
      }),
    );
    setTotalSendBytes(
      (prev: number) => prev + currentChunkSet.chunkArray[chunkIndex]?.length,
    );

    if (chunkIndex + 2 > totalChunks) {
      console.log('All Chunks set successfully ');
      setSentFiles((prevFiles: any) => {
        produce(prevFiles, (draftFiles: any) => {
          const fileIndex = draftFiles?.findIndex(
            (f: any) => f.id === currentChunkSet.id,
          );
          if (fileIndex !== -1) {
            draftFiles[fileIndex].availabe = true;
          }
        });
      });
      resetCurrentChunkeSet();
    }
  } catch (error) {
    console.log('Error sending file: ' + error);
  }
};

export const receiveChunkAck = async (
  chunk: any,
  chunkNo: any,
  socket: any,
  setTotalReceviedBytes: any,
  generateFile: any,
) => {
  const {chunkStore, resetChunkeStore, setChunkeStore} =
    useChunkStore.getState();
  if (!chunkStore) {
    console.log('Chunk store is null');
    return;
  }
  try {
    const bufferChunk = Buffer.from(chunk, 'base64');
    const updateChunkArray = [...(chunkStore.chunkArray || [])];
    updateChunkArray[chunkNo] = bufferChunk;
    setChunkeStore({...chunkStore, chunkArray: updateChunkArray});
    setTotalReceviedBytes((prevValue: number) => {
      prevValue + bufferChunk.length;
    });
  } catch (error) {
    console.log('Error Updating chunk: ' + error);
  }
  if (!socket) {
    console.log('Socket not availabe');
    return;
  }

  if (chunkNo + 1 === chunkStore?.totalChunk) {
    console.log('All chunk Received ');
    generateFile();
    resetChunkeStore();
    return;
  }

  try {
    await new Promise(resolve => setTimeout(resolve, 10));
    console.log('REQUESTED FOR NEXT CHUNK', chunkNo + 1);
    socket.write(
      JSON.stringify({event: 'send_chunk_ack', chunkNo: chunkNo + 1}),
    );
  } catch (error) {
    console.log('Error Sending Files: ' + error);
  }
};
