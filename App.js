import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, SafeAreaView, FlatList, StyleSheet, StatusBar, Button, Alert, TouchableOpacity, Image, Linking } from 'react-native';

var DATA = [];

const Item = ({ item, onPress }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{item.title}</Text>
    <Button
     onPress = {onPress}
     title = "x"
     textAlign = "center"
     />
  </View>
);

const Recipe = ({ recipe }) => {
    if(recipe.item.thumbnail == ""){
        recipe.item.thumbnail = 'https://www.diginico.com/wp-content/uploads/2020/01/fridge.jpg'
    }
  return (<View style={styles.item}>
  <Text textAlign = "center" style={styles.title}>{recipe.item.title}</Text>
  <TouchableOpacity onPress={() => {Linking.openURL(recipe.item.href)}}>
          <Image
              source = {{ uri: recipe.item.thumbnail
                }}
              style = {{ width: 100, height: 100 }}
              backgroundColor = '#fff'
              marginBottom = {30}
              marginTop = {30}
          marginLeft = {24}
          />
  </TouchableOpacity>
  </View>)
};

const Fridge2TableApp = () => {
  const [data, setData] = useState(DATA);
  const [currIngredient, setCurrIngredient] = useState("");
  const [recipes, setrecipes] = useState();
    
  const deleteItem = id => {
    console.log(id)
    console.log(data.length)
    setData(data.filter(x => {return x.id != id}))
  };
    
  const renderItem = ({ item }) => (
    <Item item={item}
     onPress={() => deleteItem(item.id)}/>
  );
    
  const renderRecipes = ( recipe ) => {
      return (<Recipe recipe={recipe}/>)
  };
    
  return (
    <View
      style={{
        flex: 1,
        marginTop: 90,
        justifyContent: "center",
        alignItems: "center"
      }}>
          
      <Text>Welcome to Fridge2Table!</Text>
          
      <Image
          source = {{ uri: 'https://www.diginico.com/wp-content/uploads/2020/01/fridge.jpg'
            }}
          style = {{ width: 100, height: 100 }}
          backgroundColor = '#fff'
          marginBottom = {30}
          marginTop = {30}
      />
      
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, width: 200 }}
        placeholder="Please type an ingredient"
        enablesReturnKeyAutomatically={true}
        onChange= {(e) => {
            console.log(e.nativeEvent.text)
            setCurrIngredient(e.nativeEvent.text)
        }}
          value = {currIngredient}
      />
      <TouchableOpacity
          borderColor = 'black'
          onPress = {
      () => setData(prevData => {
          if (currIngredient == ""){
              return prevData
          }
          var newObj = {"id": String(prevData.length + 1), "title":currIngredient}
          setCurrIngredient("")
          return [...prevData, newObj]
          
        })
        }>
         <Text style = {styles.submitButtonText}> Enter </Text>
      </TouchableOpacity>
    <SafeAreaView style={styles.container}>
        <FlatList
            data={data}
            keyExtractor={item => item.id}
            horizontal = {false}
            numColumns = {2}
            renderItem={renderItem}
            renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.header}>{title}</Text>
            )}
        />
          <FlatList
              data={recipes}
              keyExtractor={recipe => recipe.title}
              renderItem={renderRecipes}
              renderSectionHeader={({ section: { title } }) => (
              <Text style={styles.header}>{title}</Text>
              )}
          />
          <Button
          onPress = {() => {
            var returnArr = []
            data.forEach(elem => returnArr.push(elem.title))
            const body = JSON.stringify({'ingredients': returnArr})
            const payload = {method: 'post',
                            headers: { 'Content-Type': 'application/json'},
                            body: body
                            }
            fetch('http://127.0.0.1:8000/api/getRecipesFromIngredients/', payload)
            .then(response => response.json())
            .then(json => setrecipes(json))
  }}
            color = 'green'
            title = "Get Recipes"
            textAlign = "center"
          />
    </SafeAreaView>
    </View>
  )
}
          
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    marginHorizontal: 16
    },
    item: {
    backgroundColor: "#fff",
    padding: 20,
    marginVertical: 8
    },
    header: {
        fontSize: 32,
        backgroundColor: "#fff"
    },
    title: {
    width: 150,
    textAlign: "center"
  }
});

export default Fridge2TableApp;
