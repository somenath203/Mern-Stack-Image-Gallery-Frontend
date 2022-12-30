import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';


const DefaultLayout = ({ children }) => {

    const navigate = useNavigate();

    const { user } = useSelector((state) => state.user);


    const logout = () => {

        localStorage.removeItem('token');

        navigate('/login');

        toast.success('you have been logged out successfully', {
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

    return (
        <>
            <nav className="md:flex md:items-center md:justify-between py-6 px-32 md:px-20 shadow-md">

                <Link to='/'>
                    <p className="text-center text-2xl sm:text-lg md:text-3xl tracking-widest text-blue-800 font-semibold">My Image Gallery</p>
                </Link>

                {localStorage.getItem('token') &&
                    <ul className="mt-10 flex items-center justify-center md:mt-0 md:flex md:items-center md:justify-center gap-7 md:gap-5 text-xl text-slate-800">
                        <Link to='/'>
                            <Tippy content={<span>{user?.userFullName}'s Gallery</span>} placement={'left'}>
                                <li className="hover:cursor-pointer hover:border-b-2 hover:border-cyan-900 duration-100">Gallery</li>
                            </Tippy>
                        </Link>
                        <Link to='/post-new-card'>
                            <Tippy content={<span>Create New Card</span>} placement={'bottom'}>
                                <li className="hover:cursor-pointer hover:border-b-2 hover:border-cyan-900 duration-100">NewCard</li>
                            </Tippy>
                        </Link>
                        <Link to='/profile'>
                            <Tippy content={<span>{user?.userFullName}'s Profile</span>} placement={'bottom'}>
                                <li className="hover:cursor-pointer hover:border-b-2 hover:border-cyan-900 duration-100">{user?.userFullName.split(' ')[0]}</li>
                            </Tippy>
                        </Link>
                        <Tippy content={<span>Logout</span>} placement={'right'}>
                            <i className="fa-solid fa-right-from-bracket hover:border-none cursor-pointer text-2xl" onClick={logout}></i>
                        </Tippy>
                    </ul>
                }

            </nav>


            <div className="cards">
                {children}
            </div>
        </>
    )
};

export default DefaultLayout;


