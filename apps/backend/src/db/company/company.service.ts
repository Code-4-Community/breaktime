import { Injectable } from "@nestjs/common";
import { CognitoService } from "src/aws/cognito/cognito.service";
import { GetCompaniesForUser, GetCompanyData } from "src/dynamodb";
import { CompanyModel } from "./Company.model";

@Injectable()
export class CompanyService {
    constructor(private cognitoService: CognitoService) { }

    /**
     * Gets a company information based on that company's id.
     * @param companyId
     * @returns
    */
    async getCompany(companyId: string): Promise<CompanyModel> {
        // try {
        //     const companyData = await GetCompanyData(companyId);
        //     // if (companyData == null) {
        //     //     return [];
        //     // }
        //     return companyData as Promise<CompanyModel>
        //     // return companyData.AssociateIDs.concat(companyData.SupervisorIDs);
        // } catch {
        //     return [] as Promise<CompanyModel>;
        // }
        return await GetCompanyData(companyId) as Promise<CompanyModel>
    }

}