import { Button, Grid, Header, Segment } from "semantic-ui-react";
import { ActivityFormValues } from "../../../app/models/activity";
import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../app/stores/store";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import MyTextInput from "../../../app/common/form/MyTextInput";
import MyTextArea from "../../../app/common/form/MyTextArea";
import MySelectInput from "../../../app/common/form/MySelectInput";
import { categoryOptions } from "../../../app/common/options/categoryOptions";
import MyDateInput from "../../../app/common/form/MyDateInput";

const ActivityForm: React.FC = () => {
  const { activityStore } = useStore();
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();

  const { createActivity, editActivity, loadActivity, clearActivity } =
    activityStore;

  const [activity, setActivity] = useState<ActivityFormValues>(
    new ActivityFormValues()
  );

  const validationScheme = Yup.object({
    title: Yup.string().required("The activity title is required."),
    description: Yup.string().required("The activity description is required."),
    category: Yup.string().required("The activity category is required."),
    date: Yup.string().required("The activity date is required."),
    city: Yup.string().required("The activity city is required."),
    venue: Yup.string().required("The activity venue is required."),
  });

  useEffect(() => {
    if (id) {
      loadActivity(id).then((activity) =>
        setActivity(new ActivityFormValues(activity))
      );
    }

    // cleanup
    return () => {
      clearActivity();
    };
  }, [id, loadActivity, clearActivity]);

  const handleFormSubmit = (activity: ActivityFormValues) => {
    if (!activity.id) {
      let newActivity = {
        ...activity,
        id: uuid(),
      };
      createActivity(newActivity).then(() =>
        navigate(`/activities/${newActivity.id}`)
      );
    } else {
      editActivity(activity).then(() => navigate(`/activities/${activity.id}`));
    }
  };

  return (
    <Grid>
      <Grid.Column width={10}>
        <Segment clearing>
          <Header content="Activity Details" sub color="teal" />
          <Formik
            validationSchema={validationScheme}
            enableReinitialize
            initialValues={activity}
            onSubmit={(values) => handleFormSubmit(values)}
          >
            {({ handleSubmit, isValid, isSubmitting, dirty }) => (
              <Form onSubmit={handleSubmit} className="ui form">
                <MyTextInput name="title" placeholder="Title" />
                <MyTextArea
                  name="description"
                  rows={2}
                  placeholder="Description"
                />
                <MySelectInput
                  name="category"
                  placeholder="Category"
                  options={categoryOptions}
                />
                <MyDateInput
                  name="date"
                  placeholderText="Date"
                  showTimeSelect
                  timeCaption="time"
                  dateFormat="MMMM d, yyyy h:mm aa"
                />
                <Header content="Location Details" sub color="teal" />
                <MyTextInput name="city" placeholder="City" />
                <MyTextInput name="venue" placeholder="Venue" />
                <Button
                  floated="right"
                  positive
                  type="submit"
                  content="Submit"
                  loading={isSubmitting}
                  disabled={isSubmitting || !dirty || !isValid}
                />
                <Button
                  floated="right"
                  type="button"
                  content="Cancel"
                  onClick={() => navigate("/activities")}
                />
              </Form>
            )}
          </Formik>
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityForm);
