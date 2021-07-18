import React from 'react';
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
                        badgecolor={getColorForStatus()}
                    >
                        <Avatar alt={fullName} src={photoUrl}/>

                    </StyledBadge>    
 
        </React.Fragment>
    )

}

export default UserAvatar;