import React, { useState } from "react";
import "./FranchiseModal.css";

const PROVINCES = [
  "Ha Noi","Ho Chi Minh City","Da Nang","Hai Phong","Can Tho",
  "Binh Duong","Dong Nai","Khanh Hoa","Quang Ninh","Thanh Hoa",
  "Nghe An","Ha Tinh","Hue","Quang Nam","Binh Dinh",
  "Lam Dong","Ba Ria - Vung Tau","Long An","Tien Giang","An Giang"
];

const FranchiseModal = ({ isOpen, onClose, onSuccess }) => {

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    idNumber: "",
    address: "",
    experience: "",
    investmentCapital: "",
    preferredLocation: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {

      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phone,
        nationalId: formData.idNumber,
        address: formData.address,
        businessExperience: formData.experience,
        expectedCapital: Number(
          formData.investmentCapital.replace(/,/g, "")
        ),
        preferredRegion: formData.preferredLocation
      };

      const response = await fetch(
        "https://freckly-hyperarchaeological-thea.ngrok-free.dev/api/franchise/applications",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true"
          },
          body: JSON.stringify(payload)
        }
      );

      const result = await response.json();

      console.log("API response:", result);

      if (!response.ok || !result?.succeeded) {
        throw new Error("Failed to submit application");
      }

      const applicationCode = result?.data?.code || "";
      const applicationStatus = result?.data?.status || "";

      alert("Application submitted successfully!");

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        idNumber: "",
        address: "",
        experience: "",
        investmentCapital: "",
        preferredLocation: ""
      });

      onClose();

      if (onSuccess) {
        onSuccess({
          code: applicationCode,
          status: applicationStatus
        });
      }

    } catch (error) {

      console.error("Submit error:", error);

      alert("Submit failed. Please try again.");

    } finally {

      setLoading(false);

    }
  };

  if (!isOpen) return null;

  return (
    <div className="franchise-overlay" onClick={onClose}>
      <div
        className="franchise-modal"
        onClick={(e) => e.stopPropagation()}
      >

        <button
          className="franchise-modal__close"
          onClick={onClose}
        >
          ✕
        </button>

        {/* LEFT INFO */}

        <div className="franchise-modal__info">
          <div className="franchise-modal__info-content">

            <span className="franchise-modal__badge">
              🚀 Franchise Program
            </span>

            <h2 className="franchise-modal__info-title">
              Build Your Future
              <br />
              with Nike
            </h2>

            <p className="franchise-modal__info-desc">
              Join one of the world's most recognized brands and start
              your entrepreneurial journey backed by decades of
              excellence.
            </p>

            <div className="franchise-modal__stats">

              <div className="franchise-modal__stat">
                <span className="franchise-modal__stat-number">
                  500+
                </span>
                <span className="franchise-modal__stat-label">
                  Global Partners
                </span>
              </div>

              <div className="franchise-modal__stat">
                <span className="franchise-modal__stat-number">
                  95%
                </span>
                <span className="franchise-modal__stat-label">
                  Retention Rate
                </span>
              </div>

              <div className="franchise-modal__stat">
                <span className="franchise-modal__stat-number">
                  2.5x
                </span>
                <span className="franchise-modal__stat-label">
                  Average ROI
                </span>
              </div>

            </div>

            <div className="franchise-modal__perks">
              <div className="franchise-modal__perk">
                ✓ Full brand & marketing support
              </div>
              <div className="franchise-modal__perk">
                ✓ Comprehensive training program
              </div>
              <div className="franchise-modal__perk">
                ✓ Exclusive territory rights
              </div>
              <div className="franchise-modal__perk">
                ✓ Ongoing operational guidance
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT FORM */}

        <div className="franchise-modal__form-wrapper">

          <h3 className="franchise-modal__form-title">
            Apply Now
          </h3>

          <p className="franchise-modal__form-subtitle">
            Fill in your details to get started
          </p>

          <form
            className="franchise-modal__form"
            onSubmit={handleSubmit}
          >

            <div className="franchise-modal__field">
              <label className="franchise-modal__label">
                Full Name *
              </label>

              <input
                className="franchise-modal__input"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="franchise-modal__field">
              <label className="franchise-modal__label">
                Email *
              </label>

              <input
                className="franchise-modal__input"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="franchise-modal__row">

              <div className="franchise-modal__field">
                <label className="franchise-modal__label">
                  Phone *
                </label>

                <input
                  className="franchise-modal__input"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="franchise-modal__field">
                <label className="franchise-modal__label">
                  ID / Passport *
                </label>

                <input
                  className="franchise-modal__input"
                  type="text"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

            <div className="franchise-modal__field">

              <label className="franchise-modal__label">
                Permanent Address *
              </label>

              <input
                className="franchise-modal__input"
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />

            </div>

            <div className="franchise-modal__field">

              <label className="franchise-modal__label">
                Business Experience *
              </label>

              <textarea
                className="franchise-modal__textarea"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                rows={3}
                required
              />

            </div>

            <div className="franchise-modal__row">

              <div className="franchise-modal__field">

                <label className="franchise-modal__label">
                  Investment Capital *
                </label>

                <input
                  className="franchise-modal__input"
                  type="text"
                  name="investmentCapital"
                  value={formData.investmentCapital}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="franchise-modal__field">

                <label className="franchise-modal__label">
                  Preferred Location *
                </label>

                <select
                  className="franchise-modal__select"
                  name="preferredLocation"
                  value={formData.preferredLocation}
                  onChange={handleChange}
                  required
                >

                  <option value="">Select province</option>

                  {PROVINCES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}

                </select>

              </div>

            </div>

            <button
              type="submit"
              className="franchise-modal__submit"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>

          </form>

        </div>

      </div>
    </div>
  );
};

export default FranchiseModal;
