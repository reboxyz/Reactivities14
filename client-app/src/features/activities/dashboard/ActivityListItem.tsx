import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import {
  Item,
  ItemContent,
  ItemHeader,
  ItemMeta,
  ItemDescription,
  ItemExtra,
  Button,
  Label,
  Segment,
  Icon,
} from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";

interface IProps {
  activity: IActivity;
}

const ActivityListItem: React.FC<IProps> = ({ activity }) => {
  return (
    <Segment.Group>
      <Segment>
        <Item.Group>
          <Item>
            <Item.Image size="tiny" circular src="/assets/user.png" />
            <ItemContent>
              <ItemHeader as="a">{activity.title}</ItemHeader>
              <ItemDescription>Hosted by Bob</ItemDescription>
            </ItemContent>
          </Item>
        </Item.Group>
      </Segment>
      <Segment>
        <Icon name="clock" />
        {activity.date}
        <Icon name="marker" />
        {activity.venue}, {activity.city}
      </Segment>
      <Segment secondary>Attendees will go here</Segment>
      <Segment clearing>
        <span>{activity.description}</span>
        <Button
          as={Link}
          to={`/activities/${activity.id}`}
          floated="right"
          content="View"
          color="blue"
        />
      </Segment>
    </Segment.Group>
  );
};

export default observer(ActivityListItem);
