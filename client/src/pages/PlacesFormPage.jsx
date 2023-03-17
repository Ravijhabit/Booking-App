import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import axios from 'axios';
import AccountNav from "../AccountNav";
import Perks from '../Perks';
import PhotosUploader from '../PhotosUploader';
export default function PlacesFormPage(){
    const {id} = useParams();
    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('');
    const [addedPhotos, setAddedPhotos] = useState([]);
    const [perks, setPerks] = useState([]);
    const [extraInfo, setExtraInfo] = useState('');
    const [checkIn, setCheckIn] =useState('');
    const [checkOut, setCheckOut] = useState('');
    const [maxGuests, setMaxGuests] = useState(1);
    const [redirect, setRedirect] = useState(false);
    useEffect(()=>{
        if(!id){
            return ;
        }
        axios.get('/places/'+id).then(response=>{
            const {data} = response;
            setTitle(data.title);
            setAddress(data.address);
            setDescription(data.description);
            setAddedPhotos(data.photos);
            setPerks(data.perks);
            setExtraInfo(data.extraInfo);
            setCheckIn(data.checkIn);
            setCheckOut(data.checkOut);
            setMaxGuests(data.maxGuests);
        });
    },[id]);
    
    function inputHeader(text){
        return (
            <h2 className="text-2xl mt-4">{text}</h2>
        );
    }

    function inputDescription(text){
        return (
            <p className="text-gray-500 text-sm">{text}</p>            
        );
    }

    function preInput(header,description){
        return(
            <>
                {inputHeader(header)}
                {inputDescription(description)}
            </>
        );
    }

    async function savePlace(event){
        event.preventDefault();
        const placeData={
            title, address, addedPhotos,
            description, perks, extraInfo,
            checkIn, checkOut, maxGuests 
        }
        if(id){
            await axios.put('/places', {
                id,
                ...placeData
            });
            setRedirect(true);
        }else{
            await axios.post('/places', placeData);
            setRedirect(true);
        }
    };

    if(redirect){
        return <Navigate to={'/account/places'}/>
    }

    return(
        <div>
            <AccountNav/>
            <form onSubmit={savePlace}>
                {preInput('Title', 'Title for your place. should be short and catchy as in advertisement')}
                <input 
                    type="text" 
                    placeholder="title, for example: My Lovely Apartment" 
                    value={title} 
                    onChange={event => setTitle(event.target.value)}
                />
                {preInput('Address','Address to this place')}
                <input 
                    type="text" 
                    placeholder="address" 
                    value={address} 
                    onChange={event => setAddress(event.target.value)}
                />
                {preInput('Photos','more=better')}
                <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos}/>
                {preInput('Description','Description of the place')}
                <textarea 
                    value={description} 
                    onChange={event => setDescription(event.target.value)}
                />
                {preInput('Perks','select all the perks of the place')}
                <Perks 
                    selected={perks} 
                    onChange={setPerks}
                />
                {preInput('Extra info','House rules, etc')}
                <textarea 
                    value={extraInfo} 
                    onChange={event => setExtraInfo(event.target.value)}
                />
                {preInput('Check in&out times','add check in and out times, remember to have some time window for cleaning the room between guests')}
                <div className="grid sm:grid-cols-3 gap-2">
                    <div>
                        <h3 className="mt-2 -mb-1">Check in Time</h3>
                        <input 
                            type="text" 
                            placeholder="14:00" 
                            value={checkIn} 
                            onChange={event => setCheckIn(event.target.value)}
                        />
                    </div>
                    <div>
                        <h3 className="mt-2 -mb-1">Check out Time</h3>
                        <input 
                            type="text" 
                            placeholder="11:00" 
                            value={checkOut} 
                            onChange={event => setCheckOut(event.target.value)}
                        />
                    </div>
                    <div>
                        <h3 className="mt-2 -mb-1">Max number of guests</h3>
                        <input 
                            type="number" 
                            value={maxGuests} 
                            onChange={event => setMaxGuests(event.target.value)}
                        />
                    </div>
                </div>
                <button className="primary my-4">Save</button>
            </form>
        </div>
    );
};