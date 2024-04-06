import React, { useState, useEffect, useContext } from "react";
import { Box, Card, CardBody, CardFooter, Button } from "@chakra-ui/react";
import { DEFAULT_COLORS } from "src/constants";
import ApiClient from "src/components/Auth/apiClient";
import * as updateSchemas from "src/schemas/backend/UpdateTimesheet";
import { StatusType, StatusEntryType } from "src/schemas/StatusSchema";
import { UserTypes } from "./types";
import moment from "moment";
import { useToast } from "@chakra-ui/react";
import { UserContext } from "./UserContext";
import { TimesheetStatus } from "src/schemas/TimesheetSchema";
import { createToast } from "./utils";
import TimeTable from "./TimeTable";
import { TABLE_COLUMNS, CommentType } from "./types";

interface submitCardProps {
  timesheetId: number;
  associateId: string;
  timesheetStatus: StatusType;
  submitDisabled: boolean;
  refreshTimesheetCallback: Function;
}

export default function SubmitCard(props: submitCardProps) {
  const toast = useToast();
  const currUser = useContext(UserContext);

  /** Whether or not the logged-in user has submitted this timesheet yet.*/
  const [timesheetSubmitted, setTimesheetSubmitted] = useState(false);

  /**
   *   The card state which corresponds to the latest status update from the timesheet. Corresponds to card color.
   *   Note that this is *not* dependent on the logged in user. I.e. if the latest status update was that
   *   the supervisor had submitted their timesheet review, the card state would be CardState.InReviewAdmin for
   *   any associate, supervisor, or admin that was viewing the timesheet.
   */
  const [cardState, setCardState] = useState(TimesheetStatus.UNSUBMITTED);
  const [submitDisabled, setSubmitDisabled] = useState(props.submitDisabled);

  // useEffect(()=>{

  // })

  // Run whenever there's an update to the current logged in user (i.e. re-render the correct submission status for the user type)
  useEffect(() => {
    if (currUser === undefined) {
      return;
    }

    let statusEntry: StatusEntryType = undefined;

    // Determine the appropriate status entry to match up with the logged in user's role
    switch (currUser.Type) {
      case UserTypes.Associate:
        statusEntry = props.timesheetStatus.HoursSubmitted;
        break;

      case UserTypes.Supervisor:
        statusEntry = props.timesheetStatus.HoursReviewed;
        break;

      case UserTypes.Admin:
        statusEntry = props.timesheetStatus.Finalized;
        break;
    }

    const isSubmitted = statusEntry !== undefined;
    setTimesheetSubmitted(isSubmitted);

    // Determine the latest status update to set the card state
    if (props.timesheetStatus.Finalized !== undefined) {
      setCardState(TimesheetStatus.FINALIZED);
    } else if (props.timesheetStatus.HoursReviewed !== undefined) {
      setCardState(TimesheetStatus.HOURS_REVIEWED);
    } else if (props.timesheetStatus.HoursSubmitted !== undefined) {
      setCardState(TimesheetStatus.HOURS_SUBMITTED);
    } else {
      setCardState(TimesheetStatus.UNSUBMITTED);
    }
  }, [currUser, props.timesheetStatus, props.timesheetId]);

  const submitAction = async () => {
    console.log("Current user id:", currUser.UserID);
    console.log("IN SUBMIT CARD", props.submitDisabled);
    let statusSubmissionType: string;

    // Determine the appropriate status entry to match up with the logged in user's role
    switch (currUser.Type) {
      case UserTypes.Associate:
        statusSubmissionType = TimesheetStatus.HOURS_SUBMITTED;
        break;

      case UserTypes.Supervisor:
        statusSubmissionType = TimesheetStatus.HOURS_REVIEWED;
        break;

      case UserTypes.Admin:
        statusSubmissionType = TimesheetStatus.HOURS_SUBMITTED;
        break;
    }

    // Update the current timesheet to be submitted by the logged-in user.
    // The type of status can be determined on the backend by the user type
    try {
      // TODO: the parsing of the TimesheetUpdateRequest should really be done in the apiClient - ideally, we don't deal w/ backend schemas at all anywhere other than
      // the ApiClient file
      const response = await ApiClient.updateTimesheet(
        updateSchemas.TimesheetUpdateRequest.parse({
          TimesheetID: props.timesheetId,
          Operation: updateSchemas.TimesheetOperations.STATUS_CHANGE,
          Payload: updateSchemas.StatusChangeRequest.parse({
            TimesheetId: props.timesheetId,
            AssociateId: props.associateId,
            authorId: currUser.UserID, // TODO: Implement authorId functionality instead of dummy data
            statusType: statusSubmissionType,
            dateSubmitted: moment().unix(),
          }),
        })
      );

      // TODO: Confirm successful 2xx code responSse from API
      props.refreshTimesheetCallback();

      toast(
        createToast({
          title: "Successful submission!",
          status: "success",
          duration: 3000,
          isClosable: true,
        })
      );
    } catch (err) {
      console.log(err);
      toast(
        createToast({
          title: "Uh oh, something went wrong...",
          status: "error",
          duration: 3000,
          isClosable: true,
        })
      );
      return;
    }
  };

  return (
    <Box
      className="col-md-2"
      style={{ display: "flex", justifyContent: "flex-end" }}
    >
      <Card
        bg={
          cardState === TimesheetStatus.FINALIZED
            ? "success"
            : cardState === TimesheetStatus.HOURS_REVIEWED ||
              cardState === TimesheetStatus.HOURS_SUBMITTED
            ? "warning"
            : "danger"
        }
        textColor={DEFAULT_COLORS.BREAKTIME_BLUE}
        key="submit_description"
        className="mb-2 text-center"
      >
        <CardBody>
          <fieldset disabled={props.submitDisabled}>
            <Button onClick={submitAction}>
              {timesheetSubmitted ? "Resubmit" : "Submit!"}
            </Button>
          </fieldset>
        </CardBody>
        <CardFooter>
          {/* TODO: The AuthorIDs below should all be replaced with calls to the API and then have a User profile card there instead (or at least the name, rather than ID lol) */}
          <div>
            {props.timesheetStatus.HoursSubmitted &&
            props.timesheetStatus.HoursSubmitted.Date ? (
              <p>
                Associate: {props.timesheetStatus.HoursSubmitted.AuthorID},{" "}
                <br />
                Submitted on:{" "}
                {customDateFormat(props.timesheetStatus.HoursSubmitted.Date)}
              </p>
            ) : (
              <p>Associate: Unsubmitted</p>
            )}

            {props.timesheetStatus.HoursReviewed &&
            props.timesheetStatus.HoursReviewed.Date ? (
              <p>
                Supervsior: {props.timesheetStatus.HoursReviewed.AuthorID},{" "}
                <br />
                Submitted on:{" "}
                {customDateFormat(props.timesheetStatus.HoursReviewed.Date)}
              </p>
            ) : (
              <p>Supervisor: Unsubmitted</p>
            )}

            {props.timesheetStatus.Finalized &&
            props.timesheetStatus.Finalized.Date ? (
              <p>
                Admin: {props.timesheetStatus.Finalized.AuthorID}, <br />
                Submitted on:{" "}
                {customDateFormat(props.timesheetStatus.Finalized.Date)}
              </p>
            ) : (
              <p>Admin: Unsubmitted</p>
            )}
          </div>
        </CardFooter>
      </Card>
    </Box>
  );
}

/** Standardized moment.format() wrapper for epoch to string timestamps */
function customDateFormat(date: number): string {
  return moment.unix(date).format("MM/DD/YYYY HH:mm");
}
