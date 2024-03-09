import axios from "axios";
import { useEffect, useState } from "react";
import Banner from "../components/banner";

function ListBanner()
{
    const [dsBanner,setDSBanner]=useState([]);
    useEffect(()=>{
        const getBanner= async()=>{
            try{
                const response= await axios.get('http://localhost:8000/api/slide');
                setDSBanner(response.data.data);
            }catch(error){
                console.error("Lỗi khi lấy dữ liệu", error);
            }
        }
        getBanner();
    },[]);
    const listMember=dsBanner.map((item)=>{
        return (
            <Banner member={item}/>
        );
    });

    return (
        <>
             <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner">
                    {listMember}
                </div>
           </div>
        </>
    )
}
export default ListBanner;