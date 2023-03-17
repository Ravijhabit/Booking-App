import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import AddressLink from "../AddressLink";
import PlaceGallery from "../PlaceGallery";
import BookingDates from "../BookingDates";
export default function BookingPage(){
    const {id} = useParams();
    const [booking, setBooking] = useState(null);
    useEffect(()=>{
        if(id){
            axios.get('/bookings').then(response =>{
                const foundBooking = response.data.filter(({_id})=>_id === id);
                if(foundBooking){
                    setBooking(foundBooking);
                }
            });
        }
    },[id]);

    if(!booking){
        return '';
    }

    return(
        <div className='my-8'>
            <h1 className="text-3xl">{booking[0].place.title}</h1>
            <AddressLink className='my-2 block'>{booking[0].place.address}</AddressLink>
            <div className="flex justify-between bg-gray-200 p-6 items-center my-6 rounded-2xl">
                <div>
                    <h2 className='text-2xl mb-4'>Your booking Information:</h2>
                    <BookingDates booking={booking[0]}/>
                </div>
                <div className="bg-primary p-6 text-white rounded-2xl">
                    <div>Total Price:</div>
                    <div className="text-3xl">${booking[0].price}</div>
                </div>
            </div>
            <PlaceGallery place={booking[0].place}/>
        </div>
    );
}