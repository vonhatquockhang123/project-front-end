import { NavLink } from "react-router-dom";
import numeral from 'numeral';
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

function Product(props)
{
    if (!numeral.locales['vi-custom']) {
        numeral.register('locale', 'vi-custom', {
          delimiters: {
            thousands: '.',
            decimal: ',',
          },
          currency: {
            symbol: '',
          },
        });
      }
      numeral.locale('vi-custom');
      
      //const count=console.log(props.member.chi_tiet_san_pham[0].gia_ban);
      
        

    const [selectedPriceMax, setSelectedPriceMax] = useState("");
    const [selectedPriceMin, setSelectedPriceMin] = useState("");
    const [selectedDungLuong, setSelectedDungLuong] = useState("");



    const findHighestPrice = (chiTietSanPham) => {
      return chiTietSanPham.reduce((max, item) => item.gia_ban > max ? item.gia_ban : max, chiTietSanPham[0].gia_ban);
    };


    const findShortestPrice = (chiTietSanPham) => {
      return chiTietSanPham.reduce((min, item) => item.gia_ban < min ? item.gia_ban : min, chiTietSanPham[0].gia_ban);
    };


    useEffect(() => {
        if (props.member.chi_tiet_san_pham && props.member.chi_tiet_san_pham.length > 0) {
            const firstDungLuong = props.member.chi_tiet_san_pham[0];

            const highestPrice = findHighestPrice(props.member.chi_tiet_san_pham);

            const shortestPrice = findShortestPrice(props.member.chi_tiet_san_pham);


            const max = parseFloat(highestPrice);
            const min = parseFloat(shortestPrice);

            setSelectedPriceMax(numeral(max).format('0,0'));
            setSelectedPriceMin(numeral(min).format('0,0'));
            setSelectedDungLuong(firstDungLuong.dung_luong?.ten || '');
        }
    }, [props.member.chi_tiet_san_pham]);

   
    
    const getUniqueDungLuongs = (chiTietSanPham) => {
      const unique = new Map();
      return chiTietSanPham.filter(item => {
          const isUnique = !unique.has(item.dung_luong.ten);
          unique.set(item.dung_luong.ten, true);
          return isUnique;
      });
  };
    
    return (
        <>
         {selectedPriceMax !== '0' && (
                <div className="product-container">
                    <NavLink to={`/san-pham/${props.member.id}`} className="xem">
                        
                        <div className="detail-product">
                            
                            <img src={`http://127.0.0.1:8000/${props.member.img[0]?.img_url}`} id="img-sp" /><br />
                            <span className="mo_ta">%{props.member.mo_ta}</span>
                            <h6 className="name">{props.member.ten}</h6>
                            {props.member.chi_tiet_san_pham && getUniqueDungLuongs(props.member.chi_tiet_san_pham).map((item) => (
                            <span className="dung_luong">
                                {item.dung_luong?.ten+"GB" || ''}
                            </span>
                            ))}
                           {selectedPriceMax === selectedPriceMin?(
                                <strong className="price">{selectedPriceMin}₫ </strong>
                              ):(
                            <strong className="price">{selectedPriceMin}₫ - {selectedPriceMax}₫  </strong>
                              )
                            }
                        </div>
                    </NavLink>
                    
                </div>
            )}
        </>
    );
    
}

export default Product;