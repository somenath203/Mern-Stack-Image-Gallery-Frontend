import axios from "axios";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import DefaultLayout from "../components/DefaultLayout";


const Profile = () => {

    const { user } = useSelector((state) => state.user);

    const navigate = useNavigate();


    const [openEditModal, setOpenEditModal] = useState(false);


    const [editFullName, setEditFullName] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [editprofilePic, setEditProfilePic] = useState('');
    const [changeUpdatedTextBtn, setChangeUpdatedTextBtn] = useState('');


    const profilePicResetRef = useRef();


    const deleteuserAccount = async (userId) => {

        try {

            const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/api/v1/users/delete-user/${userId}`, {}, {

                headers: {

                    Authorization: `Bearer ${localStorage.getItem('token')}`

                }

            });

            toast.success(`${data.message}`, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });

            localStorage.removeItem('token');

            navigate('/register');


        } catch (error) {

            console.log(error);

            toast.error('failed to delete account', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });

        };

    };


    const onEditProfile = async (e) => {

        e.preventDefault();

        try {


            if (!(editFullName && editEmail && editprofilePic)) {

                toast.error('please fill all the input fields', {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });

            } else if (!editEmail.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {

                toast.error('please enter a valid email address', {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });

            } else {

                const formData = new FormData();

                formData.append('editFullName', editFullName);
                formData.append('editEmail', editEmail);
                formData.append('editProfilePic', editprofilePic);

                setChangeUpdatedTextBtn(true);

                const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/api/v1/users/edit-user/${user?.userId}`, formData, {

                    headers: {

                        Authorization: `Bearer ${localStorage.getItem('token')}`

                    }

                });


                setChangeUpdatedTextBtn(false);

                setOpenEditModal(false);

                localStorage.removeItem('token');

                navigate('/login');


                toast.success(`${data.message}`, {
                    position: "top-center",
                    autoClose: 7000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });


            }


        } catch (error) {

            setChangeUpdatedTextBtn(false);

            toast.error(`${error.response.data.message}`, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });

        }

        setEditFullName('');
        setEditEmail('');
        profilePicResetRef.current.value = null;
        setEditProfilePic('');

    };

    return (
        <DefaultLayout>

            {openEditModal && <div className='h-screen w-full fixed left-0 top-0 flex justify-center items-center bg-black bg-opacity-50'>

                <div className="bg-white rounded shadow-lg w-10/12 md:w-2/4 p-3">

                    <div className="border-b pb-4 px-4 py-2">
                        <h2 className="text-lg md:text-2xl text-center">EDIT PROFILE</h2>
                    </div>

                    <div className="mb-8 min-w-full p-4 flex justify-center items-center bg-red-100 shadow-md rounded-lg">
                        <div className="flex items-center justify-center gap-3">
                            <p className="tracking-wide text-xs md:text-lg font-medium">NOTE: If you don't want to update any particular information, then, write the existing information isndie the input field as it is.</p>
                        </div>
                    </div>

                    <div className="p-3">
                        <form className="flex flex-col gap-8" onSubmit={onEditProfile}>
                            <input
                                type="text"
                                value={editFullName}
                                placeholder={user?.userFullName}
                                className="drop-shadow-md p-3 rounded-md focus:outline-none"
                                onChange={(e) => setEditFullName(e.target.value)}
                            />
                            <input
                                type="email"
                                value={editEmail}
                                placeholder={user?.userEmailAddress}
                                className="drop-shadow-md p-3 rounded-md focus:outline-none"
                                onChange={(e) => setEditEmail(e.target.value)}
                            />
                            <label>
                                <div className="drop-shadow-md p-3 rounded-md focus:outline-none resize-none bg-neutral-100 hover:bg-neutral-200 hover:cursor-pointer">
                                    <p className="text-center text-xl tracking-wider fileinputtextfield">
                                        <i className="fa-solid fa-upload text-2xl mr-3"></i><span className="text-lg md:text-xl">Upload your Picture</span>
                                    </p>
                                </div>
                                <input
                                    type="file"
                                    ref={profilePicResetRef}
                                    id="picName"
                                    hidden
                                    accept=".jpg,.jpeg,.png"
                                    onChange={(e) => setEditProfilePic(e.target.files[0])}
                                />
                            </label>

                            {editprofilePic && <div className='flex items-center justify-center text-center'>
                                <p className='flex justify-center items-center gap-2 flex-col text-blue-500'><span className="font-bold">{document.getElementById('picName').value.split('fakepath\\')[1]}</span></p>
                            </div>}

                            <div className="grid grid-cols-2 gap-2">
                                <button className="max-w-full bg-red-500 text-white py-2 rounded-md mt-3 tracking-widest hover:cursor-pointer hover:bg-red-400 duration-200 text-xs md:text-xl flex items-center justify-center" onClick={() => setOpenEditModal(false)}>CANCEL</button>
                                {changeUpdatedTextBtn ? <><button className="max-w-full bg-blue-400 text-white py-2 rounded-md mt-3 tracking-widest hover:cursor-pointer hover:bg-blue-600 duration-200 flex items-center justify-center">UPDATING...</button></> : <><button className="max-w-full bg-blue-800 text-white py-2 rounded-md mt-3 tracking-widest hover:cursor-pointer hover:bg-blue-600 duration-200"><span className='text-xs md:text-xl flex items-center justify-center'>UPDATE PROFILE</span></button></>}
                            </div>

                        </form>
                    </div>

                </div>

            </div>}



            <div className="min-h-screen flex flex-col items-center gap-12 mt-20">

                <div className="mt-10 flex flex-col justify-center items-center gap-3">
                    <p className="text-2xl tracking-wide">{user?.userFullName.split(' ')[0]}'s Profile</p>
                    <div className="border-2 border-t w-28 border-blue-700 mt-0"></div>
                </div>

                <div className="p-10 py-12 w-10/12 sm:w-11/12 md:w-7/12 md:h-10/12 shadow-xl rounded-md bg-slate-50">

                    <div className="flex items-center justify-center">
                        <img src={user?.userProfilePicture} alt={user?.userFullName} className='w-44 h-44 ml-0 md:ml-6 mb-10 rounded-full shadow-xl bg-no-repeat bg-cover bg-center' />
                    </div>


                    <div className="flex flex-col gap-7">
                        <p className="text-lg md:text-3xl tracking-wide">Full Name: <span className="text-blue-800 font-medium">{user?.userFullName}</span></p>

                        <p className="text-lg md:text-3xl tracking-wide">Email Address: <span className="text-blue-800 font-medium">{user?.userEmailAddress}</span></p>

                        <button className="min-w-full mt-8 py-4 bg-blue-200 hover:bg-blue-300 duration-300 text-black tracking-wide rounded-xl flex items-center justify-center gap-2" onClick={() => setOpenEditModal(true)}>
                            <i className="fa-regular fa-pen-to-square ml-4 text-lg md:text-2xl text-blue-700"></i>
                            <p className="font-medium text-sm md:text-xl tracking-wider">Edit Profile</p>
                        </button>
                    </div>


                </div>

                <div className="mt-12 p-10 py-12 w-10/12 sm:w-11/12 md:w-7/12 md:h-10/12 shadow-xl rounded-md text-center bg-red-50">
                    <p className="text-center text-lg md:text-2xl font-bold tracking-wide">DANGER ZONE</p>
                    <p className="mt-8 font-medium text-slate-600 text-lg md:text-xl">Are you sure you want to delete your account?</p>
                    <p className="mt-3 font-medium text-slate-600 text-lg md:text-xl"><span className="font-bold">NOTE: </span>Deletion of account is irreversable action.</p>
                    <button className="min-w-full mt-8 py-4 bg-red-200 hover:bg-red-300 duration-300 text-black tracking-wide rounded-xl flex items-center justify-center gap-0.5 md:gap-2" onClick={() => deleteuserAccount(user?.userId)}>
                        <i className="fa-solid ml-4 fa-burst text-lg md:text-2xl text-red-700"></i>
                        <p className="font-medium text-sm md:text-xl tracking-wider">Delete My Account</p>
                    </button>
                </div>

            </div>
        </DefaultLayout>
    )
}

export default Profile;