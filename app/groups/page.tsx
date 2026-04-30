import { getGroups } from "@/lib/api";
import GroupsListPage from "@/app/components/GroupsListPage";

export default async function GroupsPage() {
  const groups = await getGroups();
  return <GroupsListPage groups={groups} />;
}
