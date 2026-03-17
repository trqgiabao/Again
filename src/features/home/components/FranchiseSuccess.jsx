import React from 'react';
import './FranchiseSuccess.css';
const FranchiseSuccess = ({ isOpen, onClose, applicationCode, applicationStatus }) => {
    if (!isOpen) return null;
    return (
        <div className="franchise-overlay" onClick={onClose}>
            <div className="franchise-success" onClick={(e) => e.stopPropagation()}>
                <button className="franchise-success__close" onClick={onClose}>✕</button>
                {/* Left Column - Info */}
                <div className="franchise-success__info">
                    <div className="franchise-success__info-content">
                        <span className="franchise-success__badge">✅ Application Received</span>
                        <h2 className="franchise-success__info-title">Thank You<br />For Applying</h2>
                        <p className="franchise-success__info-desc">
                            Your franchise application has been received and is now under review by our headquarters team.
                        </p>
                        <div className="franchise-success__timeline">
                            <div className="franchise-success__timeline-item franchise-success__timeline-item--active">
                                <div className="franchise-success__timeline-dot" />
                                <div>
                                    <span className="franchise-success__timeline-title">Application Submitted</span>
                                    <span className="franchise-success__timeline-desc">Your documents are in our system</span>
                                </div>
                            </div>
                            <div className="franchise-success__timeline-item">
                                <div className="franchise-success__timeline-dot" />
                                <div>
                                    <span className="franchise-success__timeline-title">Under Review</span>
                                    <span className="franchise-success__timeline-desc">HQ evaluates your application</span>
                                </div>
                            </div>
                            <div className="franchise-success__timeline-item">
                                <div className="franchise-success__timeline-dot" />
                                <div>
                                    <span className="franchise-success__timeline-title">Decision Notification</span>
                                    <span className="franchise-success__timeline-desc">You'll receive an email with the result</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Right Column - Status */}
                <div className="franchise-success__details">
                    <div className="franchise-success__icon-wrapper">
                        <div className="franchise-success__icon">🎉</div>
                    </div>
                    <h3 className="franchise-success__title">Application Submitted Successfully</h3>
                    <p className="franchise-success__subtitle">Your franchise application is now being processed</p>
                    <div className="franchise-success__status-card">
                        <div className="franchise-success__status-row">
                            <span className="franchise-success__status-label">Current Status</span>
                            <span className="franchise-success__status-badge">{applicationStatus || 'PENDING'}</span>
                        </div>
                        <div className="franchise-success__status-row">
                            <span className="franchise-success__status-label">Application Code</span>
                            <span className="franchise-success__status-id">{applicationCode}</span>
                        </div>
                    </div>
                    <div className="franchise-success__info-box">
                        <div className="franchise-success__info-box-item">
                            <span className="franchise-success__info-box-icon">📧</span>
                            <span>HQ will contact you via email within <strong>3–5 business days</strong></span>
                        </div>
                        <div className="franchise-success__info-box-item">
                            <span className="franchise-success__info-box-icon">📋</span>
                            <span>Save your Application Code for future reference</span>
                        </div>
                        <div className="franchise-success__info-box-item">
                            <span className="franchise-success__info-box-icon">⚠️</span>
                            <span>If rejected, you will receive an email explaining the reason</span>
                        </div>
                    </div>
                    <button className="franchise-success__btn" onClick={onClose}>
                        Back to Homepage
                    </button>
                </div>
            </div>
        </div>
    );
};
export default FranchiseSuccess;