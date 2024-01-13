import { Card, Room } from "..";
import "./styles.css";

export function Sidebar() {
  return (
    <aside className="sidebar">
      <Card>
        <Room name="Dev Zero" username="devzero" type="primary" />
      </Card>

      <hr className="sidebar__divisor" />

      <div className="sidebar__group">
        <Card>
          <Room name="Developer One" username="devone" type="primary" />
        </Card>

        <Card>
          <Room name="Branium Squad" type="primary" />
        </Card>
      </div>
    </aside>
  );
}
