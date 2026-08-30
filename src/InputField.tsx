import { truncate } from 'fs/promises';
import React, {ChangeEvent} from 'react';


function InputField({fieldID,fieldIntro,fieldVal,fieldChgCbkFn,
  disable,globStyl,lblStyl,inpStyl,hide=false,autoCap='on',need=false
}:{
  fieldID:string,
  fieldIntro:string,
  fieldVal:string
  fieldChgCbkFn:(e:ChangeEvent<HTMLInputElement>)=>void
  disable:boolean
  globStyl:React.CSSProperties
  lblStyl:React.CSSProperties
  inpStyl:React.CSSProperties
  hide?:boolean
  autoCap?:string
  need?:boolean
}) {
  return (
    <div style={globStyl}>
      <label htmlFor={fieldID} style={lblStyl}>
        {fieldIntro}
      </label>
      <input type={hide?"password":"text"}
             id={fieldID}
             name={fieldID}
             value={fieldVal}
             onChange={fieldChgCbkFn}
             style={inpStyl}
             required={need}
             disabled={disable}
             autoCapitalize={autoCap}
      />
    </div>
  )
} /* End of InputField */


export default InputField;