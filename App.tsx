import React,{useEffect} from 'react';
import { Text, View, StyleSheet, TextInput, Alert } from 'react-native';
import Constants from 'expo-constants';
import { Button } from 'react-native-paper';
import { Formik, FormikProps, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import firebase from "firebase";
import fbconfig from "./fbconfig"

const fbapp = firebase.initializeApp(fbconfig);
const firestore = fbapp.firestore();
const collection = firestore.collection('users');

interface myFieldsType {
  name: string,
  email: string
}

const initialValues: myFieldsType = { name: '', email: '' }

const validationSchema = Yup.object({
  name: Yup.string()              
    .required('Required'),
  email: Yup.string()
    .email('Invalid Email')
    .required('Required')
    .test('checkDuplEmail', 'This email already exists', async(value,context)=> {
      // value && console.log('Validating email async. value:',value);
      return new Promise((resolve, reject) => {
        collection.where('email','==',value||'').get().then(qSnap => {
          // console.log('Existing user:',qSnap?.docs[0]?.data());
          if (!qSnap.empty){
            resolve(context.createError({message:`Email ${value} already exists`}))
          }
          resolve(true)
        })
      })
    })
})

export default ()=> {

  useEffect(()=>{
  fbapp.auth().signInAnonymously().then((cred) => {
    // console.log('Anonymous user:',cred.user)
  }).catch((error) => {
    console.error(error)
  })
  },[]);

  const onSubmit = async (values:myFieldsType, formikActions:FormikHelpers<myFieldsType>) => {
    // console.log('Adding values:',values);
    try {
      const user = await collection.add(values);
      //retrieve user
      // const snapshot = await user.get();
      // console.log('Saved data:',snapshot.data());
    } catch (error) {
      console.error(error);
    }
    formikActions.setSubmitting(false);
  }

  let emailInput: TextInput | null = null;

  return <View style={styles.container}>
    <Text style={styles.title}>Formik/Yup to Firebase</Text>
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      { ({handleChange,handleBlur,handleSubmit,handleReset,isSubmitting,touched,errors,values} : FormikProps<myFieldsType> ) => ( <>
        <TextInput
          onChangeText={handleChange('name')}
          onBlur={handleBlur('name')}
          value={values.name}
          autoFocus
          placeholder="Your Name"
          style={styles.input}
          onSubmitEditing={() => {
            emailInput?.focus()
          }}
        />
        {touched.name && errors.name ? (
          <Text style={styles.error}>{errors.name}</Text>
        ) : null}
        <TextInput
          onChangeText={handleChange('email')}
          onBlur={handleBlur('email')}
          value={values.email}
          placeholder="Email Address"
          style={styles.input}
          ref={el => emailInput = el}
        />
        {touched.email && errors.email ? (
          <Text style={styles.error}>{errors.email}</Text>
        ) : null}
        <Button
          onPress={handleSubmit}
          color="black"
          mode="contained"
          loading={isSubmitting}
          disabled={isSubmitting}
          style={{ marginTop: 16 }}>
          Submit
        </Button>
        <Button
          onPress={handleReset}
          color="black"
          mode="outlined"
          disabled={isSubmitting}
          style={{ marginTop: 16 }}>
          Reset
        </Button></>
      )}
    </Formik>
  </View>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight + 50,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  title: {
    margin: 24,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  error: {
    margin: 8,
    fontSize: 14,
    color: 'red',
    fontWeight: 'bold',
  },
  input: {
    height: 50,
    paddingHorizontal: 8,
    width: '100%',
    borderColor: '#ddd',
    borderWidth: 1,
    backgroundColor: '#fff',
  },
});
