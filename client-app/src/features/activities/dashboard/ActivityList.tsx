import { ItemGroup, Label } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../app/stores/store";
import ActivityListItem from "./ActivityListItem";

const ActivityList: React.FC = () => {
  const { activityStore } = useStore();
  const { activitiesByDate } = activityStore;

  return (
    <>
      {activitiesByDate.map(([group, activities]) => (
        <>
          <Label size="large" color="blue" key={group}>
            {group}
          </Label>
          <ItemGroup divided>
            {activities.map((activity) => (
              <ActivityListItem key={activity.id} activity={activity} />
            ))}
          </ItemGroup>
        </>
      ))}
    </>
  );
};

export default observer(ActivityList);
