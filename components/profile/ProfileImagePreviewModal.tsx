import {
Modal,
View,
Image,
Text,
TouchableOpacity,
StyleSheet
} from "react-native";

type Props={
visible:boolean;
image:string|null;
name:string;
onClose:()=>void;
onChange:()=>void;
onDelete:()=>void;
};

export default function ProfileImagePreviewModal({
visible,
image,
name,
onClose,
onChange,
onDelete
}:Props){

return(

<Modal
visible={visible}
transparent
animationType="fade"
>

<View style={styles.overlay}>

{image && (
<Image
source={{uri:image}}
style={styles.image}
/>
)}

<Text style={styles.name}>
{name}
</Text>

<TouchableOpacity
style={styles.btn}
onPress={onChange}
>
<Text>Change Photo</Text>
</TouchableOpacity>

<TouchableOpacity
style={styles.btn}
onPress={onDelete}
>
<Text>Delete Photo</Text>
</TouchableOpacity>

<TouchableOpacity
style={styles.btn}
onPress={onClose}
>
<Text>Close</Text>
</TouchableOpacity>

</View>

</Modal>

)
}

const styles=StyleSheet.create({

overlay:{
flex:1,
justifyContent:"center",
alignItems:"center",
backgroundColor:"rgba(0,0,0,.8)"
},

image:{
width:250,
height:250,
borderRadius:125
},

name:{
color:"#fff",
fontSize:22,
marginTop:15
},

btn:{
backgroundColor:"#fff",
padding:10,
marginTop:10,
width:200,
alignItems:"center"
}

})