import React from 'react';
import {useStyles} from '../../styles/style';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Avatar } from '@material-ui/core';
import { StyledBadge } from '../../styles/style'; 


const UserAvatar = (props) => {

    const { fullName, status, photoUrl } = props

    const getColorForStatus = () => {

        if(status)
        return '#44b700';

        return "#93ABD3";
    }

    return (

        <React.Fragment>
        
            <StyledBadge style={{float:'left', marginRight:'1em'}}
                        overlap="circle"
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right"
                            }}
                        variant="dot"
                        colorTheme={getColorForStatus()}
                    >
                        <Avatar alt={fullName} src={photoUrl}/>

                    </StyledBadge>    
 
        </React.Fragment>
    )

}

export default UserAvatar;