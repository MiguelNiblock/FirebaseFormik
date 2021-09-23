import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import {myFieldsType,onSubmit,emailAsyncValidation} from './src/util';
import MyForm from "./src/myForm";
import Constants from 'expo-constants';

const initialValues: myFieldsType = { name: '', email: '' }

const validationSchema = Yup.object({
  name: Yup.string()              
    .required('Required'),
  email: Yup.string()
    .email('Invalid Email')
    .required('Required')
    .test('checkDuplEmail', 'This email already exists', emailAsyncValidation)
})

export default () => {

  return <View style={styles.container}>
    <Text style={styles.title}>Formik/Yup to Firebase</Text>
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      { (props : FormikProps<myFieldsType> ) => (

        <MyForm {...props} />
      
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
