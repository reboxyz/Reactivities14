import React from "react";
import { Profile } from "../../app/models/profile";
import { observer } from "mobx-react-lite";
import { Card, Icon, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";

interface IProps {
  profile: Profile;
}

const ProfileCard: React.FC<IProps> = ({ profile }) => {
  return (
    <Card as={Link} to={`/profiles/${profile.username}`}>
      <Image src={profile.image || "/assets/user.png"} />
      <Card.Content>
        <Card.Header>{profile.displayName}</Card.Header>
        <Card.Description>Bio goes here</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Icon name="user" />
        20 followers
      </Card.Content>
    </Card>
  );
};

export default observer(ProfileCard);
