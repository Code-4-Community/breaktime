import { z } from "zod";
import { CellStatus, CellType, CommentType } from "./CellTypes";

/**
 * A collection of various schemas used in creating a shift entry in the timesheet. These schemas are internal models,
 * used for logic in the backend and frontend.
 */

const optionalNumber = z.union([z.undefined(), z.number()]);
const optionalString = z.union([z.undefined(), z.string()]);

export const TimeRowEntry = z.union([z.undefined(), z.object({
    Start: optionalNumber, End: optionalNumber, AuthorID: optionalString
})]); 
export type TimeRowEntry = z.infer<typeof TimeRowEntry>

export const CommentSchema = z.object({
  UUID: z.string(), 
  AuthorID:z.string(), 
  Type: z.nativeEnum(CellType),
  Timestamp: z.number(), 
  Content: z.string(), 
  State: z.nativeEnum(CellStatus),
}); 

export type CommentSchema = z.infer<typeof CommentSchema>

export const ReportSchema = z.object({
  AuthorID:z.string(), 
  Timestamp: z.number(),
  Type: z.nativeEnum(CommentType), 
  CorrectTime: z.number(),
  Content: z.nativeEnum(ReportOptions), 
  Notified: z.string(),
  Explanation: z.string(),
  State: z.nativeEnum(CellStatus), 
}); 

export type ReportSchema = z.infer<typeof ReportSchema>

export const RowSchema = z.object({
  Type: z.nativeEnum(CellType), 
  UUID: z.string(), 
  Date: z.number(), 
  Associate: TimeRowEntry, 
  Supervisor: TimeRowEntry, 
  Admin: TimeRowEntry, 
  Comment: z.union([z.undefined(), z.array(CommentSchema || ReportSchema)])
}); 
export type RowSchema = z.infer<typeof RowSchema>