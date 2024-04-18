import { Injectable } from "@nestjs/common";
import { CognitoService } from "src/aws/cognito/cognito.service";
import { GetCompaniesForUser, GetCompanyData } from "src/dynamodb";
import { CompanyModel } from "./Company.model";

@Injectable()
export class CompanyService {
  constructor(private cognitoService: CognitoService) {}

  /**
   * Gets a company information based on that company's id.
   * @param companyId
   * @returns
   */
  public async getCompany(companyId: string): Promise<CompanyModel> {
    try {
      return (await GetCompanyData(companyId)) as Promise<CompanyModel>;
    } catch (e) {
      throw new Error("Unable to get company data");
    }
  }
}
