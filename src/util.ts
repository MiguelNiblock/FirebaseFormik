import firebase from "firebase";
import fbconfig from "../fbconfig"
import * as Yup from 'yup';
import { FormikHelpers } from 'formik';

export const fbapp = firebase.initializeApp(fbconfig);
const firestore = fbapp.firestore();
export const collection = firestore.collection('users');

export interface myFieldsType {
  name: string,
  email: string
}

export const onSubmit = async (values:myFieldsType, formikActions:FormikHelpers<myFieldsType>) => {
  // console.log('Adding values:',values);
  try {
    const user = await collection.add(values);
    //retrieve user
    // const snapshot = await user.get();
    // console.log('Saved data:',snapshot.data());
  } catch (err) {
    console.error("Could not submit form:",err);
  }
  formikActions.setSubmitting(false);
}

export const emailAsyncValidation = async (value: string | undefined, context: Yup.TestContext<Record<string, any>>
): Promise<boolean | Yup.ValidationError> => {
  // value && console.log('Validating email async. value:',value);
  return new Promise((resolve) => {
    value ?? resolve(false)
    collection.where('email','==',value).get().then(qSnap => {
      // console.log('Existing user:',qSnap?.docs[0]?.data());
      if (!qSnap.empty){
        resolve(context.createError({message:`Email ${value} already exists`}))
      }
      resolve(true)
    })
    .catch((err)=>{
      console.error("Can't reach server while checking email duplication:",err)
      resolve(context.createError({message:`Cannot validate email at this time`}))
    })
  })
}