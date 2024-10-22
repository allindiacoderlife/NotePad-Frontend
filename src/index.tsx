import { Canvas } from "@shopify/react-native-skia";
import { useRef, useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Button,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import axios from "axios";
import ViewShot from "react-native-view-shot";
import Footer from "./Footer";
import Header from "./Header";
import Shape from "./components/Shape";
import useCanvas from "./hooks/useCanvas";
import useToolbar from "./hooks/useToolbar";
import ThemeProvider from "./theme/ThemeProvider";
import LoadingDots from "react-native-loading-dots";

const App = () => {
  const viewShotRef = useRef(null);
  const [imageUri, setImageUri] = useState(null); // For displaying the uploaded image
  const [mathProblem, setMathProblem] = useState(null); // Math problem extracted from image
  const [inputText, setInputText] = useState("");
  const [textMode, setTextMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const { tool, setTool, ...headerTools } = useToolbar();
  const { paintStyle } = headerTools;
  const { shapes, touchHandler, currentShape, onClear, undo, redo } = useCanvas(
    {
      paintStyle,
      tool,
    }
  );

  const saveCanvas = async () => {
    try {
      setLoading(true);
      const uri = await viewShotRef.current.capture();
      console.log("Image saved to:", uri);

      const formData = new FormData();
      const imageFile = {
        uri: uri,
        type: "image/png",
        name: "canvas_image.png",
      };
      formData.append("image", imageFile as any);

      const response = await axios.post(
        "http://192.168.83.252:3000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      onClear();
      setInputText("");
      setTextMode(false);
      setImageUri(response.data.imageUrl);
      setMathProblem(response.data.mathProblem);
      setLoading(false);
      console.log("Upload success:", response.data);
    } catch (error) {
      console.error("Error saving or uploading image:", error);
    }
  };

  const cleanCanvas = () => {
    setImageUri(null);
    setMathProblem(null);
    setTextMode(false);
    setInputText("");
    setLoading(false);
  };

  const textShow = () => {
    setTextMode(!textMode);
  };

  return (
    <ThemeProvider>
      <View style={styles.container}>
        <Header {...headerTools} />
        <ViewShot
          ref={viewShotRef}
          options={{ format: "png", quality: 1.0 }}
          style={styles.container}
        >
          {loading && (
            <View style={styles.dotsWrapper}>
              <LoadingDots />
            </View>
          )}
          {textMode && (
            <TextInput
              placeholder="Enter math problem"
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
            />
          )}
          <Canvas style={styles.canvas} onTouch={touchHandler}>
            {shapes.map((shape, index) => (
              <Shape key={index} {...shape} />
            ))}
            {currentShape && <Shape {...currentShape} />}
          </Canvas>
        </ViewShot>
        {imageUri && (
          <View>
            <Text style={styles.ans}>Answer: {mathProblem}</Text>
          </View>
        )}
        <Footer
          onClear={() => {
            onClear();
            cleanCanvas();
          }}
          tool={tool}
          setTool={setTool}
          undo={undo}
          redo={redo}
          save={saveCanvas}
          textmod={textShow}
        />
      </View>
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  canvas: {
    flex: 5,
  },
  input: {
    height: 50,
    fontSize: 30,
    margin: 12,
    padding: 10,
    color: "red",
  },
  ans: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
  },
  dotsWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
});

export default App;
