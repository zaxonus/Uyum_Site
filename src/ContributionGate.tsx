import React,{useState,useEffect,useRef} from "react";
import Login from './Login';
import SignUp from './SignUp';


function ContributionGate({cbkFn,cnclFn}:{
  cbkFn?:(u:any)=>void
  cnclFn:()=>void
}) {
  const [loginFlag,setLoginFlag] = useState<boolean>(false),
        [signUpFlag,setSignUpFlag] = useState<boolean>(false),
        butnAtrb = 'bg-slate-600 text-sky-100 font-serif \
                    text-2xl font-normal m-3 px-2 py-3 \
                    border-4 border-blue-400 rounded-2xl',
        cnclAtrb = 'bg-amber-600 text-lime-100 font-serif \
                    text-2xl font-normal m-3 px-2 py-3 \
                    border-2 border-yellow-800 rounded-lg'

  // if (loginFlag) return <Login/>
  if (loginFlag) return <Login cbkFn={cbkFn} />
  if (signUpFlag) return <SignUp/>

  return (
    // <div className='flex flex-col items-center justify-around \
    //                 bg-slate-200 text-sky-100 \
    //                 font-serif text-2xl font-normal m-3 px-2 py-3 \
    //                 border-4 border-blue-200 rounded-2xl h-screen'>
    <div className='flex flex-col items-center justify-around h-screen'>
    <div className='flex flex-col items-center justify-around \
                    bg-slate-200 text-sky-100 \
                    font-serif text-2xl font-normal m-3 px-2 py-3 \
                    border-4 border-blue-200 rounded-2xl h-50%'>
      <button onClick={()=>setLoginFlag(true)}
              className={butnAtrb}>Login</button>
      <button onClick={()=>setSignUpFlag(true)}
              className={butnAtrb}>Sign Up</button>
    </div>
    <button onClick={cnclFn}
            className={cnclAtrb}>Cancel</button>
    </div>
  )
} /* End of ContributionGate */


export default ContributionGate;