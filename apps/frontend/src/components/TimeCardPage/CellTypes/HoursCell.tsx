import React, { useEffect, useState } from "react";
import { ShiftSchema } from "@org/schemas";
import { Box } from "@chakra-ui/react";

interface DurationProps {
  row: ShiftSchema;
}

export function Duration(props: DurationProps) {
  const row = props.row;
  const [duration, setDuration] = useState("");

  useEffect(() => {
    if (
      row.AssociateTimeEntry !== undefined &&
      row.AssociateTimeEntry.StartDateTime !== undefined &&
      row.AssociateTimeEntry.EndDateTime !== undefined
    ) {
      setDuration(
        String(
          (
            (row.AssociateTimeEntry.EndDateTime -
              row.AssociateTimeEntry.StartDateTime) /
            60
          ).toFixed(2)
        )
      );
    }
  }, [
    row.AssociateTimeEntry?.StartDateTime,
    row.AssociateTimeEntry?.EndDateTime,
  ]);
  return <Box>{duration}</Box>;
}
