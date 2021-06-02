import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View,TouchableOpacity, Dimensions, Button } from 'react-native';
import * as FileSystem from 'expo-file-system';

import { Camera } from 'expo-camera';

import { cameraWithTensors, decodeJpeg } from '@tensorflow/tfjs-react-native'; // React native Tensorflow js
import * as tf from '@tensorflow/tfjs' //Tensorflow js 
import * as mobilenet from '@tensorflow-models/mobilenet' // Importing our ML model

const TensorCamera = cameraWithTensors(Camera);

export default function App() {

  let camera = null;
  const [model, setModel] = useState(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [captured, setCaptured] = useState(false)
  const [prediction, setPrediction] = useState("");
  const [hasPersmission, setHasPermission] = useState(false);

  let frameID = null;
  let tensorImage =  null;

  const getCameraPersmission = async () => {
    const { status } = await Camera.requestPermissionsAsync();
    console.log(`permissions status: ${status}`);
    setHasPermission(status === 'granted');
  }

  useEffect(() => {
    tf.ready();
    mobilenet.load({version: 2, alpha: 0.5})
      .then(m => {
        setModel(m);
        setModelLoaded(true);
      })
      getCameraPersmission();
  }, [])



  const handleCameraStream = (image) => {
    const loop = async () => {
      const nextImageTensor = image.next().value
      tensorImage = nextImageTensor;
      requestAnimationFrame(loop);
    }
    if(!captured)loop();
  }

  const getPredictions = async () => {
    let predictions = await model.classify(tensorImage);
    setPrediction(predictions[0].className + "--"+predictions[1].className+ "--"+predictions[2].className);
    setCaptured(true);
    console.log(predictions);
  }

  if(modelLoaded && !captured){
    return (
      <View style={{flex: 1, backgroundColor: "green", alignItems: 'center', justifyContent: 'center'}}>
          <TensorCamera
          // Standard Camera props
              style={{
                width: 700/2,
                height: 800/2,
                zIndex: 1,
                borderWidth: 0,
                borderRadius: 0,
              }}
              type={Camera.Constants.Type.back}
              // Tensor related props
              cameraTextureHeight={1920}
              cameraTextureWidth={1080}
              resizeHeight={200}
              resizeWidth={152}
              resizeDepth={3}
              onReady={handleCameraStream}
              autorender={true}
          />
          <Button title="Click" onPress={() => getPredictions()} />
      </View>
    )
  }else{
    return <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Loading</Text>
      <Text>{prediction}</Text>
    </View>
  }
  

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
});