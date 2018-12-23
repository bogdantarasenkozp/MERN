module.exports = (args) => {
  const { schedule, uuid, axios } = args.package;

  class Schedule {
    constructor() {
      this.defaultPattern = '* */1 * * * *';
    }

    createJob(args = {}) {
      const jobId = uuid.v4();
      let { pattern, callback } = args;

      pattern = pattern || this.defaultPattern;

      if (!(typeof callback === 'function')) {
        throw new Error('Callback function is required');
      }

      schedule.scheduleJob(jobId, pattern, callback);

      return jobId;
    }

    cancelJob(jobId) {
      return schedule.cancelJob(jobId);
    }

    createJobRequest(url) {
      const callback = function(fireDate) {
        return axios(url)
          .then(response => {
            console.log('click success', response.data);
            this.cancel();
          })
          .catch(error => {
            console.warn('click error', error);
          });
      };

      return this.createJob({ callback });
    }
  }

  return new Schedule();
}
