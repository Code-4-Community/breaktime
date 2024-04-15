import React, { useEffect, useState } from "react";
import { ShiftSchema } from "src/shared-schemas";
import { Input } from "@chakra-ui/react";
import moment from "moment";

interface TimeEntryProps {
  field: string;
  row: ShiftSchema;
  updateFields: Function;
}

export function TimeEntry(props: TimeEntryProps) {
  const [minutes, setMinutes] = useState(undefined);

  const onChange = (time) => {
    let calculatedTime;
    // TODO: account for possible time deletions when updating DB and whatnot
    if (time === null) {
      calculatedTime = undefined;
    } else {
      const [currentHours, parsedMinutes] = time.split(":");
      calculatedTime = Number(currentHours) * 60 + Number(parsedMinutes);
    }

    setMinutes(calculatedTime);

    //Triggering parent class to update its references here as well
    var rowToMutate = props.row.AssociateTimeEntry;
    if (rowToMutate === undefined) {
      rowToMutate = {
        StartDateTime: undefined,
        EndDateTime: undefined,
        AuthorID: "<TODO-add ID>",
      };
    }

    if (time !== null) {
      const [hours, parsedMinutes] = time.split(":");
      const calculatedTime = Number(hours) * 60 + Number(parsedMinutes);
      setMinutes(calculatedTime);
      console.log(calculatedTime);
      rowToMutate[props.field] = calculatedTime;
    } else {
      // Value is null, so mark it as undefined in our processing
      rowToMutate[props.field] = undefined;
      setMinutes(undefined);
    }
    //Triggering parent class to update its references here as well
    props.updateFields("Associate", rowToMutate);
  };

  // converts minutes from 00:00 to the current hour and minute it represents
  const minutesFrom00 = (minutes) => {
    // initialize an epoch that starts at 00:00 and add in the minutes
    // to string its hour and time
    if (minutes == undefined) {
      return undefined;
    }
    const epoch = moment().set("hour", 0).set("minute", 0);
    epoch.add(minutes, "minutes");
    return epoch.format("HH:mm");
  };

  useEffect(() => {
    if (props.row.AssociateTimeEntry !== undefined) {
      setMinutes(props.row.AssociateTimeEntry[props.field]);
    }
  }, []);

  return (
    <Input
      placeholder="Select Date and Time"
      size="md"
      type="time"
      onChange={(event) => {
        onChange(event.target.value);
      }}
      value={minutesFrom00(minutes)}
    />
  );
}
