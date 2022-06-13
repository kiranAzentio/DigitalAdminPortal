// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  //  apiUrl: 'http://10.1.56.153:8100/digital-server-admin/v1.0.0/api'      //digital-serve-admin.war for server deployment on Jboss server

//  apiUrl: 'http://10.1.56.179:8091/digital-server-admin/v1.0.0/api' // IASTLE SERVER
//  apiUrl: 'https://10.1.56.179:9443/digital-server-admin/v1.0.0/api' //amit sir 
 
 apiUrl: 'http://localhost:8080/v1.0.0/api' // IASTLE SERVER


// apiUrl: 'http://localhost:8080/adminPortalServer/v1.0.0/api', //admin portal server

// apiUrl: 'http://localhost:8085/adminPortalServer/v1.0.0/api', //admin portal server


};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
