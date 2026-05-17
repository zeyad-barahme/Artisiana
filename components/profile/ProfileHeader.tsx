import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  name:string;
  email:string;
  image:string | null;
  userInitial:string;
  onPressAvatar:()=>void;
  onEditProfile:()=>void;
};

export default function ProfileHeader({
  name,
  email,
  image,
  userInitial,
  onPressAvatar,
  onEditProfile,
}:Props){

return(
<View style={styles.profileBox}>
<TouchableOpacity onPress={onPressAvatar}>
{image ? (
<Image source={{uri:image}} style={styles.avatarImg}/>
):(
<View style={styles.avatar}>
<Text style={styles.avatarText}>
{userInitial}
</Text>
</View>
)}
</TouchableOpacity>

<View style={styles.profileInfo}>
<Text style={styles.name}>{name || "User"}</Text>
<Text style={styles.email}>{email}</Text>

<TouchableOpacity
style={styles.editBtn}
onPress={onEditProfile}
>
<Text style={styles.editText}>
Edit Profile
</Text>
</TouchableOpacity>
</View>

</View>
)
}

const styles=StyleSheet.create({
profileBox:{
flexDirection:"row",
alignItems:"center",
paddingHorizontal:20,
paddingVertical:22,
backgroundColor:"#fff",
marginTop:14
},

avatar:{
width:72,
height:72,
borderRadius:36,
backgroundColor:"#222",
justifyContent:"center",
alignItems:"center",
marginRight:18
},

avatarImg:{
width:72,
height:72,
borderRadius:36,
marginRight:18
},

avatarText:{
color:"#fff",
fontSize:22,
fontWeight:"800"
},

profileInfo:{
flex:1
},

name:{
fontSize:15,
fontWeight:"500"
},

email:{
fontSize:14,
marginBottom:18
},

editBtn:{
width:130,
backgroundColor:"#FFD3C6",
paddingVertical:9,
borderRadius:8,
alignItems:"center"
},

editText:{
color:"#F47C4C"
}
})