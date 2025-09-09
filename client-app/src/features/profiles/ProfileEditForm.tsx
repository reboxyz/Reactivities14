import { IProfile } from "../../app/models/profile";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import MyTextInput from "../../app/common/form/MyTextInput";
import MyTextArea from "../../app/common/form/MyTextArea";
import { Button } from "semantic-ui-react";
import { observer } from "mobx-react-lite";

interface IProps {
  profile: IProfile;
  editProfile: (profile: Partial<IProfile>) => void;
}

const ProfileEditForm: React.FC<IProps> = ({ profile, editProfile }) => {
  const validationSchema = Yup.object({
    displayName: Yup.string().required(),
  });
  return (
    <Formik
      validationSchema={validationSchema}
      enableReinitialize
      initialValues={profile}
      onSubmit={(values) => editProfile(values)}
    >
      {({ handleSubmit, isValid, isSubmitting, dirty }) => (
        <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
          <MyTextInput name="displayName" placeholder="Display Name" />
          <MyTextArea name="bio" placeholder="Biography" rows={5} />
          <Button
            floated="right"
            type="submit"
            color="green"
            content="Update"
            disabled={!isValid || isSubmitting || !dirty}
          />
        </Form>
      )}
    </Formik>
  );
};

export default observer(ProfileEditForm);
