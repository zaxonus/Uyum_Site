import React, {useState,useEffect,ChangeEvent, FormEvent } from 'react';
import {styles} from './styles';
import Parse from 'parse';
import Login from './Login';
import DataForm from './DataForm';


function Katki() {
	const [user,setUser] = useState<Parse.User|null>(null),
				[ticFlag,setTicFlag] = useState<boolean>(false),
				[statusMsg,setStatusMsg] = useState<string>('')

  useEffect(() => {
    const currentUser = Parse.User.current();
		console.log('ticFlag = ',ticFlag)
		console.log('currentUser = ',currentUser)
    if (currentUser) setUser(currentUser)
    else setUser(null)
  }, [ticFlag]);

	return (
		// <div style={styles.container}>
		// 	<DataForm/>
    // </div>
    <div style={styles.container}>
      {(user===null) &&
      <Login cbkFn={setUser} />
      }
      {(user!==null) &&
      <DataForm cbkFn={()=>{setTicFlag(!ticFlag)}} />
      }
    </div>
  ) 
} export default Katki;