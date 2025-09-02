import { Cropper } from "react-cropper";
import "cropperjs/dist/cropper.css";

interface IProps {
  setCropper: (cropper: Cropper) => void;
  imagePreview: string;
}

const PhotoWidgetCropper: React.FC<IProps> = ({ setCropper, imagePreview }) => {
  return (
    <Cropper
      src={imagePreview}
      style={{ height: 200, width: "100%" }} // Note! height should be equal to PhotoWidgetDropzone's
      initialAspectRatio={1} // square
      preview=".img-preview" // Note! This is the className to contain the div image
      guides={true}
      viewMode={1}
      autoCropArea={1}
      background={false}
      onInitialized={(cropper) => setCropper(cropper)}
    />
  );
};

export default PhotoWidgetCropper;
