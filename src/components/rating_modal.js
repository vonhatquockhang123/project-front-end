import React, { useState } from 'react';

const RatingModal = ({ orderId, closeModal }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const handleRatingChange = (newRating) => {
        setRating(newRating);
    };

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    const handleRatingSubmit = () => {
        // Xử lý lưu đánh giá ở đây
        console.log("Đánh giá:", rating);

        // Đóng modal sau khi đánh giá được gửi thành công
        closeModal();
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Đánh giá đơn hàng #{orderId}</h2>
                <div onClick={handleRatingChange}>{/* Hiển thị sao và xử lý đánh giá */}</div>
                <textarea value={comment} onChange={handleCommentChange}></textarea>
                <button onClick={handleRatingSubmit}>Gửi đánh giá</button>
                <button onClick={closeModal}>Đóng</button>
            </div>
        </div>
    );
};

export default RatingModal;
