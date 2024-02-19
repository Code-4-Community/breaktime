import { Auth } from "aws-amplify";
import axios, { AxiosInstance } from "axios";
import { TimeSheetSchema } from "../../schemas/TimesheetSchema";
import { UserSchema } from "../../schemas/UserSchema";
import { ReportOptions, UserTypes } from "../TimeCardPage/types";
import React, { useState } from 'react';

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

  

  // TODO: setup endpoint for getting user information
  // all roles -> return UserSchema for the current user that is logged in
  public async getUser(u): Promise<UserSchema> {

 
    // console.log("BEFORE USER ID")
    // const userId = '4c8c5ad4-a8ab-4c92-b33f-b8f932b9e0b5'


    // we now have the current user's user ID, which is passed in as a prop due to the useEffect() in Timesheet.tsx
    const userId = u.UserID

    // console.log(u)
    // console.log(userId)

    // console.log("AFTER USER ID")

    // console.log("HELLO")
    // let user: UserModel = undefined;
    // const user = undefined
    var userConverted = {}
    this.get(`/user/usersById?userIds[]=${userId}`).then((userList) => {
      // user = userList[0];
      // console.log('getUser reponse: ', userList[0]);
      // console.log("REACHED")
      // console.log('getUser reponse: ', userList[0]);
      console.log("USER NOW", userId)

      // console.log(userList)
      var userType = {}

      // console.log("BEFORE USER list")
      // console.log(userList[0])
      // console.log("AFTER USER list")

      if (userList[0].Type === 'breaktime-associate') {
        userType = UserTypes.Associate
      }
      else {
        userType = UserTypes.Supervisor
      }

      userConverted =  {
        UserID: userList[0].userID,
        FirstName: userList[0].firstName,
        LastName: userList[0].lastName,
        Type: userType
      };

      // console.log(userConverted)
      return userConverted
    })

    // console.log("HELLO2")
    // console.log(userConverted)
    return userConverted

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
