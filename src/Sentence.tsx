import AwsmBtn from './AwsmBtn';


const dspAtrbX = 'bg-amber-200 text-stone-950 \
                 font-serif text-2xl font-normal m-1 px-2 \
                 border-4 border-indigo-400 rounded-lg',
      coreAtrb = 'bg-amber-200 text-stone-950 \
                 font-serif text-2xl font-normal m-1 px-2 \
                 rounded-lg',
      dspAtrb = coreAtrb + ' border-4 border-indigo-400',
      hiliAtrb = coreAtrb + ' border-8 border-rose-500'


export function SentenceShow({sentence}:{sentence:string}) {
  return (
    <div className={'flex justify-center '+dspAtrb}>
      {sentence}
    </div>
  )
} /* End of SentenceShow */


export function SentenceUnit({
  sentence,engTrans,jpnTrans,audioURL,owner,
  playFn,playFlg,cbkFn,cntrib,mng=false,
  rmvFn,pivot,stPvFn,mvPvFn,ordrSts
}:{
  sentence:string
  engTrans:string|null
  jpnTrans:string|null
  // play:boolean
  audioURL:Parse.File|null
  owner:boolean
  playFn:(v:Parse.File)=>void
  playFlg:boolean
  cbkFn:()=>void
  cntrib:boolean
  mng?:boolean
  rmvFn?:(()=>void)|null
  pivot:Parse.Object|null
  stPvFn:()=>void
  mvPvFn:()=>void
  ordrSts:number
}) {
  const getDisplayAttrib = () => {
    if (mng&&pivot&&(ordrSts==0)) return hiliAtrb
    return dspAtrb
  } /* End of getDisplayAttrib */


  return (
    // <div className={dspAtrb}>
    <div className={getDisplayAttrib()}>
      {sentence}
      {engTrans &&
      <TransUnit translat={engTrans} />
      }
      {jpnTrans &&
      <TransUnit translat={jpnTrans} />
      }
      {!mng && (audioURL !== null) &&
      <span>
      &nbsp;&nbsp;
      <AwsmBtn clickFn={()=>playFn(audioURL!)}
               btnShape='circle-play'
               disable={false}
               size='1x'
               color={playFlg?'red-500':null} />
      </span>
      }
      {!mng && cntrib &&
      <span>
      &nbsp;&nbsp;
      <AwsmBtn clickFn={cbkFn}
               btnShape='microphone'
               disable={false}
               size='1x' />
      </span>
      }

      {mng &&
      <>
      {!pivot && owner &&
      <>
      <span>
      &nbsp;&nbsp;
      <AwsmBtn clickFn={cbkFn}
               btnShape='pen-to-square'
               disable={false}
               size='1x'
               type='reg' />
      </span>
      <span>
      &nbsp;&nbsp;
      <AwsmBtn clickFn={rmvFn?rmvFn:()=>{}}
               btnShape='trash-arrow-up'
               disable={false}
               size='1x' />
      </span>
      </>
      }
      {(!pivot||(ordrSts==0)) &&
      <span>
      &nbsp;&nbsp;
      <AwsmBtn clickFn={stPvFn}
               btnShape='up-down'
               disable={false}
               size='1x' />
      </span>
      }
      {pivot && (ordrSts<0) &&
      <span>
      &nbsp;&nbsp;
      <AwsmBtn clickFn={mvPvFn}
               btnShape='arrow-up'
               disable={false}
               size='1x' />
      </span>
      }
      {pivot && (ordrSts>0) &&
      <span>
      &nbsp;&nbsp;
      <AwsmBtn clickFn={mvPvFn}
               btnShape='arrow-down'
               disable={false}
               size='1x' />
      </span>
      }
      </>
      }
    </div>
  )
} /* End of SentenceUnit */


function TransUnit({translat}:{translat:string}) {
  const trsDspAtrb = 'bg-teal-100 text-violet-800 \
                      font-serif text-xl font-normal m-1 px-2 \
                      border-2 border-fuchsia-400 rounded-md',
        trsChunks = translat.split(/  +/)
  return (
    <>
    {trsChunks.map((e,i) => (
    <div key={i} className={trsDspAtrb}>
      {e}
    </div>
    ))}
    </>
  )
} /* End of TransUnit */
