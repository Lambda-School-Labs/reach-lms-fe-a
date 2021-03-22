/*------------------ NEW  ------------------*/
export const MAIN_DASH = '/main';
export const MAIN_DASH_BY_PROGRAM = '/main-by-program/:programId';
export const ADMIN_LANDING = '/admin';
/*------------------ PROFILE ------------------*/
export const VIEW_PROFILE_PATH = '/profile';
/*------------------ PATH CREATORS ------------------*/
export const pathUtils = {
  makeMainByProgramIdPath: programId => `/main-by-program/${programId}`,
};
