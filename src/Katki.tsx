import React, {useState,useEffect,ChangeEvent, FormEvent } from 'react';
import {styles} from './styles';
import Parse from 'parse';
import Login from './Login';
import DataForm from './DataForm';


function Katki({cnclFn=null}:{
  cnclFn?:(()=>void)|null
}) {
	const [user,setUser] = useState<Parse.User|null>(null),
				[ticFlag,setTicFlag] = useState<boolean>(false),
				[statusMsg,setStatusMsg] = useState<string>(''),
        cnclAtrb = 'bg-amber-600 text-lime-100 font-serif \
                    text-2xl font-normal m-3 px-2 py-3 \
                    border-2 border-yellow-800 rounded-lg'


  useEffect(() => {
    const currentUser = Parse.User.current();
		console.log('ticFlag = ',ticFlag)
		console.log('currentUser = ',currentUser)
    if (currentUser) setUser(currentUser)
    else setUser(null)
  }, [ticFlag]);

	return (
    <div style={styles.container}>
      {(user===null) &&
      <Login cbkFn={setUser} />
      }
      {(user!==null) &&
      <DataForm cbkFn={()=>{setTicFlag(!ticFlag)}} />
      }
      {(cnclFn!==null) &&
      <button onClick={cnclFn}
              className={cnclAtrb}>
                Cancel
      </button>
      }
    </div>
  ) 
} /* End of Katki */


export default Katki;