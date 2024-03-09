import { NavLink, useNavigate } from 'react-router-dom';
import '../bootstrap-5.2.3-dist/css/bootstrap.min.css';
import { useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
function DangKy() {

    const hoTen=useRef();
    const Email=useRef();
    const tenDangNhap=useRef();
    const matKhau=useRef();
    const soDienThoai=useRef();
    const diaChi=useRef();
    const navigate=useNavigate();

    const handleRegister = async () => {
        try {
          const response = await axios.post('http://127.0.0.1:8000/api/dang-ky',{
              email:Email.current.value,
              mat_khau:matKhau.current.value,
              ho_ten:hoTen.current.value,
              ten_dang_nhap:tenDangNhap.current.value,
              dien_thoai:soDienThoai.current.value,
              dia_chi:diaChi.current.value
            },{
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            
          });
          if (response.status === 200) {
            const Dt = await response.data;
            localStorage.setItem('token', Dt.access_token);
            alert(response.data.message)
            navigate('/dang-nhap');
          } else {
            const data = await response.data;
            console.error('Login failed:', data.error);
            toast.error('Đăng ký thất bại!', {
              position: 'top-right',
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
          }
        } catch (error) {
          console.error('Error:', error);
          toast.error('Đã xảy ra lỗi!', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      };


    return (<>
    <ToastContainer/>
        <div className="container h-100">
            <div className="row d-flex justify-content-center align-items-center h-100">
                <div className="col-12 col-md-9 col-lg-7 col-xl-7">
                    <div className="card" >
                        <div className="card-body p-5">
                            <h2 className="text-uppercase text-center mb-5">Đăng ký tài khoản</h2>
                            <form method='POST'>
                                <div className="form-outline mb-4">
                                    <label className="form-label" for="form3Example1cg">Họ tên:</label>
                                    <input type="text" id="form3Example1cg" ref={hoTen} className="form-control form-control-lg" />

                                    <div className="form-notch"><div className="form-notch-leading" ></div><div className="form-notch-middle" ></div><div className="form-notch-trailing"></div></div></div>

                                <div className="form-outline mb-4">
                                    <label className="form-label" for="form3Example2cg">Email:</label>
                                    <input type="email" id="form3Example2cg" ref={Email} className="form-control form-control-lg" />

                                    <div className="form-notch"><div className="form-notch-leading"></div><div className="form-notch-middle"></div><div className="form-notch-trailing"></div></div></div>
                                <div className="form-outline mb-4">
                                    <label className="form-label" for="form3Example3cg">Địa chỉ:</label>
                                    <input type="text" id="form3Example3cg" ref={diaChi} className="form-control form-control-lg" />

                                    <div className="form-notch"><div className="form-notch-leading"></div><div className="form-notch-middle"></div><div className="form-notch-trailing"></div></div></div>
                                <div className="form-outline mb-4">
                                    <label className="form-label" for="form3Example4cg">Số điện thoại:</label>
                                    <input type="number" id="form3Example4cg" ref={soDienThoai} className="form-control form-control-lg" />
                                    <div className="form-notch"><div className="form-notch-leading"></div><div className="form-notch-middle"></div><div className="form-notch-trailing"></div></div></div>

                                <div className="form-outline mb-4">
                                    <label className="form-label" for="form3Example6cg">Tên tài khoản:</label>
                                    <input type="text" id="form3Example6cg" ref={tenDangNhap} className="form-control form-control-lg" />
                                    <div className="form-notch"><div className="form-notch-leading"></div><div className="form-notch-middle"></div><div className="form-notch-trailing"></div></div></div>

                                <div className="form-outline mb-4">
                                    <label className="form-label" for="form3Example5cdg">Mật khẩu:</label>
                                    <input type="password" id="form3Example5cdg" ref={matKhau} className="form-control form-control-lg" />
                                    <div className="form-notch"><div className="form-notch-leading"></div><div className="form-notch-middle">
                                    </div><div className="form-notch-trailing"></div></div></div>
                                <div className="d-flex justify-content-center">
                                    <button type="button" className="btn btn-success btn-block btn-lg gradient-custom-4 text-body" onClick={handleRegister}>Đăng ký</button>
                                </div>
                                <p className="text-center text-muted mt-5 mb-0">Bạn đã có tài khoản? <NavLink to="/dang-nhap" className="fw-bold text-body"><u>Đăng nhập</u></NavLink></p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}
export default DangKy;