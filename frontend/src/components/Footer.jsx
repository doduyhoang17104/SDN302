import { Link } from 'react-router-dom'
import { FaFacebookF, FaInstagram, FaPinterestP, FaTwitter } from 'react-icons/fa'
import './Footer.css'

function Footer() {
  return (
    <footer className="site-footer px-3 px-lg-4 pt-5 pb-4">
      <div className="row g-4">
        <div className="col-12 col-lg-4">
          <h4 className="footer-brand mb-2">ToyZone</h4>
          <p className="footer-text mb-3">
            Nền tảng cho thuê đồ chơi an toàn, tiết kiệm và tiện lợi.
            Đồ chơi được vệ sinh kỹ trước khi giao đến gia đình bạn.
          </p>
          <div className="footer-social d-flex align-items-center gap-2">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><FaFacebookF /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><FaInstagram /></a>
            <a href="https://pinterest.com" target="_blank" rel="noreferrer" aria-label="Pinterest"><FaPinterestP /></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter"><FaTwitter /></a>
          </div>
        </div>

        <div className="col-6 col-md-4 col-lg-2">
          <h5 className="footer-title">Khám phá</h5>
          <ul className="footer-list">
            <li><Link to="/">Trang chủ</Link></li>
            <li><Link to="/toys">Danh sách đồ chơi</Link></li>
            <li><Link to="/toys">Gói thuê</Link></li>
            <li><Link to="/toys">Hướng dẫn thuê</Link></li>
          </ul>
        </div>

        <div className="col-6 col-md-4 col-lg-3">
          <h5 className="footer-title">Hỗ trợ</h5>
          <ul className="footer-list">
            <li><Link to="/">Câu hỏi thường gặp</Link></li>
            <li><Link to="/">Chính sách đổi trả</Link></li>
            <li><Link to="/">Điều khoản sử dụng</Link></li>
            <li><Link to="/">Bảo mật thông tin</Link></li>
          </ul>
        </div>

        <div className="col-12 col-md-4 col-lg-3">
          <h5 className="footer-title">Nhận ưu đãi mới</h5>
          <p className="footer-text mb-3">Nhập email để nhận thông tin gói thuê và khuyến mãi mỗi tuần.</p>
          <form className="footer-subscribe" onSubmit={(event) => event.preventDefault()}>
            <input type="email" placeholder="Email của bạn" aria-label="Email" />
            <button type="submit">Đăng ký</button>
          </form>
        </div>
      </div>

      <div className="footer-bottom mt-4 pt-3">
        <p className="mb-0">© {new Date().getFullYear()} ToyZone. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
