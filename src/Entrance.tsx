import {useState,useEffect} from 'react';
import Login from './Login';
import UyumList from './UyumList';
import Katki from './Katki';
import LogoutBtn from './components/LogoutBtn';


function Entrance() {
  const [user,setUser] = useState<Parse.User|null>(null),
        [ticFlag,setTicFlag] = useState<boolean>(false),
        [voiceInput,setVoiceInput] = useState(false),
        [manageList,setManageList] = useState(false),
        [sentInput,setSentInput] = useState(false),
        dsplAtrb = 'bg-slate-800 text-sky-100 text-center \
                    font-serif text-2xl font-normal m-3 p-2 \
                    border-4 border-blue-400 rounded-2xl'


  useEffect(() => {
    const currentUser = Parse.User.current();
		console.log('ticFlag = ',ticFlag)
		console.log('currentUser = ',currentUser)
    if (currentUser) setUser(currentUser)
    else setUser(null)
  }, [ticFlag]);


  if (user===null) return <Login cbkFn={setUser} />

  return (
    <div className='flex flex-col items-center justify-around h-screen'>
      {!voiceInput && !manageList && !sentInput &&
      <>
      <div className={dsplAtrb}
           onClick={()=>setVoiceInput(true)} >
        Provide voice recording<br/>
        for existing sentences
      </div>
      <div className={dsplAtrb}
           onClick={()=>setManageList(true)} >
        Manage the list of<br/>
        existing sentences
      </div>
      <div className={dsplAtrb}
           onClick={()=>setSentInput(true)} >
        Create new sentences
      </div>
      </>
      }
      {voiceInput &&
      <UyumList cnclFn={()=>setVoiceInput(false)}
                inKey={true}/>
      }
      {manageList &&
      <UyumList mng={true}
                cnclFn={()=>setManageList(false)}
                inKey={true}/>
      }
      {sentInput &&
      <Katki cnclFn={()=>setSentInput(false)}/>
      }
      {!voiceInput && !manageList && !sentInput &&
      <LogoutBtn cbkFn={()=>setUser(null)}/>
      }
    </div>
  )
} /* End of Entrance */


export default Entrance;