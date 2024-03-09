import '../bootstrap-5.2.3-dist/css/bootstrap.min.css';
import Header from "../components/header";
import Footer from "../components/footer";
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import numeral from 'numeral';
import withAuth from './withAuth';
import { toast } from 'react-toastify'; 
import { useNavigate } from 'react-router-dom';
function ThanhToan() {
    const [cartItems,setCartItems]=useState([])
    const [HoTen,setHoTen]=useState([]);
    const [DienThoai,setDienThoai]=useState([]);
    const [DiaChi, setDiaChi]=useState([]);
    const token = localStorage.getItem('token');
    const hoTen=useRef()
    const dienThoai=useRef()
    const diaChi=useRef()
    const navigate=useNavigate()

    useEffect(()=>{
       
        const userId = localStorage.getItem('id');
        const items = localStorage.getItem(`cartItems_${userId}`);
        setHoTen(localStorage.getItem('ho_ten'))
        setDienThoai(localStorage.getItem('dien_thoai'))
        setDiaChi(localStorage.getItem('dia_chi'))
        if (items !== null) {
            setCartItems(JSON.parse(items));
        }
    },[]);

    const xoaHandler = (id, dung_luong_id, mau_sac_id) => {
        const userId = localStorage.getItem('id');
        setCartItems((prevItems) => {
            const updatedItems = prevItems.filter(item => 
                !(item.id === id && item.dung_luong_id === dung_luong_id && item.mau_sac_id === mau_sac_id));
            localStorage.setItem(`cartItems_${userId}`, JSON.stringify(updatedItems));
            return updatedItems;
        });
    };
    
    const [tongTien,setTongTien]=useState(0);

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
      
      const formatSoTien = (soTien) => {
        const so = parseFloat(soTien);
        return numeral(so).format('0,0');
    }
      
    useEffect(() => {
        let tong = 0;
        cartItems.forEach(item => {
            tong += item.so_luong * item.gia_ban;
        });
        setTongTien(tong);
    }, [cartItems]);

   
    
    
    const testHandler = async () => {
        try {
            var jsonData = {
                hd: [
                    {
                        khach_hang_id: localStorage.getItem('id'),
                        tong_tien: tongTien,
                        dia_chi: diaChi.current.value, 
                        dien_thoai: dienThoai.current.value,
                        phuong_thuc_tt: "Thanh toán khi nhận hàng"
                    }
                ],
                cthd: cartItems.map(item => ({
                    san_pham_id: item.id,
                    mau_sac_id:item.mau_sac_id,
                    dung_luong_id:item.dung_luong_id,
                    so_luong: item.so_luong,
                    gia_ban: item.gia_ban,
                    thanh_tien: item.thanh_tien
                }))
            }; 
           
            const response = await axios.post('http://127.0.0.1:8000/api/hoa-don', jsonData, {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                toast.success('Đặt hàng thành công!', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                  });
                  const userId = localStorage.getItem('id');
                  const savedOrderItems = localStorage.getItem(`orderItems_${userId}`);
                  let orderItems = savedOrderItems ? JSON.parse(savedOrderItems) : [];
                  
                  const newOrder = {
                      orderId: response.data.orderId, // Giả sử orderId được trả về từ server
                      items: cartItems
                  };
                  
                  // Thêm đơn hàng mới vào danh sách đơn hàng hiện có
                  orderItems.push(newOrder);
      
                  localStorage.setItem(`orderItems_${userId}`, JSON.stringify(orderItems));
                  localStorage.removeItem(`cartItems_${userId}`);
                  setCartItems([]);
                navigate('/don-hang');
              } else {
                toast.error('Đăng nhập thất bại!', {
                  position: 'top-right',
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                });
              }
        } catch (error) {
            console.error("Có lỗi xảy ra:", error);
            alert("Có lỗi khi gửi dữ liệu!");
        }
    }
    
    const thanhToanUI = () => {
        if (cartItems.length > 0) {
            return (
                <div className='thanhtoan'>
                    <h5>Thanh toán</h5>
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Sản phẩm</th>
                                <th scope="col">Màu sắc</th>
                                <th scope="col">Dung lượng</th>
                                <th scope="col">Đơn giá</th>
                                <th scope="col">Số lượng</th>
                                <th scope="col">Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody className="table-group-divider">
                            {
                                cartItems.map(function(item)
                                {
                                    item.thanh_tien=item.gia_ban*item.so_luong;
                                    return(
                                <tr>
                                <td scope="row">{item.ten}</td>
                                <td>{item.mau_sac}</td>
                                <td>{item.dung_luong}</td>
                                <td>{formatSoTien(item.gia_ban)}</td>
                                <td>{item.so_luong}</td>
                                <td>{formatSoTien(item.thanh_tien)}</td>
                                <td className="cap-xoa"><button className="btn btn-danger" onClick={()=>xoaHandler(item.id, item.dung_luong_id, item.mau_sac_id)}>Xoá</button></td>
                                </tr>
                                
                                    )
                                        
                                })
                            }
                           
                        </tbody>
                        
                    </table>
                    <h6 className='thanh_tien'>Tổng tiền: {formatSoTien(tongTien)}đ</h6>
                </div>
            )
        }
    }
    return (
        <>
            <Header />
            {
                thanhToanUI()
            }
                <div className='thanhtoan'>
                        <div className="mb-3">
                            <h5>Thông tin người nhận hàng:</h5>
                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <label for="ho_ten" className="form-label">Họ tên:</label>
                                <input type="text" className="form-control" id="ho-ten" ref={hoTen} value={HoTen} onChange={(e)=>setHoTen(e.target.value)}/>
                            </div>
                        </div>

                        
                            
                        <div className="row">
                            <div className="col-md-6">
                                <label for="dien_thoai" className="form-label">Điện thoại:</label>
                                <input type="number" className="form-control" id="dien-thoai" ref={dienThoai} value={DienThoai} onChange={(e)=>setDienThoai(e.target.value)}/>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <label for="dia_chi" className="form-label">Địa chỉ:</label>
                                <input type="text" className="form-control" id="dia-chi" ref={diaChi} value={DiaChi} onChange={(e)=>setDiaChi(e.target.value)}/>
                            </div>
                        </div>
                       
                        
                        <div className="col-md-6">
                            <span>Phương thức thanh toán:</span>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" checked />
                            <label className="form-check-label" for="flexRadioDefault1">
                                Thanh toán khi nhận hàng
                            </label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" />
                            <label className="form-check-label" for="flexRadioDefault2">
                                Chuyển khoản qua ngân hàng
                            </label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault3" />
                            <label className="form-check-label" for="flexRadioDefault3">
                                Chuyển khoản qua MoMo
                            </label>
                        </div>
                        <button className="btn btn-warning" onClick={testHandler}>Thanh toán</button>
                        </div>
            <Footer />
        </>
    )
}

export default withAuth(ThanhToan);