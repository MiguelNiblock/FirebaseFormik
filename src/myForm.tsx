import React,{useEffect} from 'react';
import { Text, StyleSheet, TextInput } from 'react-native';
import { FormikProps,useFormikContext } from 'formik';
import {myFieldsType,fbapp} from './util';
import { Button } from 'react-native-paper';
import Constants from 'expo-constants';


const myForm = ({handleChange,handleBlur,handleSubmit,handleReset,isSubmitting,touched,errors,values} : FormikProps<myFieldsType>) => {

  const { setErrors } = useFormikContext();

  useEffect(()=>{
    fbapp.auth().signInAnonymously().then((cred) => {
    // console.log('Anonymous user:',cred.user)
    // throw "Can't reach firebase" // (test error handling)
  }).catch((err) => {
    console.error("Can't reach server while trying to sign in anonymously: "+err);
    setErrors({form:"Could not sign in: "+err}) // Displays an error at bottom of form
  })
  },[]);

  let emailInput: TextInput | null = null;

  return (<>
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
      disabled={isSubmitting || Object.entries(errors).some(([k,v])=>v) || Object.entries(values).some(([k,v])=>!v)}
      style={{ marginTop: 16 }}>
      Submit
    </Button>
    <Button
      onPress={handleReset}
      color="black"
      mode="outlined"
      disabled={isSubmitting || Object.entries(values).every(([k,v])=>!v)}
      style={{ marginTop: 16 }}>
      Reset
    </Button>
    {errors.form ? (
      <Text style={styles.error}>{errors.form}</Text>
    ) : null}
    </>
  )
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

export default myForm
