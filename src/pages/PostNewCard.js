import axios from "axios";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DefaultLayout from "../components/DefaultLayout";

const PostNewCard = () => {

    const [title, setTitle] = useState('');

    const [description, setDescription] = useState('');

    const [uploadPicture, setUploadedPicture] = useState('');

    const [isCreatingCard, setIsCreatingCard] = useState(false);


    const navigate = useNavigate();

    const fileInputReset = useRef();


    const onSubmitForm = async (e) => {

        e.preventDefault();

        try {

            if (!(title && description && uploadPicture)) {

                toast.error('please fill all the input fields', {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });

            } else {

                const formData = new FormData();

                formData.append('title', title);
                formData.append('description', description);
                formData.append('image', uploadPicture);

                setIsCreatingCard(true);

                await axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/api/v1/gallery-card/post-new-card`, formData, {

                    headers: {

                        Authorization: `Bearer ${localStorage.getItem('token')}`

                    }

                });


                setIsCreatingCard(false);

                navigate('/');


                toast.success('successfully added new card to the gallery', {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });


                setTitle('');
                setDescription('');
                fileInputReset.current.value = null;
                setUploadedPicture('');

            }

        } catch (error) {

            setIsCreatingCard(false);

            setTitle('');
            setDescription('');
            fileInputReset.current.value = null;
            setUploadedPicture('');


            toast.error(`${error.response.data.message}`, {
                position: "top-center",
                autoClose: 3500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });

        }

    }

    return (
        <DefaultLayout>
            <div className="min-h-screen flex items-center flex-col bg-slate-100">

                <div className='mt-20 md:mt-24 w-10/12 md:w-1/2'>

                    <p className='text-2xl md:text-3xl text-center mb-20 text-blue-800 tracking-widest'>CREATE NEW CARD</p>

                    {isCreatingCard && <div className="mb-8 min-w-full p-4 flex justify-center items-center bg-yellow-100 shadow-md rounded-lg">
                        <div className="flex items-center justify-center gap-3">
                            <i className="fa-solid fa-spinner text-2xl animate-spin"></i>
                            <p className="tracking-wide text-md font-medium">Creating your Card. Please Wait...</p>
                        </div>
                    </div>}

                    <form className="flex flex-col gap-8" onSubmit={onSubmitForm}>
                        <input
                            type="text"
                            value={title}
                            placeholder="enter the title of the card"
                            className="drop-shadow-md w-full p-3 rounded-md focus:outline-none"
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <textarea
                            placeholder="enter the description of the card"
                            value={description}
                            cols="30"
                            rows="10"
                            className="drop-shadow-md p-3 rounded-md focus:outline-none resize-none"
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                        <label>
                            <div className="drop-shadow-md p-3 rounded-md focus:outline-none resize-none bg-neutral-100 hover:bg-neutral-200 hover:cursor-pointer">
                                <p className="text-center text-xl tracking-wider fileinputtextfield">
                                    <i className="fa-solid fa-upload text-2xl mr-3"></i>Upload your Picture
                                </p>
                            </div>
                            <input
                                type="file"
                                ref={fileInputReset}
                                id="picName"
                                onChange={(e) => setUploadedPicture(e.target.files[0])}
                                hidden
                                accept=".jpg,.jpeg,.png"
                            />
                        </label>

                        {uploadPicture && <div className='flex items-center justify-center text-center p-1'>
                            <p className='flex justify-center items-center gap-2 flex-col text-blue-500'><span className="font-bold">{document.getElementById('picName').value.split('fakepath\\')[1]}</span></p>
                        </div>}

                        <button className="w-full mb-8 bg-blue-800 text-white py-2 tracking-widest rounded-md mt-3 hover:cursor-pointer hover:bg-blue-600 duration-200">CREATE CARD</button>
                    </form>

                </div>

            </div>
        </DefaultLayout>
    )
};

export default PostNewCard;