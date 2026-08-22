import { useEffect, useRef, useState } from "react";
import { IMAGE_ACCEPT, validateImageFile } from "../lib/uploadImage";
import "./ImageUploadField.css";

function ImageUploadField({
  id,
  label,
  currentUrl = "",
  onChange,
  onError,
  resetKey = 0,
  disabled = false,
}) {
  const [previewUrl, setPreviewUrl] = useState(currentUrl);
  const inputRef = useRef(null);

  useEffect(() => {
    setPreviewUrl(currentUrl);
    if (inputRef.current) inputRef.current.value = "";
  }, [currentUrl, resetKey]);

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      validateImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
      onError?.(null);
      onChange({ file, remove: false });
    } catch (error) {
      e.target.value = "";
      onError?.(error.message);
    }
  };

  const handleRemove = () => {
    setPreviewUrl("");
    if (inputRef.current) inputRef.current.value = "";
    onError?.(null);
    onChange({ file: null, remove: true });
  };

  return (
    <div className="image-upload-field">
      <div className="image-upload-heading">
        <label htmlFor={id}>{label}</label>
        <span>PNG, JPG, WebP or GIF · max 5 MB</span>
      </div>

      {previewUrl && (
        <div className="image-upload-preview">
          <img src={previewUrl} alt="Selected upload preview" />
          <button type="button" onClick={handleRemove} disabled={disabled}>
            Remove image
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={IMAGE_ACCEPT}
        onChange={handleChange}
        disabled={disabled}
      />
    </div>
  );
}

export default ImageUploadField;
