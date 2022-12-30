import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { RotateLoader } from "react-spinners";

import { setUser } from './../redux/userSlice';


const ProtectedRoute = ({ children }) => {

    const [readyToRender, setReadyToRender] = useState();

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const getUserData = async () => {

        try {

            const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/api/v1/users/get-auth-user-info`, {}, {

                headers: {

                    Authorization: `Bearer ${localStorage.getItem('token')}`

                }

            });

            if(data.success) {

                dispatch(setUser(data.userDetails));
            
            }

            setReadyToRender(true);

        } catch (error) {

            setReadyToRender(false);

            localStorage.removeItem('token');

            navigate('/login');

        };

    };

    useEffect(() => {
        getUserData();
    },[]);


    return (
        <div>{!readyToRender ? <div className='min-h-screen flex items-center justify-center bg-slate-100'>
        <RotateLoader loading={readyToRender} size={20} />
      </div> : children}</div>
    )
}
export default ProtectedRoute;