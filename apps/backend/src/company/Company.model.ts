/**
 * Represents the model schema of a Company
 */
export type CompanyModel = {
  CompanyId: string;
  CompanyName: string;
  AssociateIds: string[];
  SupervisorIds: string[];
};
