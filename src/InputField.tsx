import React, {ChangeEvent} from 'react';


function InputField({fieldID,fieldIntro,fieldVal,fieldChgCbkFn,disable,
  globStyl,lblStyl,inpStyl,hide=false
}:{
  fieldID:string,
  fieldIntro:string,
  fieldVal:string
  fieldChgCbkFn:(e:ChangeEvent<HTMLInputElement>)=>void// || (e:string)=>void
  disable:boolean
  globStyl:React.CSSProperties
  lblStyl:React.CSSProperties
  inpStyl:React.CSSProperties
  hide?:boolean
}) {
  return (
    <div style={globStyl}>
      <label htmlFor={fieldID} style={lblStyl}>
        {fieldIntro}
      </label>
      <input
        // type="text"
        type={hide?"password":"text"}
        id={fieldID}
        name={fieldID}
        value={fieldVal}
        onChange={fieldChgCbkFn}
        style={inpStyl}
        required
        disabled={disable}
      />
    </div>
  )
} /* InputField */


export default InputField;