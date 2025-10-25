-- Add indexes for better query performance
-- This will support hundreds of thousands of records

-- Notifications indexes
CREATE INDEX IF NOT EXISTS "Notification_userId_read_idx" ON "Notification"("userId", "read");
CREATE INDEX IF NOT EXISTS "Notification_userId_createdAt_idx" ON "Notification"("userId", "createdAt" DESC);
CREATE INDEX IF NOT EXISTS "Notification_createdAt_idx" ON "Notification"("createdAt" DESC);

-- Projects indexes
CREATE INDEX IF NOT EXISTS "Project_createdById_idx" ON "Project"("createdById");
CREATE INDEX IF NOT EXISTS "Project_assigneeId_idx" ON "Project"("assigneeId");
CREATE INDEX IF NOT EXISTS "Project_reviewerId_idx" ON "Project"("reviewerId");
CREATE INDEX IF NOT EXISTS "Project_approverId_idx" ON "Project"("approverId");
CREATE INDEX IF NOT EXISTS "Project_status_idx" ON "Project"("status");
CREATE INDEX IF NOT EXISTS "Project_deadline_idx" ON "Project"("deadline");
CREATE INDEX IF NOT EXISTS "Project_createdAt_idx" ON "Project"("createdAt" DESC);
CREATE INDEX IF NOT EXISTS "Project_institutionId_idx" ON "Project"("institutionId");

-- Users indexes
CREATE INDEX IF NOT EXISTS "User_role_idx" ON "User"("role");
CREATE INDEX IF NOT EXISTS "User_status_idx" ON "User"("status");
CREATE INDEX IF NOT EXISTS "User_email_idx" ON "User"("email");

-- Activities indexes
CREATE INDEX IF NOT EXISTS "Activity_userId_idx" ON "Activity"("userId");
CREATE INDEX IF NOT EXISTS "Activity_projectId_idx" ON "Activity"("projectId");
CREATE INDEX IF NOT EXISTS "Activity_createdAt_idx" ON "Activity"("createdAt" DESC);
CREATE INDEX IF NOT EXISTS "Activity_type_idx" ON "Activity"("type");

-- Proofs indexes
CREATE INDEX IF NOT EXISTS "Proof_projectId_idx" ON "Proof"("projectId");
CREATE INDEX IF NOT EXISTS "Proof_uploadedById_idx" ON "Proof"("uploadedById");
CREATE INDEX IF NOT EXISTS "Proof_version_idx" ON "Proof"("version" DESC);
CREATE INDEX IF NOT EXISTS "Proof_uploadedAt_idx" ON "Proof"("uploadedAt" DESC);

-- Reviews indexes
CREATE INDEX IF NOT EXISTS "Review_projectId_idx" ON "Review"("projectId");
CREATE INDEX IF NOT EXISTS "Review_reviewerId_idx" ON "Review"("reviewerId");
CREATE INDEX IF NOT EXISTS "Review_proofId_idx" ON "Review"("proofId");
CREATE INDEX IF NOT EXISTS "Review_decision_idx" ON "Review"("decision");
CREATE INDEX IF NOT EXISTS "Review_createdAt_idx" ON "Review"("createdAt" DESC);

-- Approvals indexes
CREATE INDEX IF NOT EXISTS "Approval_projectId_idx" ON "Approval"("projectId");
CREATE INDEX IF NOT EXISTS "Approval_approverId_idx" ON "Approval"("approverId");
CREATE INDEX IF NOT EXISTS "Approval_status_idx" ON "Approval"("status");
CREATE INDEX IF NOT EXISTS "Approval_createdAt_idx" ON "Approval"("createdAt" DESC);

-- PrintJobs indexes
CREATE INDEX IF NOT EXISTS "PrintJob_projectId_idx" ON "PrintJob"("projectId");
CREATE INDEX IF NOT EXISTS "PrintJob_status_idx" ON "PrintJob"("status");
CREATE INDEX IF NOT EXISTS "PrintJob_createdById_idx" ON "PrintJob"("createdById");
CREATE INDEX IF NOT EXISTS "PrintJob_createdAt_idx" ON "PrintJob"("createdAt" DESC);

-- PickupLogs indexes
CREATE INDEX IF NOT EXISTS "PickupLog_projectId_idx" ON "PickupLog"("projectId");
CREATE INDEX IF NOT EXISTS "PickupLog_confirmedById_idx" ON "PickupLog"("confirmedById");
CREATE INDEX IF NOT EXISTS "PickupLog_pickedUpAt_idx" ON "PickupLog"("pickedUpAt" DESC);

-- Annotations indexes
CREATE INDEX IF NOT EXISTS "Annotation_proofId_idx" ON "Annotation"("proofId");
CREATE INDEX IF NOT EXISTS "Annotation_createdById_idx" ON "Annotation"("createdById");
CREATE INDEX IF NOT EXISTS "Annotation_status_idx" ON "Annotation"("status");

-- Composite indexes for complex queries
CREATE INDEX IF NOT EXISTS "Project_status_deadline_idx" ON "Project"("status", "deadline");
CREATE INDEX IF NOT EXISTS "Project_status_createdAt_idx" ON "Project"("status", "createdAt" DESC);
CREATE INDEX IF NOT EXISTS "Notification_userId_read_createdAt_idx" ON "Notification"("userId", "read", "createdAt" DESC);
