import React, { use } from 'react';
import { Text, View, Image, StyleSheet, Touchable, TouchableOpacity } from 'react-native';
import Colors from '../../constant/Colors';
import {Router, useRouter} from "expo-router"

export default function LoginScreen() {

    const router= useRouter();
    return (
      <View>
        <View style={{
            display:"flex",
            alignItems:"center",
            marginTop:40
        }}>
            <Image 
                source={require('../../assets/images/login.png')} 
                style={styles.image}
            />
        </View>

            <View style={{
                padding:25,
                backgroundColor:Colors.PRIMARY,
                height:410
            }}> 
                <Text style={{
                    fontSize:30,
                    fontWeight:"bold",
                    color:"white",
                    textAlign:"center"
                }}>
                   Stay on Schedule, Stay Clean
                </Text>
                <Text style={{
                    color:"white",
                    textAlign:"center",
                    fontSize:20,
                    marginTop:20
                }}>
                   Track Collections • Optimize Routes • Build Cleaner Communities
                </Text>


                <TouchableOpacity style={styles?.button}
                onPress={()=>router.push("login/signIn")}
                >
                    <Text style={{
                        textAlign:"center",
                        fontSize:16,
                        color:Colors.PRIMARY,
                    }}>Continue</Text>
                </TouchableOpacity>
                    <Text style={{
                        textAlign:"center",
                        color:"white",
                        marginTop:4,
                        fontSize:11
                    }}
                    >Note: By Clicking Continue button, you will agree to our terms and conditions</Text>

            </View>

      </View>
    );
}

const styles = StyleSheet.create({
    image: {
        width: 210,
        height: 450,
        borderRadius: 23
    },
    button:{
    padding:15,
    backgroundColor:"white",
    borderRadius:99,
    margin:15
}
})

//Ameloiration for this code

// import React, { use } from 'react';
// import { Text, View, Image, StyleSheet, Touchable, TouchableOpacity } from 'react-native';
// import Colors from '../../constant/Colors';
// import {Router, useRouter} from "expo-router"

// export default function LoginScreen() {

//     const router= useRouter();
//     return (
//       <View>
//         <View style={{
//             display:"flex",
//             alignItems:"center",
//             marginTop:40
//         }}>
//             <Image 
//                 source={require('../../assets/images/login.png')} 
//                 style={styles.image}
//             />
//         </View>

//             <View style={{
//                 padding:25,
//                 backgroundColor:Colors.PRIMARY,
//                 height:410,
//                 marginTop:110,
//                 borderTopLeftRadius:50,
//                 borderTopRightRadius:50,
//                 textAlign:"center"
//             }}> 
//                 <Text style={{
//                     fontSize:30,
//                     fontWeight:"bold",
//                     color:"white",
//                     textAlign:"center"
//                 }}>
//                    Stay on Schedule, Stay Clean
//                 </Text>
//                 <Text style={{
//                     color:"white",
//                     textAlign:"center",
//                     fontSize:20,
//                     marginTop:30
//                 }}>
//                    Track Collections • Optimize Routes • Build Cleaner Communities
//                 </Text>


//                 <TouchableOpacity style={styles?.button}
//                 onPress={()=>router.push("login/signIn")}
//                 >
//                     <Text style={{
//                         textAlign:"center",
//                         fontSize:16,
//                         color:Colors.PRIMARY,
//                         fontWeight:"bold",
                        
//                     }}>Continue</Text>
//                 </TouchableOpacity>
//                     <Text style={{
//                         textAlign:"center",
//                         color:"white",
//                         marginTop:20
//                     }}
//                     >Note: By Clicking Continue button, you will agree to our terms and conditions</Text>

//             </View>

//       </View>
//     );
// }

// const styles = StyleSheet.create({
//     image: {
//         width: 250,
//         height: 250,
//         borderRadius: 23
//     },
//     button:{
//     padding:15,
//     backgroundColor:"white",
    
//     borderRadius:99,
//     margin:15
// }
// })

//French Version

// //import React from 'react';
// import { Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native';
// import Colors from '../../constant/Colors';
// import { useRouter } from "expo-router";

// export default function LoginScreen() {
//     const router = useRouter();
//     return (
//       <View>
//         <View style={{
//             display:"flex",
//             alignItems:"center",
//             marginTop:40
//         }}>
//             <Image 
//                 source={require('../../assets/images/login.png')} 
//                 style={styles.image}
//             />
//         </View>

//             <View style={{
//                 padding:25,
//                 backgroundColor:Colors.PRIMARY,
//                 height:410
//             }}> 
//                 <Text style={{
//                     fontSize:30,
//                     fontWeight:"bold",
//                     color:"white",
//                     textAlign:"center"
//                 }}>
//                    Respectez les Horaires, Maintenez la Propreté
//                 </Text>
//                 <Text style={{
//                     color:"white",
//                     textAlign:"center",
//                     fontSize:20,
//                     marginTop:20
//                 }}>
//                    Suivez les Collectes • Optimisez les Itinéraires • Bâtissez des Communautés Plus Propres
//                 </Text>

//                 <TouchableOpacity style={styles?.button}
//                 onPress={()=>router.push("login/signIn")}
//                 >
//                     <Text style={{
//                         textAlign:"center",
//                         fontSize:16,
//                         color:Colors.PRIMARY,
//                     }}>Continuer</Text>
//                 </TouchableOpacity>
//                     <Text style={{
//                         textAlign:"center",
//                         color:"white",
//                         marginTop:4
//                     }}
//                     >Remarque : En cliquant sur le bouton Continuer, vous acceptez nos conditions générales</Text>

//             </View>
//       </View>
//     );
// }

// const styles = StyleSheet.create({
//     image: {
//         width: 210,
//         height: 450,
//         borderRadius: 23
//     },
//     button:{
//         padding:15,
//         backgroundColor:"white",
//         borderRadius:99,
//         margin:15
//     }
// })