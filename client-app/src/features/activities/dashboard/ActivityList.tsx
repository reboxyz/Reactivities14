import {
  ItemGroup,
  Item,
  ItemContent,
  ItemHeader,
  ItemMeta,
  ItemDescription,
  ItemExtra,
  Button,
  Label,
  Segment,
} from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";
import React, { useState } from "react";

interface IProps {
  activities: IActivity[];
  selectActivity(id: string): void;
  deleteActivity: (id: string) => void;
  submitting: boolean;
}

const ActivityList: React.FC<IProps> = ({
  activities,
  selectActivity,
  deleteActivity,
  submitting,
}) => {
  const [target, setTarget] = useState("");

  const handleDelete = (id: string) => {
    setTarget(id);
    deleteActivity(id);
  };

  return (
    <Segment clearing>
      <ItemGroup divided>
        {activities.map((activity) => (
          <Item key={activity.id}>
            <ItemContent>
              <ItemHeader as="a">{activity.title}</ItemHeader>
              <ItemMeta>{new Date(activity.date).toISOString()}</ItemMeta>
              <ItemDescription>
                <div>{activity.description}</div>
                <div>
                  {activity.city}, {activity.venue}
                </div>
              </ItemDescription>
              <ItemExtra>
                <Button
                  onClick={() => selectActivity(activity.id)}
                  floated="right"
                  content="View"
                  color="blue"
                />
                <Button
                  onClick={() => handleDelete(activity.id)}
                  floated="right"
                  content="Delete"
                  color="red"
                  loading={submitting && target === activity.id}
                />
                <Label basic content={activity.category} />
              </ItemExtra>
            </ItemContent>
          </Item>
        ))}
      </ItemGroup>
    </Segment>
  );
};

export default ActivityList;
