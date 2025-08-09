import { observer } from "mobx-react-lite";
import { IActivity } from "../../../app/models/activity";
import { Segment, Item, Header, Button, Image, Label } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { useStore } from "../../../app/stores/store";

interface IProps {
  activity: IActivity;
}

const activityImageStyle = {
  filter: "brightness(30%)",
};

const activityImageTextStyle = {
  position: "absolute",
  bottom: "5%",
  left: "5%",
  width: "100%",
  height: "auto",
  color: "white",
};

const ActivityDetailedHeader: React.FC<IProps> = ({ activity }) => {
  const { activityStore } = useStore();
  const { updateAttendance, loading, cancelActivityToggle } = activityStore;
  return (
    <Segment.Group>
      <Segment basic attached="top" style={{ padding: "0" }}>
        {activity.isCancelled && (
          <Label
            style={{ position: "absolute", zIndex: 1000, left: -14, top: 20 }}
            ribbon
            color="red"
            content="Cancelled"
          />
        )}
        <Image
          src={
            activity.category
              ? `/assets/categoryImages/${activity.category}.jpg`
              : `/assets/placeholder.png`
          }
          fluid
          style={activityImageStyle}
        />
        <Segment basic style={activityImageTextStyle}>
          <Item.Group>
            <Item>
              <Item.Content>
                <Header
                  size="huge"
                  content={activity.title}
                  style={{ color: "white" }}
                />
                <p>{format(activity.date!, "dd MMM yyyy")}</p>
                <p>
                  Hosted by{" "}
                  <strong>
                    <Link to={`/profiles/${activity.host?.username}`}>
                      {activity.host?.displayName}
                    </Link>
                  </strong>
                </p>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
      </Segment>
      <Segment clearing attached="bottom">
        {activity.isHost ? (
          <>
            <Button
              color={activity.isCancelled ? "green" : "red"}
              floated="left"
              basic
              content={
                activity.isCancelled
                  ? "Re-activate Activity"
                  : "Cancel Activity"
              }
              onClick={cancelActivityToggle}
              loading={loading}
            />

            <Button
              color="orange"
              floated="right"
              as={Link}
              to={`/manage/${activity.id}`}
              disabled={activity.isCancelled}
            >
              Manage Event
            </Button>
          </>
        ) : activity.isGoing ? (
          <Button onClick={updateAttendance} loading={loading}>
            Cancel attendance
          </Button>
        ) : (
          <Button
            onClick={updateAttendance}
            color="teal"
            loading={loading}
            disabled={activity.isCancelled}
          >
            Join Activity
          </Button>
        )}
      </Segment>
    </Segment.Group>
  );
};

export default observer(ActivityDetailedHeader);
