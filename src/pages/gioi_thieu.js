import Header from "../components/header";
import Footer from "../components/footer";
import ListBanner from "./list_banner";
function GioiThieu()
{
    return(
        <>
        <Header/>
        <ListBanner/>
        <p id="gioi_thieu">
            <h5>Chào mừng bạn đến với HDK - Điểm đến lý tưởng cho mọi nhu cầu về điện thoại di động</h5> 
            Tại HDK, chúng tôi tự hào cung cấp một loạt các sản phẩm từ những nhà sản xuất điện thoại hàng đầu, đảm bảo bạn luôn có được những sự lựa chọn tốt nhất.
            Với đam mê về công nghệ và sự tận tâm với khách hàng, HDK cam kết mang đến những sản phẩm chất lượng cao, từ những chiếc điện thoại thông minh mới nhất đến các mẫu điện thoại cũ đã được kiểm định kỹ lưỡng, phù hợp với mọi yêu cầu và ngân sách.
            Đến với HDK, bạn không chỉ mua sắm được sản phẩm ưng ý mà còn nhận được sự tư vấn nhiệt tình từ đội ngũ chuyên gia của chúng tôi. Chúng tôi luôn sẵn sàng hỗ trợ bạn trong việc lựa chọn sản phẩm phù hợp nhất với nhu cầu và ngân sách của bạn.
            Hãy ghé thăm cửa hàng của chúng tôi hoặc truy cập website để khám phá thêm về các sản phẩm và dịch vụ mà chúng tôi cung cấp. HDK - Nơi công nghệ kết nối mọi người.</p>
        <Footer/>
        </>
    )
}
export default GioiThieu;