import { useState, useRef } from 'react';

function VoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  function handleRecordClick() {
    if (!isRecording) {
      requestMicrophone();
    }
  }

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
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          audioChunksRef.current = [];
          const url = window.URL.createObjectURL(audioBlob);
          setAudioURL(url);
          setIsRecording(false);
          console.log('Recording saved! Size:', audioBlob.size, 'bytes');
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
  }

  function handleStopClick() {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  }

  return (
    <div>
      <button onClick={handleRecordClick} disabled={isRecording}>
        <i style={{ color: isRecording ? '#F00' : '#333' }} className="fa-solid fa-microphone" />
      </button>

      <button onClick={handleStopClick} disabled={!isRecording}>
        <i className="fa-solid fa-stop" />
      </button>

      {audioURL && <audio src={audioURL} controls />}
    </div>
  );
} /* End of VoiceRecorder */

export default VoiceRecorder;