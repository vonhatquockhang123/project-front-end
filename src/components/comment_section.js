import React, { useState } from 'react';

const CommentSection = ({ binhLuan }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 2;

  // Tính tổng số trang
  const totalPages = Math.ceil(binhLuan.length / commentsPerPage);

  // Lấy bình luận cho trang hiện tại
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = binhLuan.slice(indexOfFirstComment, indexOfLastComment);

  // Điều hướng trang
  const goToNextPage = () => setCurrentPage(page => Math.min(page + 1, totalPages));
  const goToPreviousPage = () => setCurrentPage(page => Math.max(page - 1, 1));

  return (
    <div className="comment-section">
      <h5>Bình luận:</h5>
      <ul className="comment-list">
        {currentComments.map((item, index) => (<>
          <li key={index} className="comment-item">
            <div className="comment-header">
              <span className="user-name">{item.khach_hang.ho_ten}</span>
              <span className="comment-date">{item.ngay_tao}</span>
            </div>
            <p className="comment-text">{item.noi_dung}</p>
          </li>

          <li key={index} className="comment-item-1">
          <div className="comment-header-1">
            <span className="user-name-1">{item.chi_tiet_binh_luan.quan_tri.ho_ten}</span>
            <span className="comment-date-1">{item.chi_tiet_binh_luan.ngay_tao}</span>
          </div>
          <p className="comment-text-1">{item.chi_tiet_binh_luan.noi_dung}</p>
          </li>
          </>

        ))}
      </ul>
      <div className="pagination" id="pagination-comment">
        <button onClick={goToPreviousPage} disabled={currentPage === 1} className='pagination-1'>{'<<'}</button>
        <span className='so-trang-bl'>Trang {currentPage} trên {totalPages}</span>
        <button onClick={goToNextPage} disabled={currentPage === totalPages} className='pagination-2'>{'>>'}</button>
      </div>
    </div>
  );
};

export default CommentSection;
