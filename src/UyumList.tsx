
import React,{useState,useEffect,useRef} from "react";
import Parse from "parse";
import {styles} from './styles';
import UKIcon from './assets/images/UKIcon.png';
import NipIcon from './assets/images/NipIcon.png';
// import AwsmBtn from './AwsmBtn';
import {SentenceUnit} from './Sentence';
import AudioManage from './AudioManage';
import ContributionGate from './ContributionGate';
import QRSquare from './components/QRSquare';
import DataForm from './DataForm';
import {FormData} from './types';
import Login from "./Login";
// import ParseObject from "parse/types/ParseObject";


function UyumList({mng=false}:{mng?:boolean}) {
  const [user,setUser] = useState<Parse.User|null>(null),
        [ticFlag,setTicFlag] = useState<boolean>(false),
        [ticData,setTicData] = useState<boolean>(false),
        [mustLogin,setMustLogin] = useState<boolean>(false),
        [contribute,setContribute] = useState<boolean>(false),
        [contribGate,setContribGate] = useState<boolean>(false),
        [dataArray,setDataArray] = useState<Parse.Object[]>([]),
        [pivot,setPivot] = useState<[Parse.Object,number]|null>(null),
        [engShow,setEngShow] = useState(false),
        [jpnShow,setJpnShow] = useState(false),
        [showQR,setShowQR] = useState(false),

        [listenMap,setListenMap] = useState<Map<string,[number,number]>>(new Map()),

        [isPlaying, setIsPlaying] = useState(false),
        audioRef = useRef<HTMLAudioElement | null>(null),
        [loading,setLoading] = useState(true),
        [voiceMng,setVoiceMng] = useState(false),
        [activRcd,setActivRcd] = useState<string|null>(null),
        [activContent,setActivContent] = useState<Parse.Object|null>(null),
        [error, setError] = useState<string|null>(null),
        iconSize = 60,
        pageURL = 'https://uyum.langaquis.org'


  useEffect(() => {
    const currentUser = Parse.User.current();
    if (currentUser) {
      setUser(currentUser)
      setContribute(true)
      if (mustLogin) setMustLogin(false)
    } else {
      setUser(null)
      setContribute(false)
      if (mng) setMustLogin(true)
    }
  }, [mng,ticFlag,user]);


  useEffect(() => {
    async function fetchData() {
      try {
        const Uyum_Sentences = Parse.Object.extend("Uyum_Sentences");
        const query = new Parse.Query(Uyum_Sentences);
        query.ascending("order");
        query.limit(256);

        const results = await query.find();
        setDataArray(results);
      } catch (err) {
        //setError(err.message);
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [ticData]);


  useEffect(() => {
    if (!dataArray.length) return
    dataArray.map((item) => {
      if (item.get('audios')) {
        console.log('++',item.get('sentence'),'++')
        const voices = item.get('audios')
        setListenMap(prevMap => {
          const tmpMap = new Map(prevMap),
                id=item.id!;

          if (!prevMap.has(id)) {
            tmpMap.set(id, [0, voices.length]);
          } else if (tmpMap.get(id)?.[1]!=voices.length) {
            tmpMap.set(id,[tmpMap.get(id)?.[0]!%voices.length,voices.length]);
          }

          return tmpMap;
        });
      }
    })
  }, [dataArray,ticData]);


  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;


  async function playServerAudio(audioFile: Parse.File) {
    if (voiceMng) setVoiceMng(false)

    try {
      if (!audioFile) {
        alert('No recording found for this record.');
        return;
      }

      const url = audioFile.url();

      // If already playing, pause instead.
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        setIsPlaying(false);
        return;
      }

      const audio = new Audio(url);
      audioRef.current = audio;

      audio.play();
      setIsPlaying(true);

      audio.addEventListener('ended', function () {
        setIsPlaying(false);
        setActivRcd(null);
      }, { once: true });

    } catch (error) {
      console.error('Playback failed:', error);
    }
  } /* End of playServerAudio */


  function swapLang(lng:string) {
    if (lng=='E') {
      if (engShow) {
        setEngShow(!engShow)
        return
      } else {
        setJpnShow(false)
        setEngShow(!engShow)
      }
    }

    if (lng=='J') {
      if (jpnShow) {
        setJpnShow(!jpnShow)
        return
      } else {
        setEngShow(false)
        setJpnShow(!jpnShow)
      }
    }
  } /* End of swapLang */


  const icnBdrClr = (flag:boolean) => {
    return flag?"border-rose-500":"border-blue-200"
  } /* End of icnBdrClr */


  const activateRecord = (rcdID:string) => {
    if (!mng) setVoiceMng(true)
    setActivRcd(rcdID)
  } /* End of activateRecord */


  const getListenVoice = (record:Parse.Object) => {
    if (!listenMap.has(record.id!)) return null

    const voices = record.get('audios')
    if (typeof voices === 'undefined') return null

    // console.log('getListenVoice: voices -> ',listenMap.get(record.id!)?.length)
    return voices[listenMap.get(record.id!)?.[0]!]
  } /* End of getListenVoice */


  function shiftListenVoice(rcdID:string) {
    setListenMap(prevMap => {
      const tmpMap = new Map(prevMap),
            [oldListenNbr,listenCount] = prevMap.get(rcdID)!,
            newListenNbr = (oldListenNbr+1)%listenCount;
      tmpMap.set(rcdID, [newListenNbr, listenCount]);
      return tmpMap;
    });
  } /* End of shiftListenVoice */


  async function rmvRecord(record:Parse.Object) {
    console.log('rmvRecord FUNCTION called !!',record.id)
    if (record.get('audios')) {
      const audioCount = record.get('audios').length
      // await Parse.Cloud.run('deleteAllAudioFiles',record.id!);
      await Parse.Cloud.run('deleteAllAudioFiles',{recordID:record.id!});
      console.log('Number of audio files removed : ',audioCount)
    }
    await record.destroy()
  } /* End of rmvRecord */


  // Handle logout
  /*const handleLogout = async (): Promise<void> => {
    try {
      await Parse.User.logOut();
      setStatus({
        type: 'success',
        message: 'Logged out successfully!'
      });
      // Optionally redirect or clear form
      // setFormData({ field_one: '', field_two: '', field_three: '' });
      setFormData({ sentence: '', engTrans: '', jpnTrans: '' });
      if (typeof cbkFn !== 'undefined') cbkFn()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setStatus({
        type: 'error',
        message: `Logout error: ${errorMessage}`
      });
    }
  } /* End of handleLogout */


  function getOrderStatus(record:Parse.Object) {
   if (!pivot) return 0
   if (record.get('order')<pivot[0].get('order')) return -1
   if (record.get('order')>pivot[0].get('order')) return 1
   /*(record.get('order')==pivot.get('order'))*/ return 0
  } /* End of getOrderStatus */


  function swapPivot(record:Parse.Object,rcdIdx:number) {
    if (!pivot) setPivot([record,rcdIdx])
    else setPivot(null)
  } /* End of swapPivot */


  async function movePivot(record:Parse.Object,rcdIdx:number) {
    // console.log("INDEX = ",rcdIdx)
    // console.log("PIVOT = ",pivot?.[1])
    if (Math.abs(rcdIdx-pivot?.[1]!)==1) {
      // We just need to swap.
      const tmpVal = record.get('order')
      record.set('order',pivot?.[0].get('order'))

      try {
        await record.save();
      } catch (error) {
        // Type guard for error
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      } finally {
        // setLoading(false);
      }

      pivot?.[0].set('order',tmpVal)

      try {
        await pivot?.[0].save();
      } catch (error) {
        // Type guard for error
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      } finally {
        // setLoading(false);
        setPivot(null);
        setTicData(!ticData);
      }

      return
    }

    if (rcdIdx==dataArray.length-1) {
      console.log("We want to put pivot at the end of the list.")
      const prevIdx = dataArray.length-2,
            prevOrder = dataArray[prevIdx].get('order'),
            tmpValNew = Math.floor((record.get('order')+prevOrder)/2),
            tmpValLast = record.get('order')

      record.set('order',tmpValNew)

      try {
        await record.save();
      } catch (error) {
        // Type guard for error
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      } finally {
        // setLoading(false);
      }

      pivot?.[0].set('order',tmpValLast)

      try {
        await pivot?.[0].save();
      } catch (error) {
        // Type guard for error
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      } finally {
        // setLoading(false);
        setPivot(null);
        setTicData(!ticData);
      }

      return
    }

    if (rcdIdx==0) {
      console.log("We want to put pivot at the start of the list.")
      const //prevIdx = dataArray.length-2,
            nextOrder = dataArray[1].get('order'),
            tmpValNew = Math.floor((record.get('order')+nextOrder)/2)//,
            //tmpValLast = record.get('order')
      pivot?.[0].set('order',record.get('order'));
      record.set('order',tmpValNew);
      await pivot?.[0].save();
      await record.save();
      setPivot(null);
      setTicData(!ticData);
      return;
    }

    console.log("All the other cases can be handled as follow.")
    let peerOrder,tmpValNew: number

    if (rcdIdx>pivot?.[1]!) {
      peerOrder = dataArray[rcdIdx+1].get('order');
    }　else { /* (rcdIdx<pivot?.[1]!) */
      peerOrder = dataArray[rcdIdx-1].get('order');
    }

    tmpValNew = Math.floor((record.get('order')+peerOrder)/2);
    pivot?.[0].set('order',tmpValNew);
    await pivot?.[0].save();
    setPivot(null);
    setTicData(!ticData);

    // console.log("This case is not yet handled by movePivot ....")
  } /* End of movePivot */

  if (mustLogin) return <Login cbkFn={setUser} />

  if (showQR)
    return (
      <div className="flex flex-col items-center justify-center h-screen"
           onClick={()=>setShowQR(!showQR)} >
        <QRSquare qrTxt={pageURL} />
      </div>
    )

  if (mng&&activRcd) {
    const dataBufr:FormData = {
      sentence: activContent?.get('sentence'),
      engTrans: activContent?.get('engTrans'),
      jpnTrans: activContent?.get('jpnTrans'),
      rcdID: activRcd
    }

    if ((typeof activContent?.get('formalFlag') !== 'undefined') &&
        activContent.get('formalFlag')) dataBufr.lngProtoc = 'Formal';
    if ((typeof activContent?.get('casualFlag') !== 'undefined') &&
        activContent.get('casualFlag')) dataBufr.lngProtoc = 'Casual';

    return (
      // <div className="flex flex-col items-center justify-center h-screen"
      //      onClick={()=>setShowQR(!showQR)} >
      <div>
        <DataForm cbkFn={()=>{/*setTicFlag(!ticFlag)*/}}
                  data={dataBufr} />
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center">
      {!contribGate &&
      <div className="flex flex-col items-center">
      <div className="flex items-center justify-center">
        <div className={"border-4 "+icnBdrClr(engShow)+" p-1"}>
          <button onClick={()=>swapLang('E')}>
            <img src={UKIcon} alt="UK Icon"
                 width={iconSize} height={iconSize} />
          </button>
        </div>
        <div className={"border-4 "+icnBdrClr(jpnShow)+" p-1 mx-5 my-3"}>
          <button onClick={()=>swapLang('J')}>
            <img src={NipIcon} alt="Nippo Icon"
                 width={iconSize} height={iconSize} />
          </button>
        </div>
        <div className='text-5xl'
             onClick={()=>setShowQR(!showQR)}>
          {dataArray.length}
        </div>
      </div>
      {dataArray.map((item,idx) => (
        <div key={item.id}>
        {(!voiceMng || (item.id!=activRcd)) &&
        <SentenceUnit sentence={item.get('sentence')}
                      engTrans={engShow?item.get('engTrans'):null}
                      jpnTrans={jpnShow?item.get('jpnTrans'):null}
                      audioURL={getListenVoice(item)}
                      playFn={(v:Parse.File)=>{
                        setActivRcd(item.id!)
                        shiftListenVoice(item.id!)
                        playServerAudio(v)
                      }}
                      playFlg={isPlaying&&(item.id==activRcd)}
                      cbkFn={()=>{
                        activateRecord(item.id!)
                        if (mng) setActivContent(item)
                      }}
                      cntrib={contribute}
                      mng={mng}
                      rmvFn={mng?()=>rmvRecord(item):null}
                      pivot={pivot?pivot[0]:null}
                      stPvFn={()=>swapPivot(item,idx)}
                      mvPvFn={()=>movePivot(item,idx)}
                      ordrSts={getOrderStatus(item)} />
        }
        {voiceMng && (item.id==activRcd) &&
        <AudioManage recordID={activRcd!}
                     sentence={item.get('sentence')}
                     updFn={()=>setTicData(!ticData)} />
        }
        </div>
      ))}
      <div>{pivot?.[0].id}</div>
      </div>
      }
      {!contribute && !contribGate &&
      <Contribution cbkFn={()=>setContribGate(true)} />
      }
      {contribGate &&
      <ContributionGate cbkFn={
                            (u) => {
                              setUser(u)
                              setContribute(true)
                              setContribGate(false)
                            }
                          }
                        cnclFn={()=>setContribGate(false)} />
      }
      {contribute &&
      <button
        className="m-5"
        onClick={async ()=> {
          await Parse.User.logOut()
          setContribute(false)
          setTicFlag(!ticFlag)
        }}
        style={styles.logoutButton}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#c82333';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#dc3545';
        }}
      >
        Logout
      </button>
      }
    </div>
  );
} /* End of UyumList */


function Contribution({cbkFn}:{cbkFn:()=>void}) {
  const dspAtrb = 'flex flex-col items-center bg-slate-600 text-sky-100 \
                   font-serif text-xl sm:text-2xl font-normal m-3 px-2 py-3 \
                   border-4 border-blue-400 rounded-2xl w-11/12 sm:w-1/2'

  return (
    <div className={dspAtrb}
         onClick={()=>cbkFn()} >
      <div>
        {contribIntro('TK')}
      </div>
      <div>
        {contribPrompt('TK')}
      </div>
    </div>
  )
} /* End of Contribution */


function contribIntro(lng:string) {
  if (lng=='TK')
    return "Eğer ana diliniz Türkçe ise, dil bilginizle katkıda bulunmak isteyebilirsiniz. Bazı cümleleri yüksek sesle okuyup kaydını yükleyebilirsiniz; böylece biz de dinleyip telaffuzumuzu geliştirebiliriz. Ayrıca, iletişim kurmak için yararlı olacağını düşündüğünüz ifadeler de ekleyebilirsiniz."
  return "If you are a native speaker of Turkish, you may want to contribute with your knowledge of the language. You can read some sentences loud voice and upload the recording, so we can then listen and improve our pronounciation. You may also want to add phrases you think would be useful to communicate."
} /* End of contribIntro */


function contribPrompt(lng:string) {
  if (lng=='TK')
    return "Kayıt olmak veya giriş yapmak istiyorsanız buraya dokunabilirsiniz."
  return "You can tap here if you want to signup or login."
} /* End of contribPrompt */


export default UyumList;