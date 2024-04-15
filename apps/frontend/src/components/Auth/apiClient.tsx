import { Auth } from "aws-amplify";
import axios, { AxiosInstance } from "axios";
import { TimeSheetSchema } from "../../schemas/TimesheetSchema";
import { UserSchema } from "../../schemas/UserSchema";
import { ReportOptions, UserTypes } from "../TimeCardPage/types";
import React, { useState } from "react";
import { getCurrentUser } from "../Auth/UserUtils";
import moment, { Moment } from "moment-timezone";

const defaultBaseUrl =
  process.env.REACT_APP_API_BASE_URL ?? "http://localhost:3000";
// Required to use nock with axios (note: do not use nock, just use jest to mock the apiClient)
axios.defaults.adapter = require("axios/lib/adapters/http");

interface ApiClientOptions {
  /**
   * Skips Cognito authentication.
   */
  skipAuth?: boolean;
}

export class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor(
    baseURL: string = defaultBaseUrl,
    options: ApiClientOptions = {}
  ) {
    this.axiosInstance = axios.create({
      baseURL,
    });
    if (!options.skipAuth) {
      this.axiosInstance.interceptors.request.use(async (config) => {
        try {
          const modifiedConfig = config;
          const session = await Auth.currentSession();
          const jwt = session.getAccessToken().getJwtToken();
          if (modifiedConfig.headers !== undefined) {
            modifiedConfig.headers.Authorization = `Bearer ${jwt}`;
          }
          return modifiedConfig;
        } catch (error) {
          console.log("Frontend Auth has a problem", error);
          return config;
        }
      });
    }
  }
  public async signout() {
    try {
      await Auth.signOut();
    } catch (error) {
      console.log("Could not sign out: ", error);
    }
  }

  private async get(path: string): Promise<unknown> {
    return this.axiosInstance.get(path).then((response) => response.data);
  }

  private async post(path: string, body: unknown): Promise<unknown> {
    return this.axiosInstance
      .post(path, body)
      .then((response) => response.data);
  }

  private async patch(path: string, body: unknown): Promise<unknown> {
    return this.axiosInstance
      .patch(path, body)
      .then((response) => response.data);
  }

  public async updateTimesheet(req): Promise<unknown> {
    return this.axiosInstance.post("/auth/timesheet", req);
  }

  // TODO: setup endpoint for associate/supervisor/admin so it returns a list of timesheets for given uuid
  public async getUserTimesheets(UUID: string): Promise<TimeSheetSchema[]> {
    return this.get("auth/timesheet") as Promise<TimeSheetSchema[]>;
  }

  public async updateUserTimesheet(updatedEntry): Promise<Boolean> {
    //TODO - Format json?
    return this.post("/auth/timesheet", {
      timesheet: updatedEntry,
    }) as Promise<Boolean>;
  }

  public async getPasswordTest(): Promise<string> {
    return this.get("/auth/timesheet") as Promise<string>;
  }

  // a function that returns list of multiple users based on list of userIds passed in
  public async getUsers(userIds: String[]): Promise<UserSchema[]> {
    var allUsers;

    try {
      allUsers = await Promise.all(
        userIds.map((userId) => this.getUser(userId))
      );
    } catch (e) {
      console.log(e);
    }

    return allUsers;
  }

  // TODO: setup endpoint for getting user information
  // all roles -> return UserSchema for the current user that is logged in
  public async getUser(UserID: String): Promise<UserSchema> {
    const userId = UserID;

    var userConverted = {};

    console.log("passed into getUser", UserID);

    try {
      await this.get(`/user/usersById?userIds[]=${userId}`).then((userList) => {
        var userType = {};
        console.log("userlist", userList);

        // set current user's type
        if (userList[0].Type === "breaktime-associate") {
          userType = UserTypes.Associate;
        } else {
          userType = UserTypes.Supervisor;
        }

        // create current user
        userConverted = {
          UserID: userList[0].userID,
          FirstName: userList[0].firstName,
          LastName: userList[0].lastName,
          Type: userType,
        };
      });
    } catch (e) {
      console.log(e);
    }

    return userConverted;
  }

  //TODO: hook up to backend, izzys pr has it just not merged yet
  public async getAllUsers(): Promise<UserSchema[]> {
    return [
      {
        UserID: "bcd",
        FirstName: "joe",
        LastName: "jane",
        Type: UserTypes.Associate,
        Picture: "https://www.google.com/panda.png",
      },
    ];
  }

  // mock data for testing
  public async getAssociateDueDate(): Promise<number> {
    const dueDate: number = 1813215921;
    return dueDate;
  }

  // mock data for testing
  public async getSupervisorDueDate(): Promise<number> {
    const dueDate: number = 1715822319; // old date example
    return dueDate;
  }

  //TODO: hook up to backend
  public async saveComment(
    comment: string,
    timesheetID: number
  ): Promise<Boolean> {
    return true;
  }

  //TODO: hook up to backend
  public async saveReport(
    report: ReportOptions,
    timesheetID: number
  ): Promise<Boolean> {
    return true;
  }
}
export default new ApiClient();
