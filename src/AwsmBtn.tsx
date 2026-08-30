
function AwsmBtn({clickFn,btnShape,disable,color,size,type}:{
  clickFn:()=>void
  btnShape:string
  disable:boolean
  color?:string|null
  size?:string
  type?:string
}) {
  let typAtrb = 'solid', colrAtrb = 'text-stone-800', sizAtrb = 'fa-4x'
  if (typeof color !== 'undefined') colrAtrb = 'text-'+color
  if (typeof size !== 'undefined') sizAtrb = 'fa-'+size
  if ((typeof type !== 'undefined')&&(type === 'reg')) typAtrb = 'regular'

  return (
    <button type='button' onClick={clickFn} disabled={disable}>
      {/* <i className={`fa-solid fa-${btnShape} ${sizAtrb} ${colrAtrb}`} /> */}
      <i className={`fa-${typAtrb} fa-${btnShape} ${sizAtrb} ${colrAtrb}`} />
      {/* <i class="fa-regular fa-pen-to-square"></i> */}
    </button>
  )
} /* End of AwsmBtn */


export default AwsmBtn;
