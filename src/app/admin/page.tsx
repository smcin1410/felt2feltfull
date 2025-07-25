import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TournamentAdminTab } from "@/components/admin/TournamentAdminTab";
import { AuditLogTab } from "@/components/admin/AuditLogTab";
import { DestinationAdminTab } from "@/components/admin/DestinationAdminTab";
import { BlogAdminTab } from "@/components/admin/BlogAdminTab";
import { UserAdminTab } from "@/components/admin/UserAdminTab";
// Import other tab components once created

export default function AdminPage() {
  return (
    <main className="container mx-auto py-12 px-4">
      <h1 className="font-monoton text-5xl text-center mb-12 text-white glow-subtle">
        Administration
      </h1>
      <Tabs defaultValue="tournaments" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="tournaments">Tournaments</TabsTrigger>
          <TabsTrigger value="destinations">Destinations</TabsTrigger>
          <TabsTrigger value="blog">Blog Posts</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="auditlog">Audit Log</TabsTrigger>
        </TabsList>

        <TabsContent value="tournaments">
          <TournamentAdminTab />
        </TabsContent>

        <TabsContent value="destinations">
          <DestinationAdminTab />
        </TabsContent>

        <TabsContent value="blog">
          <BlogAdminTab />
        </TabsContent>

        <TabsContent value="users">
          <UserAdminTab />
        </TabsContent>

        <TabsContent value="auditlog">
          <AuditLogTab />
        </TabsContent>
      </Tabs>
    </main>
  );
} 