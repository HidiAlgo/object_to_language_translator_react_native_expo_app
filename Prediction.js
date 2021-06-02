import { fetch, decodeJpeg } from '@tensorflow/tfjs-react-native'; // React native Tensorflow js
import * as tf from '@tensorflow/tfjs' //Tensorflow js 
import * as mobilenet from '@tensorflow-models/mobilenet' // Importing our ML model

function Prediction(){
    // We should be able to check whether Tensorflow is ready or not for that purpose, this state variable can be used.
  const [isReady, setReady] = useState(false);

  // To load the model it requires time, so it is better if we can keep track on it and indicate when the model has been loaded
  // For that purpose this state variable can be used
  const [modelLoaded, setModelLoaded] = useState(false);

  // This is our model when it is loaded
  const [model, setModel] = useState(null);

//   const imageToTensor = (rawImageData) => {
//     const TO_UINT8ARRAY = true
//     const { width, height, data } = jpeg.decode(rawImageData, TO_UINT8ARRAY)
//     // Drop the alpha channel info for mobilenet
//     const buffer = new Uint8Array(width * height * 3)
//     let offset = 0 // offset into original data
//     for (let i = 0; i < buffer.length; i += 3) {
//       buffer[i] = data[offset]
//       buffer[i + 1] = data[offset + 1]
//       buffer[i + 2] = data[offset + 2]

//       offset += 4
//     }

//     return tf.tensor3d(buffer, [height, width, 3])
//   }

  const checkReady = async () => {
    await tf.ready(); // let's make it ready for the journey
    setReady(true); // set the state variable to true, to say that it is ready

    setModel(await mobilenet.load()); // Let's load the model and set it to our state variable
    setModelLoaded(true); // Indication that the model has been loaded.

    imageUri = 'https://cdn.britannica.com/60/8160-050-08CCEABC/German-shepherd.jpg'

    const response = await fetch(imageUri, {}, { isBinary: true });
    const imageDataArrayBuffer = await response.arrayBuffer();
    const imageData = new Uint8Array(imageDataArrayBuffer);

// Decode image data to a tensor
    const imageTensor = decodeJpeg(imageData);

    console.log("HELLOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOo");
    const predictions = await model.classify(imageTensor);
    console.log(predictions)
  }

  useEffect(() => {
    checkReady() 
    // Since, the ready function returns a promise, the function signature should be async, but 
    // useEffect function can not be async, so we seperate the logic.
  }, [])

}