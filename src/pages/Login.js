import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DefaultLayout from './../components/DefaultLayout';
import { toast } from 'react-toastify';
import RotateLoader from "react-spinners/RotateLoader";

const Login = () => {

  const [openingScreenLoading, setOpeningScreenLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();


  useEffect(() => {

    setOpeningScreenLoading(true);

    setTimeout(() => {
      setOpeningScreenLoading(false);
    }, 2300);

  }, []);

  const onSubmitForm = async (e) => {

    e.preventDefault();

    try {

      if (!(email && password)) {

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

        const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/api/v1/users/login`, { email: email, password: password });

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

      console.log(error);

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

    setEmail('');
    setPassword('');

  }

  return (
    <>
      {openingScreenLoading ? <div className='min-h-screen flex items-center justify-center bg-slate-100'>
        <RotateLoader loading={openingScreenLoading} size={20} />
      </div> : <DefaultLayout>

        <div className="min-h-screen flex items-center flex-col bg-slate-100">

          <div className='mt-32 w-11/12 md:w-9/12 lg:w-1/3'>

            <p className='text-3xl text-center mb-14 text-blue-800 tracking-widest'>LOGIN</p>

            <form className="flex flex-col gap-8" onSubmit={onSubmitForm}>
              <input
                type="email"
                value={email}
                placeholder="enter your email"
                className="drop-shadow-md rounded-md p-3 focus:outline-none"
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                value={password}
                placeholder="enter your password"
                className="drop-shadow-md p-3 rounded-md focus:outline-none"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="max-w-full bg-blue-800 text-white py-2 tracking-widest rounded-md mt-3 hover:cursor-pointer hover:bg-blue-600 duration-200">LOGIN</button>
              <Link to='/register' className='text-center text-lg text-blue-700'>Don't have an account? Register</Link>
            </form>

          </div>

        </div>

      </DefaultLayout>}
    </>
  )
}

export default Login;