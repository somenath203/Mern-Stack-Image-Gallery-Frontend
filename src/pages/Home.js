import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from 'uuid';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import DefaultLayout from "../components/DefaultLayout";

const Home = () => {

  const [showAllCards, setShowAllCards] = useState([]);

  const [isDeleteCard, setIsDeleteCard] = useState('');

  const [openEditModal, setOpenEditModal] = useState(false);


  const [getCardId, setGetCardId] = useState('');

  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editUploadPicture, setEditUploadedPicture] = useState('');

  const [changeUpdatedTextBtn, setChangeUpdatedTextBtn] = useState('');


  const cardPicResetRef = useRef();


  const dispAllCards = async () => {

    try {


      const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/api/v1/gallery-card/get-all-cards`, {}, {

        headers: {

          Authorization: `Bearer ${localStorage.getItem('token')}`

        }

      });

      setShowAllCards(data.cards);

    } catch (error) {

      console.log(error);

      toast.error('error fetching cards', {
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

  useEffect(() => {

    dispAllCards();

  }, []);

  const deleteCard = async (cardId) => {

    try {

      setIsDeleteCard(true);

      const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/api/v1/gallery-card/delete-card/${cardId}`, {}, {

        headers: {

          Authorization: `Bearer ${localStorage.getItem('token')}`

        }

      });

      setIsDeleteCard(false);

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

      dispAllCards();

    } catch (error) {

      console.log(error);

      toast.error('failed to delete card', {
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

  };



  const onEditCard = async (e) => {

    e.preventDefault();

    try {

      if (!(editTitle && editDescription && editUploadPicture)) {

        toast.error('please enter all the input fields', {
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

        setChangeUpdatedTextBtn(true);

        const formData = new FormData();

        formData.append('editCardTitle', editTitle);
        formData.append('editCardDescription', editDescription);
        formData.append('editCardPhoto', editUploadPicture);

        const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/api/v1/gallery-card/edit-card/${getCardId}`, formData, {


          headers: {

            Authorization: `Bearer ${localStorage.getItem('token')}`

          }

        });

        setChangeUpdatedTextBtn(false);

        setOpenEditModal(false);


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


        dispAllCards();


      }

    } catch (error) {

      setChangeUpdatedTextBtn(false);

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

    setEditTitle('');
    setEditDescription('');
    cardPicResetRef.current.value = null;
    setEditUploadedPicture('');

  }


  return (
    <DefaultLayout>

      <div className="mb-1/2"></div>


      {openEditModal && <div className='h-screen w-full fixed left-0 top-0 flex justify-center items-center bg-black bg-opacity-50'>

        <div className="bg-white rounded shadow-lg w-10/12 md:w-2/4 p-3">

          <div className="border-b pb-4 px-4 py-2">
            <h2 className="text-lg md:text-2xl text-center">EDIT CARD</h2>
          </div>

          <div className="mb-8 min-w-full p-4 flex justify-center items-center bg-red-100 shadow-md rounded-lg">
            <div className="flex items-center justify-center gap-3">
              <p className="tracking-wide text-xs md:text-lg font-medium">NOTE: If you don't want to update any particular information, then, write the existing information isndie the input field as it is.</p>
            </div>
          </div>

          <div className="p-3">
            <form className="flex flex-col gap-8" onSubmit={onEditCard}>
              <input
                type="text"
                value={editTitle}
                placeholder='enter the title of the card'
                className="drop-shadow-md w-full p-3 rounded-md focus:outline-none"
                onChange={(e) => setEditTitle(e.target.value)}
              />
              <textarea
                placeholder='enter the description of the card'
                value={editDescription}
                cols="30"
                rows="10"
                className="drop-shadow-md p-3 rounded-md focus:outline-none resize-none"
                onChange={(e) => setEditDescription(e.target.value)}
              ></textarea>
              <label>
                <div className="drop-shadow-md p-3 rounded-md focus:outline-none resize-none bg-neutral-100 hover:bg-neutral-200 hover:cursor-pointer">
                  <p className="text-center text-xl tracking-wider fileinputtextfield">
                    <i className="fa-solid fa-upload text-2xl mr-3"></i>Upload your Picture
                  </p>
                </div>
                <input
                  type="file"
                  ref={cardPicResetRef}
                  id="picName"
                  onChange={(e) => setEditUploadedPicture(e.target.files[0])}
                  hidden
                  accept=".jpg,.jpeg,.png"
                />
              </label>

              {editUploadPicture && <div className='flex items-center justify-center text-center p-1'>
                <p className='flex justify-center items-center gap-2 flex-col text-blue-500'><span className="font-bold">{document.getElementById('picName').value.split('fakepath\\')[1]}</span></p>
              </div>}

              <div className="grid grid-cols-2 gap-2">
                <button className="max-w-full bg-red-500 text-white py-2 rounded-md mt-3 tracking-widest hover:cursor-pointer hover:bg-red-400 duration-200 text-xs md:text-xl flex items-center justify-center" onClick={() => setOpenEditModal(false)}>CANCEL</button>
                {changeUpdatedTextBtn ? <><button className="max-w-full bg-blue-400 text-white py-2 rounded-md mt-3 tracking-widest hover:cursor-pointer hover:bg-blue-600 duration-200 flex items-center justify-center">UPDATING...</button></> : <><button className="max-w-full bg-blue-800 text-white py-2 rounded-md mt-3 tracking-widest hover:cursor-pointer hover:bg-blue-600 duration-200"><span className='text-xs md:text-xl flex items-center justify-center'>UPDATE CARD</span></button></>}
              </div>

            </form>
          </div>

        </div>

      </div>}

      { showAllCards.length === 0 ? <div className="flex justify-center mt-60">
          <div className="shadow-md p-16 flex items-center justify-center rounded-lg bg-gray-100">
            <p className="text-2xl tracking-wide">No cards to display. Please add one.</p>
          </div>
        </div> :
          <div className="h-sceeen grid place-items-center grid-cols-1 md:grid-cols-3 gap-x-5 gap-y-8 mt-16">
            {showAllCards.map((card) => (
              <div className="p-4 w-11/12 h-15 shadow-xl bg-gray-100 rounded-lg" key={uuidv4()}>

                <p className="text-2xl mb-4 font-semibold">{card.title}</p>

                <img src={card.galleryImage} className='min-w-full h-56' alt="" />

                <div className="border-t mt-5 mb-6 border-slate-300"></div>

                <p>{card.description}</p>

                {isDeleteCard && <p className='mt-2 text-lg text-center text-red-500'><i className="fa-solid fa-spinner text-2xl animate-spin"></i> DELETING THE CARD...</p>}

                <div className="mt-10 flex items-center justify-between">
                  <Tippy content={<span>Edit Card</span>} placement={'top'}>
                    <i className="fa-regular fa-pen-to-square text-xl text-blue-700 cursor-pointer" onClick={(e) => { setGetCardId(card._id); setOpenEditModal(true); }}></i>
                  </Tippy>
                  <Tippy content={<span>Delete Card</span>} placement={'top'}>
                    <i className="fa-solid fa-trash-can text-xl text-red-500 cursor-pointer" onClick={() => deleteCard(card._id)}></i>
                  </Tippy>
                </div>

              </div>
            ))}
          </div>
      };
    </DefaultLayout>
  )
};

export default Home;