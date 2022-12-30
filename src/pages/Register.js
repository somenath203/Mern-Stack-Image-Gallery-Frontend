import axios from 'axios';
import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import DefaultLayout from './../components/DefaultLayout';

const Register = () => {

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [isCreatingProfile, setIsCreatingProfile] = useState('');

  const navigate = useNavigate();

  const resetFileInput = useRef();


  const onSubmitForm = async (e) => {

    e.preventDefault();

    try {

      if (!(fullName && email && password && profilePicture)) {

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


      } else if (!email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {

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

        formData.append('fullname', fullName);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('profilePicture', profilePicture);

        setIsCreatingProfile(true);

        const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/api/v1/users/register`, formData);

        console.log(data);

        setIsCreatingProfile(false);

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

        localStorage.setItem('token', data.data);

        navigate('/');

      }


    } catch (error) {

      setIsCreatingProfile(false);

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

    setFullName('');
    setEmail('');
    setPassword('');
    resetFileInput.current.value = null;
    setProfilePicture('');

  }

  return (
    <DefaultLayout>

      <div className="min-h-screen flex items-center flex-col bg-slate-100">

        <div className='mt-24 w-11/12 md:w-9/12 lg:w-1/3'>

          <p className='text-2xl md:text-3xl mb-14 text-center text-blue-800 tracking-widest'>CREATE ACCOUNT</p>

          {isCreatingProfile && <div className="mb-8 min-w-full p-4 flex justify-center items-center bg-green-100 shadow-md rounded-lg">
            <div className="flex items-center justify-center gap-3">
              <i className="fa-solid fa-spinner text-2xl animate-spin"></i>
              <p className="tracking-wide text-md font-medium">Creating your Account. Please Wait...</p>
            </div>
          </div>}

          <form className="flex flex-col gap-8" onSubmit={onSubmitForm}>
            <input
              type="text"
              placeholder="enter your fullname"
              value={fullName}
              className="drop-shadow-md p-3 rounded-md focus:outline-none"
              onChange={(e) => setFullName(e.target.value)}
            />
            <input
              type="email"
              placeholder="enter your email"
              value={email}
              className="drop-shadow-md p-3 rounded-md focus:outline-none"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="enter your password"
              value={password}
              className="drop-shadow-md p-3 rounded-md focus:outline-none"
              onChange={(e) => setPassword(e.target.value)}
            />
            <label>
              <div className="drop-shadow-md p-3 rounded-md focus:outline-none resize-none bg-neutral-100 hover:bg-neutral-200 hover:cursor-pointer">
                <div className="text-xl tracking-wider fileinputtextfield">
                  <p className='flex justify-center items-center'><i className="fa-solid fa-upload text-2xl mr-3"></i>Upload your Profile Picture</p>
                </div>
              </div>
              <input
                type="file"
                ref={resetFileInput}
                id="picName"
                hidden
                accept=".jpg,.jpeg,.png"
                onChange={(e) => setProfilePicture(e.target.files[0])}
              />
            </label>

            {profilePicture && <div className='flex items-center justify-center text-center'>
              <p className='flex justify-center items-center gap-2 flex-col text-blue-500'><span className="font-bold">{document.getElementById('picName').value.split('fakepath\\')[1]}</span></p>
            </div>}

            <button className="max-w-full bg-blue-800 text-white py-2 rounded-md mt-3 tracking-widest hover:cursor-pointer hover:bg-blue-600 duration-200">CREATE ACCOUNT</button>

            <Link to='/login' className='text-center text-lg text-blue-700'>Already have an account? Login</Link>

          </form>

        </div>

      </div>

    </DefaultLayout>
  )
};

export default Register;