import { makeStyles, withStyles } from '@material-ui/core/styles';
import Badge from "@material-ui/core/Badge";

const useStyles = makeStyles({

  text:{
      color:'#002884',
      padding:'0.5em',
      fontWeight:'400'
  },

  avatar: {
    borderRadius:'50%',
    heigth:'40px',
    width: '40px', 
   
  },

  app_logo: {
    borderRadius:'50%',
    heigth:'200px',
    width: '200px', 
   
  },

  message_panel_box: {

    marginTop:'2em',
    width:'80%',
    float:'left',
    // minHeight:'600px',
    maxHeight:'600px',
    display:'flex',
    flexDirection:'column'
  },
  
  friends_box: {
    marginTop:'2em',
    width:'20%',
    float:'left',
    minHeight:'600px',
    overflow:'hidden'

  },

  intro_box:{

    marginTop:'2em',
    width:'50%',
    float:'left',
    minHeight:'500px',
    display:'flex',
    flexDirection:'column',
    alignContent:'center',
  },

  search_box:{

    marginTop:'4em',
    marginBottom:'2em'

  },

  friend_table_box: {
    marginTop:'5em',
    width:'60%',
    margin:'auto',
    marginBottom:'4em'

  },
  info_message : {

    width:450,
    margin:'1em auto'
  },

  chat_message: {

    marginTop:'0.5em',
    marginBottom:"0.5em",
    wordWrap:'break-word',
    maxWidth:'600px',
    minWidth:"50px",
    textAlign:'left'
  },

  message_history_box: {

    color:'#002884',
    display:'flex',
    flexDirection:'column',
    overflowY:'scroll',
    minHeight:'500px',
    maxHeight:'500px',

  },

  float_right:{
    marginLeft:'auto',
    marginRight:'1em'
 },

  float_left:{
    marginRight:'auto',
    marginLeft:'1em'
  },

  send_message_box: {

    minWidth:'500px',
    width:'100%',
    marginLeft:'1em',
    marginTop:'1em',
    marginBottom:'0em',
    paddingLeft:'1em',
    display:'inline-block'

  },

  send_icon_div: {

    float:'left',
    padding:'0em 0.5em'

  },

  send_text_div: {

    float:'left',
    width:'60%',
    maxWidth:'700px'
  },

  login_box : {
    marginTop:'5em',
    minHeight:'500px',
  }


});

const StyledBadge = withStyles(() => ({
  badge: props => ({
    backgroundColor: props.colorTheme,
    color: props.colorTheme,
    boxShadow: `0 0 0 2px ${props.colorTheme}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "$ripple 1.2s infinite ease-in-out",
      border: `1px solid ${props.colorTheme}`,
      content: '""'
    }
  }),
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0
    }
  }
}))(Badge);

export { useStyles, StyledBadge};