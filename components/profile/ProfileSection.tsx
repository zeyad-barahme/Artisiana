import { StyleSheet, Text, View } from "react-native";

type Props={
title:string;
children:React.ReactNode;
}

export default function ProfileSection({
title,
children
}:Props){

return(
<View style={styles.section}>
<Text style={styles.title}>
{title}
</Text>

{children}

</View>
)
}

const styles=StyleSheet.create({
section:{
backgroundColor:"#fff",
paddingHorizontal:20,
paddingVertical:18,
borderBottomWidth:1,
borderBottomColor:"#E8E0DC"
},

title:{
fontSize:22,
fontWeight:"700",
marginBottom:14
}
})