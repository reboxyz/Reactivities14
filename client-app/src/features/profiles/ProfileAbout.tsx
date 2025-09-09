import { observer } from "mobx-react-lite";
import { IProfile } from "../../app/models/profile";
import { Button, Grid, Header, Tab } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import { useState } from "react";
import ProfileEditForm from "./ProfileEditForm";

interface IProps {
  profile: IProfile;
}

const ProfileAbout: React.FC<IProps> = ({ profile }) => {
  const { profileStore } = useStore();
  const { editProfile, isCurrentUser } = profileStore;

  const [editMode, setEditMode] = useState(false);

  const handleEditProfile = (profile: Partial<IProfile>) => {
    editProfile(profile).then(() => setEditMode(false));
  };

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16}>
          <Header
            icon="user"
            floated="left"
            content={`About ${profile.displayName}`}
          />
          {isCurrentUser && (
            <Button
              floated="right"
              basic
              content={editMode ? "Cancel" : "Edit Profile"}
              onClick={() => setEditMode(!editMode)}
            />
          )}
        </Grid.Column>
        <Grid.Column width={16}>
          {editMode ? (
            <ProfileEditForm
              profile={profile}
              editProfile={handleEditProfile}
            />
          ) : (
            <span style={{ whiteSpace: "pre-wrap" }}>{profile.bio!}</span>
          )}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};

export default observer(ProfileAbout);
