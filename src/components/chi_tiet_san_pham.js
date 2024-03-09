import Header from "./header";
import Footer from "./footer";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import numeral from 'numeral';
import 'chart.js/auto';
import CommentSection from "./comment_section";
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
function CTSanPham(props)
{
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [Count,setCount]=useState(1);
    const token = localStorage.getItem('token');
    const [danhGia, setDanhGia] = useState(props.data.danh_gia);
    const [tonKho, setTonKho] = useState(0);
    const [selectedDungLuong, setSelectedDungLuong] = useState(null);
    const [selectedMauSac, setSelectedMauSac] = useState(null);
    const [binhLuan,setBinhLuan]=useState([]);
    const [soSao,setSoSao]=useState([]);
    const [sumStar,setSumStar]=useState([]);

    useEffect(() => {
        
        if (props.data.chi_tiet_san_pham.length > 0) {
            const defaultDungLuong = props.data.chi_tiet_san_pham[0].dung_luong.ten;
            const defaultMauSac = props.data.chi_tiet_san_pham[0].mau_sac.ten;
            const defaultTonKho = props.data.chi_tiet_san_pham[0].so_luong;
            setSelectedDungLuong(defaultDungLuong);
            setSelectedMauSac(defaultMauSac);
            setTonKho(defaultTonKho);
            
        }

    }, [props.data.chi_tiet_san_pham]);

    useEffect(() => {

        setSoSao(props.data.danh_gia);

        
        
    }, [props.data.danh_gia]);
       
    const tongSoSao = () => {
        let sum = 0;
        soSao.forEach((item) => {
            sum += item.so_sao;
        });
        setSumStar(sum);
    };

    
    useEffect(() => {
            setBinhLuan(props.data.binh_luan);
    }, [props.data.binh_luan]);


    const handleMauSacClick = (mauSac) => {
        setSelectedMauSac(mauSac);
    
        const chiTietSanPhamSelected = props.data.chi_tiet_san_pham
            .find(item => item.dung_luong.ten === selectedDungLuong && item.mau_sac.ten === mauSac);
    
        if (chiTietSanPhamSelected) {
            setTonKho(chiTietSanPhamSelected.so_luong);
            setCount(1); 
        }
    };


    useEffect(() => {
        const danhGiaProps = props.data?.danh_gia || [];
        setDanhGia(danhGiaProps);
        tongSoSao();
      }, [props.data]);

    const thongKeSoSao = () => {
        const thongKe = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    
        danhGia.forEach((danhGiaItem) => {
          thongKe[danhGiaItem.so_sao]++;
        });
    
         return Object.values(thongKe);;
      };
    



    const themVaoGioHandler=()=>{
        const chiTietSanPhamSelected = props.data.chi_tiet_san_pham.find(item =>
            item.dung_luong.ten === selectedDungLuong && item.mau_sac.ten === selectedMauSac);
    
        if (!chiTietSanPhamSelected) {
            alert('Không tìm thấy chi tiết sản phẩm!');
            return;
        }

        const sanPham = {
            id: chiTietSanPhamSelected.san_pham_id,
            ten: props.data.ten,
            img:props.data.img[0].img_url,
            gia_ban: chiTietSanPhamSelected.gia_ban,
            so_luong: Count,
            dung_luong: chiTietSanPhamSelected.dung_luong.ten,
            dung_luong_id: chiTietSanPhamSelected.dung_luong.id,
            mau_sac: chiTietSanPhamSelected.mau_sac.ten,
            mau_sac_id: chiTietSanPhamSelected.mau_sac.id,
            
        };


        const userId = localStorage.getItem('id');
        let cartItems = localStorage.getItem(`cartItems_${userId}`);
        
        if (cartItems === null) {
            cartItems = [sanPham];
        } else {
            cartItems = JSON.parse(cartItems);
            const existingItemIndex = cartItems.findIndex(item => 
                item.id === sanPham.id && 
                item.dung_luong_id === sanPham.dung_luong_id && 
                item.mau_sac_id === sanPham.mau_sac_id);
    
            if (existingItemIndex !== -1) {
                // Nếu sản phẩm đã tồn tại trong giỏ hàng, cập nhật số lượng
                cartItems[existingItemIndex].so_luong += sanPham.so_luong;
            } else {
                // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới vào mảng
                cartItems.push(sanPham);
            }
        }
    
        localStorage.setItem(`cartItems_${userId}`, JSON.stringify(cartItems));
        alert('Thêm sản phẩm vào giỏ hàng thành công!');
    }

    

    const renderThongKe = () => {
        const thongKe = thongKeSoSao();
    
        return (
          <>
            <h3 className="danh-gia-chi-tiet">Đánh giá {props.data.ten}</h3>
            <div>
            <span className="so-sao-sp">{parseFloat(sumStar/soSao.length).toFixed(1)}<FontAwesomeIcon icon={faStar} style={{ color: 'yellow' }} /></span>
            <span className="so-luot-danh-gia">{soSao.length} đánh giá</span>
            </div>
            <ul className="ul-danh-gia">
              {Object.keys(thongKe).map((sao) => (
                <li key={sao} className="li-danh-gia">
                  {parseInt(sao,10)+1} <FontAwesomeIcon style={{ color: 'yellow' }} icon={faStar} />: {thongKe[sao]} người đánh giá
                </li>
              ))}
            </ul>
          </>
        );
      };

    const chonMuaHandler=()=>{
        
        if (!token) {
            alert('Vui lòng đăng nhập để mua hàng!');
            return;
        }
        const chiTietSanPhamSelected = props.data.chi_tiet_san_pham.find(item =>
            item.dung_luong.ten === selectedDungLuong && item.mau_sac.ten === selectedMauSac);
    
        if (!chiTietSanPhamSelected) {
            alert('Không tìm thấy chi tiết sản phẩm!');
            return;
        }
       
        const sanPham = {
            id: chiTietSanPhamSelected.san_pham_id,
            ten: props.data.ten,
            img:props.data.img[0].img_url,
            gia_ban: chiTietSanPhamSelected.gia_ban,
            so_luong: Count,
            dung_luong: chiTietSanPhamSelected.dung_luong.ten,
            dung_luong_id: chiTietSanPhamSelected.dung_luong.id,
            mau_sac: chiTietSanPhamSelected.mau_sac.ten,
            mau_sac_id: chiTietSanPhamSelected.mau_sac.id,
            
        };
        
        const userId = localStorage.getItem('id');
        let cartItems = localStorage.getItem(`cartItems_${userId}`);
        
        if (cartItems === null) {
            cartItems = [sanPham];
        } else {
            cartItems = JSON.parse(cartItems);
            const existingItemIndex = cartItems.findIndex(item => 
                item.id === sanPham.id && 
                item.dung_luong_id === sanPham.dung_luong_id && 
                item.mau_sac_id === sanPham.mau_sac_id);
    
            if (existingItemIndex !== -1) {
                // Nếu sản phẩm đã tồn tại trong giỏ hàng, cập nhật số lượng
                cartItems[existingItemIndex].so_luong += sanPham.so_luong;
            } else {
                // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới vào mảng
                cartItems.push(sanPham);
            }
        }
    
        localStorage.setItem(`cartItems_${userId}`, JSON.stringify(cartItems));
        
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
      
     
      
        
    const HandelCong = () => {
        if (Count < tonKho) {
            setCount(Count + 1);
        }
    };
    const HandelTru = () => {
        if (Count > 1) {
            setCount(Count - 1);
        }
    };
    
    

    const getUniqueDungLuongs = (chiTietSanPham) => {
        const unique = new Map();
        return chiTietSanPham.filter(item => {
            const isUnique = !unique.has(item.dung_luong.ten);
            unique.set(item.dung_luong.ten, true);
            return isUnique;
        });
    };

    const handleDungLuongClick = (dungLuong) => {
        setSelectedDungLuong(dungLuong);
    
        // Tìm các màu sắc có sẵn cho dung lượng được chọn
        const mauSacCoSan = props.data.chi_tiet_san_pham
            .filter(item => item.dung_luong.ten === dungLuong)
            .map(item => item.mau_sac.ten);
    
        // Nếu có màu sắc có sẵn, chọn màu sắc đầu tiên
        if (mauSacCoSan.length > 0) {
            setSelectedMauSac(mauSacCoSan[0]);
        } else {
            setSelectedMauSac(null);
        }
    
        // Cập nhật tonKho và Count
        const chiTietSanPhamSelected = props.data.chi_tiet_san_pham
            .find(item => item.dung_luong.ten === dungLuong && item.mau_sac.ten === mauSacCoSan[0]);
    
        if (chiTietSanPhamSelected) {
            setTonKho(chiTietSanPhamSelected.so_luong);
            setCount(1);
        }
    };
    


    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        beforeChange: (current, next) => setSelectedImageIndex(next),
    };

    // Các hàm tùy chỉnh nút Next và Prev
    function SampleNextArrow(props) {
        const { className, style, onClick } = props;
        return (
            <div
                className={className}
                style={{ ...style, display: "block", background: "blue" }}
                onClick={onClick}
            />
        );
    }

    function SamplePrevArrow(props) {
        const { className, style, onClick } = props;
        return (
            <div
                className={className}
                style={{ ...style, display: "block", background: "green" }}
                onClick={onClick}
            />
        );
    }
    

    return(
        
        <>
       
        <Header/>
        
        <div className="chi-tiet">
            <div className="img-ct">
                <Slider {...sliderSettings}>
                    {props.data.img.map((image, index) => (
                        <img
                            key={index}
                            src={`http://127.0.0.1:8000/${image.img_url}`}
                            alt={`hinh-anh-${index}`}
                            className={`${selectedImageIndex === index ? 'selected' : ''}`}
                            onClick={() => setSelectedImageIndex(index)}
                        />
                    ))}
                </Slider>
            </div>
           
                <p className="ct-ten-sp">{props.data.ten}</p>

                {getUniqueDungLuongs(props.data.chi_tiet_san_pham).map((item) => (
                    <span
                        key={item.dung_luong.id}
                        className={`dung_luong ${selectedDungLuong === item.dung_luong.ten ? 'selected' : ''}`}
                        onClick={() => handleDungLuongClick(item.dung_luong.ten)}
                    >
                        {item.dung_luong.ten + "GB" || ''}
                    </span>
                ))}
                <br/><br/>

                {props.data.chi_tiet_san_pham
                    .filter(item => item.dung_luong.ten === selectedDungLuong)
                    .map((item) => (
                        <span
                            key={item.id}
                            className={`mau_sac ${selectedMauSac === item.mau_sac.ten ? 'selected' : ''}`}
                            onClick={() => handleMauSacClick(item.mau_sac.ten)}
                        >
                            {item.mau_sac.ten || ''}
                        </span>
                    ))}
                <br/><br/>
                <p>Giá bán: {props.data.chi_tiet_san_pham
                    .find(item => item.dung_luong.ten === selectedDungLuong)?.gia_ban}</p>
                <p>Số lượng:<i> còn {tonKho}</i></p>
                
                <p className="quantity">
                    Số lượng:
                    
                        <button className="tru-so-luong" onClick={HandelTru}>-</button>
                        <input type="number" className="input-so-luong" value={Count} readOnly/>
                        <button className="cong-so-luong" onClick={HandelCong}>+</button>
                    
                </p>
                {token ?( 
                    <>
                            <NavLink to={`/thanh-toan`} onClick={chonMuaHandler} className="btn btn-danger mua-ngay">Mua ngay</NavLink>
                    </>
                ):(
                    <>
                            <button onClick={chonMuaHandler} className="btn btn-danger mua-ngay">Mua ngay</button>
                    </>
                )
                }
                
                <button onClick={themVaoGioHandler} className="btn btn-primary them-vao-gio">Thêm vào giỏ hàng</button>
            </div>
            
            
            <div className="parameter">
               
                <div className="danh-gia"> 
                    <div>{renderThongKe()}</div>             
                </div>
                <div className="binh-luan col-md-8">                   
                        {binhLuan && <CommentSection binhLuan={binhLuan} />}                   
                </div>
                    <ul className="parameter__list">
                    <h5>Thông tin sản phẩm:</h5>
                            <li className="productdetail_list">
                                <p className="lileft">Màn hình:</p>
                                <div className="liright">
                                    <span class="">{props.data.thong_tin_san_pham.man_hinh} inch</span>
                                </div>
                            </li>
                            <li className="productdetail_list">
                                <p class="lileft">Hệ điều hành:</p>
                                <div class="liright">
                                    <span class="">{props.data.thong_tin_san_pham.he_dieu_hanh}</span>
                                </div>
                            </li>
                            <li className="productdetail_list">
                                <p class="lileft">Camera:</p>
                                <div class="liright">
                                            <span class="">{props.data.thong_tin_san_pham.camera} </span>
                                </div>
                            </li>
                            <li className="productdetail_list">
                                <p class="lileft">RAM:</p>
                                <div class="liright">
                                            <span class="">{props.data.thong_tin_san_pham.ram} GB</span>
                                </div>
                            </li>
                            <li className="productdetail_list">
                                <p class="lileft">Dung lượng:</p>
                                <div class="liright">
                                            <span class="">{selectedDungLuong} GB</span>
                                </div>
                            </li>
                            <li className="productdetail_list">
                                <p class="lileft">Kích thước:</p>
                                <div class="liright">
                                            <span class="comma">{props.data.thong_tin_san_pham.kich_thuoc}</span>
                                           
                                </div>
                            </li>
                            <li className="productdetail_list">
                                <p class="lileft">Pin:</p>
                                <div class="liright">
                                            <span class="comma">{props.data.thong_tin_san_pham.pin} mAh</span>
                                            
                                </div>
                            </li>
                            <li className="productdetail_list">
                                <p class="lileft">Trọng lượng:</p>
                                <div class="liright">
                                            <span class="">{props.data.thong_tin_san_pham.trong_luong} g</span>
                                </div>
                            </li>
                            <li className="productdetail_list">
                                <p class="lileft">Hãng</p>
                                <div class="liright">
                                            <span class="">{props.data.loai_san_pham.ten}</span>
                                </div>
                            </li>
                    </ul>
            
    </div>
        <Footer/>
        </>
    )
}
export default CTSanPham;


