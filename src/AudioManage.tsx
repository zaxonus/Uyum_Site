import {useState,useEffect,useRef} from 'react';
import Parse from 'parse';
import {SentenceShow} from './Sentence';
import AwsmBtn from './AwsmBtn';
import DeleteAudioButton from './DeleteAudioButton';


function AudioManage({recordID,sentence,updFn}:{
  recordID:string
  sentence:string
  updFn:()=>void
}) {
  const [isRecording,setIsRecording] = useState(false),
        [audioURL,setAudioURL] = useState<string|null>(null),
        [isPlaying,setIsPlaying] = useState(false),
        [hasAudio,setHasAudio] = useState(false),
        [audioCount,setAudioCount] = useState(0),
        [theRecord, setTheRecord] = useState<Parse.Object|null>(null),
        [theSentence,setTheSentence] = useState(sentence),
        [ticFlag,setTicFlag] = useState<boolean>(false)

  const mediaRecorderRef = useRef<MediaRecorder|null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const currentAudioRef = useRef<HTMLAudioElement|null>(null);
  const audioBlobRef = useRef<Blob|null>(null)


  useEffect(() => {
    async function fetchData() {
      // Inner try-catch is sufficient to handle all query-related errors
      try {
        const Uyum_Sentences = Parse.Object.extend('Uyum_Sentences');
        const query = new Parse.Query(Uyum_Sentences);
        //query.equalTo("objectId",recordID);
        const object = await query.get(recordID);

        //const object = await query.first();

        if (object) {
          setTheRecord(object)
          if (typeof object.get('audios') !== 'undefined') {
            setHasAudio(true)
            setAudioCount(object.get('audios').length)
          } else {
            setHasAudio(false)
            setAudioCount(0)
          }
        } else {
          console.log('No object found with objectId : ',recordID);
        }
      } catch (error) {
        // This catches network issues, invalid class names, permission errors, etc.
        console.error('Query failed:', error);
      }
    } /* End of fetchData */

    fetchData();
  }, [recordID,ticFlag]);


  function handleVoiceRecord() {
    if (!isRecording) {
      requestMicrophone();
    }
  } /* End of handleVoiceRecord */


  function requestMicrophone() {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(function (stream) {
        let options: MediaRecorderOptions = { mimeType: 'audio/wav' };
        if (!MediaRecorder.isTypeSupported('audio/wav')) {
          options = {};
        }

        const mediaRecorder = new MediaRecorder(stream, options);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = function (e) {
          if (e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };

        mediaRecorder.onstop = function () {
          const audioBlob = new Blob(audioChunksRef.current, {type:'audio/wav' });
          audioChunksRef.current = [];
          const url = window.URL.createObjectURL(audioBlob);

          // Create the Audio object once here, same role as window.currentAudio before
          currentAudioRef.current = new Audio(url);

          setAudioURL(url);
          setIsRecording(false);
          console.log('Recording saved! Size:', audioBlob.size, 'bytes');
          audioBlobRef.current = audioBlob;
        };

        mediaRecorder.start();
        setIsRecording(true);
        console.log('Recording started...');
      })
      .catch(function (error) {
        console.error('Microphone error:', error.name, error.message);
        alert('Microphone error: ' + error.name + ' - ' + error.message);
        setIsRecording(false);
      });
  } /* End of requestMicrophone */


  function handleStopRecord() {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  } /* End of handleStopRecord */


  function handlePlayVoice() {
    const audio = currentAudioRef.current;

    if (!audio) {
      alert('No recording to play. Please record first.');
      return;
    }

    if (audio.paused) {
      audio.play();
      setIsPlaying(true);

      audio.addEventListener('ended', function () {
        setIsPlaying(false);
      }, { once: true });
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  } /* End of handlePlayVoice */


  async function handleUploadAudio() {
    // if (!audioBlob) {
    if (!audioBlobRef.current) {
      alert('No recording to upload. Please record first.');
      return;
    }

    console.log('Uploading...');
    await loadToServer(audioBlobRef.current);
    updFn();
    setHasAudio(true);
  } /* End of handleUploadAudio */

  async function loadToServer(blob: Blob) {
    if (!theRecord) {
      alert('No record selected.');
      return;
    }

    const file = new Parse.File('recording.wav', blob, 'audio/wav');

    try {
      await file.save();
      console.log('File uploaded:', file.url());

      // theRecord.set('audio',file);
      theRecord.add('audios',file);
      await theRecord.save();

      console.log('Recording saved to database!');
    } catch (error) {
      console.error('Upload failed:', error);
    }
  } /* End of loadToServer */


  async function rmvAudio() {
    await Parse.Cloud.run('deleteAudioFile',{recordID});
  } /* End of rmvAudio */


  async function rmvFirstAudio() {
    await Parse.Cloud.run('deleteFirstAudioFile',{recordID});
  } /* End of rmvFirstAudio */


  async function rmvLastAudio() {
    await Parse.Cloud.run('deleteLastAudioFile',{recordID});
  } /* End of rmvLastAudio */


  async function rmvAllAudio() {
    await Parse.Cloud.run('deleteAllAudioFiles',{recordID});
  } /* End of rmvAllAudio */


/**
 * 
 *       <button onClick={handleRecordClick} disabled={isRecording}>
        <i style={{ color: isRecording ? '#F00' : '#333' }} className="fa-solid fa-microphone" />
      </button>

 * 
 */
  return (
    <div className='flex flex-col items-center bg-cyan-100 p-2 border-2'>
      <SentenceShow sentence={theSentence} />
      <div className='flex justify-around w-64 border-2 border-purple-500 \
                      m-1 p-1 rounded-lg'>
      <AwsmBtn clickFn={handleVoiceRecord} 
               btnShape='microphone'
               disable={isRecording}
               size='2x'
               color={isRecording?'red-500':undefined} />
      <AwsmBtn clickFn={handleStopRecord}
               btnShape='stop'
               disable={false}
               size='2x' />
      <AwsmBtn clickFn={handlePlayVoice}
               btnShape='circle-play'
               disable={false}
               size='2x'
               color={isPlaying?'yellow-300':undefined} />
      <AwsmBtn clickFn={handleUploadAudio}
               btnShape='cloud-arrow-up'
               disable={false}
               size='2x' />


      {/* <AwsmBtn clickFn={()=>{}}
               btnShape='user-tie'
               disable={false}
               size='2x' />
      <AwsmBtn clickFn={()=>{}}
               btnShape='shirt'
               disable={false}
               size='2x' />
      <AwsmBtn clickFn={()=>{}}
               btnShape='person'
               disable={false}
               size='2x' />
      <AwsmBtn clickFn={()=>{}}
               btnShape='hand-peace'
               disable={false}
               size='2x' />
      <AwsmBtn clickFn={()=>{}}
               btnShape='thumbs-up'
               disable={false}
               size='2x' /> */}



      {hasAudio &&
      <>
      <AwsmBtn clickFn={rmvFirstAudio}
               btnShape='trash-arrow-up'
               disable={false}
               color={'red-500'}
               size='2x' />
      <AwsmBtn clickFn={rmvLastAudio}
               btnShape='trash-arrow-up'
               disable={false}
               color={'green-500'}
               size='2x' />
      <AwsmBtn clickFn={rmvAllAudio}
               btnShape='trash-arrow-up'
               disable={false}
               color={'blue-500'}
               size='2x' />
      <DeleteAudioButton recordID={recordID}
                         onDeleted={()=> {
                          setTicFlag(!ticFlag)
                          updFn()
                        }}
                         needChoice={audioCount>1} />
      </>
      }
      {/* // <DeleteAudioButton clickFn={rmvAudio}
      //          btnShape='trash-arrow-up'
      //          disable={false}
      //          size='2x' /> */}
      </div>
      {/* {audioURL && <audio src={audioURL} controls />} */}
    </div>
  )
} /* End of AudioManage */


export default AudioManage;
