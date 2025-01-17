import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  ScrollView,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import { LinearGradient } from "expo-linear-gradient";
import * as Icons from "@expo/vector-icons";
import Rating from "../FooterComponent/Rating";

const { width, height } = Dimensions.get("window");
const BUTTON_WIDTH = width / 2;

const TrailerScreen = ({ route }) => {
  const [youtube, setYoutube] = useState(null);
  const [cast, setCast] = useState([]);

  let data = route.params.item;
  const YoutubeUrl = data.YoutubeKey;
  const CastUrl = `https://api.themoviedb.org/3/movie/${data.key}/credits?api_key={}&language=en-US`;
  const date = data.releaseDate.split("-");

  useEffect(() => {
    Promise.all([fetch(YoutubeUrl), fetch(CastUrl)])
      .then(function (responses) {
        // Get a JSON object from each of the responses
        return Promise.all(
          responses.map(function (response) {
            return response.json();
          })
        );
      })
      .then((data) => {
        setYoutube(data[0].results[0].key);

        setCast(data[1].cast);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <LinearGradient
      colors={["#181818", "#0F0F0F", "#0C0C0C"]}
      style={styles.container}
    >
      <ScrollView stickyHeaderIndices={[0]}>
        <YoutubePlayer height={300} videoId={youtube} />
        <View style={{ marginTop: -60 }}>
          <Icons.Feather
            name="heart"
            size={30}
            color="#fff"
            style={{ alignItems: "flex-start", marginLeft: 10, marginTop: -9 }}
          />
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Icons.Feather
            name="bookmark"
            size={30}
            color="#fff"
            style={{
              justifyContent: "flex-start",
              marginRight: 10,
              marginTop: -30,
            }}
          />
        </View>
        <View style={{ alignItems: "center", marginTop: 5 }}>
          <Text
            style={{
              color: "#fff",
              fontFamily: "BoldPops",
              fontSize: 22,
              textAlign: "center",
            }}
          >
            {data.title}
          </Text>
          <Rating rating={data.rating} />
          <Text style={{ color: "#fff", opacity: 0.7 }}>
            {date[0]} | {data.genres[0]}, {data.genres[1]}
          </Text>
        </View>
        <View
          style={{
            marginLeft: 10,
            flexWrap: "wrap",
            flex: 1,
            flexDirection: "row",
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontFamily: "SemiBold",
              fontSize: 18,
              marginTop: 5,
            }}
          >
            Overview
          </Text>
          <Text
            style={{
              color: "#fff",
              textAlign: "left",
              fontFamily: "Medium",
            }}
          >
            {data.description}
          </Text>
        </View>
        <Text
          style={{
            color: "#fff",
            fontFamily: "SemiBold",
            textAlign: "left",
            marginLeft: 10,
            marginTop: 10,
            fontSize: 18,
          }}
        >
          Cast
        </Text>

        <View style={{ flexDirection: "row" }}>
          <FlatList
            horizontal
            data={cast}
            keyExtractor={(item, index) => index.toString()}
            renderItem={(item, index) => {
              return (
                <>
                  <View
                    style={{
                      flexDirection: "column",
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: "#fff",
                        width: 100,
                        height: 160,
                        margin: 10,
                        marginRight: 20,
                        borderRadius: 10,
                      }}
                    >
                      <Image
                        style={{
                          flex: 1,
                          height: undefined,
                          width: undefined,
                          borderRadius: 10,
                        }}
                        source={{
                          uri: `https://image.tmdb.org/t/p/w500${item.item.profile_path}`,
                        }}
                      />
                    </View>
                    <Text style={styles.castName}>{item.item.name}</Text>
                  </View>
                </>
              );
            }}
          />
        </View>
        <View style={{ marginTop: 15 }}>
          <Text
            style={{
              fontFamily: "Medium",
              color: "#fff",
              opacity: 0.7,
              marginLeft: 10,
              marginBottom: -5,
              fontSize: 18,
            }}
          >
            Price
          </Text>
          <View
            style={{
              alignItems: "flex-start",
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontFamily: "SemiBold",
                fontSize: 20,
                marginLeft: 10,
              }}
            >
              ₹150
            </Text>
          </View>
          <View style={{ alignItems: "flex-end", justifyContent: "flex-end" }}>
            <TouchableOpacity
              style={{
                marginTop: -50,
              }}
            >
              <LinearGradient
                colors={["#71C9B1", "#4DC2C2", "#23BAD6"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={{
                  width: BUTTON_WIDTH,
                  height: 50,
                  borderTopLeftRadius: 20,
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    textAlign: "center",
                    fontFamily: "SemiBold",
                    fontSize: 20,
                  }}
                >
                  Buy
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default TrailerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  castName: {
    color: "#fff",
    textAlign: "center",
    marginBottom: 5,

    fontFamily: "Medium",
  },
});
