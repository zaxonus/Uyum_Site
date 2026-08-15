import React, {useState,useEffect,ChangeEvent, FormEvent } from 'react';
import Parse from 'parse';
import {styles} from './styles';
import InputField from './InputField';
//import Login from './Login';

// Initialize Parse :
Parse.initialize("i3tzTVEHYEb1EjCo1cyNzHQNz3Ft0oyHX0gjmzD2",
		             "zkfZmh3TNVCZlBK2hRL3SOva8iBn4ezEUP8JSVg4");
Parse.serverURL = "https://parseapi.back4app.com/";

// Define interfaces for type safety
interface FormData {
  sentence: string;
  engTrans: string;
  jpnTrans: string;
}

interface Status {
  type: 'success' | 'error' | '';
  message: string;
}

// const DataForm: React.FC = ({cbkFn}:{cbkFn?:()=>void}) => {
function DataForm({cbkFn}:{cbkFn?:()=>void}) {
  const [formData, setFormData] = useState<FormData>({
    sentence: '',
    engTrans: '',
    jpnTrans: ''
  });
  
  const [status, setStatus] = useState<Status>({ 
    type: '', 
    message: '' 
  });
  
  const [user,setUser] = useState<Parse.User|null>(null),
        [loading,setLoading] = useState<boolean>(false),
        [statusMsg,setStatusMsg] = useState<string>('')

  useEffect(() => {
    const currentUser = Parse.User.current();
    if (currentUser) {
      setUser(currentUser)
    }
  }, []);


  // --- UI Helper ---
  function showMessage(text:string, isError = false) {
    // const msgDiv = document.getElementById('message');
    // msgDiv.innerHTML = text;
    setStatusMsg(text)
    //msgDiv.style.color = isError ? 'red' : 'black';
  } /* End of showMessage */

  // --- User Login ---
  /*async function logInUser() {
    const username = prompt('Enter username:');
    const password = prompt('Enter password:');
    if (!username || !password) {
      showMessage('⚠️ Username and password are required.', true);
      return;
    }

    showMessage('Attempting to log in...');
    try {
      const user = await Parse.User.logIn(username, password);
      showMessage(`✅ Login successful! Welcome, ${user.get('username')}`);
      console.log('User logged in:', user);
    } catch (error) {
      // showMessage(`❌ Login error: ${error.message}`, true);
      showMessage(`❌ Login error: !!!`, true);
      console.error('Login error:', error);
    }
  } /* End of logInUser */


  // Handle logout
  const handleLogout = async (): Promise<void> => {
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



  // Type the event parameter
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });
    
    const sentenRcd = new Parse.Object("Uyum_Sentences");
    sentenRcd.set("sentence", formData.sentence);
    sentenRcd.set("engTrans", formData.engTrans);
    sentenRcd.set("jpnTrans", formData.jpnTrans);
    sentenRcd.set("order", new Date().getTime());

    try {
      const result = await sentenRcd.save();
      setStatus({ 
        type: 'success', 
        message: `Created object: ${result.id}` 
      });
      // Reset form
      setFormData({ 
        sentence: '', 
        engTrans: '', 
        jpnTrans: '' 
      });
    } catch (error) {
      // Type guard for error
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setStatus({ 
        type: 'error', 
        message: `Error: ${errorMessage}` 
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div style={styles.container}>
      <div id="message">{statusMsg}</div>
      {(user!==null) &&
      <>
      <div style={styles.header}>
        <h2 style={styles.title}>Enter Data</h2>
        <button 
          onClick={handleLogout}
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
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <DtFrmField fieldID={'sentence'}
                    fieldIntro={'Enter the Turkish sentence :'}
                    fieldVal={formData.sentence}
                    fieldChgCbkFn={handleChange}
                    disable={loading} />
        <DtFrmField fieldID={'engTrans'}
                    fieldIntro={'Enter the English translation :'}
                    fieldVal={formData.engTrans}
                    fieldChgCbkFn={handleChange}
                    disable={loading} />
        <DtFrmField fieldID={'jpnTrans'}
                    fieldIntro={'Enter the Japanese translation :'}
                    fieldVal={formData.jpnTrans}
                    fieldChgCbkFn={handleChange}
                    disable={loading} />
        
        <button 
          type="submit" 
          style={{
            ...styles.button,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </form>
      </>
      }
      
      {status.message && (
        <div style={{
          ...styles.message,
          backgroundColor: status.type === 'success' ? '#d4edda' : '#f8d7da',
          color: status.type === 'success' ? '#155724' : '#721c24',
          border: `1px solid ${status.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          {status.message}
        </div>
      )}
    </div>
  );
}; /* End of DataForm */


function DtFrmField({fieldID,fieldIntro,fieldVal,fieldChgCbkFn,disable}:{
  fieldID:string,
  fieldIntro:string,
  fieldVal:string
  fieldChgCbkFn:(e:ChangeEvent<HTMLInputElement>)=>void
  disable:boolean
}) {
  return (
    <InputField fieldID={fieldID}
                fieldIntro={fieldIntro}
                fieldVal={fieldVal}
                fieldChgCbkFn={fieldChgCbkFn}
                disable={disable}
                globStyl={styles.formGroup}
                lblStyl={styles.label}
                inpStyl={styles.input} />
  )
} /* DtFrmField */


export default DataForm;