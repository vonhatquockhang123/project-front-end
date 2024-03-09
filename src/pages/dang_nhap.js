//import { NavLink } from 'react-router-dom';
import '../bootstrap-5.2.3-dist/css/bootstrap.min.css';
import '../App';
import { NavLink,useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; 
import { ToastContainer } from 'react-toastify';


function DangNhap() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate=useNavigate();

  const handleLogin = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://127.0.0.1:8000/api/dang-nhap',{
          email:email,
          password:password,
        },{
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
        
      });
      if (response.status === 200) {
        const Dt = await response.data;
        localStorage.setItem('token', Dt.access_token);
        alert("Đăng nhập thành công")
        navigate('/');
      } else {
        const data = await response.data;
        console.error('Login failed:', data.error);
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


  return (
    <>
    <ToastContainer/>
    <div className="row justify-content-center">
    <div className="col-12 col-md-8 col-lg-6 col-xl-6">
        <div className="card shadow-2-strong">
            <div className="card-body p-5 text-center">
                <h3 className="mb-5">Đăng nhập</h3>

                <div className="mb-4">
                    <label className="form-label" htmlFor="typeEmailX-2">
                        Email:
                    </label>
                    <input
                        type="email"
                        id="typeEmailX-2"
                        name="email"
                        className="form-control form-control-lg"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <label className="form-label" htmlFor="typePasswordX-2">
                        Mật khẩu:
                    </label>
                    <input
                        type="password"
                        name="password"
                        id="typePasswordX-2"
                        className="form-control form-control-lg"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className="form-check d-flex justify-content-between mb-3">
                    <div>
                        <input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            id="form1Example3"
                        />
                        <label className="form-check-label" htmlFor="form1Example3">
                            Remember password
                        </label>
                    </div>
                    <NavLink className="quen-mat-khau" to="/quen-mat-khau">
                        Quên mật khẩu
                    </NavLink>
                </div>

                <button
                    className="btn btn-primary btn-lg btn-block mb-3"
                    type="button"
                    onClick={handleLogin}
                >
                    Đăng nhập
                </button>

                <p className="mb-0">
                    <NavLink className="login-main" to="/">
                         Trang chủ{'<<'}
                    </NavLink>{' '}
                    Bạn chưa có tài khoản?{' '}
                    <NavLink className="btn-lg btn-block btn-link" to="/dang-ky">
                        Đăng ký
                    </NavLink>
                </p>
            </div>
        </div>
    </div>
</div>

    </>
  )
}
export default DangNhap;