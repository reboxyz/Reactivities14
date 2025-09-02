import { observer } from "mobx-react-lite";
import { Button, Card, Grid, Header, Image, Tab } from "semantic-ui-react";
import { IPhoto, IProfile } from "../../app/models/profile";
import { useStore } from "../../app/stores/store";
import { SyntheticEvent, useState } from "react";
import PhotoUploadWidget from "../../app/common/imageUpload/PhotoUploadWidget";

interface IProps {
  profile: IProfile;
}

const ProfilePhotos: React.FC<IProps> = ({ profile }) => {
  const { profileStore } = useStore();
  const {
    isCurrentUser,
    uploadPhoto,
    uploading,
    setMainPhoto,
    loading,
    deletePhoto,
    deleting,
  } = profileStore;

  const [addPhotoMode, setAddPhotoMode] = useState(false);
  const [targetName, setTargetName] = useState("");

  const handlePhotoUpload = (file: Blob) => {
    uploadPhoto(file).then(() => setAddPhotoMode(false));
  };

  const handleSetMainPhoto = (
    photo: IPhoto,
    e: SyntheticEvent<HTMLButtonElement>
  ) => {
    setTargetName(e.currentTarget.name);
    setMainPhoto(photo);
  };

  const handleDeletePhoto = (
    photo: IPhoto,
    e: SyntheticEvent<HTMLButtonElement>
  ) => {
    setTargetName(e.currentTarget.name);
    deletePhoto(photo);
  };

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16}>
          <Header icon="image" content="Photos" floated="left" />
          {isCurrentUser && (
            <Button
              floated="right"
              basic
              content={addPhotoMode ? "Cancel" : "Add Photo"}
              onClick={() => setAddPhotoMode(!addPhotoMode)}
            />
          )}
        </Grid.Column>
        <Grid.Column width={16}>
          {addPhotoMode ? (
            <PhotoUploadWidget
              uploadPhoto={handlePhotoUpload}
              loading={uploading}
            />
          ) : (
            <Card.Group itemsPerRow={5}>
              {profile.photos?.map((photo) => (
                <Card key={photo.id}>
                  <Image src={photo.url} />
                  {isCurrentUser && (
                    <Button.Group fluid widths={2}>
                      <Button
                        basic
                        color="green"
                        content="Main"
                        name={"main" + photo.id}
                        disabled={photo.isMain}
                        onClick={(e) => handleSetMainPhoto(photo, e)}
                        loading={targetName === "main" + photo.id && loading}
                      />
                      <Button
                        basic
                        color="red"
                        icon="trash"
                        disabled={photo.isMain}
                        name={photo.id}
                        onClick={(e) => handleDeletePhoto(photo, e)}
                        loading={targetName === photo.id && deleting}
                      />
                    </Button.Group>
                  )}
                </Card>
              ))}
            </Card.Group>
          )}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};

export default observer(ProfilePhotos);
