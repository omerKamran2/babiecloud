import { View, Text } from 'react-native';
import React from 'react';
import { FIREBASE_AUTH } from '../../FirebaseConfig';

const Login = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const auth = FIREBASE_AUTH;
    return (
        <View>
            <Text></Text>
        </View>
    );
};

export default Login;
