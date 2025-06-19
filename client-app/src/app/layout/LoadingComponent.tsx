import { Dimmer, Loader } from "semantic-ui-react";

interface IProps {
  inverted?: boolean;
  content?: string;
}

const LoadingComponent: React.FC<IProps> = ({
  inverted = true,
  content = "Loading...",
}) => {
  return (
    <Dimmer active inverted={inverted}>
      <Loader content={content} />
    </Dimmer>
  );
};

export default LoadingComponent;
