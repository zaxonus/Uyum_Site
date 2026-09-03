import {styles} from '../styles';

function LogoutBtn({cbkFn}:{cbkFn?:()=>void}) {
  return (
    <button className="m-5"
            style={styles.logoutButton}
            onClick={async ()=> {
              await Parse.User.logOut()
              if (typeof cbkFn !== 'undefined') cbkFn()
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#c82333';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#dc3545';
            }} >
      Logout
    </button>
  )
} /* End of LogoutBtn */


export default LogoutBtn;




