import { auth } from "@clerk/nextjs/server";
import { getLinksByUserId } from "@/data/links";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreateLinkDialog } from "@/components/create-link-dialog";
import { EditLinkDialog } from "@/components/edit-link-dialog";
import { DeleteLinkDialog } from "@/components/delete-link-dialog";

export default async function DashboardPage() {
  const { userId } = await auth();
  const links = await getLinksByUserId(userId!);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Your Links</h1>
        <CreateLinkDialog />
      </div>
      {links.length === 0 ? (
        <p className="text-muted-foreground">No links yet.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {links.map((link) => (
            <li key={link.id}>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base truncate">{link.originalUrl}</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <Badge variant="secondary">/{link.shortCode}</Badge>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground mr-2">
                      {new Date(link.createdAt).toLocaleDateString()}
                    </span>
                    <EditLinkDialog link={link} />
                    <DeleteLinkDialog link={link} />
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
