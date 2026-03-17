import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getContractFileUrl, submitSignedContract } from "../../api/contractApi";
import { Document, Page } from "react-pdf";
import "./ContractViewPage.css";

const ContractViewPage = () => {
  const { contractId } = useParams();

  const [pdfUrl, setPdfUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!contractId) {
      setLoading(false);
      setError("No contract ID provided.");
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const url = await getContractFileUrl(contractId);
        setPdfUrl(url);
      } catch (err) {
        setError(err.message || "Failed to load contract.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [contractId]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setSubmitError("Only PDF files are accepted.");
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);
    setSubmitError("");
    setSubmitSuccess(false);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setSubmitError("Please select a signed PDF file first.");
      return;
    }
    try {
      setSubmitLoading(true);
      setSubmitError("");
      await submitSignedContract(contractId, selectedFile);
      setSubmitSuccess(true);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setSubmitError(err.message || "Submission failed.");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="contract-view">
      <header className="contract-view__header">
        <div className="contract-view__logo">Nike Franchise System</div>
        <h1 className="contract-view__title">Franchise Contract</h1>
        {contractId && (
          <p className="contract-view__code">{contractId}</p>
        )}
      </header>

      <main className="contract-view__body">
        {loading && (
          <div className="contract-view__state">
            <div className="contract-view__spinner" />
            <p>Loading contract document...</p>
          </div>
        )}

        {!loading && error && (
          <div className="contract-view__state contract-view__state--error">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && pdfUrl && (
          <div className="contract-view__pdf-wrapper">
            <div className="contract-view__pdf-actions">
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="contract-view__download-btn"
              >
                ↓ Open in new tab
              </a>
            </div>

            <iframe
              className="contract-view__iframe"
              src={pdfUrl}
              title="Franchise Contract PDF"
              allowFullScreen
            />

            <div className="contract-view__submit-section">
              <h2 className="contract-view__submit-title">Submit Signed Contract</h2>
              <p className="contract-view__submit-hint">
                Download the contract, sign it, then upload the signed PDF below.
              </p>

              <div className="contract-view__file-row">
                <label className="contract-view__file-label" htmlFor="signedPdfInput">
                  {selectedFile ? selectedFile.name : "Choose signed PDF…"}
                </label>
                <input
                  id="signedPdfInput"
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  className="contract-view__file-input"
                  onChange={handleFileChange}
                />

                <button
                  type="button"
                  className="contract-view__submit-btn"
                  onClick={handleSubmit}
                  disabled={submitLoading || !selectedFile}
                >
                  {submitLoading ? "Uploading…" : "Save & Submit"}
                </button>
              </div>

              {submitError && (
                <p className="contract-view__submit-feedback contract-view__submit-feedback--error">
                  {submitError}
                </p>
              )}
              {submitSuccess && (
                <p className="contract-view__submit-feedback contract-view__submit-feedback--success">
                  ✓ Signed contract submitted successfully.
                </p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ContractViewPage;
