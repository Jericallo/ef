// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseUrl:"/v1/",
  url_base:"https://api.escudofiscal.alphadev.io/v1/",
  token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNhcmlvIjoiRGFuaWVsIFdpc2UgUnVpeiBWZWxhc2NvIiwiY29ycmVvIjoiZGFuaWVsQGFscGhhZGV2LmlvIiwiaWF0IjoxNjg3NjI4MDI0fQ.9sA2aTYzzmInU9jWjv1wxrphlCSQ0mpg_dcB_yoHOag",
  configFirebase:{
    apiKey: "AIzaSyDcVMlPAXULZsnuptCIjw1AkeFS7IjG5W4",
    authDomain: "escudo-test.firebaseapp.com",
    projectId: "escudo-test",
    storageBucket: "escudo-test.appspot.com",
    messagingSenderId: "140694630202",
    appId: "1:140694630202:web:299b2e06614901c53baa03",
    measurementId: "G-P1VS5JFYHQ"
  }

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
