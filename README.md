Expo web app that saves form data to a "users" Firestore collection using the Firebase sdk8 for Javascript. 
- Firebase is set up with anonymous auth.
- Firestore rules allow read/write from authenticated users, including anonymous.
- Uses formik and yup to validate required fields, including email having the correct format. "xxx@xx.xx"
- After submission, logs the data that got stored.