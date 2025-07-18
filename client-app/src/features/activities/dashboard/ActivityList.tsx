import { Header } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../app/stores/store";
import ActivityListItem from "./ActivityListItem";
import { Fragment } from "react/jsx-runtime";

const ActivityList: React.FC = () => {
  const { activityStore } = useStore();
  const { groupActivitiesByDate } = activityStore;

  return (
    <>
      {groupActivitiesByDate.map(([groupKey, activities]) => (
        <Fragment key={groupKey}>
          <Header sub color="teal">
            {groupKey}
          </Header>

          {activities?.map((activity) => (
            <ActivityListItem key={activity.id} activity={activity} />
          ))}
        </Fragment>
      ))}
    </>
  );
};

export default observer(ActivityList);
