import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";
import { Card, Grid, Header, Tab } from "semantic-ui-react";
import ProfileCard from "./ProfileCard";
import ProfileStore from "../../app/stores/profileStore";

const ProfileFollowings = () => {
  const { profileStore } = useStore();
  const { profile, followings, loadingFollowings, activeTab } = profileStore;

  return (
    <Tab.Pane loading={loadingFollowings}>
      <Grid>
        <Grid.Column width={16}>
          <Header
            floated="left"
            icon="user"
            content={
              activeTab === ProfileStore.FOLLOWERS_TAB
                ? `People following ${profile?.displayName}`
                : `People followed by ${profile?.displayName}`
            }
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Card.Group itemsPerRow={4}>
            {followings.map((prof) => (
              <ProfileCard key={prof.username} profile={prof} />
            ))}
          </Card.Group>
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};

export default observer(ProfileFollowings);
