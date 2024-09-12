const baseURL = 'https://major.bot/api/';

const ApiPath = {
  auth: `${baseURL}auth/tg/`,
  dailyTask: `${baseURL}tasks/?is_daily=true`,
  generalTask: `${baseURL}tasks/?is_daily=false`,
  actionGeneralTask: `${baseURL}task`
};

module.exports = ApiPath;
