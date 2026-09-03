
const coreStyles = {
  padding: '8px 16px',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease'
};

const extendStyles = (overrides: React.CSSProperties) => ({
  ...coreStyles,
  ...overrides
});

// Styles with proper TypeScript typing.
export const styles: {[key:string]:React.CSSProperties} = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    // alignItems: 'center',
    // alignContent: 'center',
    maxWidth: '400px',
    margin: '50px auto',
    padding: '20px',
    background: '#f5f5f5',
    borderRadius: '8px',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    alignSelf: 'stretch'
  },
  feedBack: {
    fontSize: '19px',
    fontWeight: 'semibold',
    background: '#AEF',
    color: '#300',
    textAlign: 'center',
    padding:  '10px 5px',
    marginBottom: '15px',
    border: '5px solid #d53',
    borderRadius: '4px',
  },
  title: {
    fontSize: '21px',
    fontWeight: 'bold',
    // textAlign: 'center',
    color: '#333',
    // marginBottom: '20px'
    margin: 0

  },
  loginButton: extendStyles({ backgroundColor: '#1e7fdf', fontSize: '18px' }),
  logoutButton: extendStyles({ backgroundColor: '#dc3545', fontSize: '17px' }),
  form: {
    display: 'flex',
    flexDirection: 'column'
  },
  formGroup: {
    marginBottom: '15px'
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#555'
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxSizing: 'border-box',
    fontSize: '14px'
  },
  button: {
    padding: '10px',
    background: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'background 0.3s'
  },
  message: {
    marginTop: '10px',
    padding: '10px',
    borderRadius: '4px'
  },
  status: {
    color: '#f16b12',
    fontWeight: 'bold',
    marginBottom: '15px'
  },


// const myStyle: React.CSSProperties = 
cnclAtrb: {
  backgroundColor: '#d97706',      // bg-amber-600
  color: '#ecfccb',                // text-lime-100
  fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif', // font-serif
  fontSize: '1.5rem',              // text-2xl
  lineHeight: '2rem',              // text-2xl
  fontWeight: 400,                 // font-normal
  margin: '0.75rem',               // m-3
  paddingLeft: '0.5rem',           // px-2
  paddingRight: '0.5rem',          // px-2
  paddingTop: '0.75rem',           // py-3
  paddingBottom: '0.75rem',        // py-3
  borderWidth: '2px',              // border-2
  borderColor: '#854d0e',          // border-yellow-800
  borderStyle: 'solid',
  borderRadius: '0.5rem',          // rounded-lg
}//;

//export default myStyle;

}; /* End of styles */
