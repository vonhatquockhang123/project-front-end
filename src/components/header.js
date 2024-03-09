import { NavLink, useNavigate} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import {faUser } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from "react";
import axios from "axios";
import Products from "./products";

function Header() {

  const [tenTaiKhoan, setTenTaiKhoan] = useState(localStorage.getItem('ten_tai_khoan')|| null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate=useNavigate();
  const [dsSanPham, setDSSanPham] = useState([]);
  const [sumCart,setSumCart]=useState();
  const [sumOrder,setSumOrder]=useState();
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('id');
    const cartItems = JSON.parse(localStorage.getItem(`cartItems_${userId}`)) || [];
    const orderItems = JSON.parse(localStorage.getItem(`orderItems_${userId}`)) || [];
    setSumCart(cartItems.length);
    setSumOrder(orderItems.length);
    if (token) {
      setIsLoggedIn(true);
      axiosUserInfo(token);
    }
  }, []);
  
  
  
  
  const axiosUserInfo = async (token) => {
    axios({
      method: 'GET',
      url: 'http://127.0.0.1:8000/api/me',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {

      setTenTaiKhoan(response.data[0].ten_dang_nhap);
      localStorage.setItem('id',response.data[0].id)
      localStorage.setItem('ho_ten', response.data[0].ho_ten);
    
      localStorage.setItem('dien_thoai', response.data[0].dien_thoai);
      localStorage.setItem('ten_tai_khoan',response.data[0].ten_dang_nhap);
      localStorage.setItem('email', response.data[0].email);
      localStorage.setItem('dia_chi',response.data[0].dia_chi);
      
    })
    .catch(error => console.error('Error:', error));
  };
    
  const logout = () => {
    const token = localStorage.getItem('token');
  
    axios({
      method: 'POST',
      url: 'http://127.0.0.1:8000/api/logout',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      clearLocalStorage();
      alert(response.data.message);
      navigate('/dang-nhap')
      
      
      
      

      
    })
    .catch(error => {
      console.error('Error:', error);
      clearLocalStorage();
      navigate('/dang-nhap');
    }
    );
  };

  const clearLocalStorage = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('token');
    localStorage.removeItem('ho_ten');
    localStorage.removeItem('dien_thoai');
    localStorage.removeItem('id');
    localStorage.removeItem('email');
    localStorage.removeItem('dia_chi');
    localStorage.removeItem('ten_tai_khoan');
   
};

  console.log(isLoggedIn)
  return (
    <>
    <header className="p-3 bg-dark text-white">
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
          <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
          </ul>
          
          {/* <div className="text-end">
            <NavLink to="/dang-nhap" type="button" className="btn btn-outline-light me-2">Login</NavLink>
            <NavLink to="/dang-ky" type="button" className="btn btn-warning">Sign-up</NavLink>
          </div> */}
        </div>
      </div>
    </header>
    <section className="w-100">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
         
          <button className="navbar-toggler" type="button" data-mdb-toggle="collapse" data-mdb-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <i className="fas fa-bars"></i>
          </button>

        
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
           
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li>
              <NavLink to="/" className="nav-link active white">Trang chủ</NavLink>
            </li>
            <li>
              <NavLink to="/gioi-thieu" className="nav-link">Giới thiệu</NavLink>
            </li>
            <li>
              <NavLink to="/tu-van" className="nav-link">Tư vấn</NavLink>
            </li>
            </ul>
          </div>
        
         

          <div className="login-out">
        {isLoggedIn ? (
          <>
            <FontAwesomeIcon icon={faUser} size="1x" className="ml-2"/>&nbsp;
            <span>Xin chào, <NavLink to="/info" className="info-name">{tenTaiKhoan}</NavLink></span>
            <button className="logout" onClick={logout}>Đăng xuất</button>
          </>
        ) : (
          <>
            <NavLink to="/dang-nhap">Đăng nhập</NavLink>|
            <NavLink to="/dang-ky">Đăng ký</NavLink>
          </>
        )}
      </div>
      {isLoggedIn ? (
        <>
          <div className="d-flex align-items-center">
          
            <NavLink className="text-reset me-3" to="/gio-hang">
              <FontAwesomeIcon icon={faCartShopping} size="2x" className="mr-4"/>
              {sumCart && sumCart>0?(
                  <span className="badge rounded-pill badge-notification bg-danger">{sumCart}</span>
              ):(
                <></>
              )
              }
              
            </NavLink>
            
              <NavLink className="text-reset me-3" to='/don-hang'>
                <FontAwesomeIcon icon={faShoppingBag} size="2x" className="ml-2"/>
                {sumOrder && sumOrder>0 ?(
                  <span className="badge rounded-pill badge-notification bg-danger">{sumOrder}</span>
                ):(
                  <></>
                )
                }
                
              </NavLink>
               </div>
            </>
              ):(

                <>
                <div className="d-flex align-items-center">
                  <NavLink className="text-reset me-3" to="/gio-hang">
                    <FontAwesomeIcon icon={faCartShopping} size="2x" className="mr-4"/>
                    {sumCart && sumCart>0?(
                  <span className="badge rounded-pill badge-notification bg-danger">{sumCart}</span>
                  ):(
                    <></>
                  )
                  }
                  </NavLink>
                </div>
                  </>

              )
        }
            
              
         
          
        </div>
        {dsSanPham.map((item) => (
                    <Products key={item.id} member={item}/>
                ))}
      </nav>
    </section>
    
    
    </>
    
  )
}
export default Header;
