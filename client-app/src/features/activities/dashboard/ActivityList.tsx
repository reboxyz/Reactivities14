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

import React from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../app/stores/store";

const ActivityList: React.FC = () => {
  const { activityStore } = useStore();
  const {
    activitiesByDate,
    selectActivity,
    deleteActivity,
    submitting,
    target,
  } = activityStore;

  return (
    <Segment clearing>
      <ItemGroup divided>
        {activitiesByDate.map((activity) => (
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
                  onClick={() => deleteActivity(activity.id)}
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

export default observer(ActivityList);
