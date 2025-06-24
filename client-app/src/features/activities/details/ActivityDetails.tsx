import {
  Card,
  CardContent,
  CardHeader,
  CardMeta,
  CardDescription,
  Image,
  Button,
} from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../app/stores/store";

const ActivityDetails: React.FC = () => {
  const { activityStore } = useStore();
  const {
    selectedActivity: activity,
    openEditForm,
    cancelSelectedActivity,
  } = activityStore;

  return (
    <Card fluid>
      <Image
        src={`/assets/categoryImages/${activity!.category}.jpg`}
        wrapped
        ui={false}
      />
      <CardContent>
        <CardHeader>{activity!.title}</CardHeader>
        <CardMeta>
          <span>{new Date(activity!.date).toISOString()}</span>
        </CardMeta>
        <CardDescription>{activity!.description}</CardDescription>
      </CardContent>
      <CardContent extra>
        <Button.Group widths={2}>
          <Button
            basic
            color="blue"
            content="Edit"
            onClick={() => openEditForm(activity!.id)}
          />
          <Button
            basic
            color="grey"
            content="Cancel"
            onClick={() => cancelSelectedActivity()}
          />
        </Button.Group>
      </CardContent>
    </Card>
  );
};

export default observer(ActivityDetails);
