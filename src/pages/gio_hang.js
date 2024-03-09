import Header from "../components/header";
import Footer from "../components/footer";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";

function GioHang() {
      const [cartItems, setCartItems] =useState([])
      const token=localStorage.getItem('token');
      useEffect(()=>{
        const userId = localStorage.getItem('id');
        const items = localStorage.getItem(`cartItems_${userId}`);
        
        if (items !== null) {
            setCartItems(JSON.parse(items));
        }
    },[]);

    const thanhToanHandler=()=>{
        
            alert('Vui lòng đăng nhập để thanh toán!');
            return;
        
    }

    
    const xoaHandler = (id, dung_luong_id, mau_sac_id) => {
        const userId = localStorage.getItem('id');
        setCartItems((prevItems) => {
            const updatedItems = prevItems.filter(item => 
                !(item.id === id && item.dung_luong_id === dung_luong_id && item.mau_sac_id === mau_sac_id));
            localStorage.setItem(`cartItems_${userId}`, JSON.stringify(updatedItems));
            return updatedItems;
        });
    };
    const gioHangUI = () => {
        if (cartItems.length > 0) {
            return ( 
                <div className="giohang">
                    <h5><span>Giỏ hàng</span></h5>
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Hình ảnh</th>
                                <th scope="col">Sản phẩm</th>
                                <th scope="col">Màu sắc</th>
                                <th scope="col">Dung lượng</th>
                                <th scope="col">Đơn giá</th>
                                <th scope="col">Số lượng</th>
                                <th scope="col">Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody className="table-group-divider" id="table-gio-hang">
                            {
                                cartItems.map(function(item)
                                {
                                    item.thanh_tien=item.gia_ban*item.so_luong;
                                    return (
                                        <tr key={item.id}>
                                            <img src={`http://127.0.0.1:8000/${item.img}`} alt="hinh-anh" className="img-gio-hang" />
                                            <td>{item.ten}</td>
                                            <td>{item.mau_sac}</td>
                                            <td>{item.dung_luong}</td>
                                            <td>{item.gia_ban}</td>
                                            <td>{item.so_luong}</td>
                                            <td>{item.thanh_tien}</td>
                                            <td className="cap-xoa"><button onClick={() => xoaHandler(item.id, item.dung_luong_id, item.mau_sac_id)} className="btn btn-danger">Xoá</button></td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                    {token ? (
                    
                        
                            <>
                                <NavLink className="btn btn-primary" id="thanh-toan" to="/thanh-toan">Thanh toán</NavLink>
                            </>
                        ):(
                            <>
                                <button  onClick={thanhToanHandler} className="btn btn-primary" id="thanh-toan" >Thanh toán</button>
                            </>
                        )

                        
                        
                    
                    }
                </div>
            )
        }
        return <>
        <div className="giohang">
        <FontAwesomeIcon icon={faCartShopping} className="cart_shoping"/>
        <p className="not_product">Giỏ hàng chưa có sản phẩm nào</p>
        <NavLink to="/" type="button" className="btn btn-primary th-ng">Thêm sản phẩm ngay</NavLink>
        </div></>

        
    }
    return (
        <>
            <Header />
            {
                gioHangUI()
            }
            <Footer/>
        </>
    )
}
export default GioHang;