import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import {
  Item,
  ItemContent,
  ItemHeader,
  ItemDescription,
  Button,
  Segment,
  Icon,
  Label,
} from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";
import { format } from "date-fns";
import ActivityListItemAttendee from "./ActivityListItemAttendee";

interface IProps {
  activity: IActivity;
}

const ActivityListItem: React.FC<IProps> = ({ activity }) => {
  return (
    <Segment.Group>
      <Segment>
        {activity.isCancelled && (
          <Label
            attached="top"
            color="red"
            content="Cancelled"
            style={{ textAlign: "center" }}
          />
        )}
        <Item.Group>
          <Item>
            <Item.Image
              size="tiny"
              circular
              src="/assets/user.png"
              style={{ marginBottom: "5px" }}
            />
            <ItemContent>
              <ItemHeader as="a">{activity.title}</ItemHeader>
              <ItemDescription>
                Hosted by {activity.host?.displayName}
              </ItemDescription>
              {activity.isHost && (
                <Item.Description>
                  <Label basic color="orange">
                    You are hosting this activity
                  </Label>
                </Item.Description>
              )}
              {activity.isGoing && !activity.isHost && (
                <Item.Description>
                  <Label basic color="green">
                    You are going to this activity
                  </Label>
                </Item.Description>
              )}
            </ItemContent>
          </Item>
        </Item.Group>
      </Segment>
      <Segment>
        <Icon name="clock" />
        {format(activity.date!, "dd MMM yyyy h:mm aa")}
        <Icon name="marker" />
        {activity.venue}, {activity.city}
      </Segment>
      <Segment secondary>
        <ActivityListItemAttendee attendees={activity.attendees} />
      </Segment>
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
