import { Schedule } from "../../model/schedule";
import { Document } from "mongoose";

const _serializeSingleSchedule = (schedule: Schedule & Document): Schedule => {
  return {
    id: schedule.id,
    doctorID: schedule.doctorID,
    dayOfWeek: schedule.dayOfWeek,
    startHour: schedule.startHour,
    startMinute: schedule.startMinute,
    endHour: schedule.endHour,
    endMinute: schedule.endMinute,
    limit: schedule.limit,
    status: schedule.status
  };
};

export interface ScheduleRepository {
  findByDoctorID(doctorID: string): Promise<Schedule[]>;
  /** find doctor's schedule by date */
  findDoctorScheduleByDay(
    doctorID: string,
    dayOfWeek: number
  ): Promise<Schedule[]>;
  /** create new schedule. return schedule ID */
  create(schedule: Schedule): Promise<string>;
  /** create many schedules */
  createMany(schedules: Schedule[]): Promise<Schedule[]>;
}

export default async function makeScheduleRepository(
  mongoose: typeof import("mongoose")
): Promise<ScheduleRepository> {
  const scheduleSchema = new mongoose.Schema({
    doctorID: { type: mongoose.SchemaTypes.ObjectId, ref: "doctor" },
    dayOfWeek: { type: Number, min: 1, max: 7 },
    startHour: { type: Number, min: 0, max: 23 },
    startMinute: { type: Number, min: 0, max: 59 },
    endHour: { type: Number, min: 0, max: 23 },
    endMinute: { type: Number, min: 0, max: 59 },
    limit: { type: Number, min: 1 },
    status: { type: String, enum: ["open", "close", "holiday"] }
  });

  scheduleSchema.set("autoIndex", false);

  const ScheduleModel = mongoose.model<Schedule & Document>(
    "User",
    scheduleSchema
  );
  if (process.env.NODE_ENV !== "production") {
    // sort index
    await ScheduleModel.ensureIndexes({ dayOfWeek: 1 });
  }

  return {
    findByDoctorID: async doctorID => {
      const schedules = await ScheduleModel.find({ doctorID });
      return schedules.map(_serializeSingleSchedule);
    },

    findDoctorScheduleByDay: async (doctorID, dayOfWeek) => {
      const schedules = await ScheduleModel.find({ doctorID, dayOfWeek });

      return schedules.map(_serializeSingleSchedule);
    },

    create: async schedule => {
      const res = await ScheduleModel.create(schedule);
      return res.id;
    },

    createMany: async schedules => {
      const res = await ScheduleModel.insertMany(schedules);
      return res.map(_serializeSingleSchedule);
    }
  };
}
