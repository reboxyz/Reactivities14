import React from "react";
import { Profile } from "../../app/models/profile";
import { observer } from "mobx-react-lite";
import { Card, Icon, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";
import FollowButton from "./FollowButton";

interface IProps {
  profile: Profile;
}

const ProfileCard: React.FC<IProps> = ({ profile }) => {
  return (
    <Card as={Link} to={`/profiles/${profile.username}`}>
      <Image src={profile.image || "/assets/user.png"} />
      <Card.Content>
        <Card.Header>{profile.displayName}</Card.Header>
        <Card.Description>
          {profile.bio && profile.bio.length > 30
            ? profile.bio?.substring(0, 30) + "..."
            : profile.bio}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Icon name="user" />
        {profile.followersCount} follower(s)
      </Card.Content>
      <FollowButton profile={profile} />
    </Card>
  );
};

export default observer(ProfileCard);
