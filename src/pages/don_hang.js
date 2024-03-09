import Header from "../components/header";
import Footer from "../components/footer";

import withAuth from './withAuth';
import { ToastContainer } from 'react-toastify';
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import OrderStatusBar from "../components/order_status";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBag, faStar } from "@fortawesome/free-solid-svg-icons";
import numeral from 'numeral';
function DonHang() {
    const [orderItems, setOrderItems] = useState([])
    const [statusOrders, setStatusOrders] = useState([])
    const [ratings, setRatings] = useState(0);
    const [comment, setComment] = useState('');
    const [hasRated, setHasRated] = useState(false);
    const [hasCommented, setHasCommented] = useState(false);

    useEffect(() => {
        const userId = localStorage.getItem('id');
        const items = localStorage.getItem(`orderItems_${userId}`);
        let initialHasRated = {};
        let initialHasCommented = {};
    
        if (items) {
            const orders = JSON.parse(items);
            orders.forEach(order => {
                const rated = localStorage.getItem(`hasRated_${order.orderId}`);
                const commented = localStorage.getItem(`hasCommented_${order.orderId}`);
                initialHasRated[order.orderId] = !!rated;
                initialHasCommented[order.orderId] = !!commented;
                order.items.forEach(item => {
                    const ratedItem = localStorage.getItem(`hasRated_${order.orderId}_${item.id}`);
                    const commentedItem = localStorage.getItem(`hasCommented_${order.orderId}_${item.id}`);
                    initialHasRated[`${order.orderId}_${item.id}`] = !!ratedItem;
                    initialHasCommented[`${order.orderId}_${item.id}`] = !!commentedItem;
                });
            });
            setOrderItems(orders);
        }
    
        setHasRated(initialHasRated);
        setHasCommented(initialHasCommented);

        if (items !== null) {
            setOrderItems(JSON.parse(items));
        }
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

        const fetchOrderStatus = async () => {
            try {
                const userId = localStorage.getItem('id');
                const token = localStorage.getItem('token');
                const response = await axios.post(`http://127.0.0.1:8000/api/trang-thai-don-hang/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.status === 200) {
                    setStatusOrders(response.data.data);
                    
                }
            } catch (error) {
                console.error("Có lỗi khi lấy trạng thái đơn hàng:", error);
            }
        };

        fetchOrderStatus();

    }, []);

    const huyDonHandler = async (orderId) => {
        const token = localStorage.getItem('token');

        try {

            const response = await axios.post('http://127.0.0.1:8000/api/huy-don', { orderId }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                alert(response.data.message);
            } else {


                console.error('Lỗi khi hủy đơn:', response.data);
            }

        } catch (error) {
            console.error('Có lỗi xảy ra khi hủy đơn hàng:', error);
        }
    };
    const DoiThanhTien = (soTien) => {

        const so = parseFloat(soTien);
        return numeral(so).format('0,0');
    }

    const xoaDonHandler = (orderId) => {
        const userId = localStorage.getItem('id');
        let updatedOrders = orderItems.filter(order => order.orderId !== orderId);

        localStorage.setItem(`orderItems_${userId}`, JSON.stringify(updatedOrders));
        setOrderItems(updatedOrders);
    };




    
    const handleRatingChange = (orderId, productId, newRating) => {
        const key = `${orderId}_${productId}`;
        if (!hasRated[key]) {
            setRatings(prevRatings => ({ ...prevRatings, [key]: newRating }));
        }
    };
    
    
    

    const renderStars = (orderId, productId) => {
        const key = `${orderId}_${productId}`;
        const currentRating = ratings[key] || 0;
    
        if (hasRated[key]) {
            return <p>Đã đánh giá</p>;
        }
    
        return [1, 2, 3, 4, 5].map((index) => (
            <FontAwesomeIcon
                key={index}
                icon={faStar}
                className={currentRating >= index ? "star rated" : "star"}
                onClick={() => handleRatingChange(orderId, productId, index)}
            />
        ));
    };

   

    const handleRatingSubmit = async (orderId, productId) => {
        if (!hasRated[`${orderId}_${productId}`]) {
            const key = `${orderId}_${productId}`;
            const userId = localStorage.getItem('id');
            const token = localStorage.getItem('token');
            
    
            const data = {
                hoa_don_id: orderId,
                san_pham_id: productId,
                khach_hang_id: userId,
                so_sao: ratings[key]
            };
    
            try {
                const response = await axios.post('http://127.0.0.1:8000/api/danh-gia', data, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
    
                if (response.data.success) {
                    setHasRated(prevState => ({
                        ...prevState,
                        [key]: true
                    }));
    
                    localStorage.setItem(`hasRated_${key}`, true);
                    alert(response.data.message);
                } else {
                    alert(response.data.message);
                }
            } catch (error) {
                console.error("Lỗi khi gửi đánh giá:", error);
            }
        }
    };

   
   

    const handleCommentChange = (orderId, productId, newComment) => {
        const key = `${orderId}_${productId}`;
        if (!hasCommented[key]) {
            setComment(prevComments => ({ ...prevComments, [key]: newComment }));
        }  
    };
    const handleCommentSubmit = async (orderId, productId) => {
        
        
        if (!hasCommented[`${orderId}_${productId}`]) {
            const key = `${orderId}_${productId}`;
            const userId = localStorage.getItem('id');
            const token = localStorage.getItem('token');

            const data = {
                hoa_don_id: orderId,
                san_pham_id: productId,
                khach_hang_id: userId,
                noi_dung: comment[key]
            };
        
            try {
                const response = await axios.post('http://127.0.0.1:8000/api/binh-luan', data, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
    
                if (response.data.success) {
                    // Cập nhật state và localStorage sau khi bình luận thành công
                    setHasCommented(prevHasCommented => ({ ...prevHasCommented, [key]: true }));
                    localStorage.setItem(`hasCommented_${key}`, true);
                    
                    alert(response.data.message);
                } else {
                    alert(response.data.message);
                }
            } catch (error) {
                console.error("Lỗi khi gửi bình luận:", error);
            }
        }
    };

//console.log(statusOrders)
    const gioHangUI = () => {
        if (orderItems && orderItems.length > 0) {
            return orderItems.map((order, orderIndex) => {
                let orderStatus = null;
                if (statusOrders && statusOrders.length > 0) {
                    orderStatus = statusOrders.find(status => status.orderId === order.orderId);
                }
                
                let tongTienDonHang = 0;
                order.items.forEach(item => {
                    tongTienDonHang += item.gia_ban * item.so_luong;
                });

                return (
                    <div className="don_hang" key={orderIndex}>
                        <h5><span>Mã hóa đơn: {order.orderId}</span></h5>
                        <table className="table">
                            <thead>
                                {orderStatus && orderStatus.trang_thai >= 1 && orderStatus.trang_thai <= 4 ?
                                    (
                                        <OrderStatusBar currentStatus={orderStatus ? orderStatus.trang_thai : 0} />
                                    ) : (
                                        <>

                                            <span className="status-huy"> Đã hủy</span>

                                        </>
                                    )
                                }
                                <tr>
                                    <th>Hình ảnh</th>
                                    <th scope="col">Sản phẩm</th>
                                    <th scope="col">Màu sắc</th>
                                    <th scope="col">Dung lượng</th>
                                    <th scope="col">Đơn giá</th>
                                    <th scope="col">Số lượng</th>
                                    <th scope="col">Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody className="table-group-divider">
                                {order.items && order.items.map((item, itemIndex) => (

                                    <tr key={itemIndex}>
                                        <td><img src={`http://127.0.0.1:8000/${item.img}`} className="img-order" />{' '}
                                            <NavLink to={`/san-pham/${item.id}`}>Xem chi tiết</NavLink>
                                        </td>
                                        <td>{item.ten}</td>
                                        <td>{item.mau_sac}</td>
                                        <td>{item.dung_luong}</td>
                                        <td>{DoiThanhTien(item.gia_ban)}đ</td>
                                        <td>{item.so_luong}</td>
                                        <td>{DoiThanhTien(item.gia_ban * item.so_luong)}đ

                                            {orderStatus && orderStatus.trang_thai === 4 ? (<>
                                                    <div className="so-sao-danh-gia">
                                                        {!hasRated[`${order.orderId}_${item.id}`] && (
                                                            <>
                                                                <div className="stars">{renderStars(order.orderId, item.id)}</div>
                                                                <button onClick={() => handleRatingSubmit(order.orderId, item.id)} className="btn btn-warning">Đánh giá</button>
                                                                
                                                            </>
                                                        )}
                                                        
                                                        
                                                    </div><br/>
                                                    <div>
                                                    { !hasCommented[`${order.orderId}_${item.id}`]&&(
                                                            <>
                                                                <textarea type="text" className="comment-input-field" onChange={(e) => handleCommentChange(order.orderId, item.id, e.target.value)}></textarea><br/>
                                                                <button onClick={() => handleCommentSubmit(order.orderId, item.id)} className="comment-submit-btn">Bình luận</button>
                                                            </>
                                                        )
                                                    }
                                                    </div>
                                                    </>
                                            ) : (
                                                <>
                                                </>
                                            )
                                            }

                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                            <p className="tong-tien-order">Tổng tiền: <span className="sum-order">{DoiThanhTien(tongTienDonHang)}đ</span></p>
                        </table>
                        {orderStatus && orderStatus.trang_thai === 1 ? (
                            <button className="btn btn-danger" onClick={() => huyDonHandler(order.orderId)}>
                                Hủy đơn
                            </button>
                        ) : (
                            <button className="btn btn-light">
                                Hủy đơn
                            </button>
                        )
                        }{' '}
                        {orderStatus && orderStatus.trang_thai >= 4 && orderStatus.trang_thai <= 5 ? (
                            <button className="btn btn-danger" onClick={() => xoaDonHandler(order.orderId)}>
                                Xóa
                            </button>
                        ) : (
                            <button className="btn btn-light">
                                Xóa
                            </button>
                        )
                        }{' '}
                    </div>
                );
            });
        }
        return (
            <div className="giohang">
                <FontAwesomeIcon icon={faShoppingBag} className="icon_shoping_bag" />
                <p className="not_product">Chưa có đơn hàng nào được đặt</p>
                <NavLink to="/" type="button" className="btn btn-primary th-ng">Thêm sản phẩm ngay</NavLink>
            </div>
        );
    }
    return (
        <>
            <div>
                <ToastContainer />
            </div>
            <Header />
            {

                gioHangUI()

            }
            <Footer />
        </>
    )
}
export default withAuth(DonHang);