import schedulerModule from "../../models/scheduler";
import moment from "moment";

class Scheduler {
  async fetchScheduledJobs() {
    try {
      const timeGap = 15 * 60 * 1000;
      const currentDateTime = new Date();
      const startTime = currentDateTime.getTime() - 60 * 1000;
      const checkTime = currentDateTime.getTime() + timeGap;
      const checkDateTime = new Date(checkTime);
      const schedules = await schedulerModule.find({
        status: { $in: ["pending"] },
        startTime: {
          $gt: startTime,
          $lte: checkDateTime
        }
      });
      return schedules;
    } catch (error) {
      throw error;
    }
  }

  async fetchPassedJobs() {
    try {
      const currentDateTime = new Date();
      const schedules = await schedulerModule.find({
        status: { $in: ["pending", "started"] },
        endTime: {
          $lte: currentDateTime
        }
      });
      return schedules;
    } catch (error) {
      throw error;
    }
  }

  async updateScheduledJob({ id, status }) {
    try {
      let updatedJob = await schedulerModule.findOneAndUpdate(
        { _id: id },
        { status: status }
      );
      return updatedJob;
    } catch (error) {
      throw error;
    }
  }
  async addScheduledJob(data) {
    try {
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new Scheduler();
