import {useState,ChangeEvent} from 'react';
import Parse from 'parse';
import {styles} from './styles';
import InputField from './InputField';
import { isTypeOfExpression } from 'typescript';


// const Login: React.FC = () => {
function Login({cbkFn}:{cbkFn?:(u:any)=>void}) {
  const [usrNam,setUsrNam] = useState<string>(''),
        [psWrd,setPsWrd] = useState<string>(''),
        [statusMsg,setStatusMsg] = useState<string>('')

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const {name,value} = e.target;
    if (name=='usrNam') setUsrNam(value)
    if (name=='psWrd') setPsWrd(value)
  };


  // --- User Login ---
  async function logInUser() {
    if (!usrNam.length||!psWrd.length) {
      setStatusMsg('⚠️ Username and password are required.');
      return;
    }

    setStatusMsg('Attempting to log in...');
    try {
      const user = await Parse.User.logIn(usrNam, psWrd);
      setStatusMsg(`✅ Login successful! Welcome, ${user.get('username')}`);
      console.log('User logged in:', user);
      if (typeof cbkFn !== 'undefined') cbkFn(user)
    } catch (error) {
      if (error instanceof Parse.Error) {
        // Properly typed Parse error :
        if (error.code==Parse.Error.OBJECT_NOT_FOUND)
          setStatusMsg('❌ Please check that you username and password are correct.');
        else setStatusMsg(`❌ Login error: ${error.message}`);
        console.error('Login error code:', error.code);
        console.error('Login error message:', error.message);
      } else {
        // Fallback for unexpected error types
        setStatusMsg(`❌ Login error: Unknown error occurred`);
        console.error('Unexpected error:', error);
      }
    }
  } /* End of logInUser */


  return (
    <div style={styles.container}>
      {(statusMsg.length!=0) &&
      <div style={styles.status}>{statusMsg}</div>
      }
      <InputField fieldID={'usrNam'}
                  fieldIntro={'Enter username :'}
                  fieldVal={usrNam}
                  fieldChgCbkFn={handleChange}
                  disable={false}
                  globStyl={styles.formGroup}
                  lblStyl={styles.label}
                  inpStyl={styles.input} />
      <InputField fieldID={'psWrd'}
                  fieldIntro={'Enter password :'}
                  fieldVal={psWrd}
                  fieldChgCbkFn={handleChange}
                  disable={false}
                  globStyl={styles.formGroup}
                  lblStyl={styles.label}
                  inpStyl={styles.input}
                  hide={true} />
      <button onClick={logInUser}
              style={styles.loginButton} >
        Login
      </button>
    </div>
  )
} /* End of Login */


export default Login;