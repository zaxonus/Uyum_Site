
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
    marginBottom: '20px'
  },
  title: {
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
  }
}; /* End of styles */
