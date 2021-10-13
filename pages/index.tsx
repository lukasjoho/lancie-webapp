import type { NextPage } from 'next';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../lib/firebase';
import UserNameForm from '../components/UsernameForm';

const SignInButton = () => {
	const provider = new GoogleAuthProvider();

	const signInWithGoogle = async () => {
		await signInWithPopup(auth, provider).then((result) => {
			const { user } = result;
			return user;
		});
	};
	return <button onClick={signInWithGoogle}>Sign In With Google</button>;
};

const SignOutButton = () => {
	const logOut = async () => {
		await signOut(auth).then(() => {});
	};
	return <button onClick={logOut}>Log Out</button>;
};

const Home: NextPage = () => {
	const [user] = useAuthState(auth);
	return (
		<div>
			<h1>Home</h1>
			{user ? <SignOutButton /> : <SignInButton />}
			<UserNameForm />
		</div>
	);
};

export default Home;
