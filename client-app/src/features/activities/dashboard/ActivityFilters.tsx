import { observer } from "mobx-react-lite";
import Calendar from "react-calendar";
import { Header, Menu } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";

const ActivityFilters = () => {
  const {
    activityStore: { predicate, setPredicate },
  } = useStore();

  return (
    <>
      <Menu
        vertical
        size="large"
        style={{ width: "100%", marginTop: "1.75em" }}
      >
        <Header icon="filter" color="teal" content="Filters" attached />
        <Menu.Item
          content="All Activities"
          active={predicate.has("all")}
          onClick={() => setPredicate("all", "true")}
        />
        <Menu.Item
          content="I'm going"
          active={predicate.has("isGoing")}
          onClick={() => setPredicate("isGoing", "true")}
        />
        <Menu.Item
          content="I'm hosting"
          onClick={() => setPredicate("isHost", "true")}
        />
      </Menu>
      <Header />
      <Calendar
        onChange={(date) => setPredicate("startDate", date as Date)}
        value={predicate.get("startDate") || new Date()}
      />
    </>
  );
};

export default observer(ActivityFilters);
