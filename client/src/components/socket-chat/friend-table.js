import React,{useState} from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {useStyles} from '../../styles/style';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { addAsFriend } from '../../services/friends-service';
import AlertMessage from '../../utils/alerts';
import Snackbar from '@material-ui/core/Snackbar';

const FriendTable = (props) => {

  const classes = useStyles();
  const user = props.user;

  /************** for alerts (success and failure) ***********/
  const [open,setOpen] = useState(false);
  const [message,setMessage] = useState('');
  const [error, setError] = useState(false);
  /************************************************************/

  const addToFriendsList = async () => {

    const apiResp = await addAsFriend(user.email);
    if(apiResp.error)
    {
      setOpen(true);
      setMessage(apiResp.message);
      setError(true);
    }
    else
    {
      setOpen(true);
      setMessage(apiResp.message);
      setError(false);
    }

  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <React.Fragment>

      {/***************************** alerts on error and success *****************************/}    
      <Snackbar open={open} autoHideDuration={parseInt(process.env.REACT_APP_AUTOHIDE_TIME)} onClose={handleClose}>
        {
          error ? (
                  <AlertMessage onClose={handleClose} severity="error">{message}</AlertMessage>
                  ):
                  (
                    <AlertMessage onClose={handleClose} severity="success">{message}</AlertMessage>
                  )
        }
      </Snackbar>
                    
      {/*****************************************************************************************/}

    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Avatar</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
            <TableRow>
              <TableCell component="th" scope="row">
                {user.fullName}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <img alt='cannot load image' src={user.photoUrl} className={classes.avatar}/>
              </TableCell>
              <TableCell>
                  {
                    user.is_friend ? 'Added': (
                      <Fab size="small" color="primary" aria-label="add" onClick={addToFriendsList}>
                        <AddIcon />
                      </Fab>

                    )
                  
                  }
                  </TableCell>

            </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
    </React.Fragment>
  );
}


export default FriendTable;