ALTER TABLE "_organizationUsers" RENAME COLUMN "OrganizationId" TO "A";
ALTER TABLE "_organizationUsers" RENAME COLUMN "UserId" TO "B";


-- -- CreateIndex
-- CREATE UNIQUE INDEX "_organizationUsers_AB_unique" ON "_organizationUsers"("A", "B");

-- -- CreateIndex
-- CREATE INDEX "_organizationUsers_B_index" ON "_organizationUsers"("B");

-- -- CreateIndex
-- CREATE INDEX "_organizationUsers_A_index" ON "_organizationUsers"("A");

-- -- AddForeignKey
-- ALTER TABLE "_organizationUsers" ADD CONSTRAINT "_organizationUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE "_organizationUsers" ADD CONSTRAINT "_organizationUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
