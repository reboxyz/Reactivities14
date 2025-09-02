import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Header, Icon } from "semantic-ui-react";

interface IProps {
  setFiles: (files: any[]) => void;
}

const PhotoWidgetDropzone: React.FC<IProps> = ({ setFiles }) => {
  const dzStyles = {
    border: "dashed 3px #eee",
    borderColor: "#eee",
    borderRadius: "30px",
    textAlign: "center" as "center", // Note! TS annoyance
    height: 200,
  };

  const dzActive = {
    borderColor: "green",
  };

  const onDrop = useCallback(
    (acceptedFiles: any[]) => {
      setFiles(
        acceptedFiles.map((file: any) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
    [setFiles]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      style={isDragActive ? { ...dzStyles, ...dzActive } : { ...dzStyles }}
    >
      <input {...getInputProps()} />
      <Icon name="upload" size="huge" />
      <Header content="Drop image here" />
    </div>
  );
};

export default PhotoWidgetDropzone;
