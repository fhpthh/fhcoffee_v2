import React, { useState } from 'react';
import './ReviewSection.css';
import { reviews } from '../../assets/assets';

const clampLines = 2;

const ReviewSection = () => {
    const [expanded, setExpanded] = useState({});

    const handleToggle = idx => {
        setExpanded(prev => ({ ...prev, [idx]: !prev[idx] }));
    };

    return (
        <div className="review-section">
            <h2>Review</h2>
            <div className="review-list">
                {reviews.map((review, idx) => {
                    const isLong = review.text.length > 100; // hoặc kiểm tra số dòng thực tế nếu muốn
                    return (
                        <div className="review-card" key={idx}>
                            <div className="review-stars">★★★★★</div>
                            <div className={expanded[idx] ? 'review-text' : 'review-text clamp'}>
                                {review.text}
                            </div>
                            {isLong && (
                                <button className="review-readmore" onClick={() => handleToggle(idx)}>
                                    {expanded[idx] ? 'Ẩn bớt' : 'Đọc thêm'}
                                </button>
                            )}
                            <div className="review-user">
                                <img src={review.avatar} alt={review.name} className="review-avatar" />
                                <div>
                                    <div className="review-name">{review.name}</div>
                                    <div className="review-role">{review.role}</div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ReviewSection; 